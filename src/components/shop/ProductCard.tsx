import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, formatPrice } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
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
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
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
                {formatPrice(product.originalPrice!)}
              </p>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
