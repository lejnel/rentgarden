-- RentGarden Database Schema

CREATE TABLE IF NOT EXISTS prices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'DK',
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  price_total REAL NOT NULL,
  price_per_m2 REAL,
  sqm INTEGER,
  rooms INTEGER,
  type TEXT DEFAULT 'apartment',
  source_url TEXT NOT NULL,
  source_site TEXT,
  listing_date TEXT,
  submitter_email TEXT,
  currency TEXT DEFAULT 'DKK',
  submitted_at TEXT DEFAULT (datetime('now')),
  verified INTEGER DEFAULT 1,
  hidden INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_prices_city ON prices(city);
CREATE INDEX IF NOT EXISTS idx_prices_lat_lng ON prices(lat, lng);
CREATE INDEX IF NOT EXISTS idx_prices_country ON prices(country);
CREATE INDEX IF NOT EXISTS idx_prices_dates ON prices(listing_date, submitted_at);
CREATE INDEX IF NOT EXISTS idx_prices_visibility_dates ON prices(hidden, listing_date, submitted_at);
