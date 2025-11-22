"use client";
import { ListItems } from "@/components/ui/List";

export default function MenuLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ListItems<{
      name: string;
      description: string | undefined;
      quantity: number | undefined;
      unit: string | undefined;
      id: number;
    }>
      url="/api/menu"
      redirectBasePath="/menu"
      renderItem={(item, index) => children}
      keyExtractor={(item) => item.id}
    />
  );
}
