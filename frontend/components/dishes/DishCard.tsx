"use client";
import { useState, useEffect } from "react";

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface RecipeDetails {
  id: number;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string;
}

interface RecipeDetailsProps {
  id: number;
}

export default function RecipeDetails({ id }: RecipeDetailsProps) {
  const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
  useEffect(() => {
    const fetchRecipe = async () => {
      const response = await fetch(`/api/recipes/${id}`);
      const data = await response.json();
      setRecipe(data);
    };
    fetchRecipe();
  }, [id]);
  if (!recipe) return <div>Loading...</div>;
  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white shadow-lg border-l transform transition-transform duration-300">
      <div className="p-6 h-full overflow-y-auto">
        {/* Кнопка закрытия */}
        {/* <button
          onClick={onClose}
          className="mb-6 text-gray-500 hover:text-gray-700 text-lg">
          ✕ Закрыть
        </button> */}

        {/* Заголовок и описание */}
        <h2 className="text-2xl font-bold mb-4">{recipe.title}</h2>
        <p className="text-gray-700 mb-6">{recipe.description}</p>

        {/* Ингредиенты */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Ингредиенты:</h3>
          <div className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-gray-700">{ingredient.name}</span>
                <span className="text-gray-500 text-sm">
                  {ingredient.quantity} {ingredient.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Инструкции */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Способ приготовления:</h3>
          <p className="text-gray-700 whitespace-pre-line">
            {recipe.instructions}
          </p>
        </div>
      </div>
    </div>
  );
}
