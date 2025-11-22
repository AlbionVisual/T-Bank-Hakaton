"use client";
import { ListItems } from "@/components/ui/List";

export default function ShoppingListLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ListItems
      url="products"
      renderItem={(item, index) => children}
      keyExtractor={(item: any) => item.id.toString()}
      headerText="Что нужно купить для полноценного выбора блюд"
    />
  );
}
