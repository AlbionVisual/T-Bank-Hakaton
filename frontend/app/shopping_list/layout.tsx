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
      quantity: number;
      description: string | null;
      id: number;
      unit: string;
    }>
      url="/api/shopping"
      renderItem={(item, index) => children}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}
