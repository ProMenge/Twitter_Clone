import React, { useEffect, useState } from 'react' // Adicionado useEffect e useState
import { FiSearch } from 'react-icons/fi'
import * as S from './styles'

import api from '../../services/api' // Importar o serviço de API
import { useAuth } from '../../contexts/AuthContext' // Importar useAuth

import type { TrendType, UserToFollowType } from '../../types' // Importar tipos

interface RightSidebarProps {
  // REMOVIDO: trends: TrendType[]; // Não será mais passado como prop
  // REMOVIDO: whoToFollow: UserToFollowType[]; // Não será mais passado como prop
  onFollowUser: (userId: number | string, isCurrentlyFollowing: boolean) => void // Ação de seguir, ainda vem de fora
  // REMOVIDO: isLoadingWhoToFollow: boolean; // Será um estado interno
}

// Mover initialTrends para fora do componente (se for constante)
const initialTrends: TrendType[] = [
  { category: 'Esporte', hashtag: 'Diogo Jota', tweets: '1,38 mi posts' },
  {
    category: 'Assunto do Momento',
    hashtag: '#TopicoLegal',
    tweets: '10 mil posts'
  }
]

const RightSidebar: React.FC<RightSidebarProps> = ({
  // REMOVIDO: trends, whoToFollow, isLoadingWhoToFollow
  onFollowUser // Ainda recebemos onFollowUser
}) => {
  // NOVO: Estados internos para gerenciar 'Quem seguir'
  const [whoToFollow, setWhoToFollow] = useState<UserToFollowType[]>([])
  const [isLoadingWhoToFollow, setIsLoadingWhoToFollow] = useState(true)

  const { isAuthenticated, isLoadingAuth } = useAuth() // Para verificar autenticação

  // NOVO: Lógica de Busca de Sugestões (movida para cá)
  useEffect(() => {
    const fetchWhoToFollowData = async () => {
      setIsLoadingWhoToFollow(true)
      try {
        if (!isAuthenticated) {
          console.warn(
            'Usuário não autenticado. Não é possível carregar sugestões.'
          )
          setWhoToFollow([])
          setIsLoadingWhoToFollow(false)
          return
        }
        const response = await api.get<UserToFollowType[]>('who-to-follow/')
        setWhoToFollow(response.data)
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error)
        setWhoToFollow([])
      } finally {
        setIsLoadingWhoToFollow(false)
      }
    }

    // Apenas busca sugestões se não estiver no carregamento inicial de autenticação
    if (!isLoadingAuth) {
      fetchWhoToFollowData()
    }
    // Adicionar isAuthenticated e isLoadingAuth às dependências
  }, [isAuthenticated, isLoadingAuth])

  // NOVO: Handler de Follow para atualizar o estado interno após a ação
  // Esta função é uma versão modificada do handleFollowUser que estava em FeedPage.
  // Ela ainda pode chamar o onFollowUser recebido de FeedPage para que FeedPage possa reagir (ex: refetch posts)
  const handleFollowUserInternal = async (
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
        console.log(`Deixou de seguir usuário ${userId}`)
      } else {
        await api.post(`users/${userId}/follow/`)
        console.log(`Começou a seguir usuário ${userId}`)
      }
      // Atualização otimista do estado interno
      setWhoToFollow((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                is_followed_by_viewer: !isCurrentlyFollowing
              }
            : user
        )
      )
      onFollowUser(userId, isCurrentlyFollowing)
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir:', error)
    }
  }

  return (
    <S.RightSidebarContainer>
      <S.SearchBar>
        <FiSearch />
        <input type="text" placeholder="Buscar" />
      </S.SearchBar>

      <S.SectionBox>
        <S.SectionTitle>Assine o Premium</S.SectionTitle>
        <p>
          Assine para desbloquear novos recursos e, se elegível, receba uma
          parte da receita.
        </p>
        <S.PremiumButton>Assinar</S.PremiumButton>
      </S.SectionBox>

      <S.SectionBox>
        <S.SectionTitle>O que está acontecendo</S.SectionTitle>
        {initialTrends.map(
          (
            trend,
            index // initialTrends agora é usado diretamente
          ) => (
            <S.TrendItem key={index}>
              <p className="category">{trend.category}</p>
              <p className="hashtag">{trend.hashtag}</p>
              {trend.tweets && <p className="tweets-count">{trend.tweets}</p>}
            </S.TrendItem>
          )
        )}
      </S.SectionBox>

      <S.SectionBox>
        <S.SectionTitle>Quem seguir</S.SectionTitle>
        {isLoadingWhoToFollow ? (
          <S.LoadingIndicator>Carregando sugestões...</S.LoadingIndicator>
        ) : (
          <>
            {whoToFollow.length === 0 ? (
              <S.NoSuggestionsMessage>
                Nenhuma sugestão para exibir.
              </S.NoSuggestionsMessage>
            ) : (
              whoToFollow.map((user) => (
                <S.WhoToFollowItem key={user.id}>
                  <div className="user-info">
                    <div
                      className="avatar"
                      style={{
                        backgroundImage: `url(${user.avatar_url})`,
                        backgroundSize: 'cover'
                      }}
                    ></div>
                    <div className="text-details">
                      <span className="username">{user.display_name}</span>
                      <span className="handle">@{user.username}</span>
                    </div>
                  </div>
                  <S.FollowButton
                    onClick={
                      () =>
                        handleFollowUserInternal(
                          user.id,
                          !!user.is_followed_by_viewer
                        ) // Chamar handler interno
                    }
                  >
                    {user.is_followed_by_viewer ? 'Seguindo' : 'Seguir'}
                  </S.FollowButton>
                </S.WhoToFollowItem>
              ))
            )}
          </>
        )}
      </S.SectionBox>

      <S.SidebarFooter>
        <a href="#">Termos de Serviço</a>
        <a href="#">Política de Privacidade</a>
        <a href="#">Política de cookies</a>
        <a href="#">Acessibilidade</a>
        <a href="#">Informações de anúncios</a>
        <a href="#">Blog</a>
        <a href="#">Status</a>
        <a href="#">Carreiras</a>
        <a href="#">Recursos da Marca</a>
        <a href="#">Marketing</a>
        <a href="#">X para empresas</a>
        <a href="#">Desenvolvedores</a>
        <a href="#">Diretório</a>
        <a href="#">Configurações</a>
        <span>&copy; 2025 X Corp.</span>
      </S.SidebarFooter>
    </S.RightSidebarContainer>
  )
}

export default RightSidebar
