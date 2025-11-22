"use client";
import { ListItems } from "@/components/ui/List";

export default function MenuLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ListItems
      url="menus"
      redirectBasePath="/menu"
      renderItem={(item, index) => children}
      keyExtractor={(item: any) => item.id}
      headerText="Меню"
    />
  );
}
