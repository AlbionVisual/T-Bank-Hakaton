"use client";
import { useState, useEffect } from "react";
import { Card } from "./Card";
import Api from "@/app/api/db_api";
import DishCardEdit from "../dishes/DishCardEdit";

export function ListItems<T>({
  url,
  renderItem,
  keyExtractor,
  redirectBasePath,
  headerText = "Меню",
}: {
  url: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  redirectBasePath?: string;
  headerText?: string;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [cardRenderKey, setCardRenderKey] = useState(0);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (url === "recipes") {
          const response = await Api.getRecipes();
          setItems(response);
        } else if (url === "products") {
          const response = await Api.getProducts();
          setItems(response);
        } else if (url === "inventory") {
          const response = await Api.getInventory();
          setItems(response);
        } else if (url === "menus") {
          const response = await Api.getRecipesByMenu();
          setItems(response);
        } else {
          throw new Error("Неизвестный URL");
        }
      } catch (error) {
        console.error("Ошибка загрузки:", error);
        setError("Не удалось загрузить данные");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [url]);

  const handleSave = async () => {
    if (selectedItem) {
      if (editMode) {
        setEditMode(false);
        const ingredients = selectedItem.ingredients
          .map((ingredient: any) => ({
            product_name: ingredient.product_name,
            product_unit: ingredient.product_unit,
            amount: ingredient.amount,
          }))
          .filter(
            (ingredient: any) =>
              ingredient.product_id !== undefined &&
              ingredient.amount !== undefined
          );
        await Api.updateRecipe(selectedItem.id, {
          name: selectedItem.name,
          description: selectedItem.description,
          instructions: selectedItem.instructions,
        });
        // await Api.(selectedItem.id, ingredients);
        setCardRenderKey((prev) => prev + 1);
        setItems((prev) =>
          prev.map((itm) =>
            keyExtractor(itm) === keyExtractor(selectedItem)
              ? { ...itm, ...selectedItem }
              : itm
          )
        );
      } else {
        setEditMode(true);
      }
    }
  };

  const onFieldChange = (field: string, value: any) => {
    const newIngredients = [...selectedItem.ingredients];
    if (field.startsWith("ingredients.")) {
      if (value === undefined) {
        newIngredients.splice(Number(field.split(".")[1]), 1);
      } else {
        const index = Number(field.split(".")[1]);
        newIngredients[index] = {
          ...newIngredients[index],
          [field.split(".")[2]]: value,
        };
      }
      setSelectedItem({ ...selectedItem, ingredients: newIngredients });
    } else {
      setSelectedItem({ ...selectedItem, [field]: value });
    }
  };

  const changeSelection = async (item: any) => {
    const resp = (await Api.getRecipe(Number(keyExtractor(item)))) as any;
    resp.ingredients = await Api.getIngredients(Number(keyExtractor(item)));
    setSelectedItem(resp);
    setCardRenderKey((prev) => prev + 1);
  };

  const body = loading ? (
    <div className="p-8 text-center">Загрузка...</div>
  ) : error ? (
    <div className="p-8 text-center text-red-600">{error}</div>
  ) : (
    <div className="container mx-auto p-4">
      <div
        className={`grid gap-4 transition-all duration-300 ${
          selectedItem
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}>
        {items.map((item, index) => (
          <Card
            key={Number(keyExtractor?.(item)) + "_" + cardRenderKey}
            card_name={item.name}
            card_description={
              item.description
                ? item.description
                : item.quantity
                ? `${item.quantity} ${item.unit}`
                : item.unit !== undefined
                ? item.unit
                : ""
            }
            redirect_url={
              redirectBasePath
                ? `${redirectBasePath}/${keyExtractor(item)}`
                : undefined
            }
            on_click={
              redirectBasePath ? () => changeSelection(item) : undefined
            }
          />
        ))}
      </div>

      {selectedItem && (
        <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white shadow-lg border-l transform transition-transform duration-300">
          <div className="p-6 h-full overflow-y-auto">
            <div className="mb-6 flex justify-between items-center">
              <button
                onClick={() => setSelectedItem(null)}
                className=" text-gray-500 hover:text-gray-700 text-lg">
                ✕ Закрыть
              </button>
              <button
                onClick={handleSave}
                className="text-gray-500 hover:text-gray-700 text-lg">
                {!editMode ? "✏️" : "Сохранить"}
              </button>
            </div>
            {!editMode ? (
              renderItem(selectedItem, 0)
            ) : (
              <DishCardEdit
                id={(selectedItem as any).id}
                onFieldChange={onFieldChange}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        selectedItem ? "pr-80" : ""
      }`}>
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-black">{headerText}</h1>
        </div>
      </header>
      {body}
    </div>
  );
}
