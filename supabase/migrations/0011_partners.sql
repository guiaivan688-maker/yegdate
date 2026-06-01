-- Partners table — Edmonton vendor catalog (restaurants, photographers, florists, etc.)
-- Replaces JSON-based partner management with editable Supabase records.

CREATE TABLE IF NOT EXISTS partners (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category IN (
                    'restaurant','photographer','florist','decorator',
                    'transport','catering','musician','venue','other'
                  )),
  description     TEXT,
  contact_name    TEXT,
  contact_email   TEXT,
  contact_phone   TEXT,
  address         TEXT,
  neighbourhood   TEXT,
  website         TEXT,
  instagram       TEXT,
  price_tier      INT CHECK (price_tier BETWEEN 1 AND 4),
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','paused')),
  tags            TEXT[] DEFAULT '{}',
  notes           TEXT,
  image_url       TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS partners_category_idx ON partners(category) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS partners_neighbourhood_idx ON partners(neighbourhood) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS partners_status_idx ON partners(status);

-- Row-level security
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Admins: full access
DROP POLICY IF EXISTS "partners admin all" ON partners;
CREATE POLICY "partners admin all" ON partners
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Public: read active partners only
DROP POLICY IF EXISTS "partners public read active" ON partners;
CREATE POLICY "partners public read active" ON partners
  FOR SELECT
  USING (status = 'active');

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_partners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS partners_updated_at ON partners;
CREATE TRIGGER partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_partners_updated_at();
