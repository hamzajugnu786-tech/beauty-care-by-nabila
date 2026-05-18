"use client";

// Force dynamic rendering
export const dynamic = "force-dynamic";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit3, Trash2, X, Save, Star, Upload, Image as ImageIcon,
  Grid, LayoutGrid, Eye, ToggleLeft, ToggleRight, RefreshCw, CheckCircle,
} from "lucide-react";
import { GALLERY_CATEGORIES } from "@/lib/constants";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  height: "tall" | "medium" | "short";
  featured: boolean;
  isActive: boolean;
  cloudinaryId?: string;
}

const emptyGalleryItem: GalleryItem = {
  id: "",
  src: "",
  alt: "",
  category: "general",
  height: "medium",
  featured: false,
  isActive: true,
  cloudinaryId: "",
};

const heightMap: Record<string, string> = {
  tall: "h-72",
  medium: "h-52",
  short: "h-36",
};

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("masonry");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Edit modal state
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<GalleryItem>(emptyGalleryItem);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Fetch gallery items from API
  const fetchGallery = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      if (res.ok) {
        const data = await res.json();
        const items: GalleryItem[] = (data.items || []).map((item: Record<string, unknown>) => ({
          id: item.id as string,
          src: (item.src as string) || "",
          alt: (item.alt as string) || "Gallery image",
          category: (item.category as string) || "general",
          height: ((item.height as string) || "medium") as "tall" | "medium" | "short",
          featured: (item.featured as boolean) || false,
          isActive: item.isActive !== undefined ? (item.isActive as boolean) : true,
          cloudinaryId: (item.cloudinaryId as string) || "",
        }));

        if (items.length > 0) {
          setGallery(items);
        } else {
          // Fallback: fetch from public Cloudinary API
          const publicRes = await fetch("/api/gallery");
          if (publicRes.ok) {
            const publicData = await publicRes.json();
            const cloudinaryItems: GalleryItem[] = (publicData.images || []).map(
              (img: Record<string, unknown>, index: number) => ({
                id: (img.id as string) || `cloud-${index}`,
                src: (img.src as string) || "",
                alt: (img.alt as string) || "Gallery image",
                category: (img.category as string) || "general",
                height: ((img.height as string) || "medium") as "tall" | "medium" | "short",
                featured: (img.featured as boolean) || false,
                isActive: true,
                cloudinaryId: (img.id as string) || "",
              })
            );
            setGallery(cloudinaryItems);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
  };

  const filtered = useMemo(() =>
    gallery.filter((g) => {
      const matchSearch = g.alt.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === "all" || g.category === categoryFilter;
      return matchSearch && matchCat;
    }),
    [gallery, search, categoryFilter]
  );

  // ─── Toggle featured ───
  const toggleFeatured = async (id: string) => {
    const gItem = gallery.find((g) => g.id === id);
    if (!gItem) return;

    const newFeatured = !gItem.featured;
    setGallery(gallery.map((g) => (g.id === id ? { ...g, featured: newFeatured } : g)));

    // Also update selected item if it's the same
    if (selectedItem?.id === id) {
      setSelectedItem({ ...selectedItem, featured: newFeatured });
    }

    try {
      await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: id, data: { featured: newFeatured } }),
      });
    } catch (err) {
      console.error("Failed to toggle featured:", err);
    }
  };

  // ─── Toggle active ───
  const toggleActive = async (id: string) => {
    const gItem = gallery.find((g) => g.id === id);
    if (!gItem) return;

    const newActive = !gItem.isActive;
    setGallery(gallery.map((g) => (g.id === id ? { ...g, isActive: newActive } : g)));

    if (selectedItem?.id === id) {
      setSelectedItem({ ...selectedItem, isActive: newActive });
    }

    try {
      await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: id, data: { isActive: newActive } }),
      });
    } catch (err) {
      console.error("Failed to toggle active:", err);
    }
  };

  // ─── Delete ───
  const handleDelete = async (id: string) => {
    setGallery(gallery.filter((g) => g.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);

    try {
      await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: id }),
      });
      showNotification("success", "Image deleted successfully");
    } catch (err) {
      console.error("Failed to delete:", err);
      showNotification("error", "Failed to delete image");
    }
  };

  // ─── Upload new images ───
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
            // Save to database via admin API
            const saveRes = await fetch("/api/admin/gallery", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                src: data.url,
                alt: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
                category: categoryFilter !== "all" ? categoryFilter : "bridal",
                height: ["tall", "medium", "short"][Math.floor(Math.random() * 3)],
                featured: false,
                isActive: true,
                cloudinaryId: data.publicId || "",
              }),
            });
            if (saveRes.ok) {
              const savedItem = await saveRes.json();
              if (savedItem.item) {
                const newItem: GalleryItem = {
                  id: savedItem.item.id,
                  src: data.url,
                  alt: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
                  category: categoryFilter !== "all" ? categoryFilter : "bridal",
                  height: savedItem.item.height || "medium",
                  featured: false,
                  isActive: true,
                  cloudinaryId: data.publicId || "",
                };
                setGallery((prev) => [newItem, ...prev]);
              }
            } else {
              // If DB save fails, still add locally
              const newItem: GalleryItem = {
                id: `local-${Date.now()}`,
                src: data.url,
                alt: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
                category: categoryFilter !== "all" ? categoryFilter : "bridal",
                height: ["tall", "medium", "short"][Math.floor(Math.random() * 3)] as "tall" | "medium" | "short",
                featured: false,
                isActive: true,
                cloudinaryId: data.publicId || "",
              };
              setGallery((prev) => [newItem, ...prev]);
            }
          }
        } catch (err) {
          console.error("Upload failed:", err);
        }
      }
      setIsUploading(false);
      showNotification("success", "Images uploaded successfully");
    };
    input.click();
  };

  // ─── Edit modal: Open edit ───
  const openEdit = (galleryItem: GalleryItem) => {
    setEditingItem(galleryItem);
    setFormData({ ...galleryItem });
    setIsCreating(false);
  };

  // ─── Edit modal: Open create ───
  const openCreate = () => {
    setEditingItem(null);
    setFormData({ ...emptyGalleryItem });
    setIsCreating(true);
  };

  // ─── Edit modal: Close ───
  const closeModal = () => {
    setEditingItem(null);
    setIsCreating(false);
    setFormData(emptyGalleryItem);
  };

  // ─── Edit modal: Image upload ───
  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setIsUploadingImage(true);
      try {
        const uploadForm = new FormData();
        uploadForm.append("file", file);
        uploadForm.append("folder", "nabila-gallery");
        uploadForm.append("title", formData.alt || file.name);
        uploadForm.append("category", formData.category);
        const res = await fetch("/api/cloudinary", { method: "POST", body: uploadForm });
        if (res.ok) {
          const data = await res.json();
          setFormData({ ...formData, src: data.url, cloudinaryId: data.publicId || "" });
        }
      } catch (err) {
        console.error("Image upload failed:", err);
      }
      setIsUploadingImage(false);
    };
    input.click();
  };

  // ─── Edit modal: Save ───
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isCreating) {
        const res = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            src: formData.src,
            alt: formData.alt,
            category: formData.category,
            height: formData.height,
            featured: formData.featured,
            isActive: formData.isActive,
            cloudinaryId: formData.cloudinaryId,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.item) {
            const newItem: GalleryItem = {
              id: data.item.id,
              src: data.item.src || formData.src,
              alt: data.item.alt || formData.alt,
              category: data.item.category || formData.category,
              height: (data.item.height || formData.height) as "tall" | "medium" | "short",
              featured: data.item.featured ?? formData.featured,
              isActive: data.item.isActive ?? formData.isActive,
              cloudinaryId: data.item.cloudinaryId || formData.cloudinaryId,
            };
            setGallery((prev) => [newItem, ...prev]);
          }
          showNotification("success", "Gallery image created successfully");
        } else {
          showNotification("error", "Failed to create gallery item");
        }
      } else if (editingItem) {
        const res = await fetch("/api/admin/gallery", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemId: editingItem.id,
            data: {
              src: formData.src,
              alt: formData.alt,
              category: formData.category,
              height: formData.height,
              featured: formData.featured,
              isActive: formData.isActive,
              cloudinaryId: formData.cloudinaryId,
            },
          }),
        });
        if (res.ok) {
          setGallery(gallery.map((g) => (g.id === editingItem.id ? { ...formData } : g)));
          showNotification("success", "Gallery image updated successfully");
        } else {
          showNotification("error", "Failed to update gallery item");
        }
      }
    } catch (err) {
      console.error("Save failed:", err);
      showNotification("error", "Failed to save changes");
    }
    setIsSaving(false);
    closeModal();
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg ${
              notification.type === "success"
                ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                : "bg-red-500/20 border border-red-500/30 text-red-400"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-text-primary">Gallery</h1>
          <p className="text-text-muted text-sm mt-1">
            {isLoading ? "Loading..." : `${gallery.length} images`} &middot; {gallery.filter((g) => g.featured).length} featured
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchGallery}
            disabled={isLoading}
            className="p-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-text-muted hover:text-champagne-gold hover:border-champagne-gold/30 transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreate}
            className="px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-muted hover:text-champagne-gold hover:border-champagne-gold/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Entry
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="px-5 py-2.5 bg-champagne-gold hover:bg-champagne-gold/90 text-matte-black font-semibold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-champagne-gold/20 transition-all disabled:opacity-50"
          >
            <Upload className="w-4 h-4" /> {isUploading ? "Uploading..." : "Upload Images"}
          </button>
        </div>
      </motion.div>

      {/* Search + Filters + View Mode */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search images..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-champagne-gold/30 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                categoryFilter === cat.id
                  ? "bg-champagne-gold text-matte-black"
                  : "bg-dark-elevated text-text-muted hover:text-text-primary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-dark-elevated rounded-lg p-1">
          <button
            onClick={() => setViewMode("masonry")}
            className={`p-1.5 rounded ${viewMode === "masonry" ? "bg-champagne-gold/20 text-champagne-gold" : "text-text-muted"}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded ${viewMode === "grid" ? "bg-champagne-gold/20 text-champagne-gold" : "text-text-muted"}`}
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        variants={item}
        className="border-2 border-dashed border-border-gold/20 rounded-2xl p-8 text-center hover:border-champagne-gold/40 transition-all cursor-pointer group"
        onClick={handleUpload}
      >
        <div className="w-12 h-12 rounded-2xl bg-champagne-gold/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-champagne-gold/20 transition-colors">
          <Upload className="w-6 h-6 text-champagne-gold" />
        </div>
        <p className="text-sm text-text-primary mb-1">Drop images here or click to upload</p>
        <p className="text-xs text-text-muted">PNG, JPG, WebP up to 10MB &middot; Cloudinary auto-optimization</p>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-16 text-center">
          <RefreshCw className="w-8 h-8 text-champagne-gold animate-spin mx-auto mb-3" />
          <p className="text-text-muted">Loading gallery...</p>
        </div>
      )}

      {/* Gallery Grid */}
      {!isLoading && (
        <motion.div variants={item}>
          {viewMode === "masonry" ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3">
              {filtered.map((img) => (
                <motion.div
                  key={img.id}
                  layout
                  className={`relative group break-inside-avoid rounded-xl overflow-hidden cursor-pointer border ${
                    img.featured ? "border-champagne-gold/30" : "border-border-gold/10"
                  } ${!img.isActive ? "opacity-40" : ""}`}
                  onClick={() => setSelectedItem(img)}
                >
                  {/* Image or Placeholder */}
                  <div className={`${heightMap[img.height]} bg-gradient-to-br from-dark-elevated to-dark-card flex items-center justify-center overflow-hidden`}>
                    {img.src ? (
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
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(img); }}
                        className="p-1.5 bg-matte-black/60 backdrop-blur-sm rounded-lg"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-champagne-gold" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFeatured(img.id); }}
                        className="p-1.5 bg-matte-black/60 backdrop-blur-sm rounded-lg"
                      >
                        <Star className={`w-3.5 h-3.5 ${img.featured ? "fill-champagne-gold text-champagne-gold" : "text-text-muted"}`} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                        className="p-1.5 bg-matte-black/60 backdrop-blur-sm rounded-lg"
                      >
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
                <motion.div
                  key={img.id}
                  layout
                  className={`relative group rounded-xl overflow-hidden cursor-pointer border aspect-square ${
                    img.featured ? "border-champagne-gold/30" : "border-border-gold/10"
                  } ${!img.isActive ? "opacity-40" : ""}`}
                  onClick={() => setSelectedItem(img)}
                >
                  <div className="w-full h-full bg-gradient-to-br from-dark-elevated to-dark-card flex items-center justify-center overflow-hidden">
                    {img.src ? (
                      <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-text-muted/20" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-matte-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedItem(img); }} className="p-2 bg-dark-surface/80 rounded-lg">
                      <Eye className="w-4 h-4 text-text-primary" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); openEdit(img); }} className="p-2 bg-dark-surface/80 rounded-lg">
                      <Edit3 className="w-4 h-4 text-champagne-gold" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFeatured(img.id); }}
                      className="p-2 bg-dark-surface/80 rounded-lg"
                    >
                      <Star className={`w-4 h-4 ${img.featured ? "fill-champagne-gold text-champagne-gold" : "text-text-muted"}`} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                      className="p-2 bg-dark-surface/80 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {filtered.length === 0 && !isLoading && (
            <div className="py-16 text-center">
              <ImageIcon className="w-10 h-10 text-text-muted/30 mx-auto mb-3" />
              <p className="text-text-muted">No images found</p>
            </div>
          )}
        </motion.div>
      )}

      {/* ─── Detail Drawer ─── */}
      <AnimatePresence>
        {selectedItem && !editingItem && !isCreating && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setSelectedItem(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-dark-surface border-l border-border-gold/10 z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-serif text-text-primary">Image Details</h2>
                  <button onClick={() => setSelectedItem(null)} className="p-2 text-text-muted hover:text-text-primary">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Preview */}
                <div className="aspect-video rounded-xl bg-dark-card border border-border-gold/10 flex items-center justify-center mb-6 overflow-hidden">
                  {selectedItem.src ? (
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
                  <button
                    onClick={() => {
                      openEdit(selectedItem);
                      setSelectedItem(null);
                    }}
                    className="w-full py-2.5 bg-champagne-gold/10 border border-champagne-gold/20 text-champagne-gold rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-champagne-gold/20 transition-all"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Details
                  </button>
                  <button
                    onClick={() => {
                      toggleFeatured(selectedItem.id);
                      setSelectedItem({ ...selectedItem, featured: !selectedItem.featured });
                    }}
                    className={`w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                      selectedItem.featured
                        ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                        : "bg-champagne-gold/10 border border-champagne-gold/20 text-champagne-gold"
                    }`}
                  >
                    <Star className={`w-4 h-4 ${selectedItem.featured ? "fill-current" : ""}`} />
                    {selectedItem.featured ? "Remove from Featured" : "Mark as Featured"}
                  </button>
                  <button
                    onClick={() => {
                      toggleActive(selectedItem.id);
                      setSelectedItem({ ...selectedItem, isActive: !selectedItem.isActive });
                    }}
                    className="w-full py-2.5 bg-dark-elevated border border-border-gold/10 rounded-xl text-sm text-text-primary flex items-center justify-center gap-2 hover:border-champagne-gold/20 transition-all"
                  >
                    {selectedItem.isActive ? (
                      <ToggleRight className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-4 h-4" />
                    )}
                    {selectedItem.isActive ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(selectedItem.id);
                      setSelectedItem(null);
                    }}
                    className="w-full py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Image
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Create/Edit Modal ─── */}
      <AnimatePresence>
        {(isCreating || editingItem) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-dark-surface border border-border-gold/20 rounded-2xl z-50 overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-dark-surface/95 backdrop-blur-xl border-b border-border-gold/10 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-serif text-text-primary">
                  {isCreating ? "New Gallery Image" : "Edit Gallery Image"}
                </h2>
                <button onClick={closeModal} className="p-2 text-text-muted hover:text-text-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Image Preview & Upload */}
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Image</label>
                  <div className="flex items-start gap-4">
                    {formData.src ? (
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-border-gold/10 flex-shrink-0 group">
                        <img src={formData.src} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setFormData({ ...formData, src: "", cloudinaryId: "" })}
                          className="absolute top-1 right-1 p-0.5 bg-matte-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 text-text-primary" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-xl border-2 border-dashed border-border-gold/20 flex items-center justify-center flex-shrink-0 bg-dark-card">
                        <ImageIcon className="w-10 h-10 text-text-muted/30" />
                      </div>
                    )}
                    <div className="flex-1">
                      <button
                        onClick={handleImageUpload}
                        disabled={isUploadingImage}
                        className="px-4 py-2 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-muted hover:text-champagne-gold hover:border-champagne-gold/30 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        <Upload className="w-4 h-4" />
                        {isUploadingImage ? "Uploading..." : "Upload Image"}
                      </button>
                      <p className="text-[10px] text-text-muted mt-2">PNG, JPG, WebP. Recommended: 800x600px</p>
                      <div className="mt-2">
                        <input
                          type="text"
                          value={formData.src}
                          onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                          className="w-full px-3 py-1.5 bg-dark-card border border-border-gold/10 rounded-lg text-xs text-text-primary focus:outline-none"
                          placeholder="Or paste image URL..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alt Text */}
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Alt Text / Title</label>
                  <input
                    type="text"
                    value={formData.alt}
                    onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                    className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30 transition-all"
                    placeholder="e.g. Bridal Makeup Excellence"
                  />
                </div>

                {/* Category + Height Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30"
                    >
                      <option value="general" className="bg-dark-card">General</option>
                      <option value="bridal" className="bg-dark-card">Bridal</option>
                      <option value="hair" className="bg-dark-card">Hair</option>
                      <option value="makeup" className="bg-dark-card">Makeup</option>
                      <option value="skincare" className="bg-dark-card">Skincare</option>
                      <option value="nails" className="bg-dark-card">Nails</option>
                      <option value="spa" className="bg-dark-card">Spa</option>
                      <option value="transformation" className="bg-dark-card">Transformation</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Display Height</label>
                    <select
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value as "tall" | "medium" | "short" })}
                      className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30"
                    >
                      <option value="tall" className="bg-dark-card">Tall (Large)</option>
                      <option value="medium" className="bg-dark-card">Medium</option>
                      <option value="short" className="bg-dark-card">Short (Small)</option>
                    </select>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="sr-only"
                    />
                    {formData.isActive ? (
                      <ToggleRight className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-text-muted" />
                    )}
                    <span className="text-sm text-text-primary">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="sr-only"
                    />
                    <Star
                      className={`w-4 h-4 ${formData.featured ? "fill-champagne-gold text-champagne-gold" : "text-text-muted"}`}
                    />
                    <span className="text-sm text-text-primary">Featured</span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-dark-surface/95 backdrop-blur-xl border-t border-border-gold/10 px-6 py-4 flex items-center justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-5 py-2 text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !formData.src}
                  className="px-6 py-2.5 bg-champagne-gold hover:bg-champagne-gold/90 text-matte-black font-semibold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-champagne-gold/20 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {isSaving ? "Saving..." : isCreating ? "Create" : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
