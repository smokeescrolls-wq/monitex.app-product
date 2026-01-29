export type DirectConversation = {
  id: string;
  maskedTitle: string;
  avatarUrl: string;
  subtitle: string;
  timeLabel: string;
  unread: boolean;
  locked: boolean;
  variant: "JO" | "LUA" | "AND" | "RAF" | "LOCKED_A" | "LOCKED_B";
};

export type ChatMessage =
  | {
      id: string;
      kind: "text";
      fromMe: boolean;
      text: string;
      timeLabel: string;
      locked: boolean;
    }
  | {
      id: string;
      kind: "image";
      fromMe: boolean;
      timeLabel: string;
      locked: boolean;
      src: string;
    }
  | {
      id: string;
      kind: "audio";
      fromMe: boolean;
      timeLabel: string;
      locked: boolean;
      durationLabel: string;
    };
export function proxyImage(url?: string | null) {
  if (!url) return "/placeholder-avatar.png";
  if (url.startsWith("/api/image-proxy?url=")) return url;
  if (url.startsWith("/")) return url;
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}


function mask(username: string) {
  const head = username.slice(0, 2);
  return `${head}${"*".repeat(5)}`;
}

export function getInboxConversations(params: {
  total: number;
  unlockedCount: number;
  searchedDisplayName: string;
}): DirectConversation[] {
  const { total, searchedDisplayName } = params;

  const baseUnlocked: DirectConversation[] = [
    {
      id: "chat-jo",
      maskedTitle: "James Wiliams",
      avatarUrl: "/avatar/avatar-depoimento-1.jpg",
      subtitle: "Be honest — did you sleep well?",
      timeLabel: "Now",
      unread: true,
      locked: false,
      variant: "JO",
    },
    {
      id: "chat-lua",
      maskedTitle: "Amelia ssiva",
      avatarUrl: "/avatar/avatar-depoimento-5.jpg",
      subtitle: "I’m listening. What happened....",
      timeLabel: "19 min",
      unread: false,
      locked: false,
      variant: "LUA",
    },
    {
      id: "chat-and",
      maskedTitle: "Grace brookyn",
      avatarUrl: "/avatar/avatar-depoimento-2.jpg",
      subtitle: `${searchedDisplayName}, promise you won’t.`,
      timeLabel: "2 h",
      unread: false,
      locked: false,
      variant: "AND",
    },
    {
      id: "chat-raf",
      maskedTitle: "Emma schmitt",
      avatarUrl: "/avatar/avatar-depoimento-4.jpg",
      subtitle: "Missed video call…",
      timeLabel: "1 d",
      unread: false,
      locked: false,
      variant: "RAF",
    },
  ];

  const lockedPool = Array.from({
    length: Math.max(0, total - baseUnlocked.length),
  }).map((_, i) => {
    const u = `user_${i + 1}`;
    const maskedTitle = mask(u);
    const t = i < 3 ? "1 d" : i < 8 ? "2 d" : "3 d";

    const subtitle =
      i % 5 === 0
        ? "Sent a reel…"
        : i % 5 === 1
          ? "Sent a voice message…"
          : i % 5 === 2
            ? "Liked your message"
            : i % 5 === 3
              ? "You there?"
              : "New message…";

    return {
      id: `chat-locked-${i + 1}`,
      maskedTitle,
      avatarUrl: "",
      subtitle,
      timeLabel: t,
      unread: false,
      locked: true,
      variant: i % 2 === 0 ? "LOCKED_A" : "LOCKED_B",
    } satisfies DirectConversation;
  });

  return [...baseUnlocked, ...lockedPool].slice(0, total);
}

export function setSelectedConversation(c: DirectConversation) {
  sessionStorage.setItem("directSelectedConversation", JSON.stringify(c));
}

export function getSelectedConversation(): DirectConversation | null {
  try {
    const raw = sessionStorage.getItem("directSelectedConversation");
    if (!raw) return null;
    return JSON.parse(raw) as DirectConversation;
  } catch {
    return null;
  }
}

