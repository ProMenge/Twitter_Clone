# src/users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    display_name = models.CharField(max_length=50)
    avatar_url = models.URLField(blank=True)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    birth_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # Estes campos são para contagens denormalizadas, o que é ótimo para performance.
    # No entanto, eles devem ser atualizados atomicamente nas operações de follow/unfollow.
    followers_count = models.PositiveIntegerField(default=0)
    following_count = models.PositiveIntegerField(default=0)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username'] # 'username' é requerido para o createsuperuser e admin, mas email será o principal para login.

    # Adicionando um campo para o nome completo se display_name não for o suficiente
    # first_name e last_name já existem em AbstractUser. Se display_name é o único usado, tudo bem.

class Follow(models.Model):
    # 'related_name' é muito bom para acesso reverso
    follower = models.ForeignKey(User, related_name='following_set', on_delete=models.CASCADE)
    following = models.ForeignKey(User, related_name='followers_set', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Garante que um usuário não pode seguir o mesmo outro usuário múltiplas vezes
        unique_together = ('follower', 'following')

    def __str__(self):
        return f"{self.follower.username} → {self.following.username}"