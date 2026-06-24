import type { MenuCategory } from "./menu";

export type VoiceIntent =
  | "show"
  | "add"
  | "remove"
  | "search"
  | "view_cart"
  | "cart_total"
  | "checkout"
  | "clear_cart"
  | "unknown";

export interface VoiceCommandResult {
  intent: VoiceIntent;
  payload: {
    query?: string;
    category?: MenuCategory | "all";
    itemId?: string;
    quantity?: number;
    itemName?: string;
  };
  responseText: string;
}
