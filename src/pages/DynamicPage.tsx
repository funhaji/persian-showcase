import Layout from "@/components/shop/Layout";
import SEO from "@/components/SEO";
import { useSite } from "@/contexts/SiteContext";
import { useLocation } from "react-router-dom";

const DynamicPage = () => {
  const { settings, isLoading } = useSite();
  const location = useLocation();
  const path = window.location.pathname.substring(1);

  const pageData: Record<string, { title: string, content: string | null | undefined }> = {
    'contact': { title: 'تماس با ما', content: settings?.contact_us },
    'faq': { title: 'پرسش‌های متداول', content: settings?.faq },
    'shipping': { title: 'رویه‌های ارسال', content: settings?.shipping_policy },
    'returns': { title: 'شرایط مرجوعی', content: settings?.return_policy },
    'privacy': { title: 'حریم خصوصی', content: settings?.privacy_policy },
    'terms': { title: 'قوانین و مقررات', content: settings?.terms_conditions },
    'careers': { title: 'فرصت‌های شغلی', content: 'در حال حاضر فرصت شغلی فعالی وجود ندارد.' },
    'guide': { title: 'راهنمای خرید و پرداخت', content: 'به زودی راهنمای جامع خرید اضافه خواهد شد.' },
    'article': { title: 'مقالات و اخبار', content: settings?.article_content },
  };

  const currentPage = pageData[path] || { title: 'صفحه یافت نشد', content: null };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title={`${currentPage.title} - ${settings?.site_name}`} 
        description={settings?.site_description || ''}
      />
      <div className="container py-16 max-w-4xl mx-auto">
        <div className="bg-card p-8 md:p-12 rounded-2xl shadow-sm border border-border/50">
          <h1 className="text-3xl font-bold mb-8 pb-4 border-b border-primary/20 text-primary">{currentPage.title}</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed text-foreground/90">
            {currentPage.content ? (
              <div 
                className="prose-p:mb-6 prose-headings:text-primary prose-headings:mt-8 prose-headings:mb-4"
                dangerouslySetInnerHTML={{ __html: currentPage.content.replace(/\n/g, '<br />') }} 
              />
            ) : (
              <div className="bg-muted/30 p-8 rounded-xl text-center border border-dashed border-muted">
                <p className="text-muted-foreground italic text-lg">
                  هنوز اطلاعاتی برای این بخش وارد نشده است. از پنل مدیریت محتوا را اضافه کنید.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DynamicPage;
