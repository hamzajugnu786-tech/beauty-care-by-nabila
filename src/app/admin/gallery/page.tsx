"use client";

// Force dynamic rendering
export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit3, Trash2, X, Save, Star, Upload, Image as ImageIcon,
  Grid, LayoutGrid, Eye, ToggleLeft, ToggleRight,
} from "lucide-react";
import { GALLERY_MASONRY_ITEMS, GALLERY_CATEGORIES } from "@/lib/constants";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  category: string;
  height: "tall" | "medium" | "short";
  featured: boolean;
  isActive: boolean;
}

const initialGallery: GalleryItem[] = GALLERY_MASONRY_ITEMS.map((g) => ({
  id: g.id,
  src: g.src,
  alt: g.alt,
  category: g.category,
  height: g.height,
  featured: false,
  isActive: true,
}));

const heightMap: Record<string, string> = {
  tall: "h-72",
  medium: "h-52",
  short: "h-36",
};

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("masonry");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const filtered = useMemo(() =>
    gallery.filter((g) => {
      const matchSearch = g.alt.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === "all" || g.category === categoryFilter;
      return matchSearch && matchCat;
    }),
    [gallery, search, categoryFilter]
  );

  const toggleFeatured = (id: number) =>
    setGallery(gallery.map((g) => (g.id === id ? { ...g, featured: !g.featured } : g)));

  const toggleActive = (id: number) =>
    setGallery(gallery.map((g) => (g.id === id ? { ...g, isActive: !g.isActive } : g)));

  const handleDelete = (id: number) =>
    setGallery(gallery.filter((g) => g.id !== id));

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;
      setIsUploading(true);
      for (const file of Array.from(files)) {
        try {
          const uploadForm = new FormData();
          uploadForm.append("file", file);
          uploadForm.append("folder", "nabila-gallery");
          uploadForm.append("title", file.name.replace(/\.[^/.]+$/, ""));
          uploadForm.append("category", categoryFilter !== "all" ? categoryFilter : "bridal");
          const res = await fetch("/api/cloudinary", { method: "POST", body: uploadForm });
          if (res.ok) {
            const data = await res.json();
            const newItem: GalleryItem = {
              id: Date.now() + Math.random(),
              src: data.url,
              alt: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
              category: categoryFilter !== "all" ? categoryFilter : "bridal",
              height: ["tall", "medium", "short"][Math.floor(Math.random() * 3)] as any,
              featured: false,
              isActive: true,
            };
            setGallery((prev) => [newItem, ...prev]);
          }
        } catch (err) {
          console.error("Upload failed:", err);
        }
      }
      setIsUploading(false);
    };
    input.click();
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-text-primary">Gallery</h1>
          <p className="text-text-muted text-sm mt-1">{gallery.length} images &middot; {gallery.filter((g) => g.featured).length} featured</p>
        </div>
        <button onClick={handleUpload} disabled={isUploading}
          className="px-5 py-2.5 bg-champagne-gold hover:bg-champagne-gold/90 text-matte-black font-semibold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-champagne-gold/20 transition-all disabled:opacity-50">
          <Upload className="w-4 h-4" /> {isUploading ? "Uploading..." : "Upload Images"}
        </button>
      </motion.div>

      {/* Search + Filters + View Mode */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="text" placeholder="Search images..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-champagne-gold/30 transition-all" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {GALLERY_CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                categoryFilter === cat.id ? "bg-champagne-gold text-matte-black" : "bg-dark-elevated text-text-muted hover:text-text-primary"
              }`}>
              {cat.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-dark-elevated rounded-lg p-1">
          <button onClick={() => setViewMode("masonry")} className={`p-1.5 rounded ${viewMode === "masonry" ? "bg-champagne-gold/20 text-champagne-gold" : "text-text-muted"}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded ${viewMode === "grid" ? "bg-champagne-gold/20 text-champagne-gold" : "text-text-muted"}`}>
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Upload Zone */}
      <motion.div variants={item}
        className="border-2 border-dashed border-border-gold/20 rounded-2xl p-8 text-center hover:border-champagne-gold/40 transition-all cursor-pointer group"
        onClick={handleUpload}>
        <div className="w-12 h-12 rounded-2xl bg-champagne-gold/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-champagne-gold/20 transition-colors">
          <Upload className="w-6 h-6 text-champagne-gold" />
        </div>
        <p className="text-sm text-text-primary mb-1">Drop images here or click to upload</p>
        <p className="text-xs text-text-muted">PNG, JPG, WebP up to 10MB &middot; Cloudinary auto-optimization</p>
      </motion.div>

      {/* Gallery Grid */}
      <motion.div variants={item}>
        {viewMode === "masonry" ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3">
            {filtered.map((img) => (
              <motion.div key={img.id} layout
                className={`relative group break-inside-avoid rounded-xl overflow-hidden cursor-pointer border ${
                  img.featured ? "border-champagne-gold/30" : "border-border-gold/10"
                } ${!img.isActive ? "opacity-40" : ""}`}
                onClick={() => setSelectedItem(img)}>
                {/* Image or Placeholder */}
                <div className={`${heightMap[img.height]} bg-gradient-to-br from-dark-elevated to-dark-card flex items-center justify-center overflow-hidden`}>
                  {img.src && !img.src.startsWith("/images") ? (
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-text-muted/20" />
                  )}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-matte-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-xs text-text-primary font-medium">{img.alt}</p>
                    <p className="text-[10px] text-text-muted capitalize">{img.category}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); toggleFeatured(img.id); }}
                      className="p-1.5 bg-matte-black/60 backdrop-blur-sm rounded-lg">
                      <Star className={`w-3.5 h-3.5 ${img.featured ? "fill-champagne-gold text-champagne-gold" : "text-text-muted"}`} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                      className="p-1.5 bg-matte-black/60 backdrop-blur-sm rounded-lg">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Featured Badge */}
                {img.featured && (
                  <div className="absolute top-2 left-2">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-champagne-gold/90 text-matte-black text-[9px] font-semibold">
                      <Star className="w-2.5 h-2.5" fill="currentColor" /> Featured
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map((img) => (
              <motion.div key={img.id} layout
                className={`relative group rounded-xl overflow-hidden cursor-pointer border aspect-square ${
                  img.featured ? "border-champagne-gold/30" : "border-border-gold/10"
                } ${!img.isActive ? "opacity-40" : ""}`}
                onClick={() => setSelectedItem(img)}>
                <div className="w-full h-full bg-gradient-to-br from-dark-elevated to-dark-card flex items-center justify-center overflow-hidden">
                  {img.src && !img.src.startsWith("/images") ? (
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-text-muted/20" />
                  )}
                </div>
                <div className="absolute inset-0 bg-matte-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button className="p-2 bg-dark-surface/80 rounded-lg"><Eye className="w-4 h-4 text-text-primary" /></button>
                  <button onClick={(e) => { e.stopPropagation(); toggleFeatured(img.id); }}
                    className="p-2 bg-dark-surface/80 rounded-lg"><Star className={`w-4 h-4 ${img.featured ? "fill-champagne-gold text-champagne-gold" : "text-text-muted"}`} /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                    className="p-2 bg-dark-surface/80 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <ImageIcon className="w-10 h-10 text-text-muted/30 mx-auto mb-3" />
            <p className="text-text-muted">No images found</p>
          </div>
        )}
      </motion.div>

      {/* ─── Detail Drawer ─── */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50" onClick={() => setSelectedItem(null)} />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-dark-surface border-l border-border-gold/10 z-50 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-serif text-text-primary">Image Details</h2>
                  <button onClick={() => setSelectedItem(null)} className="p-2 text-text-muted hover:text-text-primary"><X className="w-5 h-5" /></button>
                </div>

                {/* Preview */}
                <div className="aspect-video rounded-xl bg-dark-card border border-border-gold/10 flex items-center justify-center mb-6 overflow-hidden">
                  {selectedItem.src && !selectedItem.src.startsWith("/images") ? (
                    <img src={selectedItem.src} alt={selectedItem.alt} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-16 h-16 text-text-muted/20" />
                  )}
                </div>

                {/* Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Alt Text</p>
                    <p className="text-sm text-text-primary">{selectedItem.alt}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Category</p>
                      <p className="text-sm text-text-primary capitalize">{selectedItem.category}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Height</p>
                      <p className="text-sm text-text-primary capitalize">{selectedItem.height}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Source</p>
                    <p className="text-sm text-text-muted font-mono break-all">{selectedItem.src}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-2">
                  <button onClick={() => { toggleFeatured(selectedItem.id); setSelectedItem({ ...selectedItem, featured: !selectedItem.featured }); }}
                    className={`w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                      selectedItem.featured
                        ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                        : "bg-champagne-gold/10 border border-champagne-gold/20 text-champagne-gold"
                    }`}>
                    <Star className={`w-4 h-4 ${selectedItem.featured ? "fill-current" : ""}`} />
                    {selectedItem.featured ? "Remove from Featured" : "Mark as Featured"}
                  </button>
                  <button onClick={() => { toggleActive(selectedItem.id); setSelectedItem({ ...selectedItem, isActive: !selectedItem.isActive }); }}
                    className="w-full py-2.5 bg-dark-elevated border border-border-gold/10 rounded-xl text-sm text-text-primary flex items-center justify-center gap-2 hover:border-champagne-gold/20 transition-all">
                    {selectedItem.isActive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
                    {selectedItem.isActive ? "Active" : "Inactive"}
                  </button>
                  <button onClick={() => { handleDelete(selectedItem.id); setSelectedItem(null); }}
                    className="w-full py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all">
                    <Trash2 className="w-4 h-4" /> Delete Image
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
