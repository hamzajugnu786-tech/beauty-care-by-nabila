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

// ─── HOME PAGE SERVICES ───
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

// ─── SERVICES PAGE: DETAILED CATEGORIES ───
export const SERVICE_CATEGORIES = [
  { id: "all", label: "All Services" },
  { id: "bridal", label: "Bridal" },
  { id: "hair", label: "Hair" },
  { id: "makeup", label: "Makeup" },
  { id: "skincare", label: "Skincare" },
  { id: "nails", label: "Nails" },
  { id: "spa", label: "Spa & Wellness" },
] as const;

export const DETAILED_SERVICES = [
  // ── Bridal ──
  {
    id: "bridal-signature",
    category: "bridal",
    title: "Signature Bridal Package",
    description:
      "Our most coveted bridal experience. A complete head-to-toe transformation including bespoke makeup, hairstyling, dupatta setting, and jewellery placement. Designed for the bride who deserves nothing less than perfection.",
    price: "PKR 150,000",
    duration: "5-6 hours",
    icon: "crown",
    features: [
      "Pre-bridal skin consultation",
      "Professional bridal makeup",
      "Hairstyling & dupatta setting",
      "Jewellery placement & styling",
      "Touch-up kit for the day",
      "On-site artist assistance",
    ],
    addOns: ["Extended touch-up support", "Pre-bridal glow facial", "Mehndi look styling"],
    popular: true,
  },
  {
    id: "bridal-elite",
    category: "bridal",
    title: "Elite Bridal Couture",
    description:
      "The ultimate bridal luxury for the discerning bride. This exclusive package includes multi-event styling, private suite access, and a dedicated team of senior artists who ensure every moment of your celebration is picture-perfect.",
    price: "PKR 250,000",
    duration: "Full day",
    icon: "crown",
    features: [
      "Multi-event styling (Barat + Walima)",
      "Private bridal suite access",
      "Senior artist dedicated team",
      "Custom lookbook creation",
      "Complimentary trial session",
      "Post-event touch-up kit",
    ],
    addOns: ["Destination wedding support", "Additional event styling", "Bridal party coordination"],
    popular: false,
  },
  {
    id: "bridal-mehndi",
    category: "bridal",
    title: "Mehndi & Mayon Styling",
    description:
      "Celebrate the joy of your pre-wedding events with vibrant, culturally rich styling. Our artists specialize in traditional Mehndi and Mayon looks that blend heritage with contemporary elegance for unforgettable celebrations.",
    price: "PKR 65,000",
    duration: "3-4 hours",
    icon: "crown",
    features: [
      "Traditional Mehndi look",
      "Floral jewellery styling",
      "Colour-coordinated makeup",
      "Braided or open hair styling",
    ],
    addOns: ["Fresh flower arrangement", "Henna hand design", "Dholki look styling"],
    popular: false,
  },
  // ── Hair ──
  {
    id: "hair-cut",
    category: "hair",
    title: "Precision Haircut",
    description:
      "Architectural precision meets artistic vision. Our internationally trained stylists sculpt each cut to complement your face shape, lifestyle, and personal aesthetic — delivering a look that feels effortlessly you.",
    price: "PKR 5,500",
    duration: "45-60 min",
    icon: "scissors",
    features: [
      "Face-shape analysis",
      "Customized cut & styling",
      "Wash & blow-dry",
      "Aftercare consultation",
    ],
    addOns: ["Deep conditioning treatment", "Keratin smoothing", "Scalp therapy"],
    popular: true,
  },
  {
    id: "hair-colour",
    category: "hair",
    title: "Colour Artistry",
    description:
      "From sun-kissed balayage to bold fashion colours, our colourists bring dimension and vibrancy to every strand. Using premium international products that protect while they transform, for colour that turns heads.",
    price: "PKR 12,000",
    duration: "2-3 hours",
    icon: "scissors",
    features: [
      "Colour consultation",
      "Premium international products",
      "Full or partial colour",
      "Toner & gloss treatment",
    ],
    addOns: ["Olaplex treatment", "Colour correction", "Highlights or lowlights"],
    popular: false,
  },
  {
    id: "hair-treatment",
    category: "hair",
    title: "Intensive Hair Therapy",
    description:
      "Restore, rebuild, and rejuvenate. Our signature hair treatments penetrate deep into the cortex to repair damage from heat, colour, and environmental stress. Experience the transformation your hair has been craving.",
    price: "PKR 8,000",
    duration: "60-90 min",
    icon: "scissors",
    features: [
      "Scalp & strand analysis",
      "Customized treatment protocol",
      "Keratin or protein infusion",
      "Steam therapy session",
    ],
    addOns: ["Hot oil ritual", "Scalp detox", "Split-end repair"],
    popular: false,
  },
  // ── Makeup ──
  {
    id: "makeup-party",
    category: "makeup",
    title: "Party Glam",
    description:
      "Command every room you enter. Our party glam service creates show-stopping looks that photograph beautifully and last from the first toast to the last dance. Because ordinary is never an option.",
    price: "PKR 8,000",
    duration: "60-90 min",
    icon: "palette",
    features: [
      "Skin prep & priming",
      "Full face makeup application",
      "Long-wear setting",
      "Touch-up powder compact",
    ],
    addOns: ["False lash application", "Hair styling combo", "Touch-up artist for event"],
    popular: true,
  },
  {
    id: "makeup-editorial",
    category: "makeup",
    title: "Editorial & Fashion",
    description:
      "Bold, artistic, and camera-ready. Our editorial makeup service is designed for photoshoots, fashion events, and creative projects where your look needs to tell a story and make a statement.",
    price: "PKR 15,000",
    duration: "90-120 min",
    icon: "palette",
    features: [
      "Creative direction & mood board",
      "High-fashion makeup application",
      "Multiple look options",
      "On-set touch-up support",
    ],
    addOns: ["Hair styling", "Wardrobe consultation", "Additional look changes"],
    popular: false,
  },
  {
    id: "makeup-natural",
    category: "makeup",
    title: "Effortless Elegance",
    description:
      "The art of looking effortlessly beautiful. Our natural makeup service enhances your best features with a light, luminous touch — perfect for daytime events, brunches, and moments that call for understated sophistication.",
    price: "PKR 5,500",
    duration: "45-60 min",
    icon: "palette",
    features: [
      "Skin-perfecting base",
      "Subtle contour & highlight",
      "Natural lip enhancement",
      "Dewy finish setting",
    ],
    addOns: ["Brow shaping", "Lash tint", "Skincare facial prep"],
    popular: false,
  },
  // ── Skincare ──
  {
    id: "skin-signature",
    category: "skincare",
    title: "Signature Facial",
    description:
      "Our signature facial is a sensory journey that transforms your skin from within. Combining advanced extraction techniques, custom serum infusion, and LED light therapy for results you can see and feel instantly.",
    price: "PKR 6,500",
    duration: "75-90 min",
    icon: "sparkles",
    features: [
      "Deep cleansing & exfoliation",
      "Customized serum infusion",
      "LED light therapy",
      "Lymphatic drainage massage",
    ],
    addOns: ["Chemical peel boost", "Microcurrent lifting", "Collagen sheet mask"],
    popular: true,
  },
  {
    id: "skin-hydra",
    category: "skincare",
    title: "HydraGlow Treatment",
    description:
      "The gold standard in skin rejuvenation. Our HydraGlow treatment uses advanced hydra-dermabrasion technology to deeply cleanse, extract, and hydrate — delivering an instant red-carpet glow that lasts for weeks.",
    price: "PKR 12,000",
    duration: "60-75 min",
    icon: "sparkles",
    features: [
      "Hydra-dermabrasion",
      "Acid peel application",
      "Vortex extraction",
      "Intensive serum hydration",
    ],
    addOns: ["LED therapy", "Collagen infusion", "Neck & décolleté treatment"],
    popular: false,
  },
  {
    id: "skin-peel",
    category: "skincare",
    title: "Chemical Peel",
    description:
      "Scientifically formulated to resurface and renew. Our chemical peels address hyperpigmentation, acne scars, fine lines, and uneven texture — revealing the luminous, even-toned skin beneath the surface.",
    price: "PKR 8,000",
    duration: "45-60 min",
    icon: "sparkles",
    features: [
      "Skin assessment & preparation",
      "Customized peel formulation",
      "Neutralization & cooling",
      "Post-peel aftercare kit",
    ],
    addOns: ["Pre-peel prep facial", "Post-peel recovery mask", "Home care regimen"],
    popular: false,
  },
  // ── Nails ──
  {
    id: "nails-gel",
    category: "nails",
    title: "Gel Extensions",
    description:
      "Sculpted to perfection. Our gel extensions offer length, strength, and elegance with a natural-looking finish. Choose from classic, almond, stiletto, or coffin shapes — each hand-crafted for a flawless fit.",
    price: "PKR 5,500",
    duration: "90-120 min",
    icon: "gem",
    features: [
      "Nail shaping & preparation",
      "Custom gel extension application",
      "Choice of shape & length",
      "Gel colour or French tip",
    ],
    addOns: ["Nail art design", "Chrome or mirror finish", "3D embellishments"],
    popular: true,
  },
  {
    id: "nails-art",
    category: "nails",
    title: "Nail Art Studio",
    description:
      "Your nails, elevated to wearable art. From minimalist line work to intricate hand-painted designs, our nail artists bring your vision to life with precision and creativity that makes every gesture a statement.",
    price: "PKR 3,000",
    duration: "60-90 min",
    icon: "gem",
    features: [
      "Consultation & design",
      "Hand-painted artistry",
      "Premium quality pigments",
      "Top coat & sealant",
    ],
    addOns: ["Gel overlay", "Rhinestone placement", "Additional art complexity"],
    popular: false,
  },
  {
    id: "nails-manicure",
    category: "nails",
    title: "Luxury Manicure & Pedicure",
    description:
      "The foundation of beautiful nails. Our luxury mani-pedi combines aromatic soaking, expert cuticle care, deep moisturizing, and flawless polish application — a ritual of care your hands and feet deserve.",
    price: "PKR 3,500",
    duration: "60-75 min",
    icon: "gem",
    features: [
      "Aromatic soak & exfoliation",
      "Cuticle care & shaping",
      "Paraffin wax treatment",
      "Gel polish application",
    ],
    addOns: ["Hot stone massage", "Callus treatment", "Extended massage time"],
    popular: false,
  },
  // ── Spa & Wellness ──
  {
    id: "spa-massage",
    category: "spa",
    title: "Aromatherapy Massage",
    description:
      "Surrender to the healing power of touch. Our aromatherapy massage blends essential oils with expert techniques to melt away tension, ease sore muscles, and restore the harmony between body and mind.",
    price: "PKR 7,000",
    duration: "60-90 min",
    icon: "leaf",
    features: [
      "Essential oil selection",
      "Full body massage",
      "Hot towel treatment",
      "Relaxation tea service",
    ],
    addOns: ["Extended session time", "Deep tissue upgrade", "Scalp massage addition"],
    popular: true,
  },
  {
    id: "spa-body",
    category: "spa",
    title: "Body Polish & Glow",
    description:
      "Silk meets skin. Our body polish treatment uses fine botanical exfoliants and hydrating oils to buff away dullness, revealing soft, luminous, irresistibly touchable skin from head to toe.",
    price: "PKR 6,000",
    duration: "60 min",
    icon: "leaf",
    features: [
      "Full body exfoliation",
      "Hydrating body wrap",
      "Moisturizing massage",
      "Shimmer body oil finish",
    ],
    addOns: ["Vichy shower", "Detox body wrap", "Self-tan application"],
    popular: false,
  },
  {
    id: "spa-ritual",
    category: "spa",
    title: "Royal Wellness Ritual",
    description:
      "The pinnacle of our spa experience. A three-hour journey of restoration that combines massage, body treatments, and facial care into one transcendent escape. For those who believe self-care is not a luxury but a necessity.",
    price: "PKR 18,000",
    duration: "3 hours",
    icon: "leaf",
    features: [
      "Full body massage",
      "Body polish & wrap",
      "Signature facial",
      "Scalp & foot massage",
    ],
    addOns: ["Private suite upgrade", "Champagne service", "Extended relaxation time"],
    popular: false,
  },
] as const;

