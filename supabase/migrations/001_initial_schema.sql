-- BTC Tracker - Initial Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- Table: purchases (บันทึกการซื้อ BTC)
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  btc_amount NUMERIC(18, 8) NOT NULL,
  price_per_btc NUMERIC(18, 2) NOT NULL,
  total_cost NUMERIC(18, 2) NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: carried_forward (ยอดยกมาเริ่มต้น — มีได้ 1 row)
CREATE TABLE IF NOT EXISTS carried_forward (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  btc_amount NUMERIC(18, 8) NOT NULL,
  average_cost NUMERIC(18, 2) NOT NULL,
  total_cost NUMERIC(18, 2) NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index: เร่งการ query purchases ตามวันที่
CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases (date DESC);

-- Enable Row Level Security (disabled for now — single user)
-- Uncomment these when adding auth:
-- ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE carried_forward ENABLE ROW LEVEL SECURITY;
