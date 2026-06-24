"use client";

import { useEffect, useState } from "react";
import { UtensilsCrossed } from "lucide-react";
import { MenuCard } from "@/components/menu/MenuCard";
import { useCart } from "@/context/CartContext";

function MenuSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-80 animate-pulse rounded-2xl skeleton"
        />
      ))}
    </div>
  );
}

export function MenuGrid() {
  const { getFilteredMenu } = useCart();
  const [loading, setLoading] = useState(true);
  const menuItems = getFilteredMenu();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <MenuSkeleton />;

  if (!menuItems.length) {
    return (
      <div className="empty-state flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
        <UtensilsCrossed className="mb-4 h-10 w-10 text-muted-foreground" />
        <h3 className="text-lg font-semibold">No items found</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Try adjusting your search or say &quot;Show pizza&quot; to filter the menu.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
      {menuItems.map((item, index) => (
        <MenuCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}
