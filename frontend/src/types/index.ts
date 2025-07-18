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
  access_token: string
  refresh_token?: string
  user: {
    banner_url: string
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
  id: string | number
  user: {
    id: number | string
    username: string
    display_name: string
    avatar_url: string
  }
  text_content: string
  image?: string
  likes_count: number
  reposts_count: number
  comments_count: number
  views_count?: string | number
  created_at: string
  updated_at: string
  is_liked_by_viewer?: boolean
  is_reposted_by_viewer?: boolean
}

export interface UserToFollowType {
  id: number | string
  avatar_url: string
  username: string
  display_name: string
  is_followed_by_viewer?: boolean
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

// NOVO: Adicionar a interface CommentType aqui
export interface CommentType {
  id: number | string
  post: number | string // ID do post pai
  author: AuthSuccessResponse['user'] // Autor do comentário (UserSerializer aninhado)
  content: string
  created_at: string
  likes_count?: number // ADICIONADO: Contagem de curtidas
  is_liked_by_viewer?: boolean
}
