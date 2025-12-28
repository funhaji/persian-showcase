import { useEffect, useState } from "react";
import Layout from "@/components/shop/Layout";
import SEO from "@/components/SEO";
import { supabase } from "@/lib/supabase";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { useSite } from "@/contexts/SiteContext";

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
  const { settings } = useSite();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await supabase
          .from('faqs')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });
        
        if (res.error) {
          console.error('Error fetching FAQs:', res.error);
          throw res.error;
        }
        
        setFaqs((res.data as FAQItem[]) || []);
      } catch (err) {
        console.error('Error fetching faqs', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Layout>
      <SEO title="پرسش‌های متداول" />
      <div className="container py-12">
        <h1 className="text-3xl font-black mb-6">پرسش‌های متداول</h1>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">در حال بارگذاری...</p>
          </div>
        ) : faqs.length === 0 ? (
          settings?.faq ? (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: settings.faq }} />
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">هیچ پرسش و پاسخی یافت نشد.</p>
            </div>
          )
        ) : (
          <Accordion>
            {faqs.map((f) => (
              <AccordionItem key={f.id} title={f.question}>
                <div 
                  className="prose max-w-none" 
                  dangerouslySetInnerHTML={{ __html: f.answer }} 
                />
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </Layout>
  );
};

export default FAQ;
