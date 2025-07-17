import { type FormikErrors, type FormikHelpers, useFormik } from 'formik'
import React, { useEffect } from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import * as Yup from 'yup'

import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import * as S from './styles'

import { AxiosError } from 'axios'
import type { ApiValidationError, AuthSuccessResponse } from '../../types/index'

type UserProfileData = AuthSuccessResponse['user'] // Cria um tipo para a interface do usuário completo

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserProfileData
  onProfileUpdated: (updatedUser: UserProfileData) => void
}

// Interface para os valores do formulário de edição
interface EditFormValues {
  display_name: string
  bio: string
  location: string
  website: string
  avatar_url: string
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onProfileUpdated
}) => {
  const { isAuthenticated } = useAuth()

  const editProfileSchema = Yup.object().shape({
    display_name: Yup.string()
      .required('Nome de exibição é obrigatório')
      .max(50, 'Máximo de 50 caracteres'),
    bio: Yup.string().max(160, 'Máximo de 160 caracteres'),
    location: Yup.string().max(100, 'Máximo de 100 caracteres'),
    website: Yup.string()
      .url('URL de website inválida')
      .max(100, 'Máximo de 100 caracteres')
      .nullable(), // Website pode ser nulo no backend
    avatar_url: Yup.string()
      .url('URL do avatar inválida')
      .notRequired()
      .nullable()
  })

  const formik = useFormik<EditFormValues>({
    initialValues: {
      display_name: user.display_name,
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || '',
      avatar_url: user.avatar_url || ''
    },
    validationSchema: editProfileSchema,
    onSubmit: async (
      values: EditFormValues,
      {
        setSubmitting,
        setErrors: setFormikErrors,
        setStatus
      }: FormikHelpers<EditFormValues>
    ) => {
      setSubmitting(true)
      setStatus(null)

      try {
        if (!isAuthenticated) {
          throw new Error('Usuário não autenticado para editar perfil.')
        }

        const payload = {
          display_name: values.display_name,
          bio: values.bio,
          location: values.location,
          website: values.website,
          avatar_url: values.avatar_url
        }

        const response = await api.put<UserProfileData>(
          `users/${user.id}/`,
          payload
        )

        onProfileUpdated(response.data) // Passa o UserProfileData atualizado
        onClose()
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          const responseData = error.response.data as ApiValidationError
          const apiErrors: FormikErrors<EditFormValues> = {}

          if (responseData.display_name)
            apiErrors.display_name = responseData.display_name[0]
          if (responseData.bio) apiErrors.bio = responseData.bio[0]
          if (responseData.location)
            apiErrors.location = responseData.location[0]
          if (responseData.website) apiErrors.website = responseData.website[0]
          if (responseData.avatar_url)
            apiErrors.avatar_url = responseData.avatar_url[0]
          if (responseData.detail) setStatus({ general: responseData.detail })
          if (responseData.non_field_errors)
            setStatus({ general: responseData.non_field_errors[0] })

          setFormikErrors(apiErrors)

          if (
            !Object.keys(apiErrors).length &&
            !responseData.detail &&
            !responseData.non_field_errors
          ) {
            setStatus({ general: 'Erro ao atualizar perfil. Tente novamente.' })
          }
        } else {
          setStatus({
            general: 'Erro de conexão ou servidor. Tente mais tarde.'
          })
        }
        console.error('Erro na atualização do perfil:', error)
      } finally {
        setSubmitting(false)
      }
    }
  })

  useEffect(() => {
    formik.setValues({
      display_name: user.display_name,
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || '',
      avatar_url: user.avatar_url || ''
    })
  }, [user])

  if (!isOpen) return null

  return (
    <S.Overlay onClick={onClose}>
      <S.ModalContent onClick={(e) => e.stopPropagation()}>
        <S.ModalHeader>
          <S.CloseButton onClick={onClose}>
            <IoCloseOutline />
          </S.CloseButton>
          <S.ModalTitle>Editar perfil</S.ModalTitle>
          <div style={{ width: '24px' }}></div>
        </S.ModalHeader>
        <S.FormContainer onSubmit={formik.handleSubmit}>
          {formik.status?.general && (
            <S.ErrorText>{formik.status.general}</S.ErrorText>
          )}

          <S.Input
            name="display_name"
            placeholder="Nome de exibição"
            value={formik.values.display_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.display_name && formik.errors.display_name && (
            <S.ErrorText>{formik.errors.display_name}</S.ErrorText>
          )}

          <S.TextArea
            name="bio"
            placeholder="Biografia"
            value={formik.values.bio}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.bio && formik.errors.bio && (
            <S.ErrorText>{formik.errors.bio}</S.ErrorText>
          )}

          <S.Input
            name="location"
            placeholder="Localização"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.location && formik.errors.location && (
            <S.ErrorText>{formik.errors.location}</S.ErrorText>
          )}

          <S.Input
            name="website"
            placeholder="Website"
            value={formik.values.website}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.website && formik.errors.website && (
            <S.ErrorText>{formik.errors.website}</S.ErrorText>
          )}

          <S.Input
            name="avatar_url"
            placeholder="URL do Avatar"
            value={formik.values.avatar_url}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.avatar_url && formik.errors.avatar_url && (
            <S.ErrorText>{formik.errors.avatar_url}</S.ErrorText>
          )}

          <S.SaveButton type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Salvando...' : 'Salvar'}
          </S.SaveButton>
        </S.FormContainer>
      </S.ModalContent>
    </S.Overlay>
  )
}

export default EditProfileModal
