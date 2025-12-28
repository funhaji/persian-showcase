import { useEffect, useState } from "react";
import Layout from "@/components/shop/Layout";
import SEO from "@/components/SEO";
import { supabase } from "@/lib/supabase";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { useSite } from "@/contexts/SiteContext";

type FAQItem = { id: string; question: string; answer: string; order_index: number; is_active: boolean };

const FAQ = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const { settings } = useSite();

  useEffect(() => {
    (async () => {
      try {
        const res = await supabase.from('faqs').select('*').order('order_index', { ascending: true });
        if (res.error) throw res.error;
        let data = res.data as FAQItem[] | null;
        // fallback: some DBs use singular 'faq'
        if ((!data || data.length === 0) && !res.error) {
          const alt = await supabase.from('faq').select('*').order('order_index', { ascending: true });
          if (!alt.error && alt.data) data = alt.data as any;
        }
        setFaqs((data as FAQItem[]) || []);
      } catch (err) {
        console.error('Error fetching faqs', err);
      }
    })();
  }, []);

  const activeFaqs = faqs.filter(f => f.is_active);

  return (
    <Layout>
      <SEO title="پرسش‌های متداول" />
      <div className="container py-12">
        <h1 className="text-3xl font-black mb-6">پرسش‌های متداول</h1>
        {activeFaqs.length === 0 ? (
          settings?.faq ? (
            <div className="prose" dangerouslySetInnerHTML={{ __html: settings.faq }} />
          ) : (
            <p className="text-muted-foreground">هیچ پرسش و پاسخی یافت نشد.</p>
          )
        ) : (
          <Accordion>
            {activeFaqs.map((f) => (
              <AccordionItem key={f.id} title={f.question}>
                <div dangerouslySetInnerHTML={{ __html: f.answer }} />
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </Layout>
  );
};

export default FAQ;
