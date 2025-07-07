import React from 'react'
import Post from '../Post/Post' // Caminho relativo para o componente Post
import * as S from './styles' // Importa os estilos locais

// Reutilizando a interface de tipos PostType
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

// Definindo as props que este componente MainFeed irá receber
interface MainFeedProps {
  posts: PostType[] // Array de posts para exibir
  onOpenCreatePostModal: () => void // Handler para abrir o modal de criação de post
  // onPostSubmit é uma prop para o CreatePostModal, não para o MainFeed.
  // Será passado de FeedPage para CreatePostModal diretamente.
  // User avatar URL for the "What's happening?" section
  userAvatarUrl: string
}

const MainFeed: React.FC<MainFeedProps> = ({
  posts,
  onOpenCreatePostModal,
  userAvatarUrl
}) => {
  return (
    <S.MainContentContainer>
      <S.FeedHeader>
        <S.FeedHeaderTab className="active">Para você</S.FeedHeaderTab>
        <S.FeedHeaderTab>Seguindo</S.FeedHeaderTab>
      </S.FeedHeader>

      <S.PostCreationSection onClick={onOpenCreatePostModal}>
        <S.PostCreationSectionAvatar src={userAvatarUrl} />
        <S.PostCreationSectionText>
          O que está acontecendo?
        </S.PostCreationSectionText>
      </S.PostCreationSection>

      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
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
    </S.MainContentContainer>
  )
}

export default MainFeed
