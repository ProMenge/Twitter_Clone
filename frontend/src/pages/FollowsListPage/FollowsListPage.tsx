// src/pages/FollowsListPage/index.tsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom' // Importar useLocation
import { FiArrowLeft } from 'react-icons/fi' // Ícone de seta para voltar
import * as S from './styles'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

// Importar os componentes de layout
import LeftSidebar from '../../components/LeftSideBar/LeftSideBar'
import RightSidebar from '../../components/RightSideBar/RightSideBar'

// Importar tipos
import type { UserToFollowType, AuthSuccessResponse } from '../../types'
import { AxiosError } from 'axios'

type ProfileUserType = AuthSuccessResponse['user']

export default function FollowsListPage() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { user: authenticatedUser, isAuthenticated, isLoadingAuth } = useAuth()

  const [profileUser, setProfileUser] = useState<ProfileUserType | null>(null)
  const [followsList, setFollowsList] = useState<UserToFollowType[]>([])
  const [isLoadingList, setIsLoadingList] = useState(true)
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(
    'followers'
  )

  useEffect(() => {
    if (location.pathname.includes('/following')) {
      setActiveTab('following')
    } else if (location.pathname.includes('/followers')) {
      setActiveTab('followers')
    }
  }, [location.pathname])

  useEffect(() => {
    const fetchProfileAndList = async () => {
      setIsLoadingList(true)
      setProfileUser(null)

      try {
        const profileResponse = await api.get<ProfileUserType>(
          `users/${username}/`
        )
        setProfileUser(profileResponse.data)

        let listResponse
        if (activeTab === 'followers') {
          listResponse = await api.get<UserToFollowType[]>(
            `users/${username}/followers/`
          )
        } else {
          listResponse = await api.get<UserToFollowType[]>(
            `users/${username}/following/`
          )
        }
        setFollowsList(listResponse.data)
      } catch (error) {
        console.error('Erro ao buscar lista de seguidores/seguidos:', error)
        setFollowsList([])
        setProfileUser(null)
        if (error instanceof AxiosError && error.response?.status === 404) {
          navigate('/not-found')
        } else if (
          error instanceof AxiosError &&
          error.response?.status === 401 &&
          !isAuthenticated
        ) {
          // Se não autenticado e 401, redireciona para login
          navigate('/')
        }
      } finally {
        setIsLoadingList(false)
      }
    }

    if (!isLoadingAuth && username) {
      // Buscar apenas se o username estiver na URL e autenticação carregada
      fetchProfileAndList()
    }
  }, [username, activeTab, isAuthenticated, isLoadingAuth, navigate]) // Dependências atualizadas

  // === Handler para seguir/deixar de seguir (passado para UserListItem) ===
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
      // Otimista: atualiza o estado local da lista de follows
      setFollowsList((prev) =>
        prev.map((user) => {
          if (user.id === userId) {
            return { ...user, is_followed_by_viewer: !isCurrentlyFollowing }
          }
          return user
        })
      )
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir:', error)
    }
  }

  // Renderiza um spinner ou tela de carregamento
  if (isLoadingAuth || isLoadingList || !profileUser) {
    return (
      <S.FollowsPageContainer>
        <LeftSidebar onPostButtonClick={() => {}} />
        <S.FollowsMainContent>
          <S.LoadingIndicator>Carregando lista...</S.LoadingIndicator>
        </S.FollowsMainContent>
        <RightSidebar onFollowUser={handleFollowUser} />
      </S.FollowsPageContainer>
    )
  }

  if (!isAuthenticated && !profileUser) {
    navigate('/')
    return null
  }

  return (
    <S.FollowsPageContainer>
      <LeftSidebar onPostButtonClick={() => {}} />

      <S.FollowsMainContent>
        <S.FollowsHeader>
          <S.TopBar>
            <S.BackButton onClick={() => navigate(`/profile/${username}`)}>
              <FiArrowLeft />
            </S.BackButton>
            <S.UserInfoTitle>
              <span className="display-name">{profileUser.display_name}</span>
              <span className="handle">@{profileUser.username}</span>
            </S.UserInfoTitle>
          </S.TopBar>
          <S.FollowsTabs>
            <S.FollowTab
              className={activeTab === 'followers' ? 'active' : ''}
              onClick={() => navigate(`/profile/${username}/followers`)}
            >
              Seguidores
            </S.FollowTab>
            <S.FollowTab
              className={activeTab === 'following' ? 'active' : ''}
              onClick={() => navigate(`/profile/${username}/following`)}
            >
              Seguindo
            </S.FollowTab>
          </S.FollowsTabs>
        </S.FollowsHeader>

        {isLoadingList ? (
          <S.LoadingIndicator>Carregando lista...</S.LoadingIndicator>
        ) : followsList.length === 0 ? (
          <S.NoContentMessage>
            {activeTab === 'following'
              ? 'Ninguém sendo seguido.'
              : 'Nenhum seguidor.'}
          </S.NoContentMessage>
        ) : (
          followsList.map((userItem) => (
            <S.UserListItem key={userItem.id}>
              <div className="user-info">
                <div
                  className="avatar"
                  style={{
                    backgroundImage: `url(${userItem.avatar_url})`,
                    backgroundSize: 'cover'
                  }}
                ></div>
                <div className="text-details">
                  <span className="display-name">{userItem.display_name}</span>
                  <span className="username">@{userItem.username}</span>
                </div>
              </div>
              {isAuthenticated && userItem.id !== authenticatedUser?.id && (
                <S.FollowButton
                  variant={
                    userItem.is_followed_by_viewer ? 'secondary' : 'primary'
                  }
                  onClick={() =>
                    handleFollowUser(
                      userItem.id,
                      !!userItem.is_followed_by_viewer
                    )
                  }
                >
                  {userItem.is_followed_by_viewer ? 'Seguindo' : 'Seguir'}
                </S.FollowButton>
              )}
            </S.UserListItem>
          ))
        )}
      </S.FollowsMainContent>

      <RightSidebar onFollowUser={handleFollowUser} />
    </S.FollowsPageContainer>
  )
}
