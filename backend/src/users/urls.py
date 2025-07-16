from django.urls import path
from posts.views import UserPostListView
from .views import (
    RegisterView,
    LoginView,
    MeView,
    UserDetailView,
    UserUpdateView,
    follow_user,
    unfollow_user,
    who_to_follow,
    PasswordChangeView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', MeView.as_view(), name='me'),
    
    path('change-password/', PasswordChangeView.as_view(), name='change-password'),
    path('users/<int:id>/', UserUpdateView.as_view(), name='user-update'),
    path('users/<int:id>/follow/', follow_user, name='follow-user'),
    path('users/<int:id>/unfollow/', unfollow_user, name='unfollow-user'),
    
    path('users/<str:username>/', UserDetailView.as_view(), name='user-detail'),
    
    #nova URL aqui
    path('users/<str:username>/posts/', UserPostListView.as_view(), name='user-post-list'),

    
    path('who-to-follow/', who_to_follow, name='who-to-follow'),
]