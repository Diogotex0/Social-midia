# Social Media Manager — SaaS

Sistema web completo para gestores de social media freelancers gerenciarem clientes, conteúdos, financeiro e ideias com IA.

---

## Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript + TailwindCSS
- **UI:** Componentes customizados (estilo Shadcn/ui)
- **Backend:** Next.js API Routes + Server Actions
- **Banco de dados:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **IA:** Claude API (Anthropic)

---

## Instalação passo a passo

### 1. Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com) (gratuito)
- Conta na [Anthropic](https://console.anthropic.com) para a chave de API

---

### 2. Instalar dependências

```bash
cd "social midia"
npm install
```

---

### 3. Configurar o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Aguarde o projeto inicializar (~1 min)
3. Vá em **SQL Editor** → clique em **New Query**
4. Cole o conteúdo de `database/schema.sql` e clique em **Run**
5. Após executar, vá em **Project Settings** → **API**
6. Copie:
   - `URL` (NEXT_PUBLIC_SUPABASE_URL)
   - `anon public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - `service_role` key (SUPABASE_SERVICE_ROLE_KEY)

---

### 4. Configurar variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas chaves:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# NextAuth (gere com: openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_chave_secreta_minimo_32_chars

# Claude AI (Anthropic)
ANTHROPIC_API_KEY=sk-ant-...
```

> **Como gerar o NEXTAUTH_SECRET:**
> ```bash
> openssl rand -base64 32
> ```
> Ou use: https://generate-secret.vercel.app/32

---

### 5. Configurar URL de redirect no Supabase

1. No Supabase, vá em **Authentication** → **URL Configuration**
2. Em **Site URL**, coloque: `http://localhost:3000`
3. Em **Redirect URLs**, adicione: `http://localhost:3000/api/auth/callback`

---

### 6. Rodar localmente

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

### 7. Criar sua conta

1. Acesse `/register`
2. Crie sua conta com e-mail e senha
3. Confirme o e-mail (verifique sua caixa de entrada)
4. Faça login em `/login`

---

## Estrutura do projeto

```
social-media-manager/
├── app/
│   ├── (auth)/              # Login + Registro
│   ├── (dashboard)/         # Área autenticada
│   │   ├── dashboard/       # Página inicial
│   │   ├── clients/         # Gestão de clientes
│   │   ├── contents/        # Gestão de conteúdos
│   │   ├── calendar/        # Calendário visual
│   │   ├── ideas/           # Banco de ideias + IA
│   │   ├── finances/        # Controle financeiro
│   │   ├── notifications/   # Alertas e notificações
│   │   └── metrics/         # Métricas de posts
│   └── api/                 # API Routes
├── components/
│   ├── ui/                  # Componentes base
│   ├── layout/              # Sidebar + Header
│   ├── dashboard/           # Componentes do dashboard
│   ├── clients/             # Componentes de clientes
│   ├── contents/            # Componentes de conteúdos
│   ├── calendar/            # Componentes do calendário
│   ├── ideas/               # Componentes de ideias
│   ├── finances/            # Componentes financeiros
│   ├── notifications/       # Componentes de notificações
│   └── metrics/             # Componentes de métricas
├── lib/
│   ├── supabase/            # Clientes Supabase (browser + server)
│   └── utils.ts             # Utilitários
├── types/                   # TypeScript types + Database types
├── database/
│   └── schema.sql           # Schema completo do banco
├── hooks/                   # React hooks customizados
└── middleware.ts             # Auth middleware (proteção de rotas)
```

---

## Funcionalidades

| Módulo | Funcionalidades |
|--------|----------------|
| **Dashboard** | Stats globais, conteúdos recentes, tarefas, alertas |
| **Clientes** | CRUD completo, cores, redes sociais, valor mensal |
| **Conteúdos** | CRUD com status, plataforma, formato, pilar, legenda |
| **Calendário** | Visualização mensal, filtro por cliente, detalhe do dia |
| **Banco de Ideias** | CRUD + Gerador de ideias com Claude AI |
| **Financeiro** | Controle por mês/ano, status de pagamento por cliente |
| **Notificações** | Posts atrasados, pagamentos, clientes sem conteúdo |
| **Métricas** | Curtidas, comentários, alcance, compartilhamentos |

---

## Deploy (Vercel)

```bash
npm install -g vercel
vercel
```

Adicione todas as variáveis de ambiente no painel da Vercel.

Para produção, atualize no Supabase:
- **Site URL:** `https://seu-dominio.vercel.app`
- **Redirect URLs:** `https://seu-dominio.vercel.app/api/auth/callback`

---

## Segurança

- Row Level Security (RLS) ativado em todas as tabelas
- Cada usuário acessa APENAS seus próprios dados
- Autenticação via Supabase Auth (JWT)
- Middleware protege todas as rotas do dashboard
