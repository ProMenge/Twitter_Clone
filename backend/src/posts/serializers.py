from rest_framework import serializers
from .models import Post, Comment, Like
from users.serializers import UserSerializer 

class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['text_content', 'image'] 

    def validate(self, data):
        if not data.get('text_content') and not data.get('image'):
            raise serializers.ValidationError("A postagem deve ter conteúdo de texto ou uma imagem.")
        return data

class LikeSerializer(serializers.Serializer):
    post_id = serializers.IntegerField(read_only=True) 
    user_id = serializers.IntegerField(read_only=True) 


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True) 
    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'created_at']
        read_only_fields = ['id', 'post', 'author', 'created_at'] 

class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['content'] 

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    is_liked_by_viewer = serializers.SerializerMethodField()
    is_reposted_by_viewer = serializers.SerializerMethodField()
    comments_count = serializers.IntegerField(source='comments.count', read_only=True) 
    
    class Meta:
        model = Post
        fields = [
            'id', 'user', 'text_content', 'image',
            'likes_count', 'reposts_count', 'comments_count',
            'created_at', 'updated_at',
            'is_liked_by_viewer', 'is_reposted_by_viewer'
        ]
        read_only_fields = [
            'id', 'user', 'likes_count', 'reposts_count', 
            'comments_count', 'created_at', 'updated_at', 'is_liked_by_viewer', 'is_reposted_by_viewer'
        ]

    def get_is_liked_by_viewer(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:

            return obj.likes_received.filter(user=request.user).exists()
        return False

    def get_is_reposted_by_viewer(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            pass 
        return False