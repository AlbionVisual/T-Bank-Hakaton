class Api {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // если потом добавишь авторизацию
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || error.message || "Ошибка сервера");
    }

    if (response.status === 204) return {} as T;
    return response.json();
  }

  // === РЕЦЕПТЫ ===
  getRecipes() {
    return this.request<
      { id: number; title: string; description: string; instructions: string }[]
    >("/recipes");
  }

  getRecipe(id: number) {
    return this.request<{
      id: number;
      title: string;
      description: string;
      instructions: string;
    }>("/recipes/" + id);
  }

  createRecipe(data: {
    title: string;
    description?: string;
    instructions?: string;
  }) {
    return this.request<{ message: string; recipe: any }>("/recipes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateRecipe(
    id: number,
    data: {
      title?: string;
      description?: string;
      instructions?: string;
    }
  ) {
    return this.request<{
      message: string;
      recipe: {
        id: number;
        title: string;
        description: string;
        instructions: string;
      };
    }>(`/recipes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  deleteRecipe(id: number) {
    return this.request<{
      message: string;
      deleted_recipe: { id: number; title: string };
    }>("/recipes/" + id, {
      method: "DELETE",
    });
  }

  // === ПРОДУКТЫ ===
  getProducts() {
    return this.request<{ id: number; name: string; unit: string }[]>(
      "/products"
    );
  }

  createProduct(data: { name: string; unit?: string }) {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

updateProduct(id: number, data: { name?: string; unit?: string }) {
    return this.request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteProduct(id: number) {
    return this.request("/products/" + id, { method: "DELETE" });
  }

  // === ИНГРЕДИЕНТЫ ===
  getIngredients(recipeId: number) {
    return this.request<
      {
        product_id: number;
        product_name: string;
        product_unit: string;
        amount: number;
      }[]
    >(`/ingredients/${recipeId}`);
  }

  addIngredientToRecipe(
    recipeId: number,
    productId: number,
    amount: number
  ) {
    return this.request<{
      message: string;
      ingredient: {
        recipe_id: number;
        product_id: number;
        product_name: string;
        amount: number;
        unit: string;
      };
    }>(`/recipes/${recipeId}/ingredients`, {
      method: "POST",
      body: JSON.stringify({ product_id: productId, amount }),
    });
  }

  removeIngredientFromRecipe(recipeId: number, productId: number) {
    return this.request<{
      message: string;
      removed_ingredient: {
        product_name: string;
        amount: number;
      };
    }>(`/recipes/${recipeId}/ingredients/${productId}`, {
      method: "DELETE",
    });
  }

  // ==================== МЕНЮ ====================
  getRecipesByMenu() {
    return this.request<
      {
        id: number;
        name: string;
        description: string;
        instructions: string;
      }[]
    >(`/menus`);
  }

addRecipeToMenu(recipeId: number) {
    return this.request<{
      message: string;
      added: {recipe_id: number; recipe_name: string };
    }>(`/menus/${recipeId}`, {
      method: "POST",
    });
  }

  removeRecipeFromMenu(recipeId: number) {
    return this.request<{
      message: string;
      removed: {recipe_id: number; recipe_name: string };
    }>(`/menus/${recipeId}`, {
      method: "DELETE",
    });
  }

  // ==================== ИНВЕНТАРЬ ====================
  
  getInventory() {
    return this.request<
      {
        id: number;
        name: string;
        unit: string | null;
        quantity: number | null;
      }[]
    >("/inventory");
  }

  addToInventory(productId: number, quantity: number) {
    if (quantity <= 0) throw new Error("Количество должно быть больше 0");

    return this.request<{
      message: string;
      inventory_item: {
        product_id: number;
        product_name: string;
        quantity: number;
        unit: string | null;
      };
    }>("/inventory", {
      method: "POST",
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  updateInventory(productId: number, quantity: number) {
    if (quantity < 0) throw new Error("Количество не может быть отрицательным");
    return this.request<{
      message: string;
      inventory: { product_id: number; product_name: string; quantity: number; unit: string | null };
    }>(`/inventory/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
  }

  removeFromInventory(productId: number) {
    return this.request<{
      message: string;
      removed: { product_id: number; product_name: string };
    }>(`/inventory/${productId}`, {
      method: "DELETE",
    });
  }
}

const api = new Api();
export default api;
