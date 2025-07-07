import { useState } from 'react'
import * as S from './styles' // Manter S para outros styled components da FeedPage

import logo from '../../assets/images/logo-white.png'
import CreatePostModal from '../../components/CreatePostModal/CreatePostModal'
import LeftSidebar from '../../components/LeftSideBar/LeftSideBar'
// REMOVIDO: import Post from '../../components/Post/Post';
import MainFeed from '../../components/MainFeed/MainFeed'
import RightSidebar from '../../components/RightSideBar/RightSideBar'

// As interfaces PostType e UserToFollowType deveriam ser movidas para um arquivo de tipos compartilhado
// para evitar duplicação. Por enquanto, as manteremos aqui até o passo de organização de tipos.

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
  isFollowing?: boolean
}

const initialTrends = [
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
      handle: '@MoveDriga',
      isFollowing: false
    },
    {
      id: 'u2',
      avatarUrl: 'https://via.placeholder.com/48/4682B4/000000?text=T',
      username: 'TechNews',
      handle: '@TechDaily',
      isFollowing: false
    },
    {
      id: 'u3',
      avatarUrl: 'https://via.placeholder.com/48/9ACD32/000000?text=A',
      username: 'ArtGallery',
      handle: '@DailyArt',
      isFollowing: false
    }
  ])

  const [showCreatePostModal, setShowCreatePostModal] = useState(false)

  const handlePostSubmit = (text: string, imageUrl?: string) => {
    if (text.trim() || imageUrl) {
      const newPost: PostType = {
        id: Date.now().toString(),
        avatarUrl: 'https://via.placeholder.com/48/008000/000000?text=YOU',
        username: 'Seu Usuário',
        handle: '@seuusuario',
        text: text,
        timestamp: 'Agora',
        comments: 0,
        retweets: 0,
        likes: 0,
        views: '0',
        imageUrl: imageUrl
      }
      setPosts((prevPosts) => [newPost, ...prevPosts])
    }
  }

  const handleFollowUser = (userId: string) => {
    setWhoToFollow((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
      )
    )
  }

  const isAnyModalOpen = showCreatePostModal

  // Avatar do usuário logado (usado na sidebar e na MainContent)
  const loggedInUserAvatar =
    'https://via.placeholder.com/48/008000/000000?text=YOU'

  return (
    <S.PageContainer className={isAnyModalOpen ? 'blurred' : ''}>
      <LeftSidebar
        logoSrc={logo}
        userAvatarUrl={loggedInUserAvatar}
        username="Fred."
        userHandle="@FredMenge"
        onPostButtonClick={() => setShowCreatePostModal(true)}
      />

      {/* NOVO: Usando o componente MainFeed */}
      <MainFeed
        posts={posts}
        onOpenCreatePostModal={() => setShowCreatePostModal(true)}
        userAvatarUrl={loggedInUserAvatar}
      />

      <RightSidebar
        trends={initialTrends}
        whoToFollow={whoToFollow}
        onFollowUser={handleFollowUser}
      />

      <CreatePostModal
        isOpen={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
        onPostSubmit={handlePostSubmit}
        userAvatarUrl={loggedInUserAvatar}
      />
    </S.PageContainer>
  )
}
