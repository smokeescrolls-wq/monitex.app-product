"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Home,
  Search,
  Clapperboard,
  MoreHorizontal,
  ChevronDown,
  Plus,
} from "lucide-react";
import { instagramUsernameSchema } from "@/features/instagram/instagram.schemas";
import { tokenizeCaption } from "@/features/instagram/modules/instagram-format.modules";
import Image from "next/image";

import { PaywallModal } from "@/features/direct/components/paywall-modal";
import { PreviewUpgradeCard } from "../direct/components/preview-upgrade-card";

type PerfilBuscado = {
  username: string;
  full_name: string;
  is_private: boolean;
  profile_pic_url: string;
};

type PerfilPublico = {
  username: string;
  full_name: string;
  profile_pic_url: string;
  is_verified: boolean;
};

type UsuarioBasico = {
  username: string;
  full_name: string;
  profile_pic_url: string;
};

type Post = {
  id: string;
  shortcode: string;
  image_url: string | null;
  video_url: string | null;
  is_video: boolean;
  caption: string;
  like_count: number;
  comment_count: number;
  taken_at: number;
};

type PostItem = {
  de_usuario: UsuarioBasico;
  post: Post;
};

type InstagramFeedUpstream = {
  perfil_buscado: PerfilBuscado;
  fonte: string;
  fonte_api: string;
  perfis_na_lista: number;
  perfis_publicos: number;
  lista_perfis_publicos: PerfilPublico[];
  posts: PostItem[];
  total_posts: number;
  duracao_ms: number;
};

