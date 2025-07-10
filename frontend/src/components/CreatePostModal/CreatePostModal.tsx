import React, { useState, useRef } from 'react'
import * as S from './styles'
import { IoCloseOutline } from 'react-icons/io5' // Ícone de fechar
import { FiImage, FiGift, FiSmile, FiCalendar, FiMapPin } from 'react-icons/fi' // Ícones de ação
import { RiEarthLine } from 'react-icons/ri'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onPostSubmit: (text: string, imageUrl?: string) => void
  userAvatarUrl: string
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostSubmit,
  userAvatarUrl
}) => {
  const [postText, setPostText] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null) // Ref para o input de arquivo

  // Se o modal não estiver aberto, não renderiza nada
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
      fileInputRef.current.value = '' // Limpa o input de arquivo
    }
  }

  const handlePostClick = () => {
    if (postText.trim() !== '' || selectedImage) {
      onPostSubmit(postText, imagePreviewUrl || undefined)
      setPostText('')
      handleRemoveImage()
      onClose()
    }
  }

  const isPostButtonDisabled = postText.trim() === '' && !selectedImage

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
            <S.Avatar style={{ backgroundImage: `url(${userAvatarUrl})` }} />
            <S.AudienceSelector>Qualquer pessoa</S.AudienceSelector>
          </S.UserInfoSection>

          <S.PostTextArea
            placeholder="O que está acontecendo?"
            value={postText}
            onChange={handleTextChange}
            rows={4} // Altura inicial
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
            <RiEarthLine /> Qualquer pessoa pode responder
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
            <button onClick={() => fileInputRef.current?.click()}>
              <FiImage />
            </button>
            <button>
              <FiGift />
            </button>
            <button>
              <FiSmile />
            </button>
            <button>
              <FiCalendar />
            </button>
            <button>
              <FiMapPin />
            </button>
          </S.ActionIcons>
          <S.PostButton
            onClick={handlePostClick}
            $disabled={isPostButtonDisabled}
          >
            Postar
          </S.PostButton>
        </S.ModalFooter>
      </S.ModalContent>
    </S.Overlay>
  )
}

export default CreatePostModal
