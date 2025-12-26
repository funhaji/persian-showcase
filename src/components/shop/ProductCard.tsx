import { Link } from "react-router-dom";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useSite } from "@/contexts/SiteContext";
import { toast } from "sonner";
import type { Product } from "@/types/database";

interface ProductCardProps {
  product: Product;
}

export const formatPrice = (price: number): string => {
  return price.toLocaleString("fa-IR") + " تومان";
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { purchaseEnabled, categories } = useSite();
  
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  const category = categories.find(c => c.id === product.category_id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!purchaseEnabled) {
      toast.info("خرید در حال حاضر غیرفعال است");
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.original_price || undefined,
      image: product.image,
      category: category?.name || '',
      rating: product.rating,
      reviews: product.reviews,
      inStock: product.in_stock,
      featured: product.featured,
    });
    toast.success(`${product.name} به سبد خرید اضافه شد`);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {hasDiscount && (
          <Badge className="absolute top-3 right-3 bg-destructive">
            {discountPercent}% تخفیف
          </Badge>
        )}
        {product.featured && !hasDiscount && (
          <Badge className="absolute top-3 right-3 bg-primary">
            ویژه
          </Badge>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="text-destructive font-bold">ناموجود</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{category?.name}</p>
          <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews} نظر)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-primary">{formatPrice(product.price)}</p>
            {hasDiscount && (
              <p className="text-xs text-muted-foreground line-through">
                {formatPrice(product.original_price!)}
              </p>
            )}
          </div>
          {purchaseEnabled ? (
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
