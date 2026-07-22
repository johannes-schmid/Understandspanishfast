-- Run this in the Supabase SQL editor.
-- Adds the two things the retention email cron needs: a server-reachable copy of
-- the user's email address, and a ledger of what has already been sent.

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now(),
  email_opt_out boolean not null default false,
  unsubscribe_token uuid not null default gen_random_uuid()
);

alter table profiles enable row level security;

drop policy if exists "own row" on profiles;
create policy "own row" on profiles
  for select using (auth.uid() = id);

create index if not exists profiles_created_at_idx on profiles (created_at);

-- Populate on signup. Guarded against null emails (phone/anonymous auth records):
-- this trigger fires inside the auth.users insert, so a failure here would break
-- sign-up itself. Skip and return cleanly instead.
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.email is null then
    return new;
  end if;
  insert into profiles (id, email, full_name, created_at)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.created_at)
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Backfill existing users. created_at is carried over from auth.users so that
-- anyone who signed up more than 30 days ago falls outside every send window
-- and is never entered into the sequence retroactively.
insert into profiles (id, email, full_name, created_at)
select id, email, raw_user_meta_data->>'full_name', created_at
from auth.users
where email is not null
on conflict (id) do nothing;

-- Send ledger. The primary key is what makes a double-send physically
-- impossible: the cron inserts here BEFORE calling Resend, and a duplicate
-- insert raises 23505, which the cron treats as "already sent, skip".
create table if not exists email_sends (
  user_id uuid references auth.users on delete cascade,
  email_key text not null,
  sent_at timestamptz not null default now(),
  primary key (user_id, email_key)
);

alter table email_sends enable row level security;
