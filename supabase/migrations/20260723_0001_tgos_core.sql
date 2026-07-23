create extension if not exists pgcrypto;

create table if not exists public.tgos_entities (
  id text primary key,
  type text not null,
  name text not null,
  attributes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tgos_relationships (
  id text primary key,
  from_entity_id text not null references public.tgos_entities(id) on delete cascade,
  to_entity_id text not null references public.tgos_entities(id) on delete cascade,
  type text not null,
  attributes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint tgos_relationship_no_self_link check (from_entity_id <> to_entity_id)
);

create table if not exists public.tgos_events (
  id text primary key,
  type text not null,
  occurred_at timestamptz not null,
  recorded_at timestamptz not null default now(),
  source text not null,
  entity_id text references public.tgos_entities(id) on delete set null,
  correlation_id text,
  causation_id text references public.tgos_events(id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.tgos_recommendations (
  id text primary key,
  event_id text references public.tgos_events(id) on delete set null,
  entity_id text references public.tgos_entities(id) on delete set null,
  rule_id text not null,
  priority text not null check (priority in ('critical', 'high', 'medium', 'low')),
  category text not null,
  title text not null,
  detail text not null,
  action_label text not null,
  status text not null default 'open' check (status in ('open', 'acknowledged', 'completed', 'dismissed')),
  generated_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists tgos_entities_type_idx
  on public.tgos_entities(type);

create index if not exists tgos_relationships_from_idx
  on public.tgos_relationships(from_entity_id, type);

create index if not exists tgos_relationships_to_idx
  on public.tgos_relationships(to_entity_id, type);

create unique index if not exists tgos_relationships_unique_edge_idx
  on public.tgos_relationships(from_entity_id, to_entity_id, type);

create index if not exists tgos_events_occurred_at_idx
  on public.tgos_events(occurred_at desc);

create index if not exists tgos_events_type_time_idx
  on public.tgos_events(type, occurred_at desc);

create index if not exists tgos_events_entity_time_idx
  on public.tgos_events(entity_id, occurred_at desc)
  where entity_id is not null;

create index if not exists tgos_events_correlation_idx
  on public.tgos_events(correlation_id)
  where correlation_id is not null;

create index if not exists tgos_events_payload_gin_idx
  on public.tgos_events using gin(payload);

create index if not exists tgos_recommendations_open_priority_idx
  on public.tgos_recommendations(status, priority, generated_at desc);

create index if not exists tgos_recommendations_entity_idx
  on public.tgos_recommendations(entity_id, generated_at desc)
  where entity_id is not null;

create or replace function public.prevent_tgos_event_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'TGOS events are append-only and cannot be updated or deleted';
end;
$$;

create trigger tgos_events_prevent_update
before update on public.tgos_events
for each row execute function public.prevent_tgos_event_mutation();

create trigger tgos_events_prevent_delete
before delete on public.tgos_events
for each row execute function public.prevent_tgos_event_mutation();

create or replace function public.set_tgos_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tgos_entities_set_updated_at
before update on public.tgos_entities
for each row execute function public.set_tgos_updated_at();

alter table public.tgos_entities enable row level security;
alter table public.tgos_relationships enable row level security;
alter table public.tgos_events enable row level security;
alter table public.tgos_recommendations enable row level security;

comment on table public.tgos_events is
  'Immutable operational history consumed by the TGOS reasoning engine.';

comment on table public.tgos_recommendations is
  'Actionable intelligence generated from TGOS events and rules.';
