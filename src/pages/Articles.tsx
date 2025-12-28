import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/shop/Layout";
import SEO from "@/components/SEO";
import { supabase } from "@/lib/supabase";
import { Calendar } from "lucide-react";

type Article = { 
  id: string; 
  title: string; 
  slug?: string | null; 
  excerpt?: string | null; 
  created_at: string;
  published?: boolean;
};

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await supabase
          .from('articles')
          .select('id, title, slug, excerpt, created_at, published')
          .eq('published', true)
          .order('created_at', { ascending: false });
        
        if (res.error) {
          console.error('Error fetching articles:', res.error);
          throw res.error;
        }
        
        setArticles((res.data as Article[]) || []);
      } catch (err) {
        console.error('Error fetching articles', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Layout>
      <SEO title="مقالات" description="مقالات و مطالب آموزشی" />
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">مقالات</h1>
          <p className="text-muted-foreground">مطالب آموزشی و اطلاعاتی</p>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">در حال بارگذاری...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-10 bg-card rounded-lg border">
            <p className="text-muted-foreground">هیچ مقاله‌ای یافت نشد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <article 
                key={article.id} 
                className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 line-clamp-2">
                    {article.title}
                  </h2>
                  
                  {article.excerpt && (
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                    
                    <Link 
                      to={`/articles/${article.slug || article.id}`}
                      className="text-primary hover:underline font-medium text-sm"
                    >
                      ادامه مطلب ←
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Articles;
