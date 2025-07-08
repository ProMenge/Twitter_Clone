# backend/src/posts/tests.py
import os # Importar os para manipulação de caminhos
import shutil # Importar shutil para remover diretório
import tempfile # Importar tempfile para criar diretórios temporários

from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from django.core.files.uploadedfile import SimpleUploadedFile # ADICIONAR ESTE IMPORT
from users.models import Follow
from posts.models import Post, Like

# Para criar imagem em memória nos testes
from PIL import Image
from io import BytesIO

User = get_user_model()

# CORREÇÃO DA FALHA 2: Configurar um MEDIA_ROOT temporário para os testes de imagem
class TemporaryMediaRootMixin:
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # Cria um diretório temporário para MEDIA_ROOT
        cls.temp_media_root = tempfile.mkdtemp()
        # Sobrescreve MEDIA_ROOT para o ambiente de teste
        cls._original_media_root = os.path.join(cls.live_server.settings.MEDIA_ROOT) if hasattr(cls, 'live_server') else None
        cls.live_server.settings.MEDIA_ROOT = cls.temp_media_root
        
    @classmethod
    def tearDownClass(cls):
        # Restaura o MEDIA_ROOT original e remove o diretório temporário
        if hasattr(cls, 'live_server') and cls._original_media_root:
            cls.live_server.settings.MEDIA_ROOT = cls._original_media_root
        shutil.rmtree(cls.temp_media_root)
        super().tearDownClass()


