// src/pages/ProfilePage/index.tsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as S from './styles'
import { FiArrowLeft, FiMapPin, FiLink, FiCalendar } from 'react-icons/fi' // Ícones para meta-informações
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import LeftSidebar from '../../components/LeftSideBar/LeftSideBar'
import RightSidebar from '../../components/RightSideBar/RightSideBar'
import Post from '../../components/Post/Post'

import type { PostType } from '../../types'
import logo from '../../assets/images/logo-white.png'
import Button from '../../components/Button/Button'
import { AxiosError } from 'axios'

interface ProfileUser {
  id: number | string
  username: string
  display_name: string
  avatar_url: string
  bio: string
  location: string
  website: string
  created_at: string
  followers_count: number
  following_count: number
  is_followed_by_viewer?: boolean
}

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const { user: authenticatedUser, isAuthenticated, isLoadingAuth } = useAuth()

  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null)
  const [userPosts, setUserPosts] = useState<PostType[]>([])
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoadingProfile(true)
      try {
        const response = await api.get<ProfileUser>(`users/${username}/`)
        setProfileUser(response.data)
      } catch (error) {
        console.error('Erro ao buscar dados do perfil:', error)
        setProfileUser(null)
        if (error instanceof AxiosError && error.response) {
          if (error.response.status === 404) {
            navigate('/not-found')
          }
        }
      } finally {
        setIsLoadingProfile(false)
      }
    }

    const fetchUserPosts = async () => {
      setIsLoadingPosts(true)
      try {
        const response = await api.get<PostType[]>(`posts/users/${username}/`)
        setUserPosts(response.data)
      } catch (error) {
        console.error('Erro ao buscar posts do usuário:', error)
        setUserPosts([])
        if (error instanceof AxiosError && error.response) {
          // Pode adicionar tratamento específico para erros de posts aqui
        }
      } finally {
        setIsLoadingPosts(false)
      }
    }

    if (username) {
      fetchProfileData()
      fetchUserPosts()
    }
  }, [username, navigate])

  // === Handler para seguir/deixar de seguir ===
  const handleFollowUser = async (
    userId: number | string,
    isCurrentlyFollowing: boolean
  ) => {
    try {
      if (!isAuthenticated) {
        alert('Você precisa estar logado para seguir/deixar de seguir!')
        return
      }
      if (isCurrentlyFollowing) {
        await api.delete(`users/${userId}/follow/`)
      } else {
        await api.post(`users/${userId}/follow/`)
      }
      setProfileUser((prev) => {
        if (!prev) return null
        return {
          ...prev,
          is_followed_by_viewer: !isCurrentlyFollowing,
          followers_count: isCurrentlyFollowing
            ? prev.followers_count - 1
            : prev.followers_count + 1
        }
      })
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir:', error)
    }
  }

  const handleLikeToggle = async (
    postId: string | number,
    isCurrentlyLiked: boolean
  ) => {
    try {
      if (!isAuthenticated) {
        console.warn('Você precisa estar logado para curtir.')
        return
      }
      await api.post(`posts/${postId}/like/`)
      setUserPosts((prevPosts) =>
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

  if (isLoadingAuth || isLoadingProfile) {
    return (
      <S.ProfilePageContainer>
        <S.LoadingIndicator>Carregando perfil...</S.LoadingIndicator>
      </S.ProfilePageContainer>
    )
  }
  if (!isAuthenticated && !profileUser) {
    navigate('/')
    return null
  }
  if (!profileUser) {
    return null
  }

  const isOwnProfile =
    isAuthenticated && authenticatedUser?.username === username

  return (
    <S.ProfilePageContainer>
      <LeftSidebar logoSrc={logo} onPostButtonClick={() => {}} />{' '}
      {/* Usar o import 'logo' */}
      <S.ProfileMainContent>
        <S.ProfileHeaderSection>
          {/* Nova estrutura de TopBar */}
          <S.TopBar>
            <S.BackButton onClick={() => navigate('/feed')}>
              <FiArrowLeft />
            </S.BackButton>
            <S.TopBarUserInfo>
              <span className="name">{profileUser.display_name}</span>
              <span className="posts-count">{userPosts.length} posts</span>
            </S.TopBarUserInfo>
          </S.TopBar>

          {/* Placeholder da capa */}
          <S.CoverPhotoPlaceholder>
            {/* Aqui poderia ir a imagem de capa */}
            <p>Capa do perfil (em breve)</p>
          </S.CoverPhotoPlaceholder>

          <S.ProfileAvatar
            style={{ backgroundImage: `url(${profileUser.avatar_url})` }}
          />

          <S.ProfileActions>
            {isOwnProfile ? (
              <Button
                variant="secondary"
                size="medium"
                onClick={() => setShowEditProfileModal(true)}
              >
                Editar perfil
              </Button>
            ) : (
              <Button
                variant={
                  profileUser.is_followed_by_viewer ? 'secondary' : 'primary'
                }
                size="medium"
                onClick={() =>
                  handleFollowUser(
                    profileUser.id,
                    !!profileUser.is_followed_by_viewer
                  )
                }
              >
                {profileUser.is_followed_by_viewer ? 'Seguindo' : 'Seguir'}
              </Button>
            )}
          </S.ProfileActions>

          <S.UserInfoBox>
            <S.ProfileName>{profileUser.display_name}</S.ProfileName>
            <S.ProfileHandle>@{profileUser.username}</S.ProfileHandle>
            {profileUser.bio && <S.ProfileBio>{profileUser.bio}</S.ProfileBio>}
            <S.ProfileMeta>
              {profileUser.location && (
                <span>
                  <FiMapPin /> {profileUser.location}
                </span>
              )}
              {profileUser.website && (
                <span>
                  <FiLink />
                  <a
                    href={profileUser.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profileUser.website}
                  </a>
                </span>
              )}
              {profileUser.created_at && (
                <span>
                  <FiCalendar /> Entrou em{' '}
                  {format(new Date(profileUser.created_at), 'MMM yyyy', {
                    locale: ptBR
                  })}
                </span>
              )}
            </S.ProfileMeta>
            <S.FollowsContainer>
              <span>
                {profileUser.following_count} <p>Seguindo</p>
              </span>
              <span>
                {profileUser.followers_count} <p>Seguidores</p>
              </span>
            </S.FollowsContainer>
          </S.UserInfoBox>
        </S.ProfileHeaderSection>

        {/* Abas de perfil (Posts, Respostas, etc.) */}
        <S.ProfileTabs>
          <S.ProfileTab className="active">Posts</S.ProfileTab>
          <S.ProfileTab>Respostas</S.ProfileTab>
          <S.ProfileTab>Mídia</S.ProfileTab>
          <S.ProfileTab>Curtidas</S.ProfileTab>
        </S.ProfileTabs>

        {/* Lista de posts do usuário */}
        {isLoadingPosts ? (
          <S.LoadingIndicator>Carregando posts do perfil...</S.LoadingIndicator>
        ) : userPosts.length === 0 ? (
          <S.NoContentMessage>Este usuário não tem posts.</S.NoContentMessage>
        ) : (
          userPosts.map((post) => (
            <Post key={post.id} post={post} onLikeToggle={handleLikeToggle} />
          ))
        )}
      </S.ProfileMainContent>
      <RightSidebar onFollowUser={handleFollowUser} />
      {/* Futuros Modals de Edição de Perfil e Alteração de Senha */}
      {/* {showEditProfileModal && <EditProfileModal isOpen={showEditProfileModal} onClose={() => setShowEditProfileModal(false)} user={profileUser} />} */}
      {/* <ChangePasswordModal ... /> */}
    </S.ProfilePageContainer>
  )
}
