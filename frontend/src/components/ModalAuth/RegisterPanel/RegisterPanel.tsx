import { type FormikProps } from 'formik' // Importar useFormik (se ainda não estiverem)
import React from 'react' // Importar useState e useEffect (se ainda não estiverem)

import type { ModalAuthFormValues } from '../../../types'
import * as S from '../styles' // Importar os Styled Components do ModalAuth pai

interface RegisterPanelProps {
  // CORREÇÃO AQUI: Adicionar a prop 'formik'
  formik: FormikProps<ModalAuthFormValues> // Recebe a instância formik completa do pai
  step: number
  setStep: React.Dispatch<React.SetStateAction<number>>
  useEmailForContact: boolean
  setUseEmailForContact: React.Dispatch<React.SetStateAction<boolean>>
  months: string[] // O array de nomes dos meses
  generalError: string | null // Para exibir erros gerais do modal pai (se necessário)
}

// O restante do código do componente RegisterPanel permanece inalterado:
const RegisterPanel: React.FC<RegisterPanelProps> = ({
  formik, // Desestruturar formik
  step,
  setStep,
  useEmailForContact,
  setUseEmailForContact,
  months
}) => {
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
