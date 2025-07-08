from django.shortcuts import get_object_or_404

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
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            user_data = UserSerializer(user).data
            return Response({
                'token': tokens['access'],
                'user': user_data,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        identifier = serializer.validated_data['username_or_email']
        password = serializer.validated_data['password']

        user = User.objects.filter(email=identifier).first() or User.objects.filter(username=identifier).first()
        if user is None or not user.check_password(password):
            return Response({'detail': 'Credenciais inválidas.'}, status=status.HTTP_401_UNAUTHORIZED)

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
    lookup_field = 'username'

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        serializer = self.get_serializer(user)
        return Response(serializer.data)

class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, id):
        if request.user.id != id:
            return Response({'detail': 'Acesso não autorizado.'}, status=403)

        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

# === Seguir/Deixar de seguir/Sugestões ===

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user(request, id):
    target = get_object_or_404(User, id=id)
    if target == request.user:
        return Response({'detail': 'Você não pode se seguir.'}, status=400)

    Follow.objects.get_or_create(follower=request.user, following=target)
    return Response({'status': 'followed'}, status=200)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unfollow_user(request, id):
    target = get_object_or_404(User, id=id)
    Follow.objects.filter(follower=request.user, following=target).delete()
    return Response({'status': 'unfollowed'}, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def who_to_follow(request):
    user = request.user

    following_ids = Follow.objects.filter(follower=user).values_list('following_id', flat=True)

    suggestions = User.objects.exclude(id__in=following_ids).exclude(id=user.id)[:5]
    
    serializer = SuggestedUserSerializer(suggestions, many=True, context={'request': request})
    return Response(serializer.data)
