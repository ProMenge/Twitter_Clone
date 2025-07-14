import React from 'react'
import { FiSearch } from 'react-icons/fi'
import * as S from './styles'

import type { TrendType, UserToFollowType } from '../../types'

interface RightSidebarProps {
  trends: TrendType[]
  whoToFollow: UserToFollowType[] // Recebe o array de UserToFollowType
  onFollowUser: (userId: number | string, isCurrentlyFollowing: boolean) => void
  isLoadingWhoToFollow: boolean // NOVO: Estado de carregamento
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  trends,
  whoToFollow,
  onFollowUser,
  isLoadingWhoToFollow // Desestruturar nova prop
}) => {
  return (
    <S.RightSidebarContainer>
      <S.SearchBar>
        <FiSearch />
        <input type="text" placeholder="Buscar" />
      </S.SearchBar>

      {/* Assine o Premium Section */}
      <S.SectionBox>
        <S.SectionTitle>Assine o Premium</S.SectionTitle>
        <p>
          Assine para desbloquear novos recursos e, se elegível, receba uma
          parte da receita.
        </p>
        <S.PremiumButton>Assinar</S.PremiumButton>
      </S.SectionBox>

      {/* O que está acontecendo Section (Trends) */}
      <S.SectionBox>
        <S.SectionTitle>O que está acontecendo</S.SectionTitle>
        {trends.map((trend, index) => (
          <S.TrendItem key={index}>
            <p className="category">{trend.category}</p>
            <p className="hashtag">{trend.hashtag}</p>
            {trend.tweets && <p className="tweets-count">{trend.tweets}</p>}
          </S.TrendItem>
        ))}
      </S.SectionBox>

      {/* Quem seguir Section */}
      <S.SectionBox>
        <S.SectionTitle>Quem seguir</S.SectionTitle>
        {isLoadingWhoToFollow ? ( // Exibir carregando ou sugestões
          <S.LoadingIndicator>Carregando sugestões...</S.LoadingIndicator> // Adicione este estilo em styles.ts
        ) : (
          <>
            {whoToFollow.length === 0 ? (
              <S.NoSuggestionsMessage>
                Nenhuma sugestão para exibir.
              </S.NoSuggestionsMessage> // Adicione este estilo em styles.ts
            ) : (
              whoToFollow.map((user) => (
                <S.WhoToFollowItem key={user.id}>
                  <div className="user-info">
                    <div
                      className="avatar"
                      style={{
                        backgroundImage: `url(${user.avatar_url})`, // Usar user.avatar_url
                        backgroundSize: 'cover'
                      }}
                    ></div>
                    <div className="text-details">
                      <span className="username">{user.display_name}</span>{' '}
                      {/* Usar display_name */}
                      <span className="handle">@{user.username}</span>{' '}
                      {/* Usar username */}
                    </div>
                  </div>
                  <S.FollowButton
                    onClick={() =>
                      onFollowUser(user.id, !!user.is_followed_by_viewer)
                    } // Passar id e is_followed_by_viewer
                  >
                    {user.is_followed_by_viewer ? 'Seguindo' : 'Seguir'}
                  </S.FollowButton>
                </S.WhoToFollowItem>
              ))
            )}
          </>
        )}
      </S.SectionBox>

      {/* Footer da Sidebar Direita */}
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
