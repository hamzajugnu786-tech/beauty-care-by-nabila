"use client";

import { motion } from "framer-motion";
import { BRAND } from "@/lib/constants";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

export function AccessibilityStatementContent() {
  return (
    <div className="section-padding section-gap max-w-4xl mx-auto">
      {/* Header */}
      <motion.div {...fadeInUp} className="text-center mb-16">
        <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.3em] text-champagne-gold mb-4">
          Our Commitment
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl md:text-6xl text-text-primary mb-6">
          Accessibility Statement
        </h1>
        <div className="w-16 h-px bg-champagne-gold mx-auto mb-8" />
        <p className="font-[family-name:var(--font-cormorant)] text-xl text-text-muted leading-relaxed max-w-2xl mx-auto">
          Beauty Care by Nabila Lahore is committed to ensuring digital accessibility
          for people with disabilities. We continually improve the user experience
          for everyone and apply relevant accessibility standards.
        </p>
      </motion.div>

      {/* Compliance Statement */}
      <Section title="Compliance Status">
        <p className="font-[family-name:var(--font-cormorant)] text-lg text-text-muted leading-relaxed mb-4">
          We are committed to making our website accessible in accordance with the
          Web Content Accessibility Guidelines (WCAG) 2.1 at the AA level. These
          guidelines explain how to make web content more accessible to people with
          a wide range of disabilities, and making it more usable for everyone.
        </p>
        <div className="bg-dark-card border border-border-gold rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-champagne-gold/10 flex items-center justify-center flex-shrink-0 mt-1">
              <svg
                className="w-5 h-5 text-champagne-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-inter)] text-sm uppercase tracking-widest text-champagne-gold mb-2">
                WCAG 2.1 Level AA
              </h3>
              <p className="font-[family-name:var(--font-cormorant)] text-base text-text-muted leading-relaxed">
                Our website is partially conformant with WCAG 2.1 Level AA. Partially
                conformant means that some parts of the content do not fully conform
                to the accessibility standard. We are actively working to achieve
                full conformance.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Measures Taken */}
      <Section title="Measures We Have Taken">
        <p className="font-[family-name:var(--font-cormorant)] text-lg text-text-muted leading-relaxed mb-6">
          We have taken the following measures to ensure accessibility of our website:
        </p>
        <ul className="space-y-4" role="list">
          {[
            "Include accessibility as part of our design and development process",
            "Assign clear accessibility targets and responsibilities",
            "Employ formal accessibility quality assurance methods",
            "Ensure all interactive elements are keyboard accessible",
            "Provide skip navigation links for keyboard users",
            "Maintain a minimum 4.5:1 contrast ratio for normal text and 3:1 for large text",
            "Use semantic HTML elements throughout the application",
            "Implement ARIA landmarks and roles for screen reader navigation",
            "Provide visible focus indicators on all interactive elements",
            "Support screen readers with ARIA live regions for dynamic content",
            "Ensure form fields have proper labels and error messages",
            "Design responsive layouts that work across all device sizes",
            "Respect user preferences for reduced motion",
            "Provide alternative text for all meaningful images",
            "Test with assistive technologies including screen readers",
          ].map((measure, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="w-1.5 h-1.5 rounded-full bg-champagne-gold mt-2.5 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="font-[family-name:var(--font-cormorant)] text-base text-text-muted leading-relaxed">
                {measure}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Accessibility Features */}
      <Section title="Accessibility Features">
        <p className="font-[family-name:var(--font-cormorant)] text-lg text-text-muted leading-relaxed mb-6">
          Our website includes the following accessibility features:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "Skip Navigation",
              description:
                "Skip links at the top of every page allow keyboard users to jump directly to main content, booking, or navigation.",
            },
            {
              title: "Keyboard Navigation",
              description:
                "All interactive elements can be accessed and operated using keyboard alone, following WAI-ARIA design patterns.",
            },
            {
              title: "Focus Management",
              description:
                "Visible focus indicators on all interactive elements, with focus trapping in modals and dialogs.",
            },
            {
              title: "Screen Reader Support",
              description:
                "ARIA landmarks, live regions, and semantic HTML provide comprehensive screen reader announcements.",
            },
            {
              title: "High Contrast Design",
              description:
                "Ivory text on dark backgrounds ensures a minimum 4.5:1 contrast ratio. Gold accents meet large text contrast requirements.",
            },
            {
              title: "Reduced Motion",
              description:
                "Animations and transitions are disabled or simplified for users who prefer reduced motion in their system settings.",
            },
            {
              title: "Responsive Design",
              description:
                "Content adapts to all screen sizes with touch-friendly targets of at least 44px on mobile devices.",
            },
            {
              title: "Form Accessibility",
              description:
                "All form fields include visible labels, error messages are announced to screen readers, and required fields are clearly marked.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-dark-card border border-border-gold rounded-lg p-5"
            >
              <h3 className="font-[family-name:var(--font-inter)] text-xs uppercase tracking-widest text-champagne-gold mb-2">
                {feature.title}
              </h3>
              <p className="font-[family-name:var(--font-cormorant)] text-base text-text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Known Limitations */}
      <Section title="Known Limitations">
        <p className="font-[family-name:var(--font-cormorant)] text-lg text-text-muted leading-relaxed mb-6">
          Despite our best efforts, some accessibility limitations may exist on our website:
        </p>
        <div className="space-y-4">
          {[
            {
              limitation: "Third-party embedded content",
              description:
                "Some third-party content (social media embeds, maps) may not fully conform to WCAG 2.1 AA. We monitor and work with providers to improve accessibility.",
            },
            {
              limitation: "Image gallery interactions",
              description:
                "Complex image gallery lightboxes may have limited screen reader support. We are working on improving this experience.",
            },
            {
              limitation: "Video content captions",
              description:
                "Not all video content may have closed captions available. We are working to add captions to all video content.",
            },
            {
              limitation: "Dynamic content updates",
              description:
                "Some real-time content updates may not be fully announced by all screen reader and browser combinations.",
            },
          ].map((item) => (
            <div
              key={item.limitation}
              className="bg-dark-card/50 border border-border-gold/50 rounded-lg p-5"
            >
              <h3 className="font-[family-name:var(--font-inter)] text-sm text-text-primary mb-1">
                {item.limitation}
              </h3>
              <p className="font-[family-name:var(--font-cormorant)] text-base text-text-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        <p className="font-[family-name:var(--font-cormorant)] text-base text-text-muted leading-relaxed mt-6">
          If you encounter an accessibility issue that is not listed above, please
          contact us using the details below. We take accessibility issues seriously
          and will make reasonable efforts to address them.
        </p>
      </Section>

      {/* Compatibility */}
      <Section title="Compatibility">
        <p className="font-[family-name:var(--font-cormorant)] text-lg text-text-muted leading-relaxed mb-6">
          Our website is designed to be compatible with the following assistive
          technologies and browsers:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-dark-card border border-border-gold rounded-lg p-6">
            <h3 className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.25em] text-champagne-gold mb-4">
              Assistive Technologies
            </h3>
            <ul className="space-y-2" role="list">
              {[
                "NVDA (NonVisual Desktop Access)",
                "JAWS (Job Access With Speech)",
                "VoiceOver (macOS and iOS)",
                "TalkBack (Android)",
                "Dragon NaturallySpeaking",
              ].map((tech) => (
                <li
                  key={tech}
                  className="font-[family-name:var(--font-cormorant)] text-base text-text-muted flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-champagne-gold/50" aria-hidden="true" />
                  {tech}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-dark-card border border-border-gold rounded-lg p-6">
            <h3 className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.25em] text-champagne-gold mb-4">
              Browsers
            </h3>
            <ul className="space-y-2" role="list">
              {[
                "Google Chrome (latest 2 versions)",
                "Mozilla Firefox (latest 2 versions)",
                "Safari (latest 2 versions)",
                "Microsoft Edge (latest 2 versions)",
                "Samsung Internet (latest version)",
              ].map((browser) => (
                <li
                  key={browser}
                  className="font-[family-name:var(--font-cormorant)] text-base text-text-muted flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-champagne-gold/50" aria-hidden="true" />
                  {browser}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="font-[family-name:var(--font-cormorant)] text-base text-text-muted leading-relaxed mt-6">
          While we strive for broad compatibility, the website may not display
          optimally in older browsers or with outdated assistive technology versions.
          We recommend using the latest versions of both browsers and assistive
          technologies for the best experience.
        </p>
      </Section>

      {/* Technical Specifications */}
      <Section title="Technical Specifications">
        <p className="font-[family-name:var(--font-cormorant)] text-lg text-text-muted leading-relaxed mb-6">
          Accessibility of this website relies on the following technologies:
        </p>
        <ul className="space-y-3" role="list">
          {[
            "HTML5 semantic elements for document structure",
            "WAI-ARIA 1.2 for roles, states, and properties",
            "CSS3 for visual presentation and responsive design",
            "JavaScript for progressive enhancement of interactivity",
            "Next.js 16 server-side rendering for optimal loading",
          ].map((spec, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="w-1.5 h-1.5 rounded-full bg-champagne-gold mt-2.5 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="font-[family-name:var(--font-cormorant)] text-base text-text-muted leading-relaxed">
                {spec}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Contact Information */}
      <Section title="Feedback & Contact">
        <p className="font-[family-name:var(--font-cormorant)] text-lg text-text-muted leading-relaxed mb-6">
          We welcome your feedback on the accessibility of our website. If you
          encounter any accessibility barriers or have suggestions for improvement,
          please contact us:
        </p>
        <div className="bg-dark-card border border-champagne-gold/20 rounded-lg p-6 sm:p-8">
          <div className="space-y-4">
            <div>
              <h3 className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.25em] text-champagne-gold mb-2">
                Email
              </h3>
              <a
                href={`mailto:${BRAND.email}`}
                className="font-[family-name:var(--font-cormorant)] text-lg text-text-primary hover:text-champagne-gold transition-colors duration-300"
              >
                {BRAND.email}
              </a>
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.25em] text-champagne-gold mb-2">
                Phone
              </h3>
              <a
                href={`tel:${BRAND.phone}`}
                className="font-[family-name:var(--font-cormorant)] text-lg text-text-primary hover:text-champagne-gold transition-colors duration-300"
              >
                {BRAND.phone}
              </a>
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.25em] text-champagne-gold mb-2">
                Postal Address
              </h3>
              <p className="font-[family-name:var(--font-cormorant)] text-lg text-text-primary">
                {BRAND.address}
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border-gold/30">
            <p className="font-[family-name:var(--font-cormorant)] text-base text-text-muted leading-relaxed">
              We aim to respond to accessibility feedback within 2 business days and
              to propose a solution within 10 business days. We are committed to
              resolving issues promptly and transparently.
            </p>
          </div>
        </div>
      </Section>

      {/* Assessment Method */}
      <Section title="Assessment Approach">
        <p className="font-[family-name:var(--font-cormorant)] text-lg text-text-muted leading-relaxed mb-6">
          We assess the accessibility of our website through the following methods:
        </p>
        <ul className="space-y-3" role="list">
          {[
            "Self-evaluation using automated testing tools (axe, Lighthouse)",
            "Manual evaluation by our development team",
            "Testing with screen readers (NVDA, VoiceOver)",
            "Keyboard-only navigation testing",
            "External evaluation by accessibility specialists",
            "User feedback and issue reports",
          ].map((method, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="w-1.5 h-1.5 rounded-full bg-champagne-gold mt-2.5 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="font-[family-name:var(--font-cormorant)] text-base text-text-muted leading-relaxed">
                {method}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Formal Complaints */}
      <Section title="Formal Complaints">
        <p className="font-[family-name:var(--font-cormorant)] text-lg text-text-muted leading-relaxed">
          If you are not satisfied with our response to an accessibility issue, you
          may contact the relevant authority in your jurisdiction. In Pakistan, you
          can reach out to the relevant digital rights or disability rights
          organizations. We are committed to working with regulatory bodies to
          ensure our digital presence meets or exceeds accessibility standards.
        </p>
      </Section>

      {/* Date */}
      <div className="text-center mt-16 pt-8 border-t border-border-gold/20">
        <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.15em] text-text-muted/50">
          This statement was created on 1 March 2026 and was last reviewed on 4 March 2026.
        </p>
      </div>
    </div>
  );
}

// ─── Section Component ───

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mb-16"
      aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <h2
        id={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}
        className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl text-text-primary mb-6"
      >
        {title}
      </h2>
      {children}
    </motion.section>
  );
}
