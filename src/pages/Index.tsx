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
  
  return (
    <Layout>
      <SEO title={settings?.site_name} description={settings?.site_description} />
      
      <div className="container pt-6 pb-20 space-y-12">
        <div className="rounded-2xl overflow-hidden shadow-xl border border-border">
          <HeroSlider />
        </div>

        {/* Categories (Plain text boxes) */}
        {categories.length > 0 && (
          <section>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(category.id)}`}
                  className="px-4 py-2 border rounded-md bg-card text-foreground hover:border-primary hover:text-primary transition-all text-xs font-bold"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Latest Products */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b pb-4 border-border">
            <h2 className="text-2xl font-black text-foreground">جدیدترین محصولات</h2>
            <Link to="/products" className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-1">
              مشاهده همه <ArrowLeft className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Why Us Section (Fixed Dark Mode) */}
        <section className="py-12 bg-card rounded-3xl border border-border shadow-sm">
          <div className="container px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: "🛡️", title: "اصالت کالا", desc: "تضمین ۱۰۰٪ کیفیت" },
                { icon: "🚚", title: "ارسال سریع", desc: "تحویل درب منزل" },
                { icon: "💬", title: "پشتیبانی", desc: "همراه شما هستیم" },
                { icon: "🔒", title: "پرداخت امن", desc: "درگاه معتبر بانکی" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-2 group cursor-default">
                  <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center text-3xl group-hover:scale-110 transition-all duration-300">
                    {item.icon}
                  </div>
                  <h4 className="font-black text-foreground text-sm">{item.title}</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
