export type ChatMessage =
  | {
      id: string;
      type: "date";
      text: string;
    }
  | {
      id: string;
      type: "text";
      side: "sent" | "received";
      text: string;
      reaction?: string;
      replyTo?: string;
      blurred?: boolean;
    }
  | {
      id: string;
      type: "media";
      side: "sent" | "received";
      src: string;
      reaction?: string;
      locked?: boolean;
    }
  | {
      id: string;
      type: "audio";
      side: "sent" | "received";
      durationLabel: string;
      locked?: boolean;
    }
  | {
      id: string;
      type: "unread_divider";
    };
