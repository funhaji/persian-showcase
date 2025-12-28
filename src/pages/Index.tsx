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
      
      {/* Top Banner/Promo */}
      <div className="bg-[#e91e63] py-2 text-center overflow-hidden">
        <div className="container">
          <p className="text-white text-xs md:text-sm font-bold animate-pulse tracking-wide">
            بزن بریم خرید - اینجا کلیک کن
          </p>
        </div>
      </div>

      <div className="container pt-6 pb-20 space-y-12">
        {/* Hero Slider */}
        <div className="rounded-3xl overflow-hidden shadow-2xl border-none">
          <HeroSlider />
        </div>

        {/* Categories Grid (Attached Image Style) */}
        {categories.length > 0 && (
          <section className="py-4">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8 max-w-5xl mx-auto">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(category.id)}`}
                  className="group flex flex-col items-center space-y-3"
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-muted bg-white shadow-sm flex items-center justify-center group-hover:border-primary group-hover:scale-110 group-hover:shadow-md transition-all duration-500 overflow-hidden p-2">
                    <span className="text-[10px] md:text-xs font-black text-center leading-tight text-zinc-700 group-hover:text-primary transition-colors">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-zinc-500 group-hover:text-primary tracking-tight">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Specialized Section (Attached Image Style - Magenta Box) */}
        <section className="bg-[#e91e63] rounded-[2.5rem] overflow-hidden p-6 md:p-10 flex flex-col md:flex-row gap-8 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="flex-1 z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {products.filter(p => p.featured).slice(0, 4).map(product => (
                <div key={product.id} className="bg-white rounded-3xl p-4 flex flex-col items-center group relative shadow-xl hover:-translate-y-2 transition-transform duration-300">
                   <div className="w-full aspect-square bg-zinc-50 rounded-2xl mb-3 flex items-center justify-center overflow-hidden">
                     <img src={product.image} className="w-28 h-28 object-contain group-hover:scale-110 transition-transform duration-500" />
                   </div>
                   <h4 className="text-[11px] font-bold text-zinc-800 line-clamp-2 text-center mb-2 h-8">{product.name}</h4>
                   <div className="mt-auto flex flex-col items-center">
                     <p className="text-[#e91e63] text-sm font-black">{product.price.toLocaleString("fa-IR")} تومان</p>
                   </div>
                   <Link to={`/product/${product.id}`} className="absolute inset-0" />
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-60 flex flex-col items-center justify-center text-white text-center space-y-6 z-10">
            <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-inner">
              <span className="text-5xl animate-bounce">🎁</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black tracking-tighter">جعبه صورتی</h3>
              <p className="text-white/80 text-xs font-medium">پیشنهادات شگفت‌انگیز امروز</p>
            </div>
            <Link to="/products">
              <Button variant="outline" className="bg-white/10 border-white/40 text-white hover:bg-white hover:text-[#e91e63] rounded-full px-8 py-6 text-sm font-bold backdrop-blur-sm transition-all duration-300 shadow-lg">
                مشاهده محصولات
              </Button>
            </Link>
          </div>
        </section>

        {/* Secondary Banner (Attached Image Style) */}
        <section className="relative rounded-[2.5rem] overflow-hidden h-64 md:h-80 border-none group shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/80 via-zinc-900/40 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
          />
          <div className="relative z-20 h-full flex flex-col justify-center p-10 md:p-16 text-white max-w-xl space-y-4">
            <span className="bg-[#ffeb3b] text-black text-[11px] font-black px-4 py-1 rounded-full w-fit shadow-lg uppercase tracking-widest">٪۳۰ تخفیف ویژه</span>
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
          <div className="flex items-center justify-between mb-10 border-b border-muted pb-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-zinc-900">جدیدترین محصولات</h2>
              <div className="h-1.5 w-12 bg-[#e91e63] rounded-full"></div>
            </div>
            <Link to="/products">
              <Button variant="ghost" className="text-sm font-bold text-zinc-500 hover:text-[#e91e63] hover:bg-[#e91e63]/5 rounded-full px-6 transition-all">
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

        {/* Why Us Section */}
        <section className="py-12 bg-zinc-50 rounded-[2.5rem] border border-zinc-100">
          <div className="container px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: "🛡️", title: "اصالت کالا", desc: "تضمین ۱۰۰٪ کیفیت" },
                { icon: "🚚", title: "ارسال سریع", desc: "تحویل درب منزل" },
                { icon: "💬", title: "پشتیبانی", desc: "همراه شما هستیم" },
                { icon: "🔒", title: "پرداخت امن", desc: "درگاه معتبر بانکی" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-2 group cursor-default">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    {item.icon}
                  </div>
                  <h4 className="font-black text-zinc-800 text-sm">{item.title}</h4>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{item.desc}</p>
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
