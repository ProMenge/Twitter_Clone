import { useEffect, useState } from 'react'
import * as S from './styles'

import logo from '../../assets/images/logo-white.png'
import CreatePostModal from '../../components/CreatePostModal/CreatePostModal'
import LeftSidebar from '../../components/LeftSideBar/LeftSideBar'
import MainFeed from '../../components/MainFeed/MainFeed'
import RightSidebar from '../../components/RightSideBar/RightSideBar'
import api from '../../services/api'

import type { PostType, UserToFollowType, TrendType } from '../../types'

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
  const [posts, setPosts] = useState<PostType[]>([])
  const [whoToFollow, setWhoToFollow] = useState<UserToFollowType[]>([])
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const [feedType, setFeedType] = useState<'forYou' | 'following'>('forYou')
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)

  const loggedInUserAvatar =
    'https://via.placeholder.com/48/008000/000000?text=YOU'

  // === Lógica de Busca de Posts (useEffect) ===
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoadingPosts(true)
      try {
        let response
        // Obter o token de acesso para enviar na requisição de following
        const accessToken = localStorage.getItem('access_token')

        if (feedType === 'forYou') {
          // Para o feed "Para você", não é obrigatório autenticação no backend
          response = await api.get<PostType[]>('posts/')
        } else {
          // Para o feed "Seguindo", autenticação é OBRIGATÓRIA
          // Axios já configura o interceptor, mas é bom garantir que o token exista.
          if (!accessToken) {
            console.warn(
              'Usuário não autenticado. Não é possível carregar feed "Seguindo".'
            )
            setPosts([])
            setIsLoadingPosts(false)
            return
          }
          response = await api.get<PostType[]>('posts/following/')
        }
        setPosts(response.data)
      } catch (error) {
        console.error('Erro ao buscar posts:', error)
        setPosts([])
      } finally {
        setIsLoadingPosts(false)
      }
    }

    fetchPosts()
  }, [feedType]) // Re-busca posts quando o tipo de feed muda

  // === Lógica de Busca de Sugestões (useEffect) ===
  useEffect(() => {
    const fetchWhoToFollow = async () => {
      try {
        // Requisições para who-to-follow também exigem autenticação
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) {
          console.warn(
            'Usuário não autenticado. Não é possível carregar sugestões.'
          )
          setWhoToFollow([])
          return
        }
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

  // handlePostSubmit agora recebe File para a imagem
  const handlePostSubmit = async (text: string, imageFile?: File) => {
    try {
      const formData = new FormData()
      if (text.trim()) {
        formData.append('text_content', text)
      }
      if (imageFile) {
        formData.append('image', imageFile) // Anexar o File object diretamente
      }

      // Requisição POST para criar o post
      const response = await api.post<PostType>('posts/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Importante para upload de arquivos
        }
      })

      // Adição otimista do post recém-criado no topo do feed
      setPosts((prevPosts) => [response.data, ...prevPosts])
    } catch (error) {
      console.error('Erro ao criar postagem:', error)
      // Aqui você pode adicionar lógica para exibir um erro ao usuário na FeedPage
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
        posts={posts}
        onOpenCreatePostModal={() => setShowCreatePostModal(true)}
        userAvatarUrl={loggedInUserAvatar}
        isLoadingPosts={isLoadingPosts}
        feedType={feedType}
        setFeedType={setFeedType}
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
