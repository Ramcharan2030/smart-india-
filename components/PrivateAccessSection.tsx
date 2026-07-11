"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

export default function PrivateAccessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const spotlight = spotlightRef.current;
    if (!section || !spotlight) return;

    // Spotlight cursor follow
    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlight.style.background = `radial-gradient(circle 200px at ${x}px ${y}px, rgba(200,169,106,0.15) 0%, rgba(200,169,106,0.05) 40%, transparent 70%)`;
    };

    section.addEventListener("mousemove", handleMouseMove);

    // Entrance animations
    const ctx = gsap.context(() => {
      if (labelRef.current) {
        gsap.fromTo(labelRef.current, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0,
          scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none reverse" },
        });
      }
      if (contentRef.current) {
        gsap.fromTo(contentRef.current, { opacity: 0, y: 60 }, {
          opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 60%", toggleActions: "play none none reverse" },
        });
      }
    }, section);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="private-access"
      className="relative min-h-screen bg-[var(--ink)] overflow-hidden flex items-center justify-center py-32 px-8"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/private-mansion.png"
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.15 }}
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[var(--ink)] opacity-80" />

      {/* Spotlight */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Decorative lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-[rgba(200,169,106,0.1)] to-transparent" />
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-[rgba(200,169,106,0.1)] to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div ref={labelRef} className="opacity-0 mb-12">
          <span className="text-section-label text-[var(--stone)]">— Private Access</span>
        </div>

        <div ref={contentRef} className="opacity-0">
          <h2 className="text-section-title font-display font-bold text-white leading-[0.9] tracking-tight mb-8">
            Not everyone{" "}
            <br />
            <span style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", color: "var(--champagne)" }}>
              deserves a tour.
            </span>
          </h2>

          <p className="text-[var(--stone)] text-xl leading-relaxed max-w-2xl mx-auto mb-12">
            Our most extraordinary properties are never listed. They are presented exclusively
            to clients who have earned the privilege. Move your cursor to reveal what awaits.
          </p>

          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-8">
              {["Goa", "Mumbai", "Rajasthan", "Kerala", "Delhi NCR"].map((city) => (
                <span key={city} className="text-section-label text-[var(--stone)] hover:text-[var(--champagne)] cursor-default transition-colors duration-300">
                  {city}
                </span>
              ))}
            </div>

            <button className="mt-8 group relative px-12 py-5 overflow-hidden rounded-full border border-[rgba(200,169,106,0.4)] text-[var(--champagne)] text-sm tracking-[0.25em] uppercase font-medium hover:text-white transition-colors duration-500">
              <span className="absolute inset-0 bg-[var(--champagne)] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10">Request Private Access</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
