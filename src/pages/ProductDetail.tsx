import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowRight, Star, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/shop/Layout";
import ProductCard from "@/components/shop/ProductCard";
import SEO from "@/components/SEO";
import { products, formatPrice } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === id);
  const relatedProducts = products
    .filter((p) => p.category === product?.category && p.id !== id)
    .slice(0, 3);

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

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} به سبد خرید اضافه شد`);
  };

  const handleBuyNow = () => {
    addToCart(product);
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
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-primary">
            {product.category}
          </Link>
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
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
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
                    {formatPrice(product.originalPrice!)}
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
              {product.inStock ? (
                <>
                  <Check className="h-5 w-5 text-success" />
                  <span className="text-success">موجود در انبار</span>
                </>
              ) : (
                <span className="text-destructive">ناموجود</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="flex-1 gap-2"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                خرید فوری
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 gap-2"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5" />
                افزودن به سبد
              </Button>
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
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
