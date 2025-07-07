import React from 'react'
import { FiSearch } from 'react-icons/fi' // Ícone de busca
import * as S from './styles' // Importa os estilos locais

// Reutilizando interfaces de tipos que já temos
interface TrendType {
  category: string
  hashtag: string
  tweets: string
}

interface UserToFollowType {
  id: string
  avatarUrl: string
  username: string
  handle: string
  // Adiciona a prop opcional isFollowing, que você pode querer controlar aqui
  isFollowing?: boolean
}

// Definindo as props que este componente RightSidebar irá receber
interface RightSidebarProps {
  trends: TrendType[] // Array de tendências
  whoToFollow: UserToFollowType[] // Array de sugestões de quem seguir
  onFollowUser: (userId: string) => void // Handler para a ação de seguir/deixar de seguir
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  trends,
  whoToFollow,
  onFollowUser
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
        {whoToFollow.map((user) => (
          <S.WhoToFollowItem key={user.id}>
            <div className="user-info">
              <div
                className="avatar"
                style={{
                  backgroundImage: `url(${user.avatarUrl})`,
                  backgroundSize: 'cover'
                }}
              ></div>
              <div className="text-details">
                <span className="username">{user.username}</span>
                <span className="handle">{user.handle}</span>
              </div>
            </div>
            {/* O texto do botão pode ser condicional se houver isFollowing */}
            <S.FollowButton onClick={() => onFollowUser(user.id)}>
              {user.isFollowing ? 'Seguindo' : 'Seguir'}{' '}
              {/* Texto condicional */}
            </S.FollowButton>
          </S.WhoToFollowItem>
        ))}
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
