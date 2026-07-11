"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const AMENITIES = [
  {
    id: "spa",
    label: "01",
    title: "The Private Spa",
    subtitle: "Sanctuary of Restoration",
    description: "Basalt stone floors. Zero-gravity treatment pods. A private spa that exists beyond the concept of time.",
    src: "/images/amenities/spa.png",
    accent: "Thermal · Hydrotherapy · Meditation",
  },
  {
    id: "pool",
    label: "02",
    title: "Infinity Waters",
    subtitle: "Where Sky Meets Water",
    description: "Zero-edge pools that dissolve into the horizon. Temperature-controlled to the degree. Open to the stars.",
    src: "/images/amenities/pool.png",
    accent: "Infinity · Temperature-controlled · Stargazing",
  },
  {
    id: "vault",
    label: "03",
    title: "The Art Vault",
    subtitle: "Climate-Controlled Heritage",
    description: "A museum-grade underground vault for your most important works. Humidity-perfect. Drama-perfect.",
    src: "/images/amenities/vault.png",
    accent: "Museum-grade · Climate-controlled · Private",
  },
];

export default function SignatureAmenitiesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Label
      if (labelRef.current) {
        gsap.fromTo(labelRef.current, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0,
          scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none reverse" },
        });
      }

      // Image curtain reveals
      imageRefs.current.forEach((imgEl, i) => {
        if (!imgEl) return;
        gsap.fromTo(imgEl,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            ease: "power4.out",
            scrollTrigger: {
              trigger: section,
              start: `top+=${i * 25}%`,
              end: `top+=${i * 25 + 15}%`,
              scrub: 1,
              onEnter: () => setActiveIndex(i),
            },
          }
        );
      });

      // Content animations
      contentRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, x: 40 },
          {
            opacity: 1, x: 0, ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: `top+=${i * 25 + 5}%`,
              end: `top+=${i * 25 + 15}%`,
              scrub: 1,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="amenities"
      className="relative bg-[var(--surface)] py-16 md:py-32 px-6 md:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={labelRef} className="opacity-0 mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-section-label">— Signature Amenities</span>
            <h2 className="mt-4 text-section-title font-display font-bold text-[var(--ink)] leading-[0.9] tracking-tight">
              Beyond{" "}
              <span style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", color: "var(--champagne)" }}>
                Expectation
              </span>
            </h2>
          </div>
          <p className="text-[var(--muted-ink)] max-w-xs text-base leading-relaxed">
            Every residence includes access to a curated collection of private amenities designed to exceed imagination.
          </p>
        </div>

        {/* Amenity cards */}
        <div className="space-y-20 md:space-y-32">
          {AMENITIES.map((amenity, i) => (
            <div
              key={amenity.id}
              className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              {/* Image with curtain reveal */}
              <div className="w-full md:w-1/2 aspect-[4/3] overflow-hidden rounded-lg relative">
                <div
                  ref={(el) => { imageRefs.current[i] = el; }}
                  className="w-full h-full"
                  style={{ clipPath: "inset(100% 0 0 0)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={amenity.src}
                    alt={amenity.title}
                    className="w-full h-full object-cover"
                    style={{ transform: "scale(1.05)" }}
                  />
                </div>

                {/* Number overlay */}
                <div className="absolute top-6 left-6 z-10">
                  <span className="text-white/30 text-6xl font-bold font-display">{amenity.label}</span>
                </div>
              </div>

              {/* Content */}
              <div
                ref={(el) => { contentRefs.current[i] = el; }}
                className="w-full md:w-1/2 opacity-0"
              >
                <span className="text-section-label text-[var(--champagne)] mb-3 block">{amenity.subtitle}</span>
                <h3 className="text-[clamp(2.5rem,4vw,4rem)] font-display font-bold text-[var(--ink)] leading-[0.9] tracking-tight mb-6">
                  {amenity.title}
                </h3>
                <p className="text-[var(--muted-ink)] text-lg leading-relaxed mb-8 max-w-md">
                  {amenity.description}
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-[var(--champagne)]" />
                  <span className="text-[var(--stone)] text-xs tracking-[0.2em]">{amenity.accent}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
