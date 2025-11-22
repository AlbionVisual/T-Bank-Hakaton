"use client";
import { ListItems } from "@/components/ui/List";
export default function RecepiesLayout({
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
      url="recipes"
      renderItem={(item, index) => children}
      keyExtractor={(item) => item.id.toString()}
      redirectBasePath="/recipes"
      headerText="Блюда"
    />
  );
}
