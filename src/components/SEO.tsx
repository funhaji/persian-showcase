import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const SEO = ({
  title = "خرید لوازم آرایشی | محصولات اورجینال با ضمانت اصالت",
  description = "خرید آنلاین لوازم آرایشی و بهداشتی اورجینال از برندهای معتبر. ارسال سریع به سراسر کشور با ضمانت اصالت کالا و بهترین قیمت.",
  image = "/og-image.png",
  url = "https://example.ir",
}: SEOProps) => {
  const fullTitle = title.includes("لوازم آرایشی") ? title : `${title} | لوازم آرایشی`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="fa_IR" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
      <html lang="fa" dir="rtl" />
    </Helmet>
  );
};

export default SEO;
