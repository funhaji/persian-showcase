import { useEffect, useState } from "react";
import Layout from "@/components/shop/Layout";
import SEO from "@/components/SEO";
import { supabase } from "@/lib/supabase";
import { ChevronDown } from "lucide-react";

type FAQItem = { 
  id: string; 
  question: string; 
  answer: string; 
  order_index: number; 
  is_active: boolean 
};

const FAQ = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await supabase
          .from('faqs')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });
        
        if (res.data) {
          setFaqs(res.data as FAQItem[]);
        }
      } catch (err) {
        console.error('Error fetching faqs', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Layout>
      <SEO title="پرسش‌های متداول" />
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-black mb-2">پرسش‌های متداول</h1>
          <p className="text-muted-foreground mb-8">
            پاسخ سوالات متداول شما در اینجا
          </p>
        
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">در حال بارگذاری...</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-10 bg-muted/50 rounded-lg border-2 border-dashed">
              <p className="text-muted-foreground">هیچ پرسش و پاسخی یافت نشد.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div 
                  key={faq.id}
                  className="bg-card border rounded-lg overflow-hidden transition-all hover:shadow-md"
                >
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-right hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-semibold text-lg">{faq.question}</span>
                    <ChevronDown 
                      className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 mr-4 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {openIndex === index && (
                    <div className="px-6 pb-4 pt-2 border-t bg-muted/20">
                      <div 
                        className="prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: faq.answer }} 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
