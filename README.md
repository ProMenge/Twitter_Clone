# 🐦 X Clone (Twitter Clone)

Um clone simplificado da popular plataforma de microblogging X (anteriormente Twitter), construído com uma arquitetura full-stack moderna utilizando React no frontend e Django REST Framework no backend.

Este projeto visa demonstrar a construção de uma aplicação web completa, incluindo autenticação de usuário, gerenciamento de posts, interações sociais e deploy em ambientes de produção.

## ✨ Funcionalidades Principais

-   **Autenticação de Usuário:**
    -   Registro de novas contas com nome, e-mail e data de nascimento (em 2 passos).
    -   Login de usuários existentes.
    -   Logout seguro.
-   **Feed de Postagens:**
    -   Visualização de um feed principal com posts de todos os usuários ("Para você").
    -   Visualização de um feed secundário com posts de usuários que você segue ("Seguindo").
    -   Atualização otimista da UI para interações.
-   **Criação de Postagens:**
    -   Publicação de posts com conteúdo textual.
    -   Anexo de imagens às postagens.
-   **Interações Sociais:**
    -   Funcionalidade de curtir/descurtir posts (com atualização otimista dos contadores).
    -   Funcionalidade de seguir/deixar de seguir outros usuários.
    -   Sugestões de usuários para seguir.
-   **Responsividade:** Design adaptável para diferentes tamanhos de tela (desktop e mobile).
-   **Interface Intuitiva:** UI inspirada no X, com navegação clara e interações fluidas.

## 🚀 Tecnologias Utilizadas

**Frontend:**
-   **React:** Biblioteca JavaScript para construção de interfaces de usuário.
-   **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
-   **Styled Components:** Para estilização baseada em componentes, permitindo CSS-in-JS.
-   **Formik:** Biblioteca para gerenciamento de estados de formulário e validação.
-   **Yup:** Biblioteca para validação de schemas de formulário.
-   **Axios:** Cliente HTTP para fazer requisições à API.
-   **React Router DOM:** Para roteamento na aplicação de página única (SPA).
-   **React Icons:** Biblioteca de ícones.
-   **date-fns:** Para formatação de datas.

**Backend:**
-   **Django:** Framework web Python de alto nível.
-   **Django REST Framework (DRF):** Toolkit poderoso para construir APIs web RESTful.
-   **PostgreSQL:** Banco de dados relacional robusto e escalável.
-   **djangorestframework-simplejwt:** Para autenticação JWT (JSON Web Tokens).
-   **dj-database-url:** Para configuração fácil do banco de dados via URL.
-   **Gunicorn:** Servidor WSGI para deploy em produção.
-   **WhiteNoise:** Para servir arquivos estáticos de forma eficiente em produção.
-   **django-cors-headers:** Para lidar com a política de Cross-Origin Resource Sharing (CORS).
-   **Poetry:** Ferramenta de gerenciamento de dependências e ambientes Python.

## 💻 Como Rodar o Projeto Localmente

Certifique-se de ter o **Node.js**, **npm/Yarn** (para o frontend), **Python** (preferencialmente 3.9+) e **Poetry** (para o backend), e o **PostgreSQL** instalados em sua máquina.

### **1. Backend (Django REST Framework)**

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    cd seu-repositorio/backend/src # Navegue para a raiz do seu projeto Django
    ```
    (Ajuste o caminho `backend/src` se seu `manage.py` e `pyproject.toml` estão em outro lugar.)

2.  **Instalar dependências com Poetry:**
    ```bash
    poetry install
    ```

3.  **Configurar Banco de Dados PostgreSQL:**
    * Crie um usuário e um banco de dados no PostgreSQL (via `psql` ou `pgAdmin 4`). Exemplo:
        ```sql
        CREATE DATABASE twitter_clone_db;
        CREATE USER twitter_clone_user WITH PASSWORD 'sua_senha_segura';
        GRANT ALL PRIVILEGES ON DATABASE twitter_clone_db TO twitter_clone_user;
        ```
    * Atualize seu `backend/config/settings.py` para usar essas credenciais localmente, ou defina a variável de ambiente `DATABASE_URL` (recomendado para usar PostgreSQL localmente):
        ```bash
        # Exemplo para PowerShell/CMD (ajuste para seu terminal)
        $env:DATABASE_URL="postgresql://twitter_clone_user:sua_senha_segura@localhost:5432/twitter_clone_db"
        # Para Linux/macOS
        export DATABASE_URL="postgresql://twitter_clone_user:sua_senha_segura@localhost:5432/twitter_clone_db"
        ```
        (Se você não definir `DATABASE_URL`, o projeto usará `db.sqlite3` localmente.)

4.  **Aplicar Migrações:**
    ```bash
    poetry run python manage.py migrate
    ```

5.  **Criar Superusuário (Opcional, para acessar o Admin Django):**
    ```bash
    poetry run python manage.py createsuperuser
    ```

6.  **Rodar o Servidor Backend:**
    ```bash
    poetry run python manage.py runserver
    ```
    O backend estará disponível em `http://localhost:8000/`.

### **2. Frontend (React)**

1.  **Navegar para o diretório do Frontend:**
    ```bash
    cd ../../frontend # Se você estava em backend/src
    # ou cd seu-repositorio/frontend
    ```

2.  **Instalar dependências:**
    ```bash
    npm install # ou yarn install
    ```

3.  **Configurar Variáveis de Ambiente:**
    * Crie um arquivo `.env.development` (ou apenas `.env`) na raiz do seu projeto `frontend`.
    * Adicione a URL do seu backend local:
        ```
        VITE_API_BASE_URL=http://localhost:8000/api/
        ```

4.  **Rodar o Servidor Frontend:**
    ```bash
    npm run dev # ou yarn dev
    ```
    O frontend estará disponível em `http://localhost:5173/` (ou outra porta se está estiver ocupada).

## 📄 Documentação da API

A documentação interativa da API (Swagger UI) pode ser acessada através do seu backend deployado:

[**API Documentation (Swagger UI)**](https://twitter-clone-tuc5.onrender.com/api/schema/swagger-ui/)

Esta interface fornece detalhes sobre todos os endpoints, modelos de dados e permite testar as requisições diretamente.

## ☁️ Deploy

Esta aplicação está deployada nas seguintes plataformas:

* **Backend (Django + PostgreSQL):** [Render.com](https://twitter-clone-tuc5.onrender.com)
* **Frontend (React):** [Vercel](https://twitter-clone-ashen-six-22.vercel.app/)

---

## 🤝 Contribuição

Sinta-se à vontade para explorar o código, sugerir melhorias ou reportar bugs.

---

## 📄 Licença

Este projeto é licenciado sob a licença MIT.
