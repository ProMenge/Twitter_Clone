import { AxiosError } from 'axios'
import { type FormikErrors, type FormikHelpers, useFormik } from 'formik'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import api from '../../../services/api'
import type {
  ApiValidationError,
  AuthSuccessResponse,
  LoginPayload
} from '../../../types'
import * as S from '../styles'

import { useAuth } from '../../../contexts/AuthContext'

interface LoginPanelProps {
  onClose: () => void
  setGeneralError: React.Dispatch<React.SetStateAction<string | null>>
}

interface LoginFormValues {
  username_or_email: string
  password: string
}

const LoginForm: React.FC<LoginPanelProps> = ({ onClose, setGeneralError }) => {
  const navigate = useNavigate()
  const { login } = useAuth() // NOVO: Obter a função login do contexto

  const loginSchema = Yup.object().shape({
    username_or_email: Yup.string().required(
      'Celular, e-mail ou nome de usuário é obrigatório'
    ),
    password: Yup.string().required('Senha obrigatória')
  })

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      username_or_email: '',
      password: ''
    },
    validationSchema: loginSchema,
    onSubmit: async (
      values: LoginFormValues,
      {
        setSubmitting,
        setErrors: setFormikErrors
      }: FormikHelpers<LoginFormValues>
    ) => {
      setGeneralError(null)
      setSubmitting(true)
      try {
        const payload: LoginPayload = {
          username_or_email: values.username_or_email,
          password: values.password
        }
        const response = await api.post<AuthSuccessResponse>('login/', payload)

        login(
          response.data.access_token,
          response.data.refresh_token || '',
          response.data.user
        )

        console.log('Login bem-sucedido:', response.data)

        onClose() // Fechar o modal
        navigate('/feed') // Redirecionar
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          const responseData = error.response.data as ApiValidationError
          const apiErrors: FormikErrors<LoginFormValues> = {} // Tipagem para erros específicos do LoginForm

          if (responseData.non_field_errors) {
            apiErrors.username_or_email = responseData.non_field_errors[0]
          }
          if (responseData.username_or_email) {
            apiErrors.username_or_email = responseData.username_or_email[0]
          }
          if (responseData.password) {
            apiErrors.password = responseData.password[0]
          }

          setFormikErrors(apiErrors)

          if (
            !Object.keys(apiErrors).length &&
            !responseData.non_field_errors
          ) {
            setGeneralError('Erro no login. Tente novamente.')
          }
        } else {
          setGeneralError('Erro de conexão ou servidor. Tente mais tarde.')
          console.error('Erro não relacionado à API:', error)
        }
      } finally {
        setSubmitting(false)
      }
    }
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <S.Input
        name="username_or_email"
        placeholder="Celular, e-mail ou nome de usuário"
        value={formik.values.username_or_email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.username_or_email && formik.errors.username_or_email && (
        <S.Error>{formik.errors.username_or_email}</S.Error>
      )}
      <S.Input
        name="password"
        placeholder="Senha"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.password && formik.errors.password && (
        <S.Error>{formik.errors.password}</S.Error>
      )}
      <S.AdvanceButton
        type="submit"
        disabled={!formik.isValid || formik.isSubmitting}
      >
        {formik.isSubmitting ? 'Entrando...' : 'Entrar'}
      </S.AdvanceButton>
      <S.ForgotPassword href="#">Esqueceu sua senha?</S.ForgotPassword>
    </form>
  )
}

export default LoginForm
