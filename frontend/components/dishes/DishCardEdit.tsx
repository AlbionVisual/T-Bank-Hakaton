"use client";
import { useState, useEffect } from "react";
import Api from "@/app/api/db_api";

interface Product {
  id: number;
  name: string;
  unit: string;
}

interface Ingredient {
  product_id?: number;
  product_name: string;
  amount: number | "";
  product_unit: string;
}

interface RecipeDetailsProps {
  id: number;
  onFieldChange: (field: string, value: any) => void;
}

export default function DishCardEdit({
  id,
  onFieldChange,
}: RecipeDetailsProps) {
  const [recipe, setRecipe] = useState<any>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const response = await Api.getRecipe(id);
      const responseIng = await Api.getIngredients(id);
      setRecipe({ ...response, ingredients: responseIng });
      setIngredients(
        responseIng.map((ing: any) => ({
          ...ing,
          product_name: ing.product_name ?? "",
          amount: ing.amount ?? "",
          product_unit: ing.product_unit ?? "",
          product_id: ing.product_id ?? undefined,
        }))
      );

      const products = await Api.getProducts();
      setAllProducts(products);
    };
    fetchAll();
  }, [id]);

  const handleIngredientNameChange = (index: number, value: string) => {
    if (
      value &&
      ingredients.some(
        (ing, i) =>
          i !== index &&
          ing.product_name.trim().toLowerCase() === value.trim().toLowerCase()
      )
    ) {
      return;
    }
    changeIngredientField(index, "product_name", value);
    const found = allProducts.find(
      (prod) => prod.name.trim().toLowerCase() === value.trim().toLowerCase()
    );
    setIngredients((prev) => {
      const newIngs = [...prev];
      if (!found) {
        newIngs[index] = {
          ...newIngs[index],
          product_name: "",
          product_unit: "",
          product_id: undefined,
        };
      } else {
        newIngs[index] = {
          ...newIngs[index],
          product_name: found.name,
          product_unit: found.unit,
          product_id: found.id,
        };
      }
      return newIngs;
    });
  };

  const handleIngredientAmountChange = (index: number, value: string) => {
    const numberOrEmpty = value === "" ? "" : Number(value.replace(",", "."));
    if (numberOrEmpty === "" || (!isNaN(numberOrEmpty) && numberOrEmpty >= 0)) {
      setIngredients((prev) => {
        const newIngs = [...prev];
        if (value === "") {
          newIngs.splice(index, 1);
        } else {
          newIngs[index] = {
            ...newIngs[index],
            amount: numberOrEmpty,
          };
        }
        return newIngs;
      });
      changeIngredientField(index, "amount", value);
    }
  };

  const handleAddIngredient = () => {
    changeIngredientField(ingredients.length, "amount", 1);
    changeIngredientField(ingredients.length, "product_name", "");
    changeIngredientField(ingredients.length, "product_unit", "");
    changeIngredientField(ingredients.length, "product_id", undefined);
  };

  const handleIngredientBlur = (index: number) => {
    setIngredients((prev) => {
      if (prev[index].product_name.trim() === "") {
        const newArr = [...prev];
        newArr.splice(index, 1);
        return newArr;
      }
      return prev;
    });
  };

  const changeRecipeField = (field: string, value: any) => {
    setRecipe({ ...recipe, [field]: value });
    onFieldChange(field, value);
  };

  const changeIngredientField = (
    index: number,
    field: string = "",
    value: any = undefined
  ) => {
    if (field === "" && value === undefined) {
      setIngredients((prev) => {
        const newIngs = [...prev];
        newIngs.splice(index, 1);
        return newIngs;
      });
      onFieldChange(`ingredients.${index}`, undefined);
      return;
    }
    setIngredients((prev) => {
      const newIngs = [...prev];
      newIngs[index] = { ...newIngs[index], [field]: value };
      return newIngs;
    });
    onFieldChange(`ingredients.${index}.${field}`, value);
  };

  if (!recipe) return <div className="text-yellow-300">Loading...</div>;

  return (
    <div className="h-full">
      <div className="mb-6">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-yellow-300">
          Название
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-300 focus:ring-yellow-300 sm:text-sm text-black"
          value={recipe.name}
          onChange={(e) => changeRecipeField("name", e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-yellow-300">
          Описание
        </label>
        <textarea
          id="description"
          name="description"
          className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-300 focus:ring-yellow-300 sm:text-sm text-black"
          value={recipe.description}
          onChange={(e) => changeRecipeField("description", e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-yellow-300 mb-2">
          Ингредиенты
        </label>
        <div className="space-y-3">
          {ingredients.map((ingredient, idx) => (
            <div key={idx} className="flex gap-2 items-end relative">
              <div className="flex-1 min-w-0">
                <label className="block text-xs text-gray-500">Название</label>
                <select
                  className="block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-300 focus:ring-yellow-300 sm:text-sm text-black bg-white"
                  name={`ingredient-name-${idx}`}
                  id={`ingredient-name-${idx}`}
                  value={ingredient.product_name || ""}
                  onChange={(e) =>
                    handleIngredientNameChange(idx, e.target.value)
                  }
                  onBlur={() => handleIngredientBlur(idx)}>
                  <option value="" disabled>
                    -- выберите продукт --
                  </option>
                  {allProducts
                    .filter(
                      (product) =>
                        product.name.trim() ===
                          ingredient.product_name.trim() ||
                        !ingredients.some(
                          (ing, i) =>
                            i !== idx &&
                            ing.product_name.trim().toLowerCase() ===
                              product.name.trim().toLowerCase()
                        )
                    )
                    .map((product) => (
                      <option key={product.id} value={product.name}>
                        {product.name}
                      </option>
                    ))}
                </select>
              </div>
              <div
                className="flex flex-col items-center"
                style={{ width: "88px" }}>
                <label className="block text-xs text-gray-500">Кол-во</label>
                <input
                  type="number"
                  step="any"
                  min="1"
                  className="w-16 rounded-md border-yellow-300 shadow-sm focus:border-yellow-300 focus:ring-yellow-300 sm:text-sm text-black"
                  value={ingredient.amount}
                  onChange={(e) =>
                    handleIngredientAmountChange(idx, e.target.value)
                  }
                  name={`ingredient-amount-${idx}`}
                  id={`ingredient-amount-${idx}`}
                />
              </div>
              <div
                className="flex flex-col items-center"
                style={{ width: "64px" }}>
                <label className="block text-xs text-gray-500">Ед.</label>
                <input
                  type="text"
                  className="w-10 rounded-md border-yellow-300 shadow-sm focus:border-yellow-300 focus:ring-yellow-300 sm:text-sm text-black bg-gray-50"
                  value={ingredient.product_unit || ""}
                  disabled
                  tabIndex={-1}
                  readOnly
                  name={`ingredient-unit-${idx}`}
                  id={`ingredient-unit-${idx}`}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setIngredients((prev) => {
                    const arr = [...prev];
                    arr.splice(idx, 1);
                    return arr;
                  });
                  changeIngredientField(idx);
                }}
                className="ml-2 text-gray-400 hover:text-red-500 text-xl px-2 pb-2"
                title="Удалить ингредиент">
                ×
              </button>
            </div>
          ))}

          <button
            type="button"
            className="w-full mt-2 py-1 rounded text-sm font-semibold border border-yellow-300 text-yellow-300 hover:bg-yellow-100 transition"
            onClick={handleAddIngredient}>
            + Добавить ингредиент
          </button>
        </div>
      </div>
      <div className="mb-6">
        <label
          htmlFor="instructions"
          className="block text-sm font-medium text-yellow-300">
          Способ приготовления
        </label>
        <textarea
          id="instructions"
          name="instructions"
          className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-300 focus:ring-yellow-300 sm:text-sm text-black"
          value={recipe.instructions}
          onChange={(e) => changeRecipeField("instructions", e.target.value)}
        />
      </div>
    </div>
  );
}
