import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/shop/Layout";
import ProductCard from "@/components/shop/ProductCard";
import SEO from "@/components/SEO";
import { useCart } from "@/contexts/CartContext";
import { useSite } from "@/contexts/SiteContext";
import { formatPrice } from "@/components/shop/ProductCard";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, categories, purchaseEnabled, isLoading } = useSite();

  const product = products.find((p) => p.id === id);
  const category = product ? categories.find(c => c.id === product.category_id) : null;
  const relatedProducts = products
    .filter((p) => p.category_id === product?.category_id && p.id !== id)
    .slice(0, 3);

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="grid md:grid-cols-2 gap-8 animate-pulse">
            <div className="aspect-square bg-muted rounded-2xl" />
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-1/4" />
              <div className="h-10 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-32 bg-muted rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">محصول یافت نشد</h1>
          <Link to="/products">
            <Button>بازگشت به محصولات</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!purchaseEnabled) {
      toast.info("خرید در حال حاضر غیرفعال است");
      return;
    }
    addToCart(product);
    toast.success(`${product.name} به سبد خرید اضافه شد`);
  };

  const handleBuyNow = () => {
    if (!purchaseEnabled) {
      toast.info("خرید در حال حاضر غیرفعال است");
      return;
    }
    handleAddToCart();
    navigate("/checkout");
  };

  return (
    <Layout>
      <SEO
        title={product.name}
        description={product.description}
        image={product.image}
      />
      
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">خانه</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">محصولات</Link>
          {category && (
            <>
              <span>/</span>
              <Link to={`/products?category=${category.id}`} className="hover:text-primary">
                {category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            {hasDiscount && (
              <Badge className="absolute top-4 right-4 bg-destructive text-lg px-3 py-1">
                {discountPercent}% تخفیف
              </Badge>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{category?.name}</p>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} نظر)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.original_price!)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.in_stock ? (
                <>
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-green-500">موجود در انبار</span>
                </>
              ) : (
                <span className="text-destructive">ناموجود</span>
              )}
            </div>

            {/* Purchase Disabled Notice */}
            {!purchaseEnabled && (
              <div className="p-4 rounded-lg bg-muted border">
                <p className="text-muted-foreground text-sm flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  در حال حاضر امکان خرید فعال نیست. فقط مشاهده محصولات ممکن است.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              {purchaseEnabled ? (
                <>
                  <Button
                    size="lg"
                    className="flex-1 gap-2"
                    onClick={handleBuyNow}
                    disabled={!product.in_stock}
                  >
                    خرید فوری
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={handleAddToCart}
                    disabled={!product.in_stock}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    افزودن به سبد
                  </Button>
                </>
              ) : (
                <div className="flex-1 text-center">
                  <Button size="lg" variant="secondary" disabled className="w-full">
                    خرید غیرفعال است
                  </Button>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                ضمانت اصالت کالا
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                ارسال سریع
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                پشتیبانی ۲۴ ساعته
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                امکان مرجوعی
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">محصولات مرتبط</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
