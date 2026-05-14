create table if not exists study_activity (
  user_id uuid references auth.users on delete cascade,
  date date not null,
  cards_reviewed integer not null default 0,
  primary key (user_id, date)
);

alter table study_activity enable row level security;

create policy "own rows" on study_activity
  for all using (auth.uid() = user_id);

-- If the table already exists without cards_reviewed, add the column:
alter table study_activity add column if not exists cards_reviewed integer not null default 0;
