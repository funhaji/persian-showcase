import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/shop/Layout";
import SEO from "@/components/SEO";
import { supabase } from "@/lib/supabase";

type Article = { id: string; title: string; slug?: string | null; excerpt?: string | null; created_at: string };

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from('articles').select('id,title,slug,excerpt,created_at').order('created_at', { ascending: false });
        setArticles((data as Article[]) || []);
      } catch (err) {
        console.error('Error fetching articles', err);
      }
    })();
  }, []);

  return (
    <Layout>
      <SEO title="مقالات" />
      <div className="container py-12">
        <h1 className="text-3xl font-black mb-6">مقالات</h1>
        {articles.length === 0 ? (
          <p className="text-muted-foreground">هیچ مقاله‌ای یافت نشد.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map(a => (
              <article key={a.id} className="bg-card rounded-lg p-6">
                <h2 className="text-xl font-bold mb-2">{a.title}</h2>
                {a.excerpt && <p className="text-muted-foreground mb-4">{a.excerpt}</p>}
                <Link to={`/articles/${a.slug || a.id}`} className="text-primary hover:underline">ادامه مطلب</Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Articles;
