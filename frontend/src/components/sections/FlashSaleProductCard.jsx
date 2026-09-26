"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from "react";

import { motion } from "framer-motion";
import { Zap, Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatBDT } from "@/utils/currency";
import OrderModal from "@/components/ui/OrderModal";
import ProductImageModal from "@/components/ui/ProductImageModal";
import { useAuth } from "@/hooks/useAuth";
import { useAddToCart } from "@/hooks/useAddToCart";
import useSettings from "@/hooks/useSettings";

function StockBar({ stock, maxStock }) {
  const percentage = maxStock > 0 ? Math.min((stock / maxStock) * 100, 100) : 0;
  const isLow = percentage <= 25;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          {stock} left
        </span>
        <span className="text-[11px] text-muted-foreground">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isLow ? "bg-foreground" : "bg-primary"
            }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function FlashSaleProductCard({ product, index, maxStock }) {
  const router = useRouter();
  const { addToCart } = useAddToCart();
  const { siteName } = useSettings();
  const [showImageModal, setShowImageModal] = useState(false);
  const { user } = useAuth();
  const isAdminOrVendor = user?.role === "admin" || user?.role === "vendor";
  const hasDiscount = product.discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  const isOutOfStock = product.stock === 0;
  const sizeMeasurementSizes = Array.isArray(product.sizeMeasurements)
    ? product.sizeMeasurements.map(sm => typeof sm === 'string' ? sm : sm?.size).filter(Boolean)
    : [];
  const hasOptions =
    (Array.isArray(product.sizes) && product.sizes.length > 0) ||
    sizeMeasurementSizes.length > 0 ||
    (Array.isArray(product.colors) && product.colors.length > 0) ||
    (Array.isArray(product.variants) && product.variants.length > 0) ||
    (product.attributes && typeof product.attributes === "object" && Object.entries(product.attributes).some(([k, v]) => Array.isArray(v) && v.length > 0));

  const handleDirectAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasOptions) {
      router.push(`/product/${product._id}`);
      return;
    }
    addToCart(product, 1);
  };

  const handleDirectOrderNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasOptions) {
      router.push(`/product/${product._id}`);
      return;
    }
    addToCart(product, 1);
    router.push("/checkout");
  };

  const handleOpenImageModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowImageModal(true);
  };

  return (
    <>
      <motion.div
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          }),
        }}
        className="w-[270px] max-w-full h-auto mx-auto"
      >
        <div className="group flex h-auto w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          <Link href={`/product/${product._id}`} className="relative h-[180px] w-full overflow-hidden bg-muted/40 block shrink-0 p-2 flex items-center justify-center group/img">
            <img
              src={product.thumbnail || product.images?.[0] || undefined}
              alt={product.title}
              className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-120 group-hover:drop-shadow-md"
              loading="lazy"
            />

            {/* Quick View Side Eye Button */}
            <button
              type="button"
              onClick={handleOpenImageModal}
              className="absolute bottom-2 right-2 z-20 flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur-md hover:bg-primary hover:text-primary-foreground active:scale-90 transition-all duration-300 opacity-0 group-hover/img:opacity-100 transform translate-y-2 group-hover/img:translate-y-0 cursor-pointer border border-border/60"
              title="Enlarge Image"
            >
              <Eye className="size-4" />
            </button>

            {hasDiscount && (
              <div className="absolute left-2 top-2 z-10 rounded-full badge-gold px-2 py-0.5 text-[10px] font-black tracking-tight shadow-sm">
                -{Math.round(product.discountPercentage)}%
              </div>
            )}

            {product.stock <= 5 && product.stock > 0 && (
              <div className="absolute right-2 top-2 z-10">
                <Badge variant="secondary" className="text-[9px] font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200">
                  Only {product.stock} left
                </Badge>
              </div>
            )}

            {product.stock === 0 && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur-xs">
                <Badge variant="destructive" className="text-[9px] font-semibold px-2 py-0.5">
                  Out of Stock
                </Badge>
              </div>
            )}
          </Link>

          <div className="flex flex-1 flex-col justify-between p-3 bg-card shrink-0 gap-2">
            <div className="space-y-1">
              {/* Shop Name */}
              <div className="mb-0.5">
                <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  {product.shopName || product.shop?.name || siteName}
                </span>
              </div>
              
              <Link href={`/product/${product._id}`} className="block">
                <h3 className="line-clamp-1 text-xs font-bold text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors">
                  {product.title}
                </h3>
              </Link>

              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-xs font-extrabold text-primary dark:text-accent">
                  {formatBDT(hasDiscount ? discountedPrice : product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-[9px] text-muted-foreground line-through font-normal">
                    {formatBDT(product.price)}
                  </span>
                )}
              </div>
              
              {/* Stock Progress Bar */}
              <div className="mt-1 space-y-1">
                <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-muted-foreground font-medium">
                  <span>{product.stock || 0} left</span>
                  <span>{Math.round(Math.min(((product.stock || 0) / (maxStock || product.maxStock || 100)) * 100, 100))}%</span>
                </div>
                <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500" 
                    style={{ width: `${Math.round(Math.min(((product.stock || 0) / (maxStock || product.maxStock || 100)) * 100, 100))}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-0.5">
              <button
                disabled={isOutOfStock || isAdminOrVendor}
                onClick={handleDirectOrderNow}
                title={isAdminOrVendor ? "Admins cannot purchase" : "Order Now"}
                className={`w-full flex items-center justify-center gap-1 rounded-full btn-action-gold py-1.5 px-3 text-[10px] sm:text-xs font-extrabold transition-all duration-200 active:scale-[0.98] ${isOutOfStock || isAdminOrVendor ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} shadow-xs`}
              >
                <Zap className="size-3.5 fill-current shrink-0" />
                <span>{isOutOfStock ? "Unavailable" : "Order Now"}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <ProductImageModal
        open={showImageModal}
        onClose={() => setShowImageModal(false)}
        image={product.thumbnail || product.images?.[0]}
        images={product.images && product.images.length > 0 ? product.images : [product.thumbnail].filter(Boolean)}
        title={product.title}
      />
    </>
  );
}
