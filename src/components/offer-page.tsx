"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  formatEuro,
  Offer,
  OfferId,
  offers,
} from "@/lib/offer-data";

const easing = [0.22, 1, 0.36, 1] as const;

const serviceData = [
  {
    id: "linkedin",
    index: "01",
    color: "bg-[#0a66c2]",
    eyebrow: "Direkte Gespräche",
    title: "LinkedIn-\nAutomatisierung",
    statement:
      "Tägliche Neukunden-Akquise und zielgruppenrelevante Inhalte auf LinkedIn.",
    impact: "Mehr Gespräche mit passenden Praxen.",
    steps: [
      ["Zielgruppe", "Praxen und Entscheider festlegen"],
      ["Ansprache", "Kontakte und Nachrichten einrichten"],
      ["Betrieb", "Dialoge und Inhalte weiterführen"],
    ],
    deliverables: [
      "1.000+ passende Ziel-Accounts",
      "Tägliche Kontaktanfragen",
      "Erstnachrichten und Follow-ups",
      "3 Post-Vorschläge pro Woche",
    ],
  },
  {
    id: "seo",
    index: "02",
    color: "bg-[#7627c7]",
    eyebrow: "Google & KI-Suche",
    title: "SEO &\nGEO",
    statement:
      "Neue Seiten machen Digitec bei Google und in relevanten KI-Suchen sichtbarer.",
    impact: "Mehr Anfragen von suchenden Praxen.",
    steps: [
      ["Recherche", "Wichtige Suchthemen identifizieren"],
      ["Neue Seiten", "Texte, Design und Technik umsetzen"],
      ["Optimierung", "Entwicklung messen und verbessern"],
    ],
    deliverables: [
      "Recherche und klarer Seitenplan",
      "Eigene Texte für jede neue Seite",
      "Optimierung für Google und KI",
      "Monatlicher Bericht",
    ],
  },
  {
    id: "website",
    index: "03",
    color: "bg-[#e8a21a]",
    eyebrow: "Digitaler Auftritt",
    title: "Website-\nEntwicklung",
    statement:
      "Eine hochwertige Website erklärt das Angebot schnell und macht Kontakt einfach.",
    impact: "Mehr Vertrauen vor dem ersten Gespräch.",
    steps: [
      ["Konzept", "Struktur und Inhalte festlegen"],
      ["Design", "Visuelle Richtung ausarbeiten"],
      ["Umsetzung", "Technik, Prüfung und Launch"],
    ],
    deliverables: [
      "Klare Struktur und Nutzerführung",
      "Individuelles High-End Webdesign",
      "Frontend und technische Umsetzung",
      "Prüfung und Veröffentlichung",
    ],
  },
] as const;

const reviews = [
  {
    quote: "Great quality service, proactive, positive and easy to deal with.",
    name: "Jessica Purcell",
    date: "Google Review · 2026",
  },
  {
    quote: "I started getting real leads not long after.",
    name: "Beth Sorensen",
    date: "Google Review · 2025",
  },
  {
    quote: "I couldn’t be happier with the redesign.",
    name: "Malin Burnand",
    date: "Google Review · 2025",
  },
] as const;

function Arrow({ direction = "right" }: { direction?: "right" | "down" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`h-5 w-5 ${direction === "down" ? "rotate-90" : ""}`}
      fill="none"
    >
      <path d="M4 12h15M14 6l6 6-6 6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

function Plus({ open }: { open: boolean }) {
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      animate={{ rotate: open ? 45 : 0 }}
      transition={{ duration: 0.25, ease: easing }}
      fill="none"
    >
      <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="2" />
    </motion.svg>
  );
}

function Bag() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M5 8h14l-1 12H6L5 8Zm4 0V6a3 3 0 0 1 6 0v2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, delay, ease: easing }}
    >
      {children}
    </motion.div>
  );
}

function PlatformStrip({ variant }: { variant: "linkedin" | "seo" }) {
  if (variant === "linkedin") {
    return (
      <div className="platform-strip">
        <Image
          src="/assets/logo-linkedin-112.png"
          alt="LinkedIn"
          width={28}
          height={28}
          className="h-7 w-7 object-contain"
        />
        <span>LinkedIn</span>
      </div>
    );
  }

  const logos = [
    ["/assets/logo-google.webp", "Google"],
    ["/assets/logo-chatgpt.svg", "ChatGPT"],
    ["/assets/logo-claude.svg", "Claude"],
    ["/assets/logo-perplexity.svg", "Perplexity"],
  ];

  return (
    <div className="platform-strip platform-strip--logos">
      {logos.map(([src, alt]) => (
        <span key={alt} className="platform-logo" title={alt}>
          <Image src={src} alt={alt} width={24} height={24} />
        </span>
      ))}
      <span>Google + KI</span>
    </div>
  );
}

