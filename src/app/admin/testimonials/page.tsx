"use client";

// Force dynamic rendering
export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit3, Trash2, X, Save, Star, ToggleLeft, ToggleRight,
  MessageSquareQuote, User,
} from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image: string;
  featured: boolean;
  isActive: boolean;
}

const initialTestimonials: TestimonialItem[] = TESTIMONIALS.map((t) => ({
  ...t,
  featured: t.rating === 5,
  isActive: true,
}));

const emptyTestimonial: TestimonialItem = {
  id: 0, name: "", role: "", quote: "", rating: 5, image: "", featured: false, isActive: true,
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<TestimonialItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<TestimonialItem>(emptyTestimonial);

  const filtered = testimonials.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.quote.toLowerCase().includes(search.toLowerCase()) ||
    t.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (isCreating) {
      setTestimonials([{ ...formData, id: Date.now() }, ...testimonials]);
    } else if (editing) {
      setTestimonials(testimonials.map((t) => (t.id === editing.id ? formData : t)));
    }
    closeModal();
  };

  const handleDelete = (id: number) => setTestimonials(testimonials.filter((t) => t.id !== id));
  const toggleFeatured = (id: number) => setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, featured: !t.featured } : t)));
  const toggleActive = (id: number) => setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t)));

  const openEdit = (t: TestimonialItem) => { setEditing(t); setFormData({ ...t }); setIsCreating(false); };
  const openCreate = () => { setEditing(null); setFormData({ ...emptyTestimonial }); setIsCreating(true); };
  const closeModal = () => { setEditing(null); setIsCreating(false); setFormData(emptyTestimonial); };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-text-primary">Testimonials</h1>
          <p className="text-text-muted text-sm mt-1">{testimonials.length} testimonials &middot; {testimonials.filter((t) => t.featured).length} featured</p>
        </div>
        <button onClick={openCreate}
          className="px-5 py-2.5 bg-champagne-gold hover:bg-champagne-gold/90 text-matte-black font-semibold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-champagne-gold/20 transition-all">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </motion.div>

      {/* Search */}
      <motion.div variants={item} className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input type="text" placeholder="Search testimonials..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-champagne-gold/30 transition-all" />
      </motion.div>

      {/* Testimonials Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((testimonial) => (
          <motion.div key={testimonial.id} layout
            className={`bg-dark-card border rounded-2xl p-5 transition-all group hover:border-champagne-gold/20 ${
              testimonial.featured ? "border-champagne-gold/30" : "border-border-gold/10"
            } ${!testimonial.isActive ? "opacity-50" : ""}`}>
            {/* Quote */}
            <div className="mb-4">
              <MessageSquareQuote className="w-5 h-5 text-champagne-gold/30 mb-2" />
              <p className="text-sm text-text-primary leading-relaxed line-clamp-4">&ldquo;{testimonial.quote}&rdquo;</p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-champagne-gold/20 to-champagne-gold/5 flex items-center justify-center text-champagne-gold text-sm font-semibold flex-shrink-0">
                {testimonial.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{testimonial.name}</p>
                <p className="text-[10px] text-text-muted">{testimonial.role}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-0.5 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-3.5 h-3.5 ${star <= testimonial.rating ? "fill-champagne-gold text-champagne-gold" : "text-text-muted/30"}`} />
              ))}
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              {testimonial.featured && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-champagne-gold/10 text-champagne-gold text-[9px] font-medium">
                  <Star className="w-2.5 h-2.5" fill="currentColor" /> Featured
                </span>
              )}
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium ${
                testimonial.isActive ? "bg-emerald-400/10 text-emerald-400" : "bg-zinc-400/10 text-zinc-400"
              }`}>
                {testimonial.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border-gold/5">
              <div className="flex items-center gap-1">
                <button onClick={() => toggleFeatured(testimonial.id)} className="p-1.5 text-text-muted hover:text-champagne-gold transition-colors">
                  <Star className={`w-3.5 h-3.5 ${testimonial.featured ? "fill-champagne-gold text-champagne-gold" : ""}`} />
                </button>
                <button onClick={() => toggleActive(testimonial.id)} className="p-1.5 text-text-muted hover:text-champagne-gold transition-colors">
                  {testimonial.isActive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(testimonial)} className="p-1.5 text-text-muted hover:text-champagne-gold transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(testimonial.id)} className="p-1.5 text-text-muted hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <MessageSquareQuote className="w-10 h-10 text-text-muted/30 mx-auto mb-3" />
          <p className="text-text-muted">No testimonials found</p>
        </div>
      )}

      {/* ─── Create/Edit Modal ─── */}
      <AnimatePresence>
        {(isCreating || editing) && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50" onClick={closeModal} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] bottom-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-dark-surface border border-border-gold/20 rounded-2xl z-50 overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-dark-surface/95 backdrop-blur-xl border-b border-border-gold/10 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-serif text-text-primary">{isCreating ? "Add Testimonial" : "Edit Testimonial"}</h2>
                <button onClick={closeModal} className="p-2 text-text-muted hover:text-text-primary"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Client Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" />
                </div>
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Role / Occasion</label>
                  <input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" placeholder="e.g. Bride, December 2025" />
                </div>
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Quote</label>
                  <textarea value={formData.quote} onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30 resize-none" rows={4} />
                </div>
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setFormData({ ...formData, rating: star })} className="p-0.5">
                        <Star className={`w-6 h-6 ${star <= formData.rating ? "fill-champagne-gold text-champagne-gold" : "text-text-muted/30"} transition-colors`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="sr-only" />
                    <Star className={`w-4 h-4 ${formData.featured ? "fill-champagne-gold text-champagne-gold" : "text-text-muted"}`} />
                    <span className="text-sm text-text-primary">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="sr-only" />
                    {formData.isActive ? <ToggleRight className="w-6 h-6 text-emerald-400" /> : <ToggleLeft className="w-6 h-6 text-text-muted" />}
                    <span className="text-sm text-text-primary">Active</span>
                  </label>
                </div>
              </div>

              <div className="sticky bottom-0 bg-dark-surface/95 backdrop-blur-xl border-t border-border-gold/10 px-6 py-4 flex items-center justify-end gap-3">
                <button onClick={closeModal} className="px-5 py-2 text-sm text-text-muted hover:text-text-primary">Cancel</button>
                <button onClick={handleSave}
                  className="px-6 py-2.5 bg-champagne-gold hover:bg-champagne-gold/90 text-matte-black font-semibold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-champagne-gold/20">
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
