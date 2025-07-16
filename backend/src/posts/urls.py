# backend/src/posts/urls.py
from django.urls import path
from .views import (
    PostListCreateView,
    FollowingPostListView,
    PostDetailView,
    LikePostView,
    CommentListCreateView
)

urlpatterns = [

    path('', PostListCreateView.as_view(), name='post-list-create'),

    path('following/', FollowingPostListView.as_view(), name='post-following-list'),

    path('<int:pk>/', PostDetailView.as_view(), name='post-detail'), 
    path('<int:post_id>/like/', LikePostView.as_view(), name='post-like'),
    path('<int:post_id>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),

]