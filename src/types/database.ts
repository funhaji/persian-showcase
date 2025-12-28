export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number | null;
  image: string;
  category_id: string;
  rating: number;
  reviews: number;
  in_stock: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order_index: number;
  created_at: string;
}

export interface Slider {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  link?: string | null;
  button_text?: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  site_description: string;
  logo_url?: string | null;
  favicon_url?: string | null;
  phone_numbers: string[];
  address?: string | null;
  support_hours: string;
  instagram_url?: string | null;
  telegram_url?: string | null;
  linkedin_url?: string | null;
  about_us?: string | null;
  contact_us?: string | null;
  faq?: string | null;
  shipping_policy?: string | null;
  return_policy?: string | null;
  privacy_policy?: string | null;
  terms_conditions?: string | null;
  article_content?: string | null;
  purchase_enabled: boolean;
  enamad_code?: string | null;
  samandehi_code?: string | null;
  ecunion_code?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at'>;
        Update: Partial<Omit<Category, 'id' | 'created_at'>>;
      };
      sliders: {
        Row: Slider;
        Insert: Omit<Slider, 'id' | 'created_at'>;
        Update: Partial<Omit<Slider, 'id' | 'created_at'>>;
      };
      site_settings: {
        Row: SiteSettings;
        Insert: Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
