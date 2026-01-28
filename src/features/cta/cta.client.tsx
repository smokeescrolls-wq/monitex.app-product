"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  Smartphone,
  MapPin,
  Eye,
  MessageCircle,
  Check,
  Zap,
  Lock,
  BadgeDollarSign,
  Phone,
  Video,
  TriangleAlert,
  ShieldCheck,
  Clock,
  X,
  Plus,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type PerfilBuscado = {
  username?: string;
  profile_pic_url?: string;
};

type TextTestimonial = {
  name: string;
  time: string;
  text: string;
  avatar: string;
};

type FAQItem = {
  question: string;
  answer: string;
  open: boolean;
};

const getProxyUrl = (url: string) => {
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
};

export default function CtaClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "";

  const [feedData, setFeedData] = useState<any>(null);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Time Expired");
  const [showBlockedModal, setShowBlockedModal] = useState(false);

  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      question: "Does the tool really work?",
      answer:
        "Yes! Monitex.app uses advanced technology to access Instagram data completely invisibly. Thousands of users have already confirmed the tool works.",
      open: true,
    },
    {
      question: "Will the person know I checked their profile?",
      answer:
        "No! The entire process is 100% anonymous and secure. The target will never know they were monitored.",
      open: false,
    },
    {
      question: "Does it work on private profiles?",
      answer:
        "Yes! Our exclusive technology can reveal data and stories even from accounts set to private.",
      open: false,
    },
    {
      question: "Do I need to install anything?",
      answer:
        "No! Monitex.app works directly in your browser. You don’t need to download any app or software.",
      open: false,
    },
    {
      question: "How does the guarantee work?",
      answer:
        "We offer a full satisfaction guarantee. If you can’t access the promised data, we refund 100% of your money.",
      open: false,
    },
    {
      question: "How long do I have access?",
      answer:
        "One-time payment. You’ll get immediate lifetime access to the tool for the selected profile.",
      open: false,
    },
  ]);

  const textTestimonials: TextTestimonial[] = [
    {
      name: "Marcosvianad",
      time: "3h",
      text: "I thought it was a scam, but I tried it anyway. Access arrived fast and the experience was good. Worth it.",
      avatar: "/avatar/avatar-depoimento-1.jpg",
    },
    {
      name: "Gieselferreira_34",
      time: "5h",
      text: "Access was super quick. In a few minutes I was using everything properly. Recommend!",
      avatar: "/avatar/avatar-depoimento-2.jpg",
    },
    {
      name: "o__prozind34",
      time: "1d",
      text: "I used the full version and it was exactly as shown. Very practical and easy to use.",
      avatar: "/avatar/avatar-depoimento-3.jpg",
    },
  ];

  const [textIdx, setTextIdx] = useState(0);
  const nextText = () => setTextIdx((v) => (v + 1) % textTestimonials.length);
  const prevText = () =>
    setTextIdx(
      (v) => (v - 1 + textTestimonials.length) % textTestimonials.length,
    );

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const matrixCanvas = useRef<HTMLCanvasElement>(null);

  const userProfile: PerfilBuscado = feedData?.perfil_buscado || {};

  const fakeImages = [
    "/user-midias-fake/nudes1-chat1.jpg",
    "/user-midias-fake/nudes1-chat2.jpg",
    "/user-midias-fake/nudes1-chat3.jpg",
    "/user-midias-fake/pack1.1.chat2.png",
  ];

  const testimonialImages = [
    "/depoimentos/ana-clara.jpeg",
    "/depoimentos/gabriely-amarantes.jpeg",
  ];

  const goToCheckout = () => {
    const url = process.env.NEXT_PUBLIC_CHECKOUT_URL;
    if (!url) {
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const goToPricingSection = () => {
    setShowBlockedModal(false);
    const pricingSection = document.getElementById("pricing-section");
    if (pricingSection) pricingSection.scrollIntoView({ behavior: "smooth" });
  };

  const toggleFaq = (index: number) => {
    setFaqItems((prev) =>
      prev.map((item, i) => {
        if (i === index) return { ...item, open: !item.open };
        return item;
      }),
    );
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonialImages.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) =>
        (prev - 1 + testimonialImages.length) % testimonialImages.length,
    );
  };

  useEffect(() => {
    const canvas = matrixCanvas.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) drops[i] = 1;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#6b21a8";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        const val = drops[i] || 0;
        ctx.fillText(text, i * fontSize, val * fontSize);
        if (val * fontSize > canvas.height && Math.random() > 0.975)
          drops[i] = 0;
        drops[i] = (drops[i] || 0) + 1;
      }
    };

    const interval = setInterval(draw, 50);

    return () => {
      window.removeEventListener("resize", resize);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const expired = searchParams.get("expired");
    const reason = searchParams.get("reason");

    if (expired === "true" || reason === "limit") {
      setShowExpiredModal(true);
      setModalTitle(reason === "limit" ? "Search Blocked" : "Time Expired");
    }

    if (!username) return;

    let cancelled = false;

    const loadProfile = async () => {
      try {
        const cached = sessionStorage.getItem("stalkeaCtaProfile");
        if (cached) {
          const perfil = JSON.parse(cached) as PerfilBuscado;
          if (!cancelled) setFeedData({ perfil_buscado: perfil });
          sessionStorage.removeItem("stalkeaCtaProfile");
          return;
        }
      } catch {}

      try {
        const res = await fetch(
          `/api/instagram-feed?username=${encodeURIComponent(username)}`,
          { method: "GET", cache: "no-store" },
        );

        const contentType = res.headers.get("content-type") ?? "";
        const payload = contentType.includes("application/json")
          ? await res.json()
          : await res.text();

        if (!res.ok) {
          const msg =
            typeof payload === "string"
              ? payload.slice(0, 200)
              : (payload as any)?.error || "request_failed";
          throw new Error(msg);
        }

        const perfil = (payload as { perfil_buscado?: PerfilBuscado })
          .perfil_buscado;

        if (!cancelled) {
          setFeedData({ perfil_buscado: perfil ?? { username } });
        }
      } catch (e) {
        console.error("Failed to load profile data", e);
        if (!cancelled) setFeedData({ perfil_buscado: { username } });
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [username, searchParams]);

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden flex flex-col">
      <canvas
        ref={matrixCanvas}
        className="fixed inset-0 w-full h-full opacity-20 pointer-events-none z-0"
      />

      <div className="relative z-10 flex-1 flex flex-col items-center pb-24 overflow-y-auto w-full max-w-137.5 mx-auto border-x border-gray-800/50 bg-black/50 backdrop-blur-sm">
        <div className="stomp-animation stomp-delay-1 pt-8 pb-2 flex flex-col items-center gap-2">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-16 h-16">
              <Image
                src="/assets/logo-vert-transparente.png"
                alt="Monitex"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <span className="font-black tracking-widest text-xl text-white/80">
              MONITEX.APP
            </span>
          </div>

          <h1 className="text-2xl font-bold text-center leading-tight mt-4">
            The #1 <span className="text-purple-500">Stalker</span> tool in
            United States
          </h1>
        </div>

        <div className="w-full px-6 mt-6 stomp-animation stomp-delay-2">
          <div className="bg-[#1C1C1E] border border-gray-800 p-5 rounded-3xl flex items-center gap-4 shadow-xl">
            <div className="p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full">
              <div className="bg-black p-[2px] rounded-full">
                {userProfile?.profile_pic_url ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={getProxyUrl(userProfile.profile_pic_url)}
                      alt={userProfile.username || ""}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-700 animate-pulse" />
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-bold text-lg text-white">
                {userProfile?.username || username}
              </span>
              <span className="text-gray-400 text-sm">
                @{userProfile?.username || username}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full px-6 mt-6 stomp-animation stomp-delay-3">
          <div className="bg-[#1a0b2e] border border-purple-500/30 rounded-2xl p-4 text-center shadow-[0_0_20px_rgba(168,85,247,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full animate-shine" />
            <p className="font-bold text-white mb-1">Scan 100% completed! 🥳</p>
            <p className="text-gray-400 text-xs">
              Get VIP access and unlock instantly:
            </p>
          </div>
        </div>

        <div className="my-8 animate-bounce stomp-animation stomp-delay-4">
          <ArrowDown className="w-8 h-8 text-white" />
        </div>

        <div className="w-full px-6 mb-8 stomp-animation stomp-delay-5">
          <div className="flex items-center justify-center gap-3 mb-5">
            <Smartphone className="w-5 h-5 text-purple-500" />
            <h2 className="font-bold text-2xl">
              View media from {userProfile?.username || "User"}
            </h2>
          </div>

          <p className="text-gray-400 text-sm text-center font-semibold mb-6">
            See all received and sent media — including deleted items.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-zinc-900 rounded-2xl overflow-hidden relative border border-gray-800"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={fakeImages[i % fakeImages.length]}
                    alt={`Media ${i + 1}`}
                    fill
                    className="object-cover blur-md scale-110"
                    unoptimized
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white/70" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full px-6 mb-8 stomp-animation stomp-delay-6 mt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-purple-500" />
            <h2 className="font-bold text-2xl">Real-time location</h2>
          </div>

          <p className="text-gray-400 text-sm mb-4 text-center font-semibold -mt-2">
            See where {userProfile?.username || "the target"} is now, and
            <br />
            the last places they visited.
          </p>

          <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-gray-800 h-48 relative">
            <div className="w-full h-full bg-[#242f3e] relative">
              <div className="relative w-full h-full">
                <Image
                  src="/location/fake-location-bg.png"
                  alt="Location map"
                  fill
                  className="object-cover opacity-60"
                  unoptimized
                />
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-700 rounded-full mb-2 flex items-center justify-center relative">
                {userProfile?.profile_pic_url ? (
                  <img
                    src={getProxyUrl(userProfile.profile_pic_url)}
                    alt={userProfile.username || ""}
                    className="w-full h-full rounded-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>

              <span className="font-bold text-sm">Current Location</span>
              <span className="text-xs">
                @{userProfile?.username || username}
              </span>

              <button
                onClick={() => setShowBlockedModal(true)}
                className="w-full mt-3 bg-[#2C2C2E] py-2 cursor-pointer rounded-lg text-xs font-bold hover:bg-zinc-700 text-white border border-gray-600"
              >
                View
              </button>
            </div>
          </div>
        </div>

        <div className="w-full px-6 mb-8 stomp-animation stomp-delay-7 mt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Eye className="w-5 h-5 text-purple-500" />
            <h2 className="font-bold text-2xl">Hidden stories and posts</h2>
          </div>

          <p className="text-gray-400 text-sm font-semibold text-center mb-4 -mt-2">
            View "Close Friends" stories and
            <br />
            posts {userProfile?.username || "they"} hid from you.
          </p>

          <div className="flex gap-3 justify-center">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={`story-${i}`}
                className="w-[140px] h-[220px] bg-zinc-900 rounded-2xl border border-gray-800 relative overflow-hidden"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={fakeImages[i % fakeImages.length]}
                    alt={`Story ${i + 1}`}
                    fill
                    className="object-cover opacity-20 blur-md"
                    unoptimized
                  />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <Lock className="w-8 h-8 text-white/80" />
                  <span className="text-[10px] text-white/80">
                    Restricted content
                  </span>
                </div>

                {i === 1 && (
                  <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full px-6 mb-8 stomp-animation stomp-delay-8 mt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageCircle className="w-5 h-5 text-purple-500" />
            <h2 className="font-bold text-2xl">Direct messages</h2>
          </div>

          <p className="text-gray-400 text-sm text-center mb-4 -mt-2">
            View literally all messages from
            <br />
            {userProfile?.username || username}, including temporary messages.
          </p>

          <div className="bg-[#1C1C1E] border border-gray-800 rounded-3xl p-4 relative overflow-hidden">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {userProfile?.profile_pic_url ? (
                    <>
                      <img
                        src={getProxyUrl(userProfile.profile_pic_url)}
                        alt={userProfile.username || ""}
                        className="w-10 h-10 rounded-full object-cover"
                        crossOrigin="anonymous"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1C1C1E] rounded-full" />
                    </>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-700" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="font-bold text-sm text-white">
                    {userProfile?.username}
                  </span>
                  <span className="text-[10px] text-gray-400">online</span>
                </div>
              </div>

              <div className="flex gap-4 text-gray-400">
                <Phone className="w-5 h-5" />
                <Video className="w-5 h-5" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-zinc-800 self-start rounded-2xl rounded-tl-none px-4 py-2 max-w-[85%]">
                <p className="text-gray-300 text-sm">
                  Hey, want to see everything on{" "}
                  {userProfile?.username || "..."}'s Instagram?
                </p>
              </div>

              <button
                onClick={() => setShowBlockedModal(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 self-end rounded-full px-6 py-3 mt-2 shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
              >
                <span className="text-white font-bold text-sm">
                  Let’s go — I’ll buy VIP access 🔥
                </span>
              </button>

              <div className="text-[10px] text-gray-600 text-center mt-2">
                Today 10:42
              </div>
            </div>
          </div>
        </div>

        <div
          className="my-6 animate-bounce stomp-animation stomp-delay-9"
          id="pricing-section"
        >
          <ArrowDown className="w-8 h-8 text-white" />
        </div>

        <div className="w-full px-6 mb-8 stomp-animation stomp-delay-10">
          <div className="bg-[#0f0f11] border border-gray-800/80 rounded-[32px] p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

            <div className="flex flex-col items-center text-center mb-6">
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-16 h-16">
                  <Image
                    src="/assets/logo-vert-transparente.png"
                    alt="Monitex"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <span className="font-black tracking-widest text-xl text-white/80">
                  MONITEX.APP
                </span>
              </div>
            </div>

            <div className="bg-[#161618] border border-purple-500/20 rounded-2xl p-4 text-center mb-6 relative">
              <span className="text-gray-500 text-sm line-through block mb-1">
                Was: R$ 279,90
              </span>

              <span className="text-4xl font-black text-purple-500">
                R$ 37<span className="text-2xl">,00</span>
              </span>

              <div className="flex justify-center gap-4 mt-3 text-[10px] text-gray-400">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-purple-400" /> Instant access
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-purple-400" /> Secure payment
                </span>
                <span className="flex items-center gap-1">
                  <BadgeDollarSign className="w-3 h-3 text-purple-400" />{" "}
                  One-time payment
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-[#1C1C1E] border border-gray-800 py-4 px-3 rounded-xl flex items-center gap-3">
                <Check className="w-5 h-5 text-purple-500 shrink-0" />
                <span className="text-xs text-gray-200">
                  All direct messages from {userProfile?.username || username}
                </span>
              </div>

              <div className="bg-[#1C1C1E] border border-gray-800 py-4 px-3 rounded-xl flex items-center gap-3">
                <Check className="w-5 h-5 text-purple-500 shrink-0" />
                <span className="text-xs text-gray-200">
                  All photos without censorship (including deleted)
                </span>
              </div>

              <div className="bg-[#1C1C1E] border border-gray-800 py-4 px-3 rounded-xl flex items-center gap-3">
                <Check className="w-5 h-5 text-purple-500 shrink-0" />
                <span className="text-xs text-gray-200">
                  Real-time location and places visited
                </span>
              </div>

              <div className="bg-[#1C1C1E] border border-gray-800 py-4 px-3 rounded-xl flex items-center gap-3">
                <Check className="w-5 h-5 text-purple-500 shrink-0" />
                <span className="text-xs text-gray-200">
                  Alerts whenever {userProfile?.username || username} interacts
                  with someone
                </span>
              </div>

              <div className="bg-[#1C1C1E] border border-gray-800 py-4 px-3 rounded-xl flex items-center gap-3">
                <Check className="w-5 h-5 text-purple-500 shrink-0" />
                <span className="text-xs text-gray-200">
                  2 surprise bonuses worth R$120,00
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-6 mb-8 stomp-animation stomp-delay-11">
          <button
            onClick={goToCheckout}
            className="w-full bg-gradient-to-br from-[#8b5cf6] cursor-pointer to-[#6d28d9] rounded-2xl p-1 shadow-[0_0_20px_rgba(139,92,246,0.5)] group transform transition hover:scale-[1.02]"
          >
            <div className="bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] rounded-[14px] py-4 px-6 flex flex-col items-center">
              <span className="text-md font-bold text-white mb-1">
                Unlock everything now for R$37
              </span>
              <span className="text-xs text-purple-200">
                Access unlocked in up to 2 minutes
              </span>
            </div>
          </button>
        </div>

        <div className="mb-6 animate-bounce stomp-animation stomp-delay-12">
          <ArrowDown className="w-6 h-6 text-white" />
        </div>

        <div className="w-full px-6 mb-8 stomp-animation stomp-delay-13">
          <h3 className="text-center font-bold text-lg mb-1">
            See what people are saying
          </h3>
          <p className="text-center text-gray-400 text-sm mb-6">
            about <span className="text-purple-500 font-bold">Monitex.app</span>
          </p>

          <div className="rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl p-6 mb-8 w-full">
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl w-full">
                <div
                  className="flex transition-transform duration-500 ease-out w-full"
                  style={{ transform: `translateX(-${textIdx * 100}%)` }}
                >
                  {textTestimonials.map((t) => (
                    <div key={t.name} className="min-w-full px-1">
                      <div className="bg-[#0f0f11]/70 border border-white/5 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 shrink-0">
                            <div className="bg-black rounded-full p-[2px]">
                              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                  src={t.avatar}
                                  alt={t.name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col leading-tight min-w-0">
                            <span className="text-white font-semibold truncate">
                              {t.name}
                            </span>
                            <span className="text-white/50 text-xs">
                              {t.time}
                            </span>
                          </div>
                        </div>

                        <p className="text-white/80 text-sm leading-relaxed break-words">
                          {t.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={prevText}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 border border-white/10 flex items-center justify-center hover:bg-black/70"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={nextText}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 border border-white/10 flex items-center justify-center hover:bg-black/70"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>

              <div className="flex items-center justify-center gap-2 mt-5">
                {textTestimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTextIdx(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === textIdx
                        ? "w-8 bg-purple-500"
                        : "w-2 bg-white/30 hover:bg-white/40"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-center font-bold text-md text-white mb-4">
              More testimonials
            </h4>

            <div className="relative">
              <div className="relative w-full max-w-[360px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden border border-gray-800 bg-black">
                <Image
                  src={testimonialImages[currentTestimonial]}
                  alt={`Testimonial ${currentTestimonial + 1}`}
                  fill
                  className="object-contain"
                  unoptimized
                  sizes="(max-width: 450px) 360px, 360px"
                />
              </div>

              <button
                onClick={prevTestimonial}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={nextTestimonial}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="flex justify-center mt-4 gap-2">
                {testimonialImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentTestimonial
                        ? "bg-purple-500"
                        : "bg-gray-600"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8" />

        <div className="w-full px-6 mb-8 stomp-animation stomp-delay-14">
          <div className="bg-[#2a1212]/80 border border-red-900/50 rounded-xl p-4 flex items-start gap-3">
            <TriangleAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-200/90 leading-relaxed">
              The accessed information is{" "}
              <span className="font-bold">extremely sensitive</span>. Use
              responsibly.
            </p>
          </div>
        </div>

        <div className="w-full px-6 mb-8 stomp-animation stomp-delay-15">
          <h3 className="text-center font-bold text-lg mb-6">FAQ</h3>

          <div className="flex flex-col gap-3">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className={`bg-[#1C1C1E] border border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 ${
                  item.open ? "border-purple-500/30" : ""
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left active:bg-gray-800/50 transition-colors"
                >
                  <span className="font-medium text-sm text-gray-200 pr-4">
                    {item.question}
                  </span>
                  {item.open ? (
                    <X className="w-5 h-5 text-purple-500 shrink-0 transition-transform duration-300" />
                  ) : (
                    <Plus className="w-5 h-5 text-purple-500 shrink-0 transition-transform duration-300" />
                  )}
                </button>

                {item.open && (
                  <div className="px-5 pb-5 text-xs text-gray-400 leading-relaxed border-t border-gray-800/50 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full px-6 mb-8 stomp-animation stomp-delay-16">
          <div className="bg-[#040f08] border border-green-500/30 rounded-2xl p-6 text-center shadow-[0_0_20px_rgba(34,197,94,0.1)]">
            <div className="flex items-center justify-center gap-2 mb-3">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <span className="text-green-500 font-bold text-lg">
                30-Day Guarantee
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed px-2">
              Risk-free! If you don’t like it or for any reason it doesn’t fit
              you, we refund 100% of your money.
            </p>
          </div>
        </div>

        <div className="h-8" />
      </div>

      <div className="slide-up-animation fixed bottom-0 left-0 right-0 bg-[#151517]/95 backdrop-blur-md border-t border-gray-800 p-4 pb-6 z-50">
        <div className="max-w-[450px] mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm">
              Finish your purchase now!
            </span>
            <span className="text-[10px] text-gray-400 leading-tight">
              Don’t leave or reload this page.
              <br />
              This lookup cannot be repeated.
            </span>
          </div>

          <button
            onClick={goToCheckout}
            className="bg-[#584cea] hover:bg-[#4a3fcb] cursor-pointer text-white font-bold text-xs px-4 py-3 rounded-xl shadow-lg whitespace-nowrap leading-tight"
          >
            Unlock
            <br />
            Access Now
          </button>
        </div>
      </div>

      {showExpiredModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6">
          <div className="bg-[#1C1C1E] border border-gray-800 w-full max-w-[320px] rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl relative">
            <div className="mb-4">
              <Clock className="w-12 h-12 text-purple-500" />
            </div>

            <h3 className="text-white text-lg font-bold mb-3">{modalTitle}</h3>

            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              You can only perform one search. To spy on the profile, you must
              purchase the VIP plan.
            </p>

            <button
              onClick={goToCheckout}
              className="w-full bg-gradient-to-r from-[#7C4DFF] to-[#9A6CFF] text-white font-semibold py-3 rounded-xl transition-colors hover:opacity-90 mb-3"
            >
              Buy VIP Plan
            </button>

            <button
              onClick={() => setShowExpiredModal(false)}
              className="text-gray-400 text-sm hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showBlockedModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6">
          <div className="bg-[#1C1C1E] border border-gray-800 w-full max-w-[320px] rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl relative">
            <div className="mb-4">
              <TriangleAlert className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-white text-lg font-bold mb-2">
              Action blocked
            </h3>

            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Become a VIP member of Monitex.app to get access.
            </p>

            <button
              onClick={goToPricingSection}
              className="w-full bg-[#8A7178] hover:bg-[#9d828a] text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Get VIP Access
            </button>

            <button
              onClick={() => setShowBlockedModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-shine {
          animation: shine 3s infinite linear;
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          20% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .stomp-animation {
          opacity: 0;
          animation: stompIn 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        @keyframes stompIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .stomp-delay-1 {
          animation-delay: 100ms;
        }
        .stomp-delay-2 {
          animation-delay: 600ms;
        }
        .stomp-delay-3 {
          animation-delay: 1100ms;
        }
        .stomp-delay-4 {
          animation-delay: 1600ms;
        }
        .stomp-delay-5 {
          animation-delay: 2100ms;
        }
        .stomp-delay-6 {
          animation-delay: 2600ms;
        }
        .stomp-delay-7 {
          animation-delay: 3100ms;
        }
        .stomp-delay-8 {
          animation-delay: 3600ms;
        }
        .stomp-delay-9 {
          animation-delay: 4100ms;
        }
        .stomp-delay-10 {
          animation-delay: 4600ms;
        }
        .stomp-delay-11 {
          animation-delay: 5100ms;
        }
        .stomp-delay-12 {
          animation-delay: 5600ms;
        }
        .stomp-delay-13 {
          animation-delay: 6100ms;
        }
        .stomp-delay-14 {
          animation-delay: 6600ms;
        }
        .stomp-delay-15 {
          animation-delay: 7100;
        }
        .stomp-delay-16 {
          animation-delay: 7600ms;
        }

        .slide-up-animation {
          animation: slideUp 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          opacity: 0;
          transform: translateY(100%);
          animation-delay: 7.5s;
        }

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
