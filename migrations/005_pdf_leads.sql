-- Email leads captured by the free PDF download (lead magnet)

create table if not exists pdf_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  created_at timestamptz not null default now()
);

-- One row per email; re-submitting refreshes source/created_at via upsert.
create unique index if not exists pdf_leads_email_idx on pdf_leads (lower(email));

-- RLS on, no public policies: only the service-role client (API route) writes.
alter table pdf_leads enable row level security;
