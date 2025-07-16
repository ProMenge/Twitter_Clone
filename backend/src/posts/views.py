# posts/views.py

from django.db.models import F
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from users.models import Follow, User 
from .models import Like, Post, Comment  # Adicionado Comment
from .serializers import (
    CommentCreateSerializer,
    CommentSerializer,
    LikeSerializer,
    PostCreateSerializer,
    PostSerializer,
)


class PostListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly] 

    def get_queryset(self):
        return Post.objects.all().order_by('-created_at')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateSerializer
        return PostSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        response_serializer = PostSerializer(serializer.instance, context={'request': request})
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
        if instance.user != self.request.user:
            raise PermissionDenied("Você não tem permissão para deletar esta postagem.")
        instance.delete()

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

# --- Views de Comentários Corrigidas ---
class CommentListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        post = get_object_or_404(Post, id=post_id)
        return Comment.objects.filter(post=post)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CommentCreateSerializer
        return CommentSerializer


    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_id')
        post = get_object_or_404(Post, id=post_id)
        
        serializer.save(post=post, author=self.request.user)
        post.comments_count = F('comments_count') + 1
        post.save(update_fields=['comments_count'])

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        new_comment = Comment.objects.filter(author=request.user).latest('created_at')
        response_serializer = CommentSerializer(new_comment, context={'request': request})
        
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class UserPostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] # Qualquer um pode ver os posts de um perfil

    def get_queryset(self):
        """
        Esta view retorna uma lista de todos os posts
        criados pelo usuário especificado na URL.
        """
        username = self.kwargs['username']
        user = get_object_or_404(User, username=username)
        return Post.objects.filter(user=user).order_by('-created_at')

    def get_serializer_context(self):
        return {'request': self.request}