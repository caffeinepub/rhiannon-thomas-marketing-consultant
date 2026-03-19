export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  isPaid: boolean;
  url: string;
}

export interface SiteContent {
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaLink: string;
    secondaryText: string;
    secondaryLink: string;
  };
  sprint: {
    heading: string;
    description: string;
    bullets: string[];
    ctaText: string;
    ctaLink: string;
  };
  services: {
    heading: string;
    items: { title: string; description: string }[];
  };
  resources: {
    heading: string;
    items: ResourceItem[];
  };
  substack: {
    heading: string;
    copy: string;
    ctaText: string;
    ctaLink: string;
  };
  contact: {
    heading: string;
    email: string;
    tagline: string;
    socials: { platform: string; url: string }[];
  };
}

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    headline: "I help B2B companies go to market with clarity.",
    subheadline:
      "GTM strategy, positioning, and execution for founders who are done guessing.",
    ctaText: "Book a Sprint",
    ctaLink: "#sprint",
    secondaryText: "See my services →",
    secondaryLink: "#services",
  },
  sprint: {
    heading: "GTM Direction Sprint",
    description:
      "A focused two-week engagement to align your team on positioning, ICP, and go-to-market motion. Walk away with a clear direction — not a deck.",
    bullets: ["Positioning clarity", "ICP definition", "GTM motion mapped"],
    ctaText: "Book your Sprint",
    ctaLink: "mailto:hello@rhiannonthomas.com",
  },
  services: {
    heading: "Services",
    items: [
      {
        title: "Positioning & Messaging",
        description: "Define what you do, who it's for, and why it matters.",
      },
      {
        title: "GTM Strategy",
        description:
          "Build the roadmap from product-market fit to repeatable revenue.",
      },
      {
        title: "Fractional GTM Lead",
        description:
          "Embedded strategic leadership without the full-time cost.",
      },
    ],
  },
  resources: {
    heading: "Resources",
    items: [],
  },
  substack: {
    heading: "On Substack",
    copy: "I write about GTM strategy, positioning, and the messy reality of taking products to market. No fluff.",
    ctaText: "Read on Substack",
    ctaLink: "#",
  },
  contact: {
    heading: "Get in touch",
    email: "hello@rhiannonthomas.com",
    tagline: "Open to consulting engagements and fractional work.",
    socials: [
      { platform: "LinkedIn", url: "#" },
      { platform: "X / Twitter", url: "#" },
    ],
  },
};
