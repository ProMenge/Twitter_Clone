from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    MeView,
    UserDetailView,
    UserUpdateView,
    follow_user,
    unfollow_user,
    who_to_follow,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', MeView.as_view(), name='me'),
    path('users/<int:id>/', UserUpdateView.as_view(), name='user-update'), # PUT para atualizar o próprio usuário
    path('users/<int:id>/follow/', follow_user, name='follow-user'), # POST para seguir
    # DELETE para deixar de seguir
    path('users/<int:id>/unfollow/', unfollow_user, name='unfollow-user'),
    path('users/<str:username>/', UserDetailView.as_view(), name='user-detail'), # GET para detalhes de perfil por username
    
    path('who-to-follow/', who_to_follow, name='who-to-follow'),
]