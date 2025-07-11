import { useEffect, useState } from 'react'
import * as S from './styles'

import logo from '../../assets/images/logo-white.png'
import CreatePostModal from '../../components/CreatePostModal/CreatePostModal'
import LeftSidebar from '../../components/LeftSideBar/LeftSideBar'
import MainFeed from '../../components/MainFeed/MainFeed'
import RightSidebar from '../../components/RightSideBar/RightSideBar'
import api from '../../services/api'

import type { PostType, TrendType, UserToFollowType } from '../../types'

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
  const [whoToFollow, setWhoToFollow] = useState<UserToFollowType[]>([]) // whoToFollow agora virá da API
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const [feedType, setFeedType] = useState<'forYou' | 'following'>('forYou')
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [isLoadingWhoToFollow, setIsLoadingWhoToFollow] = useState(true) // NOVO: Estado de carregamento para sugestões

  const loggedInUserAvatar =
    'https://via.placeholder.com/48/008000/000000?text=YOU'

  // === Lógica de Busca de Posts (useEffect) ===
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoadingPosts(true)
      try {
        let response
        const accessToken = localStorage.getItem('access_token')

        if (feedType === 'forYou') {
          response = await api.get<PostType[]>('posts/')
        } else {
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
  }, [feedType])

  // === Lógica de Busca de Sugestões (useEffect) ===
  useEffect(() => {
    const fetchWhoToFollow = async () => {
      setIsLoadingWhoToFollow(true) // Inicia carregamento
      try {
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) {
          console.warn(
            'Usuário não autenticado. Não é possível carregar sugestões.'
          )
          setWhoToFollow([])
          setIsLoadingWhoToFollow(false) // Finaliza mesmo com erro
          return
        }
        const response = await api.get<UserToFollowType[]>('/who-to-follow/')
        setWhoToFollow(response.data)
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error)
        setWhoToFollow([])
      } finally {
        setIsLoadingWhoToFollow(false) // Finaliza carregamento
      }
    }

    fetchWhoToFollow()
  }, []) // Executa apenas uma vez ao montar o componente

  const handlePostSubmit = async (text: string, imageFile?: File) => {
    try {
      const formData = new FormData()
      if (text.trim()) {
        formData.append('text_content', text)
      }
      if (imageFile) {
        formData.append('image', imageFile)
      }

      const response = await api.post<PostType>('posts/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setPosts((prevPosts) => [response.data, ...prevPosts])
    } catch (error) {
      console.error('Erro ao criar postagem:', error)
    }
  }

  const handleFollowUser = async (
    userId: number | string,
    isCurrentlyFollowing: boolean
  ) => {
    // NOVO: isCurrentlyFollowing para saber se é follow/unfollow
    try {
      if (isCurrentlyFollowing) {
        await api.delete(`users/${userId}/follow/`)
        console.log(`Deixou de seguir usuário ${userId}`)
      } else {
        await api.post(`users/${userId}/follow/`)
        console.log(`Começou a seguir usuário ${userId}`)
      }
      // Re-fetch a lista de sugestões e posts para refletir a mudança
      // Uma abordagem mais otimista seria atualizar o estado local de whoToFollow e posts
      // Mas para simplificar a demo, vamos re-buscar tudo.
      const updatedWhoToFollowResponse =
        await api.get<UserToFollowType[]>('/who-to-follow/')
      setWhoToFollow(updatedWhoToFollowResponse.data)

      // Se a pessoa seguia/parou de seguir alguém e está no feed "Seguindo", é bom atualizar
      if (feedType === 'following') {
        const postsResponse = await api.get<PostType[]>('posts/following/')
        setPosts(postsResponse.data)
      }
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir:', error)
    }
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
        whoToFollow={whoToFollow} // Passa whoToFollow para RightSidebar
        onFollowUser={handleFollowUser} // Passa o handler de seguir/deixar de seguir
        isLoadingWhoToFollow={isLoadingWhoToFollow} // Passa o estado de carregamento
      />

      <CreatePostModal
        isOpen={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
        onPostSubmit={handlePostSubmit}
        userAvatarUrl={loggedInUserAvatar}
      />
    </S.PageContainer>
  )
}
