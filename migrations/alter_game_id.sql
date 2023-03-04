ALTER TABLE boxes
DROP COLUMN game_id;

ALTER TABLE boxes
ADD COLUMN game_id text NOT NULL REFERENCES games (slug);
