import React from 'react'
import type { PostType } from '../../types'
import Post from '../Post/Post'
import * as S from './styles'

interface MainFeedProps {
  posts: PostType[]
  onOpenCreatePostModal: () => void
  userAvatarUrl: string
  isLoadingPosts: boolean
  feedType: 'forYou' | 'following'
  setFeedType: (type: 'forYou' | 'following') => void
  // NOVO: Adicionar onLikeToggle nas props
  onLikeToggle: (postId: string | number, isCurrentlyLiked: boolean) => void
}

const MainFeed: React.FC<MainFeedProps> = ({
  posts,
  onOpenCreatePostModal,
  userAvatarUrl,
  isLoadingPosts,
  feedType,
  setFeedType,
  onLikeToggle // Desestruturar a nova prop
}) => {
  return (
    <S.MainContentContainer>
      <S.FeedHeader>
        <S.FeedHeaderTab
          className={feedType === 'forYou' ? 'active' : ''}
          onClick={() => setFeedType('forYou')}
        >
          Para você
        </S.FeedHeaderTab>
        <S.FeedHeaderTab
          className={feedType === 'following' ? 'active' : ''}
          onClick={() => setFeedType('following')}
        >
          Seguindo
        </S.FeedHeaderTab>
      </S.FeedHeader>

      <S.PostCreationSection onClick={onOpenCreatePostModal}>
        <S.PostCreationSectionAvatar src={userAvatarUrl} />
        <S.PostCreationSectionText>
          O que está acontecendo?
        </S.PostCreationSectionText>
      </S.PostCreationSection>

      {isLoadingPosts ? (
        <S.LoadingIndicator>Carregando posts...</S.LoadingIndicator>
      ) : (
        posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onLikeToggle={onLikeToggle} // <-- AGORA PASSAMOS A PROP PARA O COMPONENTE POST
          />
        ))
      )}
      {!isLoadingPosts && posts.length === 0 && (
        <S.NoPostsMessage>Nenhuma postagem para exibir.</S.NoPostsMessage>
      )}
    </S.MainContentContainer>
  )
}

export default MainFeed
