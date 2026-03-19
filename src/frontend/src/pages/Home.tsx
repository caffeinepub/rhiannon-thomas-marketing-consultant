import { useEffect, useState } from "react";
import { useSiteContent } from "../hooks/useSiteContent";
import type { SiteContent } from "../types/content";

// Listen for content updates across tabs
function useSharedContent() {
  const { content: localContent } = useSiteContent();
  const [content, setContent] = useState<SiteContent>(localContent);

  useEffect(() => {
    setContent(localContent);
  }, [localContent]);

  useEffect(() => {
    const handler = () => {
      const raw = localStorage.getItem("rt_site_content");
      if (raw) {
        try {
          setContent(JSON.parse(raw));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return content;
}

export default function Home() {
  const content = useSharedContent();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Sprint", href: "#sprint" },
    { label: "Services", href: "#services" },
    { label: "Resources", href: "#resources" },
    { label: "Substack", href: "#substack" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div className="min-h-screen font-sans">
      {/* Sticky Nav */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <a
            href="/"
            className="text-black font-medium text-sm tracking-tight"
            style={{ textDecoration: "none" }}
          >
            Rhiannon Thomas
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                data-ocid={`nav.link.${i + 1}`}
                className="text-black text-sm font-medium tracking-wide hover:underline underline-offset-4"
                style={{ textDecoration: "none" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-px bg-black transition-all ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-px bg-black transition-all ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-px bg-black transition-all ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-black">
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                data-ocid={`nav.link.${i + 1}`}
                className="block px-6 py-4 text-black text-sm font-medium border-b border-black last:border-0"
                style={{ textDecoration: "none" }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* 01 — Hero */}
      <section
        id="hero"
        className="relative bg-white overflow-hidden"
        style={{ minHeight: "90vh", display: "flex", alignItems: "center" }}
      >
        <span
          className="ghost-number ghost-number-white"
          style={{ top: "-4%", right: "-2%" }}
        >
          01
        </span>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full py-32">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-black mb-8">
            Marketing Specialist
          </p>
          <h1
            className="text-black mb-8"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              maxWidth: "14ch",
            }}
          >
            {content.hero.headline}
          </h1>
          <p
            className="text-black mb-14"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.3rem)",
              fontWeight: 300,
              lineHeight: 1.6,
              maxWidth: "44ch",
              opacity: 0.7,
            }}
          >
            {content.hero.subheadline}
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <a
              href={content.hero.ctaLink}
              className="btn-black"
              data-ocid="hero.primary_button"
            >
              {content.hero.ctaText}
            </a>
            <a
              href={content.hero.secondaryLink}
              className="btn-outline-black"
              data-ocid="hero.secondary_button"
            >
              {content.hero.secondaryText}
            </a>
          </div>
        </div>
      </section>

      {/* 02 — GTM Direction Sprint */}
      <section
        id="sprint"
        className="relative bg-black overflow-hidden"
        style={{ minHeight: "70vh", display: "flex", alignItems: "center" }}
      >
        <span
          className="ghost-number ghost-number-black"
          style={{ top: "-4%", right: "-2%" }}
        >
          02
        </span>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full py-28">
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase text-white mb-6"
            style={{ opacity: 0.5 }}
          >
            02
          </p>
          <h2
            className="text-white mb-8"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            {content.sprint.heading}
          </h2>
          <p
            className="text-white mb-10"
            style={{
              fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
              fontWeight: 300,
              lineHeight: 1.7,
              maxWidth: "52ch",
              opacity: 0.75,
            }}
          >
            {content.sprint.description}
          </p>
          <ul className="mb-12 space-y-3">
            {content.sprint.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-center gap-3 text-white"
                style={{ fontSize: "1rem", fontWeight: 400 }}
              >
                <span
                  className="block w-6 h-px bg-white"
                  style={{ opacity: 0.5, flexShrink: 0 }}
                />
                {bullet}
              </li>
            ))}
          </ul>
          <a
            href={content.sprint.ctaLink}
            className="btn-white"
            data-ocid="sprint.primary_button"
          >
            {content.sprint.ctaText}
          </a>
        </div>
      </section>

      {/* 03 — Services */}
      <section
        id="services"
        className="relative bg-white overflow-hidden"
        style={{ minHeight: "70vh", display: "flex", alignItems: "center" }}
      >
        <span
          className="ghost-number ghost-number-white"
          style={{ top: "-4%", right: "-2%" }}
        >
          03
        </span>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full py-28">
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase text-black mb-6"
            style={{ opacity: 0.4 }}
          >
            03
          </p>
          <h2
            className="text-black mb-16"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            {content.services.heading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black">
            {content.services.items.map((item) => (
              <div
                key={item.title}
                className="bg-white p-8 md:p-10"
                style={{ border: "1px solid #000" }}
              >
                <h3
                  className="text-black mb-4"
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-black"
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 300,
                    lineHeight: 1.6,
                    opacity: 0.7,
                  }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — Resources */}
      <section
        id="resources"
        className="relative bg-black overflow-hidden"
        style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}
      >
        <span
          className="ghost-number ghost-number-black"
          style={{ top: "-4%", right: "-2%" }}
        >
          04
        </span>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full py-28">
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase text-white mb-6"
            style={{ opacity: 0.5 }}
          >
            04
          </p>
          <h2
            className="text-white mb-14"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            {content.resources.heading}
          </h2>

          {content.resources.items.length === 0 ? (
            <p
              className="text-white"
              data-ocid="resources.empty_state"
              style={{ opacity: 0.4, fontSize: "1rem", fontWeight: 300 }}
            >
              No resources yet. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white">
              {content.resources.items.map((item, i) => (
                <div
                  key={item.id}
                  data-ocid={`resources.item.${i + 1}`}
                  className="bg-black p-8"
                  style={{ border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className="text-xs font-semibold tracking-widest uppercase"
                      style={{
                        border: "1px solid rgba(255,255,255,0.6)",
                        color: "#fff",
                        padding: "3px 8px",
                      }}
                    >
                      {item.isPaid ? "PAID" : "FREE"}
                    </span>
                  </div>
                  <h3
                    className="text-white mb-3"
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-white mb-6"
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 300,
                      lineHeight: 1.6,
                      opacity: 0.65,
                    }}
                  >
                    {item.description}
                  </p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-white"
                    style={{ fontSize: "12px", padding: "10px 20px" }}
                  >
                    {item.isPaid ? "Get access →" : "Download →"}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 05 — Substack */}
      <section
        id="substack"
        className="relative bg-white overflow-hidden"
        style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}
      >
        <span
          className="ghost-number ghost-number-white"
          style={{ top: "-4%", right: "-2%" }}
        >
          05
        </span>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full py-28">
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase text-black mb-6"
            style={{ opacity: 0.4 }}
          >
            05
          </p>
          <h2
            className="text-black mb-8"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            {content.substack.heading}
          </h2>
          <p
            className="text-black mb-12"
            style={{
              fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
              fontWeight: 300,
              lineHeight: 1.7,
              maxWidth: "52ch",
              opacity: 0.7,
            }}
          >
            {content.substack.copy}
          </p>
          <a
            href={content.substack.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-black"
            data-ocid="substack.primary_button"
          >
            {content.substack.ctaText}
          </a>
        </div>
      </section>

      {/* 06 — Portfolio */}
      <section
        id="portfolio"
        className="relative bg-black overflow-hidden"
        style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}
      >
        <span
          className="ghost-number ghost-number-black"
          style={{ top: "-4%", right: "-2%" }}
        >
          06
        </span>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full py-28">
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase text-white mb-6"
            style={{ opacity: 0.5 }}
          >
            06
          </p>
          <h2
            className="text-white mb-14"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            {content.portfolio.heading}
          </h2>

          {content.portfolio.item === null ? (
            <p
              className="text-white"
              data-ocid="portfolio.empty_state"
              style={{ opacity: 0.4, fontSize: "1rem", fontWeight: 300 }}
            >
              No portfolio items yet.
            </p>
          ) : (
            <div
              className="flex flex-col md:flex-row gap-8 md:gap-12 items-start"
              data-ocid="portfolio.card"
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "2rem",
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <img
                  src={content.portfolio.item.thumbnailUrl}
                  alt={content.portfolio.item.title}
                  style={{
                    width: "280px",
                    height: "200px",
                    objectFit: "cover",
                    display: "block",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                />
              </div>
              <div
                className="flex flex-col justify-between"
                style={{ flex: 1 }}
              >
                <div>
                  <h3
                    className="text-white mb-4"
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {content.portfolio.item.title}
                  </h3>
                  <p
                    className="text-white mb-8"
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 300,
                      lineHeight: 1.7,
                      opacity: 0.7,
                    }}
                  >
                    {content.portfolio.item.description}
                  </p>
                </div>
                <a
                  href={content.portfolio.item.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-white"
                  data-ocid="portfolio.primary_button"
                  style={{ alignSelf: "flex-start" }}
                >
                  View PDF →
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 07 — Contact */}
      <section
        id="contact"
        className="relative bg-white overflow-hidden"
        style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}
      >
        <span
          className="ghost-number ghost-number-white"
          style={{ top: "-4%", right: "-2%" }}
        >
          07
        </span>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full py-28">
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase text-black mb-6"
            style={{ opacity: 0.4 }}
          >
            07
          </p>
          <h2
            className="text-black mb-10"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            {content.contact.heading}
          </h2>
          <p
            className="text-black mb-8"
            style={{ fontSize: "1rem", fontWeight: 300, opacity: 0.65 }}
          >
            {content.contact.tagline}
          </p>
          <a
            href={`mailto:${content.contact.email}`}
            className="text-black mb-10"
            style={{
              fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              textDecoration: "none",
              borderBottom: "1px solid rgba(0,0,0,0.3)",
              display: "inline-block",
              paddingBottom: "4px",
            }}
          >
            {content.contact.email}
          </a>
          <div className="flex flex-wrap gap-6 mt-10">
            {content.contact.socials.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black"
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(0,0,0,0.4)",
                  paddingBottom: "2px",
                  opacity: 0.8,
                }}
              >
                {social.platform}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="bg-black"
        style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white text-xs" style={{ opacity: 0.35 }}>
            © {new Date().getFullYear()} Rhiannon Thomas
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-xs"
            style={{ opacity: 0.35, textDecoration: "none" }}
          >
            Built with ♥ using caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
