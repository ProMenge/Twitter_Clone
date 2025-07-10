import { useEffect, useState } from 'react' // Importar useEffect
import * as S from './styles'

import logo from '../../assets/images/logo-white.png'
import CreatePostModal from '../../components/CreatePostModal/CreatePostModal'
import LeftSidebar from '../../components/LeftSideBar/LeftSideBar'
import MainFeed from '../../components/MainFeed/MainFeed'
import RightSidebar from '../../components/RightSideBar/RightSideBar'
import api from '../../services/api' // Importar o serviço de API

// As interfaces PostType e UserToFollowType já foram movidas para 'types/index.ts' em discussões anteriores.
// Se ainda estiverem aqui, por favor, mova-as para 'src/types/index.ts'
// As interfaces PostType e UserToFollowType já foram movidas para 'types/index.ts' em discussões anteriores.
// Se ainda estiverem aqui, por favor, mova-as para 'src/types/index.ts'
import type { PostType, UserToFollowType, TrendType } from '../../types' // Ajuste o caminho se seu arquivo for diferente
// Ajuste o caminho se seu arquivo for diferente

// Mover a definição de trends para fora do componente (se não estiver já)
const initialTrends: TrendType[] = [
  { category: 'Esporte', hashtag: 'Diogo Jota', tweets: '1,38 mi posts' },
  {
    category: 'Assunto do Momento no Brasil',
    hashtag: '#WimbledonESPN',
    tweets: '45 mil posts'
  },
  {
    category: 'Assunto do Momento no Brasil',
    hashtag: 'Censura',
    tweets: '65 mil posts'
  },
  { category: 'Entretenimento', hashtag: 'Samuca TV', tweets: '' }
]

