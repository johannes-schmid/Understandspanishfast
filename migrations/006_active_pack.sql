-- Active vocabulary pack: which pack drives the dashboard + study queue.

alter table user_settings add column if not exists active_pack_id uuid;
-- null  = the built-in "1500 most common words" corpus pack (default)
-- uuid  = that row in vocab_packs is the active pack
-- No FK: the resolver treats a missing/deleted id as the default pack, and the
-- pack DELETE route clears this column when the active pack is removed.

-- Allow 'topic' packs (the merged "describe a scenario" builder, replacing /seed).
alter table vocab_packs drop constraint if exists vocab_packs_source_type_check;
alter table vocab_packs add constraint vocab_packs_source_type_check
  check (source_type in ('url','pdf','srt','topic'));
