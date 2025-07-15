import React, { useRef, useState } from 'react'
import { FaRegComment } from 'react-icons/fa6'
import { FiCalendar, FiGift, FiImage, FiMapPin, FiSmile } from 'react-icons/fi'
import { IoCloseOutline } from 'react-icons/io5'
import { RiEarthLine } from 'react-icons/ri'
import icon from '../../assets/images/default-avatar-icon-of-social-media-user-vector.jpg'
import * as S from './styles'

import { useAuth } from '../../contexts/AuthContext' // NOVO: Importar useAuth

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onPostSubmit: (text: string, imageFile?: File) => Promise<void>
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostSubmit
}) => {
  const [postText, setPostText] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { user } = useAuth()
  const currentUserAvatar = user?.avatar_url || { icon }

  if (!isOpen) return null

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setImagePreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl)
    }
    setImagePreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handlePostClick = async () => {
    if (postText.trim() !== '' || selectedImage) {
      setIsSubmitting(true)
      try {
        await onPostSubmit(postText, selectedImage || undefined)
        setPostText('')
        handleRemoveImage()
        onClose()
      } catch (error) {
        console.error('Erro ao submeter o post pelo modal:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const isPostButtonDisabled =
    (postText.trim() === '' && !selectedImage) || isSubmitting

  return (
    <S.Overlay onClick={onClose}>
      <S.ModalContent onClick={(e) => e.stopPropagation()}>
        <S.ModalHeader>
          <S.CloseButton onClick={onClose}>
            <IoCloseOutline />
          </S.CloseButton>
          <S.DraftsButton>Rascunhos</S.DraftsButton>
        </S.ModalHeader>
        <S.ModalBody>
          <S.UserInfoSection>
            <S.Avatar
              style={{ backgroundImage: `url(${currentUserAvatar})` }}
            />
            <S.AudienceSelector>
              Qualquer pessoa <RiEarthLine />
            </S.AudienceSelector>
          </S.UserInfoSection>

          <S.PostTextArea
            placeholder="O que está acontecendo?"
            value={postText}
            onChange={handleTextChange}
            rows={4}
          />

          {imagePreviewUrl && (
            <S.ImagePreviewContainer>
              <S.ImagePreview src={imagePreviewUrl} alt="Image preview" />
              <S.RemoveImageButton onClick={handleRemoveImage}>
                <IoCloseOutline />
              </S.RemoveImageButton>
            </S.ImagePreviewContainer>
          )}

          <S.ReplyAudience>
            <FaRegComment /> Qualquer pessoa pode responder
          </S.ReplyAudience>
        </S.ModalBody>
        <S.ModalFooter>
          <S.ActionIcons>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
            >
              <FiImage />
            </button>
            <button disabled={isSubmitting}>
              <FiGift />
            </button>
            <button disabled={isSubmitting}>
              <FiSmile />
            </button>
            <button disabled={isSubmitting}>
              <FiCalendar />
            </button>
            <button disabled={isSubmitting}>
              <FiMapPin />
            </button>
          </S.ActionIcons>
          <S.PostButton
            onClick={handlePostClick}
            $disabled={isPostButtonDisabled}
          >
            {isSubmitting ? 'Postando...' : 'Postar'}{' '}
          </S.PostButton>
        </S.ModalFooter>
      </S.ModalContent>
    </S.Overlay>
  )
}

export default CreatePostModal
