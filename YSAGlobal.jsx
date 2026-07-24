"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

/* ————————————————————————————————————————————————
   YSA GLOBAL — Virtual support that scales with you.
   Quiet luxury. Architectural. Typography-first.
   Palette: Ink #0A1A3A · Midnight #060D1F · Royal #4B36CC
            Iris #7A66F0 · Bone #F8F7F4 · White
   Type: Cormorant Garamond (display) · Inter (body)
   ———————————————————————————————————————————————— */

const INK = "#0A1A3A";
const MIDNIGHT = "#060D1F";
const ROYAL = "#4B36CC";
const IRIS = "#7A66F0";
const BONE = "#F8F7F4";

/* ————— Global styles + fonts ————— */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: ${MIDNIGHT}; }

    .ysa { font-family: 'Inter', sans-serif; color: ${INK}; -webkit-font-smoothing: antialiased; }
    .serif { font-family: 'Cormorant Garamond', serif; }

    .eyebrow {
      font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase;
      font-weight: 500;
    }

    /* Scroll reveal: fade + 16px rise */
    .rv { opacity: 0; transform: translateY(16px);
      transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1); }
    .rv.in { opacity: 1; transform: translateY(0); }

    /* Hero load stagger */
    @keyframes heroUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .hero-up { opacity: 0; animation: heroUp 1.1s cubic-bezier(0.22,1,0.36,1) forwards; }

    /* Cinematic slow zoom on hero photograph */
    @keyframes kenburns { from { transform: scale(1); } to { transform: scale(1.08); } }
    .hero-photo { animation: kenburns 28s ease-in-out infinite alternate; will-change: transform; }

    .lift { transition: transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s cubic-bezier(0.22,1,0.36,1), border-color 0.45s; }
    .lift:hover { transform: translateY(-8px); }

    .snapx { scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
    .snapx::-webkit-scrollbar { display: none; }
    .snapx > * { scroll-snap-align: start; }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 10px;
      font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
      letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none;
      padding: 18px 36px; cursor: pointer; border: 1px solid transparent;
      transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
    }
    .btn-solid { background: #fff; color: ${INK}; }
    .btn-solid:hover { background: ${BONE}; transform: translateY(-2px); box-shadow: 0 16px 40px rgba(0,0,0,0.35); }
    .btn-ghost { background: transparent; color: #fff; border-color: rgba(255,255,255,0.35); }
    .btn-ghost:hover { border-color: #fff; transform: translateY(-2px); }
    .btn-royal { background: linear-gradient(120deg, ${ROYAL}, #2A1E8F); color: #fff; }
    .btn-royal:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(75,54,204,0.4); }
    .btn:focus-visible { outline: 2px solid ${IRIS}; outline-offset: 3px; }

    input:focus-visible, button:focus-visible, a:focus-visible { outline: 2px solid ${IRIS}; outline-offset: 3px; }

    @media (prefers-reduced-motion: reduce) {
      .rv, .hero-up { opacity: 1 !important; transform: none !important; animation: none !important; transition: none !important; }
      .hero-photo { animation: none !important; }
      html { scroll-behavior: auto; }
    }
  `}</style>
);

/* ————— Scroll reveal ————— */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), obs.unobserve(e.target))),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const Reveal = ({ children, delay = 0, style = {}, className = "" }) => {
  const ref = useReveal();
  return (
    <div ref={ref} className={`rv ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
};

/* ————— Logo · official mark ————— */
const Logo = ({ light = false, size = 15 }) => (
  <img
    src={light ? "/logo-light.png" : "/logo.png"}
    alt="YSA Global"
    style={{ height: size * 3.6, width: "auto", display: "block" }}
  />
);

/* ————— Cinematic skyline · real photography ————— */
const HERO_SOURCES = [
  // Manhattan at dusk — natural golds, warm windows, blue hour sky
  "https://images.unsplash.com/photo-1546436836-07a91091f160?q=80&w=2600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522083165195-3424ed129620?q=80&w=2600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?q=80&w=2600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2600&auto=format&fit=crop",
];

const HeroBackdrop = () => {
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: `linear-gradient(180deg, ${MIDNIGHT} 0%, #0B1430 100%)` }} aria-hidden="true">
      <img
        src={HERO_SOURCES[idx]}
        alt=""
        onLoad={() => setLoaded(true)}
        onError={() => setIdx((i) => (i + 1 < HERO_SOURCES.length ? i + 1 : i))}
        className="hero-photo"
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center 38%",
          opacity: loaded ? 1 : 0, transition: "opacity 1.6s ease",
        }}
      />
      {/* neutral cinematic grade — legibility without tinting the photo purple */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(4,9,20,0.44)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(4,9,20,0.75) 0%, rgba(4,9,20,0.15) 42%, rgba(4,9,20,0.35) 70%, rgba(6,13,31,0.92) 100%)" }} />
    </div>
  );
};

