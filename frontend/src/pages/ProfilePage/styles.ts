// src/pages/ProfilePage/styles.ts
import styled from 'styled-components'
import { colors } from '../../styles'

export const ProfilePageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${colors.black};
  color: ${colors.white};
  font-family: 'Chirp', sans-serif;
  width: 100%;
  justify-content: center;

  &.blurred {
    filter: blur(5px);
    transition: filter 0.3s ease-in-out;
    pointer-events: none;
    user-select: none;
  }
`

export const ProfileMainContent = styled.main`
  flex-grow: 1;
  max-width: 600px;
  border-left: 1px solid #2f3336;
  border-right: 1px solid #2f3336;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    border-left: none;
    border-right: none;
  }
`

export const ProfileHeaderSection = styled.div`
  /* Removido padding-bottom e border-bottom aqui, pois o espaçamento é gerenciado internamente */
  display: flex;
  flex-direction: column;
  position: relative; /* Para posicionar elementos filhos */
  padding-bottom: 16px; /* Espaço para a borda inferior */
  border-bottom: 1px solid #2f3336;
`

export const CoverPhotoPlaceholder = styled.div`
  width: 100%;
  height: 200px; /* Altura da área do banner/capa */
  background-color: #333; /* Cor de fundo para simular a capa */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: ${colors.lightGray};
  position: relative; /* Para o botão de voltar */
`

export const TopBar = styled.div<{ $scrolled: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 20px;
  z-index: 2;
  background: rgba(0, 0, 0, ${({ $scrolled }) => ($scrolled ? 0.6 : 0.9)});
  backdrop-filter: blur(5px);
  transition: background 0.3s ease;
`

export const BackButton = styled.button`
  background: rgba(0, 0, 0, 0.6); /* Fundo mais escuro para o botão */
  border: none;
  color: ${colors.white};
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`

export const TopBarUserInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: ${colors.white};
  .name {
    font-weight: 700;
    font-size: 19px;
  }
  .posts-count {
    font-size: 13px;
    color: ${colors.lightGray};
  }
`

export const UserInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 16px;
`

export const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: gray;
  background-size: cover;
  background-position: center;
  border: 4px solid ${colors.black};
  margin-top: -60px; /* Puxa para cima para sobrepor a capa */
  margin-left: 16px; /* Alinha com o canto esquerdo */
  position: relative;
  z-index: 1;
`

export const ProfileActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 16px;
  margin-top: -30px;
  margin-bottom: 12px;
  z-index: 1;
`

export const ProfileName = styled.h2`
  font-size: 20px;
  font-weight: 900;
  color: ${colors.white};
  margin-bottom: 4px;
`

export const ProfileHandle = styled.p`
  font-size: 15px;
  color: ${colors.lightGray};
  margin-bottom: 12px;
`

export const ProfileBio = styled.p`
  font-size: 15px;
  color: ${colors.white};
  margin-bottom: 12px;
  line-height: 20px;
`

export const ProfileMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 15px;
  color: ${colors.lightGray};
  margin-bottom: 12px;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  svg {
    font-size: 16px;
    color: ${colors.lightGray};
  }
`

export const FollowsContainer = styled.div`
  display: flex;
  gap: 20px;
  font-size: 15px;
  margin-bottom: 16px;

  span {
    display: flex;
    align-items: center;
    font-weight: 700;
    color: ${colors.white};
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  p {
    color: ${colors.lightGray};
    margin-left: 4px;
    white-space: nowrap;
  }
`

export const ProfileTabs = styled.div`
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #2f3336;
  position: sticky;
  top: 0;
  background-color: ${colors.black};
  z-index: 10;
`

export const ProfileTab = styled.div`
  flex: 1;
  padding: 15px 0;
  text-align: center;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  color: ${colors.lightGray};
  transition: background-color 0.2s ease-in-out;
  position: relative;

  &:hover {
    background-color: #080808;
  }

  &.active {
    color: ${colors.white};
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 4px;
      background-color: #1d9bf0;
      border-radius: 2px;
    }
  }
`

export const LoadingIndicator = styled.div`
  padding: 20px;
  text-align: center;
  color: ${colors.lightGray};
  font-size: 16px;
`

export const NoContentMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: ${colors.lightGray};
  font-size: 16px;
`
