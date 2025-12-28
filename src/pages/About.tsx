import Layout from "@/components/shop/Layout";
import SEO from "@/components/SEO";
import { useSite } from "@/contexts/SiteContext";

const About = () => {
  const { settings, isLoading } = useSite();

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
          <div className="h-4 bg-muted rounded w-full mb-4"></div>
          <div className="h-4 bg-muted rounded w-full mb-4"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title={`درباره ما - ${settings?.site_name}`} 
        description={settings?.site_description}
      />
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold mb-4 text-primary">درباره ما</h1>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="bg-card border rounded-2xl p-8 md:p-12 shadow-sm hover-elevate transition-all duration-300">
            <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed text-justify">
              {settings?.about_us ? (
                <div dangerouslySetInnerHTML={{ __html: settings.about_us.replace(/\n/g, '<br />') }} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground italic text-lg">
                    هنوز اطلاعاتی برای این بخش وارد نشده است.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-accent/30 p-6 rounded-xl text-center border">
              <div className="text-primary font-bold text-xl mb-2">کیفیت تضمین شده</div>
              <p className="text-sm text-muted-foreground text-secondary">ما فقط بهترین برندهای آرایشی را برای شما فراهم می‌کنیم.</p>
            </div>
            <div className="bg-accent/30 p-6 rounded-xl text-center border">
              <div className="text-primary font-bold text-xl mb-2">ارسال سریع</div>
              <p className="text-sm text-muted-foreground text-secondary">سفارشات شما در کمترین زمان ممکن به دستتان می‌رسد.</p>
            </div>
            <div className="bg-accent/30 p-6 rounded-xl text-center border">
              <div className="text-primary font-bold text-xl mb-2">پشتیبانی ۲۴/۷</div>
              <p className="text-sm text-muted-foreground text-secondary">تیم پشتیبانی ما همیشه آماده پاسخگویی به شماست.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
