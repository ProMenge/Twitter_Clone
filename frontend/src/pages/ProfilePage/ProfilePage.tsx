import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { FiArrowLeft, FiCalendar, FiLink, FiMapPin } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import * as S from './styles'

import LeftSidebar from '../../components/LeftSideBar/LeftSideBar'
import Post from '../../components/Post/Post'
import RightSidebar from '../../components/RightSideBar/RightSideBar'

import { AxiosError } from 'axios'
import Button from '../../components/Button/Button'
import ChangePasswordModal from '../../components/ChangePasswordModal/ChangePasswordModal'
import EditProfileModal from '../../components/EditProfileModal/EditProfileModal'
import type { AuthSuccessResponse, PostType } from '../../types'

type ProfileUserType = AuthSuccessResponse['user']

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const {
    user: authenticatedUser,
    isAuthenticated,
    isLoadingAuth,
    login
  } = useAuth()

  const [profileUser, setProfileUser] = useState<ProfileUserType | null>(null)
  const [userPosts, setUserPosts] = useState<PostType[]>([])
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoadingProfile(true)
      try {
        const response = await api.get<ProfileUserType>(`users/${username}/`)
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
        const response = await api.get<PostType[]>(`/users/${username}/posts`)
        setUserPosts(response.data)
      } catch (error) {
        console.error('Erro ao buscar posts do usuário:', error)
        setUserPosts([])
      } finally {
        setIsLoadingPosts(false)
      }
    }

    if (username) {
      fetchProfileData()
      fetchUserPosts()
    }
  }, [username, navigate])

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
        await api.delete(`users/${userId}/unfollow/`)
      } else {
        await api.post(`users/${userId}/follow/`)
      }

      setProfileUser((prev) => {
        if (!prev) return null

        const followers_count = isCurrentlyFollowing
          ? prev.followers_count - 1
          : prev.followers_count + 1

        const following_count = isOwnProfile
          ? isCurrentlyFollowing
            ? prev.following_count - 1
            : prev.following_count + 1
          : prev.following_count

        return {
          ...prev,
          is_followed_by_viewer: !isCurrentlyFollowing,
          followers_count,
          following_count
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

  const handleProfileUpdated = (updatedUser: ProfileUserType) => {
    setProfileUser(updatedUser)

    if (isAuthenticated && authenticatedUser?.id === updatedUser.id) {
      const currentAccessToken = localStorage.getItem('access_token') || ''
      const currentRefreshToken = localStorage.getItem('refresh_token') || ''
      login(currentAccessToken, currentRefreshToken, updatedUser)
    }

    setUserPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.user.id === updatedUser.id
          ? {
              ...post,
              user: {
                ...post.user,
                display_name: updatedUser.display_name,
                avatar_url: updatedUser.avatar_url
              }
            }
          : post
      )
    )
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
      <LeftSidebar onPostButtonClick={() => {}} />
      <S.ProfileMainContent>
        <S.ProfileHeaderSection>
          <S.TopBar $scrolled={scrolled}>
            <S.BackButton onClick={() => navigate('/feed')}>
              <FiArrowLeft />
            </S.BackButton>
            <S.TopBarUserInfo>
              <span className="name">{profileUser.display_name}</span>
              <span className="posts-count">{userPosts.length} posts</span>
            </S.TopBarUserInfo>
          </S.TopBar>

          <S.CoverPhotoPlaceholder
            style={{
              backgroundImage: profileUser.banner_url
                ? `url(${profileUser.banner_url})`
                : 'linear-gradient(to right, #0f172a, #1e293b)'
            }}
          />

          <S.ProfileAvatar
            style={{ backgroundImage: `url(${profileUser.avatar_url})` }}
          />

          <S.ProfileActions>
            {isOwnProfile ? (
              <>
                <Button
                  variant="secondary"
                  size="medium"
                  onClick={() => setShowEditProfileModal(true)}
                >
                  Editar perfil
                </Button>
                <Button
                  variant="secondary"
                  size="medium"
                  onClick={() => setShowChangePasswordModal(true)}
                >
                  Alterar senha
                </Button>
              </>
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
              <span
                onClick={() =>
                  navigate(`/profile/${profileUser.username}/following`)
                }
                style={{ cursor: 'pointer' }}
              >
                {profileUser.following_count} <p>Seguindo</p>
              </span>
              <span
                onClick={() =>
                  navigate(`/profile/${profileUser.username}/followers`)
                }
                style={{ cursor: 'pointer' }}
              >
                {profileUser.followers_count} <p>Seguidores</p>
              </span>
            </S.FollowsContainer>
          </S.UserInfoBox>
        </S.ProfileHeaderSection>

        <S.ProfileTabs>
          <S.ProfileTab className="active">Posts</S.ProfileTab>
          <S.ProfileTab>Respostas</S.ProfileTab>
          <S.ProfileTab>Mídia</S.ProfileTab>
          <S.ProfileTab>Curtidas</S.ProfileTab>
        </S.ProfileTabs>

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

      {showEditProfileModal && profileUser && (
        <EditProfileModal
          isOpen={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
          user={profileUser}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {showChangePasswordModal && (
        <ChangePasswordModal
          isOpen={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}
    </S.ProfilePageContainer>
  )
}
