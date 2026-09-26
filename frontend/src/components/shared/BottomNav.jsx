"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { House, LayoutGrid, ShoppingCart, User, LayoutDashboard, ShoppingBag, Package } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import useCart from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import useSettings from "@/hooks/useSettings";

export default function BottomNav({ onOpenMenu }) {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { user } = useAuth();
  const { contactPhone } = useSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rawNumber = contactPhone ? contactPhone.replace(/[^0-9]/g, "") : "01348060997";
  const whatsappNumber = rawNumber.startsWith("88")
    ? rawNumber
    : rawNumber.startsWith("0")
      ? `88${rawNumber}`
      : rawNumber;
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  const openCartDrawer = () => {
    window.dispatchEvent(new Event("open-cart-drawer"));
  };

  const isDashboard = pathname.startsWith("/dashboard");
  const isVendor = user?.role === "vendor";
  const dashboardHomePath = isVendor ? "/dashboard/vendor" : "/dashboard";

  const isHome = pathname === "/";
  const isCart = pathname === "/cart";
  const isAccount = pathname.startsWith("/dashboard") || pathname === "/login" || pathname === "/profile";

  if (isDashboard) {
    const isDashActive = pathname === "/dashboard" || pathname === "/dashboard/vendor";
    const isProdActive = pathname.startsWith("/dashboard/products");
    const isOrderActive = pathname.startsWith("/dashboard/orders");
    const isProfActive = pathname.startsWith("/dashboard/profile");

    return (
      <nav className="fixed bottom-0 left-0 right-0 z-90 lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] py-1.5 px-2">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-around px-2 sm:px-6 md:px-12">
          {/* 1. Dashboard */}
          <Link
            href={dashboardHomePath}
            className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] rounded-xl transition-all ${
              isDashActive
                ? "text-[#0B3C73] dark:text-[#FFA800] font-bold"
                : "text-slate-500 hover:text-[#0B3C73] dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <LayoutDashboard className={`size-5 transition-transform duration-200 ${isDashActive ? "scale-110 text-[#0B3C73] dark:text-[#FFA800]" : ""}`} />
            <span className="text-[10px] sm:text-[11px] mt-0.5 font-medium">Dashboard</span>
          </Link>

          {/* 2. Products */}
          <Link
            href="/dashboard/products"
            className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] rounded-xl transition-all ${
              isProdActive
                ? "text-[#0B3C73] dark:text-[#FFA800] font-bold"
                : "text-slate-500 hover:text-[#0B3C73] dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <ShoppingBag className={`size-5 transition-transform duration-200 ${isProdActive ? "scale-110 text-[#0B3C73] dark:text-[#FFA800]" : ""}`} />
            <span className="text-[10px] sm:text-[11px] mt-0.5 font-medium">Products</span>
          </Link>

          {/* 3. Orders */}
          <Link
            href="/dashboard/orders"
            className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] rounded-xl transition-all ${
              isOrderActive
                ? "text-[#0B3C73] dark:text-[#FFA800] font-bold"
                : "text-slate-500 hover:text-[#0B3C73] dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Package className={`size-5 transition-transform duration-200 ${isOrderActive ? "scale-110 text-[#0B3C73] dark:text-[#FFA800]" : ""}`} />
            <span className="text-[10px] sm:text-[11px] mt-0.5 font-medium">Orders</span>
          </Link>

          {/* 4. Menu (Sidebar Toggle) */}
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex flex-col items-center justify-center py-1 px-3 min-w-[56px] rounded-xl text-slate-500 hover:text-[#0B3C73] dark:text-slate-400 dark:hover:text-white transition-all cursor-pointer"
          >
            <LayoutGrid className="size-5" />
            <span className="text-[10px] sm:text-[11px] mt-0.5 font-medium">Menu</span>
          </button>

          {/* 5. Profile */}
          <Link
            href="/dashboard/profile"
            className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] rounded-xl transition-all ${
              isProfActive
                ? "text-[#0B3C73] dark:text-[#FFA800] font-bold"
                : "text-slate-500 hover:text-[#0B3C73] dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <User className={`size-5 transition-transform duration-200 ${isProfActive ? "scale-110 text-[#0B3C73] dark:text-[#FFA800]" : ""}`} />
            <span className="text-[10px] sm:text-[11px] mt-0.5 font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-90 lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] py-1.5 px-2">
      <div className="w-full max-w-4xl mx-auto flex items-center justify-around px-2 sm:px-6 md:px-12">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] rounded-xl transition-all ${
            isHome
              ? "text-[#0B3C73] dark:text-[#FFA800] font-bold"
              : "text-slate-500 hover:text-[#0B3C73] dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <House className={`size-5 transition-transform duration-200 ${isHome ? "scale-110 text-[#0B3C73] dark:text-[#FFA800]" : ""}`} />
          <span className="text-[10px] sm:text-[11px] mt-0.5 font-medium">Home</span>
        </Link>

        {/* 2. Menu */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1 px-3 min-w-[56px] rounded-xl text-slate-500 hover:text-[#0B3C73] dark:text-slate-400 dark:hover:text-white transition-all cursor-pointer"
        >
          <LayoutGrid className="size-5" />
          <span className="text-[10px] sm:text-[11px] mt-0.5 font-medium">Menu</span>
        </button>

        {/* 3. Cart */}
        <button
          type="button"
          onClick={openCartDrawer}
          className={`relative flex flex-col items-center justify-center py-1 px-3 min-w-[56px] rounded-xl transition-all cursor-pointer ${
            isCart
              ? "text-[#0B3C73] dark:text-[#FFA800] font-bold"
              : "text-slate-500 hover:text-[#0B3C73] dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <div className="relative">
            <ShoppingCart className={`size-5 transition-transform duration-200 ${isCart ? "scale-110 text-[#0B3C73] dark:text-[#FFA800]" : ""}`} />
            {mounted && cartCount > 0 && (
              <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FFA800] text-[#0B3C73] text-[9px] font-black px-1 shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] mt-0.5 font-medium">Cart</span>
        </button>

        {/* 4. Chat */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-3 min-w-[56px] rounded-xl text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-all"
        >
          <FaWhatsapp className="size-5 text-emerald-500" />
          <span className="text-[10px] sm:text-[11px] mt-0.5 font-medium">Chat</span>
        </a>

        {/* 5. Account */}
        <Link
          href={user ? (user.role === "vendor" ? "/dashboard/vendor" : "/dashboard") : "/login"}
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] rounded-xl transition-all ${
            isAccount
              ? "text-[#0B3C73] dark:text-[#FFA800] font-bold"
              : "text-slate-500 hover:text-[#0B3C73] dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <User className={`size-5 transition-transform duration-200 ${isAccount ? "scale-110 text-[#0B3C73] dark:text-[#FFA800]" : ""}`} />
          <span className="text-[10px] sm:text-[11px] mt-0.5 font-medium">Account</span>
        </Link>
      </div>
    </nav>
  );
}
