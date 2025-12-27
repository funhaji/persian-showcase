import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/shop/Layout";
import SEO from "@/components/SEO";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/components/shop/ProductCard";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSuccess(true);
    clearCart();
  };

  if (isSuccess) {
    return (
      <Layout>
        <SEO title="سفارش موفق" />
        <div className="container py-20">
          <div className="max-w-md mx-auto text-center animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">سفارش با موفقیت ثبت شد!</h1>
            <p className="text-muted-foreground mb-8">
              از خرید شما متشکریم. اطلاعات سفارش به شماره موبایل شما ارسال خواهد شد.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button size="lg">بازگشت به صفحه اصلی</Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline">ادامه خرید</Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <Layout>
      <SEO title="تکمیل سفارش" />
      
      <div className="container py-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به سبد خرید
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <h1 className="text-3xl font-bold mb-8">اطلاعات تحویل</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">نام</Label>
                  <Input id="firstName" required placeholder="علی" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">نام خانوادگی</Label>
                  <Input id="lastName" required placeholder="محمدی" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">شماره موبایل</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  dir="ltr"
                  className="text-left"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">ایمیل (اختیاری)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  dir="ltr"
                  className="text-left"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="province">استان</Label>
                  <Input id="province" required placeholder="تهران" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">شهر</Label>
                  <Input id="city" required placeholder="تهران" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">آدرس کامل</Label>
                <Textarea
                  id="address"
                  required
                  placeholder="خیابان، کوچه، پلاک، واحد"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">کد پستی</Label>
                <Input
                  id="postalCode"
                  required
                  placeholder="۱۲۳۴۵۶۷۸۹۰"
                  dir="ltr"
                  className="text-left"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">توضیحات (اختیاری)</Label>
                <Textarea
                  id="note"
                  placeholder="توضیحات تکمیلی برای ارسال سفارش"
                  rows={2}
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "در حال پردازش..." : "ثبت سفارش"}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-24 p-6 rounded-xl border bg-card space-y-6">
              <h2 className="text-xl font-bold">خلاصه سفارش</h2>
              
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} عدد
                      </p>
                      <p className="text-sm font-medium text-primary">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">جمع محصولات</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">هزینه ارسال</span>
                  <span className="text-green-500">رایگان</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>مجموع</span>
                  <span className="text-primary">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
