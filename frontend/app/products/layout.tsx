"use client";
import { Dialog } from "@/components/ui/Dialog";
import { ListItems } from "@/components/ui/List";
import { PlusButton } from "@/components/ui/PlusButton";
import { useEffect, useState } from "react";
import Api from "../api/db_api";

interface Product {
  id: number;
  name: string;
  unit: string;
}

export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showDialog, setShowDialog] = useState(false);
  const [productName, setProductName] = useState("");
  const [productUnit, setProductUnit] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [acceptationDisabled, setAcceptationDisabled] = useState(false);
  useEffect(() => {
    Api.getProducts().then((products) => {
      setProducts(products as Product[]);
    });
  }, []);

  const handleAdd = async () => {
    await Api.createProduct({ name: productName, unit: productUnit });
    setShowDialog(false);
    setProductName("");
    setProductUnit("");
    setRefreshKey((prev) => prev + 1);
  };

  const handleCancel = () => {
    setShowDialog(false);
    setProductName("");
    setProductUnit("");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value);
    if (products.find((product) => product.name === e.target.value))
      setAcceptationDisabled(true);
    else setAcceptationDisabled(false);
  };

  return (
    <>
      <ListItems
        url="products"
        renderItem={(item, index) => children}
        keyExtractor={(item: any) => item.id.toString()}
        headerText="Продукты"
        refreshKey={refreshKey}
        description="Тут все продукты, которые только могут использоваться в приложении"
      />
      <PlusButton
        onClick={() => {
          setShowDialog(true);
        }}
      />
      {showDialog && (
        <Dialog
          on_add={handleAdd}
          on_cancel={handleCancel}
          disabled={acceptationDisabled}>
          <div className="h-full w-full flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-white border-b-2 border-yellow-300 mb-8">
              Добавить продукт
            </h1>
            <input
              type="text"
              className="w-7/8 p-2 rounded-md bg-white mb-4"
              placeholder="Название продукта"
              value={productName}
              onChange={handleNameChange}
            />
            <input
              type="text"
              className="w-7/8 p-2 rounded-md bg-white"
              placeholder="Единица измерения"
              value={productUnit}
              onChange={(e) => setProductUnit(e.target.value)}
            />
          </div>
        </Dialog>
      )}
    </>
  );
}
