import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const SEO = ({
  title = "فروشگاه آنلاین | بهترین محصولات با بهترین قیمت",
  description = "فروشگاه آنلاین با بهترین محصولات الکترونیک، کیف و کفش، دکوراسیون و اکسسوری. ارسال سریع به سراسر کشور با ضمانت اصالت کالا.",
  image = "/og-image.png",
  url = "https://foroshgah.ir",
}: SEOProps) => {
  const fullTitle = title.includes("فروشگاه") ? title : `${title} | فروشگاه آنلاین`;

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
