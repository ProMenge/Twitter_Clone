import React, { useState } from 'react' // Importar useState
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
import * as S from './styles'

import LogoutDropdown from '../LogoutDropdown/LogoutDropdown'

interface LeftSidebarProps {
  logoSrc: string
  userAvatarUrl: string
  username: string
  userHandle: string
  onPostButtonClick: () => void
  onLogout: () => void // NOVO: Prop para lidar com o logout
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  logoSrc,
  userAvatarUrl,
  username,
  userHandle,
  onPostButtonClick,
  onLogout // Desestruturar nova prop
}) => {
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false) // NOVO: Estado para controlar a visibilidade do dropdown

  const handleToggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation() // Impede que o clique se propague e feche o modal pai, se houver
    setShowLogoutDropdown((prev) => !prev)
  }

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

      {/* NOVO: UserInfoContainer agora tem onClick para o dropdown */}
      <S.UserInfoContainer onClick={handleToggleDropdown}>
        <div
          className="avatar"
          style={{ backgroundImage: `url(${userAvatarUrl})` }}
        ></div>
        <div className="text-info">
          <span className="username">{username}</span>
          <span className="handle">@{userHandle}</span>
        </div>

        {/* Renderiza o LogoutDropdown condicionalmente */}
        {showLogoutDropdown && (
          <LogoutDropdown
            username={userHandle} // Ou username, dependendo de qual deseja exibir
            onLogout={onLogout}
            onClose={() => setShowLogoutDropdown(false)}
          />
        )}
      </S.UserInfoContainer>
    </S.LeftSidebarContainer>
  )
}

export default LeftSidebar
