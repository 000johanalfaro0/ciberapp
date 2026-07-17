-- ============================================================================
-- raíz_ · Schema Supabase multi-tenant para el SaaS de ciberseguridad
-- ============================================================================
--
-- Decisiones de diseño:
--   * Row Level Security (RLS) en TODAS las tablas → multi-tenant nativo.
--   * Un "tenant" = un usuario individual (B2C). Para B2B futuro, agregar tabla
--     `organizations` y mover user_id → org_id.
--   * auth.users es de Supabase Auth. NO lo tocamos.
--   * El contenido del curso (lecciones) es estático; el progreso del usuario
--     es lo único que vive en DB con RLS.
-- ============================================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. PROGRESO DE USUARIO (lo único que vive en DB por usuario)
-- ============================================================================

create table if not exists public.user_progress (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  modulo_id     text not null,            -- "M0", "M1", ... "AI-LLM"
  leccion_id    text not null,            -- "M0-L01", "M0-L02", ...
  estado        text not null default 'no_empezado'
                check (estado in ('no_empezado','en_progreso','completado','debil')),
  intentos      int  not null default 0,
  ultimo_intento timestamptz,
  completado_en timestamptz,
  -- métricas de spaced repetition (estilo Anki)
  sr_interval   int  not null default 1,   -- días hasta siguiente repaso
  sr_ease       real not null default 2.5, -- factor de facilidad
  sr_prox_repaso timestamptz,
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  unique (user_id, leccion_id)
);

create index if not exists idx_user_progress_user      on public.user_progress(user_id);
create index if not exists idx_user_progress_repaso    on public.user_progress(user_id, sr_prox_repaso)
  where sr_prox_repaso is not null;
create index if not exists idx_user_progress_estado    on public.user_progress(user_id, estado);

-- ============================================================================
-- 2. FLASHCARDS — repaso spaced repetition (generadas del glosario)
-- ============================================================================

create table if not exists public.flashcards (
  id            uuid primary key default uuid_generate_v4(),
  termino       text not null,             -- término del glosario
  anverso       text not null,
  reverso       text not null,
  modulo_origen text not null,             -- módulo que introduce el término
  created_at    timestamptz not null default now()
);

create table if not exists public.user_flashcard_state (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  flashcard_id    uuid not null references public.flashcards(id) on delete cascade,
  sr_interval     int  not null default 1,
  sr_ease         real not null default 2.5,
  sr_prox_repaso  timestamptz not null default now() + interval '1 day',
  veces_vista     int  not null default 0,
  ultima_rating   text check (ultima_rating in ('again','hard','good','easy')),
  updated_at      timestamptz not null default now(),
  unique (user_id, flashcard_id)
);

create index if not exists idx_ufcs_repaso on public.user_flashcard_state(user_id, sr_prox_repaso);

-- ============================================================================
-- 3. QUIZ ATTEMPTS — respuestas a quizzes por lección
-- ============================================================================

create table if not exists public.quiz_attempts (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  leccion_id    text not null,
  pregunta_idx  int  not null,
  respuesta_idx int  not null,
  correcta      boolean not null,
  created_at    timestamptz not null default now()
);

create index if not exists idx_quiz_user_leccion on public.quiz_attempts(user_id, leccion_id);

-- ============================================================================
-- 4. SUSCRIPCIÓN (Stripe)
-- ============================================================================

