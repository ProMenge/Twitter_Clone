import * as S from './styles'
import logo from '../../assets/images/logo-white.png'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

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
  const [step, setStep] = useState(1)
  const [useEmailForContact, setUseEmailForContact] = useState(false)

  const registerSchema = Yup.object().shape({
    name: Yup.string().required('Nome obrigatório'),
    contact: Yup.string()
      .required('Celular ou e-mail obrigatório')
      .test('is-contact-valid', 'Celular ou e-mail inválido', function (value) {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '')
        const isPhone = /^\d+$/.test(value || '')

        if (useEmailForContact) {
          return isEmail
        } else {
          return isEmail || isPhone
        }
      }),
    birthMonth: Yup.string().required('Selecione o mês'),
    birthDay: Yup.string().required('Selecione o dia'),
    birthYear: Yup.string().required('Selecione o ano')
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      contact: '',
      birthMonth: '',
      birthDay: '',
      birthYear: ''
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      console.log('Dados do cadastro:', values)
      setStep(2)
    }
  })

  if (!isOpen) return null

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

  return (
    <S.Overlay>
      <S.Modal>
        <S.CloseButton onClick={onClose}>×</S.CloseButton>
        <S.Logo src={logo} alt="Logo X" />
        <S.Title>{title}</S.Title>

        {type === 'register' && (
          <>
            {step === 1 && (
              <form onSubmit={formik.handleSubmit}>
                <S.Input
                  name="name"
                  placeholder="Nome"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
                {formik.touched.name && formik.errors.name && (
                  <S.Error>{formik.errors.name}</S.Error>
                )}

                {/* Novo grupo para o input de contato e o botão de alternar */}
                <S.ContactInputGroup>
                  <S.Input
                    name="contact"
                    placeholder={useEmailForContact ? 'E-mail' : 'Celular'}
                    value={formik.values.contact}
                    onChange={formik.handleChange}
                    type={useEmailForContact ? 'email' : 'tel'}
                    // Removido margin-bottom daqui, será gerenciado pelo ContactInputGroup
                    style={{ marginBottom: '0px' }} // Garante que a margem original do Input não interfira
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
                {/* A margem inferior do grupo agora gerencia o espaçamento para o próximo elemento */}

                <S.Label>Data de nascimento</S.Label>
                <S.InfoText>
                  Isso não será exibido publicamente. Confirme sua própria
                  idade, mesmo se esta conta for de empresa, de um animal de
                  estimação ou outros.
                </S.InfoText>
                <S.BirthContainer>
                  <S.Select
                    name="birthMonth"
                    value={formik.values.birthMonth}
                    onChange={formik.handleChange}
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
                    value={formik.values.birthDay}
                    onChange={formik.handleChange}
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
                    value={formik.values.birthYear}
                    onChange={formik.handleChange}
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
                <S.AdvanceButton
                  type="submit"
                  disabled={!formik.isValid || !formik.dirty}
                >
                  Avançar
                </S.AdvanceButton>
              </form>
            )}

            {step === 2 && (
              <>
                <S.Input placeholder="Crie uma senha" type="password" />
                <S.Input placeholder="Confirme a senha" type="password" />

                <S.AdvanceButton onClick={() => alert('Cadastro concluído!')}>
                  Concluir cadastro
                </S.AdvanceButton>
              </>
            )}
          </>
        )}
        {type === 'login' && (
          <>
            {step === 1 && (
              <>
                <S.Input placeholder="Celular, e-mail ou nome de usuário" />
                <S.AdvanceButton onClick={() => setStep(2)}>
                  Avançar
                </S.AdvanceButton>
              </>
            )}

            {step === 2 && (
              <>
                <S.Input placeholder="Senha" type="password" />
                <S.AdvanceButton onClick={() => alert('Login realizado!')}>
                  Entrar
                </S.AdvanceButton>
                <S.ForgotPassword href="#">
                  Esqueceu sua senha?
                </S.ForgotPassword>
              </>
            )}
          </>
        )}
      </S.Modal>
    </S.Overlay>
  )
}
