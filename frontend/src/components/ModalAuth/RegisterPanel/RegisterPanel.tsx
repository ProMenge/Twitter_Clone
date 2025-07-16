import { type FormikErrors, type FormikHelpers, useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import api from '../../../services/api'

import { AxiosError } from 'axios'
import type {
  ApiValidationError,
  AuthSuccessResponse,
  ModalAuthFormValues,
  RegisterPayload
} from '../../../types'
import * as S from '../styles'

import { useAuth } from '../../../contexts/AuthContext'

interface RegisterPanelProps {
  onClose: () => void
  setGeneralError: React.Dispatch<React.SetStateAction<string | null>>
}

const RegisterPanel: React.FC<RegisterPanelProps> = ({
  onClose,
  setGeneralError
}) => {
  const navigate = useNavigate()

  const { login } = useAuth()
  const [step, setStep] = useState(1)

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

  const registerSchema = Yup.lazy<Yup.ObjectSchema<ModalAuthFormValues>>(
    (values) => {
      const currentStep = values._step_context

      return Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        contact: Yup.string()
          .email('Por favor, insira um e-mail válido')
          .required('O e-mail é obrigatório'),
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
        _step_context: Yup.number().notRequired()
      })
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
      _type_context: 'register',
      _step_context: step
    },
    validationSchema: registerSchema,
    onSubmit: async (
      values: ModalAuthFormValues,
      {
        setSubmitting,
        setErrors: setFormikErrors
      }: FormikHelpers<ModalAuthFormValues>
    ) => {
      setGeneralError(null)
      setSubmitting(true)

      if (step === 1) {
        const errors = await formik.validateForm(values)

        if (
          !errors.name &&
          !errors.contact &&
          !errors.birthMonth &&
          !errors.birthDay &&
          !errors.birthYear
        ) {
          setStep(2)
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
            username: values.name!.replace(/\s/g, ''),
            display_name: values.name!,
            email: values.contact!,
            password: values.password!,
            birth_date: birthDate
          }

          const response = await api.post<AuthSuccessResponse>(
            'register/',
            payload
          )

          login(
            response.data.access_token,
            response.data.refresh_token || '',
            response.data.user
          )

          console.log('Registro bem-sucedido:', response.data)
          onClose()
          navigate('/feed')
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
    }
  })
  useEffect(() => {
    formik.setFieldValue('_step_context', step)
  }, [step, formik.setFieldValue])

  return (
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
          <S.Input
            name="contact"
            placeholder="E-mail"
            value={formik.values.contact || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="email"
          />
          {formik.touched.contact && formik.errors.contact && (
            <S.Error>{formik.errors.contact}</S.Error>
          )}
          <S.Label>Data de nascimento</S.Label>
          <S.InfoText>
            Isso não será exibido publicamente. Confirme sua própria idade,
            mesmo se esta conta for de empresa, de um animal de estimação ou
            outros.
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
  )
}

export default RegisterPanel