/* ————— Minimal line icons ————— */
const Icon = ({ name, stroke = ROYAL }) => {
  const p = { fill: "none", stroke, strokeWidth: 1.25, strokeLinecap: "round", strokeLinejoin: "round" };
  if (name === "vetted")
    return (
      <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
        <path {...p} d="M22 5 L36 10 V21 C36 30 30 36.5 22 39.5 C14 36.5 8 30 8 21 V10 Z" />
        <path {...p} d="M15.5 21.5 L20 26 L29 16.5" />
      </svg>
    );
  if (name === "matched")
    return (
      <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
        <circle {...p} cx="15" cy="16" r="6" />
        <circle {...p} cx="30" cy="26" r="6" />
        <path {...p} d="M19.5 20.2 L25.4 21.9" />
        <path {...p} d="M6 38 C6 32.8 10 29.5 15 29.5" />
        <path {...p} d="M38 39 C38 35 34.6 32.5 30 32.5 C27.6 32.5 25.5 33.2 24 34.4" />
      </svg>
    );
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
      <path {...p} d="M7 34 L17 24 L24 30 L37 15" />
      <path {...p} d="M29.5 14.5 H37.5 V22.5" />
      <path {...p} d="M7 39 H37" />
    </svg>
  );
};

/* ————— Animated number ————— */
function useAnimatedNumber(target, duration = 900) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef(null);
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setValue(target); fromRef.current = target; return; }
    const from = fromRef.current;
    const start = performance.now();
    cancelAnimationFrame(rafRef.current);
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (target - from) * eased;
      setValue(v);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return value;
}

const fmt = (n) => "$" + Math.round(n).toLocaleString("en-US");

/* ————— Section shell ————— */
const Section = ({ bg, color, children, style = {}, id }) => (
  <section id={id} style={{ background: bg, color, padding: "clamp(96px, 14vw, 180px) 24px", ...style }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>{children}</div>
  </section>
);

const Eyebrow = ({ children, color = ROYAL }) => (
  <div className="eyebrow" style={{ color, marginBottom: 28 }}>{children}</div>
);

const Subhead = ({ children, light = false, center = false }) => (
  <p
    style={{
      fontSize: "clamp(15px, 1.4vw, 17px)", fontWeight: 300, lineHeight: 1.8,
      color: light ? "rgba(255,255,255,0.62)" : "#6B7286",
      maxWidth: 580, marginTop: 28, margin: center ? "28px auto 0" : "28px 0 0",
    }}
  >
    {children}
  </p>
);

/* ————— Roster modal ————— */
const ROSTER = {
  "Content & Creative": ["Video Editor — Reels / Shorts", "Motion Designer", "Graphic Designer", "Copywriter", "Podcast Producer", "Content Repurposing Specialist"],
  "Growth & Marketing": ["Social Media Strategist", "Paid Ads Manager — Meta / Google / TikTok", "SEO Specialist", "Email Marketing Manager", "Community Manager"],
  "Sales & Lead Generation": ["Lead Generation Specialist — Apollo / LinkedIn", "SDR / Cold Outreach", "CRM Administrator — HubSpot / Salesforce"],
  "Operations & Admin": ["Executive Assistant", "Operations Specialist", "Project Manager", "Customer Support Lead", "Bookkeeper"],
  "Data & Technical": ["Data Analyst", "Automation Specialist — Zapier / Make", "Web Developer", "No-Code Builder"],
};

const RosterModal = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      role="dialog" aria-modal="true" aria-label="Full talent roster"
      style={{
        position: "fixed", inset: 0, zIndex: 100, background: "rgba(6,13,31,0.82)",
        backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", maxWidth: 880, width: "100%", maxHeight: "84vh", overflowY: "auto",
          padding: "clamp(40px, 6vw, 72px)", position: "relative",
          boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: 24, right: 24, background: "none", border: "none",
            fontSize: 26, cursor: "pointer", color: INK, lineHeight: 1, padding: 8,
          }}
        >×</button>
        <div className="eyebrow" style={{ color: ROYAL, marginBottom: 16 }}>Full Talent Roster</div>
        <h3 className="serif" style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 500, marginBottom: 12 }}>
          23 roles. One standard.
        </h3>
        <p style={{ fontSize: 14, color: "#5B6478", maxWidth: 520, lineHeight: 1.7, marginBottom: 48 }}>
          Every professional on this roster is pre-vetted for skill, communication, and reliability.
          Don't see the role you need? Tell us — we'll source it.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 48 }}>
          {Object.entries(ROSTER).map(([cat, roles]) => (
            <div key={cat}>
              <div className="eyebrow" style={{ color: INK, fontSize: 10, marginBottom: 18, opacity: 0.6 }}>{cat}</div>
              {roles.map((r) => (
                <div key={r} style={{ fontSize: 14, padding: "10px 0", borderBottom: "1px solid #EEECE7", color: "#2B3448" }}>
                  {r}
                </div>
              ))}
            </div>
          ))}
        </div>
        <a href="mailto:adnan@ysa.global" className="btn btn-royal" style={{ marginTop: 56 }}>
          Request a Role
        </a>
      </div>
    </div>
  );
};

