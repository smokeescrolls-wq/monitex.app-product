export type ChatMedia =
  | { kind: "image"; src: string; w?: number; h?: number }
  | { kind: "audio"; src: string; durationLabel: string };

export type ChatMessage = {
  id: string;
  from: "me" | "them";
  kind: "text" | "media";
  text?: string;
  media?: ChatMedia;
  tsLabel?: string;
};

export type FakeChat = {
  id: string;
  titleMasked: string;
  avatarSrc: string;
  onlineLabel: string;
  lastPreview: string;
  unread: boolean;
  locked: boolean;
  messages: ChatMessage[];
};

export const FAKE_CHATS: FakeChat[] = [
  {
    id: "chat_1",
    titleMasked: "Jo*****",
    avatarSrc: "/user-midias-fake/avatar-1.png",
    onlineLabel: "Online",
    lastPreview: "Can you call me later?",
    unread: true,
    locked: false,
    messages: [
      { id: "m1", from: "them", kind: "text", text: "Hey. Are you free now?" },
      {
        id: "m2",
        from: "me",
        kind: "text",
        text: "In 10 minutes. What’s up?",
      },
      {
        id: "m3",
        from: "them",
        kind: "text",
        text: "Just wanted to hear your voice.",
      },
      {
        id: "m4",
        from: "me",
        kind: "media",
        media: { kind: "audio", src: "/user-midias-fake/audio-1.mp3", durationLabel: "0:11" },
      },
      {
        id: "m5",
        from: "them",
        kind: "text",
        text: "Ok. Call me when you can 🙂",
        tsLabel: "SAT, 11:12",
      },
    ],
  },

  {
    id: "chat_2",
    titleMasked: "Lua*****",
    avatarSrc: "/user-midias-fake/avatar-2.png",
    onlineLabel: "Online 2h ago",
    lastPreview: "I’ll send the details.",
    unread: false,
    locked: false,
    messages: [
      {
        id: "m1",
        from: "them",
        kind: "text",
        text: "Good morning 🙂 Did it get better?",
      },
      {
        id: "m2",
        from: "me",
        kind: "text",
        text: "A bit. I’m still figuring things out.",
      },
      {
        id: "m3",
        from: "them",
        kind: "media",
        media: { kind: "audio", src: "/user-midias-fake/audio-2.mp3", durationLabel: "0:41" },
      },
      {
        id: "m4",
        from: "me",
        kind: "text",
        text: "Thanks. I’ll do it today and update you.",
      },
      {
        id: "m5",
        from: "them",
        kind: "media",
        media: { kind: "image", src: "/user-midias-fake/pic-2.png", w: 900, h: 1200 },
        tsLabel: "SUN, 09:31",
      },
    ],
  },

  {
    id: "chat_3",
    titleMasked: "And****",
    avatarSrc: "/user-midias-fake/avatar-3.png",
    onlineLabel: "Online 6h ago",
    lastPreview: "I’m outside. Come quick.",
    unread: false,
    locked: false,
    messages: [
      { id: "m1", from: "them", kind: "text", text: "I’m outside. Come quick." },
      { id: "m2", from: "me", kind: "text", text: "Where are you exactly?" },
      {
        id: "m3",
        from: "them",
        kind: "media",
        media: { kind: "image", src: "/user-midias-fake/pic-3.jpg", w: 900, h: 1200 },
      },
      {
        id: "m4",
        from: "me",
        kind: "text",
        text: "Ok, I’m coming now.",
        tsLabel: "YESTERDAY, 21:34",
      },
      {
        id: "m5",
        from: "them",
        kind: "media",
        media: { kind: "audio", src: "/user-midias-fake/audio-3.mp3", durationLabel: "0:20" },
      },
    ],
  },
];

export function getFakeChatById(id: string) {
  return FAKE_CHATS.find((c) => c.id === id) ?? null;
}
