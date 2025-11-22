"use client";
import { useState, useEffect } from "react";
import { Card } from "./Card";

interface Recipe {
  id: number;
  title: string;
  description: string;
}

export function ListItems<
  T extends {
    name: string;
    description: string | null;
    quantity: number | null;
    unit: string | null;
    id: number;
  }
>({
  url,
  renderItem,
  keyExtractor,
  redirectBasePath,
}: {
  url: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  redirectBasePath?: string;
}) {
  const [items, setItems] = useState<T[]>([]);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON");
        }
        const data = await response.json();
        setItems(data);
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

  const body = loading ? (
    <div className="p-8 text-center">Загрузка...</div>
  ) : error ? (
    <div className="p-8 text-center text-red-600">{error}</div>
  ) : (
    <div
      className={`container mx-auto p-4 transition-all duration-300 ${
        selectedItem ? "mr-80" : ""
      }`}>
      {/* Грид который становится меньше */}
      <div
        className={`grid gap-4 transition-all duration-300 ${
          selectedItem
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}>
        {items.map((item, index) => (
          <Card
            key={keyExtractor?.(item)}
            card_name={item.name}
            card_description={
              item.description ??
              (item.quantity ? `${item.quantity} ${item.unit}` : "")
            }
            redirect_url={
              redirectBasePath
                ? `${redirectBasePath}/${keyExtractor(item)}`
                : url + keyExtractor?.(item)
            }
            on_click={() => setSelectedItem(item)}
          />
        ))}
      </div>

      {/* Правая панель */}
      {selectedItem && (
        <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white shadow-lg border-l transform transition-transform duration-300">
          <div className="p-6 h-full overflow-y-auto">
            <button
              onClick={() => setSelectedItem(null)}
              className="mb-6 text-gray-500 hover:text-gray-700 text-lg">
              ✕ Закрыть
            </button>
            {renderItem(selectedItem, 0)}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-black"> Меню</h1>
        </div>
      </header>
      {body}
    </div>
  );
}
