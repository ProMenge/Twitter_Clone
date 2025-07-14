import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const [posts, setPosts] = useState<PostType[]>([])
  const [whoToFollow, setWhoToFollow] = useState<UserToFollowType[]>([])
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const [feedType, setFeedType] = useState<'forYou' | 'following'>('forYou')
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [isLoadingWhoToFollow, setIsLoadingWhoToFollow] = useState(true)

  const loggedInUserString = localStorage.getItem('user_data')
  const loggedInUser = loggedInUserString
    ? JSON.parse(loggedInUserString)
    : null
  const loggedInUserAvatar =
    loggedInUser?.avatar_url ||
    'https://via.placeholder.com/48/008000/000000?text=YOU'
  const loggedInUsername = loggedInUser?.username || 'Usuário'
  const loggedInDisplayName =
    loggedInUser?.display_name || 'Usuário Desconhecido'

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
      setIsLoadingWhoToFollow(true)
      try {
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) {
          console.warn(
            'Usuário não autenticado. Não é possível carregar sugestões.'
          )
          setWhoToFollow([])
          setIsLoadingWhoToFollow(false)
          return
        }
        const response = await api.get<UserToFollowType[]>('/who-to-follow/')
        setWhoToFollow(response.data)
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error)
        setWhoToFollow([])
      } finally {
        setIsLoadingWhoToFollow(false)
      }
    }

    fetchWhoToFollow()
  }, [])

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
    try {
      if (isCurrentlyFollowing) {
        await api.delete(`users/${userId}/follow/`)
        console.log(`Deixou de seguir usuário ${userId}`)
      } else {
        await api.post(`users/${userId}/follow/`)
        console.log(`Começou a seguir usuário ${userId}`)
      }
      const updatedWhoToFollowResponse =
        await api.get<UserToFollowType[]>('who-to-follow/')
      setWhoToFollow(updatedWhoToFollowResponse.data)

      if (feedType === 'following') {
        const postsResponse = await api.get<PostType[]>('posts/following/')
        setPosts(postsResponse.data)
      }
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir:', error)
    }
  }

  const handleLikeToggle = async (
    postId: string | number,
    isCurrentlyLiked: boolean
  ) => {
    try {
      await api.post(`posts/${postId}/like/`)
      console.log(
        `Post ${postId} ${isCurrentlyLiked ? 'descurtido' : 'curtido'}.`
      )

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              is_liked_by_viewer: !isCurrentlyLiked,
              likes_count: isCurrentlyLiked
                ? post.likes_count - 1
                : post.likes_count + 1
            }
          }
          return post
        })
      )
    } catch (error) {
      console.error('Erro ao curtir/descurtir post:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
    console.log('Usuário deslogado.')

    navigate('/')
  }

  const isAnyModalOpen = showCreatePostModal

  return (
    <S.PageContainer className={isAnyModalOpen ? 'blurred' : ''}>
      <LeftSidebar
        logoSrc={logo}
        userAvatarUrl={loggedInUserAvatar}
        username={loggedInDisplayName}
        userHandle={loggedInUsername}
        onPostButtonClick={() => setShowCreatePostModal(true)}
        onLogout={handleLogout}
      />

      <MainFeed
        posts={posts}
        onOpenCreatePostModal={() => setShowCreatePostModal(true)}
        userAvatarUrl={loggedInUserAvatar}
        isLoadingPosts={isLoadingPosts}
        feedType={feedType}
        setFeedType={setFeedType}
        onLikeToggle={handleLikeToggle}
      />

      <RightSidebar
        trends={initialTrends}
        whoToFollow={whoToFollow}
        onFollowUser={handleFollowUser}
        isLoadingWhoToFollow={isLoadingWhoToFollow}
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