create table if not exists public.subscriptions (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id    text unique,
  stripe_subscription_id text unique,
  plan                  text not null default 'free'
                        check (plan in ('free','pro','team')),
  status                text not null default 'active'
                        check (status in ('active','past_due','canceled','trialing')),
  current_period_end    timestamptz,
  cancel_at             timestamptz,
  metadata              jsonb not null default '{}'::jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create unique index if not exists idx_subs_user on public.subscriptions(user_id) where status = 'active';

-- ============================================================================
-- 5. EVENTOS / ANALYTICS (respetando privacidad)
-- ============================================================================

create table if not exists public.events (
  id          bigint primary key generated always as identity,
  user_id     uuid references auth.users(id) on delete set null,
  tipo        text not null,           -- 'leccion_iniciada', 'leccion_completada', etc.
  modulo_id   text,
  leccion_id  text,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists idx_events_user_time on public.events(user_id, created_at desc);
create index if not exists idx_events_tipo on public.events(tipo, created_at desc);

-- ============================================================================
-- 6. ROW LEVEL SECURITY — multi-tenant
-- ============================================================================

alter table public.user_progress        enable row level security;
alter table public.user_flashcard_state enable row level security;
alter table public.quiz_attempts        enable row level security;
alter table public.subscriptions        enable row level security;
alter table public.events               enable row level security;

-- flashcards es contenido público (todos los usuarios leen, nadie escribe desde API)
alter table public.flashcards enable row level security;
create policy "flashcards_public_read" on public.flashcards
  for select using (true);

-- Policy helper: un usuario solo ve/modifica sus propias filas
create policy "user_progress_owner_all"
  on public.user_progress
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "ufcs_owner_all"
  on public.user_flashcard_state
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "quiz_owner_insert"
  on public.quiz_attempts
  for insert
  with check (auth.uid() = user_id);

create policy "quiz_owner_select"
  on public.quiz_attempts
  for select
  using (auth.uid() = user_id);

create policy "subs_owner_select"
  on public.subscriptions
  for select
  using (auth.uid() = user_id);

-- subscriptions la escribe solo el webhook de Stripe (service_role), no el user
-- Por eso NO hay policy de insert/update para users.

create policy "events_owner_select"
  on public.events
  for select
  using (auth.uid() = user_id);

create policy "events_owner_insert"
  on public.events
  for insert
  with check (auth.uid() = user_id);

-- ============================================================================
-- 7. TRIGGERS — updated_at automático
-- ============================================================================

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_user_progress_touch on public.user_progress;
create trigger trg_user_progress_touch before update on public.user_progress
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_ufcs_touch on public.user_flashcard_state;
create trigger trg_ufcs_touch before update on public.user_flashcard_state
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_subs_touch on public.subscriptions;
create trigger trg_subs_touch before update on public.subscriptions
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- 8. HELPER FUNCTIONS (RPC) — usadas desde el frontend
-- ============================================================================

-- Progresión: dada una lección completada, devolver próximas desbloqueadas
create or replace function public.unlock_next_lessons(p_user_id uuid, p_leccion_id text)
returns table(leccion_id text, modulo_id text)
language plpgsql
security definer
as $$
begin
  -- TODO: lógica de grafo cuando se migr el grafo.json a tabla
  -- por ahora solo marca completado y devuelve la siguiente del mismo módulo
  return query
  select p_leccion_id, ''::text where false;  -- placeholder
end;
$$;

-- Estadísticas del dashboard
create or replace function public.user_stats(p_user_id uuid)
returns table(modulos_completados int, lecciones_completadas int, racha_dias int)
language plpgsql
security definer
as $$
declare
  v_mods int;
  v_lecs int;
  v_racha int;
begin
  select count(distinct modulo_id) into v_mods
  from public.user_progress
  where user_id = p_user_id and estado = 'completado';

  select count(*) into v_lecs
  from public.user_progress
  where user_id = p_user_id and estado = 'completado';

  -- racha: días consecutivos con al menos 1 lección completada (hasta hoy)
  with dias as (
    select distinct date(completado_en) as d
    from public.user_progress
    where user_id = p_user_id and completado_en is not null
  ),
  racha as (
    select count(*) as c from (
      select d, d - (row_number() over (order by d)) * interval '1 day' as g
      from dias
    ) x group by g order by max(d) desc limit 1
  )
  select coalesce(c, 0) into v_racha from racha;

  return query select v_mods, v_lecs, v_racha;
end;
$$;

-- ============================================================================
-- DONE
-- ============================================================================
