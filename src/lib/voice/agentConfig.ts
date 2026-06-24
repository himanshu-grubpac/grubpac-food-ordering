import type { ThinkSettings } from "@deepgram/agents";
import type { MenuItem } from "@/types/menu";
import { formatINR } from "@/lib/utils";

export const AGENT_FUNCTIONS: NonNullable<ThinkSettings["functions"]> = [
  {
    name: "add_to_cart",
    description:
      "Add a food or drink item to the customer's cart. Use the exact menu item name.",
    parameters: {
      type: "object",
      properties: {
        item_name: {
          type: "string",
          description: "Menu item name, e.g. Cheese Burger or Margherita Pizza",
        },
        quantity: {
          type: "number",
          description: "How many to add. Defaults to 1.",
        },
      },
      required: ["item_name"],
    },
  },
  {
    name: "remove_from_cart",
    description: "Remove an item from the customer's cart by name.",
    parameters: {
      type: "object",
      properties: {
        item_name: { type: "string", description: "Menu item name to remove" },
      },
      required: ["item_name"],
    },
  },
  {
    name: "search_menu",
    description: "Search or filter the menu on screen by keyword.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search keyword" },
      },
      required: ["query"],
    },
  },
  {
    name: "show_category",
    description: "Show all items in a menu category on screen.",
    parameters: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["burger", "pizza", "sides", "beverage", "dessert"],
        },
      },
      required: ["category"],
    },
  },
  {
    name: "view_cart",
    description: "Scroll to and show the customer's cart.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "get_cart_summary",
    description: "Get current cart items, quantities, and total price.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "clear_cart",
    description: "Remove all items from the cart.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "go_to_checkout",
    description:
      "Proceed to checkout when the customer wants to place or pay for their order.",
    parameters: { type: "object", properties: {} },
  },
];

export function buildAgentPrompt(menuItems: MenuItem[]): string {
  const menuLines = menuItems
    .map(
      (item) =>
        `- ${item.name} (${item.category}, ${formatINR(item.price)}): ${item.description}`
    )
    .join("\n");

  return `You are the GrubPac Kitchen voice ordering assistant. You help customers browse the menu, manage their cart, and checkout.

PERSONALITY:
- Warm, concise, and helpful — like a skilled restaurant server.
- Confirm actions briefly after calling a function.
- If unsure which item they mean, ask a short clarifying question OR use search_menu.

RULES:
1. When the customer wants food or drinks, call add_to_cart with the exact menu item name.
2. Understand natural speech: "I wanted to order a cheese burger", "can I get fries", "give me two cokes" → add_to_cart.
3. For browse requests ("show pizzas", "what desserts do you have") use show_category or search_menu.
4. When they ask about their order or total, call get_cart_summary or view_cart.
5. When they want to pay or finish ("place my order", "checkout", "I'm done ordering"), call go_to_checkout, then ALWAYS speak a short confirmation with the total (e.g. "Perfect! Your total is 263 rupees. Taking you to checkout now.") before the app navigates.
6. Never invent menu items. Only use items from the menu below.
7. Prices are in Indian Rupees (INR).

MENU:
${menuLines}

Categories: burger, pizza, sides, beverage, dessert`;
}

/** Matches Deepgram playground: flux-general-en + gemini-3.1-flash-lite + aura-2-odysseus-en */
export function buildAgentSettings(menuItems: MenuItem[]) {
  return {
    listen: {
      provider: {
        type: "deepgram" as const,
        version: "v2" as const,
        model: "flux-general-en",
      },
    },
    think: {
      provider: {
        type: "google" as const,
        model: "gemini-3.1-flash-lite",
      },
      prompt: buildAgentPrompt(menuItems),
      functions: AGENT_FUNCTIONS,
    },
    speak: {
      provider: {
        type: "deepgram" as const,
        model: "aura-2-odysseus-en",
      },
    },
    greeting:
      "Hello! Welcome to GrubPac Kitchen. What would you like to order today?",
  };
}
