import React from 'react'
import Post from '../Post/Post' // Caminho relativo para o componente Post
import * as S from './styles' // Importa os estilos locais
import type { PostType } from '../../types' // Importar PostType

interface MainFeedProps {
  posts: PostType[] // Array de posts para exibir
  onOpenCreatePostModal: () => void // Handler para abrir o modal de criação de post
  userAvatarUrl: string // URL do avatar do usuário logado (para a seção "O que está acontecendo?")
  isLoadingPosts: boolean // NOVO: Estado de carregamento dos posts
  feedType: 'forYou' | 'following' // NOVO: Tipo de feed ativo
  setFeedType: (type: 'forYou' | 'following') => void // NOVO: Setter para o tipo de feed
}

const MainFeed: React.FC<MainFeedProps> = ({
  posts,
  onOpenCreatePostModal,
  userAvatarUrl,
  isLoadingPosts,
  feedType,
  setFeedType
}) => {
  return (
    <S.MainContentContainer>
      <S.FeedHeader>
        {/* Usar feedType e setFeedType para controlar as tabs */}
        <S.FeedHeaderTab
          className={feedType === 'forYou' ? 'active' : ''}
          onClick={() => setFeedType('forYou')}
        >
          Para você
        </S.FeedHeaderTab>
        <S.FeedHeaderTab
          className={feedType === 'following' ? 'active' : ''}
          onClick={() => setFeedType('following')}
        >
          Seguindo
        </S.FeedHeaderTab>
      </S.FeedHeader>

      <S.PostCreationSection onClick={onOpenCreatePostModal}>
        <S.PostCreationSectionAvatar src={userAvatarUrl} />
        <S.PostCreationSectionText>
          O que está acontecendo?
        </S.PostCreationSectionText>
      </S.PostCreationSection>

      {/* Exibir loading ou posts */}
      {isLoadingPosts ? (
        <S.LoadingIndicator>Carregando posts...</S.LoadingIndicator> // Adicione um estilo para isso em styles.ts
      ) : (
        posts.map((post) => <Post key={post.id} post={post} />)
      )}
      {/* Mensagem se não houver posts e não estiver carregando */}
      {!isLoadingPosts && posts.length === 0 && (
        <S.NoPostsMessage>Nenhuma postagem para exibir.</S.NoPostsMessage> // Adicione um estilo para isso em styles.ts
      )}
    </S.MainContentContainer>
  )
}

export default MainFeed
