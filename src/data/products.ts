import smartwatchImg from "@/assets/products/smartwatch.png";
import headphonesImg from "@/assets/products/headphones.png";
import backpackImg from "@/assets/products/backpack.png";
import lampImg from "@/assets/products/lamp.png";
import sunglassesImg from "@/assets/products/sunglasses.png";
import walletImg from "@/assets/products/wallet.png";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "ساعت هوشمند کلاسیک",
    description: "ساعت هوشمند با بدنه تیتانیوم مشکی و بند چرمی اصل. مناسب برای استفاده روزمره و ورزش.",
    price: 4500000,
    originalPrice: 5200000,
    image: smartwatchImg,
    category: "الکترونیک",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    featured: true,
  },
  {
    id: "2",
    name: "هدفون بی‌سیم پرمیوم",
    description: "هدفون با کیفیت صدای استودیویی و قابلیت حذف نویز فعال. باتری با دوام بالا.",
    price: 3200000,
    image: headphonesImg,
    category: "الکترونیک",
    rating: 4.9,
    reviews: 89,
    inStock: true,
    featured: true,
  },
  {
    id: "3",
    name: "کوله پشتی چرمی",
    description: "کوله پشتی از جنس چرم طبیعی با طراحی مینیمال. دارای جیب‌های متعدد و فضای مناسب.",
    price: 2800000,
    originalPrice: 3100000,
    image: backpackImg,
    category: "کیف و کفش",
    rating: 4.6,
    reviews: 56,
    inStock: true,
  },
  {
    id: "4",
    name: "چراغ رومیزی مدرن",
    description: "چراغ رومیزی با پایه سنگ مرمر و بدنه برنجی. نور گرم و دلنشین برای فضای کار.",
    price: 1950000,
    image: lampImg,
    category: "دکوراسیون",
    rating: 4.7,
    reviews: 42,
    inStock: true,
    featured: true,
  },
  {
    id: "5",
    name: "عینک آفتابی طلایی",
    description: "عینک آفتابی با فریم طلایی و عدسی‌های UV400. طراحی شیک و کلاسیک.",
    price: 1650000,
    originalPrice: 1900000,
    image: sunglassesImg,
    category: "اکسسوری",
    rating: 4.5,
    reviews: 78,
    inStock: true,
  },
  {
    id: "6",
    name: "کیف پول چرم طبیعی",
    description: "کیف پول مردانه از چرم طبیعی با رنگ قهوه‌ای. دارای جای کارت و پول نقد.",
    price: 890000,
    image: walletImg,
    category: "کیف و کفش",
    rating: 4.4,
    reviews: 112,
    inStock: true,
  },
];

export const categories = [
  { id: "all", name: "همه" },
  { id: "الکترونیک", name: "الکترونیک" },
  { id: "کیف و کفش", name: "کیف و کفش" },
  { id: "دکوراسیون", name: "دکوراسیون" },
  { id: "اکسسوری", name: "اکسسوری" },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
};
