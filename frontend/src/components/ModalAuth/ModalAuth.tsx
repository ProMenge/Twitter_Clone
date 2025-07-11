import { type FormikErrors, type FormikHelpers, useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import logo from '../../assets/images/logo-white.png'
import api from '../../services/api'
import * as S from './styles'

import { AxiosError } from 'axios'
import type {
  ApiValidationError,
  AuthSuccessResponse,
  LoginPayload,
  ModalAuthFormValues,
  RegisterPayload
} from '../../types/index'

interface ModalAuthProps {
  isOpen: boolean
  onClose: () => void
  title: string
  type: 'login' | 'register'
}

export default function ModalAuth({
  isOpen,
  onClose,
  title,
  type
}: ModalAuthProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [useEmailForContact, setUseEmailForContact] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const dynamicSchema = Yup.lazy<Yup.ObjectSchema<ModalAuthFormValues>>(
    (values) => {
      const currentType = values._type_context
      const currentStep = values._step_context
      const currentUseEmailForContact = values._useEmailForContact_context

      if (currentType === 'register') {
        return Yup.object<ModalAuthFormValues>().shape({
          name: Yup.string().required('Nome obrigatório'),
          contact: Yup.string()
            .required('Celular ou e-mail obrigatório')
            .test(
              'is-contact-valid',
              'Celular ou e-mail inválido',
              function (value) {
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '')
                const isPhone = /^\d+$/.test(value || '')
                if (currentUseEmailForContact) {
                  return isEmail
                } else {
                  return isEmail || isPhone
                }
              }
            ),
          birthMonth: Yup.string().required('Selecione o mês'),
          birthDay: Yup.string().required('Selecione o dia'),
          birthYear: Yup.string().required('Selecione o ano'),
          password: Yup.string().when('_step_context', {
            is: 2,
            then: (schema) =>
              schema
                .required('Senha obrigatória')
                .min(6, 'A senha deve ter no mínimo 6 caracteres'),
            otherwise: (schema) => schema.notRequired()
          }),
          confirm_password: Yup.string().when('password', {
            is: (val: string) => currentStep === 2 && !!val,
            then: (schema) =>
              schema
                .required('Confirmação de senha obrigatória')
                .oneOf([Yup.ref('password')], 'As senhas não coincidem'),
            otherwise: (schema) => schema.notRequired()
          }),

          username_or_email: Yup.string().notRequired(),
          _type_context: Yup.mixed<'login' | 'register'>()
            .oneOf(['login', 'register'])
            .nullable()
            .notRequired(),
          _step_context: Yup.number().notRequired(),
          _useEmailForContact_context: Yup.boolean().notRequired()
        })
      } else {
        return Yup.object<ModalAuthFormValues>().shape({
          username_or_email: Yup.string().required(
            'Celular, e-mail ou nome de usuário é obrigatório'
          ),
          password: Yup.string().required('Senha obrigatória'),
          name: Yup.string().notRequired(),
          contact: Yup.string().notRequired(),
          birthMonth: Yup.string().notRequired(),
          birthDay: Yup.string().notRequired(),
          birthYear: Yup.string().notRequired(),
          confirm_password: Yup.string().notRequired(),
          _type_context: Yup.mixed<'login' | 'register'>()
            .oneOf(['login', 'register'])
            .nullable()
            .notRequired(),
          _step_context: Yup.number().notRequired(),
          _useEmailForContact_context: Yup.boolean().notRequired()
        })
      }
    }
  )

  const formik = useFormik<ModalAuthFormValues>({
    initialValues: {
      name: '',
      contact: '',
      birthMonth: '',
      birthDay: '',
      birthYear: '',
      password: '',
      confirm_password: '',
      username_or_email: '',
      _type_context: type,
      _step_context: step,
      _useEmailForContact_context: useEmailForContact
    },
    validationSchema: dynamicSchema,
    onSubmit: async (
      values: ModalAuthFormValues,
      {
        setSubmitting,
        setErrors: setFormikErrors
      }: FormikHelpers<ModalAuthFormValues>
    ) => {
      setGeneralError(null)
      setSubmitting(true)

      if (type === 'register') {
        if (step === 1) {
          const errors = await formik.validateForm(values)

          if (
            !errors.name &&
            !errors.contact &&
            !errors.birthMonth &&
            !errors.birthDay &&
            !errors.birthYear
          ) {
            setStep(2) // Avança para o passo 2
          } else {
            setFormikErrors(errors)
          }
          setSubmitting(false)
          return
        } else if (step === 2) {
          const errors = await formik.validateForm(values)
          if (Object.keys(errors).length > 0) {
            setFormikErrors(errors)
            setSubmitting(false)
            return
          }

          // Lógica de chamada API para Registro (passo 2)
          try {
            const monthMap: { [key: string]: string } = {
              Janeiro: '01',
              Fevereiro: '02',
              Março: '03',
              Abril: '04',
              Maio: '05',
              Junho: '06',
              Julho: '07',
              Agosto: '08',
              Setembro: '09',
              Outubro: '10',
              Novembro: '11',
              Dezembro: '12'
            }
            const birthMonthNum = monthMap[values.birthMonth!]
            const birthDayPadded = values.birthDay!.padStart(2, '0')
            const birthDate = `${values.birthYear!}-${birthMonthNum}-${birthDayPadded}`

            const payload: RegisterPayload = {
              username:
                values.name!.replace(/\s/g, '').toLowerCase() +
                Math.floor(Math.random() * 10000),
              display_name: values.name!,
              email: values.contact!,
              password: values.password!,
              birth_date: birthDate
            }

            if (!values._useEmailForContact_context) {
              // Usar o valor do contexto
              payload.username = values.contact!
              payload.email = `temp_${Date.now()}@example.com`
            }

            const response = await api.post<AuthSuccessResponse>(
              'register/',
              payload
            )

            localStorage.setItem('access_token', response.data.access_token)
            localStorage.setItem(
              'user_data',
              JSON.stringify(response.data.user)
            )

            console.log('Registro bem-sucedido:', response.data)
            onClose()
            navigate('/feed')
          } catch (error) {
            if (error instanceof AxiosError && error.response) {
              const responseData = error.response.data as ApiValidationError
              const apiErrors: FormikErrors<ModalAuthFormValues> = {}

              if (responseData.username)
                apiErrors.name = responseData.username[0]
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
      } else if (type === 'login') {
        try {
          const payload: LoginPayload = {
            username_or_email: values.username_or_email!,
            password: values.password!
          }

          const response = await api.post<AuthSuccessResponse>(
            'login/',
            payload
          )

          localStorage.setItem('access_token', response.data.access_token)
          localStorage.setItem(
            'refresh_token',
            response.data.refresh_token || ''
          )
          localStorage.setItem('user_data', JSON.stringify(response.data.user))

          console.log('Login bem-sucedido:', response.data)
          onClose()
          navigate('/feed')
        } catch (error) {
          if (error instanceof AxiosError && error.response) {
            const responseData = error.response.data as ApiValidationError
            const apiErrors: FormikErrors<ModalAuthFormValues> = {}

            if (responseData.non_field_errors) {
              apiErrors.username_or_email = responseData.non_field_errors[0]
            }

            setFormikErrors(apiErrors)

            if (responseData.detail) {
              setGeneralError(responseData.detail)
            } else if (!Object.keys(apiErrors).length && !responseData.detail) {
              setGeneralError('Erro no login. Verifique suas credenciais.')
            }
          } else {
            setGeneralError('Erro de conexão ou servidor. Tente mais tarde.')
            console.error('Erro não relacionado à API:', error)
          }
        } finally {
          setSubmitting(false)
        }
      }
    }
  })

  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ]

  useEffect(() => {
    formik.setFieldValue('_type_context', type)
    formik.setFieldValue('_step_context', step)
    formik.setFieldValue('_useEmailForContact_context', useEmailForContact)
  }, [type, step, useEmailForContact, formik.setFieldValue])

  if (!isOpen) return null

  return (
    <S.Overlay onClick={onClose}>
      <S.Modal onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={onClose}>×</S.CloseButton>
        <S.Logo src={logo} alt="Logo X" />
        <S.Title>{title}</S.Title>

        {generalError && <S.Error>{generalError}</S.Error>}

        {/* Formulário de Registro */}
        {type === 'register' && (
          <form onSubmit={formik.handleSubmit}>
            {step === 1 && (
              <>
                <S.Input
                  name="name"
                  placeholder="Nome"
                  value={formik.values.name || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                  <S.Error>{formik.errors.name}</S.Error>
                )}
                <S.ContactInputGroup>
                  <S.Input
                    name="contact"
                    placeholder={useEmailForContact ? 'E-mail' : 'Celular'}
                    value={formik.values.contact || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type={useEmailForContact ? 'email' : 'tel'}
                    style={{ marginBottom: '0px' }}
                  />
                  {formik.touched.contact && formik.errors.contact && (
                    <S.Error>{formik.errors.contact}</S.Error>
                  )}
                  <S.ToggleButton
                    type="button"
                    onClick={() => setUseEmailForContact(!useEmailForContact)}
                  >
                    {useEmailForContact ? 'Usar celular' : 'Usar o e-mail'}
                  </S.ToggleButton>
                </S.ContactInputGroup>

                <S.Label>Data de nascimento</S.Label>
                <S.InfoText>
                  Isso não será exibido publicamente. Confirme sua própria
                  idade, mesmo se esta conta for de empresa, de um animal de
                  estimação ou outros.
                </S.InfoText>
                <S.BirthContainer>
                  <S.Select
                    name="birthMonth"
                    value={formik.values.birthMonth || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Mês</option>
                    {months.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </S.Select>

                  <S.Select
                    name="birthDay"
                    value={formik.values.birthDay || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Dia</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </S.Select>

                  <S.Select
                    name="birthYear"
                    value={formik.values.birthYear || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Ano</option>
                    {Array.from({ length: 100 }, (_, i) => {
                      const year = new Date().getFullYear() - i
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      )
                    })}
                  </S.Select>
                </S.BirthContainer>
                {(formik.touched.birthMonth && formik.errors.birthMonth) ||
                (formik.touched.birthDay && formik.errors.birthDay) ||
                (formik.touched.birthYear && formik.errors.birthYear) ? (
                  <S.Error>Data de nascimento obrigatória</S.Error>
                ) : null}
                <S.AdvanceButton type="submit" disabled={formik.isSubmitting}>
                  Avançar
                </S.AdvanceButton>
              </>
            )}

            {step === 2 && (
              <>
                <S.Input
                  name="password"
                  placeholder="Crie uma senha"
                  type="password"
                  value={formik.values.password || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                  <S.Error>{formik.errors.password}</S.Error>
                )}
                <S.Input
                  name="confirm_password"
                  placeholder="Confirme a senha"
                  type="password"
                  value={formik.values.confirm_password || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.confirm_password &&
                  formik.errors.confirm_password && (
                    <S.Error>{formik.errors.confirm_password}</S.Error>
                  )}

                <S.AdvanceButton
                  type="submit"
                  disabled={!formik.isValid || formik.isSubmitting}
                >
                  {formik.isSubmitting ? 'Registrando...' : 'Concluir cadastro'}
                </S.AdvanceButton>
                <S.AdvanceButton
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    background: 'none',
                    color: '#1d9bf0',
                    border: '1px solid #536471'
                  }}
                >
                  Voltar
                </S.AdvanceButton>
              </>
            )}
          </form>
        )}
        {/* Formulário de Login */}
        {type === 'login' && (
          <form onSubmit={formik.handleSubmit}>
            <S.Input
              name="username_or_email"
              placeholder="Celular, e-mail ou nome de usuário"
              value={formik.values.username_or_email || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.username_or_email &&
              formik.errors.username_or_email && (
                <S.Error>{formik.errors.username_or_email}</S.Error>
              )}
            <S.Input
              name="password"
              placeholder="Senha"
              type="password"
              value={formik.values.password || ''}
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
        )}
      </S.Modal>
    </S.Overlay>
  )
}
