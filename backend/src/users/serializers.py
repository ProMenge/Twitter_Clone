# backend/src/users/serializers.py
from rest_framework import serializers
from .models import User, Follow
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model # Importar get_user_model
User = get_user_model() # Obter o modelo de usuário para usar no serializer

class UserSerializer(serializers.ModelSerializer):
    # MOVIDO: is_followed_by_viewer para o UserSerializer
    is_followed_by_viewer = serializers.SerializerMethodField()

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
            'is_followed_by_viewer', # ADICIONADO AQUI
        ]
        read_only_fields = ['id', 'created_at', 'followers_count', 'following_count']

    # MOVIDO: get_is_followed_by_viewer para o UserSerializer
    def get_is_followed_by_viewer(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Verifica se o usuário autenticado (viewer) segue o objeto sendo serializado (obj)
            return Follow.objects.filter(follower=request.user, following=obj).exists()
        return False

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
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        identifier = data.get('username_or_email')
        password = data.get('password')

        if not identifier or not password:
            raise serializers.ValidationError('É necessário um identificador e uma senha.')

        # PRIMEIRA CORREÇÃO: Buscar o usuário pelo email OU username
        user_obj = None
        if '@' in identifier: # Heurística simples para detectar email
            user_obj = User.objects.filter(email=identifier).first()
        if not user_obj: # Se não encontrou por email, tenta por username
            user_obj = User.objects.filter(username=identifier).first()

        if not user_obj:
            raise serializers.ValidationError('Credenciais inválidas.')

        # SEGUNDA CORREÇÃO: Tentar autenticar o objeto de usuário encontrado com a senha.
        # Ao passar o `username` REAL do `user_obj` (que é o campo definido como USERNAME_FIELD)
        # para o `authenticate`, o Django saberá qual campo usar para a comparação da senha.
        # Se `USERNAME_FIELD` é 'email', ele usará `user_obj.email`.
        authenticated_user = authenticate(
            request=self.context.get('request'),
            username=user_obj.get_username(), # Usa get_username() que retorna o campo USERNAME_FIELD
            password=password
        )

        if not authenticated_user: # Se authenticate retornar None
            raise serializers.ValidationError('Credenciais inválidas.')
        
        # Garante que o usuário autenticado é realmente o user_obj encontrado (para casos edge)
        if authenticated_user != user_obj:
            raise serializers.ValidationError('Credenciais inválidas.')

        data['user'] = authenticated_user
        return data

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

# SuggestedUserSerializer agora é mais simples pois herda is_followed_by_viewer do UserSerializer
class SuggestedUserSerializer(UserSerializer): # Herda do UserSerializer
    class Meta(UserSerializer.Meta): # Herda a Meta do UserSerializer
        model = User
        fields = UserSerializer.Meta.fields # Reutiliza os campos do UserSerializer.
        # Se você quiser apenas um subconjunto, você pode listar:
        # fields = ['id', 'username', 'display_name', 'avatar_url', 'is_followed_by_viewer']