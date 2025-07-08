# backend/src/posts/serializers.py
from rest_framework import serializers
from .models import Post, Like
from users.serializers import UserSerializer # Importe o UserSerializer do seu app users

class PostSerializer(serializers.ModelSerializer):
    # Serializer aninhado para exibir os dados do usuário que fez a postagem
    # read_only=True garante que o user não pode ser modificado através deste serializer
    user = UserSerializer(read_only=True) 

    # Campos para indicar se o usuário autenticado curtiu ou repostou a postagem
    # Serão preenchidos por métodos customizados
    is_liked_by_viewer = serializers.SerializerMethodField()
    is_reposted_by_viewer = serializers.SerializerMethodField()
    
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
            'comments_count', 'created_at', 'updated_at'
        ]

    def get_is_liked_by_viewer(self, obj):
        # Verifica se o usuário autenticado (viewer) curtiu esta postagem
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes_received.filter(user=request.user).exists()
        return False

    def get_is_reposted_by_viewer(self, obj):
        # NOTA: A lógica de repost pode ser mais complexa.
        # Por enquanto, vamos assumir que um "repost" é uma postagem com um campo
        # 'original_post' ou algo similar.
        # Para este exemplo, vamos manter como False, pois não temos um modelo de Repost ainda.
        # Você precisaria de um modelo 'Repost' similar a 'Like' para isso.
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Exemplo hipotético: Se houvesse um modelo Repost
            # return obj.reposts_received.filter(user=request.user).exists()
            pass
        return False

class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['text_content', 'image'] # Apenas campos que podem ser enviados na criação

    def validate(self, data):
        # Garante que pelo menos text_content ou image seja fornecido
        if not data.get('text_content') and not data.get('image'):
            raise serializers.ValidationError("A postagem deve ter conteúdo de texto ou uma imagem.")
        return data

class LikeSerializer(serializers.Serializer):
    # Este serializer é mais para validar a entrada (se houver) ou apenas para documentar a ação
    # Não precisamos de campos específicos para criar/deletar um Like, pois a lógica será na view
    # e usará o user e post do contexto/URL.
    post_id = serializers.IntegerField(read_only=True) # Apenas para referência, não é enviado na request
    user_id = serializers.IntegerField(read_only=True) # Apenas para referência