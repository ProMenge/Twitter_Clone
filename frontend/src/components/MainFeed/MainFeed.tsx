import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
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
  onLikeToggle: (postId: string | number, isCurrentlyLiked: boolean) => void
}

const MainFeed: React.FC<MainFeedProps> = ({
  posts,
  onOpenCreatePostModal,
  userAvatarUrl,
  isLoadingPosts,
  feedType,
  setFeedType,
  onLikeToggle
}) => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const goToProfile = () => {
    if (user?.username) {
      navigate(`/profile/${user.username}`)
    }
  }

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

      <S.PostCreationSection>
        <S.PostCreationSectionAvatar
          src={userAvatarUrl}
          onClick={goToProfile}
        />
        <S.PostCreationSectionText onClick={onOpenCreatePostModal}>
          O que está acontecendo?
        </S.PostCreationSectionText>
      </S.PostCreationSection>

      {isLoadingPosts ? (
        <S.LoadingIndicator>Carregando posts...</S.LoadingIndicator>
      ) : (
        posts.map((post) => (
          <Post key={post.id} post={post} onLikeToggle={onLikeToggle} />
        ))
      )}
      {!isLoadingPosts && posts.length === 0 && (
        <S.NoPostsMessage>Nenhuma postagem para exibir.</S.NoPostsMessage>
      )}
    </S.MainContentContainer>
  )
}

export default MainFeed
