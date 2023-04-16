CREATE TABLE user_boxes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  box_id uuid NOT NULL REFERENCES boxes (id),
  name text NOT NULL UNIQUE,
  letter text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);


ALTER TABLE user_boxes
DROP COLUMN name;

ALTER TABLE user_boxes
ADD COLUMN name text NOT NULL,
ADD CONSTRAINT box_id_name UNIQUE (box_id, name);


ALTER TABLE user_boxes
DROP COLUMN letter;

ALTER TABLE user_boxes
ADD COLUMN letter text;
