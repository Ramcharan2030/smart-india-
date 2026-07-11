"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const SERVICES = [
  {
    id: "buy",
    number: "01",
    label: "Acquire",
    title: "Find Your World",
    description: "We present only the rarest properties — each one a private architectural masterpiece. Our acquisition service begins with understanding what moves you, then finding the property that moves with you.",
    features: ["Exclusive off-market listings", "White-glove viewings", "Investment analysis", "Full legal support"],
    src: "/images/services/buy.png",
  },
  {
    id: "rent",
    number: "02",
    label: "Inhabit",
    title: "Live the Standard",
    description: "Experience exceptional architecture before committing. Our curated rental portfolio includes the most extraordinary residences in India — each one maintained to museum standards.",
    features: ["Curated portfolio access", "Flexible lease terms", "Concierge services included", "Priority to purchase"],
    src: "/images/services/rent.png",
  },
  {
    id: "sell",
    number: "03",
    label: "Divest",
    title: "Command Your Price",
    description: "When exceptional properties meet exceptional buyers, price becomes secondary to legacy. Our private sales process connects your property with the world's most discerning buyers.",
    features: ["Private buyer network", "Cinematic marketing", "Discretion guaranteed", "Premium valuations"],
    src: "/images/services/sell.png",
  },
];

export default function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      if (labelRef.current) {
        gsap.fromTo(labelRef.current, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0,
          scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none reverse" },
        });
      }
    }, section);
    return () => ctx.revert();
  }, []);

  const handleHover = (index: number | null) => {
    setHoveredIndex(index);
    if (index !== null) setActiveIndex(index);
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative min-h-screen bg-[var(--background)] py-16 md:py-32 px-6 md:px-8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={labelRef} className="opacity-0 mb-12 md:mb-20">
          <span className="text-section-label">— Our Services</span>
          <h2 className="mt-4 text-section-title font-display font-bold text-[var(--ink)] tracking-tight">
            How We{" "}
            <span style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", color: "var(--champagne)" }}>
              Serve
            </span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
          {/* Left: Service accordion */}
          <div className="w-full md:w-1/2 space-y-0">
            {SERVICES.map((service, i) => (
              <div
                key={service.id}
                className="border-t border-[var(--stone)] cursor-pointer group"
                onMouseEnter={() => handleHover(i)}
                onMouseLeave={() => handleHover(null)}
                onClick={() => setActiveIndex(i)}
              >
                <div className="py-8 flex items-start justify-between">
                  <div className="flex items-start gap-6">
                    <span className="text-section-label text-[var(--champagne)] mt-1">{service.number}</span>
                    <div>
                      <span className="text-section-label text-[var(--stone)] mb-1 block">{service.label}</span>
                      <h3 className="text-[clamp(1.5rem,2.5vw,2.5rem)] font-display font-bold text-[var(--ink)] leading-tight tracking-tight group-hover:text-[var(--bronze)] transition-colors duration-300">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                  <div
                    className="mt-2 w-6 h-6 flex items-center justify-center transition-transform duration-300"
                    style={{ transform: activeIndex === i ? "rotate(45deg)" : "rotate(0deg)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* Expanded content */}
                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{ maxHeight: activeIndex === i ? "550px" : "0px" }}
                >
                  <div className="pb-8 pl-8 md:pl-14">
                    <p className="text-[var(--muted-ink)] text-base leading-relaxed mb-6 max-w-md">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm text-[var(--muted-ink)]">
                          <div className="w-1 h-1 rounded-full bg-[var(--champagne)] flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className="mt-8 px-6 py-3 border border-[var(--champagne)] text-[var(--champagne)] text-xs tracking-[0.2em] uppercase hover:bg-[var(--champagne)] hover:text-white transition-all duration-300 rounded-full">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t border-[var(--stone)]" />
          </div>

          {/* Right: Image reveal */}
          <div className="relative md:sticky md:top-32 w-full md:w-1/2 aspect-[4/3] md:aspect-[3/4] overflow-hidden rounded-lg">
            {SERVICES.map((service, i) => (
              <div
                key={service.id}
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: activeIndex === i ? 1 : 0 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.src}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  style={{ transform: hoveredIndex === i ? "scale(1.03)" : "scale(1)", transition: "transform 0.6s ease" }}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(23,19,15,0.6) 100%)" }} />
                <div className="absolute bottom-8 left-8">
                  <span className="text-section-label text-white/60">{service.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
