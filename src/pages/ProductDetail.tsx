import { useParams, useNavigate } from "react-router-dom";
import { useMenuData } from "@/hooks/useMenuData";
import { ChevronLeft, ShoppingBag, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 py-12">
    <Skeleton className="h-full w-screen  mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="flex flex-col gap-8">
        <div>
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-8 w-24 mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-32" />
        </div>
        <Skeleton className="h-14 w-full md:w-48" />
      </div>
    </div>
  </div>
);

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((state) => state.addItem);
  const { menuItems, loading, error } = useMenuData();
  const product = menuItems.find((item) => item.slug === slug);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={() => navigate("/")}
          className="text-primary hover:underline"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <button
          onClick={() => navigate("/")}
          className="text-primary hover:underline"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex-1"
    >
      <main className="max-w-7xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ChevronLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Menu
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="badge-category">{product.category}</span>
              {product.isNew && <span className="badge-new">New</span>}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-light text-foreground mb-4 tracking-tight leading-tight">
                {product.name}
              </h1>
              <div className="text-2xl font-light text-foreground mb-6">
                ${product.price.toFixed(2)}
              </div>
              <p className="text-neutral-500 text-md leading-relaxed max-w-lg">
                {product.description}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Quantity
              </label>
              <div className="flex items-center gap-4 w-fit border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-muted transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-muted transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-none text-sm font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity w-full md:w-fit"
            >
              <ShoppingBag size={18} />
              Add to Cart
            </button>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default ProductDetail;
