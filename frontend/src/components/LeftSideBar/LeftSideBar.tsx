import React, { useState } from 'react'
import * as S from './styles'
import {
  FiHome,
  FiSearch,
  FiBell,
  FiMail,
  FiUser,
  FiMoreHorizontal
} from 'react-icons/fi'
import { FaXTwitter } from 'react-icons/fa6'
import { BiHash } from 'react-icons/bi'
import { RiFileList2Line } from 'react-icons/ri'
import { IoPeopleOutline } from 'react-icons/io5'
import { MdOutlineVerified } from 'react-icons/md'
import { FaFeatherAlt } from 'react-icons/fa'

import logo from '../../assets/images/logo-white.png'

import LogoutDropdown from '../LogoutDropdown/LogoutDropdown'
import { useAuth } from '../../contexts/AuthContext'

interface LeftSidebarProps {
  onPostButtonClick: () => void
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onPostButtonClick }) => {
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false)
  const { user, logout } = useAuth()

  const handleToggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation()
    setShowLogoutDropdown((prev) => !prev)
  }

  const currentUserAvatar =
    user?.avatar_url || 'https://via.placeholder.com/40/CCCCCC/000000?text=U'
  const currentUsername = user?.username || '@usuario'
  const currentUserDisplayName = user?.display_name || 'Usuário'

  return (
    <S.LeftSidebarContainer>
      <S.SidebarLogo src={logo} alt="X Logo" />
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

      {/* Botão "Postar" - Agora com ícone e texto controlados por CSS */}
      <S.SidebarPostButton onClick={onPostButtonClick}>
        <S.StyledIconPlaceholder className="post-icon">
          <FaFeatherAlt />
        </S.StyledIconPlaceholder>
        <span className="post-text">Postar</span>
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
            username={currentUsername}
            onLogout={logout}
            onClose={() => setShowLogoutDropdown(false)}
          />
        )}
      </S.UserInfoContainer>
    </S.LeftSidebarContainer>
  )
}

export default LeftSidebar
