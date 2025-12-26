import serumImg from "@/assets/products/serum.png";
import moisturizerImg from "@/assets/products/moisturizer.png";
import maskImg from "@/assets/products/mask.png";
import lipstickImg from "@/assets/products/lipstick.png";
import eyeshadowImg from "@/assets/products/eyeshadow.png";
import sunscreenImg from "@/assets/products/sunscreen.png";

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
    name: "سرم ویتامین C",
    description: "سرم روشن کننده و ضد لک با ۲۰٪ ویتامین سی خالص. مناسب برای انواع پوست.",
    price: 890000,
    originalPrice: 1100000,
    image: serumImg,
    category: "مراقبت پوست",
    rating: 4.8,
    reviews: 245,
    inStock: true,
    featured: true,
  },
  {
    id: "2",
    name: "کرم مرطوب کننده",
    description: "کرم مرطوب کننده عمقی با اسید هیالورونیک. آبرسانی ۲۴ ساعته برای پوست خشک.",
    price: 750000,
    image: moisturizerImg,
    category: "مراقبت پوست",
    rating: 4.9,
    reviews: 189,
    inStock: true,
    featured: true,
  },
  {
    id: "3",
    name: "ماسک صورت کلاژن",
    description: "ماسک ورقه‌ای حاوی کلاژن و عصاره گل رز. سفت کننده و جوان کننده پوست.",
    price: 120000,
    originalPrice: 150000,
    image: maskImg,
    category: "ماسک صورت",
    rating: 4.6,
    reviews: 312,
    inStock: true,
  },
  {
    id: "4",
    name: "رژ لب مایع مات",
    description: "رژ لب مایع با ماندگاری بالا و فرمول سبک. رنگ یکدست و بدون خشکی.",
    price: 450000,
    image: lipstickImg,
    category: "آرایش لب",
    rating: 4.7,
    reviews: 178,
    inStock: true,
    featured: true,
  },
  {
    id: "5",
    name: "پالت سایه چشم",
    description: "پالت ۱۲ رنگ با ترکیب مات و شاین. پیگمنت قوی و ماندگاری عالی.",
    price: 680000,
    originalPrice: 820000,
    image: eyeshadowImg,
    category: "آرایش چشم",
    rating: 4.5,
    reviews: 156,
    inStock: true,
  },
  {
    id: "6",
    name: "ضد آفتاب SPF50",
    description: "کرم ضد آفتاب با SPF50 و PA+++. بدون چربی و مناسب زیر آرایش.",
    price: 520000,
    image: sunscreenImg,
    category: "مراقبت پوست",
    rating: 4.8,
    reviews: 298,
    inStock: true,
  },
];

export const categories = [
  { id: "all", name: "همه" },
  { id: "مراقبت پوست", name: "مراقبت پوست" },
  { id: "آرایش لب", name: "آرایش لب" },
  { id: "آرایش چشم", name: "آرایش چشم" },
  { id: "ماسک صورت", name: "ماسک صورت" },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
};