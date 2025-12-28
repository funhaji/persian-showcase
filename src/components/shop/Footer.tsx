import { Link } from "react-router-dom";
import { Instagram, Send, Linkedin, Phone, Clock } from "lucide-react";
import { useSite } from "@/contexts/SiteContext";

const Footer = () => {
  const { settings } = useSite();

  return (
    <footer className="bg-zinc-900 text-zinc-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Customer Services */}
          <div>
            <h3 className="font-bold text-white mb-5 text-lg">خدمات مشتریان</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">
                  پرسش‌های متداول
                </Link>
              </li>
              <li>
                <Link to="/guide" className="hover:text-primary transition-colors">
                  راهنمای خرید و پرداخت
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-primary transition-colors">
                  رویه‌های ارسال
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-primary transition-colors">
                  شرایط مرجوعی
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  ارتباط با پشتیبانی
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-white mb-5 text-lg">شرکت</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link to="/articles" className="hover:text-primary transition-colors">
                  مقاله
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-primary transition-colors">
                  فرصت‌های شغلی
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  قوانین و مقررات
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  حریم خصوصی
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="lg:col-span-2">
            {/* Social Icons */}
            <div className="flex items-center gap-4 mb-6">
              {settings.instagram_url && (
                <a 
                  href={settings.instagram_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.linkedin_url && (
                <a 
                  href={settings.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {settings.telegram_url && (
                <a 
                  href={settings.telegram_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Send className="w-5 h-5" />
                </a>
              )}
            </div>
            
            {settings.article_content && (
              <div className="mb-6">
                <h3 className="font-bold text-white mb-3 text-lg">مقالات و مطالب</h3>
                <div className="text-sm text-zinc-400 line-clamp-3 mb-2">
                  {settings.article_content.replace(/<[^>]*>/g, '')}
                </div>
                <Link to="/articles" className="text-primary text-sm hover:underline">
                  مشاهده مقالات
                </Link>
              </div>
            )}

            <p className="text-sm mb-4">ما را در شبکه‌های اجتماعی دنبال کنید!</p>

            {/* Support Info */}
            <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>{settings.support_hours}</span>
              </div>
              {settings.phone_numbers.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  <span dir="ltr">{settings.phone_numbers.join(' - ')}</span>
                </div>
              )}
              {settings.address && (
                <div className="text-sm text-zinc-400 mt-2">
                  {settings.address}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-10 pt-8 border-t border-zinc-800">
          {settings.enamad_code && (
            <a 
              href={`https://trustseal.enamad.ir/?id=${settings.enamad_code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-2 h-16 flex items-center justify-center hover:shadow-lg transition-shadow"
            >
              <img 
                src={`https://trustseal.enamad.ir/logo.aspx?id=${settings.enamad_code}`}
                alt="نماد اعتماد الکترونیکی"
                className="h-full object-contain"
              />
            </a>
          )}
          {settings.samandehi_code && (
            <a 
              href={`https://logo.samandehi.ir/Verify.aspx?id=${settings.samandehi_code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-2 h-16 flex items-center justify-center hover:shadow-lg transition-shadow"
            >
              <img 
                src={`https://logo.samandehi.ir/logo.aspx?id=${settings.samandehi_code}`}
                alt="نماد ساماندهی"
                className="h-full object-contain"
              />
            </a>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center text-xs text-zinc-500">
          <p>© ۱۴۰۳ {settings.site_name} - تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
