"use client";

import { useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  getInboxConversations,
  getSelectedConversation,
  type DirectConversation,
} from "@/features/direct/direct.utils";
import ChatJoClient from "@/features/direct/chat/chats/chat-jo.client";

type Params = { chatId: string };

export default function ChatClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const params = useParams<Params>();

  const username = sp.get("username") ?? "";
  const chatId = params?.chatId ?? "";

  const convo = useMemo<DirectConversation | null>(() => {
    if (!chatId) return null;

    const selected = getSelectedConversation();
    if (selected && selected.id === chatId) return selected;

    const fallback = getInboxConversations({
      total: 18,
      unlockedCount: 4,
      searchedDisplayName: username || "User",
    });

    return fallback.find((c) => c.id === chatId) ?? null;
  }, [chatId, username]);

  if (!convo) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="w-full max-w-[450px] border-x border-gray-800 shadow-2xl">
          <div className="h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-white/80">Chat not found.</p>
            <button
              onClick={() =>
                router.push(`/direct?username=${encodeURIComponent(username)}`)
              }
              className="px-4 py-3 rounded-xl bg-[#584cea] hover:bg-[#4a3fcb] text-white font-semibold text-sm"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (convo.id === "chat-jo") {
    return <ChatJoClient username={username} convo={convo} />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-[450px] border-x border-gray-800 shadow-2xl">
        <div className="h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-white/80">This chat will be added next.</p>
          <button
            onClick={() =>
              router.push(`/direct?username=${encodeURIComponent(username)}`)
            }
            className="px-4 py-3 rounded-xl bg-[#584cea] hover:bg-[#4a3fcb] text-white font-semibold text-sm"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
