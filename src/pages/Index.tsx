import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/shop/Layout";
import ProductCard from "@/components/shop/ProductCard";
import SEO from "@/components/SEO";
import { products, categories } from "@/data/products";

const Index = () => {
  const featuredProducts = products.filter((p) => p.featured);
  const discountedProducts = products.filter((p) => p.originalPrice);

  return (
    <Layout>
      <SEO />
      
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-primary/10 via-background to-accent/20">
        <div className="container py-20 md:py-32">
          <div className="max-w-2xl space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm">
              <Sparkles className="h-4 w-4" />
              <span>تخفیف‌های ویژه فعال است</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="text-gradient">بهترین محصولات</span>
              <br />
              با بهترین قیمت
            </h1>
            <p className="text-lg text-muted-foreground">
              فروشگاه آنلاین با مجموعه‌ای از محصولات باکیفیت. ارسال سریع به سراسر کشور با ضمانت اصالت کالا.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" className="gap-2">
                  مشاهده محصولات
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/products?category=الکترونیک">
                <Button size="lg" variant="outline">
                  الکترونیک
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">دسته‌بندی‌ها</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(1).map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${encodeURIComponent(category.id)}`}
                className="group p-6 rounded-xl border bg-card hover:bg-accent hover:border-primary/50 transition-all duration-300 text-center"
              >
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">محصولات ویژه</h2>
            <Link to="/products" className="text-primary hover:underline flex items-center gap-1">
              مشاهده همه
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Discounted Products */}
      {discountedProducts.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">تخفیف‌های ویژه</h2>
              <Link to="/products" className="text-primary hover:underline flex items-center gap-1">
                مشاهده همه
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {discountedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">آماده خرید هستید؟</h2>
          <p className="text-lg opacity-90 max-w-xl mx-auto">
            همین حالا محصولات مورد علاقه خود را به سبد خرید اضافه کنید و از تخفیف‌های ویژه بهره‌مند شوید.
          </p>
          <Link to="/products">
            <Button size="lg" variant="secondary" className="gap-2">
              شروع خرید
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
