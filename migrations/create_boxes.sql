CREATE TABLE boxes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id uuid NOT NULL REFERENCES games (id),
  letter text,
  x integer NOT NULl,
  y integer NOT NULl,
  isBlock boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);
