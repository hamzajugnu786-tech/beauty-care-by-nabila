"use client";

// Force dynamic rendering
export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Star,
  X,
  Save,
  GripVertical,
  Scissors,
  Crown,
  Sparkles,
  Palette,
  Gem,
  Leaf,
} from "lucide-react";
import { DETAILED_SERVICES, SERVICE_CATEGORIES } from "@/lib/constants";

const iconMap: Record<string, any> = { crown: Crown, scissors: Scissors, sparkles: Sparkles, palette: Palette, gem: Gem, leaf: Leaf };

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

interface ServiceItem {
  id: string;
  title: string;
  category: string;
  price: string;
  duration: string;
  icon: string;
  description: string;
  isActive: boolean;
  features: string[];
  addOns: string[];
  popular: boolean;
  sortOrder: number;
}

const initialServices: ServiceItem[] = DETAILED_SERVICES.map((s, i) => ({
  id: s.id,
  title: s.title,
  category: s.category,
  price: s.price,
  duration: s.duration,
  icon: s.icon,
  description: s.description,
  isActive: true,
  features: [...s.features],
  addOns: [...s.addOns],
  popular: s.popular,
  sortOrder: i,
}));

const emptyService: ServiceItem = {
  id: "", title: "", category: "hair", price: "", duration: "", icon: "sparkles",
  description: "", isActive: true, features: [], addOns: [], popular: false, sortOrder: 0,
};

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<ServiceItem>(emptyService);
  const [newFeature, setNewFeature] = useState("");
  const [newAddOn, setNewAddOn] = useState("");

  const filtered = services.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || s.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleSave = () => {
    if (isCreating) {
      setServices([...services, { ...formData, id: `svc-${Date.now()}`, sortOrder: services.length }]);
    } else if (editingService) {
      setServices(services.map((s) => (s.id === editingService.id ? formData : s)));
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const toggleActive = (id: string) => {
    setServices(services.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)));
  };

  const togglePopular = (id: string) => {
    setServices(services.map((s) => (s.id === id ? { ...s, popular: !s.popular } : s)));
  };

  const openEdit = (service: ServiceItem) => {
    setEditingService(service);
    setFormData({ ...service });
    setIsCreating(false);
  };

  const openCreate = () => {
    setEditingService(null);
    setFormData({ ...emptyService });
    setIsCreating(true);
  };

  const closeModal = () => {
    setEditingService(null);
    setIsCreating(false);
    setFormData(emptyService);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  const addAddOn = () => {
    if (newAddOn.trim()) {
      setFormData({ ...formData, addOns: [...formData.addOns, newAddOn.trim()] });
      setNewAddOn("");
    }
  };

  const removeAddOn = (index: number) => {
    setFormData({ ...formData, addOns: formData.addOns.filter((_, i) => i !== index) });
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-text-primary">Services</h1>
          <p className="text-text-muted text-sm mt-1">{services.length} services across {SERVICE_CATEGORIES.length - 1} categories</p>
        </div>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-champagne-gold hover:bg-champagne-gold/90 text-matte-black font-semibold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-champagne-gold/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </motion.div>

      {/* Search + Filter */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text" placeholder="Search services..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-champagne-gold/30 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {SERVICE_CATEGORIES.map((cat) => (
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
      </motion.div>

      {/* Services Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((service) => {
          const Icon = iconMap[service.icon] || Sparkles;
          return (
            <motion.div
              key={service.id}
              layout
              className={`bg-dark-card border rounded-2xl p-5 transition-all group hover:border-champagne-gold/30 ${
                service.popular ? "border-champagne-gold/30" : "border-border-gold/10"
              } ${!service.isActive ? "opacity-50" : ""}`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-champagne-gold/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-champagne-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-text-primary">{service.title}</h3>
                    <p className="text-[10px] text-text-muted capitalize">{service.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {service.popular && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-champagne-gold/10 text-champagne-gold text-[9px] font-medium">
                      <Star className="w-2.5 h-2.5" fill="currentColor" /> Popular
                    </span>
                  )}
                  <button onClick={() => toggleActive(service.id)} className="p-1 text-text-muted hover:text-champagne-gold transition-colors">
                    {service.isActive ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-text-muted line-clamp-2 mb-3">{service.description}</p>

              {/* Price & Duration */}
              <div className="flex items-center gap-4 mb-3">
                <span className="text-sm font-medium text-champagne-gold">{service.price}</span>
                <span className="text-xs text-text-muted">{service.duration}</span>
              </div>

              {/* Features */}
              {service.features.length > 0 && (
                <div className="mb-3">
                  <p className="text-[9px] text-text-muted uppercase tracking-wider mb-1">Features</p>
                  <div className="flex flex-wrap gap-1">
                    {service.features.slice(0, 3).map((f, i) => (
                      <span key={i} className="text-[10px] bg-dark-elevated text-text-muted px-2 py-0.5 rounded">{f}</span>
                    ))}
                    {service.features.length > 3 && (
                      <span className="text-[10px] bg-dark-elevated text-text-muted px-2 py-0.5 rounded">+{service.features.length - 3}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-1 pt-3 border-t border-border-gold/5">
                <button onClick={() => togglePopular(service.id)} className="p-1.5 text-text-muted hover:text-champagne-gold transition-colors" title="Toggle popular">
                  <Star className={`w-3.5 h-3.5 ${service.popular ? "fill-champagne-gold text-champagne-gold" : ""}`} />
                </button>
                <button onClick={() => openEdit(service)} className="p-1.5 text-text-muted hover:text-champagne-gold transition-colors" title="Edit">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(service.id)} className="p-1.5 text-text-muted hover:text-red-400 transition-colors" title="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <Sparkles className="w-10 h-10 text-text-muted/30 mx-auto mb-3" />
          <p className="text-text-muted">No services found</p>
        </div>
      )}

      {/* ─── Create/Edit Modal ─── */}
      <AnimatePresence>
        {(isCreating || editingService) && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50" onClick={closeModal} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-dark-surface border border-border-gold/20 rounded-2xl z-50 overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-dark-surface/95 backdrop-blur-xl border-b border-border-gold/10 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-serif text-text-primary">{isCreating ? "New Service" : "Edit Service"}</h2>
                <button onClick={closeModal} className="p-2 text-text-muted hover:text-text-primary"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30 transition-all" placeholder="Service name" />
                </div>

                {/* Category + Icon Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30">
                      {["bridal", "hair", "makeup", "skincare", "nails", "spa"].map((c) => (
                        <option key={c} value={c} className="bg-dark-card">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Icon</label>
                    <select value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30">
                      {["crown", "scissors", "sparkles", "palette", "gem", "leaf"].map((i) => (
                        <option key={i} value={i} className="bg-dark-card">{i}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price + Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Price</label>
                    <input type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" placeholder="PKR 5,500" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Duration</label>
                    <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" placeholder="45-60 min" />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30 resize-none" rows={3} placeholder="Service description..." />
                </div>

                {/* Features */}
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Features</label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {formData.features.map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-xs bg-dark-elevated text-text-primary px-2 py-1 rounded-lg">
                        {f}
                        <button onClick={() => removeFeature(i)} className="text-text-muted hover:text-red-400"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addFeature()}
                      className="flex-1 px-3 py-2 bg-dark-card border border-border-gold/10 rounded-lg text-sm text-text-primary focus:outline-none" placeholder="Add feature..." />
                    <button onClick={addFeature} className="px-3 py-2 bg-dark-elevated border border-border-gold/10 rounded-lg text-sm text-text-muted hover:text-champagne-gold"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>

                {/* Add-ons */}
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Add-ons</label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {formData.addOns.map((a, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-xs bg-dark-elevated text-text-primary px-2 py-1 rounded-lg">
                        {a}
                        <button onClick={() => removeAddOn(i)} className="text-text-muted hover:text-red-400"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={newAddOn} onChange={(e) => setNewAddOn(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addAddOn()}
                      className="flex-1 px-3 py-2 bg-dark-card border border-border-gold/10 rounded-lg text-sm text-text-primary focus:outline-none" placeholder="Add add-on..." />
                    <button onClick={addAddOn} className="px-3 py-2 bg-dark-elevated border border-border-gold/10 rounded-lg text-sm text-text-muted hover:text-champagne-gold"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="sr-only" />
                    {formData.isActive ? <ToggleRight className="w-6 h-6 text-emerald-400" /> : <ToggleLeft className="w-6 h-6 text-text-muted" />}
                    <span className="text-sm text-text-primary">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.popular} onChange={(e) => setFormData({ ...formData, popular: e.target.checked })} className="sr-only" />
                    <Star className={`w-4 h-4 ${formData.popular ? "fill-champagne-gold text-champagne-gold" : "text-text-muted"}`} />
                    <span className="text-sm text-text-primary">Popular</span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-dark-surface/95 backdrop-blur-xl border-t border-border-gold/10 px-6 py-4 flex items-center justify-end gap-3">
                <button onClick={closeModal} className="px-5 py-2 text-sm text-text-muted hover:text-text-primary transition-colors">Cancel</button>
                <button onClick={handleSave}
                  className="px-6 py-2.5 bg-champagne-gold hover:bg-champagne-gold/90 text-matte-black font-semibold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-champagne-gold/20 transition-all">
                  <Save className="w-4 h-4" /> {isCreating ? "Create" : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
