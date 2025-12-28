import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { SiteProvider } from "@/contexts/SiteContext";
import { CartProvider } from "@/contexts/CartContext";

// Pages
import Index from "@/pages/Index";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Admin from "@/pages/Admin";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import Articles from "@/pages/Articles";
import ArticleDetail from "@/pages/ArticleDetail";

function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticleDetail />} />
            {/* Add other routes as needed */}
            <Route path="*" element={<Index />} />
          </Routes>
          <Toaster />
        </CartProvider>
      </SiteProvider>
    </BrowserRouter>
  );
}

export default App;