class PostCreationAndListingTests(APITestCase, TemporaryMediaRootMixin):

    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(
            username='posteruser', email='poster@example.com', password='password123', display_name='Poster User'
        )
        self.other_user = User.objects.create_user(
            username='otheruser', email='other@example.com', password='password123', display_name='Other User'
        )

        self.post_list_create_url = reverse('post-list-create')
        self.following_posts_url = reverse('post-following-list')
        self.post_detail_url = lambda pk: reverse('post-detail', kwargs={'pk': pk})
        self.post_like_url = lambda post_id: reverse('post-like', kwargs={'post_id': post_id})

        self.post1 = Post.objects.create(user=self.user, text_content="Hello world!")
        self.post2 = Post.objects.create(user=self.other_user, text_content="Another post here.")
        self.post3 = Post.objects.create(user=self.user, text_content="Third post.")

    def test_create_post_success_authenticated_text_only(self):
        self.client.force_authenticate(user=self.user)
        data = {'text_content': 'This is a new test post.'}
        response = self.client.post(self.post_list_create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 4)
        self.assertEqual(response.data['user']['username'], self.user.username)

    def test_create_post_success_authenticated_with_image(self):
        """
        Testa a criação de uma postagem com imagem por um usuário autenticado.
        """
        # Cria o conteúdo da imagem em memória
        image_content = BytesIO()
        Image.new('RGB', (100, 100), color='red').save(image_content, 'png')
        image_content.seek(0) # Volta para o início do buffer

        # CORREÇÃO AQUI: Usa SimpleUploadedFile para criar um objeto de arquivo adequado
        image_file = SimpleUploadedFile(
            name='test_image.png',       # Nome do arquivo
            content=image_content.read(), # Conteúdo binário do arquivo
            content_type='image/png'      # Tipo MIME do arquivo
        )

        self.client.force_authenticate(user=self.user)
        data = {
            'text_content': 'Post with an image.',
            'image': image_file # Passa o objeto SimpleUploadedFile
        }
        # Garante que o formato é 'multipart' para upload de arquivos
        response = self.client.post(self.post_list_create_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 4)
        self.assertIsNotNone(response.data['image'])
        self.assertIn('http://testserver/media/post_images/', response.data['image'])

    def test_create_post_unauthenticated(self):
        data = {'text_content': 'This post should fail.'}
        response = self.client.post(self.post_list_create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Post.objects.count(), 3)

    def test_create_post_empty_content(self):
        self.client.force_authenticate(user=self.user)
        data = {'text_content': ''}
        response = self.client.post(self.post_list_create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', response.data)
        self.assertEqual(Post.objects.count(), 3)
        
    def test_list_all_posts_authenticated(self):
        Like.objects.create(user=self.user, post=self.post1)
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.post_list_create_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)
        self.assertEqual(response.data[0]['id'], self.post3.id) 
        self.assertEqual(response.data[1]['id'], self.post2.id)
        self.assertEqual(response.data[2]['id'], self.post1.id)
        
        for post_data in response.data:
            if post_data['id'] == self.post1.id:
                self.assertTrue(post_data['is_liked_by_viewer'])
            elif post_data['id'] == self.post2.id:
                self.assertFalse(post_data['is_liked_by_viewer'])

    def test_list_all_posts_unauthenticated(self):
        response = self.client.get(self.post_list_create_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)
        for post_data in response.data:
            self.assertFalse(post_data['is_liked_by_viewer'])

    def test_list_following_posts_authenticated(self):
        Follow.objects.create(follower=self.other_user, following=self.user)
        
        self.client.force_authenticate(user=self.other_user)
        response = self.client.get(self.following_posts_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.assertEqual(len(response.data), 2) 
        self.assertEqual(response.data[0]['user']['username'], self.user.username)
        self.assertEqual(response.data[1]['user']['username'], self.user.username)
        self.assertEqual(response.data[0]['id'], self.post3.id)

    def test_list_following_posts_unauthenticated(self):
        response = self.client.get(self.following_posts_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_following_posts_no_following(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.following_posts_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

class PostDetailAndDeletionTests(APITestCase, TemporaryMediaRootMixin): # Mixin adicionado aqui

    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(
            username='owner', email='owner@example.com', password='password123', display_name='Owner User'
        )
        self.other_user = User.objects.create_user(
            username='intruder', email='intruder@example.com', password='password123', display_name='Intruder User'
        )
        self.post = Post.objects.create(user=self.user, text_content="This is my post.")
        self.post_detail_url = lambda pk: reverse('post-detail', kwargs={'pk': pk})

    def test_retrieve_post_detail_authenticated(self):
        self.client.force_authenticate(user=self.other_user)
        response = self.client.get(self.post_detail_url(self.post.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['text_content'], self.post.text_content)
        self.assertIn('is_liked_by_viewer', response.data)
        self.assertFalse(response.data['is_liked_by_viewer'])

    def test_retrieve_post_detail_unauthenticated(self):
        response = self.client.get(self.post_detail_url(self.post.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['text_content'], self.post.text_content)
        self.assertFalse(response.data['is_liked_by_viewer'])

    def test_retrieve_non_existent_post(self):
        response = self.client.get(self.post_detail_url(9999), format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_post_owner_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.post_detail_url(self.post.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Post.objects.count(), 0)
        response_get = self.client.get(self.post_detail_url(self.post.id), format='json')
        self.assertEqual(response_get.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_post_non_owner_authenticated(self):
        self.client.force_authenticate(user=self.other_user)
        response = self.client.delete(self.post_detail_url(self.post.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN) # Deve ser Forbidden
        self.assertEqual(Post.objects.count(), 1)

    def test_delete_post_unauthenticated(self):
        response = self.client.delete(self.post_detail_url(self.post.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Post.objects.count(), 1)

class PostLikeTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='liker', email='liker@example.com', password='password123', display_name='Liker User'
        )
        self.post_owner = User.objects.create_user(
            username='postowner', email='postowner@example.com', password='password123', display_name='Post Owner'
        )
        self.post = Post.objects.create(user=self.post_owner, text_content="Post to be liked.")
        self.post_like_url = lambda post_id: reverse('post-like', kwargs={'post_id': post_id})
        self.post_detail_url = lambda pk: reverse('post-detail', kwargs={'pk': pk})

    def test_like_post_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.post_like_url(self.post.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'liked')
        self.assertTrue(Like.objects.filter(user=self.user, post=self.post).exists())
        
        self.post.refresh_from_db()
        self.assertEqual(self.post.likes_count, 1)

    def test_unlike_post_success(self):
        Like.objects.create(user=self.user, post=self.post)
        self.post.likes_count = 1
        self.post.save()
        
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.post_like_url(self.post.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'unliked')
        self.assertFalse(Like.objects.filter(user=self.user, post=self.post).exists())
        
        self.post.refresh_from_db()
        self.assertEqual(self.post.likes_count, 0)

    def test_like_post_unauthenticated(self):
        response = self.client.post(self.post_like_url(self.post.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Like.objects.count(), 0)
        self.post.refresh_from_db()
        self.assertEqual(self.post.likes_count, 0)

    def test_like_non_existent_post(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.post_like_url(9999), format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)