import type { MenuItem } from "@/types/menu";
import type { VoiceCommandResult } from "@/types/voice";
import {
  fuzzyMatchItems,
  normalizeText,
  parseQuantity,
  resolveCategoryFilter,
} from "@/lib/utils";

const PLACE_ORDER_RE =
  /\b(place\s+(my\s+)?order|place\s+the\s+order|checkout|proceed\s+to\s+(checkout|payment)|confirm\s+(my\s+)?order|complete\s+(my\s+)?order|finish\s+(my\s+)?order|go\s+to\s+checkout|ready\s+to\s+pay|make\s+(the\s+)?payment)\b/;

const CLEAR_CART_RE =
  /\b(clear\s+(my\s+)?cart|empty\s+(my\s+)?cart|remove\s+everything|delete\s+everything)\b/;

const CART_TOTAL_RE =
  /\b((what\s+is\s+)?(my\s+)?(order\s+)?total|how\s+much|cart\s+total|total\s+amount|bill\s+amount)\b/;

const VIEW_CART_RE =
  /\b(view\s+cart|show\s+cart|my\s+cart|open\s+cart|see\s+cart|check\s+cart)\b/;

const ADD_PREFIX_RE =
  /^(add|i\s+want|i\s+would\s+like|get\s+me|give\s+me|need|order\s+(a|an|some)?)\s+/i;

const REMOVE_PREFIX_RE =
  /^(remove|delete|take\s+out)\s+/i;

const SEARCH_PREFIX_RE = /^(search|find|look\s+for)\s+/i;

const SHOW_PREFIX_RE = /^(show|display|list)\s+/i;

const FILLER_WORDS_RE =
  /\b(please|the|a|an|some|from\s+cart|from\s+menu|to\s+cart|in\s+cart|for\s+me)\b/gi;

function stripFiller(text: string): string {
  return text.replace(FILLER_WORDS_RE, " ").replace(/\s+/g, " ").trim();
}

function stripQuantityWords(text: string): string {
  return text
    .replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSearchResult(
  query: string,
  menuItems: MenuItem[]
): VoiceCommandResult {
  const trimmedQuery = stripFiller(query.trim());
  const matches = fuzzyMatchItems(trimmedQuery, menuItems);

  return {
    intent: "search",
    payload: { query: trimmedQuery },
    responseText: matches.length
      ? `Showing ${matches.length} result${matches.length > 1 ? "s" : ""} for ${trimmedQuery}.`
      : `No items found for ${trimmedQuery}.`,
  };
}

function buildAddResult(
  rawQuery: string,
  menuItems: MenuItem[]
): VoiceCommandResult {
  const quantity = parseQuantity(rawQuery);
  const query = stripQuantityWords(stripFiller(rawQuery));
  const matches = fuzzyMatchItems(query, menuItems);

  if (!matches.length) {
    return {
      intent: "unknown",
      payload: { query },
      responseText: `Could not find ${query || "that item"} on the menu.`,
    };
  }

  if (matches.length > 1) {
    return {
      ...buildSearchResult(query, menuItems),
      responseText: `Found ${matches.length} options for ${query}. Pick one from the menu.`,
    };
  }

  const item = matches[0];
  return {
    intent: "add",
    payload: {
      itemId: item.id,
      itemName: item.name,
      quantity,
    },
    responseText: `${item.name}${quantity > 1 ? ` x${quantity}` : ""} added to cart.`,
  };
}

function buildRemoveResult(
  rawQuery: string,
  menuItems: MenuItem[]
): VoiceCommandResult {
  const query = stripQuantityWords(stripFiller(rawQuery));
  const matches = fuzzyMatchItems(query, menuItems);

  if (!matches.length) {
    return {
      intent: "unknown",
      payload: { query },
      responseText: `Could not find ${query || "that item"} to remove.`,
    };
  }

  const item = matches[0];
  return {
    intent: "remove",
    payload: { itemId: item.id, itemName: item.name },
    responseText: `${item.name} removed from cart.`,
  };
}

function extractAfterPrefix(transcript: string, prefix: RegExp): string {
  return stripFiller(transcript.replace(prefix, "").trim());
}

export function parseVoiceCommand(
  transcript: string,
  menuItems: MenuItem[]
): VoiceCommandResult {
  const normalized = normalizeText(transcript);

  if (!normalized) {
    return {
      intent: "unknown",
      payload: {},
      responseText: "Sorry, I did not catch that. Please try again.",
    };
  }

  if (PLACE_ORDER_RE.test(normalized)) {
    return {
      intent: "checkout",
      payload: {},
      responseText: "Taking you to checkout.",
    };
  }

  if (CLEAR_CART_RE.test(normalized)) {
    return {
      intent: "clear_cart",
      payload: {},
      responseText: "Cart cleared.",
    };
  }

  if (CART_TOTAL_RE.test(normalized) && !VIEW_CART_RE.test(normalized)) {
    return {
      intent: "cart_total",
      payload: {},
      responseText: "Showing your order total.",
    };
  }

  if (VIEW_CART_RE.test(normalized)) {
    return {
      intent: "view_cart",
      payload: {},
      responseText: "Showing your cart.",
    };
  }

  if (SEARCH_PREFIX_RE.test(transcript.trim())) {
    const query = extractAfterPrefix(transcript.trim(), SEARCH_PREFIX_RE);
    return buildSearchResult(query, menuItems);
  }

  if (SHOW_PREFIX_RE.test(transcript.trim())) {
    const query = extractAfterPrefix(transcript.trim(), SHOW_PREFIX_RE);
    const category = resolveCategoryFilter(query);

    if (category) {
      const label = category.charAt(0).toUpperCase() + category.slice(1);
      return {
        intent: "show",
        payload: { category, query },
        responseText: `Showing ${label.toLowerCase()} items.`,
      };
    }

    return buildSearchResult(query, menuItems);
  }

  if (REMOVE_PREFIX_RE.test(transcript.trim())) {
    const query = extractAfterPrefix(transcript.trim(), REMOVE_PREFIX_RE);
    return buildRemoveResult(query, menuItems);
  }

  if (ADD_PREFIX_RE.test(transcript.trim())) {
    const query = extractAfterPrefix(transcript.trim(), ADD_PREFIX_RE);
    return buildAddResult(query, menuItems);
  }

  const category = resolveCategoryFilter(normalized);
  if (category && normalized.split(/\s+/).length <= 3) {
    const label = category.charAt(0).toUpperCase() + category.slice(1);
    return {
      intent: "show",
      payload: { category },
      responseText: `Showing ${label.toLowerCase()} items.`,
    };
  }

  const matches = fuzzyMatchItems(stripFiller(transcript.trim()), menuItems);
  if (matches.length === 1) {
    return buildAddResult(transcript.trim(), menuItems);
  }

  if (matches.length > 1) {
    return buildSearchResult(transcript.trim(), menuItems);
  }

  return {
    intent: "unknown",
    payload: {},
    responseText:
      'Try "add burger", "show pizza", "view cart", or "place my order".',
  };
}