function ServicePanel({
  service,
  index,
}: {
  service: (typeof serviceData)[number];
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <motion.article
      className={`service-panel ${service.color}`}
      initial={reduce ? false : { opacity: 0, y: 56 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.72, delay: index * 0.1, ease: easing }}
      whileHover={reduce ? {} : { y: -8 }}
    >
      <div className="service-panel__top">
        <span className="service-number">{service.index}</span>
        <span className="eyebrow text-current">{service.eyebrow}</span>
      </div>

      <div>
        <h3 className="service-title whitespace-pre-line">{service.title}</h3>
        {service.id !== "website" && (
          <PlatformStrip variant={service.id as "linkedin" | "seo"} />
        )}
      </div>

      <p className="service-statement">{service.statement}</p>

      <div className="service-steps service-steps--desktop">
        {service.steps.map(([title, description], stepIndex) => (
          <motion.div
            className="service-step"
            key={title}
            initial={reduce ? false : { opacity: 0, x: -16 }}
            whileInView={reduce ? {} : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.45,
              delay: 0.15 + stepIndex * 0.08,
              ease: easing,
            }}
          >
            <span>0{stepIndex + 1}</span>
            <div>
              <strong>{title}</strong>
              <p>{description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="service-impact">
        <span>Beitrag zum Wachstum</span>
        <strong>{service.impact}</strong>
      </div>

      <button
        type="button"
        className="accordion-trigger"
        aria-expanded={open}
        aria-controls={`${service.id}-details`}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{open ? "Details schließen" : "Details ansehen"}</span>
        <Plus open={open} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${service.id}-details`}
            role="region"
            aria-label={`Details zu ${service.title.replace("\n", " ")}`}
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.36, ease: easing }}
          >
            <div className="service-steps service-steps--mobile">
              {service.steps.map(([title, description], stepIndex) => (
                <div className="service-step" key={title}>
                  <span>0{stepIndex + 1}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <ul className="deliverable-list">
              {service.deliverables.map((item) => (
                <li key={item}>
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function OfferCard({
  offer,
  selected,
  onToggle,
}: {
  offer: Offer;
  selected: boolean;
  onToggle: (offer: Offer) => void;
}) {
  return (
    <motion.button
      type="button"
      layout
      aria-pressed={selected}
      className={`offer-card offer-card--${offer.group} ${
        selected ? "is-selected" : ""
      }`}
      onClick={() => onToggle(offer)}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.2 }}
    >
      <span className="offer-card__check">{selected ? <Check /> : null}</span>
      <span className="offer-card__label">
        {offer.recommended ? "Empfohlen" : offer.group}
      </span>
      <strong>{offer.name}</strong>
      <span className="offer-card__note">{offer.note}</span>
      <span className="offer-card__price">
        {offer.monthly
          ? `${formatEuro(offer.monthly)} / Monat`
          : `${formatEuro(offer.once)} einmalig`}
      </span>
    </motion.button>
  );
}

function DiscountCard({
  active,
  disabled = false,
  title,
  description,
  value,
}: {
  active: boolean;
  disabled?: boolean;
  title: string;
  description: string;
  value: string;
}) {
  return (
    <motion.div
      aria-label={`${title}: ${description}`}
      aria-disabled={disabled}
      className={`discount-card ${active ? "is-active" : ""}`}
      whileHover={disabled ? {} : { y: -4 }}
    >
      <span className="discount-card__value">{value}</span>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <span className="discount-card__toggle">{active ? <Check /> : null}</span>
    </motion.div>
  );
}

type Totals = {
  baseMonthly: number;
  signupSaving: number;
  specialSaving: number;
  monthly: number;
  once: number;
  websiteWaived: boolean;
  discountRate: number;
};

function MiniCart({
  selectedOffers,
  totals,
  compact = false,
}: {
  selectedOffers: Offer[];
  totals: Totals;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "mini-cart mini-cart--compact" : "mini-cart"}>
      <div className="mini-cart__head">
        <span>Ihre Auswahl</span>
        <strong>{selectedOffers.length}</strong>
      </div>
      {selectedOffers.length === 0 ? (
        <p className="mini-cart__empty">Noch keine Leistung ausgewählt.</p>
      ) : (
        <motion.ul layout className="mini-cart__list">
          <AnimatePresence initial={false}>
            {selectedOffers.map((offer) => (
              <motion.li
                layout
                key={offer.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
              >
                <span>
                  <strong>{offer.name}</strong>
                  <small>{offer.note}</small>
                </span>
                <b>
                  {offer.id === "website" && totals.websiteWaived
                    ? "inklusive"
                    : offer.monthly
                      ? `${formatEuro(offer.monthly)} mtl.`
                      : formatEuro(offer.once)}
                </b>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
      {selectedOffers.length > 0 && (
        <div className="mini-cart__breakdown">
          <span>
            <small>Monatliche Zwischensumme</small>
            <b>{formatEuro(totals.baseMonthly)}</b>
          </span>
          {totals.signupSaving > 0 && (
            <span className="is-saving">
              <small>Start-Rabatt · 20 %</small>
              <b>− {formatEuro(totals.signupSaving)}</b>
            </span>
          )}
          {totals.specialSaving > 0 && (
            <span className="is-saving">
              <small>Kombinationsrabatt · 10 %</small>
              <b>− {formatEuro(totals.specialSaving)}</b>
            </span>
          )}
          {totals.websiteWaived && (
            <span className="is-saving">
              <small>Website mit SEO Standard</small>
              <b>− {formatEuro(7499)}</b>
            </span>
          )}
        </div>
      )}
      <div className="mini-cart__totals" aria-live="polite" aria-atomic="true">
        <span>
          <small>Endpreis monatlich</small>
          <strong>{formatEuro(totals.monthly)}</strong>
        </span>
        <span>
          <small>Endpreis einmalig</small>
          <strong>{formatEuro(totals.once)}</strong>
        </span>
      </div>
    </div>
  );
}

function LegalDialog({
  type,
  onClose,
}: {
  type: "privacy" | "imprint" | "terms";
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLElement>(null);
  const title = {
    privacy: "Datenschutzhinweis",
    imprint: "Impressum",
    terms: "Angebotsbedingungen",
  }[type];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    dialog.addEventListener("keydown", trapFocus);
    return () => dialog.removeEventListener("keydown", trapFocus);
  }, []);

  return (
    <motion.div
      className="legal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.section
        ref={dialogRef}
        className="legal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-dialog-title"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.28, ease: easing }}
      >
        <div className="legal-dialog__head">
          <span className="eyebrow">Rechtliche Information</span>
          <button type="button" onClick={onClose} autoFocus>
            Schließen <Plus open />
          </button>
        </div>
        <h2 id="legal-dialog-title">{title}</h2>

        {type === "imprint" && (
          <div className="legal-copy">
            <h3>Anbieter</h3>
            <p>
              Digital Movement Marketing Ltd
              <br />
              128 City Road
              <br />
              London EC1V 2NX, United Kingdom
            </p>
            <p>Company Number: 17110525</p>
            <h3>Kontakt</h3>
            <p>
              Raoul (Alex) Müller
              <br />
              <a href="mailto:alex@digitalmovement.uk">
                alex@digitalmovement.uk
              </a>
              <br />
              <a href="tel:+4917682360647">+49 176 82360647</a>
            </p>
          </div>
        )}

        {type === "privacy" && (
          <div className="legal-copy">
            <h3>Verantwortlicher</h3>
            <p>
              Digital Movement Marketing Ltd, 128 City Road, London EC1V 2NX.
              Kontakt:{" "}
              <a href="mailto:alex@digitalmovement.uk">
                alex@digitalmovement.uk
              </a>
              .
            </p>
            <h3>Welche Daten wir verwenden</h3>
            <p>
              Wir verarbeiten die Angaben aus dem Formular, Ihre ausgewählten
              Leistungen und die berechneten Preise, um Ihre Anfrage zu
              bearbeiten und Vertragsunterlagen vorzubereiten.
            </p>
            <h3>Weitergabe und Aufbewahrung</h3>
            <p>
              Daten werden nur an technisch notwendige Dienstleister
              weitergegeben und nur so lange gespeichert, wie es für Anfrage,
              Vertrag und gesetzliche Pflichten erforderlich ist.
            </p>
            <h3>Ihre Rechte</h3>
            <p>
              Sie können Auskunft, Berichtigung oder Löschung Ihrer Daten
              verlangen. Schreiben Sie dazu an{" "}
              <a href="mailto:alex@digitalmovement.uk">
                alex@digitalmovement.uk
              </a>
              .
            </p>
          </div>
        )}

        {type === "terms" && (
          <div className="legal-copy">
            <h3>Geltung des Angebots</h3>
            <p>
              Die Auswahl auf dieser Seite dient der Vorbereitung einer
              individuellen Leistungsvereinbarung. Der Auftrag beginnt erst
              nach schriftlicher Bestätigung der Vertragsunterlagen.
            </p>
            <h3>Preise und Laufzeit</h3>
            <p>
              Alle Preise verstehen sich zuzüglich gesetzlicher Umsatzsteuer.
              Für SEO gilt eine Mindestvertragslaufzeit von sechs Monaten.
              Weitere Laufzeiten, Zahlungsziele und der Leistungsbeginn stehen
              in den Vertragsunterlagen.
            </p>
            <h3>Digitec-Vorteile</h3>
            <p>
              Der Start-Rabatt wird automatisch auf monatliche Leistungen
              angewendet. Bei der Kombination aus LinkedIn und SEO kommt der
              ausgewiesene Kombinationsrabatt hinzu. Mit SEO Standard ist die
              Website-Entwicklung ohne zusätzliche Einmalgebühr enthalten.
            </p>
            <h3>Ergebnisse</h3>
            <p>
              Digital Movement schuldet die vereinbarten Leistungen. Konkrete
              Rankings, Anfragen oder Umsätze können nicht garantiert werden.
            </p>
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}

export function OfferPage({ hero }: { hero: ReactNode }) {
  const [selected, setSelected] = useState<Set<OfferId>>(new Set());
  const [selectionStep, setSelectionStep] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionMode, setSubmissionMode] = useState<"endpoint" | "email">(
    "endpoint",
  );
  const [orderId, setOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [stickyAllowed, setStickyAllowed] = useState(true);
  const [legalOpen, setLegalOpen] = useState<
    "privacy" | "imprint" | "terms" | null
  >(null);
  const selectionRef = useRef<HTMLElement>(null);
  const checkoutRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const backendReady = Boolean(process.env.NEXT_PUBLIC_ORDER_ENDPOINT);
  const { scrollYProgress } = useScroll();
  const trustAccentY = useTransform(scrollYProgress, [0.18, 0.6], [-70, 90]);

  const selectedOffers = useMemo(
    () => offers.filter((offer) => selected.has(offer.id)),
    [selected],
  );
  const hasLinkedIn = selectedOffers.some(
    (offer) => offer.group === "linkedin",
  );
  const hasSeo = selectedOffers.some((offer) => offer.group === "seo");
  const specialEligible = hasLinkedIn && hasSeo;

  const openLegal = useCallback(
    (
      type: "privacy" | "imprint" | "terms",
      trigger?: HTMLElement,
    ) => {
      lastFocusRef.current =
        trigger ?? (document.activeElement as HTMLElement | null);
      setLegalOpen(type);
    },
    [],
  );

  const closeLegal = useCallback(() => {
    setLegalOpen(null);
    window.requestAnimationFrame(() => lastFocusRef.current?.focus());
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCartOpen(false);
        if (legalOpen) closeLegal();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = legalOpen ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [closeLegal, legalOpen]);

  useEffect(() => {
    const checkout = checkoutRef.current;
    const footer = footerRef.current;
    if (!checkout || !footer) return;

    const update = () => {
      const checkoutTop = checkout.getBoundingClientRect().top;
      const footerTop = footer.getBoundingClientRect().top;
      setStickyAllowed(
        checkoutTop > window.innerHeight * 0.82 &&
          footerTop > window.innerHeight,
      );
    };

    const checkoutObserver = new IntersectionObserver(
      update,
      { rootMargin: "0px 0px -18% 0px" },
    );
    const footerObserver = new IntersectionObserver(update);

    checkoutObserver.observe(checkout);
    footerObserver.observe(footer);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const initialTimer = window.setTimeout(update, 0);

    return () => {
      window.clearTimeout(initialTimer);
      checkoutObserver.disconnect();
      footerObserver.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const totals = useMemo<Totals>(() => {
    const baseMonthly = selectedOffers.reduce(
      (sum, offer) => sum + offer.monthly,
      0,
    );
    const websiteWaived =
      selected.has("seo-standard") && selected.has("website");
    const rawOnce = selectedOffers.reduce(
      (sum, offer) => sum + offer.once,
      0,
    );
    const discountRate = (baseMonthly > 0 ? 0.2 : 0) + (specialEligible ? 0.1 : 0);
    const signupSaving = baseMonthly > 0 ? baseMonthly * 0.2 : 0;
    const specialSaving = specialEligible ? baseMonthly * 0.1 : 0;

    return {
      baseMonthly,
      signupSaving,
      specialSaving,
      monthly: baseMonthly - signupSaving - specialSaving,
      once: websiteWaived ? 0 : rawOnce,
      websiteWaived,
      discountRate,
    };
  }, [
    selectedOffers,
    selected,
    specialEligible,
  ]);

  const toggleOffer = (offer: Offer) => {
    setSubmitError("");
    setSelected((current) => {
      const next = new Set(current);
      if (offer.group === "seo") {
        next.delete("seo-basic");
        next.delete("seo-standard");
        next.delete("seo-max");
      }
      if (current.has(offer.id)) {
        next.delete(offer.id);
      } else {
        next.add(offer.id);
      }
      return next;
    });
  };

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedOffers.length) {
      setSubmitError("Bitte wählen Sie zuerst mindestens eine Leistung.");
      window.requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }

    const form = new FormData(event.currentTarget);
    const endpoint = process.env.NEXT_PUBLIC_ORDER_ENDPOINT;
    const nextOrderId = `DM-${new Date()
      .toISOString()
      .slice(0, 10)
      .replaceAll("-", "")}-${crypto
      .getRandomValues(new Uint32Array(1))[0]
      .toString(36)
      .toUpperCase()
      .slice(0, 6)}`;
    const customer = {
      firstName: String(form.get("firstName") || ""),
      lastName: String(form.get("lastName") || ""),
      email: String(form.get("email") || ""),
      company: String(form.get("company") || ""),
      phone: String(form.get("phone") || ""),
      address: String(form.get("address") || ""),
      postalCode: String(form.get("postalCode") || ""),
      city: String(form.get("city") || ""),
    };
    const payload = {
      orderId: nextOrderId,
      createdAt: new Date().toISOString(),
      customer,
      services: selectedOffers.map((offer) => ({
        id: offer.id === "website" ? "website-development" : offer.id,
        name: offer.name,
        monthly: offer.monthly,
        onetime: offer.once,
      })),
      pricing: {
        baseMonthly: totals.baseMonthly,
        discountPercent: totals.discountRate * 100,
        monthlySaving: totals.signupSaving + totals.specialSaving,
        monthlyTotal: totals.monthly,
        oneTimeBase: selectedOffers.reduce(
          (sum, offer) => sum + offer.once,
          0,
        ),
        websiteWaived: totals.websiteWaived,
        oneTimeTotal: totals.once,
      },
    };
    setSubmitError("");
    setSubmitting(true);

    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        });
      } catch {
        setSubmitError(
          navigator.onLine
            ? "Die Bestellung konnte gerade nicht gesendet werden. Bitte versuchen Sie es erneut."
            : "Sie sind offline. Ihre Angaben bleiben erhalten. Stellen Sie die Verbindung wieder her und versuchen Sie es erneut.",
        );
        window.requestAnimationFrame(() => errorRef.current?.focus());
        setSubmitting(false);
        return;
      }
    } else {
      const services = selectedOffers
        .map((offer) => `• ${offer.name}`)
        .join("\n");
      const message = [
        `Hallo Raoul,`,
        "",
        `bitte bereite die Vertragsunterlagen für folgende Auswahl vor:`,
        services,
        "",
        `Monatlich: ${formatEuro(totals.monthly)} zzgl. USt.`,
        `Einmalig: ${formatEuro(totals.once)} zzgl. USt.`,
        `Bestellnummer: ${nextOrderId}`,
        "",
        `${customer.firstName} ${customer.lastName}`,
        customer.company,
        customer.phone,
      ].join("\n");
      window.location.href = `mailto:alex@digitalmovement.uk?subject=${encodeURIComponent(
        `Digitec Auswahl · ${nextOrderId}`,
      )}&body=${encodeURIComponent(message)}`;
      setSubmissionMode("email");
    }

    if (endpoint) setSubmissionMode("endpoint");
    setOrderId(nextOrderId);
    setSubmitting(false);
    setSubmitted(true);
  };

  const goToSelectionStep = (step: number) => {
    setSelectionStep(step);
    window.requestAnimationFrame(() => {
      selectionRef.current?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    });
  };

  return (
    <main className="overflow-clip bg-[#f4f2ed] text-[#0d1828]">
      <div
        className="page-content"
        aria-hidden={legalOpen ? true : undefined}
        inert={legalOpen ? true : undefined}
      >
      <a className="skip-link" href="#leistungen">
        Zum Inhalt springen
      </a>
      <header className="site-header">
        <a href="#top" className="brand-lockup" aria-label="Zur Startseite">
          <Image
            src="/assets/logo-digitec.svg"
            alt="Digitec"
            width={132}
            height={38}
            priority
          />
          <span>×</span>
          <Image
            src="/assets/logo-digital-movement.svg"
            alt="Digital Movement"
            width={144}
            height={38}
            priority
          />
        </a>

        <nav aria-label="Seitennavigation">
          <a href="#leistungen">Leistungen</a>
          <a href="#auswahl">Auswahl</a>
          <a href="#checkout" onClick={() => setStickyAllowed(false)}>
            Checkout
          </a>
        </nav>

        <div
          className="cart-menu"
          onMouseEnter={() => setCartOpen(true)}
          onMouseLeave={() => setCartOpen(false)}
        >
          <button
            type="button"
            className="cart-button"
            aria-expanded={cartOpen}
            aria-controls="cart-popover"
            onClick={() => setCartOpen((value) => !value)}
          >
            <Bag />
            <span className="hidden sm:inline">Auswahl</span>
            <b aria-live="polite" aria-atomic="true">
              {selectedOffers.length}
            </b>
          </button>
          <AnimatePresence>
            {cartOpen && (
              <motion.div
                id="cart-popover"
                role="region"
                aria-label="Aktuelle Auswahl"
                className="cart-popover"
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.22, ease: easing }}
              >
                <MiniCart
                  selectedOffers={selectedOffers}
                  totals={totals}
                  compact
                />
                <a
                  href="#checkout"
                  onClick={() => {
                    setCartOpen(false);
                    setStickyAllowed(false);
                  }}
                >
                  Zur Bestellung <Arrow />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {hero}

      <section id="leistungen" className="section-shell section-shell--dark">
        <div className="section-intro">
          <Reveal>
            <span className="eyebrow">01 — Leistungsübersicht</span>
            <h2>
              Drei Hebel.
              <br />
              <span>Ein klares Ziel.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="section-intro__copy">
            <p>
              Erst verstehen, dann auswählen. Jede Leistung übernimmt eine
              klare Aufgabe für Digitec.
            </p>
          </Reveal>
        </div>

        <div className="service-grid">
          {serviceData.map((service, index) => (
            <ServicePanel key={service.id} service={service} index={index} />
          ))}
        </div>
      </section>

      <section className="trust-section" aria-labelledby="trust-title">
        <motion.div
          className="trust-parallax"
          style={{ y: reduce ? 0 : trustAccentY }}
          aria-hidden="true"
        />
        <div className="trust-section__head">
          <div>
            <span className="eyebrow">Erfahrungen mit Digital Movement</span>
            <h2 id="trust-title">
              5,0 auf Google.
              <br />
              <span>102 echte Bewertungen.</span>
            </h2>
          </div>
          <a
            href="https://success.digitalmovement.uk/"
            target="_blank"
            rel="noreferrer"
          >
            Alle Bewertungen ansehen <Arrow />
          </a>
        </div>
        <div
          className="review-rail"
          tabIndex={0}
          aria-label="Drei Google-Bewertungen, horizontal scrollbar"
        >
          {reviews.map((review, index) => (
            <motion.article
              className="review-card"
              key={review.name}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={reduce ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1, duration: 0.55, ease: easing }}
            >
              <span aria-label="5 von 5 Sternen">★★★★★</span>
              <blockquote>“{review.quote}”</blockquote>
              <div className="review-card__author">
                <strong>{review.name}</strong>
                <small>{review.date}</small>
              </div>
            </motion.article>
          ))}
        </div>
        <p className="trust-source">
          Öffentliche Google-Bewertungen von Digital Movement Australia.
        </p>
      </section>

      <section
        id="auswahl"
        ref={selectionRef}
        className="section-shell section-shell--light"
      >
        <div className="section-intro">
          <Reveal>
            <span className="eyebrow">02 — Angebot zusammenstellen</span>
            <h2>
              Wählen.
              <br />
              <span>Preis sehen.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="section-intro__copy">
            <p>
              Leistungen anklicken. Die Übersicht aktualisiert sich sofort.
              Bei SEO kann genau ein Paket gewählt werden.
            </p>
          </Reveal>
        </div>

        <div className="mobile-step-nav" aria-label="Schritte der Auswahl">
          {([
            [1, "LinkedIn"],
            [2, "SEO"],
            [3, "Website"],
            [4, "Rabatte"],
          ] as const).map(([step, label]) => (
            <button
              type="button"
              key={step}
              aria-current={selectionStep === step ? "step" : undefined}
              onClick={() => goToSelectionStep(step)}
            >
              <span>0{step}</span>
              <strong>{label}</strong>
            </button>
          ))}
        </div>

        <div className="selection-layout">
          <div className="offer-groups">
            <Reveal
              className={`offer-group mobile-offer-step ${
                selectionStep === 1 ? "is-active" : ""
              }`}
            >
              <div className="offer-group__head">
                <span>01</span>
                <h3>LinkedIn</h3>
                <small>Monatlich</small>
              </div>
              <div className="offer-grid offer-grid--two">
                {offers
                  .filter((offer) => offer.group === "linkedin")
                  .map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      selected={selected.has(offer.id)}
                      onToggle={toggleOffer}
                    />
                  ))}
              </div>
              <button
                type="button"
                className="mobile-next"
                onClick={() => goToSelectionStep(2)}
              >
                Weiter zu SEO <Arrow />
              </button>
            </Reveal>

            <Reveal
              className={`offer-group mobile-offer-step ${
                selectionStep === 2 ? "is-active" : ""
              }`}
            >
              <div className="offer-group__head">
                <span>02</span>
                <h3>SEO &amp; GEO</h3>
                <small>6 Monate Mindestvertragslaufzeit</small>
              </div>
              <div className="offer-grid offer-grid--three">
                {offers
                  .filter((offer) => offer.group === "seo")
                  .map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      selected={selected.has(offer.id)}
                      onToggle={toggleOffer}
                    />
                  ))}
              </div>
              <button
                type="button"
                className="mobile-next"
                onClick={() => goToSelectionStep(3)}
              >
                Weiter zur Website <Arrow />
              </button>
            </Reveal>

            <Reveal
              className={`offer-group mobile-offer-step ${
                selectionStep === 3 ? "is-active" : ""
              }`}
            >
              <div className="offer-group__head">
                <span>03</span>
                <h3>Website</h3>
                <small>Einmalig</small>
              </div>
              <div className="offer-grid">
                {offers
                  .filter((offer) => offer.group === "website")
                  .map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      selected={selected.has(offer.id)}
                      onToggle={toggleOffer}
                    />
                  ))}
              </div>
              <motion.div
                className={`waiver-note ${
                  selected.has("seo-standard") ? "is-ready" : ""
                }`}
                layout
              >
                <span>Website-Vorteil</span>
                <strong>
                  Mit SEO Standard ist die Website ohne Extra-Kosten enthalten.
                </strong>
                <b>{formatEuro(7499)} → 0 €</b>
              </motion.div>
              <button
                type="button"
                className="mobile-next"
                onClick={() => goToSelectionStep(4)}
              >
                Weiter zu den Rabatten <Arrow />
              </button>
            </Reveal>

            <Reveal
              className={`discount-zone mobile-offer-step ${
                selectionStep === 4 ? "is-active" : ""
              }`}
            >
              <div className="discount-zone__head">
                <span>Optional</span>
                <h3>Monatliche Rabatte</h3>
              </div>
              <div className="discount-grid">
                <DiscountCard
                  active
                  title="Start-Rabatt"
                  description="Automatisch auf monatliche Leistungen angewendet"
                  value="−20 %"
                />
                <DiscountCard
                  active={specialEligible}
                  disabled={!specialEligible}
                  title="Kombinationsrabatt"
                  description={
                    specialEligible
                      ? "Automatisch mit LinkedIn + SEO angewendet"
                      : "Wird mit LinkedIn + SEO automatisch aktiviert"
                  }
                  value="−10 %"
                />
              </div>
              <a
                className="mobile-next"
                href="#checkout"
                onClick={() => setStickyAllowed(false)}
              >
                Auswahl prüfen <Arrow />
              </a>
            </Reveal>
          </div>

          <aside className="selection-summary">
            <MiniCart selectedOffers={selectedOffers} totals={totals} />
            {totals.discountRate > 0 && (
              <motion.div
                className="saving-note"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Sie sparen monatlich{" "}
                <strong>
                  {formatEuro(totals.baseMonthly - totals.monthly)}
                </strong>
              </motion.div>
            )}
            <p className="price-terms">
              Alle Preise zzgl. gesetzlicher Umsatzsteuer. SEO: 6 Monate
              Mindestvertragslaufzeit. Verfügbare Rabatte sind bereits
              eingerechnet.
            </p>
            <a
              href="#checkout"
              className="summary-cta"
              onClick={() => setStickyAllowed(false)}
            >
              Auswahl übernehmen <Arrow direction="down" />
            </a>
          </aside>
        </div>
      </section>

      <section
        id="checkout"
        ref={checkoutRef}
        className="section-shell section-shell--checkout"
      >
        <div className="section-intro">
          <Reveal>
            <span className="eyebrow">03 — Checkout</span>
            <h2>
              Prüfen.
              <br />
              <span>Bestätigen.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="section-intro__copy">
            <p>
              Eine klare Zusammenfassung — getrennt nach monatlichen und
              einmaligen Kosten.
            </p>
          </Reveal>
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="checkout-form"
              className="checkout-layout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <form
                className="checkout-form"
                onSubmit={submitOrder}
                aria-busy={submitting}
              >
                <div className="checkout-form__head">
                  <span>Kontakt</span>
                  <strong>Wohin dürfen wir die Unterlagen senden?</strong>
                </div>
                <div className="field-row">
                  <label>
                    <span>Vorname</span>
                    <input
                      name="firstName"
                      autoComplete="given-name"
                      required
                      placeholder="Vorname"
                    />
                  </label>
                  <label>
                    <span>Nachname</span>
                    <input
                      name="lastName"
                      autoComplete="family-name"
                      required
                      placeholder="Beckers"
                    />
                  </label>
                </div>
                <label>
                  <span>E-Mail</span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@digitec.de"
                  />
                </label>
                <label>
                  <span>Telefon (optional)</span>
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+49 …"
                  />
                </label>
                <label>
                  <span>Unternehmen</span>
                  <input
                    name="company"
                    autoComplete="organization"
                    defaultValue="Dr. B.-DIGITEC"
                    required
                  />
                </label>
                <fieldset className="billing-fields">
                  <legend>Rechnungsanschrift</legend>
                  <p>Für Vertragsunterlagen und spätere Rechnungen.</p>
                  <label>
                    <span>Straße und Hausnummer</span>
                    <input
                      name="address"
                      autoComplete="street-address"
                      required
                      placeholder="Straße 1"
                    />
                  </label>
                  <div className="field-row field-row--city">
                    <label>
                      <span>PLZ</span>
                      <input
                        name="postalCode"
                        autoComplete="postal-code"
                        inputMode="numeric"
                        required
                        placeholder="10115"
                      />
                    </label>
                    <label>
                      <span>Ort</span>
                      <input
                        name="city"
                        autoComplete="address-level2"
                        required
                        placeholder="Berlin"
                      />
                    </label>
                  </div>
                </fieldset>
                <div className="consent">
                  <input id="consent" name="consent" type="checkbox" required />
                  <span>
                    <label htmlFor="consent">Ich bestätige die Auswahl.</label>{" "}
                    Ich habe den{" "}
                    <button
                      type="button"
                      onClick={(event) =>
                        openLegal("privacy", event.currentTarget)
                      }
                    >
                      Datenschutzhinweis
                    </button>{" "}
                    und die{" "}
                    <button
                      type="button"
                      onClick={(event) =>
                        openLegal("terms", event.currentTarget)
                      }
                    >
                      Angebotsbedingungen
                    </button>{" "}
                    gelesen.
                  </span>
                </div>
                <p className="order-channel">
                  {backendReady
                    ? "Sicherer Versand: Bestätigung direkt, Vertragsunterlagen innerhalb eines Werktages."
                    : "Lokale Vorschau: Die Auswahl wird als vorbereitete E-Mail geöffnet und erst durch Sie versendet."}
                </p>
                {submitError && (
                  <p
                    ref={errorRef}
                    className="form-error"
                    role="alert"
                    tabIndex={-1}
                  >
                    {submitError} <a href="#auswahl">Zur Auswahl</a>
                  </p>
                )}
                <motion.button
                  type="submit"
                  className="checkout-submit"
                  disabled={submitting}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span>
                    {submitting
                      ? "Wird vorbereitet …"
                      : backendReady
                        ? "Vertragsunterlagen anfordern"
                        : "Auswahl per E-Mail senden"}
                  </span>
                  <Arrow />
                </motion.button>
              </form>

              <div className="checkout-receipt">
                <span className="eyebrow">Bestellübersicht</span>
                <MiniCart selectedOffers={selectedOffers} totals={totals} />
                {totals.websiteWaived && (
                  <div className="receipt-benefit">
                    <span>Website inklusive</span>
                    <strong>Sie sparen einmalig {formatEuro(7499)}.</strong>
                  </div>
                )}
                <p className="receipt-terms">
                  Alle Preise zzgl. gesetzlicher Umsatzsteuer. SEO: 6 Monate
                  Mindestvertragslaufzeit. Die genaue Leistung und alle
                  Laufzeiten stehen vor Beginn in den Vertragsunterlagen.
                </p>
                <div className="checkout-next">
                  <span>Danach</span>
                  <ol>
                    <li>
                      <b>Direkt</b>{" "}
                      {backendReady
                        ? "Bestätigung und Willkommen per E-Mail"
                        : "Vorbereitete E-Mail prüfen und senden"}
                    </li>
                    <li>
                      <b>1 Werktag</b> Vertragsunterlagen per E-Mail
                    </li>
                    <li>
                      <b>Nach Freigabe</b> Gemeinsamer Kick-off
                    </li>
                  </ol>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              className="confirmation"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easing }}
            >
              <motion.span
                className="confirmation__mark"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 180, damping: 16 }}
              >
                <Check />
              </motion.span>
              <span className="eyebrow">
                {submissionMode === "endpoint"
                  ? "Anfrage eingegangen"
                  : "E-Mail vorbereitet"}
              </span>
              <h3>
                {submissionMode === "endpoint"
                  ? "Willkommen an Bord."
                  : "Fast geschafft."}
              </h3>
              <p>
                {submissionMode === "endpoint"
                  ? "Die Bestätigung ist auf dem Weg. Die Vertragsunterlagen folgen innerhalb eines Werktages."
                  : "Ihr E-Mail-Programm wurde geöffnet. Bitte senden Sie die vorbereitete Nachricht ab; danach bestätigen wir die Auswahl persönlich."}
              </p>
              <strong className="confirmation__order">
                Bestellnummer {orderId}
              </strong>
              <button type="button" onClick={() => setSubmitted(false)}>
                Auswahl noch einmal ansehen
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer ref={footerRef}>
        <div className="footer-logos">
          <Image
            src="/assets/logo-digitec.svg"
            alt="Digitec"
            width={130}
            height={38}
          />
          <span>×</span>
          <Image
            src="/assets/logo-digital-movement.svg"
            alt="Digital Movement"
            width={148}
            height={38}
          />
        </div>
        <p>
          Raoul Alex Müller ·{" "}
          <a href="mailto:alex@digitalmovement.uk">
            alex@digitalmovement.uk
          </a>
        </p>
        <div className="footer-links">
          <a
            href="https://www.linkedin.com/company/digital-movement-uk/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com/digitalmovement.uk/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
          <button
            type="button"
            onClick={(event) => openLegal("privacy", event.currentTarget)}
          >
            Datenschutz
          </button>
          <button
            type="button"
            onClick={(event) => openLegal("imprint", event.currentTarget)}
          >
            Impressum
          </button>
          <button
            type="button"
            onClick={(event) => openLegal("terms", event.currentTarget)}
          >
            Bedingungen
          </button>
        </div>
      </footer>

      {selectedOffers.length > 0 && stickyAllowed && !submitted && (
        <motion.a
          href="#checkout"
          className="mobile-price-bar"
          onClick={() => setStickyAllowed(false)}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: easing }}
        >
          <span>
            <small>Monatlich</small>
            <strong>{formatEuro(totals.monthly)}</strong>
          </span>
          <span>
            <small>Einmalig</small>
            <strong>{formatEuro(totals.once)}</strong>
          </span>
          <b>
            Weiter <Arrow />
          </b>
        </motion.a>
      )}
      </div>

      <AnimatePresence>
        {legalOpen && (
          <LegalDialog type={legalOpen} onClose={closeLegal} />
        )}
      </AnimatePresence>
    </main>
  );
}
