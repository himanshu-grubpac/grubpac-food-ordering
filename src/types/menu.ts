export type MenuCategory =
  | "burger"
  | "pizza"
  | "sides"
  | "beverage"
  | "dessert";

export interface MenuItem {
  id: string;
  name: string;
  image: string;
  category: MenuCategory;
  price: number;
  description: string;
}
