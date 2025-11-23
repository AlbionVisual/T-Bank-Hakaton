"use client";
import { Dialog } from "@/components/ui/Dialog";
import { ListItems } from "@/components/ui/List";
import { PlusButton } from "@/components/ui/PlusButton";
import { useEffect, useState } from "react";
import Api from "../api/db_api";

interface Recipe {
  name: string;
  description: string | undefined;
  instructions: string | undefined;
  id: number;
}

export default function RecepiesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showDialog, setShowDialog] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [acceptationDisabled, setAcceptationDisabled] = useState(false);
  useEffect(() => {
    Api.getRecipes().then((recipes) => setRecipes(recipes as Recipe[]));
  }, []);

  const handleAdd = async () => {
    await Api.createRecipe({ name: recipeName });
    setShowDialog(false);
    setRecipeName("");
    setRefreshKey((prev) => prev + 1);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipeName(e.target.value);
    if (recipes.find((recipe) => recipe.name === e.target.value))
      setAcceptationDisabled(true);
    else setAcceptationDisabled(false);
  };

  return (
    <>
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
        description="Тут все блюда, которые можно приготовить"
      />
      <PlusButton
        onClick={() => {
          setShowDialog(true);
        }}
      />
      {showDialog && (
        <Dialog
          on_add={handleAdd}
          on_cancel={() => setShowDialog(false)}
          disabled={acceptationDisabled}>
          <div className="h-full w-full flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-white border-b-2 border-yellow-300 mb-8">
              Добавить блюдо
            </h1>
            <input
              type="text"
              className="w-7/8 p-2 rounded-md bg-white"
              placeholder="Название блюда"
              value={recipeName}
              onChange={handleNameChange}
            />
          </div>
        </Dialog>
      )}
    </>
  );
}
