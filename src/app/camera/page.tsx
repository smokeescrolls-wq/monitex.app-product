"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Camera,
  Mic,
  Lock,
  Check,
  ChevronDown,
  Shield,
  Smartphone,
  Unlock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from "phosphor-react";

type Option = { label: string; value: string };

const CAMERA_OPTS: Option[] = [
  { label: "Câmera traseira (se disponível)", value: "environment" },
  { label: "Câmera frontal (se disponível)", value: "user" },
];

const MODE_OPTS: Option[] = [
  { label: "Ver e Escutar (Vídeo + Áudio)", value: "av" },
  { label: "Apenas Vídeo", value: "v" },
  { label: "Apenas Áudio", value: "a" },
];

function formatBRPhone(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 11);
  const d = digits.split("");
  if (digits.length <= 2) return digits;
  if (digits.length <= 6)
    return `(${d.slice(0, 2).join("")}) ${d.slice(2).join("")}`;
  if (digits.length <= 10)
    return `(${d.slice(0, 2).join("")}) ${d.slice(2, 6).join("")}-${d.slice(6).join("")}`;
  return `(${d.slice(0, 2).join("")}) ${d.slice(2, 7).join("")}-${d.slice(7).join("")}`;
}

export default function CameraPage() {
  const matrixCanvas = useRef<HTMLCanvasElement>(null);

  const CHECKOUT_URL =
    process.env.NEXT_PUBLIC_CAMERA_CHECKOUT_URL ||
    "https://exemplo.com/checkout";

  const TERMS_TEXT = `Última atualização: Janeiro de 2025

1. NATUREZA DO SERVIÇO. O Monitex.app é uma plataforma de ENTRETENIMENTO e SIMULAÇÃO. 
2. USO RESPONSÁVEL. Recursos que dependem de permissões do navegador (câmera/microfone) só funcionam no próprio dispositivo do usuário e com consentimento explícito.
3. LIMITAÇÃO. Nenhum recurso deve ser usado para violar privacidade de terceiros.`;

  const PRIVACY_TEXT = `Última atualização: Janeiro de 2025

Coletamos dados mínimos para operar o serviço. Permissões de câmera/microfone são gerenciadas pelo navegador e podem ser revogadas a qualquer momento nas configurações do navegador.`;

  const [phone, setPhone] = useState("");
  const [cameraMode, setCameraMode] = useState<Option>(CAMERA_OPTS[0]);
  const [monitorMode, setMonitorMode] = useState<Option>(MODE_OPTS[0]);

  const [status, setStatus] = useState<
    "idle" | "requesting" | "granted" | "denied" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const stopTracks = (stream?: MediaStream | null) => {
    if (!stream) return;
    stream.getTracks().forEach((t) => t.stop());
  };

  const [stream, setStream] = useState<MediaStream | null>(null);

  const requestAccess = async () => {
    setErrorMsg("");
    setStatus("requesting");

    try {
      stopTracks(stream);
      setStream(null);

      const wantVideo = monitorMode.value === "av" || monitorMode.value === "v";
      const wantAudio = monitorMode.value === "av" || monitorMode.value === "a";

      const constraints: MediaStreamConstraints = {
        video: wantVideo
          ? {
              facingMode: { ideal: cameraMode.value as "user" | "environment" },
            }
          : false,
        audio: wantAudio ? true : false,
      };

      const s = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(s);
      setStatus("granted");
    } catch (e: any) {
      const name = e?.name || "Error";
      if (name === "NotAllowedError" || name === "SecurityError") {
        setStatus("denied");
        setErrorMsg(
          "Permissão negada. Ative câmera/microfone nas permissões do navegador.",
        );
      } else if (name === "NotFoundError") {
        setStatus("error");
        setErrorMsg("Nenhuma câmera/microfone encontrado neste dispositivo.");
      } else {
        setStatus("error");
        setErrorMsg(
          "Não foi possível acessar os dispositivos. Tente novamente.",
        );
      }
    }
  };

  const goCheckout = () => window.open(CHECKOUT_URL, "_blank");

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
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array.from({ length: columns }, () => 1);

    const draw = () => {
      const newColumns = Math.floor(canvas.width / fontSize);
      if (newColumns !== columns) {
        columns = newColumns;
        drops = Array.from({ length: columns }, () => 1);
      }

      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#7c3aed";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        const y = (drops[i] ?? 0) * fontSize;
        ctx.fillText(text, i * fontSize, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] = (drops[i] ?? 0) + 1;
      }
    };

    const id = window.setInterval(draw, 50);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    return () => stopTracks(stream);
  }, [stream]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <canvas
        ref={matrixCanvas}
        className="fixed inset-0 w-full h-full opacity-20 pointer-events-none z-0"
      />

      <div className="relative z-10 px-6 pt-14 pb-20">
        <div className="max-w-[520px] mx-auto">
          <div className="flex flex-col items-center gap-3 mb-8">
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

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2 text-purple-400 font-black text-xl">
              <Camera className="w-5 h-5" />
              <span className="text-4xl">Acesso Remoto</span>
            </div>

            <h1 className="mt-3 text-4xl font-black leading-tight">
              à Câmera + Microfone
            </h1>

            <p className="mt-4 text-white/65 text-md leading-relaxed max-w-[420px] mx-auto">
              Veja e escute <b className="text-white">em tempo real</b> tudo que
              seu cônjuge está fazendo,{" "}
              <b className="text-white">sem instalar nada</b> e de{" "}
              <b className="text-white">forma 100% invisível.</b>
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/35 backdrop-blur-md shadow-2xl p-6">
            <div className="text-center text-purple-400 font-black mb-5">
              Configure o Acesso
            </div>

            <div className="space-y-7">
              <div>
                <div className="text-white/70 text-sm mb-2 ml-2">
                  Número do celular (opcional):
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                  <span className="text-xs font-semibold text-white/80">
                    BR
                  </span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(formatBRPhone(e.target.value))}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-transparent outline-none text-sm text-white/85 placeholder:text-white/30"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div>
                <div className="text-white/70 text-sm mb-2 ml-2">
                  Qual câmera você quer usar?
                </div>
                <div className="relative">
                  <select
                    value={cameraMode.value}
                    onChange={(e) =>
                      setCameraMode(
                        CAMERA_OPTS.find((o) => o.value === e.target.value) ||
                          CAMERA_OPTS[0],
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white/85 outline-none"
                  >
                    {CAMERA_OPTS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-white/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="text-white/70 text-sm mb-2 ml-2">
                  O que você quer ativar?
                </div>
                <div className="relative">
                  <select
                    value={monitorMode.value}
                    onChange={(e) =>
                      setMonitorMode(
                        MODE_OPTS.find((o) => o.value === e.target.value) ||
                          MODE_OPTS[0],
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white/85 outline-none"
                  >
                    {MODE_OPTS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-white/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                onClick={requestAccess}
                className="mt-4 w-full rounded-2xl bg-gradient-to-br cursor-pointer from-purple-500 to-purple-700 py-5 font-black text-white shadow-[0_0_30px_rgba(168,85,247,0.40)] hover:opacity-95 active:scale-[0.99] transition"
              >
                <span className="inline-flex items-center justify-center gap-2 text-lg">
                  <Unlock className="w-5 h-5" />
                  Ativar Acesso Agora
                </span>
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-black/35 backdrop-blur-md shadow-2xl p-6">
            <div className="text-center text-purple-400 font-black mb-6">
              O que você consegue fazer:
            </div>

            <div className="space-y-6">
              <Feature
                icon={<Eye className="w-5 h-5 text-purple-300" />}
                title="Acesso à câmera e microfone em tempo real"
                desc="Escolha entre câmera frontal (veja o rosto dele) ou traseira (veja o que ele está vendo). Escute todas as conversas e sons ao redor em tempo real."
              />
              <Feature
                icon={<Shield className="w-5 h-5 text-purple-300" />}
                title="Totalmente invisível e indetectável"
                desc="Sem notificações, sem ícones, sem rastros. Ele nunca vai saber que você está assistindo e ouvindo."
              />
              <Feature
                icon={<Smartphone className="w-5 h-5 text-purple-300" />}
                title="Funciona apenas com o número"
                desc="Não precisa tocar no celular dele ou instalar nada. Compatible com Android e iPhone, qualquer operadora."
              />
            </div>
          </div>

          <div className="mt-10 rounded-[28px] border border-purple-500/20 bg-black/35 backdrop-blur-md shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="text-center text-purple-400 font-black tracking-widest">
                OFERTA ESPECIAL
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/35 p-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-white/40 text-xs line-through">
                    R$199,90
                  </span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200">
                    R$120 OFF
                  </span>
                </div>

                <div className="text-6xl font-black text-purple-400 leading-none">
                  R$69<span className="text-2xl">,90</span>
                </div>
                <div className="text-[11px] text-white/55 mt-2">
                  Pagamento único
                </div>
              </div>

              <button
                onClick={goCheckout}
                className="mt-6 w-full rounded-2xl bg-gradient-to-br cursor-pointer from-purple-500 to-purple-700 py-5 font-black text-white shadow-[0_0_30px_rgba(168,85,247,0.40)] hover:opacity-95 active:scale-[0.99] transition"
              >
                <span className="inline-flex items-center justify-center gap-2 text-lg">
                  <Lock className="w-5 h-5" />
                  Ativar Acesso Completo
                </span>
              </button>
            </div>
          </div>

          <footer className="mt-12 text-center text-white/40 text-xs">
            <div className="font-bold tracking-widest text-white/50">
              MONITEX.APP
            </div>
            <div className="mt-2">
              © 2026 Monitex — Todos os direitos reservados.
            </div>

            <div className="mt-3 flex items-center justify-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="hover:text-white/70 underline underline-offset-4">
                    Termos de Uso
                  </button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-[720px] bg-[#0b0b0f] border border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Termos de Uso — Monitex.app
                    </DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[70vh] overflow-y-auto pr-2 rounded-xl border border-white/5 bg-black/30 p-4">
                    <pre className="whitespace-pre-wrap text-[11px] leading-relaxed text-white/80">
                      {TERMS_TEXT}
                    </pre>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="hover:text-white/70 underline underline-offset-4">
                    Política de Privacidade
                  </button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-[720px] bg-[#0b0b0f] border border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Política de Privacidade — Monitex.app
                    </DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[70vh] overflow-y-auto pr-2 rounded-xl border border-white/5 bg-black/30 p-4">
                    <pre className="whitespace-pre-wrap text-[11px] leading-relaxed text-white/80">
                      {PRIVACY_TEXT}
                    </pre>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-10 h-10 rounded-full border border-purple-500/25 bg-purple-500/10 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-white">{title}</div>
        <div className="text-sm text-white/60 mt-1 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

function MediaPreview({ stream }: { stream: MediaStream | null }) {
  const vidRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = vidRef.current;
    if (!el) return;
    if (!stream) return;

    el.srcObject = stream;
    el.muted = true;
    el.playsInline = true;
    el.play().catch(() => {});
  }, [stream]);

  if (!stream) return null;

  const hasVideo = stream.getVideoTracks().length > 0;
  const hasAudio = stream.getAudioTracks().length > 0;

  return (
    <div className="space-y-3">
      {hasVideo ? (
        <video
          ref={vidRef}
          className="w-full rounded-xl border border-white/10 bg-black"
        />
      ) : (
        <div className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white/70">
          Vídeo desativado.
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-white/60">
        <span className="inline-flex items-center gap-2">
          <Camera className="w-4 h-4 text-purple-300" />
          {hasVideo ? "Vídeo ativo" : "Vídeo off"}
        </span>
        <span className="inline-flex items-center gap-2">
          <Mic className="w-4 h-4 text-purple-300" />
          {hasAudio ? "Áudio ativo" : "Áudio off"}
        </span>
      </div>
    </div>
  );
}
