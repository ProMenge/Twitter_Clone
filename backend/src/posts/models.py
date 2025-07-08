# backend/src/posts/models.py
from django.db import models
from django.conf import settings # Importa settings para referenciar o AUTH_USER_MODEL

class Post(models.Model):
    # Relacionamento com o usuário que criou a postagem
    # AUTH_USER_MODEL pega o modelo de usuário configurado em settings.py
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posts' # Acesso reverso: user.posts.all()
    )
    
    # Conteúdo textual da postagem
    text_content = models.TextField(max_length=280, blank=True) # Max 280 caracteres como no X, e pode ser vazio se houver imagem

    # Campo para a imagem anexada.
    # Exige a biblioteca Pillow (pip install Pillow)
    # Uploads serão salvos em MEDIA_ROOT/post_images/
    image = models.ImageField(upload_to='post_images/', blank=True, null=True)

    # Contadores denormalizados para performance (serão atualizados nas views)
    likes_count = models.PositiveIntegerField(default=0)
    reposts_count = models.PositiveIntegerField(default=0) # Para retweets
    comments_count = models.PositiveIntegerField(default=0) # Para comentários/respostas

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at'] # Ordena as postagens da mais nova para a mais antiga por padrão

    def __str__(self):
        # Representação de string para o painel de administração
        return f"Post by {self.user.username} at {self.created_at.strftime('%Y-%m-%d %H:%M')}"

class Like(models.Model):
    # Usuário que curtiu
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='likes' # Acesso reverso: user.likes.all()
    )
    
    # Postagem que foi curtida
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='likes_received' # Acesso reverso: post.likes_received.all()
    )
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Garante que um usuário só pode curtir um post uma vez
        unique_together = ('user', 'post')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} liked {self.post.id}"