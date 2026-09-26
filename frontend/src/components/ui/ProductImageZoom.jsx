"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, X, Move } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductImageZoom({ src, alt, discountBadge }) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(2.5);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showLightbox, setShowLightbox] = useState(false);

  // Reset zoom & pan when image changes
  useEffect(() => {
    setIsZoomed(false);
    setIsHovered(false);
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(2.5);
  }, [src]);

  // Handle Mouse Move for Hover Zoom
  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current) return;
      if (isDragging) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        setDragStart({ x: e.clientX, y: e.clientY });
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setMousePos({ x, y });
    },
    [isDragging, dragStart]
  );

  // Mouse Drag handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Drag Handlers for Mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - dragStart.x;
      const dy = e.touches[0].clientY - dragStart.y;
      setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setIsZoomed(true);
    setZoomLevel((prev) => Math.min(prev + 0.5, 4.5));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setZoomLevel((prev) => {
      const next = prev - 0.5;
      if (next <= 1) {
        setIsZoomed(false);
        setPanOffset({ x: 0, y: 0 });
        return 2.5;
      }
      return next;
    });
  };

  const handleResetZoom = (e) => {
    if (e) e.stopPropagation();
    setIsZoomed(false);
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(2.5);
  };

  const activeScale = isZoomed ? zoomLevel : isHovered ? zoomLevel : 1;
  const transformOrigin = `${mousePos.x}% ${mousePos.y}%`;

  return (
    <>
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (!isZoomed) setPanOffset({ x: 0, y: 0 });
          setIsDragging(false);
        }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`group relative overflow-hidden rounded-2xl border border-border bg-secondary/30 select-none ${
          isDragging
            ? "cursor-grabbing"
            : isZoomed || isHovered
            ? "cursor-grab"
            : "cursor-crosshair"
        }`}
      >
        {/* Main Image Container */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
          <img
            src={src}
            alt={alt || "Product image"}
            draggable={false}
            className="h-full w-full object-cover transition-transform duration-150 ease-out will-change-transform"
            style={{
              transform: `scale(${activeScale}) translate(${panOffset.x / activeScale}px, ${
                panOffset.y / activeScale
              }px)`,
              transformOrigin: isZoomed && (panOffset.x !== 0 || panOffset.y !== 0) ? "center center" : transformOrigin,
            }}
          />
        </div>

        {/* Discount Badge */}
        {discountBadge && (
          <div className="absolute left-3 top-3 z-10 pointer-events-none badge-gold px-2.5 py-1 text-xs sm:text-sm shadow-xs">
            {discountBadge}
          </div>
        )}

        {/* Floating Controls Overlay (Visible on Hover & Mobile) */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 p-1.5 shadow-md backdrop-blur-md transition-opacity duration-200 opacity-90 group-hover:opacity-100">
          <button
            type="button"
            onClick={handleZoomIn}
            className="flex size-7 items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="size-4" />
          </button>

          <button
            type="button"
            onClick={handleZoomOut}
            className="flex size-7 items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="size-4" />
          </button>

          {(isZoomed || panOffset.x !== 0 || panOffset.y !== 0) && (
            <button
              type="button"
              onClick={handleResetZoom}
              className="flex size-7 items-center justify-center rounded-full text-destructive hover:bg-destructive/10 transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="size-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowLightbox(true);
            }}
            className="flex size-7 items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors"
            title="Fullscreen Inspection"
          >
            <Maximize2 className="size-3.5" />
          </button>
        </div>

        {/* Helper Hint Tag */}
        {(isHovered || isZoomed) && (
          <div className="absolute top-3 right-3 z-20 pointer-events-none rounded-full border border-border/40 bg-background/70 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground backdrop-blur-xs shadow-xs hidden sm:flex items-center gap-1">
            <Move className="size-3 text-primary" />
            <span>{isZoomed ? "Drag to pan" : "Hover to zoom"}</span>
          </div>
        )}
      </div>

      {/* Fullscreen Inspection Lightbox Modal */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md select-none"
            onClick={() => setShowLightbox(false)}
          >
            <div
              className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={src}
                alt={alt}
                draggable={false}
                className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl shadow-2xl"
              />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowLightbox(false)}
                className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-background/80 text-foreground shadow-lg backdrop-blur-md hover:bg-background transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