function proxyImage(url?: string | null) {
  if (!url) return "/placeholder-avatar.png";
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

function formatRelative(tsSeconds: number) {
  const date = new Date(tsSeconds * 1000);
  const now = new Date();
  const diff = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

  if (diff < 60) return "A FEW SECONDS AGO";
  if (diff < 3600) return `${Math.floor(diff / 60)} MINUTES AGO`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} HOURS AGO`;
  return `${Math.floor(diff / 86400)} DAYS AGO`;
}

function playNotificationBeep() {
  try {
    const AudioCtx =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();

    o.type = "sine";
    o.frequency.value = 880;

    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);

    o.connect(g);
    g.connect(ctx.destination);

    o.start();
    o.stop(ctx.currentTime + 0.17);

    o.onended = () => {
      try {
        ctx.close();
      } catch {}
    };
  } catch {}
}

function FeedNotificationToast(props: {
  open: boolean;
  title: string;
  message: string;
  avatarSrc: string;
  onClose: () => void;
  onClick?: () => void;
}) {
  const { open, title, message, avatarSrc, onClose, onClick } = props;
  if (!open) return null;

  return (
    <div className="absolute top-2 left-0 right-0 z-[120] px-3">
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (!onClick) return;
          if (e.key === "Enter" || e.key === " ") onClick();
        }}
        className="w-full text-left rounded-2xl border border-white/10 bg-[#0f0f12]/95 backdrop-blur-md shadow-2xl px-4 py-3 active:scale-[0.99] transition cursor-pointer toast"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 w-9 h-9 rounded-full overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center shrink-0 relative">
            <img
              src={avatarSrc}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[11px] text-white/70 uppercase tracking-wide">
                Instagram
              </div>
              <div className="text-[11px] text-white/50">now</div>
            </div>

            <div className="mt-0.5 text-[13px] font-semibold text-white truncate">
              {title}
            </div>
            <div className="mt-0.5 text-[12px] text-white/80 line-clamp-2">
              {message}
            </div>
          </div>

          <div className="ml-1 mt-0.5 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="text-white/45 hover:text-white/70 text-[12px] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .toast {
          animation: toast-in 240ms ease-out;
        }
        @keyframes toast-in {
          from {
            transform: translateY(-8px);
            opacity: 0;
          }
          to {
            transform: translateY(0px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default function FeedClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const usernameRaw = searchParams.get("username") ?? "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<InstagramFeedUpstream | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);

  const username = useMemo(() => {
    const parsed = instagramUsernameSchema.safeParse(usernameRaw);
    return parsed.success ? parsed.data : "";
  }, [usernameRaw]);

  const CTA_URL = "/cta";

  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallTitle, setPaywallTitle] = useState<string | undefined>(
    undefined,
  );
  const [paywallDesc, setPaywallDesc] = useState<string | undefined>(undefined);

  const openPaywall = useCallback((ctx: string) => {
    setPaywallTitle("Ação bloqueada");
    setPaywallDesc(`Para liberar "${ctx}", é necessário ter acesso VIP.`);
    setPaywallOpen(true);
  }, []);

  const closePaywall = useCallback(() => setPaywallOpen(false), []);

  const goVip = useCallback(() => {
    setPaywallOpen(false);
    router.push(CTA_URL);
  }, [router]);

  useEffect(() => {
    if (!username) {
      setError("Invalid username.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const cached = sessionStorage.getItem("stalkeaFeedData");
        if (cached) {
          try {
            const parsed = JSON.parse(cached) as InstagramFeedUpstream;
            if (!cancelled) setData(parsed);
            sessionStorage.removeItem("stalkeaFeedData");
            if (!cancelled) setLoading(false);
            return;
          } catch {
            sessionStorage.removeItem("stalkeaFeedData");
          }
        }

        const res = await fetch(
          `/api/instagram-feed?username=${encodeURIComponent(username)}`,
          { method: "GET", cache: "no-store" },
        );

        const text = await res.text().catch(() => "");
        if (!res.ok) throw new Error(text || "request_failed");

        const json = JSON.parse(text) as InstagramFeedUpstream;
        if (!cancelled) setData(json);
        if (!cancelled) setLoading(false);
      } catch {
        if (!cancelled) {
          setError("Failed to load the feed.");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [username]);

  useEffect(() => {
    if (loading) return;
    if (!data?.perfil_buscado?.username) return;

    const key = `stalkeaFeedPushShown:${data.perfil_buscado.username}`;
    const already = sessionStorage.getItem(key);
    if (already) return;

    sessionStorage.setItem(key, "1");

    const showId = window.setTimeout(() => {
      setNotifOpen(true);
      playNotificationBeep();
      window.setTimeout(() => setNotifOpen(false), 3200);
    }, 5000);

    return () => window.clearTimeout(showId);
  }, [loading, data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="w-full max-w-[550px] border-x border-gray-800 shadow-2xl">
          <div className="h-screen flex items-center justify-center text-sm text-white/70">
            Loading feed…
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="w-full max-w-[550px] border-x border-gray-800 shadow-2xl">
          <div className="h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-white/80">{error ?? "Error."}</p>
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/instagram-login?username=${encodeURIComponent(usernameRaw)}`,
                )
              }
              className="px-4 py-3 rounded-xl bg-[#584cea] hover:bg-[#4a3fcb] text-white font-semibold text-sm cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userProfile = data.perfil_buscado;
  const stories = data.lista_perfis_publicos ?? [];
  const posts = data.posts ?? [];
  const storyLimit = 19;

  return (
    <div className="min-h-screen bg-black text-white flex justify-center px-6">
      <div className="w-full max-w-[550px] border-x border-gray-800 shadow-2xl relative bg-black overflow-hidden">
        <PaywallModal
          open={paywallOpen}
          onClose={closePaywall}
          onGoVip={goVip}
          title={paywallTitle}
          description={paywallDesc}
        />

        <FeedNotificationToast
          open={notifOpen}
          title="James Wiliams"
          message="Sent you a message · tap to view"
          avatarSrc="/avatar/avatar-depoimento-1.jpg"
          onClose={() => setNotifOpen(false)}
          onClick={() => openPaywall("notification")}
        />

        <header className="flex justify-between items-center px-4 py-3 bg-black z-50 shrink-0 border-b border-gray-800/40">
          <div className="flex items-center gap-1">
            <div className="relative w-[95px] h-[52px]">
              <Image
                src="/assets/logo-insta.png"
                alt="Instagram"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
            <button
              type="button"
              onClick={() => openPaywall("trocar conta")}
              className="opacity-90 hover:opacity-100 transition cursor-pointer"
            >
              <ChevronDown className="w-4 h-4 mt-1" />
            </button>
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => openPaywall("curtir (header)")}
              className="relative cursor-pointer hover:opacity-80 transition"
            >
              <Heart className="w-7 h-7" />
              <span className="absolute top-0 right-0 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-black" />
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/direct?username=${encodeURIComponent(userProfile.username)}`,
                )
              }
              className="relative hover:opacity-80 transition cursor-pointer"
            >
              <Send className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] font-bold px-1 h-3.5 min-w-[14px] flex items-center justify-center rounded-full border border-black">
                9
              </span>
            </button>
          </div>
        </header>

        <div className="h-[calc(100vh-65px)] overflow-y-auto scrollbar-hide pb-[140px]">
          <div className="pt-2 pb-4 border-b border-gray-800/40">
            <div className="flex overflow-x-auto gap-4 px-4 scrollbar-hide pb-2">
              <button
                type="button"
                onClick={() => openPaywall("ver seu story")}
                className="flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer hover:opacity-90 transition"
              >
                <div className="relative">
                  <div className="w-[72px] h-[72px] rounded-full p-[2px]">
                    <img
                      src={proxyImage(userProfile.profile_pic_url)}
                      className="w-full h-full rounded-full object-cover border border-gray-800"
                      alt="Your story"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src =
                          "/placeholder-avatar.png")
                      }
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center border-2 border-black">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                </div>
                <span className="text-xs text-center truncate w-full text-zinc-400">
                  Your story
                </span>
              </button>

              {stories.slice(0, storyLimit).map((s) => (
                <button
                  key={s.username}
                  type="button"
                  onClick={() => openPaywall(`ver story de ${s.username}`)}
                  className="flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer hover:opacity-90 transition"
                >
                  <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px] rounded-full">
                    <div className="bg-black p-[2px] rounded-full">
                      <img
                        src={proxyImage(s.profile_pic_url)}
                        className="w-[64px] h-[64px] rounded-full object-cover"
                        alt={s.username}
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src =
                            "/placeholder-avatar.png")
                        }
                      />
                    </div>
                  </div>
                  <span className="text-xs text-center truncate w-[74px]">
                    {s.username}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <main className="flex flex-col bg-black">
            {!posts.length ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10" />
                <p className="text-lg font-bold text-zinc-700">No posts yet</p>
              </div>
            ) : null}

            {posts.map((postItem) => {
              const tokens = tokenizeCaption(postItem.post.caption || "");
              return (
                <div
                  key={postItem.post.id}
                  className="flex flex-col mb-4 border-b border-gray-900 pb-2"
                >
                  <div className="flex items-center justify-between px-3 py-2">
                    <button
                      type="button"
                      onClick={() =>
                        openPaywall(
                          `abrir perfil ${postItem.de_usuario.username}`,
                        )
                      }
                      className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
                    >
                      <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px] rounded-full">
                        <div className="bg-black p-[2px] rounded-full">
                          <img
                            src={proxyImage(
                              postItem.de_usuario.profile_pic_url,
                            )}
                            className="w-8 h-8 rounded-full object-cover"
                            alt={postItem.de_usuario.username}
                            onError={(e) =>
                              ((e.target as HTMLImageElement).src =
                                "/placeholder-avatar.png")
                            }
                          />
                        </div>
                      </div>
                      <span className="text-xs font-semibold">
                        {postItem.de_usuario.username}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openPaywall("mais opções do post")}
                      className="hover:opacity-80 transition cursor-pointer"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => openPaywall("ver mídia do post")}
                    className="w-full bg-zinc-900 aspect-square relative cursor-pointer"
                  >
                    {postItem.post.image_url ? (
                      <img
                        src={proxyImage(postItem.post.image_url)}
                        className="w-full h-full object-cover"
                        alt=""
                        loading="lazy"
                        onError={(e) => (
                          ((e.target as HTMLImageElement).style.display =
                            "none"),
                          openPaywall("mídia indisponível")
                        )}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
                        No image
                      </div>
                    )}
                  </button>

                  <div className="px-3 pt-3 flex justify-between items-center mb-2">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => openPaywall("curtir")}
                        className="hover:opacity-80 transition cursor-pointer"
                      >
                        <Heart className="w-6 h-6 hover:text-gray-400 transition" />
                      </button>

                      <button
                        type="button"
                        onClick={() => openPaywall("comentar")}
                        className="hover:opacity-80 transition cursor-pointer"
                      >
                        <MessageCircle className="w-6 h-6 -rotate-90 hover:text-gray-400 transition" />
                      </button>

                      <button
                        type="button"
                        onClick={() => openPaywall("enviar")}
                        className="hover:opacity-80 transition cursor-pointer"
                      >
                        <Send className="w-6 h-6 hover:text-gray-400 transition" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => openPaywall("salvar")}
                      className="hover:opacity-80 transition cursor-pointer"
                    >
                      <Bookmark className="w-6 h-6 hover:text-gray-400 transition" />
                    </button>
                  </div>

                  <div className="px-3 flex flex-col gap-1">
                    {postItem.post.like_count > 0 ? (
                      <span className="text-sm font-semibold">
                        {postItem.post.like_count} likes
                      </span>
                    ) : null}

                    <div className="text-sm">
                      <span className="font-semibold mr-1">
                        {postItem.de_usuario.username}
                      </span>
                      <span className="text-gray-100">
                        {tokens.map((t, idx) => {
                          if (t.type === "hashtag" || t.type === "mention") {
                            return (
                              <span key={idx} className="text-violet-300">
                                {t.value}
                              </span>
                            );
                          }
                          return <span key={idx}>{t.value}</span>;
                        })}
                      </span>
                    </div>

                    <span className="text-[10px] text-gray-500 uppercase mt-1">
                      {formatRelative(postItem.post.taken_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </main>
        </div>
        {/* Upgrade card fixo acima da navbar */}
        <div className="fixed left-1/2 -translate-x-1/2 bottom-[72px] w-full max-w-[550px] z-[90] px-4 pointer-events-none">
          <div className="pointer-events-auto">
            <PreviewUpgradeCard
              onUpgrade={goVip}
              onOpenPaywall={() => openPaywall("upgrade card")}
            />
          </div>
        </div>

        <nav className="absolute bottom-0 left-0 w-full bg-black border-t border-gray-800 h-[65px] px-6 flex justify-between items-center z-50">
          <button
            type="button"
            onClick={() => openPaywall("home")}
            className="w-10 h-full flex items-center justify-center hover:opacity-80 transition cursor-pointer"
          >
            <Home className="w-7 h-7" />
          </button>
          <button
            type="button"
            onClick={() => openPaywall("buscar")}
            className="w-10 h-full flex items-center justify-center hover:opacity-80 transition cursor-pointer"
          >
            <Search className="w-7 h-7" />
          </button>
          <button
            type="button"
            onClick={() => openPaywall("reels")}
            className="w-10 h-full flex items-center justify-center hover:opacity-80 transition cursor-pointer"
          >
            <Clapperboard className="w-7 h-7" />
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                `/direct?username=${encodeURIComponent(userProfile.username)}`,
              )
            }
            className="relative hover:opacity-80 transition cursor-pointer"
          >
            <Send className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] font-bold px-1 h-3.5 min-w-[14px] flex items-center justify-center rounded-full border border-black">
              9
            </span>
          </button>

          <button
            type="button"
            onClick={() => openPaywall("perfil")}
            className="w-10 h-full flex items-center justify-center hover:opacity-80 transition cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-500">
              <img
                src={proxyImage(userProfile.profile_pic_url)}
                className="w-full h-full object-cover"
                alt=""
                onError={(e) =>
                  ((e.target as HTMLImageElement).src =
                    "/placeholder-avatar.png")
                }
              />
            </div>
          </button>
        </nav>

        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  );
}
