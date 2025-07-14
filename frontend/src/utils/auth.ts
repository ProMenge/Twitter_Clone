export const isAuthenticated = (): boolean => {
  const accessToken = localStorage.getItem('access_token')
  console.log(accessToken)
  return !!accessToken
}
