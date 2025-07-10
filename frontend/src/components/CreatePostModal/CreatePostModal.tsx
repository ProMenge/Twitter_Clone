import React, { useState, useRef } from 'react'
import * as S from './styles'
import { IoCloseOutline } from 'react-icons/io5'
import { FiImage, FiGift, FiSmile, FiCalendar, FiMapPin } from 'react-icons/fi'
import { RiEarthLine } from 'react-icons/ri'
import { FaRegComment } from 'react-icons/fa6'

// Ajustar a interface: onPostSubmit agora recebe um File
interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onPostSubmit: (text: string, imageFile?: File) => Promise<void> // Retorna Promise<void> para indicar assincronicidade
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
  const [isSubmitting, setIsSubmitting] = useState(false) // NOVO: Estado para o carregamento do envio
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    // Função agora é assíncrona
    if (postText.trim() !== '' || selectedImage) {
      setIsSubmitting(true) // Inicia o estado de submissão
      try {
        // Agora passamos o selectedImage (File) para onPostSubmit
        await onPostSubmit(postText, selectedImage || undefined)
        setPostText('')
        handleRemoveImage()
        onClose()
      } catch (error) {
        console.error('Erro ao submeter o post pelo modal:', error)
        // Aqui você pode adicionar lógica para exibir um erro ao usuário no modal
      } finally {
        setIsSubmitting(false) // Finaliza o estado de submissão
      }
    }
  }

  // Desabilita o botão se não houver texto ou imagem, ou se já estiver submetendo
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
            <S.Avatar style={{ backgroundImage: `url(${userAvatarUrl})` }} />
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
            {/* Texto do botão muda */}
          </S.PostButton>
        </S.ModalFooter>
      </S.ModalContent>
    </S.Overlay>
  )
}

export default CreatePostModal
