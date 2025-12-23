import { useState } from "react";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Layout from "@/components/shop/Layout";
import SEO from "@/components/SEO";
import { products as initialProducts, formatPrice, Product } from "@/data/products";

const Admin = () => {
  const [productsList] = useState<Product[]>(initialProducts);

  return (
    <Layout>
      <SEO title="پنل مدیریت" />
      
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">پنل مدیریت</h1>
            <p className="text-muted-foreground">مدیریت محصولات فروشگاه</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            افزودن محصول
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-6 rounded-xl border bg-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">کل محصولات</p>
                <p className="text-2xl font-bold">{productsList.length}</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl border bg-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <Package className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">موجود</p>
                <p className="text-2xl font-bold">{productsList.filter(p => p.inStock).length}</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl border bg-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent">
                <Package className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ویژه</p>
                <p className="text-2xl font-bold">{productsList.filter(p => p.featured).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>محصول</TableHead>
                <TableHead>دسته‌بندی</TableHead>
                <TableHead>قیمت</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead className="text-left">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsList.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${product.inStock ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
                      {product.inStock ? 'موجود' : 'ناموجود'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
