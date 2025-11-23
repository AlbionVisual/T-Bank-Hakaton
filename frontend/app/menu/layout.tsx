"use client";
import { Dialog } from "@/components/ui/Dialog";
import { ListItems } from "@/components/ui/List";
import { PlusButton } from "@/components/ui/PlusButton";
import { useEffect, useState } from "react";
import Api from "../api/db_api";

interface Recipe {
  id: number;
  name: string;
  description: string;
  instructions: string;
}

export default function MenuLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showDialog, setShowDialog] = useState(false);
  const [dishes, setDishes] = useState<Recipe[]>([]);
  const [selectedDish, setSelectedDish] = useState<number>(-1);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const [recipes, menus] = await Promise.all([
        Api.getRecipes(),
        Api.getRecipesByMenu(),
      ]);
      const dishesToUse = (recipes as Recipe[]).filter(
        (val) => !menus.find((menu) => menu.id === val.id)
      );
      console.log(dishesToUse);
      setDishes(dishesToUse);
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (selectedDish === -1) return;
    setShowDialog(false);
    await Api.addRecipeToMenu(selectedDish);
    setSelectedDish(-1);
    const [recipes, menus] = await Promise.all([
      Api.getRecipes(),
      Api.getRecipesByMenu(),
    ]);
    const dishesToUse = (recipes as Recipe[]).filter(
      (val) => !menus.find((menu) => menu.id === val.id)
    );
    setDishes(dishesToUse);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <ListItems
        url="menus"
        redirectBasePath="/menu"
        renderItem={(item, index) => children}
        keyExtractor={(item: any) => item.id}
        headerText="Меню"
        refreshKey={refreshKey}
        description="Тут все блюда которые мы будем готовить"
      />
      <PlusButton
        onClick={async () => {
          const [recipes, menus] = await Promise.all([
            Api.getRecipes(),
            Api.getRecipesByMenu(),
          ]);
          const dishesToUse = (recipes as Recipe[]).filter(
            (val) => !menus.find((menu) => menu.id === val.id)
          );
          setDishes(dishesToUse);
          setSelectedDish(-1);
          setShowDialog(true);
        }}
      />
      {showDialog && (
        <Dialog
          on_add={handleAdd}
          on_cancel={() => {
            setShowDialog(false);
            setSelectedDish(-1);
          }}
          disabled={selectedDish === -1}>
          <div className="h-full w-full flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-white border-b-2 border-yellow-300 mb-8">
              Добавить блюдо вменю
            </h1>
            <select
              className=" w-7/8 p-2 rounded-md bg-white"
              value={selectedDish === -1 ? "" : selectedDish}
              onChange={(e) =>
                setSelectedDish(
                  e.target.value === "" ? -1 : Number(e.target.value)
                )
              }>
              <option value="" disabled>
                Выберите блюдо
              </option>
              {dishes.map((dish) => (
                <option key={dish.id} value={dish.id}>
                  {dish.name}
                </option>
              ))}
            </select>
          </div>
        </Dialog>
      )}
    </div>
  );
}
