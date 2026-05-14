-- Run this in the Supabase SQL editor

ALTER TABLE user_word_progress
  ADD COLUMN IF NOT EXISTS interval integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS ease_factor float NOT NULL DEFAULT 2.5,
  ADD COLUMN IF NOT EXISTS repetitions integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS next_review timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS tts_enabled boolean NOT NULL DEFAULT true;

-- Fix status check constraint to allow all SRS ratings
ALTER TABLE user_word_progress DROP CONSTRAINT IF EXISTS user_word_progress_status_check;
ALTER TABLE user_word_progress ADD CONSTRAINT user_word_progress_status_check
  CHECK (status IN ('again', 'hard', 'good', 'easy'));