/* ————— ROI Calculator ————— */
const AVG_US_LOADED_MONTHLY = 8300;  // ~$72k salary + ~30% benefits/tax/tools, ~$100k all-in
const YSA_BLENDED_MONTHLY = 2200;    // blended mid-point of $1,000–$4,000 retainers

const Calculator = () => {
  const [usCost, setUsCost] = useState(8300);
  const roles = Math.max(1, Math.round(usCost / AVG_US_LOADED_MONTHLY));
  const ysaCost = Math.min(roles * YSA_BLENDED_MONTHLY, Math.max(usCost * 0.9, 1000));
  const annualSavings = Math.max((usCost - ysaCost) * 12, 0);
  const aYsa = useAnimatedNumber(ysaCost);
  const aSave = useAnimatedNumber(annualSavings);
  const pct = usCost > 0 ? Math.round(((usCost - ysaCost) / usCost) * 100) : 0;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: "clamp(40px, 6vw, 80px)",
        boxShadow: "0 40px 100px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(40px, 6vw, 80px)", alignItems: "center" }}>
        <div>
          <label htmlFor="uscost" className="eyebrow" style={{ color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 20 }}>
            Your US team cost / month
          </label>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.25)", paddingBottom: 12, marginBottom: 28 }}>
            <span className="serif" style={{ fontSize: 34, color: "rgba(255,255,255,0.5)" }}>$</span>
            <input
              id="uscost"
              type="number"
              min="1000" max="200000" step="500"
              value={usCost}
              onChange={(e) => setUsCost(Math.max(0, Number(e.target.value)))}
              style={{
                background: "transparent", border: "none", color: "#fff", width: "100%",
                fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(38px, 5vw, 56px)", fontWeight: 500,
              }}
            />
          </div>
          <input
            type="range" min="2000" max="60000" step="500" value={Math.min(usCost, 60000)}
            onChange={(e) => setUsCost(Number(e.target.value))}
            aria-label="US team cost slider"
            style={{ width: "100%", accentColor: IRIS, cursor: "pointer" }}
          />
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 24, lineHeight: 1.7 }}>
            Benchmarked against ~${(AVG_US_LOADED_MONTHLY / 1000).toFixed(1)}k/month fully-loaded cost per US hire
            (salary, benefits, payroll tax, tooling). Your input maps to ≈{roles} role{roles > 1 ? "s" : ""}.
          </p>
        </div>
        <div>
          <div style={{ marginBottom: 44 }}>
            <div className="eyebrow" style={{ color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>Your YSA cost / month</div>
            <div className="serif" style={{ fontSize: "clamp(40px, 5vw, 60px)", fontWeight: 500, color: "#fff" }}>
              {fmt(aYsa)}
            </div>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.12)", marginBottom: 44 }} />
          <div>
            <div className="eyebrow" style={{ color: IRIS, marginBottom: 12 }}>You save / year</div>
            <div
              className="serif"
              style={{
                fontSize: "clamp(52px, 7vw, 88px)", fontWeight: 500, lineHeight: 1,
                background: `linear-gradient(110deg, #fff 10%, ${IRIS} 90%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}
            >
              {fmt(aSave)}
            </div>
            {pct > 0 && (
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 16 }}>
                A {pct}% reduction — same output, embedded in your team.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ————— Data ————— */
const PROBLEMS = [
  { n: "01", t: "Hiring takes months.", d: "Job posts, screening calls, ghosted offers. By the time you've hired, the quarter is gone — and so is the momentum you were hiring for." },
  { n: "02", t: "Quality is a gamble.", d: "A polished résumé tells you nothing about output. Most founders find out a hire was wrong three months and thousands of dollars too late." },
  { n: "03", t: "Management becomes your second job.", d: "You wanted leverage. You got check-ins, briefs, and revisions. Delegation that requires constant supervision isn't delegation." },
];

const STEPS = [
  { icon: "vetted", n: "1", t: "Vetted", d: "We maintain a top-3% network of global professionals — screened for skill, English fluency, and Western working standards before you ever see them." },
  { icon: "matched", n: "2", t: "Matched", d: "Tell us the outcome you need. Within 1–2 weeks, you receive three hand-picked proposals. You choose the best fit. No job boards, no noise." },
  { icon: "scaled", n: "3", t: "Scaled", d: "Your talent embeds into your team. We handle contracts, quality, and continuity — so you get the output without the overhead." },
];

const SERVICES = [
  { t: "Video Editing", d: "Cinematic Reels, TikTok, and YouTube Shorts — cut for retention, delivered on cadence." },
  { t: "Social Media Strategy", d: "Instagram + X growth systems: positioning, content calendars, and daily execution." },
  { t: "Content Repurposing", d: "One podcast, keynote, or long-form asset becomes thirty pieces across every channel." },
  { t: "Lead Generation", d: "Apollo, LinkedIn, and cold email systems that fill your calendar with qualified calls." },
  { t: "Executive Assistant", d: "Inbox zero, calendar defense, travel, and operations — run to executive standard." },
  { t: "Paid Ads", d: "Meta, Google, and TikTok management with weekly reporting and creative iteration." },
];

const CASES = [
  {
    tag: "Video Editing + IG/X Strategy",
    title: "Scaling a founder's content engine",
    body: "A dedicated editor and strategist embedded with a US founder — turning one weekly recording session into a full short-form pipeline across Instagram and X.",
    live: true,
  },
  { tag: "Case Study", title: "Coming soon", body: "A new engagement is currently in progress. Results will be published here.", live: false },
  { tag: "Case Study", title: "Coming soon", body: "A new engagement is currently in progress. Results will be published here.", live: false },
];

/* ————— Main ————— */
export default function YSAGlobal() {
  const [rosterOpen, setRosterOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [parallax, setParallax] = useState(0);
  const ctaRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (ctaRef.current) {
        const r = ctaRef.current.getBoundingClientRect();
        const vh = window.innerHeight;
        if (r.top < vh && r.bottom > 0) {
          setParallax(((vh - r.top) / (vh + r.height) - 0.5) * 60);
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const slide = (dir) => {
    const el = sliderRef.current;
    if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.72), behavior: "smooth" });
  };

  return (
    <div className="ysa">
      <GlobalStyles />
      <RosterModal open={rosterOpen} onClose={() => setRosterOpen(false)} />

      {/* ————— NAV ————— */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: scrolled ? "16px clamp(24px, 5vw, 64px)" : "28px clamp(24px, 5vw, 64px)",
          background: scrolled ? "rgba(6,13,31,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
          transition: "all 0.45s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <Logo light size={14} />
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <button onClick={() => scrollTo("services")} style={navLink}>Services</button>
          <button onClick={() => scrollTo("calculator")} style={navLink}>Savings</button>
          <a href="mailto:adnan@ysa.global" className="btn btn-ghost" style={{ padding: "12px 24px", fontSize: 11 }}>
            Book a Call
          </a>
        </div>
      </nav>

      {/* ————— 1 · HERO ————— */}
      <header
        style={{
          position: "relative", minHeight: "100vh", display: "flex", alignItems: "center",
          justifyContent: "center", textAlign: "center", overflow: "hidden",
          background: MIDNIGHT, color: "#fff", padding: "120px 24px 80px",
        }}
      >
        <HeroBackdrop />
        <div style={{ position: "relative", maxWidth: 900 }}>
          <div className="hero-up eyebrow" style={{ color: IRIS, animationDelay: "0.1s", marginBottom: 36 }}>
            Embedded Talent · Built for Founders
          </div>
          <h1
            className="hero-up serif"
            style={{
              fontSize: "clamp(48px, 8.5vw, 108px)", fontWeight: 500, lineHeight: 1.02,
              letterSpacing: "-0.01em", animationDelay: "0.6s", marginBottom: 40,
            }}
          >
            Virtual support that
            <br />
            <em style={{ fontWeight: 400 }}>scales with you.</em>
          </h1>
          <p
            className="hero-up"
            style={{
              fontSize: "clamp(15px, 1.6vw, 18px)", fontWeight: 300, color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.02em", animationDelay: "1.1s", marginBottom: 56,
            }}
          >
            Vetted global talent. Western standards. Zero bloat.
          </p>
          <div className="hero-up" style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", animationDelay: "1.6s" }}>
            <a href="mailto:adnan@ysa.global" className="btn btn-solid">Book a Call</a>
            <button onClick={() => scrollTo("calculator")} className="btn btn-ghost">Calculate Your Savings</button>
          </div>
        </div>
        <div
          className="hero-up"
          style={{
            position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
            animationDelay: "2.2s", fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </div>
      </header>

      {/* ————— 2 · THE PROBLEM ————— */}
      <Section bg={BONE} color={INK}>
        <Reveal>
          <Eyebrow>The Problem</Eyebrow>
          <h2 className="serif" style={h2Style}>
            Agencies brag about themselves.
            <br />
            <em style={{ color: ROYAL, fontWeight: 400 }}>We solve your problem.</em>
          </h2>
          <Subhead>
            Three ways scaling founders lose time, money, and momentum — and the reason YSA exists.
          </Subhead>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 2, marginTop: 88, background: "#E7E4DC" }}>
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.n} delay={i * 120}>
              <div style={{ background: BONE, padding: "clamp(40px, 5vw, 64px) clamp(28px, 4vw, 48px)", height: "100%" }}>
                <div className="serif" style={{ fontSize: 20, color: "#B9B3A6", marginBottom: 32 }}>{p.n}</div>
                <h3 className="serif" style={{ fontSize: "clamp(26px, 3vw, 34px)", fontWeight: 500, lineHeight: 1.15, marginBottom: 24 }}>
                  {p.t}
                </h3>
                <p style={bodyText}>{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ————— 3 · HOW IT WORKS ————— */}
      <Section bg="#fff" color={INK}>
        <Reveal style={{ textAlign: "center" }}>
          <Eyebrow>How It Works</Eyebrow>
          <h2 className="serif" style={{ ...h2Style, margin: "0 auto" }}>
            Three steps. <em style={{ fontWeight: 400 }}>Zero friction.</em>
          </h2>
          <Subhead center>
            From first conversation to an embedded teammate — in one to two weeks, not one to two quarters.
          </Subhead>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "clamp(48px, 6vw, 80px)", marginTop: 100 }}>
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 140} style={{ textAlign: "center" }}>
              <div style={{ display: "inline-flex", marginBottom: 36 }}><Icon name={s.icon} /></div>
              <div className="eyebrow" style={{ color: "#9AA2B5", marginBottom: 14 }}>Step {s.n}</div>
              <h3 className="serif" style={{ fontSize: 32, fontWeight: 500, marginBottom: 20 }}>{s.t}</h3>
              <p style={{ ...bodyText, maxWidth: 320, margin: "0 auto" }}>{s.d}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200} style={{ textAlign: "center", marginTop: 88 }}>
          <p style={{ fontSize: 13, color: "#8A92A6", letterSpacing: "0.06em" }}>
            Not the right fit? We replace with the next best alternative. Guaranteed.
          </p>
        </Reveal>
      </Section>

      {/* ————— 4 · ROI CALCULATOR ————— */}
      <Section bg={INK} color="#fff" id="calculator" style={{ position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden="true"
          style={{
            position: "absolute", top: "-30%", right: "-15%", width: 700, height: 700, borderRadius: "50%",
            background: `radial-gradient(circle, ${ROYAL}33 0%, transparent 65%)`, pointerEvents: "none",
          }}
        />
        <Reveal>
          <Eyebrow color={IRIS}>The Math</Eyebrow>
          <h2 className="serif" style={h2Style}>
            See what staying local
            <br />
            <em style={{ fontWeight: 400, color: IRIS }}>is costing you.</em>
          </h2>
          <Subhead light>
            Benchmarked against real US market rates. Enter your monthly team cost — and watch the number change.
          </Subhead>
        </Reveal>
        <Reveal delay={150} style={{ marginTop: 80 }}>
          <Calculator />
        </Reveal>
      </Section>

      {/* ————— 5 · TRENDING SERVICES ————— */}
      <Section bg={BONE} color={INK} id="services">
        <Reveal>
          <Eyebrow>Trending Services · 2026</Eyebrow>
          <h2 className="serif" style={h2Style}>
            The roles founders are
            <br />
            hiring <em style={{ fontWeight: 400, color: ROYAL }}>right now.</em>
          </h2>
          <Subhead>
            Six engagements our clients scale with fastest — each delivered by a dedicated professional, not a rotating pool.
          </Subhead>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28, marginTop: 88 }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.t} delay={(i % 3) * 110}>
              <div
                className="lift"
                style={{
                  background: "#fff", border: "1px solid #E7E4DC", padding: "clamp(36px, 4vw, 52px)",
                  height: "100%", cursor: "default",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 28px 60px rgba(10,26,58,0.12)"; e.currentTarget.style.borderColor = "#CFC9F2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#E7E4DC"; }}
              >
                <div style={{ width: 28, height: 1, background: ROYAL, marginBottom: 32 }} />
                <h3 className="serif" style={{ fontSize: 27, fontWeight: 500, marginBottom: 16 }}>{s.t}</h3>
                <p style={bodyText}>{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={250} style={{ textAlign: "center", marginTop: 72 }}>
          <button onClick={() => setRosterOpen(true)} className="btn btn-royal">
            View Full Talent Roster
          </button>
        </Reveal>
      </Section>

      {/* ————— 6 · PROOF · CASE STUDY SLIDER ————— */}
      <Section bg={MIDNIGHT} color="#fff" style={{ paddingRight: 0, paddingLeft: 0 }}>
        <div style={{ padding: "0 24px", maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
              <div>
                <Eyebrow color={IRIS}>Proof</Eyebrow>
                <h2 className="serif" style={h2Style}>Selected work.</h2>
                <Subhead light>Live engagements, documented as they happen.</Subhead>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => slide(-1)} aria-label="Previous" style={arrowBtn}>←</button>
                <button onClick={() => slide(1)} aria-label="Next" style={arrowBtn}>→</button>
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal delay={150}>
          <div
            ref={sliderRef}
            className="snapx"
            style={{
              display: "flex", gap: 24, overflowX: "auto", marginTop: 72,
              padding: "8px max(24px, calc((100vw - 1200px) / 2)) 24px",
            }}
          >
            {CASES.map((c, i) => (
              <article
                key={i}
                style={{
                  flex: "0 0 min(560px, 82vw)",
                  minHeight: 400,
                  display: "flex", flexDirection: "column", justifyContent: "flex-end",
                  padding: "clamp(36px, 4vw, 56px)",
                  background: c.live
                    ? `linear-gradient(150deg, #16123F 0%, ${INK} 55%, #0B0F26 100%)`
                    : "rgba(255,255,255,0.03)",
                  border: c.live ? `1px solid ${ROYAL}66` : "1px solid rgba(255,255,255,0.08)",
                  position: "relative", overflow: "hidden",
                }}
              >
                {c.live && (
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute", top: -120, right: -120, width: 340, height: 340, borderRadius: "50%",
                      background: `radial-gradient(circle, ${ROYAL}55 0%, transparent 70%)`,
                    }}
                  />
                )}
                <div className="eyebrow" style={{ color: c.live ? IRIS : "rgba(255,255,255,0.35)", marginBottom: 20 }}>
                  {c.tag}
                </div>
                <h3 className="serif" style={{ fontSize: "clamp(28px, 3.4vw, 42px)", fontWeight: 500, lineHeight: 1.1, marginBottom: 20, color: c.live ? "#fff" : "rgba(255,255,255,0.5)" }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: c.live ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.35)", maxWidth: 420 }}>
                  {c.body}
                </p>
              </article>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ————— 7 · TESTIMONIALS ————— */}
      <Section bg="#fff" color={INK}>
        <Reveal style={{ textAlign: "center" }}>
          <Eyebrow>Testimonials</Eyebrow>
          <h2 className="serif" style={{ ...h2Style, margin: "0 auto" }}>What founders say.</h2>
          <Subhead center>
            Collected from active engagements and published as they close. No paid reviews, ever.
          </Subhead>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28, marginTop: 88 }}>
          {[0, 1, 2].map((i) => (
            <Reveal key={i} delay={i * 120}>
              <div
                style={{
                  border: "1px solid #ECEAE3", padding: "clamp(40px, 5vw, 60px) clamp(28px, 4vw, 44px)",
                  minHeight: 280, display: "flex", flexDirection: "column", justifyContent: "space-between",
                  background: BONE,
                }}
              >
                <div className="serif" style={{ fontSize: 56, lineHeight: 1, color: "#D8D3C6" }}>“</div>
                <div>
                  <p style={{ fontSize: 14, color: "#A9A398", fontStyle: "italic" }}>
                    Testimonial coming soon.
                  </p>
                  <div style={{ width: 32, height: 1, background: "#D8D3C6", margin: "28px 0 16px" }} />
                  <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B9B3A6" }}>
                    Founder · United States
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ————— 8 · FINAL CTA ————— */}
      <section
        ref={ctaRef}
        style={{
          background: `linear-gradient(170deg, ${INK} 0%, ${MIDNIGHT} 70%)`,
          color: "#fff", minHeight: "92vh", display: "flex", alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "120px 24px", position: "relative", overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute", left: "50%", bottom: "-20%", width: 900, height: 500,
            transform: `translateX(-50%) translateY(${parallax * -0.6}px)`,
            background: `radial-gradient(ellipse, ${ROYAL}40 0%, transparent 65%)`,
            pointerEvents: "none", transition: "transform 0.1s linear",
          }}
        />
        <div style={{ position: "relative", transform: `translateY(${parallax * 0.35}px)` }}>
          <Reveal>
            <h2 className="serif" style={{ fontSize: "clamp(56px, 10vw, 128px)", fontWeight: 500, lineHeight: 0.98, letterSpacing: "-0.01em", marginBottom: 32 }}>
              Your team is ready.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p style={{ fontSize: "clamp(16px, 2vw, 20px)", fontWeight: 300, color: "rgba(255,255,255,0.65)", marginBottom: 56 }}>
              Let's build it.
            </p>
          </Reveal>
          <Reveal delay={280}>
            <a href="mailto:adnan@ysa.global" className="btn btn-solid" style={{ padding: "22px 52px", fontSize: 14 }}>
              Book a Call with Adnan
            </a>
          </Reveal>
        </div>
      </section>

      {/* ————— 9 · FOOTER ————— */}
      <footer style={{ background: MIDNIGHT, color: "#fff", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "64px clamp(24px, 5vw, 64px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32 }}>
          <Logo light size={13} />
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("services")} style={footLink}>Services</button>
            <button onClick={() => scrollTo("calculator")} style={footLink}>Savings</button>
            <a href="mailto:adnan@ysa.global" style={{ ...footLink, textDecoration: "none" }}>Contact</a>
          </div>
          <div style={{ fontSize: 11, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)" }}>
            © 2026 YSA.global
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ————— Shared styles ————— */
const h2Style = {
  fontSize: "clamp(38px, 5.5vw, 68px)",
  fontWeight: 500,
  lineHeight: 1.06,
  letterSpacing: "-0.005em",
  maxWidth: 760,
};

const bodyText = { fontSize: 14.5, lineHeight: 1.85, color: "#5B6478", fontWeight: 400 };

const navLink = {
  background: "none", border: "none", color: "rgba(255,255,255,0.75)", cursor: "pointer",
  fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase",
  padding: 4,
};

const footLink = {
  background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer",
  fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase",
  padding: 4,
};

const arrowBtn = {
  width: 52, height: 52, borderRadius: "50%", background: "transparent",
  border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: 18, cursor: "pointer",
  transition: "all 0.3s",
};
