import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/shop/Layout";
import HeroSlider from "@/components/shop/HeroSlider";
import ProductCard from "@/components/shop/ProductCard";
import SEO from "@/components/SEO";
import { useSite } from "@/contexts/SiteContext";

const Index = () => {
  const { products, categories, isLoading, settings } = useSite();
  
  const featuredProducts = products.filter((p) => p.featured);
  const discountedProducts = products.filter((p) => p.original_price && p.original_price > p.price);

  return (
    <Layout>
      <SEO 
        title={settings?.site_name} 
        description={settings?.site_description}
      />
      
      {/* Hero Slider */}
      <HeroSlider />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold mb-4">دسته‌بندی‌های محبوب</h2>
              <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(category.id)}`}
                  className="group flex flex-col items-center"
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-muted bg-card flex items-center justify-center mb-4 group-hover:border-primary group-hover:shadow-md transition-all duration-300 overflow-hidden">
                    <span className="text-lg font-bold text-muted-foreground group-hover:text-primary transition-colors px-2 text-center">
                      {category.name}
                    </span>
                  </div>
                  <h3 className="font-semibold text-center group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-extrabold mb-2">محصولات ویژه</h2>
                <p className="text-muted-foreground">گلچینی از بهترین و پرفروش‌ترین محصولات ما</p>
              </div>
              <Link to="/products">
                <Button variant="outline" className="rounded-full px-6">
                  مشاهده همه محصولات
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="py-16 border-y">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-primary font-bold">✓</span>
              </div>
              <h3 className="font-bold">ضمانت اصالت</h3>
              <p className="text-xs text-muted-foreground">تضمین ۱۰۰٪ اصالت کالا</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-primary font-bold">🚚</span>
              </div>
              <h3 className="font-bold">ارسال سریع</h3>
              <p className="text-xs text-muted-foreground">ارسال به سراسر کشور</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-primary font-bold">📞</span>
              </div>
              <h3 className="font-bold">پشتیبانی آنلاین</h3>
              <p className="text-xs text-muted-foreground">پاسخگویی سریع به سوالات</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-primary font-bold">💳</span>
              </div>
              <h3 className="font-bold">پرداخت امن</h3>
              <p className="text-xs text-muted-foreground">درگاه‌های بانکی معتبر</p>
            </div>
          </div>
        </div>
      </section>

      {/* Discounted Products */}
      {discountedProducts.length > 0 && (
        <section className="py-20">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-extrabold mb-2 text-destructive">تخفیف‌های شگفت‌انگیز</h2>
                <p className="text-muted-foreground">فرصت محدود برای خرید با قیمت‌های استثنایی</p>
              </div>
              <Link to="/products">
                <Button variant="ghost" className="text-primary hover:bg-primary/5 rounded-full">
                  مشاهده همه تخفیف‌ها
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {discountedProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Products when no featured */}
      {featuredProducts.length === 0 && discountedProducts.length === 0 && products.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">محصولات</h2>
              <Link to="/products" className="text-primary hover:underline flex items-center gap-1">
                مشاهده همه
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <section className="py-16">
          <div className="container text-center">
            <h2 className="text-2xl font-bold mb-4">هنوز محصولی اضافه نشده</h2>
            <p className="text-muted-foreground">
              از پنل مدیریت محصولات جدید اضافه کنید
            </p>
          </div>
        </section>
      )}

      {/* CTA */}
      {settings && (
        <section className="py-16 bg-muted/50">
          <div className="container text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">مشاوره رایگان خرید</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              برای انتخاب بهترین محصولات متناسب با نوع پوست خود، با کارشناسان ما تماس بگیرید.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Link to="/products">
                <Button className="gap-2">
                  مشاهده محصولات
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Index;
