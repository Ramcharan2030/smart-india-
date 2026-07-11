"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const MANIFESTO_WORDS = [
  "We", "don't", "build", "houses.", "We", "shape", "private", "worlds",
  "—", "spaces", "where", "every", "surface", "whispers", "your", "name,",
  "where", "stone", "and", "light", "conspire", "to", "move", "you.",
  "Luxury", "is", "not", "decoration.", "It", "is", "precision", "made", "emotional.",
];

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Create a single timeline that pins the section and scrubs the reveals
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=150%", // Section stays pinned for 1.5 screen-scrolls
          pin: true,
          pinSpacing: true,
          scrub: 1.0,
          anticipatePin: 1,
        },
      });

      // Label entrance: fades and moves up
      if (labelRef.current) {
        tl.fromTo(
          labelRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
      }

      // Words reveal: staggers from dim var(--stone) to dark var(--ink)
      const activeWords = wordsRef.current.filter((el): el is HTMLSpanElement => el !== null);
      if (activeWords.length > 0) {
        tl.fromTo(
          activeWords,
          { opacity: 0.08, color: "var(--stone)" },
          {
            opacity: 1,
            color: "var(--ink)",
            stagger: 0.1,
            duration: 1.2,
            ease: "none",
          },
          "+=0.1" // Small delay after label
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative min-h-screen flex flex-col items-center justify-center py-16 md:py-32 px-6 md:px-8 overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Subtle gradient */}
      <div className="absolute inset-0 gradient-radial-warm pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div ref={labelRef} className="opacity-0 mb-12">
          <span className="text-section-label">— Our Manifesto</span>
        </div>

        <p className="text-manifesto leading-[1.15] select-none" aria-label={MANIFESTO_WORDS.join(" ")}>
          {MANIFESTO_WORDS.map((word, i) => (
            <span key={i}>
              <span
                ref={(el) => { wordsRef.current[i] = el; }}
                className="inline-block transition-colors duration-300"
                style={{
                  color: "var(--stone)",
                  opacity: 0.08,
                }}
              >
                {word === "—" ? (
                  <span style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", color: "var(--champagne)" }}>{word}</span>
                ) : word}
              </span>
              {" "}
            </span>
          ))}
        </p>

        {/* Decorative divider */}
        <div className="mt-10 md:mt-20 flex items-center justify-center gap-6">
          <div className="h-[1px] w-24 bg-[var(--stone)]" />
          <div className="w-2 h-2 rounded-full bg-[var(--champagne)]" />
          <div className="h-[1px] w-24 bg-[var(--stone)]" />
        </div>
      </div>
    </section>
  );
}