/* =========================
   Mensagens (se você usar)
   ========================= */

function chatJo(): ChatMessage[] {
  return [
    { id: "jo-1", kind: "text", fromMe: false, text: "Hey. Are you okay?", timeLabel: "Fri, 11:12", locked: false },
    { id: "jo-2", kind: "text", fromMe: true, text: "Yeah. Just tired. Long day.", timeLabel: "Fri, 11:13", locked: false },
    { id: "jo-3", kind: "text", fromMe: false, text: "Tell me one thing you want to fix this week. One thing only.", timeLabel: "Fri, 11:13", locked: false },
    { id: "jo-4", kind: "audio", fromMe: true, timeLabel: "Fri, 11:15", locked: false, durationLabel: "0:11" },
    { id: "jo-5", kind: "image", fromMe: false, timeLabel: "Yesterday, 21:34", locked: true, src: "/user-midias-fake/nudes1-chat1.jpg" },
    { id: "jo-6", kind: "text", fromMe: false, text: "I’m not going anywhere. Talk to me when you can.", timeLabel: "Yesterday, 21:35", locked: true },
  ];
}

function chatLua(): ChatMessage[] {
  return [
    { id: "lua-1", kind: "text", fromMe: false, text: "Good morning. Did you eat something?", timeLabel: "Sat, 09:31", locked: false },
    { id: "lua-2", kind: "text", fromMe: true, text: "Not yet. I will.", timeLabel: "Sat, 09:32", locked: false },
    { id: "lua-3", kind: "audio", fromMe: false, timeLabel: "Sat, 09:33", locked: false, durationLabel: "0:13" },
    { id: "lua-4", kind: "text", fromMe: true, text: "Thanks. I needed that.", timeLabel: "Sat, 09:34", locked: false },
    { id: "lua-5", kind: "image", fromMe: true, timeLabel: "Sat, 09:36", locked: true, src: "/user-midias-fake/nudes1-chat2.jpg" },
    { id: "lua-6", kind: "audio", fromMe: false, timeLabel: "Sat, 09:37", locked: true, durationLabel: "0:41" },
  ];
}

function chatAnd(): ChatMessage[] {
  return [
    { id: "and-1", kind: "text", fromMe: false, text: "I can tell you’re holding back. Say it.", timeLabel: "Sun, 15:17", locked: false },
    { id: "and-2", kind: "text", fromMe: true, text: "I don’t want to mess things up.", timeLabel: "Sun, 15:18", locked: false },
    { id: "and-3", kind: "text", fromMe: false, text: "You won’t. Just be clear with me.", timeLabel: "Sun, 15:18", locked: false },
    { id: "and-4", kind: "audio", fromMe: true, timeLabel: "Sun, 15:19", locked: false, durationLabel: "0:20" },
    { id: "and-5", kind: "image", fromMe: false, timeLabel: "Sun, 15:21", locked: true, src: "/user-midias-fake/nudes1-chat-4.jpg" },
    { id: "and-6", kind: "text", fromMe: false, text: "When you’re ready, I’m here.", timeLabel: "Sun, 15:22", locked: true },
  ];
}

function lockedA(): ChatMessage[] {
  return [
    { id: "la-1", kind: "text", fromMe: false, text: "Hey", timeLabel: "2 d", locked: false },
    { id: "la-2", kind: "audio", fromMe: false, timeLabel: "2 d", locked: true, durationLabel: "0:32" },
  ];
}

function lockedB(): ChatMessage[] {
  return [
    { id: "lb-1", kind: "text", fromMe: true, text: "Can’t talk now.", timeLabel: "3 d", locked: false },
    { id: "lb-2", kind: "text", fromMe: false, text: "Ok.", timeLabel: "3 d", locked: true },
  ];
}

export function getChatMessages(
  variant: DirectConversation["variant"],
): ChatMessage[] {
  if (variant === "JO") return chatJo();
  if (variant === "LUA") return chatLua();
  if (variant === "AND") return chatAnd();
  if (variant === "LOCKED_A") return lockedA();
  return lockedB();
}
