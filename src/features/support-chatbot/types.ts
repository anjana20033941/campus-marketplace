export type MessageSender = "bot" | "user";

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: number;
  quickReplies?: string[];
  suggestedAction?: {
    type: "category" | "sell" | "explore";
    payload?: string;
  };
}

export interface QuickReplyOption {
  id: string;
  label: string;
  query: string;
}
