"use client";
import { ListItems } from "@/components/ui/List";

export default function ShoppingListLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ListItems<{
      name: string;
      description: string | undefined;
      quantity: number;
      id: number;
      unit: string;
    }>
      url="/api/shopping_list"
      renderItem={(item, index) => children}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}
