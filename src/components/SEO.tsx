import { Helmet } from "react-helmet-async";
import { useSite } from "@/contexts/SiteContext";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const SEO = ({
  title,
  description,
  image = "/og-image.png",
  url = "https://example.ir",
}: SEOProps) => {
  const { settings } = useSite();
  
  const defaultTitle = settings?.site_name || "خرید لوازم آرایشی | محصولات اورجینال با ضمانت اصالت";
  const defaultDescription = settings?.site_description || "خرید آنلاین لوازم آرایشی و بهداشتی اورجینال از برندهای معتبر. ارسال سریع به سراسر کشور با ضمانت اصالت کالا و بهترین قیمت.";
  const favicon = settings?.favicon_url || "/favicon.png";

  const displayTitle = title || defaultTitle;
  const displayDescription = description || defaultDescription;
  const fullTitle = displayTitle.includes("لوازم آرایشی") ? displayTitle : `${displayTitle} | لوازم آرایشی`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={displayDescription} />
      
      {/* Favicon */}
      <link rel="icon" type="image/png" href={favicon} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={displayDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="fa_IR" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={displayDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
      <html lang="fa" dir="rtl" />
    </Helmet>
  );
};

export default SEO;
