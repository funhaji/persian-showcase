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
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">دسته‌بندی‌ها</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
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
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
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
              {featuredProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

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
              {discountedProducts.slice(0, 6).map((product) => (
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
