"use client";
import { useState, useEffect } from "react";
import RecipeDetails from "../menu/RecipeDetails";

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface Recipe {
  id: number;
  title: string;
  description: string;
}

export default function MenuPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/api/recipes");
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Ошибка загрузки рецептов:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  if (loading)
    return <div className="p-8 text-center">Загрузка рецептов...</div>;

  return (
    <div
      className={`container mx-auto p-4 transition-all duration-300 ${
        selectedRecipe ? "mr-80" : ""
      }`}>
      <div
        className={`p-4 transition-all duration-300 ${
          selectedRecipe ? "mr-80" : "container mx-auto"
        }`}>
        {/* Грид который становится меньше */}
        <div
          className={`grid gap-4 transition-all duration-300 ${
            selectedRecipe
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}>
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => setSelectedRecipe(recipe)}>
              <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
              <p className="text-gray-600 text-sm">{recipe.description}</p>
            </div>
          ))}
        </div>

        {/* Правая панель как компонента RecipeDetails.tsx */}
        {selectedRecipe && (
          <>
            <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white shadow-lg border-l transform transition-transform duration-300">
              <div className="p-6 h-full overflow-y-auto">
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="mb-6 text-gray-500 hover:text-gray-700 text-lg">
                  ✕ Закрыть
                </button>

                <h2 className="text-2xl font-bold mb-4">
                  {selectedRecipe.title}
                </h2>
                <p className="text-gray-700 mb-6">
                  {selectedRecipe.description}
                </p>
              </div>
            </div>
            <RecipeDetails
              recipe={selectedRecipe}
              onClose={() => setSelectedRecipe(null)}
            />
          </>
        )}
      </div>
    </div>
  );
}
