import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PublicService } from "../services";
import { BarLoader } from "../utils/Loader";
import {
  FiPhone,
  FiMapPin,
  FiInstagram,
  FiFacebook,
  FiArrowRight,
  FiGlobe,
  FiMail,
  FiMenu,
  FiX,
  FiCheck,
  FiPackage,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const NAV_LINKS = [
  { label: "About", id: "about" },
  { label: "Services", id: "services" },
  { label: "How It Works", id: "how-it-works" },
  { label: "Contact", id: "contact" },
];
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const STYLES = `
  @keyframes bubble-rise {
    0%   { transform: translateY(0) scale(1);    opacity: 0.55; }
    100% { transform: translateY(-700px) scale(0.45); opacity: 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33%      { transform: translateY(-13px) rotate(1deg); }
    66%      { transform: translateY(-6px) rotate(-1deg); }
  }
  @keyframes float2 {
    0%, 100% { transform: translateY(0px); }
    50%      { transform: translateY(-18px); }
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slide-left {
    from { opacity: 0; transform: translateX(50px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes scale-in {
    from { opacity: 0; transform: scale(0.78); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes pulse-ring {
    0%  { box-shadow: 0 0 0 0    rgba(26,107,255,0.55); }
    70% { box-shadow: 0 0 0 22px rgba(26,107,255,0);    }
    100%{ box-shadow: 0 0 0 0    rgba(26,107,255,0);    }
  }
  @keyframes gradient-pan {
    0%, 100% { background-position: 0%   50%; }
    50%      { background-position: 100% 50%; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes shimmer-slide {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .bubble {
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.055);
    border: 1px solid rgba(255,255,255,0.04);
    animation: bubble-rise linear infinite;
  }

  .fa1 { animation: fade-up   0.65s 0.00s ease-out both; }
  .fa2 { animation: fade-up   0.65s 0.12s ease-out both; }
  .fa3 { animation: fade-up   0.65s 0.24s ease-out both; }
  .fa4 { animation: fade-up   0.65s 0.36s ease-out both; }
  .fa5 { animation: fade-up   0.65s 0.48s ease-out both; }
  .sl1 { animation: slide-left 0.85s 0.25s cubic-bezier(0.34,1.15,0.64,1) both; }
  .si1 { animation: scale-in   0.6s  0.15s cubic-bezier(0.34,1.4,0.64,1) both; }

  .pulse-cta { animation: pulse-ring 2.2s ease-in-out infinite; }

  .grad-text {
    background: linear-gradient(90deg, #60a5fa, #34d399, #a78bfa, #60a5fa);
    background-size: 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradient-pan 5.5s ease infinite;
  }

  .hero-ring {
    border-radius: 50%;
    position: absolute;
    animation: spin-slow linear infinite;
  }

  .card-lift {
    transition: transform 0.3s cubic-bezier(0.34,1.3,0.64,1), box-shadow 0.3s ease;
  }
  .card-lift:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 28px 60px rgba(0,80,255,0.11);
  }

  .service-card-new {
    transition: transform 0.3s cubic-bezier(0.34,1.3,0.64,1), box-shadow 0.3s ease;
  }
  .service-card-new:hover {
    transform: translateY(-7px);
    box-shadow: 0 24px 52px rgba(0,80,255,0.13);
  }

  .contact-card {
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .contact-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 44px rgba(0,80,255,0.09);
    border-color: rgba(0,80,255,0.2) !important;
  }

  .float-b1 { animation: float  4.2s ease-in-out 0.0s infinite; }
  .float-b2 { animation: float2 5.1s ease-in-out 0.9s infinite; }
  .float-b3 { animation: float  3.9s ease-in-out 1.7s infinite; }
  .float-b4 { animation: float2 4.7s ease-in-out 0.4s infinite; }

  .step-connector {
    background: linear-gradient(90deg, transparent, rgba(26,107,255,0.28), transparent);
  }

  .nav-link-pill:hover { background: rgba(255,255,255,0.10); }
  .nav-link-dark:hover  { background: rgba(0,0,0,0.04); }

  .shimmer-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%);
    animation: shimmer-slide 2.5s ease-in-out infinite;
    pointer-events: none;
    border-radius: inherit;
  }
`;

/**
 * Resolve a social media handle or full URL into a usable href.
 * If the stored value is already a full URL (starts with http/https), use it
 * directly. Otherwise prepend the platform base URL.
 */
function socialUrl(base, handle) {
  if (!handle) return null;
  const trimmed = handle.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `${base}/${trimmed}`;
}

export default function LaundryLandingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [laundry, setLaundry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    loadLaundry();
  }, [slug]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 55);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  async function loadLaundry() {
    try {
      setLaundry(await PublicService.getLaundry(slug));
    } catch (err) {
      setError(err?.response?.data?.message || "This page is not available.");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-5"
        style={{
          background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)",
        }}
      >
        <div
          className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-4xl"
          style={{ animation: "fade-up 0.5s ease both" }}
        >
          🧺
        </div>
        <BarLoader />
      </div>
    );

  if (error)
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center"
        style={{
          background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)",
        }}
      >
        <div className="w-24 h-24 rounded-3xl bg-blue-50 flex items-center justify-center text-5xl shadow-lg shadow-blue-100">
          🧺
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
            {error}
          </p>
        </div>
      </div>
    );

  const base = import.meta.env.VITE_API_IMAGE_BASE_URL;
  //   import.meta.env.VITE_API_BASE_URL?.replace("/api", "") + "/storage/"
  // ).replace(/\/$/, "");

  const logoSrc = laundry.logo
    ? `${base}logos/${laundry.logo}`
    : "/logos/blue-icon.png";
  const coverSrc = laundry.cover_image
    ? `${base}covers/${laundry.cover_image}`
    : null;
  const hasContact =
    laundry.phone ||
    laundry.email ||
    laundry.address ||
    laundry.whatsapp ||
    laundry.instagram ||
    laundry.facebook ||
    laundry.website;

  const BUBBLES = [
    { s: 48, l: "4%", dur: "11s", del: "0s" },
    { s: 82, l: "14%", dur: "15s", del: "2.4s" },
    { s: 32, l: "27%", dur: "9s", del: "1.2s" },
    { s: 118, l: "38%", dur: "18s", del: "4s" },
    { s: 58, l: "51%", dur: "13s", del: "0.6s" },
    { s: 40, l: "64%", dur: "10s", del: "3.1s" },
    { s: 96, l: "74%", dur: "16s", del: "5.8s" },
    { s: 52, l: "84%", dur: "12s", del: "2.2s" },
    { s: 28, l: "93%", dur: "8s", del: "4.9s" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans antialiased overflow-x-hidden">
      <style>{STYLES}</style>

      {/* ════════════ NAVBAR ════════════════════════════════════ */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/96 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">
          {/* Brand */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 min-w-0"
          >
            <div
              className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 transition-all ${
                scrolled
                  ? "bg-gray-50 shadow-sm"
                  : "bg-white/14 backdrop-blur-sm"
              }`}
            >
              <img src={logoSrc} alt="" className="w-7 h-7 object-contain" />
            </div>
            <span
              className={`font-extrabold text-[15px] truncate transition-colors ${
                scrolled ? "text-gray-900" : "text-white"
              }`}
            >
              {laundry.name}
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className={`text-sm font-medium px-4 py-2.5 rounded-xl transition-all ${
                  scrolled
                    ? "text-gray-500 hover:text-gray-900 nav-link-dark"
                    : "text-white/75 hover:text-white nav-link-pill"
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => navigate(`/${slug}/booking`)}
            className="hidden md:flex items-center gap-2 bg-primary hover:bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-px hover:shadow-primary/50"
          >
            Book Now <FiArrowRight size={14} />
          </button>

          <button
            onClick={() => setNavOpen((v) => !v)}
            className={`md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              scrolled
                ? "text-gray-700 hover:bg-gray-100"
                : "text-white hover:bg-white/12"
            }`}
          >
            {navOpen ? <FiX size={21} /> : <FiMenu size={21} />}
          </button>
        </div>

        {/* Mobile menu */}
        {navOpen && (
          <div className="md:hidden bg-white/97 backdrop-blur-xl border-t border-gray-100 shadow-2xl px-6 pt-4 pb-6 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  scrollTo(l.id);
                  setNavOpen(false);
                }}
                className="text-sm font-semibold text-gray-700 hover:text-primary hover:bg-primary/6 py-3 px-4 rounded-xl text-left transition-colors"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => {
                navigate(`/${slug}/booking`);
                setNavOpen(false);
              }}
              className="mt-3 bg-primary text-white text-sm font-extrabold py-4 rounded-2xl text-center shadow-xl shadow-primary/25"
            >
              Book Now — Free & Instant
            </button>
          </div>
        )}
      </header>

      {/* ════════════ HERO ══════════════════════════════════════ */}
      <section
        id="home"
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Background */}
        {coverSrc ? (
          <>
            <img
              src={coverSrc}
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Base dark veil — uniform readability across the whole hero */}
            <div
              className="absolute inset-0"
              style={{ background: "rgba(4,10,28,0.55)" }}
            />
            {/* Extra gradient on text side for extra contrast */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right,rgba(3,9,28,0.58) 0%,rgba(3,9,28,0.42) 38%,rgba(3,9,28,0.18) 65%,transparent 100%)",
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(140deg,#020c20 0%,#061840 22%,#0a3585 55%,#0059d9 82%,#1a72ff 100%)",
              }}
            />
            <div
              className="absolute -top-[18%] right-[-12%] w-[760px] h-[760px] rounded-full opacity-28 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle,#4f8ef7 0%,transparent 62%)",
              }}
            />
            <div
              className="absolute bottom-[-22%] left-[-8%] w-[560px] h-[560px] rounded-full opacity-18 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle,#0ea5e9 0%,transparent 65%)",
              }}
            />
            <div
              className="absolute top-[42%] left-[36%] w-[380px] h-[380px] rounded-full opacity-9 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle,#34d399 0%,transparent 65%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.042]"
              style={{
                backgroundImage:
                  "radial-gradient(circle,white 1.3px,transparent 1.3px)",
                backgroundSize: "38px 38px",
              }}
            />
            {BUBBLES.map((b, i) => (
              <div
                key={i}
                className="bubble"
                style={{
                  width: b.s,
                  height: b.s,
                  left: b.l,
                  bottom: "-6%",
                  animationDuration: b.dur,
                  animationDelay: b.del,
                }}
              />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-10 lg:gap-20 items-center">
            {/* ── Text ── */}
            <div>
              {/* Live pill */}
              <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/18 text-white/90 text-xs font-semibold px-4 py-2 rounded-full mb-8 fa1">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                Now accepting online bookings
              </div>

              <h1
                className="fa2 font-extrabold text-white tracking-tight leading-[1.06] mb-4"
                style={{
                  fontSize: "clamp(2.5rem,5.5vw,4rem)",
                  textShadow:
                    "0 2px 24px rgba(0,0,0,0.65), 0 1px 6px rgba(0,0,0,0.5)",
                }}
              >
                {laundry.name}
              </h1>
              <p
                className="fa3 font-semibold text-white/90 mb-7 leading-snug"
                style={{
                  fontSize: "clamp(1.05rem,2.2vw,1.35rem)",
                  textShadow: "0 1px 14px rgba(0,0,0,0.6)",
                }}
              >
                {laundry.tagline ||
                  "Professional Laundry Services at Your Fingertips"}
              </p>

              {/* {laundry.description && (
                <p
                  className="fa4 text-white/82 text-[15px] leading-[1.85] mb-9 max-w-[500px]"
                  style={{ textShadow: "0 1px 10px rgba(0,0,0,0.55)" }}
                >
                  {laundry.description.slice(0, 190)}
                  {laundry.description.length > 190 ? "…" : ""}
                </p>
              )} */}

              {/* CTAs */}
              <div className="fa5 flex flex-wrap gap-3 mb-10">
                <button
                  onClick={() => navigate(`/${slug}/booking`)}
                  className="pulse-cta flex items-center gap-2.5 bg-white text-primary font-extrabold text-sm px-8 py-4 rounded-2xl shadow-2xl shadow-black/22 hover:scale-105 transition-all"
                >
                  Book Now <FiArrowRight size={16} />
                </button>
                <button
                  onClick={() => scrollTo("services")}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/17 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm px-8 py-4 rounded-2xl transition-all"
                >
                  View Services
                </button>
              </div>

              {/* Trust row */}
              <div className="fa5 flex flex-wrap gap-5">
                {[
                  "No account needed",
                  "Instant booking code",
                  "Secure & easy",
                ].map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-2 text-white/85 text-xs font-medium"
                    style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
                  >
                    <div className="w-4 h-4 rounded-full bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
                      <FiCheck className="text-emerald-400" size={9} />
                    </div>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Visual panel ── */}
            <div className="hidden lg:flex items-center justify-center relative h-[520px]">
              {/* Decorative rings */}
              <div className="absolute w-[430px] h-[430px] rounded-full border border-white/7 pointer-events-none" />
              <div
                className="hero-ring absolute w-[385px] h-[385px] pointer-events-none"
                style={{
                  border: "1.5px solid rgba(255,255,255,0.055)",
                  animationDuration: "38s",
                }}
              />
              <div
                className="hero-ring absolute w-[328px] h-[328px] pointer-events-none"
                style={{
                  border: "1.5px solid rgba(255,255,255,0.07)",
                  animationDuration: "26s",
                  animationDirection: "reverse",
                }}
              />

              {/* Glass card */}
              <div className="sl1 relative z-10 flex flex-col items-center gap-5 bg-white/10 backdrop-blur-3xl border border-white/16 rounded-[2.5rem] p-9 shadow-[0_36px_88px_rgba(0,0,0,0.38)] w-[248px]">
                <div className="relative">
                  <div className="w-[84px] h-[84px] rounded-2xl overflow-hidden bg-white shadow-2xl flex items-center justify-center p-1.5">
                    <img
                      src={logoSrc}
                      alt={laundry.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30">
                    <FiCheck className="text-white" size={12} />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white font-extrabold text-base leading-snug">
                    {laundry.name}
                  </p>
                  <p className="text-white/70 text-[11px] mt-1 font-medium">
                    Professional Laundry
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {laundry.pickup_enabled && (
                    <span className="bg-blue-500/18 border border-blue-400/22 text-blue-200 text-[10px] font-bold px-3 py-1.5 rounded-full">
                      🚗 Pickup
                    </span>
                  )}
                  {laundry.dropoff_enabled && (
                    <span className="bg-emerald-500/16 border border-emerald-400/20 text-emerald-200 text-[10px] font-bold px-3 py-1.5 rounded-full">
                      🏪 Drop-off
                    </span>
                  )}
                </div>
              </div>

              {/* Floating badges */}
              <div className="float-b1 absolute top-8 -right-4 bg-white rounded-2xl px-4 py-3 shadow-2xl border border-gray-100 flex items-center gap-3 min-w-[148px] overflow-hidden shimmer-card">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-lg flex-shrink-0">
                  ✨
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold">
                    Quality
                  </p>
                  <p className="text-xs font-extrabold text-gray-800">
                    Fresh &amp; Clean
                  </p>
                </div>
              </div>
              <div className="float-b2 absolute bottom-16 -right-3 bg-white rounded-2xl px-4 py-3 shadow-2xl border border-gray-100 flex items-center gap-3 min-w-[148px]">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-lg flex-shrink-0">
                  ⚡
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold">
                    Speed
                  </p>
                  <p className="text-xs font-extrabold text-gray-800">
                    Fast Turnaround
                  </p>
                </div>
              </div>
              <div className="float-b3 absolute top-20 -left-8 bg-white rounded-2xl px-4 py-3 shadow-2xl border border-gray-100 flex items-center gap-3 min-w-[148px]">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-lg flex-shrink-0">
                  📦
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold">
                    Booking
                  </p>
                  <p className="text-xs font-extrabold text-gray-800">
                    100% Online
                  </p>
                </div>
              </div>
              <div className="float-b4 absolute bottom-6 -left-2 bg-white rounded-2xl px-4 py-3 shadow-2xl border border-gray-100 flex items-center gap-3 min-w-[148px]">
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-lg flex-shrink-0">
                  🔒
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold">
                    Secure
                  </p>
                  <p className="text-xs font-extrabold text-gray-800">
                    Unique Code
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 inset-x-0 leading-none pointer-events-none">
          <svg
            viewBox="0 0 1440 100"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full block"
          >
            <path
              d="M0,100 C240,42 500,10 740,28 C980,46 1210,82 1440,22 L1440,100 L0,100Z"
              fill="white"
              opacity="0.35"
            />
            <path
              d="M0,100 C380,52 920,28 1440,68 L1440,100 L0,100Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ════════════ STATS BAR ════════════════════════════════ */}
      <section className="bg-white py-4">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
            {[
              { n: "500+", label: "Happy Customers", icon: "😊" },
              { n: "99%", label: "Satisfaction Rate", icon: "⭐" },
              { n: "24hr", label: "Fast Turnaround", icon: "⚡" },
              { n: "100%", label: "Safe & Secure", icon: "🛡️" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center py-7 px-4 text-center"
              >
                <span className="text-xl mb-2.5">{s.icon}</span>
                <p className="text-2xl sm:text-[1.85rem] font-extrabold text-gray-900 leading-none mb-1.5 tracking-tight">
                  {s.n}
                </p>
                <p className="text-xs text-gray-400 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ ABOUT ════════════════════════════════════ */}
      {laundry.description && (
        <section
          id="about"
          className="py-24 px-6 scroll-mt-20 relative overflow-hidden"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg,#f6faff 0%,#edf4ff 55%,#f6faff 100%)",
            }}
          />
          <div
            className="absolute -top-[10%] right-[-6%] w-72 h-72 rounded-full opacity-25 pointer-events-none"
            style={{
              background: "radial-gradient(circle,#bfdbfe 0%,transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-[-8%] left-[-4%] w-56 h-56 rounded-full opacity-20 pointer-events-none"
            style={{
              background: "radial-gradient(circle,#bbf7d0 0%,transparent 70%)",
            }}
          />
          <div className="relative max-w-2xl mx-auto text-center">
            <span className="inline-block bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Our Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-8">
              About <span className="text-primary">{laundry.name}</span>
            </h2>
            <div className="relative text-left">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary/0 via-primary/25 to-primary/0 rounded-full" />
              <p className="text-gray-500 leading-[2.0] text-[15px] pl-7">
                {laundry.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ════════════ SERVICES ═════════════════════════════════ */}
      <div id="services" className="scroll-mt-20">
        <ServicePreview
          slug={slug}
          base={base}
          onBook={() => navigate(`/${slug}/booking`)}
        />
      </div>

      {/* ════════════ PICKUP / DROPOFF ═════════════════════════ */}
      {(laundry.pickup_enabled || laundry.dropoff_enabled) && (
        <section className="px-6 pb-24">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                Pick the way that works for you
              </h2>
              <p className="text-gray-400 text-sm">
                We've made it as easy as possible — your way, your schedule.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {laundry.pickup_enabled && (
                <div className="group bg-white border border-gray-100 rounded-3xl p-7 card-lift cursor-default relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-primary rounded-l-3xl" />
                  <div className="pl-4">
                    <div className="text-3xl mb-4">🚗</div>
                    <h3 className="font-extrabold text-gray-900 text-lg mb-2">
                      We come to you
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-5">
                      Put your bag by the door. That's honestly all you need to
                      do — we'll handle the rest and bring it back to you clean.
                    </p>
                    <div className="flex items-center gap-2 text-primary text-xs font-bold">
                      <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <FiCheck size={10} />
                      </span>
                      No waiting around
                    </div>
                  </div>
                </div>
              )}
              {laundry.dropoff_enabled && (
                <div className="group bg-white border border-gray-100 rounded-3xl p-7 card-lift cursor-default relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-l-3xl" />
                  <div className="pl-4">
                    <div className="text-3xl mb-4">🏪</div>
                    <h3 className="font-extrabold text-gray-900 text-lg mb-2">
                      Swing by and drop it off
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-5">
                      Passing by? Just bring your bag in. We'll take it from
                      there and have it ready when you need it back.
                    </p>
                    <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                        <FiCheck size={10} />
                      </span>
                      In and out in minutes
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ════════════ HOW IT WORKS ═════════════════════════════ */}
      <section
        id="how-it-works"
        className="py-24 px-6 scroll-mt-20"
        style={{
          background:
            "linear-gradient(180deg,#f7fbff 0%,#edf4ff 55%,#f7fbff 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block bg-primary/8 text-primary text-[11px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              How It Works
            </h2>
            <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
              Booking your laundry takes less than 2 minutes. Here's how:
            </p>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-10">
            {/* Connector */}
            <div className="hidden sm:block absolute top-[56px] left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-px step-connector" />

            {[
              {
                n: "1",
                emoji: "🛒",
                title: "Choose Services",
                desc: "Browse our catalogue and pick what needs cleaning — clothes, bedding, and more.",
                bg: "from-blue-50 to-indigo-50",
                dot: "bg-primary",
              },
              {
                n: "2",
                emoji: "💳",
                title: "Pay & Confirm",
                desc: "Pay securely and get a unique booking code sent instantly.",
                bg: "from-violet-50 to-purple-50",
                dot: "bg-violet-500",
              },
              {
                n: "3",
                emoji: "✅",
                title: "Pickup & Delivery",
                desc: "Show your code, we collect your laundry and return it fresh, clean, and ready.",
                bg: "from-emerald-50 to-green-50",
                dot: "bg-emerald-500",
              },
            ].map((step, i) => (
              <div
                key={step.n}
                className="flex flex-col items-center text-center"
                style={{
                  animation: `fade-up 0.7s ${0.1 + i * 0.2}s ease-out both`,
                }}
              >
                <div className="relative mb-7">
                  <div
                    className={`w-[116px] h-[116px] rounded-[2rem] bg-gradient-to-br ${step.bg} border border-white shadow-xl shadow-gray-200/80 flex items-center justify-center`}
                  >
                    <span
                      className="text-[48px]"
                      style={{
                        animation: `float ${4.5 + i}s ease-in-out ${i * 0.7}s infinite`,
                      }}
                    >
                      {step.emoji}
                    </span>
                  </div>
                  <div
                    className={`absolute -top-3 -right-3 w-8 h-8 ${step.dot} text-white text-[12px] font-extrabold rounded-full flex items-center justify-center shadow-lg border-2 border-white`}
                  >
                    {step.n}
                  </div>
                </div>
                <h3 className="font-extrabold text-gray-900 text-[15px] mb-3 leading-snug">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-[200px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={() => navigate(`/${slug}/booking`)}
              className="inline-flex items-center gap-2.5 bg-primary hover:bg-blue-600 text-white font-extrabold text-sm px-10 py-4 rounded-2xl shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 hover:-translate-y-px"
            >
              Get Started Now <FiArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ════════════ WHY CHOOSE US ════════════════════════════ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-primary/8 text-primary text-[11px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
              Why Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Why Choose {laundry.name}?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: "⚡",
                title: "Lightning Fast",
                desc: "Quick turnaround times so your clothes are ready when you need them.",
                bg: "bg-amber-50",
                border: "border-amber-100",
                ib: "bg-amber-100",
              },
              {
                icon: "🛡️",
                title: "Handle with Care",
                desc: "Every garment treated delicately using the right techniques and products.",
                bg: "bg-sky-50",
                border: "border-sky-100",
                ib: "bg-sky-100",
              },
              {
                icon: "📱",
                title: "Book Anywhere",
                desc: "Use your phone to book anytime. No app, no account, just a quick form.",
                bg: "bg-violet-50",
                border: "border-violet-100",
                ib: "bg-violet-100",
              },
              {
                icon: "💯",
                title: "Quality Guaranteed",
                desc: "We stand behind our work. Clean, fresh clothes — every single time.",
                bg: "bg-emerald-50",
                border: "border-emerald-100",
                ib: "bg-emerald-100",
              },
            ].map((f) => (
              <div
                key={f.title}
                className={`card-lift ${f.bg} border ${f.border} rounded-3xl p-6 flex flex-col gap-4 cursor-default`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${f.ib} flex items-center justify-center text-2xl`}
                >
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-[13.5px] mb-2">
                    {f.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ CTA BANNER ═══════════════════════════════ */}
      <section
        className="relative overflow-hidden py-24 px-6"
        style={{
          background:
            "linear-gradient(145deg,#021535 0%,#0040b8 55%,#1068e8 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,1) 39px,rgba(255,255,255,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,1) 39px,rgba(255,255,255,1) 40px)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <p className="text-blue-300 text-sm font-semibold mb-4">
                Still putting it off?
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-5">
                Your laundry isn't going to wash itself —
                <br className="hidden sm:block" />
                <span className="grad-text">let's sort it today.</span>
              </h2>
              <p className="text-blue-100/50 text-[14.5px] leading-relaxed max-w-lg">
                Takes about a minute to book. No account, no signing up — just
                pick what you need and we'll take it from there.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <button
                onClick={() => navigate(`/${slug}/booking`)}
                className="pulse-cta flex items-center gap-2.5 bg-white text-primary font-extrabold px-9 py-4 rounded-2xl shadow-xl hover:scale-105 hover:bg-blue-50 transition-all text-sm whitespace-nowrap"
              >
                Book Now <FiArrowRight size={15} />
              </button>
              {laundry.whatsapp && (
                <a
                  href={`https://wa.me/${laundry.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 bg-white/10 hover:bg-white/16 border border-white/15 text-white font-semibold text-sm px-7 py-3.5 rounded-2xl transition-all hover:scale-105 whitespace-nowrap"
                >
                  <FaWhatsapp size={16} /> Send us a message
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ CONTACT ══════════════════════════════════ */}
      {hasContact && (
        <section
          id="contact"
          className="py-24 px-6 scroll-mt-20"
          style={{ background: "#f7faff" }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block bg-primary/8 text-primary text-[11px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
                Get In Touch
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
                Contact Us
              </h2>
              <p className="text-gray-400 text-sm">
                We're always here to help — reach out anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {laundry.phone && (
                <a
                  href={`tel:${laundry.phone}`}
                  className="contact-card group bg-white rounded-3xl p-7 flex flex-col items-center text-center gap-4 border border-gray-100 shadow-sm"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/8 group-hover:bg-primary flex items-center justify-center transition-all duration-300 shadow-sm">
                    <FiPhone
                      className="text-primary group-hover:text-white transition-colors"
                      size={22}
                    />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">
                      Phone
                    </p>
                    <p className="text-gray-900 font-extrabold text-sm">
                      {laundry.phone}
                    </p>
                  </div>
                </a>
              )}
              {laundry.email && (
                <a
                  href={`mailto:${laundry.email}`}
                  className="contact-card group bg-white rounded-3xl p-7 flex flex-col items-center text-center gap-4 border border-gray-100 shadow-sm"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/8 group-hover:bg-primary flex items-center justify-center transition-all duration-300 shadow-sm">
                    <FiMail
                      className="text-primary group-hover:text-white transition-colors"
                      size={22}
                    />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">
                      Email
                    </p>
                    <p className="text-gray-900 font-extrabold text-sm break-all">
                      {laundry.email}
                    </p>
                  </div>
                </a>
              )}
              {laundry.address && (
                <div className="contact-card bg-white rounded-3xl p-7 flex flex-col items-center text-center gap-4 border border-gray-100 shadow-sm sm:col-span-2 lg:col-span-1">
                  <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center shadow-sm">
                    <FiMapPin className="text-primary" size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">
                      Address
                    </p>
                    <p className="text-gray-900 font-extrabold text-sm leading-snug">
                      {laundry.address}
                    </p>
                  </div>
                </div>
              )}
              {laundry.website && (
                <a
                  href={laundry.website}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-card group bg-white rounded-3xl p-7 flex flex-col items-center text-center gap-4 border border-gray-100 shadow-sm"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/8 group-hover:bg-primary flex items-center justify-center transition-all duration-300 shadow-sm">
                    <FiGlobe
                      className="text-primary group-hover:text-white transition-colors"
                      size={22}
                    />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">
                      Website
                    </p>
                    <p className="text-gray-900 font-extrabold text-sm truncate max-w-[155px]">
                      {laundry.website.replace(/^https?:\/\//, "")}
                    </p>
                  </div>
                </a>
              )}
            </div>

            {(laundry.whatsapp || laundry.instagram || laundry.facebook) && (
              <div className="flex justify-center flex-wrap gap-3">
                {laundry.whatsapp && (
                  <a
                    href={`https://wa.me/${laundry.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 bg-[#25d366] hover:bg-[#1ebe5d] text-white font-extrabold text-sm px-7 py-3.5 rounded-full shadow-lg shadow-green-400/20 transition-all hover:scale-105"
                  >
                    <FaWhatsapp size={18} /> WhatsApp
                  </a>
                )}
                {laundry.instagram && (
                  <a
                    href={socialUrl("https://instagram.com", laundry.instagram)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 text-white font-extrabold text-sm px-7 py-3.5 rounded-full shadow-lg transition-all hover:scale-105"
                    style={{
                      background:
                        "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
                    }}
                  >
                    <FiInstagram size={18} /> Instagram
                  </a>
                )}
                {laundry.facebook && (
                  <a
                    href={socialUrl("https://facebook.com", laundry.facebook)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 bg-[#1877f2] hover:bg-[#0e6ad4] text-white font-extrabold text-sm px-7 py-3.5 rounded-full shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
                  >
                    <FiFacebook size={18} /> Facebook
                  </a>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ════════════ FOOTER ═══════════════════════════════════ */}
      <footer
        className="text-white px-6 pt-16 pb-10"
        style={{ background: "#0c1a2e" }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Top accent line */}
          <div
            className="h-[3px] rounded-full mb-14"
            style={{
              background:
                "linear-gradient(90deg,#1a6bff 0%,#34d399 60%,transparent 100%)",
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pb-12 mb-10 border-b border-white/10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center p-2 flex-shrink-0">
                  <img
                    src={logoSrc}
                    alt={laundry.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="font-extrabold text-white text-[14px]">
                    {laundry.name}
                  </p>
                  <p className="text-blue-300/60 text-[11px] mt-0.5 font-medium">
                    Professional Laundry
                  </p>
                </div>
              </div>
              <p className="text-gray-400 text-[13px] leading-relaxed max-w-[220px] mb-6">
                {laundry.tagline ||
                  "Quality laundry, booked online in minutes."}
              </p>
              {(laundry.whatsapp || laundry.instagram || laundry.facebook) && (
                <div className="flex gap-2.5">
                  {laundry.whatsapp && (
                    <a
                      href={`https://wa.me/${laundry.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 rounded-xl bg-white/8 hover:bg-[#25d366] border border-white/8 flex items-center justify-center transition-all hover:border-transparent"
                    >
                      <FaWhatsapp size={15} />
                    </a>
                  )}
                  {laundry.instagram && (
                    <a
                      href={socialUrl(
                        "https://instagram.com",
                        laundry.instagram,
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 rounded-xl bg-white/8 hover:bg-pink-600 border border-white/8 flex items-center justify-center transition-all hover:border-transparent"
                    >
                      <FiInstagram size={15} />
                    </a>
                  )}
                  {laundry.facebook && (
                    <a
                      href={socialUrl("https://facebook.com", laundry.facebook)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 rounded-xl bg-white/8 hover:bg-[#1877f2] border border-white/8 flex items-center justify-center transition-all hover:border-transparent"
                    >
                      <FiFacebook size={15} />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Nav */}
            <div>
              <p className="text-gray-300 text-[11px] font-bold uppercase tracking-widest mb-6">
                Navigate
              </p>
              <div className="flex flex-col gap-4">
                {NAV_LINKS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => scrollTo(l.id)}
                    className="text-[13.5px] text-gray-400 hover:text-white transition-colors text-left font-medium w-fit"
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact snippet + CTA */}
            <div>
              <p className="text-gray-300 text-[11px] font-bold uppercase tracking-widest mb-6">
                Get In Touch
              </p>
              <div className="flex flex-col gap-3 mb-7">
                {laundry.phone && (
                  <a
                    href={`tel:${laundry.phone}`}
                    className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors text-[13px] font-medium group"
                  >
                    <FiPhone
                      size={14}
                      className="text-primary group-hover:text-blue-400 flex-shrink-0"
                    />
                    {laundry.phone}
                  </a>
                )}
                {laundry.email && (
                  <a
                    href={`mailto:${laundry.email}`}
                    className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors text-[13px] font-medium group"
                  >
                    <FiMail
                      size={14}
                      className="text-primary group-hover:text-blue-400 flex-shrink-0"
                    />
                    {laundry.email}
                  </a>
                )}
                {laundry.address && (
                  <div className="flex items-start gap-2.5 text-gray-400 text-[13px] font-medium">
                    <FiMapPin
                      size={14}
                      className="text-primary flex-shrink-0 mt-0.5"
                    />
                    {laundry.address}
                  </div>
                )}
                {!laundry.phone && !laundry.email && !laundry.address && (
                  <p className="text-gray-500 text-[13px]">
                    Reach out to us anytime.
                  </p>
                )}
              </div>
              <button
                onClick={() => navigate(`/${slug}/booking`)}
                className="inline-flex items-center gap-2 bg-primary hover:bg-blue-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-px"
              >
                Book Now <FiArrowRight size={13} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-500 text-[12px]">
              &copy; {new Date().getFullYear()}{" "}
              <span className="text-gray-300 font-semibold">
                {laundry.name}
              </span>
              . All rights reserved.
            </p>
            <p className="text-gray-600 text-[12px]">
              Powered by{" "}
              <span className="text-gray-400 font-semibold">LaundryPOS</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SERVICE PREVIEW SUB-COMPONENT
═══════════════════════════════════════════════════════════════ */
function ServicePreview({ slug, base, onBook }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    PublicService.getServices(slug)
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading || services.length === 0) return null;

  const preview = services.slice(0, 6);
  const ACCENTS = [
    {
      bar: "from-blue-400 to-blue-600",
      chip: "bg-blue-50 text-blue-600",
      icon: "bg-blue-50 text-blue-500",
    },
    {
      bar: "from-violet-400 to-violet-600",
      chip: "bg-violet-50 text-violet-600",
      icon: "bg-violet-50 text-violet-500",
    },
    {
      bar: "from-emerald-400 to-emerald-600",
      chip: "bg-emerald-50 text-emerald-700",
      icon: "bg-emerald-50 text-emerald-600",
    },
    {
      bar: "from-rose-400 to-rose-600",
      chip: "bg-rose-50 text-rose-600",
      icon: "bg-rose-50 text-rose-500",
    },
    {
      bar: "from-amber-400 to-orange-500",
      chip: "bg-amber-50 text-amber-700",
      icon: "bg-amber-50 text-amber-600",
    },
    {
      bar: "from-teal-400 to-cyan-500",
      chip: "bg-teal-50 text-teal-700",
      icon: "bg-teal-50 text-teal-600",
    },
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block bg-primary/8 text-primary text-[11px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            Our Catalogue
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Our Services
          </h2>
          <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
            Professional cleaning for every garment type — browse and book in
            minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {preview.map((s, i) => {
            const a = ACCENTS[i % ACCENTS.length];
            return (
              <div
                key={s.id}
                className="service-card-new bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm"
                style={{
                  animation: `fade-up 0.6s ${0.05 + i * 0.1}s ease-out both`,
                }}
              >
                <div className={`h-1 bg-gradient-to-r ${a.bar}`} />
                <div className="p-6">
                  {s.category?.name && (
                    <span
                      className={`inline-block text-[10px] font-extrabold ${a.chip} px-3 py-1 rounded-full mb-4 uppercase tracking-wide`}
                    >
                      {s.category.name}
                    </span>
                  )}
                  <h3 className="font-extrabold text-gray-900 text-[15px] mb-6 leading-snug">
                    {s.name}
                  </h3>
                  <div className="flex items-end justify-between pt-4 border-t border-gray-50">
                    <div>
                      <p className="text-[1.55rem] font-extrabold text-gray-900 leading-none tracking-tight">
                        &#x20A6;{Number(s.price).toLocaleString()}
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium mt-1.5">
                        {s.unit_type === "per_kg" ? "per kilogram" : "per item"}
                      </p>
                    </div>
                    <div
                      className={`w-11 h-11 rounded-2xl ${a.icon} flex items-center justify-center`}
                    >
                      <FiPackage size={18} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {services.length > 6 && (
          <div className="text-center mt-14">
            <button
              onClick={onBook}
              className="inline-flex items-center gap-2.5 bg-primary hover:bg-blue-600 text-white font-extrabold px-10 py-4 rounded-2xl shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 hover:-translate-y-px text-sm"
            >
              See All Services & Book <FiArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