// ─── BRIDAL STUDIO PAGE DATA ───
export const BRIDAL_PACKAGES = [
  {
    id: "essential",
    name: "Essential Bride",
    tagline: "Timeless Elegance",
    price: "PKR 85,000",
    description:
      "The perfect beginning to your bridal journey. Our Essential package provides the core artistry and attention that every bride deserves — professional makeup, hairstyling, and the confidence that comes from knowing you look your absolute best.",
    includes: [
      "Professional bridal makeup",
      "Bridal hairstyling",
      "Dupatta & jewellery setting",
      "Touch-up kit",
      "One trial session",
    ],
    highlight: false,
    color: "gold" as const,
  },
  {
    id: "signature",
    name: "Signature Bride",
    tagline: "The Nabila Experience",
    price: "PKR 150,000",
    description:
      "Our most beloved bridal package, trusted by over 2,500 brides. The Signature experience goes beyond beauty — it is a journey of transformation that begins with a personal consultation and culminates in a look that will be cherished in photographs for generations to come.",
    includes: [
      "Everything in Essential, plus",
      "Pre-bridal skin consultation",
      "Two trial sessions",
      "On-site artist assistance",
      "Custom lookbook",
      "Mehndi evening look",
      "Post-event touch-up support",
    ],
    highlight: true,
    color: "champagne" as const,
  },
  {
    id: "couture",
    name: "Couture Bride",
    tagline: "Uncompromising Luxury",
    price: "PKR 250,000",
    description:
      "For the bride who accepts nothing less than extraordinary. The Couture experience is a fully bespoke journey with a dedicated senior artist team, private suite access, and multi-event styling that ensures you are breathtaking at every moment of your celebration.",
    includes: [
      "Everything in Signature, plus",
      "Private bridal suite",
      "Dedicated senior artist team",
      "Multi-event styling (all events)",
      "Destination support available",
      "Bridal party coordination",
      "Complimentary spa treatment",
      "VIP membership (6 months)",
    ],
    highlight: false,
    color: "ivory" as const,
  },
] as const;

