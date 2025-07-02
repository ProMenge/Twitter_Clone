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
  const [step, setStep] = useState(1) // Para controle de etapas no cadastro

  const registerSchema = Yup.object().shape({
    name: Yup.string().required('Nome obrigatório'),
    contact: Yup.string().required('Celular ou e-mail obrigatório'),
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

                <S.Input
                  name="contact"
                  placeholder="Celular ou e-mail"
                  value={formik.values.contact}
                  onChange={formik.handleChange}
                />
                {formik.touched.contact && formik.errors.contact && (
                  <S.Error>{formik.errors.contact}</S.Error>
                )}

                <S.Label>Data de nascimento</S.Label>
                <S.BirthContainer>
                  <S.Select
                    name="birthMonth"
                    value={formik.values.birthMonth}
                    onChange={formik.handleChange}
                  >
                    <option value="">Mês</option>
                    <option value="Janeiro">Janeiro</option>
                    <option value="Fevereiro">Fevereiro</option>
                    <option value="Março">Março</option>
                    <option value="Março">Abril</option>
                    <option value="Março">Maio</option>
                    <option value="Março">Junho</option>
                    <option value="Março">Julho</option>
                    <option value="Março">Agosto</option>
                    <option value="Março">Setembro</option>
                    <option value="Março">Outubro</option>
                    <option value="Março">Novembro</option>
                    <option value="Março">Dezembro</option>
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

                <S.AdvanceButton type="submit">Avançar</S.AdvanceButton>
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
