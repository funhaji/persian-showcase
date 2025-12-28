import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Product, Category, Slider, SiteSettings } from "@/types/database";

interface SiteContextType {
  products: Product[];
  categories: Category[];
  sliders: Slider[];
  settings: SiteSettings | null;
  isLoading: boolean;
  error: string | null;
  purchaseEnabled: boolean;
  refetch: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  id: 'default',
  site_name: '',
  site_description: '',
  phone_numbers: [],
  support_hours: '',
  purchase_enabled: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      setError('Supabase not configured');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [productsRes, categoriesRes, slidersRes, settingsRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('order_index', { ascending: true }),
        supabase.from('sliders').select('*').eq('is_active', true).order('order_index', { ascending: true }),
        supabase.from('site_settings').select('*').limit(1).maybeSingle(),
      ]);

      if (productsRes.error) throw productsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (slidersRes.error) throw slidersRes.error;
      if (settingsRes.error) throw settingsRes.error;

      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
      setSliders(slidersRes.data || []);
      setSettings(settingsRes.data || defaultSettings);
    } catch (err) {
      console.error('Error fetching site data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const purchaseEnabled = settings?.purchase_enabled ?? false;

  return (
    <SiteContext.Provider
      value={{
        products,
        categories,
        sliders,
        settings,
        isLoading,
        error,
        purchaseEnabled,
        refetch: fetchData,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error("useSite must be used within a SiteProvider");
  }
  return context;
};