export const BRIDAL_ARTISTS = [
  {
    id: "nabila",
    name: "Nabila",
    title: "Founder & Creative Director",
    bio: "With 18 years of artistry and over 2,500 brides transformed, Nabila is the visionary behind Lahore's most celebrated bridal studio. Trained in London and Milan, she brings international expertise fused with deep cultural understanding to every transformation.",
    specialties: ["Bridal Couture", "Traditional Redesign", "Celebrity Styling"],
    experience: "18+ years",
    image: "/images/artist-nabila.jpg",
  },
  {
    id: "sana",
    name: "Sana Khan",
    title: "Senior Bridal Artist",
    bio: "Sana's deft hand and keen eye for detail have made her one of Lahore's most sought-after bridal artists. Her ability to blend contemporary trends with timeless elegance ensures every bride feels both modern and regal on their special day.",
    specialties: ["Contemporary Bridal", "Airbrush Techniques", "Hairstyling"],
    experience: "10+ years",
    image: "/images/artist-sana.jpg",
  },
  {
    id: "amara",
    name: "Amara Hussain",
    title: "Bridal Makeup Specialist",
    bio: "Amara specializes in the art of transformation. Her mastery of colour theory and facial architecture allows her to create looks that are both photogenic and breathtaking in person — a rare combination that brides cherish forever.",
    specialties: ["Colour Theory", "HD & Airbrush", "Skin Preparation"],
    experience: "8+ years",
    image: "/images/artist-amara.jpg",
  },
  {
    id: "zoya",
    name: "Zoya Malik",
    title: "Hair & Bridal Stylist",
    bio: "From intricate updos to cascading waves, Zoya's hairstyling is nothing short of sculptural art. Trained at the Vidal Sassoon Academy in London, she brings world-class technique and cultural artistry to every bridal look she creates.",
    specialties: ["Bridal Updos", "Hair Extensions", "Traditional Styling"],
    experience: "7+ years",
    image: "/images/artist-zoya.jpg",
  },
] as const;

