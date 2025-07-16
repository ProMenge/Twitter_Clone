# backend/src/users/views.py
from django.shortcuts import get_object_or_404
from django.db.models import F

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView # Manter se ainda usado
from rest_framework.decorators import api_view, permission_classes # Manter se ainda usado
from rest_framework.permissions import IsAuthenticated # Usado na PasswordChangeView

from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Follow
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    UserUpdateSerializer,
    SuggestedUserSerializer,
    PasswordChangeSerializer, 
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
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            user_data = UserSerializer(user).data
            return Response({
                'access_token': tokens['access'],
                'refresh_token': tokens['refresh'],
                'user': user_data,
            }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']

        tokens = get_tokens_for_user(user)
        user_data = UserSerializer(user).data
        return Response({
            'access_token': tokens['access'],
            'refresh_token': tokens['refresh'],
            'user': user_data,
        })

# === Perfil do usuário ===

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request}) # Passar request para o serializer
        return Response(serializer.data)

class UserDetailView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        filter_kwargs = {self.lookup_field: self.kwargs[self.lookup_field]}
        obj = get_object_or_404(queryset, **filter_kwargs)
        self.check_object_permissions(self.request, obj)
        return obj

    def get_serializer_context(self): # Garantir que o contexto da request é passado
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, id):
        user_to_update = get_object_or_404(User, id=id)

        if request.user != user_to_update:
            return Response({'detail': 'Você não tem permissão para editar este perfil.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = UserUpdateSerializer(user_to_update, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            # Retornar o UserSerializer completo para o frontend ter os dados atualizados, incluindo is_followed_by_viewer
            return Response(UserSerializer(user_to_update, context={'request': request}).data)


# NOVO: View para Alteração de Senha
class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated] # Exige autenticação

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request}) # Passar request para o serializer
        serializer.is_valid(raise_exception=True) 

        user = request.user 

        user.set_password(serializer.validated_data['new_password'])
        user.save()
    
        return Response({'message': 'Senha alterada com sucesso.'}, status=status.HTTP_200_OK)

# === Seguir/Deixar de seguir/Sugestões ===

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user(request, id):
    target_user = get_object_or_404(User, id=id)
    if target_user == request.user:
        return Response({'detail': 'Você não pode se seguir.'}, status=status.HTTP_400_BAD_REQUEST)

    follow, created = Follow.objects.get_or_create(follower=request.user, following=target_user)
    
    if created:
        User.objects.filter(id=request.user.id).update(following_count=F('following_count') + 1)
        User.objects.filter(id=target_user.id).update(followers_count=F('followers_count') + 1)
        return Response({'status': 'followed'}, status=status.HTTP_200_OK)
    else:
        return Response({'detail': 'Você já segue este usuário.'}, status=status.HTTP_409_CONFLICT)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unfollow_user(request, id):
    target_user = get_object_or_404(User, id=id)
    
    deleted_count, _ = Follow.objects.filter(follower=request.user, following=target_user).delete()
    
    if deleted_count > 0:
        User.objects.filter(id=request.user.id).update(following_count=F('following_count') - 1)
        User.objects.filter(id=target_user.id).update(followers_count=F('followers_count') - 1)
        return Response({'status': 'unfollowed'}, status=status.HTTP_200_OK)
    else:
        return Response({'detail': 'Você não segue este usuário.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def who_to_follow(request):
    user = request.user

    following_ids = Follow.objects.filter(follower=user).values_list('following_id', flat=True)

    suggestions = User.objects.exclude(id__in=following_ids).exclude(id=user.id).order_by('?')[:5]
    
    serializer = SuggestedUserSerializer(suggestions, many=True, context={'request': request})
    return Response(serializer.data)