import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { MenuCategory, MenuItem } from "@/types/menu";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateOrderNumber(): string {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `GRUBPAC-2026-${random}`;
}

export function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s]/g, "");
}

const NUMBER_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

export function parseQuantity(text: string): number {
  const normalized = normalizeText(text);
  const digitMatch = normalized.match(/\b(\d+)\b/);
  if (digitMatch) return Math.max(1, parseInt(digitMatch[1], 10));

  for (const [word, value] of Object.entries(NUMBER_WORDS)) {
    if (normalized.includes(word)) return value;
  }

  return 1;
}

const ITEM_ALIASES: Record<string, string[]> = {
  "veg-burger": ["veg burger", "vegetable burger"],
  "cheese-burger": ["cheese burger", "cheeseburger"],
  "chicken-burger": ["chicken burger", "chicken"],
  "paneer-burger": ["paneer burger", "paneer"],
  "margherita-pizza": ["margherita", "margarita pizza", "margherita pizza"],
  "farmhouse-pizza": ["farmhouse", "farm house pizza", "farmhouse pizza"],
  "pepperoni-pizza": ["pepperoni", "pepperoni pizza"],
  "bbq-chicken-pizza": ["bbq chicken pizza", "barbecue pizza", "bbq pizza"],
  "french-fries": ["fries", "french fries", "french fry"],
  sandwich: ["sandwich", "sandwiches", "grilled sandwich"],
  pasta: ["pasta", "spaghetti", "creamy pasta"],
  "garlic-bread": ["garlic bread", "bread"],
  "onion-rings": ["onion rings", "onion ring"],
  "cold-coffee": ["cold coffee", "iced coffee", "coffee"],
  coke: ["coke", "cola", "cold drink", "soda"],
  "lemon-iced-tea": ["lemon tea", "iced tea", "lemon iced tea"],
  "mango-shake": ["mango shake", "mango", "shake"],
  "fresh-lime-soda": ["lime soda", "fresh lime", "soda", "lemonade"],
  "chocolate-cake": ["chocolate cake", "cake", "chocolate"],
  "gulab-jamun": ["gulab jamun", "jamun", "indian sweet"],
  "ice-cream-sundae": ["ice cream", "sundae", "ice cream sundae"],
  "glazed-donut": ["donut", "doughnut", "glazed donut"],
};

const CATEGORY_ALIASES: Record<MenuCategory, string[]> = {
  burger: ["burger", "burgers"],
  pizza: ["pizza", "pizzas"],
  sides: ["fries", "french fries", "sides", "side", "sandwich", "pasta"],
  beverage: ["drink", "drinks", "beverage", "cold drink", "coffee", "coke", "shake", "tea"],
  dessert: ["dessert", "sweet", "cake", "ice cream", "donut"],
};

export function fuzzyMatchItems(
  query: string,
  menuItems: MenuItem[]
): MenuItem[] {
  const normalized = normalizeText(query);
  if (!normalized) return [];

  const categoryFilter = resolveCategoryFilter(normalized);
  const isCategoryOnly =
    categoryFilter &&
    (normalized === categoryFilter ||
      CATEGORY_ALIASES[categoryFilter].some(
        (alias) => normalized === normalizeText(alias)
      ));

  const matches = menuItems.filter((item) => {
    const name = normalizeText(item.name);
    const aliases = ITEM_ALIASES[item.id] ?? [];

    const nameMatch =
      normalized.includes(name) ||
      name.includes(normalized) ||
      aliases.some((alias) => {
        const na = normalizeText(alias);
        return normalized.includes(na) || na.includes(normalized);
      });

    if (nameMatch) return true;

    return isCategoryOnly && item.category === categoryFilter;
  });

  return matches;
}

export function resolveMenuItem(
  query: string,
  menuItems: MenuItem[]
): { item: MenuItem | null; matches: MenuItem[] } {
  const normalized = normalizeText(query);
  if (!normalized) return { item: null, matches: [] };

  const exact = menuItems.find(
    (item) => normalizeText(item.name) === normalized
  );
  if (exact) return { item: exact, matches: [exact] };

  const matches = menuItems.filter((item) => {
    const name = normalizeText(item.name);
    const aliases = ITEM_ALIASES[item.id] ?? [];
    return (
      normalized.includes(name) ||
      aliases.some((alias) => normalized.includes(normalizeText(alias)))
    );
  });

  if (matches.length === 1) return { item: matches[0], matches };
  if (matches.length > 1) return { item: null, matches };

  const fuzzy = fuzzyMatchItems(query, menuItems);
  if (fuzzy.length === 1) return { item: fuzzy[0], matches: fuzzy };
  return { item: null, matches: fuzzy };
}

export function resolveCategoryFilter(query: string): MenuCategory | null {
  const normalized = normalizeText(query);

  for (const [category, aliases] of Object.entries(CATEGORY_ALIASES)) {
    if (
      aliases.some(
        (alias) =>
          normalized.includes(normalizeText(alias)) ||
          normalizeText(alias).includes(normalized)
      )
    ) {
      return category as MenuCategory;
    }
  }

  return null;
}

export const TAX_RATE = 0.05;
