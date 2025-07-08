# src/users/serializers.py
from rest_framework import serializers
from .models import User,Follow

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'display_name',
            'avatar_url',
            'bio',
            'location',
            'website',
            'birth_date',
            'created_at',
            'followers_count',
            'following_count',
        ]
        read_only_fields = ['id', 'created_at', 'followers_count', 'following_count']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'display_name', 'birth_date']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            display_name=validated_data.get('display_name', ''),
            birth_date=validated_data.get('birth_date', None),
        )
        return user

class LoginSerializer(serializers.Serializer):
    username_or_email = serializers.CharField()
    password = serializers.CharField()

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'display_name',
            'avatar_url',
            'bio',
            'location',
            'website',
            'birth_date',
        ]

class SuggestedUserSerializer(serializers.ModelSerializer):
    is_followed_by_viewer = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'display_name', 'avatar_url', 'is_followed_by_viewer']

    def get_is_followed_by_viewer(self, obj):
        viewer = self.context['request'].user
        return Follow.objects.filter(follower=viewer, following=obj).exists()