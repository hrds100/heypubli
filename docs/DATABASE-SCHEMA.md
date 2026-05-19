# Database Schema — Supabase

Project: `lmzttpfckdknrmeaecce` | Region: `eu-west-1`

## Tables

### profiles (influencers)

| Column                 | Type        | Description                               |
| ---------------------- | ----------- | ----------------------------------------- |
| id                     | uuid (PK)   | Supabase Auth ID                          |
| first_name             | text        | Nome                                      |
| last_name              | text        | Sobrenome                                 |
| email                  | text        | Email                                     |
| whatsapp               | text        | WhatsApp (+55...)                         |
| date_of_birth          | date        | Data de nascimento                        |
| gender                 | text        | male/female/non_binary/undisclosed        |
| address_street         | text        | Rua                                       |
| address_city           | text        | Cidade                                    |
| address_postal_code    | text        | CEP                                       |
| address_country        | text        | País (default: BR)                        |
| phone                  | text        | Celular com código do país                |
| timezone               | text        | Fuso horário (default: America/Sao_Paulo) |
| hotmart_url            | text        | Link de afiliado do Hotmart               |
| hotmart_affiliate_code | text        | Código do afiliado no Hotmart             |
| onboarding_step        | integer     | Etapa atual (1-6)                         |
| onboarding_complete    | boolean     | Todas as etapas concluídas                |
| is_admin               | boolean     | Usuário administrador                     |
| last_accessed_at       | timestamptz | Último acesso                             |
| created_at             | timestamptz | Data de cadastro                          |

### sectors (catálogo de nichos)

| Column     | Type      | Description                  |
| ---------- | --------- | ---------------------------- |
| id         | uuid (PK) | ID                           |
| name       | text      | Nome do setor                |
| slug       | text      | Slug (ex: "saude-bem-estar") |
| is_active  | boolean   | Visível no onboarding        |
| sort_order | integer   | Ordem de exibição            |

### influencer_sectors

| Column     | Type        | Description              |
| ---------- | ----------- | ------------------------ |
| id         | uuid (PK)   | ID                       |
| profile_id | uuid (FK)   | → profiles.id            |
| sector_id  | uuid (FK)   | → sectors.id             |
| type       | text        | "preferred" ou "content" |
| created_at | timestamptz | Quando selecionou        |

### instagram_connections

| Column             | Type             | Description                      |
| ------------------ | ---------------- | -------------------------------- |
| id                 | uuid (PK)        | ID                               |
| profile_id         | uuid (FK)        | → profiles.id                    |
| ig_user_id         | text             | ID do Instagram                  |
| ig_username        | text             | @ do Instagram                   |
| access_token       | text (encrypted) | Token de longa duração (60 dias) |
| token_expires_at   | timestamptz      | Expiração do token               |
| token_refreshed_at | timestamptz      | Último refresh                   |
| is_connected       | boolean          | Conexão ativa                    |
| followers_count    | integer          | Seguidores                       |
| created_at         | timestamptz      | Quando conectou                  |

### brands

| Column             | Type        | Description                    |
| ------------------ | ----------- | ------------------------------ |
| id                 | uuid (PK)   | ID                             |
| name               | text        | Nome da marca                  |
| logo_url           | text        | URL do logo (Supabase Storage) |
| description        | text        | Descrição curta                |
| hotmart_product_id | text        | ID do produto no Hotmart       |
| target_sectors     | text[]      | Setores alvo (array de slugs)  |
| is_active          | boolean     | Marca ativa ou futura          |
| created_at         | timestamptz | Data de criação                |

### brand_assignments

| Column      | Type        | Description          |
| ----------- | ----------- | -------------------- |
| id          | uuid (PK)   | ID                   |
| profile_id  | uuid (FK)   | → profiles.id        |
| brand_id    | uuid (FK)   | → brands.id          |
| assigned_at | timestamptz | Quando foi vinculado |

### scheduled_posts

| Column        | Type        | Description                                |
| ------------- | ----------- | ------------------------------------------ |
| id            | uuid (PK)   | ID                                         |
| profile_id    | uuid (FK)   | → profiles.id                              |
| brand_id      | uuid (FK)   | → brands.id                                |
| media_type    | text        | feed/story_image/story_video/reel/carousel |
| media_url     | text        | URL da imagem/vídeo                        |
| caption       | text        | Legenda                                    |
| scheduled_at  | timestamptz | Quando publicar                            |
| status        | text        | pending/published/failed                   |
| ig_media_id   | text        | ID do post no Instagram                    |
| published_at  | timestamptz | Quando publicou                            |
| error_message | text        | Motivo da falha                            |
| created_at    | timestamptz | Quando agendou                             |

### messages_log

| Column     | Type        | Description                |
| ---------- | ----------- | -------------------------- |
| id         | uuid (PK)   | ID                         |
| profile_id | uuid (FK)   | → profiles.id              |
| channel    | text        | whatsapp/email             |
| direction  | text        | outbound/inbound           |
| content    | text        | Conteúdo                   |
| status     | text        | sent/delivered/read/failed |
| sent_at    | timestamptz | Quando enviou              |
| sent_by    | text        | admin/system               |

### hotmart_sales

| Column            | Type        | Description                  |
| ----------------- | ----------- | ---------------------------- |
| id                | uuid (PK)   | ID                           |
| profile_id        | uuid (FK)   | → profiles.id                |
| transaction_id    | text        | ID da transação Hotmart      |
| product_name      | text        | Nome do produto              |
| sale_amount       | numeric     | Valor da venda (R$)          |
| commission_amount | numeric     | Comissão do afiliado (R$)    |
| status            | text        | confirmed/refunded/cancelled |
| sold_at           | timestamptz | Data da venda                |

### admin_sessions

| Column          | Type        | Description                |
| --------------- | ----------- | -------------------------- |
| id              | uuid (PK)   | ID                         |
| admin_id        | uuid (FK)   | → profiles.id (admin)      |
| impersonated_id | uuid (FK)   | → profiles.id (influencer) |
| started_at      | timestamptz | Início da sessão           |
| ended_at        | timestamptz | Fim da sessão              |
| actions_taken   | jsonb       | Log de ações               |
