# backend/src/users/tests.py
from django.urls import reverse
from django.contrib.auth import get_user_model # Para obter o modelo de usuário atual
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import Follow # Importe o modelo Follow

User = get_user_model() # Obtém o seu modelo de usuário customizado

class UserAuthenticationTests(APITestCase):

    def setUp(self):
        # Configurações iniciais para os testes. Cria usuários de teste.
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.me_url = reverse('me')

        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'password123',
            'display_name': 'Test User',
            'birth_date': '2000-01-01'
        }
        self.other_user_data = {
            'username': 'anotheruser',
            'email': 'another@example.com',
            'password': 'password123',
            'display_name': 'Another User',
            'birth_date': '1995-05-10'
        }

    def test_user_registration_success(self):
        """
        Testa o registro bem-sucedido de um usuário.
        """
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')

    def test_user_registration_invalid_data(self):
        """
        Testa o registro com dados inválidos (e.g., email inválido, sem username).
        """
        invalid_data = self.user_data.copy()
        invalid_data['email'] = 'invalid-email'
        response = self.client.post(self.register_url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data) # Verifica se há erro no campo 'email'

        invalid_data_no_username = self.user_data.copy()
        del invalid_data_no_username['username']
        response = self.client.post(self.register_url, invalid_data_no_username, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_user_login_success_by_email(self):
        """
        Testa o login bem-sucedido de um usuário usando email.
        """
        User.objects.create_user(**self.user_data) # Cria o usuário antes de tentar logar
        login_credentials = {
            'username_or_email': self.user_data['email'],
            'password': self.user_data['password']
        }
        response = self.client.post(self.login_url, login_credentials, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], self.user_data['username'])

    def test_user_login_success_by_username(self):
        """
        Testa o login bem-sucedido de um usuário usando username.
        """
        User.objects.create_user(**self.user_data)
        login_credentials = {
            'username_or_email': self.user_data['username'],
            'password': self.user_data['password']
        }
        response = self.client.post(self.login_url, login_credentials, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], self.user_data['username'])

    def test_user_login_invalid_credentials(self):
        """
        Testa o login com credenciais inválidas.
        """
        User.objects.create_user(**self.user_data)
        invalid_credentials = {
            'username_or_email': self.user_data['email'],
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, invalid_credentials, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) # DRF Validation Error from serializer
        self.assertIn('non_field_errors', response.data)

class UserProfileTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', email='test@example.com', password='password123', display_name='Test User'
        )
        self.other_user = User.objects.create_user(
            username='anotheruser', email='another@example.com', password='password123', display_name='Another User'
        )
        self.me_url = reverse('me')
        self.user_detail_url_by_username = lambda username: reverse('user-detail', kwargs={'username': username})
        self.user_update_url_by_id = lambda user_id: reverse('user-update', kwargs={'id': user_id})

    def test_me_view_authenticated(self):
        """
        Testa a view 'me' para um usuário autenticado.
        """
        self.client.force_authenticate(user=self.user) # Autentica o cliente de teste
        response = self.client.get(self.me_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)

    def test_me_view_unauthenticated(self):
        """
        Testa a view 'me' para um usuário não autenticado.
        """
        response = self.client.get(self.me_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_detail_view_by_username(self):
        """
        Testa a obtenção dos detalhes de um usuário por username.
        """
        # Acesso não autenticado
        response = self.client.get(self.user_detail_url_by_username(self.user.username), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)

        # Acesso autenticado (para verificar 'is_followed_by_viewer')
        self.client.force_authenticate(user=self.other_user)
        response_auth = self.client.get(self.user_detail_url_by_username(self.user.username), format='json')
        self.assertEqual(response_auth.status_code, status.HTTP_200_OK)
        self.assertIn('is_followed_by_viewer', response_auth.data)
        self.assertFalse(response_auth.data['is_followed_by_viewer']) # other_user não segue testuser inicialmente

    def test_user_detail_view_non_existent_user(self):
        """
        Testa a obtenção de detalhes de um usuário inexistente.
        """
        response = self.client.get(self.user_detail_url_by_username('nonexistentuser'), format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_update_view_success(self):
        """
        Testa a atualização bem-sucedida do próprio perfil do usuário.
        """
        self.client.force_authenticate(user=self.user)
        updated_data = {'display_name': 'Updated Name', 'bio': 'New bio'}
        response = self.client.put(self.user_update_url_by_id(self.user.id), updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db() # Recarrega o objeto do banco de dados
        self.assertEqual(self.user.display_name, 'Updated Name')
        self.assertEqual(self.user.bio, 'New bio')

    def test_user_update_view_unauthorized(self):
        """
        Testa a tentativa de atualizar o perfil de outro usuário.
        """
        self.client.force_authenticate(user=self.user)
        updated_data = {'display_name': 'Attempted Update'}
        response = self.client.put(self.user_update_url_by_id(self.other_user.id), updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN) # Acesso não autorizado

class UserFollowTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='follower', email='follower@example.com', password='password123', display_name='Follower User'
        )
        self.followed_user = User.objects.create_user(
            username='following', email='following@example.com', password='password123', display_name='Following User'
        )
        self.another_user = User.objects.create_user(
            username='another', email='another@example.com', password='password123', display_name='Another User'
        )

        self.follow_url = lambda user_id: reverse('follow-user', kwargs={'id': user_id})
        self.unfollow_url = lambda user_id: reverse('unfollow-user', kwargs={'id': user_id})
        self.who_to_follow_url = reverse('who-to-follow')

    def test_follow_user_success(self):
        """
        Testa o seguimento bem-sucedido de um usuário.
        """
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.follow_url(self.followed_user.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'followed')
        self.assertTrue(Follow.objects.filter(follower=self.user, following=self.followed_user).exists())
        
        # Verifica se os contadores foram atualizados atomicamente
        self.user.refresh_from_db()
        self.followed_user.refresh_from_db()
        self.assertEqual(self.user.following_count, 1)
        self.assertEqual(self.followed_user.followers_count, 1)

    def test_follow_user_already_following(self):
        """
        Testa a tentativa de seguir um usuário que já está sendo seguido.
        """
        Follow.objects.create(follower=self.user, following=self.followed_user) # Cria o follow antes
        self.user.following_count += 1
        self.user.save()
        self.followed_user.followers_count += 1
        self.followed_user.save()

        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.follow_url(self.followed_user.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT) # Espera 409 CONFLICT
        self.assertFalse(response.data.get('status') == 'followed') # Não deve retornar status 'followed'
        
        # Garante que os contadores não mudaram novamente
        self.user.refresh_from_db()
        self.followed_user.refresh_from_db()
        self.assertEqual(self.user.following_count, 1)
        self.assertEqual(self.followed_user.followers_count, 1)


    def test_unfollow_user_success(self):
        """
        Testa o deixar de seguir um usuário bem-sucedido.
        """
        Follow.objects.create(follower=self.user, following=self.followed_user)
        self.user.following_count += 1
        self.user.save()
        self.followed_user.followers_count += 1
        self.followed_user.save()

        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.unfollow_url(self.followed_user.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'unfollowed')
        self.assertFalse(Follow.objects.filter(follower=self.user, following=self.followed_user).exists())
        
        # Verifica se os contadores foram atualizados atomicamente
        self.user.refresh_from_db()
        self.followed_user.refresh_from_db()
        self.assertEqual(self.user.following_count, 0)
        self.assertEqual(self.followed_user.followers_count, 0)

    def test_unfollow_user_not_following(self):
        """
        Testa a tentativa de deixar de seguir um usuário que não está sendo seguido.
        """
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.unfollow_url(self.followed_user.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND) # Espera 404 NOT FOUND
        
        # Garante que os contadores não mudaram
        self.user.refresh_from_db()
        self.followed_user.refresh_from_db()
        self.assertEqual(self.user.following_count, 0)
        self.assertEqual(self.followed_user.followers_count, 0)


    def test_cannot_follow_self(self):
        """
        Testa a tentativa de um usuário seguir a si mesmo.
        """
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.follow_url(self.user.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Você não pode se seguir.', response.data['detail'])

    def test_who_to_follow_suggestions(self):
        """
        Testa a obtenção de sugestões de usuários para seguir.
        """
        # Usuário segue 'followed_user'
        Follow.objects.create(follower=self.user, following=self.followed_user)

        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.who_to_follow_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        
        # another_user deve estar nas sugestões, followed_user não (já segue), user não (é ele mesmo)
        suggested_usernames = [item['username'] for item in response.data]
        self.assertIn(self.another_user.username, suggested_usernames)
        self.assertNotIn(self.user.username, suggested_usernames)
        self.assertNotIn(self.followed_user.username, suggested_usernames)

        # Testa is_followed_by_viewer nos resultados
        for item in response.data:
            if item['username'] == self.another_user.username:
                # O usuário logado (self.user) não segue 'another_user'
                self.assertFalse(item['is_followed_by_viewer'])
            # Todos os outros usuários nas sugestões não deveriam ser seguidos pelo viewer