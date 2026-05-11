export const BRAND = {
  name: "Beauty Care by Nabila",
  location: "Lahore",
  tagline: "Where Elegance Meets Artistry",
  phone: "+92-300-1234567",
  whatsapp: "+923001234567",
  email: "hello@nabilalahore.com",
  address: "M.M. Alam Road, Gulberg III, Lahore, Pakistan",
  hours: "Mon-Sat: 10:00 AM - 8:00 PM | Sunday: By Appointment",
  social: {
    instagram: "https://instagram.com/nabilalahore",
    facebook: "https://facebook.com/nabilalahore",
    tiktok: "https://tiktok.com/@nabilalahore",
    youtube: "https://youtube.com/@nabilalahore",
  },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Bridal Studio", href: "/bridal" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const SERVICES = [
  {
    id: "bridal",
    title: "Bridal Couture",
    description:
      "A bespoke bridal transformation curated for your most celebrated day. From traditional bridals to contemporary glam, our artisans craft perfection.",
    price: "From PKR 85,000",
    icon: "crown",
    image: "/images/service-bridal.jpg",
  },
  {
    id: "hair",
    title: "Hair Artistry",
    description:
      "Precision cuts, colour mastery, and luxurious treatments by internationally trained stylists. Every strand tells a story of excellence.",
    price: "From PKR 5,500",
    icon: "scissors",
    image: "/images/service-hair.jpg",
  },
  {
    id: "skincare",
    title: "Skin Renaissance",
    description:
      "Advanced facials, chemical peels, and signature skin therapies designed for the Pakistani climate. Reveal your most luminous self.",
    price: "From PKR 4,500",
    icon: "sparkles",
    image: "/images/service-skin.jpg",
  },
  {
    id: "makeup",
    title: "Makeup Mastery",
    description:
      "From subtle elegance to dramatic transformation, our makeup artists create looks that command attention and inspire confidence.",
    price: "From PKR 8,000",
    icon: "palette",
    image: "/images/service-makeup.jpg",
  },
  {
    id: "nails",
    title: "Nail Atelier",
    description:
      "Gel extensions, intricate nail art, and restorative treatments. Your hands deserve the same luxury as the rest of you.",
    price: "From PKR 3,000",
    icon: "gem",
    image: "/images/service-nails.jpg",
  },
  {
    id: "spa",
    title: "Spa Sanctuary",
    description:
      "A tranquil escape offering aromatherapy massages, body scrubs, and holistic wellness rituals. Restore balance, rediscover serenity.",
    price: "From PKR 6,000",
    icon: "leaf",
    image: "/images/service-spa.jpg",
  },
] as const;

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Ayesha Rahman",
    role: "Bride, December 2025",
    quote:
      "Nabila and her team made me feel like royalty on my wedding day. Every detail was flawless — from the trial to the final touch. I couldn't have asked for a more magical experience.",
    rating: 5,
    image: "/images/testimonial-1.jpg",
  },
  {
    id: 2,
    name: "Fatima Sheikh",
    role: "VIP Member",
    quote:
      "The VIP membership has been the best investment in myself. The personalized attention, the priority bookings, and the exclusive treatments make me feel truly valued every single visit.",
    rating: 5,
    image: "/images/testimonial-2.jpg",
  },
  {
    id: 3,
    name: "Zara Malik",
    role: "Fashion Designer",
    quote:
      "As someone who works in fashion, I have high standards. Beauty Care by Nabila consistently exceeds them. The artistry and attention to detail is simply unmatched in Lahore.",
    rating: 5,
    image: "/images/testimonial-3.jpg",
  },
  {
    id: 4,
    name: "Mehreen Ali",
    role: "Bride, March 2026",
    quote:
      "I visited salons across Dubai and London, but the transformation I received here was extraordinary. The bridal package was worth every penny — I was breathtaking on my big day.",
    rating: 5,
    image: "/images/testimonial-4.jpg",
  },
] as const;

export const STATS = [
  { label: "Brides Transformed", value: 2500, suffix: "+" },
  { label: "Years of Excellence", value: 18, suffix: "" },
  { label: "Expert Artisans", value: 45, suffix: "+" },
  { label: "Client Satisfaction", value: 99, suffix: "%" },
] as const;

export const GALLERY_IMAGES = [
  { id: 1, src: "/images/gallery-1.jpg", alt: "Bridal Makeup Excellence", category: "bridal" },
  { id: 2, src: "/images/gallery-2.jpg", alt: "Hair Styling Artistry", category: "hair" },
  { id: 3, src: "/images/gallery-3.jpg", alt: "Skincare Treatment", category: "skincare" },
  { id: 4, src: "/images/gallery-4.jpg", alt: "Evening Glam Look", category: "makeup" },
  { id: 5, src: "/images/gallery-5.jpg", alt: "Bridal Mehndi Look", category: "bridal" },
  { id: 6, src: "/images/gallery-6.jpg", alt: "Nail Art Design", category: "nails" },
  { id: 7, src: "/images/gallery-7.jpg", alt: "Spa Relaxation", category: "spa" },
  { id: 8, src: "/images/gallery-8.jpg", alt: "Party Glam Makeup", category: "makeup" },
] as const;
