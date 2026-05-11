"use client";

// Force dynamic rendering
export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit3, Trash2, X, Save, Eye, Globe, FileText,
  Calendar, Tag, User, Link as LinkIcon, Image as ImageIcon,
  ToggleLeft, ToggleRight, ExternalLink,
} from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string | null;
  isPublished: boolean;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
    canonicalUrl: string;
    keywords: string[];
    noIndex: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

const mockPosts: BlogPost[] = [
  {
    id: "p1",
    title: "The Ultimate Guide to Bridal Skincare in Lahore",
    slug: "bridal-skincare-guide-lahore",
    excerpt: "Everything you need to know about pre-bridal skincare routines tailored for the Pakistani climate and Lahore's unique environmental factors.",
    content: "Full article content...",
    coverImage: "/images/blog-1.jpg",
    category: "bridal-tips",
    tags: ["bridal", "skincare", "lahore"],
    author: "Nabila",
    publishedAt: "2026-04-15",
    isPublished: true,
    seo: {
      metaTitle: "Bridal Skincare Guide Lahore | Beauty Care by Nabila",
      metaDescription: "Complete pre-bridal skincare routine for Pakistani brides. Expert tips from Lahore's top salon.",
      ogImage: "/images/blog-1-og.jpg",
      canonicalUrl: "https://nabilalahore.com/blog/bridal-skincare-guide-lahore",
      keywords: ["bridal skincare", "lahore bridal", "pre-bridal routine"],
      noIndex: false,
    },
    createdAt: "2026-04-10",
    updatedAt: "2026-04-15",
  },
  {
    id: "p2",
    title: "2026 Hair Colour Trends You Need to Know",
    slug: "hair-colour-trends-2026",
    excerpt: "From caramel balayage to rose gold ombré, discover the hottest hair colour trends making waves this year across Pakistan.",
    content: "Full article content...",
    coverImage: "/images/blog-2.jpg",
    category: "hair-care",
    tags: ["hair", "colour", "trends"],
    author: "Zoya Malik",
    publishedAt: null,
    isPublished: false,
    seo: {
      metaTitle: "Hair Colour Trends 2026 Pakistan",
      metaDescription: "Discover the latest hair colour trends for 2026. Expert insights from Lahore's premier colourists.",
      ogImage: "",
      canonicalUrl: "",
      keywords: ["hair colour trends", "balayage", "hair colouring"],
      noIndex: false,
    },
    createdAt: "2026-05-01",
    updatedAt: "2026-05-08",
  },
  {
    id: "p3",
    title: "5 Skincare Myths Debunked by Our Experts",
    slug: "skincare-myths-debunked",
    excerpt: "We separate fact from fiction on the most common skincare misconceptions that could be harming your skin instead of helping it.",
    content: "Full article content...",
    coverImage: "/images/blog-3.jpg",
    category: "skincare",
    tags: ["skincare", "myths", "tips"],
    author: "Amara Hussain",
    publishedAt: "2026-03-20",
    isPublished: true,
    seo: {
      metaTitle: "Skincare Myths Debunked | Expert Tips",
      metaDescription: "Top skincare myths debunked by Beauty Care by Nabila's skincare experts. Learn the truth.",
      ogImage: "",
      canonicalUrl: "",
      keywords: ["skincare myths", "skin tips", "expert advice"],
      noIndex: false,
    },
    createdAt: "2026-03-15",
    updatedAt: "2026-03-20",
  },
];

const categories = [
  { id: "bridal-tips", label: "Bridal Tips" },
  { id: "skincare", label: "Skincare" },
  { id: "hair-care", label: "Hair Care" },
  { id: "makeup-trends", label: "Makeup Trends" },
  { id: "wellness", label: "Wellness" },
  { id: "studio-news", label: "Studio News" },
];

