import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
      <section className="relative overflow-hidden bg-gradient-to-bl from-primary/5 via-background to-muted/30">
        <div className="container py-16 md:py-24">
          <div className="max-w-2xl space-y-5">
            <span className="text-sm text-muted-foreground">ارسال رایگان برای خرید بالای ۵۰۰ هزار تومان</span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              خرید لوازم آرایشی
              <br />
              <span className="text-primary">اورجینال و با ضمانت</span>
            </h1>
            <p className="text-muted-foreground">
              بهترین برندهای آرایشی و بهداشتی با تضمین اصالت کالا
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/products">
                <Button size="lg" className="gap-2">
                  مشاهده محصولات
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/products?category=مراقبت پوست">
                <Button size="lg" variant="outline">
                  مراقبت پوست
                </Button>
              </Link>
            </div>
          </div>
        </div>
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
    </Layout>
  );
};

export default Index;
