import { Container, Nav, NavList, NavItem, CopyrightText } from './styles'

const Footer = () => {
  const topLinks = [
    { text: 'Sobre', href: 'https://about.twitter.com/pt/who-we-are' },
    {
      text: 'Baixe o aplicativo do X',
      href: 'https://help.x.com/download-the-x-app'
    },
    { text: 'Grok', href: 'https://grok.x.ai/' },
    { text: 'Central de Ajuda', href: 'https://help.x.com/pt' },
    { text: 'Termos de Serviço', href: 'https://x.com/pt/tos' },
    { text: 'Política de Privacidade', href: 'https://x.com/pt/privacy' },
    { text: 'Política de cookies', href: 'https://x.com/pt/cookie-policy' },
    { text: 'Acessibilidade', href: 'https://x.com/pt/accessibility' },
    {
      text: 'Informações de anúncios',
      href: 'https://business.twitter.com/pt/help/ads-policies/ads-information.html'
    },
    { text: 'Blog', href: 'https://blog.x.com/pt' },
    { text: 'Carreiras', href: 'https://careers.x.com/#' }
  ]

  const bottomLinks = [
    {
      text: 'Recursos da marca',
      href: 'https://about.x.com/pt/company/brand-toolkit'
    },
    {
      text: 'Publicidade',
      href: 'https://business.x.com/pt/solutions/ads.html'
    },
    {
      text: 'Marketing',
      href: 'https://business.x.com/pt/solutions/marketing.html'
    },
    {
      text: 'X para Empresas',
      href: 'https://business.x.com/pt/solutions.html'
    },
    { text: 'Desenvolvedores', href: 'https://developer.x.com/' },
    { text: 'Diretório', href: 'https://x.com/i/directory' },
    { text: 'Configurações', href: 'https://x.com/settings' }
  ]

  // Obtém o ano atual dinamicamente
  const currentYear = new Date().getFullYear()

  return (
    <Container>
      <Nav>
        <NavList>
          {topLinks.map((link, index) => (
            <NavItem key={link.text}>
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.text}
              </a>
              {index < topLinks.length - 1 && <span>|</span>}
            </NavItem>
          ))}
        </NavList>
        <NavList>
          {bottomLinks.map((link, index) => (
            <NavItem key={link.text}>
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.text}
              </a>
              {index < bottomLinks.length - 1 && <span>|</span>}
            </NavItem>
          ))}

          <CopyrightText>&copy; {currentYear} X Corp.</CopyrightText>
        </NavList>
      </Nav>
    </Container>
  )
}

export default Footer
