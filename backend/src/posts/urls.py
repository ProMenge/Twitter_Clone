# backend/src/posts/urls.py
from django.urls import path
from .views import (
    PostListCreateView,
    FollowingPostListView,
    PostDetailView,
    LikePostView,
    # Você pode adicionar RepostPostView, CommentPostView, etc. aqui futuramente
)

urlpatterns = [
    # GET: Listar todas as postagens (feed "Para você")
    # POST: Criar uma nova postagem
    path('', PostListCreateView.as_view(), name='post-list-create'),

    # GET: Listar postagens de usuários que o autenticado segue (feed "Seguindo")
    path('following/', FollowingPostListView.as_view(), name='post-following-list'),

    # GET: Obter detalhes de uma postagem específica
    # DELETE: Deletar uma postagem específica (requer ser o autor)
    # Assumindo que o ID da postagem é um inteiro (BigAutoField) e é a PK
    path('<int:pk>/', PostDetailView.as_view(), name='post-detail'), 

    # POST: Curtir/Descurtir uma postagem (toggle)
    path('<int:post_id>/like/', LikePostView.as_view(), name='post-like'),

    # Futuramente, você adicionaria URLs para reposts, comentários, etc.
    # path('<int:post_id>/repost/', RepostPostView.as_view(), name='post-repost'),
    # path('<int:post_id>/comment/', CommentPostView.as_view(), name='post-comment'),
    # path('<int:post_id>/comments/', CommentListAPIView.as_view(), name='post-comment-list'),
]