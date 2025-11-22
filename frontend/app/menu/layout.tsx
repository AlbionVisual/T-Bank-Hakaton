"use client";
import { ListItems } from "@/components/ui/List";
import Api from "@/app/api/db_api";
export default function MenuLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ListItems
      url="recipes"
      redirectBasePath="/menu"
      renderItem={(item, index) => children}
      keyExtractor={(item: any) => item.id}
    />
  );
}
