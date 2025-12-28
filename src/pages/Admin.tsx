import { useState, useEffect } from "react";
import { 
  Plus, Pencil, Trash2, Package, Lock, LogOut, 
  Settings, Image, Layers, LayoutGrid, Save, 
  ToggleLeft, ToggleRight, Upload, X, RefreshCw, FileText, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SEO from "@/components/SEO";
import { toast } from "sonner";
import { supabase, isSupabaseConfigured, uploadImage } from "@/lib/supabase";
import type { Product, Category, Slider, SiteSettings } from "@/types/database";
import { formatPrice } from "@/components/shop/ProductCard";

const defaultSettings: SiteSettings = {
  id: '',
  site_name: 'خانومی',
  site_description: 'فروشگاه آنلاین لوازم آرایشی و بهداشتی',
  logo_url: null,
  favicon_url: null,
  phone_numbers: ['021-91200500'],
  address: 'تهران، ایران',
  support_hours: 'هفت روز هفته، از ساعت ۸ الی ۲۴',
  instagram_url: 'https://instagram.com',
  telegram_url: 'https://t.me',
  linkedin_url: null,
  about_us: '',
  purchase_enabled: false,
  enamad_code: null,
  samandehi_code: null,
  ecunion_code: null,
  created_at: '',
  updated_at: '',
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASS;

  if (!ADMIN_PASSWORD) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <SEO title="خطای پیکربندی" />
        <Card className="w-full max-w-md">
          <CardHeader className="text-center text-destructive">
            <CardTitle className="text-xl">خطای امنیتی</CardTitle>
            <CardDescription>
              رمز عبور مدیر (ADMIN_PASS) تنظیم نشده است. لطفا در پنل تنظیمات ورسل آن را اضافه کنید.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  // Articles & FAQs
  const [articles, setArticles] = useState<Array<{id: string; title: string; slug?: string | null; content: string; excerpt?: string | null;}>>([]);
  const [faqs, setFaqs] = useState<Array<{id: string; question: string; answer: string; order_index: number; is_active: boolean;}>>([]);
  
  // Dialog states
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [sliderDialogOpen, setSliderDialogOpen] = useState(false);
  const [articleDialogOpen, setArticleDialogOpen] = useState(false);
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [editingFaq, setEditingFaq] = useState<any | null>(null);
  
  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    original_price: 0,
    image: '',
    category_id: '',
    rating: 4.5,
    reviews: 0,
    in_stock: true,
    featured: false,
  });
  
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    order_index: 0,
  });
  
  const [sliderForm, setSliderForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    button_text: '',
    is_active: true,
    order_index: 0,
  });

  const [articleForm, setArticleForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    published: true,
  });

  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    order_index: 0,
    is_active: true,
  });

  const [savingSettings, setSavingSettings] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'slider' | 'settings_logo' | 'settings_favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      if (type === 'product') {
        setProductForm({ ...productForm, image: url });
      } else if (type === 'slider') {
        setSliderForm({ ...sliderForm, image: url });
      } else if (type === 'settings_logo') {
        setSettings({ ...settings, logo_url: url });
      } else if (type === 'settings_favicon') {
        setSettings({ ...settings, favicon_url: url });
      }
      toast.success("تصویر با موفقیت بارگذاری شد");
    } catch (error: any) {
      toast.error("خطا در بارگذاری تصویر: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Fetch data
  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && isSupabaseConfigured()) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, slidersRes, settingsRes, articlesRes, faqsRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('order_index'),
        supabase.from('sliders').select('*').order('order_index'),
        supabase.from('site_settings').select('*').limit(1).maybeSingle(),
        supabase.from('articles').select('*').order('created_at', { ascending: false }),
        supabase.from('faqs').select('*').order('order_index'),
      ]);
      
      if (productsRes.data) setProducts(productsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (slidersRes.data) setSliders(slidersRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
      if (articlesRes.data) setArticles(articlesRes.data);
      if (faqsRes.data) setFaqs(faqsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      await fetchData();
      toast.success("داده‌ها بروزرسانی شد");
    } catch (error: any) {
      toast.error("خطا در بروزرسانی: " + (error?.message || error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_authenticated', 'true');
        toast.success("ورود موفق", { description: "به پنل مدیریت خوش آمدید" });
      } else {
        toast.error("رمز عبور اشتباه است");
      }
      setIsLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setPassword("");
    toast.info("از پنل مدیریت خارج شدید");
  };

  // Product CRUD
  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.category_id) {
      toast.error("لطفا فیلدهای ضروری را پر کنید");
      return;
    }
    
    setIsLoading(true);
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update({
            ...productForm,
            original_price: productForm.original_price || null,
          })
          .eq('id', editingProduct.id);
        if (error) throw error;
        toast.success("محصول با موفقیت ویرایش شد");
      } else {
        const { error } = await supabase
          .from('products')
          .insert([{
            ...productForm,
            original_price: productForm.original_price || null,
          }]);
        if (error) throw error;
        toast.success("محصول با موفقیت اضافه شد");
      }
      setProductDialogOpen(false);
      resetProductForm();
      fetchData();
    } catch (error: any) {
      toast.error("خطا: " + error.message);
    }
    setIsLoading(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("آیا از حذف این محصول مطمئن هستید؟")) return;
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success("محصول حذف شد");
      fetchData();
    } catch (error: any) {
      toast.error("خطا: " + error.message);
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: 0,
      original_price: 0,
      image: '',
      category_id: '',
      rating: 4.5,
      reviews: 0,
      in_stock: true,
      featured: false,
    });
    setEditingProduct(null);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      original_price: product.original_price || 0,
      image: product.image,
      category_id: product.category_id,
      rating: product.rating,
      reviews: product.reviews,
      in_stock: product.in_stock,
      featured: product.featured,
    });
    setProductDialogOpen(true);
  };

  // Category CRUD
  const handleSaveCategory = async () => {
    if (!categoryForm.name || !categoryForm.slug) {
      toast.error("لطفا فیلدهای ضروری را پر کنید");
      return;
    }
    
    setIsLoading(true);
    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryForm)
          .eq('id', editingCategory.id);
        if (error) throw error;
        toast.success("دسته‌بندی با موفقیت ویرایش شد");
      } else {
        const { error } = await supabase.from('categories').insert([categoryForm]);
        if (error) throw error;
        toast.success("دسته‌بندی با موفقیت اضافه شد");
      }
      setCategoryDialogOpen(false);
      resetCategoryForm();
      fetchData();
    } catch (error: any) {
      toast.error("خطا: " + error.message);
    }
    setIsLoading(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("آیا از حذف این دسته‌بندی مطمئن هستید؟")) return;
    
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      toast.success("دسته‌بندی حذف شد");
      fetchData();
    } catch (error: any) {
      toast.error("خطا: " + error.message);
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: '', slug: '', order_index: 0 });
    setEditingCategory(null);
  };

  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      order_index: category.order_index,
    });
    setCategoryDialogOpen(true);
  };

  // Slider CRUD
  const handleSaveSlider = async () => {
    if (!sliderForm.title || !sliderForm.image) {
      toast.error("لطفا فیلدهای ضروری را پر کنید");
      return;
    }
    
    setIsLoading(true);
    try {
      if (editingSlider) {
        const { error } = await supabase
          .from('sliders')
          .update({
            ...sliderForm,
            subtitle: sliderForm.subtitle || null,
            link: sliderForm.link || null,
            button_text: sliderForm.button_text || null,
          })
          .eq('id', editingSlider.id);
        if (error) throw error;
        toast.success("اسلایدر با موفقیت ویرایش شد");
      } else {
        const { error } = await supabase.from('sliders').insert([{
          ...sliderForm,
          subtitle: sliderForm.subtitle || null,
          link: sliderForm.link || null,
          button_text: sliderForm.button_text || null,
        }]);
        if (error) throw error;
        toast.success("اسلایدر با موفقیت اضافه شد");
      }
      setSliderDialogOpen(false);
      resetSliderForm();
      fetchData();
    } catch (error: any) {
      toast.error("خطا: " + error.message);
    }
    setIsLoading(false);
  };

  const handleDeleteSlider = async (id: string) => {
    if (!confirm("آیا از حذف این اسلایدر مطمئن هستید؟")) return;
    
    try {
      const { error } = await supabase.from('sliders').delete().eq('id', id);
      if (error) throw error;
      toast.success("اسلایدر حذف شد");
      fetchData();
    } catch (error: any) {
      toast.error("خطا: " + error.message);
    }
  };

  const resetSliderForm = () => {
    setSliderForm({
      title: '',
      subtitle: '',
      image: '',
      link: '',
      button_text: '',
      is_active: true,
      order_index: 0,
    });
    setEditingSlider(null);
  };

  const openEditSlider = (slider: Slider) => {
    setEditingSlider(slider);
    setSliderForm({
      title: slider.title,
      subtitle: slider.subtitle || '',
      image: slider.image,
      link: slider.link || '',
      button_text: slider.button_text || '',
      is_active: slider.is_active,
      order_index: slider.order_index,
    });
    setSliderDialogOpen(true);
  };

  // Articles CRUD
  const resetArticleForm = () => {
    setArticleForm({ title: '', slug: '', content: '', excerpt: '', published: true });
    setEditingArticle(null);
  };

  const openEditArticle = (article: any) => {
    setEditingArticle(article);
    setArticleForm({
      title: article.title,
      slug: article.slug || '',
      content: article.content || '',
      excerpt: article.excerpt || '',
      published: article.published ?? true,
    });
    setArticleDialogOpen(true);
  };

  const handleSaveArticle = async () => {
    if (!articleForm.title || !articleForm.content) {
      toast.error("لطفا عنوان و محتوا را وارد کنید");
      return;
    }
    setIsLoading(true);
    try {
      if (editingArticle) {
        const { error } = await supabase.from('articles').update({
          ...articleForm,
        }).eq('id', editingArticle.id);
        if (error) throw error;
        toast.success("مقاله با موفقیت ویرایش شد");
      } else {
        const { error } = await supabase.from('articles').insert([articleForm]);
        if (error) throw error;
        toast.success("مقاله با موفقیت اضافه شد");
      }
      setArticleDialogOpen(false);
      resetArticleForm();
      fetchData();
    } catch (error: any) {
      toast.error("خطا: " + error.message);
    }
    setIsLoading(false);
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("آیا از حذف این مقاله مطمئن هستید؟")) return;
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
      toast.success("مقاله حذف شد");
      fetchData();
    } catch (error: any) {
      toast.error("خطا: " + error.message);
    }
  };

  // FAQ CRUD
  const resetFaqForm = () => {
    setFaqForm({ question: '', answer: '', order_index: 0, is_active: true });
    setEditingFaq(null);
  };

  const openEditFaq = (faq: any) => {
    setEditingFaq(faq);
    setFaqForm({ question: faq.question, answer: faq.answer, order_index: faq.order_index, is_active: faq.is_active });
    setFaqDialogOpen(true);
  };

  const handleSaveFaq = async () => {
    if (!faqForm.question || !faqForm.answer) {
      toast.error("لطفا سوال و پاسخ را وارد کنید");
      return;
    }
    setIsLoading(true);
    try {
      if (editingFaq) {
        const { error } = await supabase.from('faqs').update({ ...faqForm }).eq('id', editingFaq.id);
        if (error) throw error;
        toast.success("FAQ با موفقیت ویرایش شد");
      } else {
        const { error } = await supabase.from('faqs').insert([faqForm]);
        if (error) throw error;
        toast.success("FAQ با موفقیت اضافه شد");
      }
      setFaqDialogOpen(false);
      resetFaqForm();
      fetchData();
    } catch (error: any) {
      toast.error("خطا: " + error.message);
    }
    setIsLoading(false);
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("آیا از حذف این آیتم FAQ مطمئن هستید؟")) return;
    try {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) throw error;
      toast.success("FAQ حذف شد");
      fetchData();
    } catch (error: any) {
      toast.error("خطا: " + error.message);
    }
  };

  // Settings
  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      if (settings.id) {
        const { error } = await supabase
          .from('site_settings')
          .update({
            site_name: settings.site_name,
            site_description: settings.site_description,
            logo_url: settings.logo_url,
            favicon_url: settings.favicon_url,
            phone_numbers: settings.phone_numbers,
            address: settings.address,
            support_hours: settings.support_hours,
            instagram_url: settings.instagram_url,
            telegram_url: settings.telegram_url,
            linkedin_url: settings.linkedin_url,
            about_us: settings.about_us,
            contact_us: settings.contact_us,
            faq: settings.faq,
            shipping_policy: settings.shipping_policy,
            return_policy: settings.return_policy,
            privacy_policy: settings.privacy_policy,
            terms_conditions: settings.terms_conditions,
            purchase_enabled: settings.purchase_enabled,
            enamad_code: settings.enamad_code,
            samandehi_code: settings.samandehi_code,
            ecunion_code: settings.ecunion_code,
          })
          .eq('id', settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_settings').insert([{
          site_name: settings.site_name,
          site_description: settings.site_description,
          logo_url: settings.logo_url,
          favicon_url: settings.favicon_url,
          phone_numbers: settings.phone_numbers,
          address: settings.address,
          support_hours: settings.support_hours,
          instagram_url: settings.instagram_url,
          telegram_url: settings.telegram_url,
          linkedin_url: settings.linkedin_url,
          about_us: settings.about_us,
          contact_us: settings.contact_us,
          faq: settings.faq,
          shipping_policy: settings.shipping_policy,
          return_policy: settings.return_policy,
          privacy_policy: settings.privacy_policy,
          terms_conditions: settings.terms_conditions,
          purchase_enabled: settings.purchase_enabled,
          enamad_code: settings.enamad_code,
          samandehi_code: settings.samandehi_code,
          ecunion_code: settings.ecunion_code,
        }]);
        if (error) throw error;
      }
      toast.success("تنظیمات با موفقیت ذخیره شد");
      fetchData();
    } catch (error: any) {
      toast.error("خطا: " + error.message);
    }
    setSavingSettings(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <SEO title="ورود به پنل مدیریت" />
        
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">پنل مدیریت</CardTitle>
            <CardDescription>
              برای دسترسی به پنل مدیریت رمز عبور را وارد کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">رمز عبور</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="رمز عبور را وارد کنید"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-center"
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "در حال بررسی..." : "ورود"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <SEO title="پنل مدیریت" />
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-destructive">Supabase پیکربندی نشده</CardTitle>
            <CardDescription>
              لطفا متغیرهای محیطی Supabase را تنظیم کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY را در Vercel تنظیم کنید.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="پنل مدیریت" />
      
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
          <div className="container flex items-center justify-between h-16">
            <h1 className="text-xl font-bold">پنل مدیریت</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleRefresh} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                {isLoading ? 'در حال بروزرسانی...' : 'بروزرسانی'}
              </Button>
              <Button variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                خروج
              </Button>
            </div>
          </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">محصولات <span className="ml-2 text-sm text-muted-foreground">({products.length})</span></span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">دسته‌بندی‌ها <span className="ml-2 text-sm text-muted-foreground">({categories.length})</span></span>
            </TabsTrigger>
            <TabsTrigger value="sliders" className="gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">اسلایدرها <span className="ml-2 text-sm text-muted-foreground">({sliders.length})</span></span>
            </TabsTrigger>
            <TabsTrigger value="articles" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">مقالات <span className="ml-2 text-sm text-muted-foreground">({articles.length})</span></span>
            </TabsTrigger>
            <TabsTrigger value="faqs" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">پرسش‌ها <span className="ml-2 text-sm text-muted-foreground">({faqs.length})</span></span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">تنظیمات</span>
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">محصولات</h2>
                <p className="text-muted-foreground">{products.length} محصول</p>
              </div>
              <Dialog open={productDialogOpen} onOpenChange={(open) => {
                setProductDialogOpen(open);
                if (!open) resetProductForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    افزودن محصول
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? 'ویرایش محصول' : 'افزودن محصول جدید'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>نام محصول *</Label>
                        <Input 
                          value={productForm.name} 
                          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>دسته‌بندی *</Label>
                        <Select 
                          value={productForm.category_id} 
                          onValueChange={(v) => setProductForm({...productForm, category_id: v})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="انتخاب دسته‌بندی" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>توضیحات</Label>
                      <Textarea 
                        value={productForm.description} 
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>قیمت (تومان)</Label>
                        <Input 
                          type="number" 
                          value={productForm.price} 
                          onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>قیمت اصلی (قبل از تخفیف)</Label>
                        <Input 
                          type="number" 
                          value={productForm.original_price} 
                          onChange={(e) => setProductForm({...productForm, original_price: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>لینک تصویر</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={productForm.image} 
                          onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                          placeholder="https://..."
                          className="flex-1"
                        />
                        <div className="relative">
                          <Button variant="outline" type="button" disabled={isUploading} className="gap-2">
                            <Upload className="h-4 w-4" />
                            {isUploading ? "..." : "آپلود"}
                          </Button>
                          <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'product')}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>امتیاز (۱-۵)</Label>
                        <Input 
                          type="number" 
                          min="1" 
                          max="5" 
                          step="0.1"
                          value={productForm.rating} 
                          onChange={(e) => setProductForm({...productForm, rating: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>تعداد نظرات</Label>
                        <Input 
                          type="number" 
                          value={productForm.reviews} 
                          onChange={(e) => setProductForm({...productForm, reviews: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Switch 
                          checked={productForm.in_stock} 
                          onCheckedChange={(v) => setProductForm({...productForm, in_stock: v})} 
                        />
                        <Label>موجود در انبار</Label>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Switch 
                          checked={productForm.featured} 
                          onCheckedChange={(v) => setProductForm({...productForm, featured: v})} 
                        />
                        <Label>محصول ویژه (نمایش در صفحه اصلی)</Label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setProductDialogOpen(false)}>انصراف</Button>
                    <Button onClick={handleSaveProduct} disabled={isLoading}>
                      {isLoading ? "در حال ذخیره..." : "ذخیره محصول"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-md border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">تصویر</TableHead>
                    <TableHead>نام محصول</TableHead>
                    <TableHead>دسته‌بندی</TableHead>
                    <TableHead>قیمت</TableHead>
                    <TableHead>وضعیت</TableHead>
                    <TableHead className="text-left">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        هیچ محصولی یافت نشد
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-10 h-10 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {product.name}
                          {product.featured && (
                            <span className="mr-2 px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded">ویژه</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {categories.find(c => c.id === product.category_id)?.name || 'بدون دسته'}
                        </TableCell>
                        <TableCell>{formatPrice(product.price)}</TableCell>
                        <TableCell>
                          {product.in_stock ? (
                            <span className="text-green-600 flex items-center gap-1 text-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                              موجود
                            </span>
                          ) : (
                            <span className="text-destructive flex items-center gap-1 text-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>
                              ناموجود
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-left">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => openEditProduct(product)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">دسته‌بندی‌ها</h2>
                <p className="text-muted-foreground">{categories.length} دسته‌بندی</p>
              </div>
              <Dialog open={categoryDialogOpen} onOpenChange={(open) => {
                setCategoryDialogOpen(open);
                if (!open) resetCategoryForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    افزودن دسته‌بندی
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCategory ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>نام دسته‌بندی *</Label>
                      <Input 
                        value={categoryForm.name} 
                        onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>نامک (Slug) *</Label>
                      <Input 
                        value={categoryForm.slug} 
                        onChange={(e) => setCategoryForm({...categoryForm, slug: e.target.value})}
                        placeholder="category-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ترتیب نمایش</Label>
                      <Input 
                        type="number" 
                        value={categoryForm.order_index} 
                        onChange={(e) => setCategoryForm({...categoryForm, order_index: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>انصراف</Button>
                    <Button onClick={handleSaveCategory} disabled={isLoading}>
                      {isLoading ? "در حال ذخیره..." : "ذخیره دسته‌بندی"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-md border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ترتیب</TableHead>
                    <TableHead>نام دسته‌بندی</TableHead>
                    <TableHead>نامک (Slug)</TableHead>
                    <TableHead className="text-left">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                        هیچ دسته‌بندی یافت نشد
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((cat) => (
                      <TableRow key={cat.id}>
                        <TableCell>{cat.order_index}</TableCell>
                        <TableCell className="font-medium">{cat.name}</TableCell>
                        <TableCell>{cat.slug}</TableCell>
                        <TableCell className="text-left">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => openEditCategory(cat)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteCategory(cat.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Sliders Tab */}
          <TabsContent value="sliders" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">اسلایدرها</h2>
                <p className="text-muted-foreground">{sliders.length} اسلاید</p>
              </div>
              <Dialog open={sliderDialogOpen} onOpenChange={(open) => {
                setSliderDialogOpen(open);
                if (!open) resetSliderForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    افزودن اسلاید
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingSlider ? 'ویرایش اسلایدر' : 'افزودن اسلایدر جدید'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>عنوان اسلاید *</Label>
                      <Input 
                        value={sliderForm.title} 
                        onChange={(e) => setSliderForm({...sliderForm, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>متن زیر عنوان</Label>
                      <Input 
                        value={sliderForm.subtitle} 
                        onChange={(e) => setSliderForm({...sliderForm, subtitle: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>لینک تصویر *</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={sliderForm.image} 
                          onChange={(e) => setSliderForm({...sliderForm, image: e.target.value})}
                          placeholder="https://..."
                          className="flex-1"
                        />
                        <div className="relative">
                          <Button variant="outline" type="button" disabled={isUploading} className="gap-2">
                            <Upload className="h-4 w-4" />
                            {isUploading ? "..." : "آپلود"}
                          </Button>
                          <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'slider')}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>متن دکمه</Label>
                        <Input 
                          value={sliderForm.button_text} 
                          onChange={(e) => setSliderForm({...sliderForm, button_text: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>لینک (URL)</Label>
                        <Input 
                          value={sliderForm.link} 
                          onChange={(e) => setSliderForm({...sliderForm, link: e.target.value})}
                          placeholder="/products/lipstick"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>ترتیب نمایش</Label>
                        <Input 
                          type="number" 
                          value={sliderForm.order_index} 
                          onChange={(e) => setSliderForm({...sliderForm, order_index: Number(e.target.value)})}
                        />
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse pt-8">
                        <Switch 
                          checked={sliderForm.is_active} 
                          onCheckedChange={(v) => setSliderForm({...sliderForm, is_active: v})} 
                        />
                        <Label>فعال</Label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSliderDialogOpen(false)}>انصراف</Button>
                    <Button onClick={handleSaveSlider} disabled={isLoading}>
                      {isLoading ? "در حال ذخیره..." : "ذخیره اسلایدر"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sliders.length === 0 ? (
                <div className="col-span-full text-center py-10 text-muted-foreground border rounded-md">
                  هیچ اسلایدی یافت نشد
                </div>
              ) : (
                sliders.map((slider) => (
                  <Card key={slider.id} className={!slider.is_active ? 'opacity-60' : ''}>
                    <div className="relative aspect-[21/9] overflow-hidden rounded-t-lg bg-muted">
                      <img 
                        src={slider.image} 
                        alt={slider.title} 
                        className="w-full h-full object-cover"
                      />
                      {!slider.is_active && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                          <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-sm font-bold">غیرفعال</span>
                        </div>
                      )}
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{slider.title}</CardTitle>
                      <CardDescription>{slider.subtitle}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">ترتیب: {slider.order_index}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditSlider(slider)}>
                          <Pencil className="h-4 w-4 mr-1" />
                          ویرایش
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDeleteSlider(slider.id)}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          حذف
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">مقالات</h2>
                <p className="text-muted-foreground">{articles.length} مقاله</p>
              </div>
              <Dialog open={articleDialogOpen} onOpenChange={(open) => {
                setArticleDialogOpen(open);
                if (!open) resetArticleForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    افزودن مقاله
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingArticle ? 'ویرایش مقاله' : 'افزودن مقاله جدید'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>عنوان *</Label>
                      <Input value={articleForm.title} onChange={(e) => setArticleForm({...articleForm, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>نامک (slug)</Label>
                      <Input value={articleForm.slug} onChange={(e) => setArticleForm({...articleForm, slug: e.target.value})} placeholder="article-slug" />
                    </div>
                    <div className="space-y-2">
                      <Label>خلاصه (اختیاری)</Label>
                      <Input value={articleForm.excerpt} onChange={(e) => setArticleForm({...articleForm, excerpt: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>محتوا *</Label>
                      <Textarea value={articleForm.content} onChange={(e) => setArticleForm({...articleForm, content: e.target.value})} rows={8} />
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Switch checked={articleForm.published} onCheckedChange={(v) => setArticleForm({...articleForm, published: v})} />
                      <Label>منتشر شده</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setArticleDialogOpen(false)}>انصراف</Button>
                    <Button onClick={handleSaveArticle} disabled={isLoading}>{isLoading ? 'در حال ذخیره...' : 'ذخیره مقاله'}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-md border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>عنوان</TableHead>
                    <TableHead>نامک</TableHead>
                    <TableHead>وضعیت</TableHead>
                    <TableHead className="text-left">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">هیچ مقاله‌ای یافت نشد</TableCell>
                    </TableRow>
                  ) : (
                    articles.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.title}</TableCell>
                        <TableCell>{a.slug || a.id}</TableCell>
                        <TableCell>{/* show published */}{a.published ? <span className="text-green-600">منتشر شده</span> : <span className="text-muted-foreground">پیش‌نویس</span>}</TableCell>
                        <TableCell className="text-left">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditArticle(a)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteArticle(a.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">پرسش‌ها (FAQ)</h2>
                <p className="text-muted-foreground">{faqs.length} آیتم</p>
              </div>
              <Dialog open={faqDialogOpen} onOpenChange={(open) => { setFaqDialogOpen(open); if (!open) resetFaqForm(); }}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    افزودن FAQ
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingFaq ? 'ویرایش FAQ' : 'افزودن FAQ جدید'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>سوال *</Label>
                      <Input value={faqForm.question} onChange={(e) => setFaqForm({...faqForm, question: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>پاسخ *</Label>
                      <Textarea value={faqForm.answer} onChange={(e) => setFaqForm({...faqForm, answer: e.target.value})} rows={5} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>ترتیب نمایش</Label>
                        <Input type="number" value={faqForm.order_index} onChange={(e) => setFaqForm({...faqForm, order_index: Number(e.target.value)})} />
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse pt-8">
                        <Switch checked={faqForm.is_active} onCheckedChange={(v) => setFaqForm({...faqForm, is_active: v})} />
                        <Label>فعال</Label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setFaqDialogOpen(false)}>انصراف</Button>
                    <Button onClick={handleSaveFaq} disabled={isLoading}>{isLoading ? 'در حال ذخیره...' : 'ذخیره FAQ'}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-md border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>سوال</TableHead>
                    <TableHead>ترتیب</TableHead>
                    <TableHead>وضعیت</TableHead>
                    <TableHead className="text-left">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faqs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">هیچ FAQ‌ای یافت نشد</TableCell>
                    </TableRow>
                  ) : (
                    faqs.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell className="font-medium">{f.question}</TableCell>
                        <TableCell>{f.order_index}</TableCell>
                        <TableCell>{f.is_active ? <span className="text-green-600">فعال</span> : <span className="text-muted-foreground">غیرفعال</span>}</TableCell>
                        <TableCell className="text-left">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditFaq(f)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteFaq(f.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Settings */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>تنظیمات عمومی وب‌سایت</CardTitle>
                    <CardDescription>نام و توضیحات کلی وب‌سایت خود را تنظیم کنید</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>نام فروشگاه</Label>
                      <Input 
                        value={settings.site_name} 
                        onChange={(e) => setSettings({...settings, site_name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>توضیحات کوتاه سئو</Label>
                      <Textarea 
                        value={settings.site_description || ''} 
                        onChange={(e) => setSettings({...settings, site_description: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>لینک لوگو</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={settings.logo_url || ''} 
                            onChange={(e) => setSettings({...settings, logo_url: e.target.value})}
                            placeholder="https://..."
                            className="flex-1"
                          />
                          <div className="relative">
                            <Button variant="outline" size="sm" type="button" disabled={isUploading}>
                              <Upload className="h-4 w-4" />
                            </Button>
                            <input 
                              type="file" 
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'settings_logo')}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>لینک فاوآیکون</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={settings.favicon_url || ''} 
                            onChange={(e) => setSettings({...settings, favicon_url: e.target.value})}
                            placeholder="https://..."
                            className="flex-1"
                          />
                          <div className="relative">
                            <Button variant="outline" size="sm" type="button" disabled={isUploading}>
                              <Upload className="h-4 w-4" />
                            </Button>
                            <input 
                              type="file" 
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'settings_favicon')}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>درباره ما و اطلاعات تماس</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>متن درباره ما</Label>
                      <Textarea 
                        value={settings.about_us || ''} 
                        onChange={(e) => setSettings({...settings, about_us: e.target.value})}
                        rows={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>تماس با ما</Label>
                      <Textarea 
                        value={settings.contact_us || ''} 
                        onChange={(e) => setSettings({...settings, contact_us: e.target.value})}
                        rows={5}
                        placeholder="اطلاعات تماس خود را اینجا وارد کنید..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>پرسش‌های متداول (FAQ)</Label>
                      <Textarea 
                        value={settings.faq || ''} 
                        onChange={(e) => setSettings({...settings, faq: e.target.value})}
                        rows={5}
                        placeholder="سوالات متداول را اینجا وارد کنید..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>رویه‌های ارسال</Label>
                      <Textarea 
                        value={settings.shipping_policy || ''} 
                        onChange={(e) => setSettings({...settings, shipping_policy: e.target.value})}
                        rows={5}
                        placeholder="رویه‌های ارسال را اینجا وارد کنید..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>شرایط مرجوعی</Label>
                      <Textarea 
                        value={settings.return_policy || ''} 
                        onChange={(e) => setSettings({...settings, return_policy: e.target.value})}
                        rows={5}
                        placeholder="شرایط مرجوعی را اینجا وارد کنید..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>حریم خصوصی</Label>
                      <Textarea 
                        value={settings.privacy_policy || ''} 
                        onChange={(e) => setSettings({...settings, privacy_policy: e.target.value})}
                        rows={5}
                        placeholder="سیاست حریم خصوصی را اینجا وارد کنید..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>قوانین و مقررات</Label>
                      <Textarea 
                        value={settings.terms_conditions || ''} 
                        onChange={(e) => setSettings({...settings, terms_conditions: e.target.value})}
                        rows={5}
                        placeholder="قوانین و مقررات سایت را اینجا وارد کنید..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>نشانی فروشگاه</Label>
                      <Input 
                        value={settings.address || ''} 
                        onChange={(e) => setSettings({...settings, address: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>ساعات پشتیبانی</Label>
                        <Input 
                          value={settings.support_hours || ''} 
                          onChange={(e) => setSettings({...settings, support_hours: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>شماره تماس (با کاما جدا کنید)</Label>
                        <Input 
                          value={settings.phone_numbers.join(', ')} 
                          onChange={(e) => setSettings({...settings, phone_numbers: e.target.value.split(',').map(s => s.trim())})}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>شبکه‌های اجتماعی</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>اینستاگرام</Label>
                      <Input 
                        value={settings.instagram_url || ''} 
                        onChange={(e) => setSettings({...settings, instagram_url: e.target.value})}
                        placeholder="https://instagram.com/username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>تلگرام</Label>
                      <Input 
                        value={settings.telegram_url || ''} 
                        onChange={(e) => setSettings({...settings, telegram_url: e.target.value})}
                        placeholder="https://t.me/username"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Side Panels */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      وضعیت خرید
                      {settings.purchase_enabled ? (
                        <ToggleRight className="text-green-600 h-6 w-6" />
                      ) : (
                        <ToggleLeft className="text-muted-foreground h-6 w-6" />
                      )}
                    </CardTitle>
                    <CardDescription>فعال یا غیرفعال کردن امکان افزودن به سبد خرید</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="purchase-toggle" className="flex flex-col">
                        <span>خرید آنلاین</span>
                        <span className="font-normal text-xs text-muted-foreground">
                          {settings.purchase_enabled ? 'فعال (کاربران می‌توانند خرید کنند)' : 'غیرفعال (کاتالوگ محصولات)'}
                        </span>
                      </Label>
                      <Switch 
                        id="purchase-toggle"
                        checked={settings.purchase_enabled} 
                        onCheckedChange={(v) => setSettings({...settings, purchase_enabled: v})} 
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>نمادهای اعتماد</CardTitle>
                    <CardDescription>کد دریافتی از مراجع ذی‌صلاح</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>کد اینماد</Label>
                      <Textarea 
                        value={settings.enamad_code || ''} 
                        onChange={(e) => setSettings({...settings, enamad_code: e.target.value})}
                        placeholder="کد HTML اینماد..."
                        className="font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>کد ساماندهی</Label>
                      <Textarea 
                        value={settings.samandehi_code || ''} 
                        onChange={(e) => setSettings({...settings, samandehi_code: e.target.value})}
                        placeholder="کد HTML ساماندهی..."
                        className="font-mono text-xs"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  className="w-full h-14 text-lg gap-2" 
                  size="lg"
                  disabled={savingSettings}
                  onClick={handleSaveSettings}
                >
                  <Save className="h-5 w-5" />
                  {savingSettings ? "در حال ذخیره..." : "ذخیره تمامی تغییرات"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
