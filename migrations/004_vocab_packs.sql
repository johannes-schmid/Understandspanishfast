-- AI vocabulary packs

create table if not exists vocab_packs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null,
  source_type text not null check (source_type in ('url','pdf','srt')),
  source_ref text,
  status text not null default 'processing' check (status in ('processing','ready','failed')),
  error text,
  word_count integer not null default 0,
  run_id text,
  build_id text,
  created_at timestamptz not null default now()
);
alter table vocab_packs enable row level security;
drop policy if exists "own packs" on vocab_packs;
create policy "own packs" on vocab_packs for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists vocab_packs_user_idx on vocab_packs (user_id, created_at desc);
create unique index if not exists vocab_packs_build_idx on vocab_packs (build_id);

create table if not exists pack_words (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references vocab_packs on delete cascade,
  position integer not null,
  lemma text not null,
  corpus_rank integer,
  pos text,
  meanings jsonb not null default '[]',
  example_es text,
  example_en text,
  why text,
  image text,
  doc_freq integer,
  created_at timestamptz not null default now()
);
alter table pack_words enable row level security;
drop policy if exists "own pack words" on pack_words;
create policy "own pack words" on pack_words for all
  using (exists (select 1 from vocab_packs p where p.id = pack_words.pack_id and p.user_id = auth.uid()))
  with check (exists (select 1 from vocab_packs p where p.id = pack_words.pack_id and p.user_id = auth.uid()));
create index if not exists pack_words_pack_idx on pack_words (pack_id, position);

-- SRS progress for NON-corpus pack words only (corpus pack words use user_word_progress by rank)
create table if not exists user_pack_word_progress (
  user_id uuid not null references auth.users on delete cascade,
  pack_word_id uuid not null references pack_words on delete cascade,
  status text not null check (status in ('again','hard','good','easy')),
  interval integer not null default 1,
  ease_factor float not null default 2.5,
  repetitions integer not null default 0,
  next_review timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key (user_id, pack_word_id)
);
alter table user_pack_word_progress enable row level security;
drop policy if exists "own pack progress" on user_pack_word_progress;
create policy "own pack progress" on user_pack_word_progress for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Ephemeral artifacts passed between agent steps (raw text / candidate lists) — never exposed to the LLM.
-- Written by the workflow via the service role; not user-accessible (RLS on, no policy = deny-all to clients).
create table if not exists pack_build_artifacts (
  build_id text not null,
  kind text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  primary key (build_id, kind)
);
alter table pack_build_artifacts enable row level security;
