import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
}

export interface VariantImage {
  id: string;
  variant_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  hex: string;
  sort_order: number;
  variant_images: VariantImage[];
}

export interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  tag: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_variants: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  count: string;
  image: string;
  alt: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string | null;
  rating: number;
  text: string;
  avatar_url: string | null;
  product_ref: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Order {
  id: string;
  product_name: string | null;
  color_name: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  status: 'new' | 'contacted' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
}
