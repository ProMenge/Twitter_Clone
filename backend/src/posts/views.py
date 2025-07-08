# backend/src/posts/views.py
from django.shortcuts import get_object_or_404
from django.db.models import F # Importar F para operações atômicas em contadores

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly # IsAuthenticatedOrReadOnly para GETs públicos

from users.models import Follow # Para filtrar posts de quem o usuário segue
from .models import Post, Like
from .serializers import PostSerializer, PostCreateSerializer, LikeSerializer # Importar os serializers

# === Views de Postagens ===

class PostListCreateView(generics.ListCreateAPIView):
    # Permite listar posts sem autenticação, mas exige autenticação para criar
    permission_classes = [IsAuthenticatedOrReadOnly] 

    def get_queryset(self):
        # Retorna todas as postagens, ordenadas da mais nova para a mais antiga
        # Futuramente, podemos adicionar filtros aqui para "Explore" vs "For You"
        return Post.objects.all().order_by('-created_at')

    def get_serializer_class(self):
        # Usa PostCreateSerializer para requisições POST (criação)
        # Usa PostSerializer para requisições GET (listagem)
        if self.request.method == 'POST':
            return PostCreateSerializer
        return PostSerializer

    def perform_create(self, serializer):
        # Define o usuário da postagem como o usuário autenticado na requisição
        # request.user é populado pelo AuthenticationMiddleware e JWTAuthentication
        serializer.save(user=self.request.user)
        # Quando um post é criado, o comments_count, likes_count, reposts_count são 0 por padrão.
        # Não é necessário atualizar contadores de perfil aqui.

    def get_serializer_context(self):
        # Passa o request para o serializer, necessário para SerializerMethodField (e.g., is_liked_by_viewer)
        return {'request': self.request}

class FollowingPostListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated] # Exige autenticação para ver o feed "Seguindo"
    serializer_class = PostSerializer

    def get_queryset(self):
        user = self.request.user # O usuário autenticado
        
        # Pega os IDs dos usuários que o usuário logado segue
        followed_users_ids = Follow.objects.filter(follower=user).values_list('following__id', flat=True)
        
        # Retorna posts feitos por esses usuários, ordenados por data de criação
        return Post.objects.filter(user__id__in=followed_users_ids).order_by('-created_at')

    def get_serializer_context(self):
        return {'request': self.request}

class PostDetailView(generics.RetrieveDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] # Permite ver sem auth, mas exige auth para deletar
    lookup_field = 'pk' # Usa a chave primária (id) da postagem na URL

    def perform_destroy(self, instance):
        # Verifica se o usuário autenticado é o dono da postagem antes de deletar
        if instance.user != self.request.user:
            return Response(
                {'detail': 'Você não tem permissão para deletar esta postagem.'},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.delete()
        # Não precisa decrementar contadores aqui, pois o CASCADE handle a exclusão de Likes
        # Se tivesse contadores de posts no modelo User, precisaria decrementar aqui.
        return Response(status=status.HTTP_204_NO_CONTENT) # Retorna 204 No Content para sucesso de DELETE

    def get_serializer_context(self):
        return {'request': self.request}

class LikePostView(APIView):
    permission_classes = [IsAuthenticated] # Exige autenticação para curtir/descurtir

    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        user = request.user

        # Tenta criar a curtida. Se já existir, `created` será False.
        like, created = Like.objects.get_or_create(user=user, post=post)

        if created:
            # Se a curtida foi criada (usuário curtiu o post)
            post.likes_count = F('likes_count') + 1 # Incrementa atomicamente
            post.save(update_fields=['likes_count']) # Salva apenas o campo atualizado
            # post.refresh_from_db() # Recarrega o objeto com o novo valor se for usá-lo imediatamente
            return Response({'status': 'liked'}, status=status.HTTP_200_OK)
        else:
            # Se a curtida já existia (usuário já havia curtido, então ele quer descurtir)
            like.delete() # Remove a curtida
            post.likes_count = F('likes_count') - 1 # Decrementa atomicamente
            post.save(update_fields=['likes_count']) # Salva apenas o campo atualizado
            # post.refresh_from_db()
            return Response({'status': 'unliked'}, status=status.HTTP_200_OK)

    # Opcional: Um método DELETE para /like/ post_id também seria possível,
    # mas o POST como toggle é comum em APIs.