"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import dynamic from "next/dynamic";

const VillaModel = dynamic(() => import("./ThreeVillaModel"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-12 h-12 border border-[var(--champagne)]/40 rounded-full"
        style={{ animation: "pulse 2s ease-in-out infinite" }} />
    </div>
  ),
});

const CRAFT_STEPS = [
  {
    label: "01 — Vision",
    title: "Architecture begins with an impossible question",
    body: "Every project starts by asking: what if nothing was impossible? Then we build the answer in stone, glass, and light.",
  },
  {
    label: "02 — Material",
    title: "The right material has memory",
    body: "Travertine quarried in Rajasthan. Bronze cast in Kolkata. Oak sourced from sustainable forests. Every surface tells a story.",
  },
  {
    label: "03 — Light",
    title: "Light is the invisible architect",
    body: "We design not just structures but the light that lives within them — how morning gold lands on stone, how dusk ignites glass.",
  },
  {
    label: "04 — Craft",
    title: "Perfection is a discipline, not an accident",
    body: "Our artisans have spent decades mastering their craft. Every joint, every seam, every edge is intentional and inevitable.",
  },
];

export default function CraftSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const modelContainerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Pin the section
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${CRAFT_STEPS.length * 100}%`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      });

      // Label
      if (labelRef.current) {
        gsap.fromTo(labelRef.current, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0,
          scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none reverse" },
        });
      }

      // Animate each step in sequence
      stepsRef.current.forEach((step, i) => {
        if (!step) return;
        const progress = i / CRAFT_STEPS.length;
        const nextProgress = (i + 1) / CRAFT_STEPS.length;

        gsap.fromTo(step,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: `top+=${progress * 100}%`,
              end: `top+=${(progress + 0.15) * 100}%`,
              scrub: true,
            },
          }
        );

        // Fade out at end
        if (i < CRAFT_STEPS.length - 1) {
          gsap.to(step, {
            opacity: 0, y: -40,
            scrollTrigger: {
              trigger: section,
              start: `top+=${(nextProgress - 0.05) * 100}%`,
              end: `top+=${nextProgress * 100}%`,
              scrub: true,
            },
          });
        }
      });

      // Rotate model with scroll
      if (modelContainerRef.current) {
        gsap.to(modelContainerRef.current, {
          rotation: 360,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${CRAFT_STEPS.length * 100}%`,
            scrub: 2,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="craft"
      className="relative min-h-screen bg-[var(--ink)] overflow-hidden"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(138,106,62,0.08) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 min-h-screen md:h-screen flex flex-col md:flex-row items-center">
        {/* Left: 3D Model */}
        <div className="w-full md:w-1/2 h-[45vh] md:h-full relative flex items-center justify-center">
          <div ref={modelContainerRef} className="w-full h-[38vh] md:h-[70vh]">
            <VillaModel />
          </div>
        </div>

        {/* Right: Typography sequence */}
        <div className="w-full md:w-1/2 h-[55vh] md:h-full flex flex-col justify-center px-6 md:pl-8 md:pr-20 relative">
          <div ref={labelRef} className="opacity-0 mb-12">
            <span className="text-section-label text-[var(--stone)]">— The Craft</span>
          </div>

          <div className="relative" style={{ minHeight: "300px" }}>
            {CRAFT_STEPS.map((step, i) => (
              <div
                key={i}
                ref={(el) => { stepsRef.current[i] = el; }}
                className="absolute top-0 left-0 opacity-0"
              >
                <span className="text-section-label text-[var(--champagne)] mb-4 block">{step.label}</span>
                <h2 className="text-[clamp(2rem,4vw,4rem)] font-display font-bold text-white leading-[0.95] tracking-tight mb-6">
                  {step.title}
                </h2>
                <p className="text-[var(--stone)] text-lg leading-relaxed max-w-md">
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          {/* Progress indicator */}
          <div className="mt-16 flex items-center gap-3">
            {CRAFT_STEPS.map((_, i) => (
              <div
                key={i}
                className="h-[1px] transition-all duration-500"
                style={{ width: i === 0 ? "32px" : "12px", background: i === 0 ? "var(--champagne)" : "rgba(216,195,165,0.3)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