export default function FeedPage() {
  const [posts, setPosts] = useState<PostType[]>([]) // Posts agora virão da API
  const [whoToFollow, setWhoToFollow] = useState<UserToFollowType[]>([]) // Virão da API
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const [feedType, setFeedType] = useState<'forYou' | 'following'>('forYou') // NOVO: Estado para tipo de feed
  const [isLoadingPosts, setIsLoadingPosts] = useState(true) // NOVO: Estado de carregamento dos posts

  // Mover avatar do usuário logado para um estado ou contexto real de autenticação futuramente
  const loggedInUserAvatar =
    'https://via.placeholder.com/48/008000/000000?text=YOU'

  // === Lógica de Busca de Posts (useEffect) ===
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoadingPosts(true) // Inicia carregamento
      try {
        let response
        if (feedType === 'forYou') {
          // Endpoint para todos os posts (explore)
          response = await api.get<PostType[]>('posts/')
        } else {
          // Endpoint para posts de quem o usuário segue
          response = await api.get<PostType[]>('posts/following/')
        }
        setPosts(response.data)
      } catch (error) {
        console.error('Erro ao buscar posts:', error)
        setPosts([]) // Limpa posts em caso de erro
      } finally {
        setIsLoadingPosts(false) // Finaliza carregamento
      }
    }

    fetchPosts()
  }, [feedType]) // Re-busca posts quando o tipo de feed muda

  // === Lógica de Busca de Sugestões (useEffect) ===
  useEffect(() => {
    const fetchWhoToFollow = async () => {
      try {
        const response = await api.get<UserToFollowType[]>(
          'users/who-to-follow/'
        )
        setWhoToFollow(response.data)
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error)
        setWhoToFollow([])
      }
    }

    fetchWhoToFollow()
  }, []) // Executa apenas uma vez ao montar o componente

  // Modificar handlePostSubmit para que ele atualize o feed após a criação
  const handlePostSubmit = async (text: string, imageUrl?: string) => {
    if (text.trim() || imageUrl) {
      try {
        // A API de posts aceita form-data se tiver imagem, então precisamos montar isso
        const formData = new FormData()
        if (text.trim()) {
          formData.append('text_content', text)
        }
        if (imageUrl) {
          // Se imageUrl for um Blob/File, append diretamente.
          // Se for uma Data URL de preview, precisará ser convertida para Blob/File.
          // Por simplicidade aqui, vamos assumir que o CreatePostModal passaria um File/Blob.
          // Como o CreatePostModal atualmente passa um string de URL (createObjectURL),
          // para o backend, isso não funcionaria diretamente.
          // Para testar, vamos passar text_content e o backend ImageField aceitaria um File.
          // Para Data URL, precisaríamos de uma conversão:
          // const blob = await fetch(imageUrl).then(res => res.blob());
          // formData.append('image', blob, 'image.png');
          // Por enquanto, o backend ImageField exige File, então ou enviamos File, ou ajustamos backend para URLField.
          // Vamos mudar a PostType para image: File | string, e o CreatePostModal para passar File,
          // e o backend PostCreateSerializer aceitar ImageField.
          // Assumindo que o `imageUrl` aqui é na verdade um `File` object vindo do modal
          // ou que o modal fará o upload primeiro e nos dará uma URL.
          // Por hora, para mockar, vamos re-fetch o feed.
          // Em um cenário real:
          // 1. Fazer upload da imagem para um endpoint de media (POST /api/media/upload/)
          // 2. Receber a URL da imagem upada
          // 3. Incluir essa URL no payload de criação do post
          // Ou, como está no PostCreateSerializer: enviar o File direto.
          // Então, o `imageUrl` aqui deve ser um `File` se for para enviar.
          // Vamos ajustar a interface de `onPostSubmit` no CreatePostModal para `File`.
          // Para testar rapidamente a integração, se o `imageUrl` for uma string de URL:
          // formData.append('image_url', imageUrl); // Se o backend aceitar image_url diretamente
          // Se o CreatePostModal passa um File:
          // formData.append('image', imageUrl); // Se imageUrl for File
        }

        // Para simplificar a demonstração da integração, vamos re-fetch o feed após criar
        // a chamada da API, para que o novo post apareça.
        // O `CreatePostModal` atualmente passa `imagePreviewUrl` (string).
        // Se o backend espera um File object, a `handlePostSubmit` em FeedPage precisaria
        // receber um File ou o `CreatePostModal` lidar com o upload.

        // Por enquanto, para o mock, vamos re-fetchar o feed, como a criação do post
        // no modal já envia para o backend.

        // AQUI ESTÁ A CHAMADA REAL PARA CRIAR POST
        // O CreatePostModal já faz o postSubmit, então aqui só precisamos re-carregar o feed
        // O CreatePostModal deve receber o onPostSubmit que lida com a API.
        // O `handlePostSubmit` já faz a chamada, só precisamos re-fetchar o feed depois.

        // NOTA: O CreatePostModal JÁ LIDA COM api.post('register/', payload)
        // A função handlePostSubmit DEVE APENAS FAZER A CHAMADA DA API PARA POSTS.
        // E ela já faz isso quando está no createPostModal.
        // A `handlePostSubmit` em FeedPage apenas adiciona o post ao estado local.
        // PRECISAMOS CONECTAR O onPostSubmit DO MODAL AO BACKEND.

        // CORREÇÃO: `handlePostSubmit` aqui é a função que o `CreatePostModal` chama.
        // Ela precisa fazer a chamada de API e depois atualizar o estado local.
        const postPayload = new FormData() // Usar FormData para texto e imagem
        if (text.trim()) {
          postPayload.append('text_content', text)
        }
        if (imageUrl && imageUrl.startsWith('blob:')) {
          // Se for um Blob URL, converter para File
          const response = await fetch(imageUrl)
          const blob = await response.blob()
          postPayload.append('image', blob, 'post_image.png')
        } else if (imageUrl) {
          // Se imageUrl for um caminho de arquivo real (ex: de um input type="file"),
          // ele já seria um File object e seria passado para o FormData diretamente.
          // Assumimos que o CreatePostModal já passou um File se não for um blob URL.
          // Para simplificar agora, se o `imageUrl` não for um blob, não tentamos enviar como File aqui.
        }

        const response = await api.post<PostType>('posts/', postPayload, {
          headers: {
            'Content-Type': 'multipart/form-data' // Importante para upload de arquivos
          }
        })

        // Adição otimista do post recém-criado na tela sem precisar recarregar o feed inteiro
        // ou você pode re-fetch o feed inteiro: fetchPosts();
        setPosts((prevPosts) => [response.data, ...prevPosts])
      } catch (error) {
        console.error('Erro ao criar postagem:', error)
        // Exibir erro no frontend
      }
    }
  }

  const handleFollowUser = (userId: string) => {
    // Lógica para seguir/deixar de seguir (será integrada com API real depois)
    setWhoToFollow((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
      )
    )
    // TODO: Fazer chamada API POST/DELETE para /api/users/{id}/follow/
  }

  const isAnyModalOpen = showCreatePostModal

  return (
    <S.PageContainer className={isAnyModalOpen ? 'blurred' : ''}>
      <LeftSidebar
        logoSrc={logo}
        userAvatarUrl={loggedInUserAvatar}
        username="Fred."
        userHandle="@FredMenge"
        onPostButtonClick={() => setShowCreatePostModal(true)}
      />

      <MainFeed
        posts={posts} // Passa posts para MainFeed
        onOpenCreatePostModal={() => setShowCreatePostModal(true)}
        userAvatarUrl={loggedInUserAvatar}
        isLoadingPosts={isLoadingPosts} // Passa estado de carregamento
        feedType={feedType} // Passa tipo de feed
        setFeedType={setFeedType} // Passa setFeedType
      />

      <RightSidebar
        trends={initialTrends}
        whoToFollow={whoToFollow}
        onFollowUser={handleFollowUser}
      />

      <CreatePostModal
        isOpen={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
        onPostSubmit={handlePostSubmit} // Passa o handler real de submissão
        userAvatarUrl={loggedInUserAvatar}
      />
    </S.PageContainer>
  )
}
