export type OfferId =
  | "linkedin-automation"
  | "content-calendar"
  | "seo-basic"
  | "seo-standard"
  | "seo-max"
  | "website";

export type Offer = {
  id: OfferId;
  group: "linkedin" | "seo" | "website";
  name: string;
  note: string;
  monthly: number;
  once: number;
  recommended?: boolean;
};

export const offers: Offer[] = [
  {
    id: "linkedin-automation",
    group: "linkedin",
    name: "LinkedIn-Automatisierung",
    note: "Neue Kontakte täglich ansprechen",
    monthly: 900,
    once: 0,
  },
  {
    id: "content-calendar",
    group: "linkedin",
    name: "Content-Kalender",
    note: "3 Post-Vorschläge pro Woche",
    monthly: 600,
    once: 0,
  },
  {
    id: "seo-basic",
    group: "seo",
    name: "SEO Basic",
    note: "5 neue Seiten",
    monthly: 1199,
    once: 0,
  },
  {
    id: "seo-standard",
    group: "seo",
    name: "SEO Standard",
    note: "15 neue Seiten",
    monthly: 2499,
    once: 0,
    recommended: true,
  },
  {
    id: "seo-max",
    group: "seo",
    name: "SEO Max",
    note: "50 neue Seiten",
    monthly: 4990,
    once: 0,
  },
  {
    id: "website",
    group: "website",
    name: "Website-Entwicklung",
    note: "Konzept, Design und Umsetzung",
    monthly: 0,
    once: 7499,
  },
];

export const formatEuro = (value: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
