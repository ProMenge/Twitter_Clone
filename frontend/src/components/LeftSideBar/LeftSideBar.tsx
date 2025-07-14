import React, { useState } from 'react'
import { BiHash } from 'react-icons/bi'
import { FaXTwitter } from 'react-icons/fa6'
import {
  FiBell,
  FiHome,
  FiMail,
  FiMoreHorizontal,
  FiSearch,
  FiUser
} from 'react-icons/fi'
import { IoPeopleOutline } from 'react-icons/io5'
import { MdOutlineVerified } from 'react-icons/md'
import { RiFileList2Line } from 'react-icons/ri'
import icon from '../../assets/images/default-avatar-icon-of-social-media-user-vector.jpg'
import * as S from './styles'

import { useAuth } from '../../contexts/AuthContext' // NOVO: Importar useAuth
import LogoutDropdown from '../LogoutDropdown/LogoutDropdown'

interface LeftSidebarProps {
  logoSrc: string
  onPostButtonClick: () => void
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  logoSrc,
  onPostButtonClick
  // REMOVIDO: userAvatarUrl, username, userHandle, onLogout
}) => {
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false)
  const { user, logout } = useAuth() // NOVO: Obter user e logout do AuthContext

  const handleToggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation()
    setShowLogoutDropdown((prev) => !prev)
  }

  // Usar dados do 'user' do contexto, com fallbacks para caso não esteja carregado ou logado
  const currentUserAvatar = user?.avatar_url || { icon }
  const currentUsername = user?.username || '@usuario'
  const currentUserDisplayName = user?.display_name || 'Usuário'

  return (
    <S.LeftSidebarContainer>
      <S.SidebarLogo src={logoSrc} alt="X Logo" />
      <S.NavList>
        <S.NavItem>
          <a href="#" className="active">
            <S.StyledIconPlaceholder>
              <FiHome />
            </S.StyledIconPlaceholder>{' '}
            <span>Página Inicial</span>
          </a>
        </S.NavItem>
        <S.NavItem>
          <a href="#">
            <S.StyledIconPlaceholder>
              <FiSearch />
            </S.StyledIconPlaceholder>{' '}
            <span>Explorar</span>
          </a>
        </S.NavItem>
        <S.NavItem>
          <a href="#">
            <S.StyledIconPlaceholder>
              <BiHash />
            </S.StyledIconPlaceholder>{' '}
            <span>Explorar</span>
          </a>
        </S.NavItem>
        <S.NavItem>
          <a href="#">
            <S.StyledIconPlaceholder>
              <FiBell />
            </S.StyledIconPlaceholder>{' '}
            <span>Notificações</span>
          </a>
        </S.NavItem>
        <S.NavItem>
          <a href="#">
            <S.StyledIconPlaceholder>
              <FiMail />
            </S.StyledIconPlaceholder>{' '}
            <span>Mensagens</span>
          </a>
        </S.NavItem>
        <S.NavItem>
          <a href="#">
            <S.StyledIconPlaceholder>
              <RiFileList2Line />
            </S.StyledIconPlaceholder>{' '}
            <span>Listas</span>
          </a>
        </S.NavItem>
        <S.NavItem>
          <a href="#">
            <S.StyledIconPlaceholder>
              <IoPeopleOutline />
            </S.StyledIconPlaceholder>{' '}
            <span>Comunidades</span>
          </a>
        </S.NavItem>
        <S.NavItem>
          <a href="#">
            <S.StyledIconPlaceholder>
              <FaXTwitter />
            </S.StyledIconPlaceholder>{' '}
            <span>Premium</span>
          </a>
        </S.NavItem>
        <S.NavItem>
          <a href="#">
            <S.StyledIconPlaceholder>
              <MdOutlineVerified />
            </S.StyledIconPlaceholder>{' '}
            <span>Organizações Ver.</span>
          </a>
        </S.NavItem>
        <S.NavItem>
          <a href="#">
            <S.StyledIconPlaceholder>
              <FiUser />
            </S.StyledIconPlaceholder>{' '}
            <span>Perfil</span>
          </a>
        </S.NavItem>
        <S.NavItem>
          <a href="#">
            <S.StyledIconPlaceholder>
              <FiMoreHorizontal />
            </S.StyledIconPlaceholder>{' '}
            <span>Mais</span>
          </a>
        </S.NavItem>
      </S.NavList>
      <S.SidebarPostButton onClick={onPostButtonClick}>
        <span>Postar</span>
      </S.SidebarPostButton>

      <S.UserInfoContainer onClick={handleToggleDropdown}>
        <div
          className="avatar"
          style={{ backgroundImage: `url(${currentUserAvatar})` }}
        ></div>
        <div className="text-info">
          <span className="username">{currentUserDisplayName}</span>
          <span className="handle">@{currentUsername}</span>
        </div>

        <FiMoreHorizontal />

        {showLogoutDropdown && (
          <LogoutDropdown
            username={currentUsername} // Passar o username do contexto
            onLogout={logout} // Passar a função logout do contexto
            onClose={() => setShowLogoutDropdown(false)}
          />
        )}
      </S.UserInfoContainer>
    </S.LeftSidebarContainer>
  )
}

export default LeftSidebar
