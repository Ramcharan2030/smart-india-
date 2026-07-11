"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const PROJECTS = [
  {
    id: "villa-01",
    title: "The Sky Villa",
    location: "Goa, India",
    year: "2024",
    category: "Private Residence",
    src: "/images/villa-01.webp",
    description: "A cliffside sanctuary suspended above the Arabian Sea, where infinity pools dissolve into the horizon.",
  },
  {
    id: "tower-01",
    title: "Elevation Tower",
    location: "Mumbai, India",
    year: "2024",
    category: "Luxury Tower",
    src: "/images/tower-01.webp",
    description: "An architectural statement rising above the skyline — 72 floors of curated living above the clouds.",
  },
  {
    id: "estate-01",
    title: "The Heritage Estate",
    location: "Rajasthan, India",
    year: "2023",
    category: "Private Estate",
    src: "/images/estate-01.webp",
    description: "Ancient sandstone reimagined for the modern sovereign — where history meets unprecedented luxury.",
  },
];

export default function AnthologySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const totalScrollWidth = track.scrollWidth - window.innerWidth;

      // Horizontal scroll
      gsap.to(track, {
        x: -totalScrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalScrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Label entrance
      if (labelRef.current) {
        gsap.fromTo(labelRef.current, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.6,
          scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none reverse" },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="anthology" className="relative overflow-hidden bg-[var(--background)]">
      {/* Label */}
      <div ref={labelRef} className="absolute top-12 left-12 z-20 opacity-0">
        <span className="text-section-label">— Our Anthology</span>
      </div>

      {/* Horizontal track */}
      <div ref={trackRef} className="flex items-stretch" style={{ width: "max-content" }}>
        {/* Intro card */}
        <div className="flex-shrink-0 w-[85vw] md:w-[40vw] flex flex-col justify-end p-8 md:p-16 pr-0">
          <h2
            className="text-section-title font-display font-bold text-[var(--ink)] leading-[0.9] tracking-[-0.05em]"
          >
            Worlds We&apos;ve{" "}
            <br />
            <span style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", color: "var(--champagne)" }}>
              Summoned
            </span>
          </h2>
          <p className="mt-6 text-[var(--muted-ink)] text-base max-w-xs leading-relaxed">
            Three defining projects that redefined what luxury architecture means in India.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="h-[1px] w-8 bg-[var(--champagne)]" />
            <span className="text-[var(--champagne)] text-xs tracking-[0.25em] uppercase">Scroll right</span>
          </div>
        </div>

        {/* Project cards */}
        {PROJECTS.map((project, i) => (
          <div
            key={project.id}
            className="relative flex-shrink-0 w-[85vw] md:w-[75vw] h-screen cursor-none overflow-hidden"
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{ marginLeft: i === 0 ? "5vw" : "4vw" }}
          >
            {/* Image */}
            <div
              className="absolute inset-0 transition-transform duration-700 ease-out"
              style={{ transform: hoveredId === project.id ? "scale(1.04)" : "scale(1)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.src}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Gradient overlay */}
            <div
              className="absolute inset-0 transition-opacity duration-700"
              style={{
                background: "linear-gradient(180deg, transparent 40%, rgba(23,19,15,0.8) 100%)",
                opacity: hoveredId === project.id ? 1 : 0.6,
              }}
            />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <div className="flex items-center justify-between mb-3">
                <span className="text-section-label text-white/60">{project.category}</span>
                <span className="text-section-label text-white/40">{project.year}</span>
              </div>
              <h3 className="text-[clamp(2rem,4vw,4rem)] font-display font-bold text-white leading-[0.9] tracking-tight">
                {project.title}
              </h3>
              <p className="text-white/60 text-sm mt-1">{project.location}</p>

              {/* Hover reveal description */}
              <div
                className="overflow-hidden transition-all duration-500"
                style={{ maxHeight: hoveredId === project.id ? "80px" : "0px", opacity: hoveredId === project.id ? 1 : 0 }}
              >
                <p className="text-white/80 text-sm mt-4 leading-relaxed max-w-md">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Number */}
            <div className="absolute top-12 right-12">
              <span className="text-white/20 text-[5rem] font-bold leading-none font-display">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        ))}

        {/* End spacer */}
        <div className="flex-shrink-0 w-[20vw]" />
      </div>
    </section>
  );
}
