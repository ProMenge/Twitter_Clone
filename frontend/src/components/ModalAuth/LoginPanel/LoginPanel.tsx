import { AxiosError } from 'axios'
import { type FormikErrors, type FormikHelpers, useFormik } from 'formik'
import React from 'react'
import { useNavigate } from 'react-router-dom' // Importar useNavigate
import * as Yup from 'yup' // Importar Yup
import api from '../../../services/api'

import type {
  ApiValidationError, // Importar ApiValidationError
  AuthSuccessResponse, // Ainda vamos usar esta interface para o Formik, mas apenas os campos relevantes
  LoginPayload,
  ModalAuthFormValues
} from '../../../types' // Importar os tipos globais

import * as S from '../styles' // Importar os Styled Components do ModalAuth pai

interface LoginPanelProps {
  onClose: () => void // Para fechar o modal principal após o login
  setGeneralError: React.Dispatch<React.SetStateAction<string | null>> // Para exibir erros gerais no modal pai
}

interface LoginFormValues {
  username_or_email: string
  password: string
}

const LoginForm: React.FC<LoginPanelProps> = ({ onClose, setGeneralError }) => {
  const navigate = useNavigate()

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
      values: LoginFormValues, // Tipagem explícita para 'values' como LoginFormValues
      {
        setSubmitting,
        setErrors: setFormikErrors
      }: FormikHelpers<LoginFormValues> // Tipagem explícita
    ) => {
      setGeneralError(null)
      setSubmitting(true)
      try {
        const payload: LoginPayload = {
          username_or_email: values.username_or_email, // Não precisa de '!' aqui, schema já garante
          password: values.password // Não precisa de '!' aqui
        }
        const response = await api.post<AuthSuccessResponse>('login/', payload)

        localStorage.setItem('access_token', response.data.access_token)
        localStorage.setItem('refresh_token', response.data.refresh_token || '')
        localStorage.setItem('user_data', JSON.stringify(response.data.user))
        console.log('Login bem-sucedido:', response.data)

        onClose() // Fechar o modal
        navigate('/feed') // Redirecionar
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          const responseData = error.response.data as ApiValidationError
          const apiErrors: FormikErrors<ModalAuthFormValues> = {}

          if (responseData.username) apiErrors.name = responseData.username[0]
          if (responseData.email) apiErrors.contact = responseData.email[0]
          if (responseData.password)
            apiErrors.password = responseData.password[0]
          if (responseData.non_field_errors)
            setGeneralError(responseData.non_field_errors[0])

          setFormikErrors(apiErrors)

          if (
            !Object.keys(apiErrors).length &&
            !responseData.non_field_errors
          ) {
            setGeneralError('Erro no registro. Tente novamente.')
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
        value={formik.values.username_or_email} // Não precisa de || '' se o initialValues for string
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
        value={formik.values.password} // Não precisa de || '' se o initialValues for string
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
      <S.ForgotPassword href="#">Esqueceu sua senha?</S.ForgotPassword>{' '}
    </form>
  )
}

export default LoginForm
