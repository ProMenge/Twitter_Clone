import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import * as S from './styles'

import CommentSection from '../../components/CommentSection/CommentSection'
import LeftSidebar from '../../components/LeftSideBar/LeftSideBar'
import PostDetail from '../../components/PostDetail/PostDetail'
import RightSidebar from '../../components/RightSideBar/RightSideBar'
import type { PostType } from '../../types'

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, isLoadingAuth } = useAuth()
  const [post, setPost] = useState<PostType | null>(null)
  const [isLoadingPost, setIsLoadingPost] = useState(true)
  const handleFollowUser = () => {}

  const handleLikeToggle = async (
    postId: string | number,
    isCurrentlyLiked: boolean
  ) => {
    try {
      if (!isAuthenticated) {
        console.warn('Você precisa estar logado para curtir.')
        return
      }

      await api.post(`posts/${postId}/like/`)

      setPost((prevPost) => {
        if (!prevPost) return prevPost
        return {
          ...prevPost,
          is_liked_by_viewer: !isCurrentlyLiked,
          likes_count: isCurrentlyLiked
            ? prevPost.likes_count - 1
            : prevPost.likes_count + 1
        }
      })
    } catch (error) {
      console.error('Erro ao curtir/descurtir post:', error)
    }
  }

  useEffect(() => {
    const fetchPostDetails = async () => {
      setIsLoadingPost(true)
      setPost(null)

      try {
        const postResponse = await api.get<PostType>(`posts/${postId}/`)
        setPost(postResponse.data)
      } catch (error) {
        console.error('Erro ao buscar post:', error)
        setPost(null)
        if (error instanceof AxiosError && error.response?.status === 404) {
          navigate('/not-found')
        } else if (
          error instanceof AxiosError &&
          error.response?.status === 401 &&
          !isAuthenticated
        ) {
          navigate('/')
        }
      } finally {
        setIsLoadingPost(false)
      }
    }

    if (!isLoadingAuth && postId) {
      fetchPostDetails()
    }
  }, [postId, isAuthenticated, isLoadingAuth, navigate])

  if (isLoadingAuth || isLoadingPost) {
    return (
      <S.PostDetailPageContainer>
        <LeftSidebar onPostButtonClick={() => {}} />
        <S.PostDetailMainContent>
          <S.LoadingIndicator>Carregando post...</S.LoadingIndicator>
        </S.PostDetailMainContent>
        <RightSidebar onFollowUser={handleFollowUser} />
      </S.PostDetailPageContainer>
    )
  }

  if (!post) {
    return (
      <S.PostDetailPageContainer>
        <S.NoContentMessage>
          Post não encontrado ou erro ao carregar.
        </S.NoContentMessage>
      </S.PostDetailPageContainer>
    )
  }

  return (
    <S.PostDetailPageContainer>
      <LeftSidebar onPostButtonClick={() => {}} />
      <S.PostDetailMainContent>
        <S.TopBar>
          <S.BackButton onClick={() => navigate('/feed')}>
            <FiArrowLeft />
          </S.BackButton>
          <S.Title>Post</S.Title>
        </S.TopBar>

        <S.PostWrapper>
          <PostDetail post={post} onLikeToggle={handleLikeToggle} />
        </S.PostWrapper>

        <CommentSection postId={post.id} postAuthorId={post.user.id} />
      </S.PostDetailMainContent>
      <RightSidebar onFollowUser={handleFollowUser} />
    </S.PostDetailPageContainer>
  )
}
