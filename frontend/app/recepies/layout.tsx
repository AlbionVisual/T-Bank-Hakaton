"use client";
import { ListItems } from "@/components/ui/List";

export default function RecepiesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ListItems<{ name: string; description: string; id: number }>
      url="/api/recipes"
      renderItem={(item, index) => children}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}
