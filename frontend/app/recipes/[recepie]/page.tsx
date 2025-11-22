import DishCard from "@/components/dishes/DishCard";
export default async function Page({
  params,
}: {
  params: Promise<{ recepie: string }>;
}) {
  const { recepie } = await params;
  return <DishCard id={Number(recepie)} />;
}
