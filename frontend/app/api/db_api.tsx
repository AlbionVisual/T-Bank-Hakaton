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

    // Для DELETE и POST иногда бэкенд ничего не возвращает (204)
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
}

const api = new Api();
export default api;
