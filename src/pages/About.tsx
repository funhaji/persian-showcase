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
        <h1 className="text-3xl font-bold mb-8">درباره ما</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {settings?.about_us ? (
            <div dangerouslySetInnerHTML={{ __html: settings.about_us.replace(/\n/g, '<br />') }} />
          ) : (
            <p className="text-muted-foreground italic">
              هنوز اطلاعاتی برای این بخش وارد نشده است.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default About;
