"use client";

// Force dynamic rendering
export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit3, Trash2, X, Save, Star, ToggleLeft, ToggleRight,
  Phone, Mail, Award, User,
} from "lucide-react";
import { BRIDAL_ARTISTS } from "@/lib/constants";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

interface StaffMember {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  experience: string;
  image: string;
  rating: number;
  isActive: boolean;
  bio: string;
  phone: string;
  email: string;
  branch: string;
  sortOrder: number;
}

const initialStaff: StaffMember[] = BRIDAL_ARTISTS.map((a, i) => ({
  id: a.id,
  name: a.name,
  title: a.title,
  specialties: [...a.specialties],
  experience: a.experience,
  image: a.image,
  rating: 5.0,
  isActive: true,
  bio: a.bio,
  phone: "+92-300-0000000",
  email: `${a.id}@nabilalahore.com`,
  branch: "Gulberg Main",
  sortOrder: i,
}));

const emptyStaff: StaffMember = {
  id: "", name: "", title: "", specialties: [], experience: "", image: "",
  rating: 5.0, isActive: true, bio: "", phone: "", email: "", branch: "Gulberg Main", sortOrder: 0,
};

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<StaffMember>(emptyStaff);
  const [newSpecialty, setNewSpecialty] = useState("");

  const filtered = staff.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.specialties.some((sp) => sp.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = () => {
    if (isCreating) {
      setStaff([...staff, { ...formData, id: `staff-${Date.now()}`, sortOrder: staff.length }]);
    } else if (editing) {
      setStaff(staff.map((s) => (s.id === editing.id ? formData : s)));
    }
    closeModal();
  };

  const handleDelete = (id: string) => setStaff(staff.filter((s) => s.id !== id));
  const toggleActive = (id: string) => setStaff(staff.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)));

  const openEdit = (member: StaffMember) => { setEditing(member); setFormData({ ...member }); setIsCreating(false); };
  const openCreate = () => { setEditing(null); setFormData({ ...emptyStaff }); setIsCreating(true); };
  const closeModal = () => { setEditing(null); setIsCreating(false); setFormData(emptyStaff); };

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setFormData({ ...formData, specialties: [...formData.specialties, newSpecialty.trim()] });
      setNewSpecialty("");
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-text-primary">Staff</h1>
          <p className="text-text-muted text-sm mt-1">{staff.filter((s) => s.isActive).length} active team members</p>
        </div>
        <button onClick={openCreate}
          className="px-5 py-2.5 bg-champagne-gold hover:bg-champagne-gold/90 text-matte-black font-semibold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-champagne-gold/20 transition-all">
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </motion.div>

      {/* Search */}
      <motion.div variants={item} className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input type="text" placeholder="Search by name, role, specialty..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-champagne-gold/30 transition-all" />
      </motion.div>

      {/* Staff Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((member) => (
          <motion.div key={member.id} layout
            className={`bg-dark-card border border-border-gold/10 rounded-2xl p-5 transition-all group hover:border-champagne-gold/20 ${!member.isActive ? "opacity-50" : ""}`}>
            {/* Avatar + Info */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-champagne-gold/20 to-champagne-gold/5 flex items-center justify-center text-champagne-gold text-lg font-serif flex-shrink-0 border border-champagne-gold/10">
                {member.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-text-primary truncate">{member.name}</h3>
                  {member.isActive ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" title="Active" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-zinc-500 flex-shrink-0" title="Inactive" />
                  )}
                </div>
                <p className="text-xs text-text-muted">{member.title}</p>
                <p className="text-[10px] text-champagne-gold">{member.experience}</p>
              </div>
            </div>

            {/* Bio */}
            <p className="text-xs text-text-muted line-clamp-2 mb-3">{member.bio}</p>

            {/* Specialties */}
            <div className="flex flex-wrap gap-1 mb-3">
              {member.specialties.map((s, i) => (
                <span key={i} className="text-[10px] bg-champagne-gold/10 text-champagne-gold px-2 py-0.5 rounded">{s}</span>
              ))}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-3 h-3 ${star <= Math.round(member.rating) ? "fill-champagne-gold text-champagne-gold" : "text-text-muted/30"}`} />
              ))}
              <span className="text-xs text-text-muted ml-1">{member.rating.toFixed(1)}</span>
            </div>

            {/* Contact */}
            <div className="space-y-1 mb-3 text-xs text-text-muted">
              <div className="flex items-center gap-2"><Phone className="w-3 h-3" />{member.phone}</div>
              <div className="flex items-center gap-2"><Mail className="w-3 h-3" />{member.email}</div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border-gold/5">
              <button onClick={() => toggleActive(member.id)} className="flex items-center gap-1 text-xs text-text-muted hover:text-champagne-gold transition-colors">
                {member.isActive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
                {member.isActive ? "Active" : "Inactive"}
              </button>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(member)} className="p-1.5 text-text-muted hover:text-champagne-gold transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(member.id)} className="p-1.5 text-text-muted hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ─── Create/Edit Modal ─── */}
      <AnimatePresence>
        {(isCreating || editing) && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50" onClick={closeModal} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-dark-surface border border-border-gold/20 rounded-2xl z-50 overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-dark-surface/95 backdrop-blur-xl border-b border-border-gold/10 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-serif text-text-primary">{isCreating ? "Add Staff Member" : "Edit Staff Member"}</h2>
                <button onClick={closeModal} className="p-2 text-text-muted hover:text-text-primary"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Title / Role</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Experience</label>
                    <input type="text" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" placeholder="e.g. 10+ years" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Branch</label>
                    <select value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30">
                      <option value="Gulberg Main" className="bg-dark-card">Gulberg Main</option>
                      <option value="DHA Branch" className="bg-dark-card">DHA Branch</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Phone</label>
                    <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Email</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Bio</label>
                  <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30 resize-none" rows={3} />
                </div>

                {/* Specialties */}
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Specialties</label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {formData.specialties.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-xs bg-champagne-gold/10 text-champagne-gold px-2 py-1 rounded-lg">
                        {s}
                        <button onClick={() => setFormData({ ...formData, specialties: formData.specialties.filter((_, j) => j !== i) })} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={newSpecialty} onChange={(e) => setNewSpecialty(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSpecialty()}
                      className="flex-1 px-3 py-2 bg-dark-card border border-border-gold/10 rounded-lg text-sm text-text-primary focus:outline-none" placeholder="Add specialty..." />
                    <button onClick={addSpecialty} className="px-3 py-2 bg-dark-elevated border border-border-gold/10 rounded-lg text-sm text-text-muted hover:text-champagne-gold"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Rating</label>
                  <input type="number" min="0" max="5" step="0.1" value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                    className="w-24 px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="sr-only" />
                  {formData.isActive ? <ToggleRight className="w-6 h-6 text-emerald-400" /> : <ToggleLeft className="w-6 h-6 text-text-muted" />}
                  <span className="text-sm text-text-primary">Active</span>
                </label>
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
