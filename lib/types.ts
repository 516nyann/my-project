export type Venue = {
  id: string
  name: string
  address?: string
  phone?: string
  created_at: string
}

export type Cast = {
  id: string
  venue_id: string
  name: string
  number?: string
  photo_url?: string
  active: boolean
  created_at: string
}

export type Customer = {
  id: string
  venue_id: string
  name: string
  phone?: string
  notes?: string
  visit_count?: number
  total_spent?: number
  created_at: string
}

export type Visit = {
  id: string
  venue_id: string
  customer_id: string
  visit_date: string
  table_number?: string
  notes?: string
  created_at: string
  customer?: Customer
  bills?: Bill[]
}

export type Bill = {
  id: string
  visit_id: string
  venue_id: string
  bill_number?: string
  total_amount: number
  status: 'open' | 'closed' | 'paid'
  notes?: string
  created_at: string
  closed_at?: string
  paid_at?: string
  items?: BillItem[]
  casts?: Cast[]
  visit?: Visit & { customer?: Customer }
}

export type BillItem = {
  id: string
  bill_id: string
  name: string
  quantity: number
  unit_price: number
  amount: number
  created_at: string
}

export type BillCast = {
  id: string
  bill_id: string
  cast_id: string
  cast?: Cast
}

export type DailySummary = {
  date: string
  total_amount: number
  bill_count: number
  customer_count: number
}
