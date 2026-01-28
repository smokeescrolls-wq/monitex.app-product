"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { DirectConversation } from "@/features/direct/direct.utils";
import {
  getInboxConversations,
  getSelectedConversation,
  setSelectedConversation,
} from "@/features/direct/direct.utils";

import ChatJoClient from "@/features/direct/chat/chats/chat-jo.client";
import ChatLuaClient from "@/features/direct/chat/chats/chat-lua.client";
import ChatAndClient from "@/features/direct/chat/chats/chat-and.client";
import ChatRafClient from "@/features/direct/chat/chats/chat-raf.client";

export default function ChatRouteClient() {
  const router = useRouter();
  const params = useSearchParams();

  const username = params.get("username") ?? "";
  const chatId = params.get("chatId") ?? "";

  const usernameForRoutes = username || "user";

  const [convo, setConvo] = useState<DirectConversation | null>(null);

  useEffect(() => {
    // ✅ se não tem chatId, volta pro direct (mas só via effect)
    if (!chatId) {
      router.replace(
        `/direct?username=${encodeURIComponent(usernameForRoutes)}`,
      );
      return;
    }

    // ✅ tenta do storage
    const stored = getSelectedConversation();
    if (stored && stored.id === chatId) {
      setConvo(stored);
      return;
    }

    // ✅ fallback por chatId (refresh/URL direta)
    const list = getInboxConversations({
      total: 40,
      unlockedCount: 4,
      searchedDisplayName: usernameForRoutes,
    });

    const found = list.find((c) => c.id === chatId) ?? null;

    if (found) {
      setSelectedConversation(found);
      setConvo(found);
      return;
    }

    // ✅ se não achou, volta pro direct
    router.replace(`/direct?username=${encodeURIComponent(usernameForRoutes)}`);
  }, [chatId, usernameForRoutes, router]);

  // ✅ enquanto carrega (ou durante redirect)
  if (!chatId || !convo) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-white/70 text-sm">Loading chat…</div>
      </div>
    );
  }

  // ✅ roteamento por variant
  if (convo.variant === "JO")
    return <ChatJoClient username={usernameForRoutes} convo={convo} />;
  if (convo.variant === "LUA")
    return <ChatLuaClient username={usernameForRoutes} convo={convo} />;
  if (convo.variant === "AND")
    return <ChatAndClient username={usernameForRoutes} convo={convo} />;
  if (convo.variant === "RAF")
    return <ChatRafClient username={usernameForRoutes} convo={convo} />;

  // fallback (LOCKED_*)
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-[550px] border-x border-gray-800 shadow-2xl">
        <div className="h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-white/80">
            This chat is locked or not implemented.
          </p>

          <button
            onClick={() =>
              router.push(
                `/cta?username=${encodeURIComponent(usernameForRoutes)}`,
              )
            }
            className="px-4 py-3 rounded-xl bg-[#8A7178] hover:bg-[#9d828a] text-white font-semibold text-sm cursor-pointer"
            type="button"
          >
            Get VIP Access
          </button>
        </div>
      </div>
    </div>
  );
}
