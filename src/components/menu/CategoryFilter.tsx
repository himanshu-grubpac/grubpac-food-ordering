"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import type { MenuCategory } from "@/types/menu";
import { cn } from "@/lib/utils";

const categories: { label: string; value: MenuCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Burger", value: "burger" },
  { label: "Pizza", value: "pizza" },
  { label: "Sides", value: "sides" },
  { label: "Beverage", value: "beverage" },
  { label: "Dessert", value: "dessert" },
];

export function CategoryFilter() {
  const { categoryFilter, setCategoryFilter, setSearchQuery } = useCart();

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {categories.map((category) => (
        <Button
          key={category.value}
          type="button"
          size="sm"
          variant={categoryFilter === category.value ? "default" : "glass"}
          className={cn("rounded-full")}
          onClick={() => {
            setCategoryFilter(category.value);
            if (category.value !== "all") setSearchQuery("");
          }}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}
