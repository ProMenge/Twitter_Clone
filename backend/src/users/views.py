from django.shortcuts import get_object_or_404
from django.db.models import F # Importar F para atomicidade

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Follow
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    UserUpdateSerializer,
    SuggestedUserSerializer,
)

# === Função utilitária ===

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }

# === Autenticação ===

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True): # Usar raise_exception=True para DRF lidar com 400
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            user_data = UserSerializer(user).data
            return Response({
                'token': tokens['access'],
                'user': user_data,
            }, status=status.HTTP_201_CREATED)
        # O return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) não é mais necessário com raise_exception=True

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request}) # Passar request para o serializer
        serializer.is_valid(raise_exception=True) # A lógica de autenticação já está no serializer

        user = serializer.validated_data['user'] # Acessa o user que o serializer validou

        tokens = get_tokens_for_user(user)
        user_data = UserSerializer(user).data
        return Response({
            'token': tokens['access'],
            'user': user_data,
        })

# === Perfil do usuário ===

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class UserDetailView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username' # O campo que será usado na URL para buscar o objeto

    def get_object(self): # Sobrescreve para usar 'username' em vez de PK
        queryset = self.filter_queryset(self.get_queryset())
        filter_kwargs = {self.lookup_field: self.kwargs[self.lookup_field]}
        obj = get_object_or_404(queryset, **filter_kwargs)
        self.check_object_permissions(self.request, obj)
        return obj

    def get_serializer_context(self): # Passa o request para o serializer (para is_followed_by_viewer)
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    # O método 'get' que você tinha está bom, mas pode ser simplificado por usar get_object()
    # def get(self, request, username):
    #     user = self.get_object() # Já busca pelo username
    #     serializer = self.get_serializer(user)
    #     return Response(serializer.data)


class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, id):
        user_to_update = get_object_or_404(User, id=id) # Obter o usuário pelo ID da URL

        if request.user != user_to_update: # Comparar objetos User, não apenas IDs
            return Response({'detail': 'Você não tem permissão para editar este perfil.'}, status=status.HTTP_403_FORBIDDEN)

        # Usar user_to_update em vez de request.user se request.user não for o objeto correto
        # (request.user é o usuário autenticado, user_to_update é o usuário do ID da URL)
        serializer = UserUpdateSerializer(user_to_update, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True): # Usar raise_exception=True
            serializer.save()
            return Response(UserSerializer(user_to_update).data) # Retornar o UserSerializer completo após update
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) não mais necessário

# === Seguir/Deixar de seguir/Sugestões ===

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user(request, id):
    target_user = get_object_or_404(User, id=id)
    if target_user == request.user:
        return Response({'detail': 'Você não pode se seguir.'}, status=status.HTTP_400_BAD_REQUEST)

    follow, created = Follow.objects.get_or_create(follower=request.user, following=target_user)
    
    if created:
        # Atualizar contadores atomicamente
        User.objects.filter(id=request.user.id).update(following_count=F('following_count') + 1)
        User.objects.filter(id=target_user.id).update(followers_count=F('followers_count') + 1)
        return Response({'status': 'followed'}, status=status.HTTP_200_OK)
    else:
        return Response({'detail': 'Você já segue este usuário.'}, status=status.HTTP_409_CONFLICT) # 409 Conflict se já segue

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unfollow_user(request, id):
    target_user = get_object_or_404(User, id=id)
    
    # Tentativa de deletar a relação de Follow
    deleted_count, _ = Follow.objects.filter(follower=request.user, following=target_user).delete()
    
    if deleted_count > 0:
        # Atualizar contadores atomicamente
        User.objects.filter(id=request.user.id).update(following_count=F('following_count') - 1)
        User.objects.filter(id=target_user.id).update(followers_count=F('followers_count') - 1)
        return Response({'status': 'unfollowed'}, status=status.HTTP_200_OK)
    else:
        return Response({'detail': 'Você não segue este usuário.'}, status=status.HTTP_404_NOT_FOUND) # Se não encontrou a relação para deletar

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def who_to_follow(request):
    user = request.user

    following_ids = Follow.objects.filter(follower=user).values_list('following_id', flat=True)

    # Exclui usuários já seguidos e o próprio usuário logado
    suggestions = User.objects.exclude(id__in=following_ids).exclude(id=user.id).order_by('?')[:5] # order_by('?') para ordem aleatória (pode ser lento em DBs grandes)
    
    serializer = SuggestedUserSerializer(suggestions, many=True, context={'request': request})
    return Response(serializer.data)