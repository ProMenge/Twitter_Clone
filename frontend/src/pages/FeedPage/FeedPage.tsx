import * as S from './styles'
import { useState } from 'react'
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

import Post from '../../components/Post/Post'
import CreatePostModal from '../../components/CreatePostModal/CreatePostModal' // Importar o CreatePostModal
import logo from '../../assets/images/logo-white.png' // Certifique-se de que o caminho do logo está correto

interface PostType {
  id: string
  avatarUrl: string
  username: string
  handle: string
  text: string
  timestamp: string
  comments: number
  retweets: number
  likes: number
  views: string
  imageUrl?: string
}

interface UserToFollowType {
  id: string
  avatarUrl: string
  username: string
  handle: string
}

export default function FeedPage() {
  const [posts, setPosts] = useState<PostType[]>([
    {
      id: '1',
      avatarUrl: 'https://via.placeholder.com/48/FF00FF/000000?text=S',
      username: 'Sam',
      handle: '@MoonWhisper',
      text: 'Análise: Nakaba e sua arte de esconder verdades na nossa cara o tempo todo — a thread 🤍. #SevenDeadlySins #NanatsuNoTaizai',
      timestamp: '18 h',
      comments: 11,
      retweets: 42,
      likes: 512,
      views: '23 mil',
      imageUrl: 'https://via.placeholder.com/500x300?text=Imagem+do+Post'
    },
    {
      id: '2',
      avatarUrl: 'https://via.placeholder.com/48/00FFFF/000000?text=D',
      username: 'DevMaster',
      handle: '@CodingGuru',
      text: 'Acabou de lançar um novo tutorial sobre React Hooks avançados! 🚀 Confiram o link na bio. #React #JavaScript #WebDev',
      timestamp: '2 h',
      comments: 5,
      retweets: 15,
      likes: 80,
      views: '2.5 mil'
    },
    {
      id: '3',
      avatarUrl: 'https://via.placeholder.com/48/FF00FF/000000?text=S',
      username: 'Sam',
      handle: '@MoonWhisper',
      text: 'Hoje é um ótimo dia para reler seus mangás favoritos! Qual o de vocês? #Manga #Anime',
      timestamp: '5 min',
      comments: 2,
      retweets: 1,
      likes: 10,
      views: '100'
    }
  ])

  const [whoToFollow, setWhoToFollow] = useState<UserToFollowType[]>([
    {
      id: 'u1',
      avatarUrl: 'https://via.placeholder.com/48/FF6347/000000?text=M',
      username: 'Move!!',
      handle: '@MoveDriga'
    },
    {
      id: 'u2',
      avatarUrl: 'https://via.placeholder.com/48/4682B4/000000?text=T',
      username: 'TechNews',
      handle: '@TechDaily'
    },
    {
      id: 'u3',
      avatarUrl: 'https://via.placeholder.com/48/9ACD32/000000?text=A',
      username: 'ArtGallery',
      handle: '@DailyArt'
    }
  ])

  // NOVO ESTADO: Controla a visibilidade do CreatePostModal
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)

  // Função para adicionar um novo post (agora recebe text E imageUrl)
  const handlePostSubmit = (text: string, imageUrl?: string) => {
    if (text.trim() || imageUrl) {
      // Posta se tiver texto OU imagem
      const newPost: PostType = {
        id: Date.now().toString(),
        avatarUrl: 'https://via.placeholder.com/48/008000/000000?text=YOU', // Avatar do usuário logado (placeholder)
        username: 'Seu Usuário',
        handle: '@seuusuario',
        text: text,
        timestamp: 'Agora',
        comments: 0,
        retweets: 0,
        likes: 0,
        views: '0',
        imageUrl: imageUrl // Passa a URL da imagem aqui
      }
      setPosts((prevPosts) => [newPost, ...prevPosts])
      // O modal será fechado automaticamente pelo próprio CreatePostModal após submeter
    }
  }

  const handleFollowUser = (userId: string) => {
    setWhoToFollow((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
      )
    )
  }

  const trends = [
    { category: 'Esporte', hashtag: 'Diogo Jota', tweets: '1,38 mi posts' },
    {
      category: 'Assunto do Momento no Brasil',
      hashtag: '#WimbledonESPN',
      tweets: '45 mil posts'
    },
    {
      category: 'Assunto do Momento no Brasil',
      hashtag: 'Censura',
      tweets: '65 mil posts'
    },
    { category: 'Entretenimento', hashtag: 'Samuca TV', tweets: '' }
  ]

  // Para o efeito de blur na página inteira quando o modal estiver aberto
  const isAnyModalOpen = showCreatePostModal // Adapte se tiver outros modais

  return (
    // Aplica a classe 'blurred' ao container principal se qualquer modal estiver aberto
    <S.PageContainer className={isAnyModalOpen ? 'blurred' : ''}>
      <S.LeftSidebar>
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
        {/* Botão "Postar" na sidebar que abre o modal */}
        <S.PostButton onClick={() => setShowCreatePostModal(true)}>
          <span>Postar</span>
        </S.PostButton>
        <S.UserInfoContainer>
          <div className="avatar"></div>
          <div className="text-info">
            <span className="username">Fred.</span>
            <span className="handle">@FredMenge</span>
          </div>
        </S.UserInfoContainer>
      </S.LeftSidebar>

      <S.MainContent>
        <S.FeedHeader>
          <S.FeedHeaderTab className="active">Para você</S.FeedHeaderTab>
          <S.FeedHeaderTab>Seguindo</S.FeedHeaderTab>
        </S.FeedHeader>

        <S.PostCreationSection onClick={() => setShowCreatePostModal(true)}>
          <S.PostCreationSectionAvatar src="https://via.placeholder.com/48/008000/000000?text=YOU" />{' '}
          <S.PostCreationSectionText>
            O que está acontecendo?
          </S.PostCreationSectionText>{' '}
        </S.PostCreationSection>

        {posts.map((post) => (
          <Post
            key={post.id}
            id={post.id} // Certifique-se que o componente Post espera 'id'
            avatarUrl={post.avatarUrl}
            username={post.username}
            handle={post.handle}
            text={post.text}
            timestamp={post.timestamp}
            comments={post.comments}
            retweets={post.retweets}
            likes={post.likes}
            views={post.views}
            imageUrl={post.imageUrl}
          />
        ))}
      </S.MainContent>

      <S.RightSidebar>
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
          {trends.map((trend, index) => (
            <S.TrendItem key={index}>
              <p className="category">{trend.category}</p>
              <p className="hashtag">{trend.hashtag}</p>
              {trend.tweets && <p className="tweets-count">{trend.tweets}</p>}
            </S.TrendItem>
          ))}
        </S.SectionBox>

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
              <S.FollowButton onClick={() => handleFollowUser(user.id)}>
                Seguir
              </S.FollowButton>
            </S.WhoToFollowItem>
          ))}
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
      </S.RightSidebar>

      {/* Renderiza o CreatePostModal condicionalmente */}
      <CreatePostModal
        isOpen={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
        onPostSubmit={handlePostSubmit}
        userAvatarUrl="https://via.placeholder.com/48/008000/000000?text=YOU" // Avatar do usuário logado
      />
    </S.PageContainer>
  )
}
