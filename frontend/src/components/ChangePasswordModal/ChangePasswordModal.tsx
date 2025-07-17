// src/components/ProfilePage/ChangePasswordModal/index.tsx
import { type FormikErrors, type FormikHelpers, useFormik } from 'formik'
import React from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import * as Yup from 'yup'

import { AxiosError } from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import type { ApiValidationError } from '../../types'
import * as S from './styles'

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  // user: UserProfileData; // Não precisa do user aqui, pois a view usa request.user
}

interface ChangePasswordFormValues {
  old_password: string
  new_password: string
  confirm_new_password: string
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose
}) => {
  const { isAuthenticated } = useAuth() // Para garantir autenticação

  // Schema de validação para o formulário de alteração de senha
  const changePasswordSchema = Yup.object().shape({
    old_password: Yup.string().required('Senha antiga é obrigatória'),
    new_password: Yup.string()
      .required('Nova senha é obrigatória')
      .min(6, 'A nova senha deve ter no mínimo 6 caracteres'),
    confirm_new_password: Yup.string()
      .required('Confirmação de nova senha é obrigatória')
      .oneOf([Yup.ref('new_password')], 'As novas senhas não coincidem')
  })

  const formik = useFormik<ChangePasswordFormValues>({
    initialValues: {
      old_password: '',
      new_password: '',
      confirm_new_password: ''
    },
    validationSchema: changePasswordSchema,
    onSubmit: async (
      values: ChangePasswordFormValues,
      {
        setSubmitting,
        setErrors: setFormikErrors,
        setStatus
      }: FormikHelpers<ChangePasswordFormValues>
    ) => {
      setSubmitting(true)
      setStatus(null) // Limpa status de erro geral da API

      try {
        if (!isAuthenticated) {
          throw new Error('Usuário não autenticado para alterar senha.')
        }

        const payload = {
          old_password: values.old_password,
          new_password: values.new_password,
          confirm_new_password: values.confirm_new_password // Backend não usa, mas é bom para enviar
        }

        const response = await api.post(`change-password/`, payload)

        console.log('Senha alterada com sucesso:', response.data.message)
        alert('Senha alterada com sucesso!') // Feedback visual simples
        onClose() // Fecha o modal
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          const responseData = error.response.data as ApiValidationError
          const apiErrors: FormikErrors<ChangePasswordFormValues> = {}

          if (responseData.old_password)
            apiErrors.old_password = responseData.old_password[0]
          if (responseData.new_password)
            apiErrors.new_password = responseData.new_password[0]
          if (responseData.confirm_new_password)
            apiErrors.confirm_new_password =
              responseData.confirm_new_password[0]
          if (responseData.detail) setStatus({ general: responseData.detail }) // Erro geral via status
          if (responseData.non_field_errors)
            setStatus({ general: responseData.non_field_errors[0] })

          setFormikErrors(apiErrors)

          if (
            !Object.keys(apiErrors).length &&
            !responseData.detail &&
            !responseData.non_field_errors
          ) {
            setStatus({ general: 'Erro ao alterar senha. Tente novamente.' })
          }
        } else {
          setStatus({
            general: 'Erro de conexão ou servidor. Tente mais tarde.'
          })
        }
        console.error('Erro na alteração de senha:', error)
      } finally {
        setSubmitting(false)
      }
    }
  })

  if (!isOpen) return null

  return (
    <S.Overlay onClick={onClose}>
      <S.ModalContent onClick={(e) => e.stopPropagation()}>
        <S.ModalHeader>
          <S.CloseButton onClick={onClose}>
            <IoCloseOutline />
          </S.CloseButton>
          <S.ModalTitle>Alterar Senha</S.ModalTitle>
          <div style={{ width: '24px' }}></div>{' '}
        </S.ModalHeader>
        <S.FormContainer onSubmit={formik.handleSubmit}>
          {formik.status?.general && (
            <S.ErrorText>{formik.status.general}</S.ErrorText>
          )}

          <S.Input
            name="old_password"
            placeholder="Senha antiga"
            type="password"
            value={formik.values.old_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.old_password && formik.errors.old_password && (
            <S.ErrorText>{formik.errors.old_password}</S.ErrorText>
          )}

          <S.Input
            name="new_password"
            placeholder="Nova senha"
            type="password"
            value={formik.values.new_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.new_password && formik.errors.new_password && (
            <S.ErrorText>{formik.errors.new_password}</S.ErrorText>
          )}

          <S.Input
            name="confirm_new_password"
            placeholder="Confirme a nova senha"
            type="password"
            value={formik.values.confirm_new_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.confirm_new_password &&
            formik.errors.confirm_new_password && (
              <S.ErrorText>{formik.errors.confirm_new_password}</S.ErrorText>
            )}

          <S.SaveButton type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Alterando...' : 'Alterar Senha'}
          </S.SaveButton>
        </S.FormContainer>
      </S.ModalContent>
    </S.Overlay>
  )
}

export default ChangePasswordModal