export const BRIDAL_TIMELINE = [
  {
    phase: "3 Months Before",
    title: "The Vision Begins",
    description:
      "Your bridal journey starts with an intimate consultation at our studio. Over curated tea, we discuss your vision, explore your outfit aesthetics, and begin crafting the blueprint for your perfect bridal look. This is where dreams take shape.",
    icon: "sparkles",
  },
  {
    phase: "6 Weeks Before",
    title: "The First Reveal",
    description:
      "The trial session is where artistry meets your imagination. Our team creates a complete preview of your bridal look, and together we refine every detail — from the wing of your liner to the drape of your dupatta — until it exceeds your expectations.",
    icon: "eye",
  },
  {
    phase: "2 Weeks Before",
    title: "Skin & Soul Preparation",
    description:
      "Beauty begins beneath the surface. Our pre-bridal skincare regimen is designed to ensure your skin is luminous, hydrated, and photo-ready. A curated treatment plan transforms your complexion so makeup glides on flawlessly on the big day.",
    icon: "heart",
  },
  {
    phase: "The Day Before",
    title: "Calm & Centre",
    description:
      "The evening before your wedding, we invite you for a calming ritual — a gentle facial, aromatherapy, and moment of stillness. You will leave our studio feeling centred, radiant, and ready to embrace the most beautiful day of your life.",
    icon: "moon",
  },
  {
    phase: "The Big Day",
    title: "The Grand Transformation",
    description:
      "This is the moment we have been building toward. In the sanctuary of our studio, our artisans work their magic — every brushstroke, every pin, every shimmer placed with intention. When you look in the mirror, you will see the most beautiful version of yourself.",
    icon: "crown",
  },
  {
    phase: "Throughout The Day",
    title: "Unwavering Support",
    description:
      "From the first photograph to the last dance, our team remains by your side. Touch-ups, adjustments, and the quiet reassurance that you look absolutely flawless — because your beauty should never be something you worry about on your wedding day.",
    icon: "shield",
  },
] as const;

