import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">ف</span>
              </div>
              <span className="text-xl font-bold">فروشگاه</span>
            </div>
            <p className="text-sm text-muted-foreground">
              فروشگاه آنلاین با بهترین محصولات و قیمت‌های رقابتی. ارسال سریع به سراسر کشور.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">دسترسی سریع</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">
                  محصولات
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary transition-colors">
                  سبد خرید
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-primary transition-colors">
                  پنل مدیریت
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">دسته‌بندی‌ها</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/products?category=الکترونیک" className="hover:text-primary transition-colors">
                  الکترونیک
                </Link>
              </li>
              <li>
                <Link to="/products?category=کیف و کفش" className="hover:text-primary transition-colors">
                  کیف و کفش
                </Link>
              </li>
              <li>
                <Link to="/products?category=دکوراسیون" className="hover:text-primary transition-colors">
                  دکوراسیون
                </Link>
              </li>
              <li>
                <Link to="/products?category=اکسسوری" className="hover:text-primary transition-colors">
                  اکسسوری
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">تماس با ما</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</li>
              <li>ایمیل: info@foroshgah.ir</li>
              <li>آدرس: تهران، خیابان آزادی</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© ۱۴۰۳ فروشگاه. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
