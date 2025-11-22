"use client";
import { ListItems } from "@/components/ui/List";
import Api from "@/app/api/db_api";

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
    />
  );
}
