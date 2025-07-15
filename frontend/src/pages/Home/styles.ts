import styled from 'styled-components'

export const ContentWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &.blurred {
    filter: blur(5px);
    transition: filter 0.3s ease-in-out;
    pointer-events: none;
    user-select: none;
  }
`

export const Container = styled.div`
  width: 100%;
  background: black;
  display: flex;
  flex-direction: row;
  flex-grow: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 5% 10%;
  }
`

export const Left = styled.div`
  flex: 0.4;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    flex: none;
    height: 80px;
    justify-content: flex-start;
    padding: 10px 20px;
  }
`

export const Logo = styled.img`
  width: 250px;

  @media (max-width: 1024px) {
    width: 200px;
  }

  @media (max-width: 768px) {
    width: 45px;
  }
`

export const Right = styled.div`
  flex: 0.6;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;

  @media (max-width: 768px) {
    flex: 1;
    justify-content: flex-start;
    margin-top: 40px;
  }
`

export const Title = styled.h1`
  font-family: 'Chirp', sans-serif;
  font-size: 64px;
  font-weight: 900;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    font-size: 42px;
  }
`

export const Subtitle = styled.h2`
  font-size: 31px;
  margin-bottom: 30px;
  font-weight: 900;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`

export const ButtonContainer = styled.div`
  width: fit-content;
  min-width: 300px;
  max-width: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;

  button {
    margin: 20px 0;
  }
`

export const Terms = styled.p`
  font-size: 12px;
  color: #71767b;
  margin-bottom: 30px;

  a {
    color: #1d9bf0;
    text-decoration: none;
  }
`

export const LoginText = styled.p`
  font-size: 15px;
  margin-bottom: 10px;
  font-weight: 700;
`

export const LoginButton = styled.button`
  background: transparent;
  color: #1d9bf0;
  border: 1px solid #536471;
  border-radius: 25px;
  padding: 12px 0;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: rgba(29, 155, 240, 0.1);
  }
`