export const BEFORE_AFTER_TRANSFORMATIONS = [
  {
    id: 1,
    title: "Ayesha's Barat Transformation",
    category: "bridal",
    description: "A classic red & gold bridal look that honoured tradition while making a contemporary statement.",
  },
  {
    id: 2,
    title: "Fatima's Walima Glow",
    category: "bridal",
    description: "Soft, luminous elegance for a walima celebration that captivated every guest in the room.",
  },
  {
    id: 3,
    title: "Zara's Mehndi Vibrance",
    category: "mehndi",
    description: "A joyful burst of colour and artistry that perfectly captured the spirit of celebration.",
  },
  {
    id: 4,
    title: "Mehreen's Contemporary Edit",
    category: "editorial",
    description: "Modern minimalism meets high fashion for a photoshoot that redefined elegance.",
  },
  {
    id: 5,
    title: "Sana's Party Glam",
    category: "party",
    description: "Dramatic eyes and luminous skin — a look designed to own the night and every photograph.",
  },
  {
    id: 6,
    title: "Irum's Skin Transformation",
    category: "skincare",
    description: "A 6-week skin journey from stressed and dull to radiant, even-toned, and glowing with health.",
  },
] as const;

// ─── GALLERY PAGE DATA ───
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

export const GALLERY_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "bridal", label: "Bridal" },
  { id: "hair", label: "Hair" },
  { id: "makeup", label: "Makeup" },
  { id: "skincare", label: "Skincare" },
  { id: "nails", label: "Nails" },
  { id: "spa", label: "Spa" },
  { id: "transformation", label: "Transformations" },
] as const;

export const GALLERY_MASONRY_ITEMS = [
  { id: 1, src: "/images/gallery-1.jpg", alt: "Regal Bridal Transformation", category: "bridal", height: "tall" as const },
  { id: 2, src: "/images/gallery-2.jpg", alt: "Precision Hair Sculpting", category: "hair", height: "medium" as const },
  { id: 3, src: "/images/gallery-3.jpg", alt: "Luminous Skin Glow", category: "skincare", height: "short" as const },
  { id: 4, src: "/images/gallery-4.jpg", alt: "Evening Glam Artistry", category: "makeup", height: "tall" as const },
  { id: 5, src: "/images/gallery-5.jpg", alt: "Mehndi Celebration Look", category: "bridal", height: "medium" as const },
  { id: 6, src: "/images/gallery-6.jpg", alt: "Intricate Nail Art", category: "nails", height: "short" as const },
  { id: 7, src: "/images/gallery-7.jpg", alt: "Spa Sanctuary Escape", category: "spa", height: "tall" as const },
  { id: 8, src: "/images/gallery-8.jpg", alt: "Party Night Glam", category: "makeup", height: "medium" as const },
  { id: 9, src: "/images/gallery-9.jpg", alt: "Bridal Couture Detail", category: "bridal", height: "short" as const },
  { id: 10, src: "/images/gallery-10.jpg", alt: "Balayage Perfection", category: "hair", height: "tall" as const },
  { id: 11, src: "/images/gallery-11.jpg", alt: "Bridal Before & After", category: "transformation", height: "medium" as const },
  { id: 12, src: "/images/gallery-12.jpg", alt: "Facial Treatment Bliss", category: "skincare", height: "short" as const },
  { id: 13, src: "/images/gallery-13.jpg", alt: "Red Carpet Ready", category: "makeup", height: "tall" as const },
  { id: 14, src: "/images/gallery-14.jpg", alt: "Gel Extension Art", category: "nails", height: "medium" as const },
  { id: 15, src: "/images/gallery-15.jpg", alt: "Aromatherapy Session", category: "spa", height: "short" as const },
  { id: 16, src: "/images/gallery-16.jpg", alt: "Skin Transformation Journey", category: "transformation", height: "tall" as const },
  { id: 17, src: "/images/gallery-17.jpg", alt: "Barat Day Beauty", category: "bridal", height: "medium" as const },
  { id: 18, src: "/images/gallery-18.jpg", alt: "Updo Masterclass", category: "hair", height: "short" as const },
] as const;

// ─── HOME PAGE STATS ───
export const STATS = [
  { label: "Brides Transformed", value: 2500, suffix: "+" },
  { label: "Years of Excellence", value: 18, suffix: "" },
  { label: "Expert Artisans", value: 45, suffix: "+" },
  { label: "Client Satisfaction", value: 99, suffix: "%" },
] as const;

// ─── HOME PAGE TESTIMONIALS ───
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
