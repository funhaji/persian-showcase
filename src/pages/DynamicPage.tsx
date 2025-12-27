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
  };

  const currentPage = pageData[path] || { title: 'صفحه یافت نشد', content: null };

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
        title={`${currentPage.title} - ${settings?.site_name}`} 
        description={settings?.site_description || ''}
      />
      <div className="container py-16">
        <h1 className="text-3xl font-bold mb-8">{currentPage.title}</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {currentPage.content ? (
            <div dangerouslySetInnerHTML={{ __html: currentPage.content.replace(/\n/g, '<br />') }} />
          ) : (
            <p className="text-muted-foreground italic">
              هنوز اطلاعاتی برای این بخش وارد نشده است. از پنل مدیریت محتوا را اضافه کنید.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DynamicPage;
