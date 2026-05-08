-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 店舗
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- キャスト
CREATE TABLE casts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  number TEXT,
  photo_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- お客様
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 来店記録
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  table_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 伝票
CREATE TABLE bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  bill_number TEXT,
  total_amount INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'paid')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
);

-- 伝票明細
CREATE TABLE bill_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 伝票とキャストの紐付け
CREATE TABLE bill_casts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
  cast_id UUID REFERENCES casts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bill_id, cast_id)
);

-- インデックス
CREATE INDEX idx_visits_venue_id ON visits(venue_id);
CREATE INDEX idx_visits_customer_id ON visits(customer_id);
CREATE INDEX idx_visits_visit_date ON visits(visit_date);
CREATE INDEX idx_bills_visit_id ON bills(visit_id);
CREATE INDEX idx_bills_venue_id ON bills(venue_id);
CREATE INDEX idx_bills_status ON bills(status);
CREATE INDEX idx_bill_items_bill_id ON bill_items(bill_id);
CREATE INDEX idx_bill_casts_bill_id ON bill_casts(bill_id);
CREATE INDEX idx_bill_casts_cast_id ON bill_casts(cast_id);

-- 売上サマリービュー
CREATE VIEW cast_sales_summary AS
SELECT
  c.id as cast_id,
  c.name as cast_name,
  c.venue_id,
  COUNT(DISTINCT bc.bill_id) as bill_count,
  SUM(b.total_amount) as total_sales,
  DATE_TRUNC('month', b.created_at) as month
FROM casts c
LEFT JOIN bill_casts bc ON bc.cast_id = c.id
LEFT JOIN bills b ON b.id = bc.bill_id AND b.status IN ('closed', 'paid')
GROUP BY c.id, c.name, c.venue_id, DATE_TRUNC('month', b.created_at);
