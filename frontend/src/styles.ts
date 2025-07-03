import { createGlobalStyle } from 'styled-components'

export const colors = {
  white: '#E7E9EA',
  black: '#000',
  gray: '#333',
  lightGray: '#A3A3A3',
  green: '#10AC84',
  darkPurple: '#8E44AD',
  red: '#FF3B3B',
  blue: '#003791',
  darkGray: '#4D4D4D',
  orange: '#FF7F0E',
  purple: '#8B008B',
  teal: '#008080',
  darkGreen: '#006400',
  yellow: '#FFD700',
  lightBlue: '#1d9bf0',
  steamBlue: '#1b2838',
  amethyst: '#9B59B6'
}

export const breakpoints = {
  desktops: '1024px',
  tablets: '768px'
}

export const GlobalCss = createGlobalStyle`

  @font-face {
    font-family: 'Chirp';
    src: url('./assets//fonts/Chirp Bold.woff') format('woff'),
         url('./assets//fonts/Chirp Bold.ttf') format('truetype'),
         url('./assets//fonts/Chirp Bold.otf') format('opentype');
    font-weight: 700; /* Ou 700 para Bold */
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Chirp';
    src: url('./assets/fonts/Chirp Heavy.woff') format('woff'),
         url('./assets//fonts/Chirp Heavy.ttf') format('truetype'),
         url('./assets//fonts/Chirp Heavy.otf') format('opentype');
    font-weight: 900; /* Ou um valor alto como 900 para Heavy */
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Chirp';
    src: url('./assets//fonts/Chirp Medium.woff') format('woff'),
         url('./assets//fonts/Chirp Medium.ttf') format('truetype'),
         url('./assets//fonts/Chirp Medium.otf') format('opentype');
    font-weight: 500; /* Ou um valor como 500 para Medium */
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Chirp';
    src: url('./assets//fonts/Chirp Regular.woff') format('woff'),
         url('./assets//fonts/Chirp Regular.ttf') format('truetype'),
         url('./assets//fonts/Chirp Regular.otf') format('opentype');
    font-weight: 400; /* Ou 'normal' para Regular */
    font-style: normal;
    font-display: swap;
  }

  /* Estilos Globais */
  *{
    margin: 0;
    padding:0;
    box-sizing: border-box;
    font-family: 'Chirp', sans-serif; /* AQUI! Aplicando a Chirp como fonte principal */
    list-style: none;
  }
  body {
    background-color: ${colors.black};
    color: ${colors.white};
  }

  .container{
    max-width: 1024px;
    width: 100%;
    margin: 0 auto;

    @media (max-width: ${breakpoints.desktops}) {
      max-width: 80%
    }
  }
`
