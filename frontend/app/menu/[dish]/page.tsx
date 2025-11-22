import DishCard from "@/components/dishes/DishCard";

export default async function Page({
  params,
}: {
  params: Promise<{ dish: string }>;
}) {
  const { dish } = await params;
  return <DishCard id={Number(dish)} />;
}
