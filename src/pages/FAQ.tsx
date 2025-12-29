import { useEffect, useState } from "react";
import Layout from "@/components/shop/Layout";
import SEO from "@/components/SEO";
import { supabase } from "@/lib/supabase";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await supabase
          .from('faqs')
          .select('*')
          .order('order_index', { ascending: true });
        
        if (res.error) {
          setError(`Database Error: ${res.error.message}`);
          setDebugInfo(`Error Code: ${res.error.code || 'unknown'}`);
          return;
        }
        
        const allFaqs = (res.data as FAQItem[]) || [];
        setFaqs(allFaqs);
        
        const activeCount = allFaqs.filter(f => f.is_active).length;
        const inactiveCount = allFaqs.length - activeCount;
        
        setDebugInfo(`Total FAQs: ${allFaqs.length} | Active: ${activeCount} | Inactive: ${inactiveCount}`);
        
      } catch (err: any) {
        setError(`Error: ${err.message || 'Unknown error occurred'}`);
        setDebugInfo(JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const activeFaqs = faqs.filter(f => f.is_active);

  return (
    <Layout>
      <SEO title="پرسش‌های متداول" />
      <div className="container py-12">
        <h1 className="text-3xl font-black mb-6">پرسش‌های متداول</h1>
        
        {debugInfo && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Debug Info</AlertTitle>
            <AlertDescription className="font-mono text-xs">{debugInfo}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>خطا در بارگذاری</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">در حال بارگذاری...</p>
          </div>
        ) : activeFaqs.length === 0 ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>هیچ پرسش فعالی یافت نشد</AlertTitle>
              <AlertDescription>
                {faqs.length === 0 ? (
                  <span>هیچ سوالی در دیتابیس وجود ندارد. در پنل ادمین سوال اضافه کنید.</span>
                ) : (
                  <span>{faqs.length} سوال غیرفعال وجود دارد. در پنل ادمین آن‌ها را فعال کنید (تیک فعال را بزنید).</span>
                )}
              </AlertDescription>
            </Alert>
            
            {faqs.length > 0 && (
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-bold mb-2">سوالات غیرفعال:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {faqs.map(f => (
                    <li key={f.id} className="text-muted-foreground">
                      {f.question} {!f.is_active && <span className="text-destructive">(غیرفعال)</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <>
            <Alert className="mb-6">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>موفق</AlertTitle>
              <AlertDescription>{activeFaqs.length} سوال فعال یافت شد</AlertDescription>
            </Alert>
            
            <Accordion>
              {activeFaqs.map((f) => (
                <AccordionItem key={f.id} title={f.question}>
                  <div 
                    className="prose max-w-none" 
                    dangerouslySetInnerHTML={{ __html: f.answer }} 
                  />
                </AccordionItem>
              ))}
            </Accordion>
          </>
        )}
      </div>
    </Layout>
  );
};

export default FAQ;
