"use client";
import { ListItems } from "@/components/ui/List";

export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ListItems
      url="products"
      renderItem={(item, index) => children}
      keyExtractor={(item: any) => item.id.toString()}
      headerText="Продукты"
    />
  );
}
