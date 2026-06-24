"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import menuData from "@/data/menu.json";
import { useIsClientHydrated } from "@/hooks/useSessionStorage";
import {
  clearStoredOrder,
  getStoredOrder,
  setStoredOrder,
} from "@/lib/orderStorage";
import { TAX_RATE, generateOrderNumber } from "@/lib/utils";
import type { CartItem } from "@/types/cart";
import type { MenuCategory, MenuItem } from "@/types/menu";
import type { Order, PaymentMethod } from "@/types/order";
import type { Customer } from "@/types/customer";

const CART_STORAGE_KEY = "grubpac-cart";

const menuItems = menuData as MenuItem[];

function readCartFromStorage(): CartItem[] {
  try {
    const storedCart = sessionStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? (JSON.parse(storedCart) as CartItem[]) : [];
  } catch {
    sessionStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
}

interface CartContextValue {
  items: CartItem[];
  menuItems: MenuItem[];
  searchQuery: string;
  categoryFilter: MenuCategory | "all";
  subtotal: number;
  tax: number;
  grandTotal: number;
  itemCount: number;
  isHydrated: boolean;
  lastOrder: Order | null;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: MenuCategory | "all") => void;
  addItem: (itemId: string, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  getFilteredMenu: () => MenuItem[];
  placeOrder: (customer: Customer, paymentMethod: PaymentMethod) => Order;
  clearLastOrder: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<MenuCategory | "all">("all");
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const isClient = useIsClientHydrated();

  useEffect(() => {
    if (!isClient) return;
    // Client-only hydration from sessionStorage (avoids SSR mismatch).
    /* eslint-disable react-hooks/set-state-in-effect -- one-time storage restore */
    setItems(readCartFromStorage());
    setLastOrder(getStoredOrder());
    setStorageReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [isClient]);

  useEffect(() => {
    if (!storageReady) return;
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, storageReady]);

  const addItem = useCallback((itemId: string, quantity = 1) => {
    const menuItem = menuItems.find((item) => item.id === itemId);
    if (!menuItem) return;

    setItems((prev) => {
      const existing = prev.find((entry) => entry.item.id === itemId);
      if (existing) {
        return prev.map((entry) =>
          entry.item.id === itemId
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry
        );
      }
      return [...prev, { item: menuItem, quantity }];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((entry) => entry.item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((entry) =>
          entry.item.id === itemId
            ? { ...entry, quantity: entry.quantity + delta }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    sessionStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const getFilteredMenu = useCallback(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, searchQuery]);

  const subtotal = useMemo(
    () => items.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0),
    [items]
  );

  const tax = useMemo(() => Math.round(subtotal * TAX_RATE), [subtotal]);
  const grandTotal = useMemo(() => subtotal + tax, [subtotal, tax]);
  const itemCount = useMemo(
    () => items.reduce((sum, entry) => sum + entry.quantity, 0),
    [items]
  );

  const placeOrder = useCallback(
    (customer: Customer, paymentMethod: PaymentMethod): Order => {
      const order: Order = {
        orderNumber: generateOrderNumber(),
        customer,
        items: [...items],
        subtotal,
        tax,
        grandTotal,
        paymentMethod,
        placedAt: new Date().toISOString(),
        estimatedDeliveryMinutes: 35,
      };
      setLastOrder(order);
      setStoredOrder(order);
      return order;
    },
    [items, subtotal, tax, grandTotal]
  );

  const clearLastOrder = useCallback(() => {
    setLastOrder(null);
    clearStoredOrder();
  }, []);

  const value = useMemo(
    () => ({
      items,
      menuItems,
      searchQuery,
      categoryFilter,
      subtotal,
      tax,
      grandTotal,
      itemCount,
      isHydrated: isClient && storageReady,
      lastOrder,
      setSearchQuery,
      setCategoryFilter,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getFilteredMenu,
      placeOrder,
      clearLastOrder,
    }),
    [
      items,
      searchQuery,
      categoryFilter,
      subtotal,
      tax,
      grandTotal,
      itemCount,
      isClient,
      storageReady,
      lastOrder,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getFilteredMenu,
      placeOrder,
      clearLastOrder,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
