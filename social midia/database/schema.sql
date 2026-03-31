-- ============================================================
-- SOCIAL MEDIA MANAGER — Schema Completo
-- Execute no SQL Editor do Supabase
-- ============================================================

-- Habilita extensão de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS (gerenciado pelo Supabase Auth, mas perfil extendido)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT,
  email       TEXT UNIQUE NOT NULL,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CLIENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.clients (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  niche           TEXT,
  monthly_value   NUMERIC(10, 2) DEFAULT 0,
  payment_day     INTEGER CHECK (payment_day BETWEEN 1 AND 31),
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  instagram       TEXT,
  tiktok          TEXT,
  facebook        TEXT,
  youtube         TEXT,
  linkedin        TEXT,
  notes           TEXT,
  color           TEXT DEFAULT '#6366f1',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_clients_status ON public.clients(status);

-- ============================================================
-- CONTENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contents (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id   UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  caption     TEXT,
  hashtags    TEXT,
  platform    TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'facebook', 'youtube', 'linkedin', 'twitter')),
  format      TEXT NOT NULL CHECK (format IN ('reels', 'stories', 'post', 'carrossel', 'live', 'shorts', 'video')),
  pillar      TEXT,
  status      TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_production', 'ready', 'posted', 'delayed')),
  scheduled_at TIMESTAMPTZ,
  posted_at   TIMESTAMPTZ,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contents_user_id ON public.contents(user_id);
CREATE INDEX idx_contents_client_id ON public.contents(client_id);
CREATE INDEX idx_contents_status ON public.contents(status);
CREATE INDEX idx_contents_scheduled_at ON public.contents(scheduled_at);

-- ============================================================
-- IDEAS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ideas (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id     UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  hook          TEXT,
  tags          TEXT[] DEFAULT '{}',
  platform      TEXT,
  source        TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'ai')),
  converted     BOOLEAN DEFAULT FALSE,
  content_id    UUID REFERENCES public.contents(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ideas_user_id ON public.ideas(user_id);
CREATE INDEX idx_ideas_client_id ON public.ideas(client_id);
CREATE INDEX idx_ideas_converted ON public.ideas(converted);

-- ============================================================
-- FINANCES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.finances (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id     UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  month         INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year          INTEGER NOT NULL,
  amount        NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'delayed')),
  due_date      DATE,
  paid_at       DATE,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(client_id, month, year)
);

CREATE INDEX idx_finances_user_id ON public.finances(user_id);
CREATE INDEX idx_finances_client_id ON public.finances(client_id);
CREATE INDEX idx_finances_status ON public.finances(status);
CREATE INDEX idx_finances_month_year ON public.finances(month, year);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('delayed_post', 'no_content', 'payment_delayed', 'payment_due', 'general')),
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  read        BOOLEAN NOT NULL DEFAULT FALSE,
  link        TEXT,
  client_id   UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- ============================================================
-- METRICS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.metrics (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id      UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
  likes           INTEGER DEFAULT 0,
  comments        INTEGER DEFAULT 0,
  shares          INTEGER DEFAULT 0,
  reach           INTEGER DEFAULT 0,
  impressions     INTEGER DEFAULT 0,
  saved           INTEGER DEFAULT 0,
  recorded_at     DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_metrics_content_id ON public.metrics(content_id);
CREATE INDEX idx_metrics_user_id ON public.metrics(user_id);

-- ============================================================
-- TRIGGERS — updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contents_updated_at
  BEFORE UPDATE ON public.contents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ideas_updated_at
  BEFORE UPDATE ON public.ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_finances_updated_at
  BEFORE UPDATE ON public.finances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_metrics_updated_at
  BEFORE UPDATE ON public.metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TRIGGER — cria perfil automaticamente no cadastro
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finances    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics     ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Clients
CREATE POLICY "Users can CRUD own clients"
  ON public.clients FOR ALL USING (auth.uid() = user_id);

-- Contents
CREATE POLICY "Users can CRUD own contents"
  ON public.contents FOR ALL USING (auth.uid() = user_id);

-- Ideas
CREATE POLICY "Users can CRUD own ideas"
  ON public.ideas FOR ALL USING (auth.uid() = user_id);

-- Finances
CREATE POLICY "Users can CRUD own finances"
  ON public.finances FOR ALL USING (auth.uid() = user_id);

-- Notifications
CREATE POLICY "Users can manage own notifications"
  ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- Metrics
CREATE POLICY "Users can CRUD own metrics"
  ON public.metrics FOR ALL USING (auth.uid() = user_id);
