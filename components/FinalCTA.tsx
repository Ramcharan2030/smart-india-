"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { motion, AnimatePresence } from "framer-motion";
import { prefersReducedMotion } from "@/lib/utils";

export default function FinalCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", message: "", submitted: false });

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; life: number }[] = [];

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(Math.random() * 1.5 + 0.5),
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      life: 1,
    });

    for (let i = 0; i < 60; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    let rafId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.003;
        if (p.y < -10 || p.life <= 0) {
          particles[i] = createParticle();
          return;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 169, 106, ${p.opacity * p.life})`;
        ctx.fill();
      });
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(rafId);
  }, []);

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
      if (contentRef.current) {
        gsap.fromTo(contentRef.current, { opacity: 0, y: 60 }, {
          opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 65%", toggleActions: "play none none reverse" },
        });
      }
    }, section);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, submitted: true }));
    setTimeout(() => setIsModalOpen(false), 2000);
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="cta"
        className="relative min-h-screen bg-[var(--ink)] overflow-hidden flex items-center justify-center py-32 px-8"
      >
        {/* Particle canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        />

        {/* Gradient rings */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ border: "1px solid rgba(200,169,106,0.08)" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
            style={{ border: "1px solid rgba(200,169,106,0.04)" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full"
            style={{ border: "1px solid rgba(200,169,106,0.02)" }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div ref={labelRef} className="opacity-0 mb-12">
            <span className="text-section-label text-[var(--stone)]">— Begin Your Journey</span>
          </div>

          <div ref={contentRef} className="opacity-0">
            <h2 className="text-section-title font-display font-bold text-white tracking-tight" style={{ marginBottom: "2.5rem" }}>
              Your world is waiting{" "}
              <br />
              <span style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", color: "var(--champagne)" }}>
                to be designed.
              </span>
            </h2>

            <p className="text-[var(--stone)] text-xl leading-relaxed max-w-2xl mx-auto" style={{ marginBottom: "3.5rem" }}>
              Schedule a private consultation with our lead architects. Share your vision.
              We&apos;ll show you what&apos;s possible.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center" style={{ gap: "1.5rem", marginBottom: "6rem" }}>
              <button
                id="cta-consultation-btn"
                onClick={() => setIsModalOpen(true)}
                className="group relative px-12 py-5 overflow-hidden rounded-full bg-[var(--champagne)] text-white text-sm tracking-[0.25em] uppercase font-medium hover:shadow-[0_0_40px_rgba(200,169,106,0.4)] transition-shadow duration-500"
              >
                <span className="relative z-10">Schedule Consultation</span>
              </button>
              <button className="px-12 py-5 rounded-full border border-[rgba(200,169,106,0.3)] text-[var(--champagne)] text-sm tracking-[0.25em] uppercase font-medium hover:border-[var(--champagne)] transition-colors duration-300">
                View Portfolio
              </button>
            </div>

            <div className="pt-12 border-t border-[rgba(216,195,165,0.15)]" style={{ marginTop: "6rem" }}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <div className="text-white font-display font-bold text-lg tracking-[0.15em]">
                    SMART INDIA REALTORS
                  </div>
                  <div className="text-[var(--stone)] text-sm mt-1">Private Architectural Worlds</div>
                </div>
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-section-label text-[var(--stone)]">
                  <span>Mumbai</span>
                  <span>Goa</span>
                  <span>Delhi NCR</span>
                  <span>Rajasthan</span>
                </div>
                <div className="text-[var(--stone)] text-sm text-center md:text-right">
                  <div>contact@smartindiarealtors.com</div>
                  <div className="mt-1">+91 98765 43210</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
          >
            <div className="absolute inset-0 bg-[var(--ink)] opacity-80 backdrop-blur-sm" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg glass-warm rounded-2xl p-10 shadow-[0_24px_80px_rgba(138,106,62,0.2)]"
            >
              {/* Close */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-[var(--muted-ink)] hover:text-[var(--ink)] transition-colors"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              {formState.submitted ? (
                <div className="text-center py-8">
                  <div className="text-[var(--champagne)] text-4xl mb-4">✓</div>
                  <h3 className="text-2xl font-display font-bold text-[var(--ink)] mb-2">Thank you</h3>
                  <p className="text-[var(--muted-ink)]">We&apos;ll be in touch within 24 hours.</p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <span className="text-section-label text-[var(--champagne)] mb-2 block">— Private Consultation</span>
                    <h3 className="text-3xl font-display font-bold text-[var(--ink)] leading-tight">
                      Begin your
                      <br />
                      <span style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", color: "var(--champagne)" }}>
                        private journey
                      </span>
                    </h3>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="text-section-label text-[var(--muted-ink)] block mb-2" htmlFor="modal-name">Full Name</label>
                      <input
                        id="modal-name"
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-[rgba(245,239,228,0.5)] border border-[rgba(138,106,62,0.2)] rounded-lg text-[var(--ink)] placeholder-[var(--stone)] focus:border-[var(--champagne)] focus:outline-none transition-colors duration-300 text-sm"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-section-label text-[var(--muted-ink)] block mb-2" htmlFor="modal-email">Email Address</label>
                      <input
                        id="modal-email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-[rgba(245,239,228,0.5)] border border-[rgba(138,106,62,0.2)] rounded-lg text-[var(--ink)] placeholder-[var(--stone)] focus:border-[var(--champagne)] focus:outline-none transition-colors duration-300 text-sm"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-section-label text-[var(--muted-ink)] block mb-2" htmlFor="modal-message">Your Vision</label>
                      <textarea
                        id="modal-message"
                        rows={4}
                        value={formState.message}
                        onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full px-4 py-3 bg-[rgba(245,239,228,0.5)] border border-[rgba(138,106,62,0.2)] rounded-lg text-[var(--ink)] placeholder-[var(--stone)] focus:border-[var(--champagne)] focus:outline-none transition-colors duration-300 text-sm resize-none"
                        placeholder="Describe your ideal property or investment goals..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 bg-[var(--champagne)] text-white text-sm tracking-[0.25em] uppercase font-medium rounded-full hover:shadow-[0_0_30px_rgba(200,169,106,0.4)] transition-shadow duration-500"
                    >
                      Submit Request
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
