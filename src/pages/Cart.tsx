import { Link, Navigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/shop/Layout";
import SEO from "@/components/SEO";
import { useCart } from "@/contexts/CartContext";
import { useSite } from "@/contexts/SiteContext";
import { formatPrice } from "@/components/shop/ProductCard";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { purchaseEnabled } = useSite();

  // Redirect if purchase is disabled
  if (!purchaseEnabled) {
    return (
      <Layout>
        <SEO title="سبد خرید" />
        <div className="container py-20 text-center">
          <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl font-bold mb-4">خرید در حال حاضر غیرفعال است</h1>
          <p className="text-muted-foreground mb-8">
            در حال حاضر فقط امکان مشاهده محصولات وجود دارد.
          </p>
          <Link to="/products">
            <Button size="lg" className="gap-2">
              مشاهده محصولات
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <SEO title="سبد خرید" />
        <div className="container py-20 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl font-bold mb-4">سبد خرید شما خالی است</h1>
          <p className="text-muted-foreground mb-8">
            محصولات مورد علاقه خود را به سبد خرید اضافه کنید.
          </p>
          <Link to="/products">
            <Button size="lg" className="gap-2">
              مشاهده محصولات
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="سبد خرید" />
      
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">سبد خرید</h1>
          <Button variant="ghost" size="sm" onClick={clearCart}>
            پاک کردن سبد
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-xl border bg-card"
              >
                <Link to={`/product/${item.id}`} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/product/${item.id}`}
                        className="font-semibold hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="font-bold text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-xl border bg-card space-y-4">
              <h2 className="text-xl font-bold">خلاصه سفارش</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">جمع محصولات</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">هزینه ارسال</span>
                  <span className="text-green-500">رایگان</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>مجموع</span>
                  <span className="text-primary">{formatPrice(totalPrice)}</span>
                </div>
              </div>
              
              <Link to="/checkout" className="block">
                <Button size="lg" className="w-full gap-2">
                  ادامه خرید
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              
              <Link to="/products">
                <Button variant="outline" size="lg" className="w-full">
                  ادامه خرید از فروشگاه
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
