# backend/src/posts/views.py
from django.shortcuts import get_object_or_404
from django.db.models import F

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied # Importar PermissionDenied

from users.models import Follow
from .models import Post, Like
from .serializers import PostSerializer, PostCreateSerializer

class PostListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly] 

    def get_queryset(self):
        return Post.objects.all().order_by('-created_at')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateSerializer
        return PostSerializer

    def perform_create(self, serializer):
        post = serializer.save(user=self.request.user)
        # Nenhuma mudança aqui, o problema é na serialização da *resposta*

    def create(self, request, *args, **kwargs):
        # CORREÇÃO DA FALHA 1: Sobrescrever o método create para usar PostSerializer na resposta
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer) # Salva o post
        
        # Agora, serializa o objeto post recém-criado usando PostSerializer completo
        # para a resposta HTTP 201 Created
        headers = self.get_success_headers(serializer.data)
        response_serializer = PostSerializer(serializer.instance, context={'request': request}) # Usa PostSerializer para a resposta
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_serializer_context(self):
        return {'request': self.request}

class FollowingPostListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer

    def get_queryset(self):
        user = self.request.user
        followed_users_ids = Follow.objects.filter(follower=user).values_list('following__id', flat=True)
        return Post.objects.filter(user__id__in=followed_users_ids).order_by('-created_at')

    def get_serializer_context(self):
        return {'request': self.request}

class PostDetailView(generics.RetrieveDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        # CORREÇÃO DA FALHA 3: Levantar PermissionDenied se o usuário não for o dono
        if instance.user != self.request.user:
            raise PermissionDenied("Você não tem permissão para deletar esta postagem.") # Levanta a exceção
        instance.delete()
        # DRF vai retornar 204 No Content automaticamente após a deleção
        # Não precisa de return Response aqui se a deleção for bem-sucedida
        # return Response(status=status.HTTP_204_NO_CONTENT) # Não é necessário aqui se não houver lógica adicional

    def get_serializer_context(self):
        return {'request': self.request}

class LikePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        user = request.user

        like, created = Like.objects.get_or_create(user=user, post=post)

        if created:
            post.likes_count = F('likes_count') + 1
            post.save(update_fields=['likes_count'])
            return Response({'status': 'liked'}, status=status.HTTP_200_OK)
        else:
            like.delete()
            post.likes_count = F('likes_count') - 1
            post.save(update_fields=['likes_count'])
            return Response({'status': 'unliked'}, status=status.HTTP_200_OK)