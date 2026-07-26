import Image from "next/image";

function DownArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 rotate-90">
      <path
        d="M4 12h15M14 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero__field" aria-hidden="true">
        <span />
        <span />
      </div>

      <div className="hero__inner">
        <div className="hero__eyebrow">
          <span>Digitec × Digital Movement</span>
          <span>Angebot · 2026</span>
        </div>

        <div className="hero__content">
          <h1 className="hero__headline">
            {["DIGITALES", "WACHSTUM.", "FÜR DIGITEC."].map(
              (line, index) => (
                <div className="hero__line" key={line}>
                  <span className={index === 1 ? "gradient-word" : ""}>
                    {line}
                  </span>
                </div>
              ),
            )}
          </h1>

          <div className="hero__aside">
            <p>
              Mehr passende Gespräche, bessere Auffindbarkeit und ein Auftritt,
              der Vertrauen schafft.
            </p>
            <a href="#leistungen" className="hero__cta">
              Leistungen ansehen <DownArrow />
            </a>
            <a
              className="hero__proofline"
              href="https://success.digitalmovement.uk/"
              target="_blank"
              rel="noreferrer"
              aria-label="Erfolgsgeschichten und 102 Google-Bewertungen von Digital Movement ansehen"
            >
              <span>Seit 2018</span>
              <span>300+ Kunden</span>
              <span>5,0 ★ · 102 Reviews</span>
            </a>
          </div>
        </div>

        <div className="hero__foot">
          <div className="hero__portrait">
            <Image
              src="/assets/dr-beckers-portrait-104.png"
              alt="Dr. Beckers"
              width={52}
              height={52}
            />
            <span>
              <small>Ziel</small>
              <strong>Digitec nach vorne bringen.</strong>
            </span>
          </div>
          <div className="hero__services">
            <span>01 LinkedIn</span>
            <span>02 SEO &amp; GEO</span>
            <span>03 Website</span>
          </div>
        </div>
      </div>
    </section>
  );
}
