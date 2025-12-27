import { useState, useEffect } from "react";
import { 
  Plus, Pencil, Trash2, Package, Lock, LogOut, 
  Settings, Image, Layers, LayoutGrid, Save, 
  ToggleLeft, ToggleRight, Upload, X
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
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Product, Category, Slider, SiteSettings } from "@/types/database";
import { formatPrice } from "@/components/shop/ProductCard";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASS || "admin1234";

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
  
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  
  // Dialog states
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [sliderDialogOpen, setSliderDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  
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

  const [savingSettings, setSavingSettings] = useState(false);

  // Fetch data
  useEffect(() => {
    if (isAuthenticated && isSupabaseConfigured()) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, slidersRes, settingsRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('order_index'),
        supabase.from('sliders').select('*').order('order_index'),
        supabase.from('site_settings').select('*').limit(1).maybeSingle(),
      ]);
      
      if (productsRes.data) setProducts(productsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (slidersRes.data) setSliders(slidersRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        toast.success("ورود موفق", { description: "به پنل مدیریت خوش آمدید" });
      } else {
        toast.error("رمز عبور اشتباه است");
      }
      setIsLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
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
    setIsLoading(false);
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
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            خروج
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">محصولات</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">دسته‌بندی‌ها</span>
            </TabsTrigger>
            <TabsTrigger value="sliders" className="gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">اسلایدرها</span>
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
                      <Input 
                        value={productForm.image} 
                        onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                        placeholder="https://..."
                      />
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
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={productForm.in_stock} 
                          onCheckedChange={(v) => setProductForm({...productForm, in_stock: v})}
                        />
                        <Label>موجود</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={productForm.featured} 
                          onCheckedChange={(v) => setProductForm({...productForm, featured: v})}
                        />
                        <Label>ویژه</Label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSaveProduct} disabled={isLoading}>
                      {isLoading ? "در حال ذخیره..." : "ذخیره"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>محصول</TableHead>
                      <TableHead>دسته‌بندی</TableHead>
                      <TableHead>قیمت</TableHead>
                      <TableHead>وضعیت</TableHead>
                      <TableHead className="text-left">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      const category = categories.find(c => c.id === product.category_id);
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover bg-muted"
                              />
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{category?.name || '-'}</TableCell>
                          <TableCell>{formatPrice(product.price)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.in_stock ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-destructive/20 text-destructive'}`}>
                              {product.in_stock ? 'موجود' : 'ناموجود'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" onClick={() => openEditProduct(product)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteProduct(product.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {products.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          هیچ محصولی وجود ندارد
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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
                      <Label>شناسه (slug) *</Label>
                      <Input 
                        value={categoryForm.slug} 
                        onChange={(e) => setCategoryForm({...categoryForm, slug: e.target.value})}
                        placeholder="skincare"
                        dir="ltr"
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
                    <Button onClick={handleSaveCategory} disabled={isLoading}>
                      {isLoading ? "در حال ذخیره..." : "ذخیره"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>نام</TableHead>
                      <TableHead>شناسه</TableHead>
                      <TableHead>ترتیب</TableHead>
                      <TableHead className="text-left">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell dir="ltr" className="text-muted-foreground">{category.slug}</TableCell>
                        <TableCell>{category.order_index}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditCategory(category)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteCategory(category.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {categories.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          هیچ دسته‌بندی وجود ندارد
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sliders Tab */}
          <TabsContent value="sliders" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">اسلایدرها</h2>
                <p className="text-muted-foreground">{sliders.length} اسلایدر</p>
              </div>
              <Dialog open={sliderDialogOpen} onOpenChange={(open) => {
                setSliderDialogOpen(open);
                if (!open) resetSliderForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    افزودن اسلایدر
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingSlider ? 'ویرایش اسلایدر' : 'افزودن اسلایدر جدید'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>عنوان *</Label>
                      <Input 
                        value={sliderForm.title} 
                        onChange={(e) => setSliderForm({...sliderForm, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>زیرعنوان</Label>
                      <Input 
                        value={sliderForm.subtitle} 
                        onChange={(e) => setSliderForm({...sliderForm, subtitle: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>لینک تصویر *</Label>
                      <Input 
                        value={sliderForm.image} 
                        onChange={(e) => setSliderForm({...sliderForm, image: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>لینک دکمه</Label>
                        <Input 
                          value={sliderForm.link} 
                          onChange={(e) => setSliderForm({...sliderForm, link: e.target.value})}
                          placeholder="/products"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>متن دکمه</Label>
                        <Input 
                          value={sliderForm.button_text} 
                          onChange={(e) => setSliderForm({...sliderForm, button_text: e.target.value})}
                          placeholder="مشاهده"
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
                      <div className="flex items-center gap-2 pt-6">
                        <Switch 
                          checked={sliderForm.is_active} 
                          onCheckedChange={(v) => setSliderForm({...sliderForm, is_active: v})}
                        />
                        <Label>فعال</Label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSaveSlider} disabled={isLoading}>
                      {isLoading ? "در حال ذخیره..." : "ذخیره"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sliders.map((slider) => (
                <Card key={slider.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img 
                      src={slider.image} 
                      alt={slider.title}
                      className="w-full h-full object-cover"
                    />
                    {!slider.is_active && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <span className="text-muted-foreground">غیرفعال</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-1">{slider.title}</h3>
                    {slider.subtitle && (
                      <p className="text-sm text-muted-foreground mb-3">{slider.subtitle}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditSlider(slider)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDeleteSlider(slider.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {sliders.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    هیچ اسلایدری وجود ندارد
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">تنظیمات سایت</h2>
                <p className="text-muted-foreground">تنظیمات عمومی فروشگاه</p>
              </div>
              <Button onClick={handleSaveSettings} disabled={savingSettings} className="gap-2">
                <Save className="h-4 w-4" />
                {savingSettings ? "در حال ذخیره..." : "ذخیره تنظیمات"}
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* General */}
              <Card>
                <CardHeader>
                  <CardTitle>اطلاعات کلی</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>نام سایت</Label>
                    <Input 
                      value={settings.site_name}
                      onChange={(e) => setSettings({...settings, site_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>توضیحات</Label>
                    <Textarea 
                      value={settings.site_description}
                      onChange={(e) => setSettings({...settings, site_description: e.target.value})}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>درباره ما</Label>
                    <Textarea 
                      value={settings.about_us || ''}
                      onChange={(e) => setSettings({...settings, about_us: e.target.value})}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Branding */}
              <Card>
                <CardHeader>
                  <CardTitle>برندینگ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>لینک لوگو</Label>
                    <Input 
                      value={settings.logo_url || ''}
                      onChange={(e) => setSettings({...settings, logo_url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>لینک فاویکون</Label>
                    <Input 
                      value={settings.favicon_url || ''}
                      onChange={(e) => setSettings({...settings, favicon_url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>اطلاعات تماس</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>شماره تلفن‌ها (با کاما جدا کنید)</Label>
                    <Input 
                      value={settings.phone_numbers.join(', ')}
                      onChange={(e) => setSettings({...settings, phone_numbers: e.target.value.split(',').map(s => s.trim())})}
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>آدرس</Label>
                    <Input 
                      value={settings.address || ''}
                      onChange={(e) => setSettings({...settings, address: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ساعات پشتیبانی</Label>
                    <Input 
                      value={settings.support_hours}
                      onChange={(e) => setSettings({...settings, support_hours: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Social */}
              <Card>
                <CardHeader>
                  <CardTitle>شبکه‌های اجتماعی</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>اینستاگرام</Label>
                    <Input 
                      value={settings.instagram_url || ''}
                      onChange={(e) => setSettings({...settings, instagram_url: e.target.value})}
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>تلگرام</Label>
                    <Input 
                      value={settings.telegram_url || ''}
                      onChange={(e) => setSettings({...settings, telegram_url: e.target.value})}
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>لینکدین</Label>
                    <Input 
                      value={settings.linkedin_url || ''}
                      onChange={(e) => setSettings({...settings, linkedin_url: e.target.value})}
                      dir="ltr"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Purchase */}
              <Card>
                <CardHeader>
                  <CardTitle>تنظیمات خرید</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">امکان خرید</p>
                      <p className="text-sm text-muted-foreground">
                        {settings.purchase_enabled 
                          ? "کاربران می‌توانند خرید کنند" 
                          : "فقط مشاهده محصولات ممکن است"}
                      </p>
                    </div>
                    <Switch 
                      checked={settings.purchase_enabled}
                      onCheckedChange={(v) => setSettings({...settings, purchase_enabled: v})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <Card>
                <CardHeader>
                  <CardTitle>نمادهای اعتماد</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>کد اینماد</Label>
                    <Input 
                      value={settings.enamad_code || ''}
                      onChange={(e) => setSettings({...settings, enamad_code: e.target.value})}
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>کد ساماندهی</Label>
                    <Input 
                      value={settings.samandehi_code || ''}
                      onChange={(e) => setSettings({...settings, samandehi_code: e.target.value})}
                      dir="ltr"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
