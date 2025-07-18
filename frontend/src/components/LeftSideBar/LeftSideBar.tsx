import React, { useState } from 'react'
import { BiHash } from 'react-icons/bi'
import { FaFeatherAlt } from 'react-icons/fa'
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
import * as S from './styles'

import logo from '../../assets/images/logo-white.png'

import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LogoutDropdown from '../LogoutDropdown/LogoutDropdown'

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
      <S.SidebarLogoWrapper to="/feed">
        <S.SidebarLogo src={logo} alt="X Logo" />
      </S.SidebarLogoWrapper>
      <S.NavList>
        <S.NavItem>
          <a href="#" className="active">
            <S.StyledIconPlaceholder>
              <FiHome />
            </S.StyledIconPlaceholder>
            <span>Página Inicial</span>
          </a>
        </S.NavItem>
        <S.NavItem>
          <a href="#">
            <S.StyledIconPlaceholder>
              <FiSearch />
            </S.StyledIconPlaceholder>
            <span>Explorar</span>
          </a>
        </S.NavItem>
        <S.NavItem>
          <a href="#">
            <S.StyledIconPlaceholder>
              <BiHash />
            </S.StyledIconPlaceholder>
            <span>Explorar</span>
          </a>
        </S.NavItem>
        <S.NavItem>
          <a href="#">
            <S.StyledIconPlaceholder>
              <FiBell />
            </S.StyledIconPlaceholder>
            <span>Notificações</span>
          </a>
        </S.NavItem>
        <S.NavItem>
          <a href="#">
            <S.StyledIconPlaceholder>
              <FiMail />
            </S.StyledIconPlaceholder>
            <span>Mensagens</span>
          </a>
        </S.NavItem>
        <S.NavItem>
          <a href="#">
            <S.StyledIconPlaceholder>
              <RiFileList2Line />
            </S.StyledIconPlaceholder>
            <span>Listas</span>
          </a>
        </S.NavItem>
        <S.NavItem>
          <a href="#">
            <S.StyledIconPlaceholder>
              <IoPeopleOutline />
            </S.StyledIconPlaceholder>
            <span>Comunidades</span>
          </a>
        </S.NavItem>
        <S.NavItem>
          <a href="#">
            <S.StyledIconPlaceholder>
              <FaXTwitter />
            </S.StyledIconPlaceholder>
            <span>Premium</span>
          </a>
        </S.NavItem>
        <S.NavItem>
          <a href="#">
            <S.StyledIconPlaceholder>
              <MdOutlineVerified />
            </S.StyledIconPlaceholder>
            <span>Organizações Ver.</span>
          </a>
        </S.NavItem>
        {user && (
          <S.NavItem>
            <Link to={`/profile/${user.username}`}>
              <S.StyledIconPlaceholder>
                <FiUser />
              </S.StyledIconPlaceholder>{' '}
              <span>Perfil</span>
            </Link>
          </S.NavItem>
        )}

        <S.NavItem>
          <a href="#">
            <S.StyledIconPlaceholder>
              <FiMoreHorizontal />
            </S.StyledIconPlaceholder>
            <span>Mais</span>
          </a>
        </S.NavItem>
      </S.NavList>

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

        <FiMoreHorizontal className="icon" />
      </S.UserInfoContainer>

      {showLogoutDropdown && (
        <div style={{ position: 'relative' }}>
          <S.LogoutDropdownWrapper>
            <LogoutDropdown
              username={currentUsername}
              onLogout={logout}
              onClose={() => setShowLogoutDropdown(false)}
            />
          </S.LogoutDropdownWrapper>
        </div>
      )}
    </S.LeftSidebarContainer>
  )
}

export default LeftSidebar
