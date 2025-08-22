# API de Lista de Tarefas

Esta é uma API para gerenciar uma lista de tarefas (To-Do list). Ela permite que os usuários se registrem, façam login e gerenciem suas tarefas.

## Pré-requisitos

- Node.js
- npm
- Docker (opcional, para o banco de dados)

## Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/lucasarod-br/todolist-ex.git
    ```
2.  Navegue até o diretório `api-todo`:
    ```bash
    cd api-todo
    ```
3.  Instale as dependências:
    ```bash
    npm install
    ```
4.  Crie um arquivo `.env` na raiz do diretório `api-todo` e adicione as seguintes variáveis de ambiente:
    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"
    JWT_ACCESS_SECRET="youraccesstokensecret"
    JWT_REFRESH_SECRET="yourrefreshtokensecret"
    ```
5.  Execute as migrações do Prisma para criar as tabelas do banco de dados:
    ```bash
    npx prisma migrate dev
    ```
6.  Inicie o servidor:
    ```bash
    npm start
    ```

## Endpoints da API

Todos os endpoints que requerem autenticação esperam um token de acesso no cabeçalho `Authorization` no formato `Bearer <token>`.

### Autenticação

#### `POST /auth/register`

Registra um novo usuário.

-   **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
-   **Response (200 OK):**
    ```json
    {
      "accessToken": "...",
      "refreshToken": "..."
    }
    ```

#### `POST /auth/login`

Autentica um usuário e retorna tokens de acesso e atualização.

-   **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
-   **Response (200 OK):**
    ```json
    {
      "accessToken": "...",
      "refreshToken": "..."
    }
    ```

#### `POST /auth/refreshToken`

Gera um novo token de acesso usando um token de atualização.

-   **Request Body:**
    ```json
    {
      "refreshToken": "..."
    }
    ```
-   **Response (200 OK):**
    ```json
    {
      "accessToken": "...",
      "refreshToken": "..."
    }
    ```

### Usuários

#### `GET /users/profile`

Retorna o perfil do usuário autenticado.

-   **Autenticação:** Obrigatória.
-   **Response (200 OK):**
    ```json
    {
      "id": 1,
      "email": "user@example.com"
    }
    ```

### Tarefas

#### `POST /tasks`

Cria uma nova tarefa.

-   **Autenticação:** Obrigatória.
-   **Request Body:**
    ```json
    {
      "title": "Minha nova tarefa",
      "description": "Descrição da tarefa"
    }
    ```
-   **Response (201 Created):**
    ```json
    {
      "id": 1,
      "title": "Minha nova tarefa",
      "description": "Descrição da tarefa",
      "userId": 1
    }
    ```

#### `GET /tasks`

Retorna todas as tarefas do usuário autenticado.

-   **Autenticação:** Obrigatória.
-   **Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "title": "Minha nova tarefa",
        "description": "Descrição da tarefa",
        "userId": 1
      }
    ]
    ```

#### `GET /tasks/:id`

Retorna uma tarefa específica pelo ID.

-   **Autenticação:** Obrigatória.
-   **Response (200 OK):**
    ```json
    {
      "id": 1,
      "title": "Minha nova tarefa",
      "description": "Descrição da tarefa",
      "userId": 1
    }
    ```

#### `PUT /tasks/:id`

Atualiza uma tarefa específica pelo ID.

-   **Autenticação:** Obrigatória.
-   **Request Body:**
    ```json
    {
      "title": "Título atualizado",
      "description": "Descrição atualizada"
    }
    ```
-   **Response (200 OK):**
    ```json
    {
      "id": 1,
      "title": "Título atualizado",
      "description": "Descrição atualizada",
      "userId": 1
    }
    ```

#### `DELETE /tasks/:id`

Exclui uma tarefa específica pelo ID.

-   **Autenticação:** Obrigatória.
-   **Response (204 No Content):**
    (Sem conteúdo no corpo da resposta)
```
