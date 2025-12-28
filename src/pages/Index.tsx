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

  return (
    <Layout>
      <SEO 
        title={settings?.site_name} 
        description={settings?.site_description}
      />

      <div className="container pt-6 pb-20 space-y-12">
        {/* Hero Slider */}
        <div className="rounded-3xl overflow-hidden shadow-2xl border-none">
          <HeroSlider />
        </div>

        {/* Categories - Simple Boxes */}
        {categories.length > 0 && (
          <section className="py-4">
            <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(category.id)}`}
                  className="group"
                >
                  <div className="px-6 py-3 rounded-full border-2 border-muted bg-card hover:border-primary hover:bg-primary/5 transition-all duration-300 shadow-sm hover:shadow-md">
                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Secondary Banner */}
        <section className="relative rounded-[2.5rem] overflow-hidden h-64 md:h-80 border-none group shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/80 via-zinc-900/40 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
            alt="Banner"
          />
          <div className="relative z-20 h-full flex flex-col justify-center p-10 md:p-16 text-white max-w-xl space-y-4">
            <span className="bg-[#ffeb3b] text-black text-[11px] font-black px-4 py-1 rounded-full w-fit shadow-lg uppercase tracking-widest">۳۰٪ تخفیف ویژه</span>
            <h3 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter">پرطرفدارهای برقی اینجاست!</h3>
            <p className="text-white/70 text-sm md:text-base font-medium max-w-sm">بهترین ابزارهای زیبایی و مراقبت از پوست با قیمت استثنایی</p>
            <Link to="/products" className="pt-2">
              <Button size="lg" className="bg-white text-black hover:bg-[#e91e63] hover:text-white rounded-full font-black px-10 shadow-xl transition-all duration-300">
                مشاهده و خرید
              </Button>
            </Link>
          </div>
        </section>

        {/* Latest Products Section */}
        <section className="pt-8">
          <div className="flex items-center justify-between mb-10 border-b border-border pb-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-foreground">جدیدترین محصولات</h2>
              <div className="h-1.5 w-12 bg-[#e91e63] rounded-full"></div>
            </div>
            <Link to="/products">
              <Button variant="ghost" className="text-sm font-bold text-muted-foreground hover:text-[#e91e63] hover:bg-[#e91e63]/5 rounded-full px-6 transition-all">
                مشاهده همه محصولات
                <ArrowLeft className="mr-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
            {products.slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section className="pt-8">
            <div className="flex items-center justify-between mb-10 border-b border-border pb-6">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-foreground">محصولات ویژه</h2>
                <div className="h-1.5 w-12 bg-[#e91e63] rounded-full"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Why Us Section */}
        <section className="py-12 bg-card rounded-[2.5rem] border border-border shadow-sm">
          <div className="container px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: "🛡️", title: "اصالت کالا", desc: "تضمین ۱۰۰٪ کیفیت" },
                { icon: "🚚", title: "ارسال سریع", desc: "تحویل درب منزل" },
                { icon: "💬", title: "پشتیبانی", desc: "همراه شما هستیم" },
                { icon: "🔒", title: "پرداخت امن", desc: "درگاه معتبر بانکی" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-2 group cursor-default">
                  <div className="w-16 h-16 rounded-2xl bg-background shadow-sm flex items-center justify-center text-3xl group-hover:scale-110 group-hover:shadow-md transition-all duration-300 border border-border">
                    {item.icon}
                  </div>
                  <h4 className="font-black text-foreground text-sm">{item.title}</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-to-r from-[#e91e63] to-[#f50057] rounded-[2.5rem] overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mb-48 blur-3xl" />
          <div className="relative z-10 container text-center space-y-6">
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-black text-white">عضویت در خبرنامه</h3>
              <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto">
                از جدیدترین محصولات و تخفیف‌های ویژه با خبر شوید
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="ایمیل خود را وارد کنید"
                className="flex-1 px-6 py-4 rounded-full border-none text-right bg-white/20 backdrop-blur-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <Button className="bg-white text-[#e91e63] hover:bg-white/90 rounded-full px-8 py-4 font-bold shadow-lg">
                عضویت
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
