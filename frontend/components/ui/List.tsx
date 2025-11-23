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
  refreshKey = 0,
}: {
  url: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  redirectBasePath?: string;
  headerText?: string;
  refreshKey?: number;
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
  }, [url, refreshKey]);

  const handleSave = async () => {
    if (selectedItem) {
      if (editMode) {
        setEditMode(false);
        const products_before = await Api.getProducts();
        const ingredients = selectedItem.ingredients
          .map((ingredient: any) => ({
            product_name: ingredient.product_name,
            product_unit: ingredient.product_unit,
            amount:
              ingredient.amount !== undefined ? Number(ingredient.amount) : 1,
            product_id: products_before.find(
              (i: any) => i.name === ingredient.product_name
            )?.id,
          }))
          .filter(
            (ingredient: any) =>
              ingredient.product_name !== undefined &&
              ingredient.amount !== undefined
          );
        console.log(selectedItem.id, {
          name: selectedItem.title,
          description: selectedItem.description,
          instructions: selectedItem.instructions,
          ingredients: ingredients,
        });
        await Api.updateRecipeFull(selectedItem.id, {
          name: selectedItem.title,
          description: selectedItem.description,
          instructions: selectedItem.instructions,
          ingredients: ingredients,
        });
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
  const onDelete = async (id: number) => {
    if (url === "recipes") {
      await Api.deleteRecipe(id);
      setItems((prev) => prev.filter((item) => keyExtractor(item) !== id));
    } else if (url === "products") {
      await Api.deleteProduct(id);
      setItems((prev) => prev.filter((item) => keyExtractor(item) !== id));
    } else if (url === "inventory") {
      await Api.removeFromInventory(id);
      setItems((prev) => prev.filter((item) => keyExtractor(item) !== id));
    } else if (url === "menus") {
      await Api.removeRecipeFromMenu(id);
      setItems((prev) => prev.filter((item) => keyExtractor(item) !== id));
    }
  };
  const onUpdate = async (id: number, name: string, description: string) => {
    try {
      if (url === "products") {
        const item = items.find((item) => Number(keyExtractor(item)) === id);
        if (item) {
          await Api.updateProduct(id, {
            name: name,
            unit: description,
          });
          setItems((prev) =>
            prev.map((item) =>
              Number(keyExtractor(item)) === id
                ? { ...item, name: name, unit: description }
                : item
            )
          );
          console.log(id, name, description, item);
        }
      } else if (url === "inventory") {
        const item = items.find((item) => Number(keyExtractor(item)) === id);
        if (item) {
          const quantity = Number(description) || 0;
          await Api.updateInventory(id, quantity);
          setItems((prev) =>
            prev.map((item) => {
              if (Number(keyExtractor(item)) === id) {
                return { ...item, name, quantity: quantity };
              }
              return item;
            })
          );
        }
      }
      setCardRenderKey((prev) => prev + 1);
    } catch (error) {
      console.error("Ошибка при обновлении:", error);
    }
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
              url === "recipes" || url === "menus"
                ? item.description
                : url === "inventory"
                ? item.quantity || 0
                : item.unit
            }
            persistent_description={
              url === "recipes" || url === "menus"
                ? ""
                : url === "inventory"
                ? item.unit
                : ""
            }
            on_name_update={() => {}}
            on_description_update={() => {}}
            on_delete={() => onDelete(item.id)}
            on_update={(name, description) =>
              onUpdate(item.id, name, description)
            }
            redirect_url={
              redirectBasePath
                ? `${redirectBasePath}/${keyExtractor(item)}`
                : undefined
            }
            on_click={
              redirectBasePath ? () => changeSelection(item) : undefined
            }
            do_update={url !== "recipes" && url !== "menus"}
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
      className={`transition-all duration-300 ${selectedItem ? "pr-80" : ""}`}>
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-black">{headerText}</h1>
        </div>
      </header>
      {body}
    </div>
  );
}