const emptyPost: BlogPost = {
  id: "", title: "", slug: "", excerpt: "", content: "", coverImage: "",
  category: "bridal-tips", tags: [], author: "", publishedAt: null, isPublished: false,
  seo: { metaTitle: "", metaDescription: "", ogImage: "", canonicalUrl: "", keywords: [], noIndex: false },
  createdAt: "", updatedAt: "",
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<BlogPost>(emptyPost);
  const [newTag, setNewTag] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [showSeoPanel, setShowSeoPanel] = useState(false);

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || (statusFilter === "published" ? p.isPublished : !p.isPublished);
    return matchSearch && matchStatus;
  });

  const handleSave = () => {
    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const seoTitle = formData.seo.metaTitle || formData.title;
    if (isCreating) {
      setPosts([{ ...formData, id: `post-${Date.now()}`, slug, seo: { ...formData.seo, metaTitle: seoTitle }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...posts]);
    } else if (editing) {
      setPosts(posts.map((p) => (p.id === editing.id ? { ...formData, slug, seo: { ...formData.seo, metaTitle: seoTitle }, updatedAt: new Date().toISOString() } : p)));
    }
    closeModal();
  };

  const handleDelete = (id: string) => setPosts(posts.filter((p) => p.id !== id));
  const togglePublish = (id: string) => setPosts(posts.map((p) => (p.id === id ? { ...p, isPublished: !p.isPublished } : p)));

  const openEdit = (post: BlogPost) => { setEditing(post); setFormData({ ...post }); setIsCreating(false); };
  const openCreate = () => { setEditing(null); setFormData({ ...emptyPost }); setIsCreating(true); };
  const closeModal = () => { setEditing(null); setIsCreating(false); setFormData(emptyPost); setShowSeoPanel(false); };

  const addTag = () => { if (newTag.trim()) { setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] }); setNewTag(""); } };
  const addKeyword = () => { if (newKeyword.trim()) { setFormData({ ...formData, seo: { ...formData.seo, keywords: [...formData.seo.keywords, newKeyword.trim()] } }); setNewKeyword(""); } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-text-primary">Blog & SEO</h1>
          <p className="text-text-muted text-sm mt-1">{posts.filter((p) => p.isPublished).length} published &middot; {posts.filter((p) => !p.isPublished).length} drafts</p>
        </div>
        <button onClick={openCreate}
          className="px-5 py-2.5 bg-champagne-gold hover:bg-champagne-gold/90 text-matte-black font-semibold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-champagne-gold/20">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </motion.div>

      {/* Search + Filters */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="text" placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-champagne-gold/30" />
        </div>
        <div className="flex items-center gap-2">
          {(["all", "published", "draft"] as const).map((status) => (
            <button key={status} onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                statusFilter === status ? "bg-champagne-gold text-matte-black" : "bg-dark-elevated text-text-muted"
              }`}>{status}</button>
          ))}
        </div>
      </motion.div>

      {/* Posts List */}
      <motion.div variants={item} className="space-y-3">
        {filtered.map((post) => (
          <div key={post.id}
            className="bg-dark-card border border-border-gold/10 rounded-2xl p-5 hover:border-champagne-gold/20 transition-all group">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Cover Image Placeholder */}
              <div className="w-full sm:w-28 h-28 sm:h-20 rounded-xl bg-gradient-to-br from-dark-elevated to-dark-card flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-6 h-6 text-text-muted/20" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-medium text-text-primary truncate">{post.title}</h3>
                  <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[9px] font-medium ${
                    post.isPublished ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"
                  }`}>
                    {post.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-xs text-text-muted line-clamp-2 mb-2">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-[10px] text-text-muted flex-wrap">
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{categories.find((c) => c.id === post.category)?.label}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.publishedAt || "Unpublished"}</span>
                  <span className="flex items-center gap-1"><LinkIcon className="w-3 h-3" />/{post.slug}</span>
                </div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-[9px] bg-champagne-gold/10 text-champagne-gold px-1.5 py-0.5 rounded">#{tag}</span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col items-center gap-1 sm:gap-2">
                <button onClick={() => togglePublish(post.id)}
                  className="p-1.5 text-text-muted hover:text-champagne-gold transition-colors">
                  {post.isPublished ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(post)} className="p-1.5 text-text-muted hover:text-champagne-gold transition-colors"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(post.id)} className="p-1.5 text-text-muted hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <FileText className="w-10 h-10 text-text-muted/30 mx-auto mb-3" />
          <p className="text-text-muted">No posts found</p>
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
              className="fixed inset-x-4 top-[3%] bottom-[3%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl bg-dark-surface border border-border-gold/20 rounded-2xl z-50 overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-dark-surface/95 backdrop-blur-xl border-b border-border-gold/10 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-serif text-text-primary">{isCreating ? "New Post" : "Edit Post"}</h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowSeoPanel(!showSeoPanel)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                      showSeoPanel ? "bg-champagne-gold/10 border border-champagne-gold/20 text-champagne-gold" : "bg-dark-elevated text-text-muted hover:text-text-primary"
                    }`}>
                    <Globe className="w-3.5 h-3.5" /> SEO
                  </button>
                  <button onClick={closeModal} className="p-2 text-text-muted hover:text-text-primary"><X className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30 text-lg font-serif" placeholder="Post title..." />
                </div>

                {/* Slug */}
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Slug</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">/blog/</span>
                    <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="flex-1 px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" placeholder="post-url-slug" />
                  </div>
                </div>

                {/* Category + Author */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none">
                      {categories.map((c) => <option key={c.id} value={c.id} className="bg-dark-card">{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Author</label>
                    <input type="text" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Excerpt</label>
                  <textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30 resize-none" rows={2} placeholder="Brief summary..." />
                </div>

                {/* Content */}
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Content</label>
                  <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30 resize-none font-mono" rows={10} placeholder="Write your content here..." />
                  <p className="text-[10px] text-text-muted mt-1">Supports Markdown. For rich editing, use Sanity Studio.</p>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Tags</label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {formData.tags.map((tag, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-xs bg-champagne-gold/10 text-champagne-gold px-2 py-1 rounded-lg">
                        #{tag}
                        <button onClick={() => setFormData({ ...formData, tags: formData.tags.filter((_, j) => j !== i) })}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTag()}
                      className="flex-1 px-3 py-2 bg-dark-card border border-border-gold/10 rounded-lg text-sm text-text-primary focus:outline-none" placeholder="Add tag..." />
                    <button onClick={addTag} className="px-3 py-2 bg-dark-elevated border border-border-gold/10 rounded-lg text-sm text-text-muted hover:text-champagne-gold"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} className="sr-only" />
                    {formData.isPublished ? <ToggleRight className="w-6 h-6 text-emerald-400" /> : <ToggleLeft className="w-6 h-6 text-text-muted" />}
                    <span className="text-sm text-text-primary">Published</span>
                  </label>
                </div>

                {/* ─── SEO Panel ─── */}
                <AnimatePresence>
                  {showSeoPanel && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 bg-dark-card border border-border-gold/10 rounded-xl space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4 text-champagne-gold" />
                          <h3 className="text-sm font-medium text-text-primary">SEO Settings</h3>
                        </div>

                        <div>
                          <label className="text-xs text-text-muted uppercase tracking-wider mb-1 block">Meta Title</label>
                          <input type="text" value={formData.seo.metaTitle} onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaTitle: e.target.value } })}
                            className="w-full px-3 py-2 bg-dark-elevated border border-border-gold/10 rounded-lg text-sm text-text-primary focus:outline-none" />
                          <p className="text-[10px] text-text-muted mt-0.5">{formData.seo.metaTitle.length}/70 characters</p>
                        </div>

                        <div>
                          <label className="text-xs text-text-muted uppercase tracking-wider mb-1 block">Meta Description</label>
                          <textarea value={formData.seo.metaDescription} onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaDescription: e.target.value } })}
                            className="w-full px-3 py-2 bg-dark-elevated border border-border-gold/10 rounded-lg text-sm text-text-primary focus:outline-none resize-none" rows={2} />
                          <p className="text-[10px] text-text-muted mt-0.5">{formData.seo.metaDescription.length}/170 characters</p>
                        </div>

                        <div>
                          <label className="text-xs text-text-muted uppercase tracking-wider mb-1 block">Canonical URL</label>
                          <input type="url" value={formData.seo.canonicalUrl} onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, canonicalUrl: e.target.value } })}
                            className="w-full px-3 py-2 bg-dark-elevated border border-border-gold/10 rounded-lg text-sm text-text-primary focus:outline-none" placeholder="https://..." />
                        </div>

                        <div>
                          <label className="text-xs text-text-muted uppercase tracking-wider mb-1 block">Keywords</label>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {formData.seo.keywords.map((kw, i) => (
                              <span key={i} className="inline-flex items-center gap-1 text-[10px] bg-dark-surface text-text-muted px-2 py-0.5 rounded">
                                {kw}
                                <button onClick={() => setFormData({ ...formData, seo: { ...formData.seo, keywords: formData.seo.keywords.filter((_, j) => j !== i) } })}><X className="w-2.5 h-2.5" /></button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input type="text" value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                              className="flex-1 px-3 py-1.5 bg-dark-surface border border-border-gold/10 rounded-lg text-xs text-text-primary focus:outline-none" placeholder="Add keyword..." />
                            <button onClick={addKeyword} className="px-2 py-1.5 bg-dark-surface border border-border-gold/10 rounded-lg text-xs text-text-muted hover:text-champagne-gold"><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={formData.seo.noIndex} onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, noIndex: e.target.checked } })} className="sr-only" />
                          {formData.seo.noIndex ? <ToggleRight className="w-5 h-5 text-amber-400" /> : <ToggleLeft className="w-5 h-5 text-text-muted" />}
                          <span className="text-xs text-text-primary">No Index (prevent search indexing)</span>
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
