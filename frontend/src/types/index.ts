export interface ModalAuthFormValues {
  name?: string | null
  contact?: string | null
  birthMonth?: string | null
  birthDay?: string | null
  birthYear?: string | null
  password?: string | null
  confirm_password?: string | null
  username_or_email?: string | null

  _type_context?: 'login' | 'register' | null
  _step_context?: number | null
  _useEmailForContact_context?: boolean | null
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
  display_name: string
  birth_date: string
}

export interface LoginPayload {
  username_or_email: string
  password: string
}

export interface AuthSuccessResponse {
  token: string
  refresh_token?: string
  user: {
    id: number
    username: string
    email: string
    display_name: string
    avatar_url: string
    bio: string
    location: string
    website: string
    birth_date: string
    created_at: string
    followers_count: number
    following_count: number
    is_followed_by_viewer?: boolean
  }
}

export interface PostType {
  id: string | number // Pode ser string (UUID) ou number (BigAutoField)
  user: {
    id: number | string
    username: string
    display_name: string
    avatar_url: string
    // Adicione outros campos do UserSerializer que são serializados dentro do Post
  }
  text_content: string
  image?: string // URL da imagem, opcional
  likes_count: number
  reposts_count: number // Para retweets
  comments_count: number // Para comentários
  views_count?: string | number // Pode ser string ("23 mil") ou number
  created_at: string // Formato ISO 8601
  updated_at: string // Formato ISO 8601
  is_liked_by_viewer?: boolean
  is_reposted_by_viewer?: boolean
}

export interface UserToFollowType {
  id: number | string
  avatar_url: string
  username: string
  display_name: string
  is_followed_by_viewer?: boolean // Para exibir o botão "Seguir/Seguindo"
  // Outros campos para sugestões de usuário
}

export interface TrendType {
  category: string
  hashtag: string
  tweets: string
}

export interface ApiValidationError {
  [key: string]: string[] | string | undefined
  non_field_errors?: string[]
  detail?: string
}
