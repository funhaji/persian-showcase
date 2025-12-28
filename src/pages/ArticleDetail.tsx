import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/shop/Layout";
import SEO from "@/components/SEO";
import { supabase } from "@/lib/supabase";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Article = { 
  id: string; 
  title: string; 
  slug?: string | null; 
  content: string; 
  created_at: string;
  excerpt?: string | null;
};

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await supabase
          .from('articles')
          .select('*')
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .limit(1)
          .maybeSingle();
        
        if (res.error) {
          console.error('Error fetching article:', res.error);
          throw res.error;
        }
        
        if (!res.data) {
          setNotFound(true);
        } else {
          setArticle(res.data as Article);
        }
      } catch (err) {
        console.error('Error fetching article', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <Layout>
        <SEO title="در حال بارگذاری..." />
        <div className="container py-12">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">در حال بارگذاری مقاله...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (notFound || !article) {
    return (
      <Layout>
        <SEO title="مقاله یافت نشد" />
        <div className="container py-12">
          <div className="text-center py-20 bg-card rounded-lg border">
            <h1 className="text-2xl font-bold mb-4">مقاله یافت نشد</h1>
            <p className="text-muted-foreground mb-6">
              متأسفانه مقاله مورد نظر شما یافت نشد یا حذف شده است.
            </p>
            <Link to="/articles">
              <Button variant="outline">
                <ArrowRight className="ml-2 h-4 w-4" />
                بازگشت به لیست مقالات
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title={article.title} 
        description={article.excerpt || article.content.substring(0, 160)}
      />
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link to="/articles" className="inline-block mb-6">
            <Button variant="ghost" size="sm">
              <ArrowRight className="ml-2 h-4 w-4" />
              بازگشت به مقالات
            </Button>
          </Link>

          {/* Article header */}
          <div className="mb-8 pb-6 border-b">
            <h1 className="text-3xl md:text-4xl font-black mb-4">
              {article.title}
            </h1>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(article.created_at)}</span>
            </div>
          </div>

          {/* Article content */}
          <div 
            className="prose prose-lg max-w-none dark:prose-invert
              prose-headings:font-black
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:mb-4 prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-lg prose-img:shadow-md
              prose-ul:my-4 prose-ol:my-4
              prose-li:my-2"
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />

          {/* Back button at bottom */}
          <div className="mt-12 pt-6 border-t">
            <Link to="/articles">
              <Button variant="outline">
                <ArrowRight className="ml-2 h-4 w-4" />
                بازگشت به لیست مقالات
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArticleDetail;
