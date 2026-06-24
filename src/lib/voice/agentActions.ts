import type { CartItem } from "@/types/cart";
import type { MenuCategory, MenuItem } from "@/types/menu";
import {
  formatINR,
  fuzzyMatchItems,
  resolveMenuItem,
} from "@/lib/utils";

export interface AgentActionContext {
  menuItems: MenuItem[];
  items: CartItem[];
  itemCount: number;
  grandTotal: number;
  addItem: (itemId: string, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: MenuCategory | "all") => void;
  scrollToCart: () => void;
  goToCheckout: () => void;
}

function cartSummary(ctx: AgentActionContext): string {
  if (!ctx.itemCount) {
    return JSON.stringify({ empty: true, message: "Cart is empty." });
  }

  return JSON.stringify({
    empty: false,
    items: ctx.items.map((entry) => ({
      name: entry.item.name,
      quantity: entry.quantity,
      lineTotal: formatINR(entry.item.price * entry.quantity),
    })),
    itemCount: ctx.itemCount,
    total: formatINR(ctx.grandTotal),
  });
}

export function executeAgentFunction(
  name: string,
  args: Record<string, unknown>,
  ctx: AgentActionContext
): string {
  switch (name) {
    case "add_to_cart": {
      const itemName = String(args.item_name ?? "");
      const quantity = Math.max(1, Number(args.quantity) || 1);
      const { item, matches } = resolveMenuItem(itemName, ctx.menuItems);

      if (!item) {
        if (matches.length) {
          ctx.setSearchQuery(itemName);
          ctx.setCategoryFilter("all");
          return JSON.stringify({
            success: false,
            message: `Multiple matches: ${matches.map((m) => m.name).join(", ")}. Ask the customer to pick one.`,
          });
        }
        return JSON.stringify({
          success: false,
          message: `Item "${itemName}" was not found on the menu.`,
        });
      }

      ctx.addItem(item.id, quantity);
      ctx.scrollToCart();
      return JSON.stringify({
        success: true,
        message: `Added ${quantity} x ${item.name} to cart.`,
        item: item.name,
        quantity,
      });
    }

    case "remove_from_cart": {
      const itemName = String(args.item_name ?? "");
      const { item, matches } = resolveMenuItem(itemName, ctx.menuItems);

      if (!item) {
        return JSON.stringify({
          success: false,
          message: matches.length
            ? `Multiple matches for "${itemName}". Ask which one to remove.`
            : `Could not find "${itemName}" to remove.`,
        });
      }

      ctx.removeItem(item.id);
      ctx.scrollToCart();
      return JSON.stringify({
        success: true,
        message: `Removed ${item.name} from cart.`,
      });
    }

    case "search_menu": {
      const query = String(args.query ?? "").trim();
      ctx.setSearchQuery(query);
      ctx.setCategoryFilter("all");
      const matches = fuzzyMatchItems(query, ctx.menuItems);
      return JSON.stringify({
        success: true,
        message: `Showing ${matches.length} result(s) for "${query}".`,
        items: matches.map((m) => m.name),
      });
    }

    case "show_category": {
      const category = String(args.category ?? "") as MenuCategory;
      const valid: MenuCategory[] = [
        "burger",
        "pizza",
        "sides",
        "beverage",
        "dessert",
      ];
      if (!valid.includes(category)) {
        return JSON.stringify({
          success: false,
          message: `Unknown category "${category}".`,
        });
      }
      ctx.setCategoryFilter(category);
      ctx.setSearchQuery("");
      return JSON.stringify({
        success: true,
        message: `Showing ${category} items on screen.`,
      });
    }

    case "view_cart":
      ctx.scrollToCart();
      return cartSummary(ctx);

    case "get_cart_summary":
      return cartSummary(ctx);

    case "clear_cart":
      ctx.clearCart();
      return JSON.stringify({ success: true, message: "Cart cleared." });

    case "go_to_checkout":
      if (!ctx.itemCount) {
        return JSON.stringify({
          success: false,
          message: "Cart is empty. Add items before checkout.",
        });
      }
      ctx.goToCheckout();
      return JSON.stringify({
        success: true,
        message: "Navigating to checkout.",
        total: formatINR(ctx.grandTotal),
      });

    default:
      return JSON.stringify({
        success: false,
        message: `Unknown function "${name}".`,
      });
  }
}
