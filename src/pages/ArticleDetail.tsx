import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/shop/Layout";
import SEO from "@/components/SEO";
import { supabase } from "@/lib/supabase";

type Article = { id: string; title: string; slug?: string | null; content: string; created_at: string };

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    (async () => {
      if (!slug) return;
      try {
        const { data } = await supabase
          .from('articles')
          .select('*')
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .limit(1)
          .maybeSingle();
        setArticle(data as Article || null);
      } catch (err) {
        console.error('Error fetching article', err);
      }
    })();
  }, [slug]);

  if (!article) {
    return (
      <Layout>
        <SEO title="مقاله" />
        <div className="container py-12">
          <p className="text-muted-foreground">در حال بارگذاری یا مقاله‌ای یافت نشد.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title={article.title} />
      <div className="container py-12">
        <h1 className="text-3xl font-black mb-6">{article.title}</h1>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
    </Layout>
  );
};

export default ArticleDetail;
