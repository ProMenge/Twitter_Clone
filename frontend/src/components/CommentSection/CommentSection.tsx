import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { FiHeart, FiMessageCircle, FiRepeat, FiShare } from 'react-icons/fi'
import { IoStatsChart } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import userdefault from '../../assets/images/default-avatar-icon-of-social-media-user-vector.jpg'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import type { CommentType } from '../../types'
import * as S from './styles'

interface CommentSectionProps {
  postId: string | number
  postAuthorId: string | number
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const navigate = useNavigate()
  const { user: authenticatedUser, isAuthenticated } = useAuth()

  const [comments, setComments] = useState<CommentType[]>([])
  const [newCommentText, setNewCommentText] = useState('')
  const [isLoadingComments, setIsLoadingComments] = useState(true)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  const fetchComments = async () => {
    setIsLoadingComments(true)
    try {
      const response = await api.get<CommentType[]>(`posts/${postId}/comments/`)
      setComments(response.data)
    } catch (error) {
      console.error('Erro ao buscar comentários:', error)
      setComments([])
    } finally {
      setIsLoadingComments(false)
    }
  }

  useEffect(() => {
    if (postId) fetchComments()
  }, [postId])

  const handleSubmitComment = async () => {
    const content = newCommentText.trim()
    if (!content) return

    if (!isAuthenticated) {
      alert('Você precisa estar logado para comentar!')
      navigate('/')
      return
    }

    setIsSubmittingComment(true)
    try {
      const response = await api.post<CommentType>(
        `posts/${postId}/comments/`,
        { content }
      )
      setComments((prev) => [response.data, ...prev])
      setNewCommentText('')
    } catch (error) {
      console.error('Erro ao enviar comentário:', error)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleCommentLikeToggle = async (
    commentId: string | number,
    isCurrentlyLiked: boolean
  ) => {
    try {
      if (!isAuthenticated) {
        console.warn('Você precisa estar logado para curtir um comentário.')
        return
      }
      await api.post(`posts/${commentId}/like/`)
      console.log(
        `Comentário ${commentId} ${isCurrentlyLiked ? 'descurtido' : 'curtido'}.`
      )

      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              is_liked_by_viewer: !isCurrentlyLiked,
              likes_count: isCurrentlyLiked
                ? (comment.likes_count || 0) - 1
                : (comment.likes_count || 0) + 1
            }
          }
          return comment
        })
      )
    } catch (error) {
      console.error('Erro ao curtir/descurtir comentário:', error)
    }
  }

  const currentUserAvatar = `url(${authenticatedUser?.avatar_url || userdefault})`

  return (
    <S.CommentSectionContainer>
      <S.CommentFormContainer>
        <S.Avatar style={{ backgroundImage: currentUserAvatar }} />
        <S.TextAreaWrapper>
          <S.TextArea
            placeholder="Tweet sua resposta"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            rows={1}
            disabled={isSubmittingComment}
          />
          <S.ReplyButton
            onClick={handleSubmitComment}
            disabled={!newCommentText.trim() || isSubmittingComment}
          >
            Responder
          </S.ReplyButton>
        </S.TextAreaWrapper>
      </S.CommentFormContainer>

      {isLoadingComments ? (
        <S.LoadingIndicator>Carregando comentários...</S.LoadingIndicator>
      ) : comments.length === 0 ? (
        <S.NoContentMessage>
          Este post ainda não tem comentários.
        </S.NoContentMessage>
      ) : (
        comments.map((comment) => (
          <S.CommentListItem key={comment.id}>
            <div
              className="comment-avatar"
              style={{ backgroundImage: `url(${comment.author.avatar_url})` }}
            />
            <div className="comment-content">
              <div className="comment-header">
                <span className="display-name">
                  {comment.author.display_name}
                </span>
                <span className="username">@{comment.author.username}</span>
                <span className="timestamp">
                  {format(new Date(comment.created_at), 'dd MMM', {
                    locale: ptBR
                  })}
                </span>
              </div>
              <p className="comment-text">{comment.content}</p>
              <S.CommentActions>
                <div>
                  <FiMessageCircle />
                </div>
                <div>
                  <FiRepeat />
                </div>
                <div
                  onClick={() =>
                    handleCommentLikeToggle(
                      comment.id,
                      comment.is_liked_by_viewer || false
                    )
                  }
                  className={comment.is_liked_by_viewer ? 'liked' : ''}
                >
                  <FiHeart />
                  {(comment.likes_count || 0) > 0 && comment.likes_count}
                </div>
                <div>
                  <IoStatsChart />
                </div>
                <div>
                  <FiShare />
                </div>
              </S.CommentActions>
            </div>
          </S.CommentListItem>
        ))
      )}
    </S.CommentSectionContainer>
  )
}
