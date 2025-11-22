# app.py — ПРАВИЛЬНО
from flask import Flask, jsonify, request
from database.db import init_db,get_db,close_db
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/*": {
    "origins": "http://localhost:3000",
    "methods": ["GET", "POST", "DELETE", "OPTIONS", "PATCH"],
    "allow_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True
}})
#Работа с рецептами 

@app.route("/recipes", methods=['GET'])
def get_recipes():
    
    db = get_db()
    recipes = db.execute("SELECT * FROM recipes").fetchall()
    return jsonify([dict(row) for row in recipes])

@app.route("/recipes/<int:recipe_id>", methods=['GET'])
def get_recipe(recipe_id):
    db = get_db()
    product = db.execute(
        "SELECT * FROM recipes WHERE id = ?",
        (recipe_id,)
    ).fetchone() 
    if product is None:
        return jsonify({"error": "Рецепт не найден"}), 404

    return jsonify(dict(product))


@app.route('/recipes', methods=['POST'])
def add_recipe():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Нет данных в запросе"}), 400
    name = data.get("name") or data.get("name")
    if not name:
        return jsonify({"error": "Не указано название рецепта"}), 400
    
    description = data.get("description", "")
    instructions = data.get("instructions", "")

    db = get_db()
    try:
        cursor = db.execute(
            """INSERT INTO recipes (name, description, instructions) 
               VALUES (?, ?, ?)""", (name, description, instructions)
        )
        db.commit()  

        new_recipe_id = cursor.lastrowid  
        return jsonify({
            "message": "Рецепт успешно добавлен",
            "recipe": {
                "id": new_recipe_id,
                "name": name,
                "description": description,
                "instructions": instructions
            }
        }), 201  

    except Exception as e:
        return jsonify({"error": "Ошибка при добавлении рецепта", "details": str(e)}), 500
    
@app.route('/recipes/<int:recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    db = get_db()
    
    recipe = db.execute(
        "SELECT id, name FROM recipes WHERE id = ?",
        (recipe_id,)
    ).fetchone()
    
    if not recipe:
        return jsonify({"error": "Рецепт не найден"}), 404
    
    try:
        db.execute("DELETE FROM recipes WHERE id = ?", (recipe_id,))
        db.commit()
        return jsonify({
            "message": "Рецепт успешно удалён",
            "deleted_recipe": {
                "id": recipe_id,
                "name": recipe["name"]
            }
        }), 200
        
    except Exception as e:
        db.rollback() 
        return jsonify({
            "error": "Не удалось удалить рецепт",
            "details": str(e)
        }), 500



@app.route("/products", methods=['GET'])
def get_products():
    db = get_db()
    products = db.execute("SELECT * FROM products").fetchall()

    return jsonify([dict(row) for row in products])

@app.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Нет данных в запросе"}), 400
    name = data.get("name")
    if not name:
        return jsonify({"error": "Не указано название продукта"}), 400
    
    unit = data.get("unit", "")

    db = get_db()
    try:
        cursor = db.execute(
            """INSERT INTO products (unit, name) 
               VALUES (?, ?)""", (unit, name)
        )
        db.commit()  

        new_product_id = cursor.lastrowid  

        return jsonify({
            "message": "Продукт успешно добавлен",
            "product": {
                "id": new_product_id,
                "name": name,
                "unit": unit
            }
        }), 201  

    except Exception as e:
        return jsonify({"error": "Ошибка при добавлении продукта", "details": str(e)}), 500


@app.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    db = get_db()
    
    product = db.execute(
        "SELECT id, name FROM products WHERE id = ?",
        (product_id,)
    ).fetchone()
    
    if not product:
        return jsonify({"error": "Продукт не найден"}), 404
    
    try:
        db.execute("DELETE FROM products WHERE id = ?", (product_id,))
        db.commit()
        
        return jsonify({
            "message": "Продукт успешно удалён",
            "deleted_product": {
                "id": product_id,
                "name": product["name"]
            }
        }), 200
        
    except Exception as e:
        db.rollback() 
        return jsonify({
            "error": "Не удалось удалить продукт",
            "details": str(e)
        }), 500

@app.route('/ingredients/<int:recipe_id>', methods=['PATCH'])
def update_ingredient_amount(recipe_id):
    data = request.get_json()

    if not data or 'product_id' not in data or 'amount' not in data:
        return jsonify({"error": "Укажите product_id и amount"}), 400

    product_id = data['product_id']
    new_amount = data['amount']

    if not isinstance(new_amount, (int, float)) or new_amount <= 0:
        return jsonify({"error": "amount должен быть положительным числом"}), 400

    db = get_db()

    recipe = db.execute("SELECT id, name FROM recipes WHERE id = ?", (recipe_id,)).fetchone()
    if not recipe:
        return jsonify({"error": "Рецепт не найден"}), 404

    current = db.execute("""
        SELECT ri.amount, p.name, p.unit
        FROM recipe_ingredients ri
        JOIN products p ON ri.product_id = p.id
        WHERE ri.recipe_id = ? AND ri.product_id = ?
    """, (recipe_id, product_id)).fetchone()

    if not current:
        return jsonify({
            "error": "Этот продукт не используется в данном рецепте"
        }), 404

    try:
        db.execute("""
            UPDATE recipe_ingredients
            SET amount = ?
            WHERE recipe_id = ? AND product_id = ?
        """, (new_amount, recipe_id, product_id))
        db.commit()

        return jsonify({
            "message": "Количество ингредиента обновлено",
            "ingredient": {
                "recipe_id": recipe_id,
                "recipe_name": recipe["name"],
                "product_id": product_id,
                "product_name": current["name"],
                "amount": new_amount,
                "unit": current["unit"]
            }
        }), 200

    except Exception as e:
        db.rollback()
        return jsonify({
            "error": "Ошибка при обновлении ингредиента",
            "details": str(e)
        }), 500
    
    
@app.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Нет данных в запросе"}), 400

    db = get_db()
    product = db.execute(
        "SELECT id, name, unit FROM products WHERE id = ?",
        (product_id,)
    ).fetchone()

    if product is None:
        return jsonify({"error": "Продукт не найден"}), 404

    new_name = data.get("name", product["name"]).strip()
    new_unit = data.get("unit", product["unit"] or "").strip()

    if not new_name:
        return jsonify({"error": "Название продукта не может быть пустым"}), 400
    try:
        db.execute(
            """UPDATE products 
               SET name = ?, unit = ? 
               WHERE id = ?""",
            (new_name, new_unit or None, product_id)
        )
        db.commit()

        return jsonify({
            "message": "Продукт успешно обновлён",
            "product": {
                "id": product_id,
                "name": new_name,
                "unit": new_unit or None
            }
        }), 200

    except Exception as e:
        db.rollback()
        return jsonify({
            "error": "Не удалось обновить продукт",
            "details": str(e)
        }), 500

@app.route('/recipes/<int:recipe_id>/ingredients', methods=['POST'])
def add_ingredient_to_recipe(recipe_id):


    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Нет данных в запросе"}), 400

    product_id = data.get("product_id")
    amount = data.get("amount")

    if not product_id or amount is None:
        return jsonify({"error": "Необходимо указать product_id и amount"}), 400

    db = get_db()
    recipe = db.execute("SELECT id, name FROM recipes WHERE id = ?", (recipe_id,)).fetchone()
    if not recipe:
        return jsonify({"error": "Рецепт не найден"}), 404

    
    product = db.execute("SELECT id, name, unit FROM products WHERE id = ?", (product_id,)).fetchone()
    if not product:
        return jsonify({"error": "Продукт не найден"}), 404


    try:
        db.execute(
            """INSERT INTO recipe_ingredients (recipe_id, product_id, amount)
               VALUES (?, ?, ?)""",
            (recipe_id, product_id, amount)
        )
        db.commit()

        return jsonify({
            "message": "Ингредиент успешно добавлен в рецепт",
            "ingredient": {
                "recipe_id": recipe_id,
                "recipe_name": recipe["name"],
                "product_id": product_id,
                "product_name": product["name"],
                "amount": amount,
                "unit": product["unit"]
            }
        }), 201

    except Exception as e:
        db.rollback()
        return jsonify({
            "error": "Не удалось добавить ингредиент",
            "details": str(e)
        }), 500
    

@app.route("/ingredients/<int:recipe_id>", methods=['GET'])
def get_ingredients(recipe_id):
    db = get_db()
    ingredients = db.execute("""
        SELECT 
            p.id AS product_id,
            p.name AS product_name,
            p.unit AS product_unit,
            ri.amount AS amount
        FROM recipe_ingredients ri
        JOIN products p ON ri.product_id = p.id
        WHERE ri.recipe_id = ?
        ORDER BY p.name
    """, (recipe_id,)).fetchall()
    if ingredients is None:
        return jsonify({"error": "Ингридиенты не найдены"}), 404

    return jsonify([dict(row) for row in ingredients])

@app.route('/recipes/<int:recipe_id>/ingredients/<int:product_id>', methods=['DELETE'])
def remove_ingredient_from_recipe(recipe_id, product_id):

    db = get_db()

    ingredient = db.execute(
        """SELECT ri.amount, p.name, p.unit
           FROM recipe_ingredients ri
           JOIN products p ON ri.product_id = p.id
           WHERE ri.recipe_id = ? AND ri.product_id = ?""",
        (recipe_id, product_id)
    ).fetchone()

    if not ingredient:
        return jsonify({
            "error": "Этот продукт не используется в данном рецепте"
        }), 404

    try:
        db.execute(
            "DELETE FROM recipe_ingredients WHERE recipe_id = ? AND product_id = ?",
            (recipe_id, product_id)
        )
        db.commit()

        return jsonify({
            "message": "Ингредиент успешно удалён из рецепта",
            "removed_ingredient": {
                "recipe_id": recipe_id,
                "product_id": product_id,
                "product_name": ingredient["name"],
                "amount": ingredient["amount"],
                "unit": ingredient["unit"] or "шт"
            }
        }), 200

    except Exception as e:
        db.rollback()
        return jsonify({
            "error": "Не удалось удалить ингредиент",
            "details": str(e)
        }), 500
    
@app.route('/recipes/<int:recipe_id>', methods=['PATCH'])
def update_recipe_with_ingredients(recipe_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "Нет данных"}), 400

    db = get_db()

    recipe = db.execute("SELECT id, name FROM recipes WHERE id = ?", (recipe_id,)).fetchone()
    if not recipe:
        return jsonify({"error": "Рецепт не найден"}), 404

    updates = []
    values = []

    if "name" in data:
        name = data["name"].strip()
        if not name:
            return jsonify({"error": "Название не может быть пустым"}), 400
        updates.append("name = ?")
        values.append(name)

    if "description" in data:
        updates.append("description = ?")
        values.append(data["description"] or "")

    if "instructions" in data:
        updates.append("instructions = ?")
        values.append(data["instructions"] or "")

    if updates:
        values.append(recipe_id)
        db.execute(f"UPDATE recipes SET {', '.join(updates)} WHERE id = ?", tuple(values))

    if "ingredients" in data:
        new_ingredients = data["ingredients"]

        if not isinstance(new_ingredients, list):
            return jsonify({"error": "ingredients должен быть массивом"}), 400

        for ing in new_ingredients:
            if not isinstance(ing, dict) or "product_id" not in ing or "amount" not in ing:
                return jsonify({"error": "Каждый ингредиент должен содержать product_id и amount"}), 400
            if not isinstance(ing["amount"], (int, float)) or ing["amount"] <= 0:
                return jsonify({"error": "amount должен быть положительным числом"}), 400

        try:
            current = db.execute(
                "SELECT product_id, amount FROM recipe_ingredients WHERE recipe_id = ?",
                (recipe_id,)
            ).fetchall()
            current_dict = {row["product_id"]: row["amount"] for row in current}

            new_dict = {ing["product_id"]: ing["amount"] for ing in new_ingredients}

            for product_id, amount in new_dict.items():
                if product_id in current_dict:
                    db.execute(
                        "UPDATE recipe_ingredients SET amount = ? WHERE recipe_id = ? AND product_id = ?",
                        (amount, recipe_id, product_id)
                    )
                else:
                    db.execute(
                        "INSERT INTO recipe_ingredients (recipe_id, product_id, amount) VALUES (?, ?, ?)",
                        (recipe_id, product_id, amount)
                    )

            for product_id in current_dict.keys() - new_dict.keys():
                db.execute(
                    "DELETE FROM recipe_ingredients WHERE recipe_id = ? AND product_id = ?",
                    (recipe_id, product_id)
                )

        except Exception as e:
            db.rollback()
            return jsonify({"error": "Ошибка при обновлении ингредиентов", "details": str(e)}), 500

    db.commit()

    updated_recipe = db.execute("SELECT * FROM recipes WHERE id = ?", (recipe_id,)).fetchone()
    ingredients = db.execute("""
        SELECT p.id AS product_id, p.name AS product_name, p.unit, ri.amount
        FROM recipe_ingredients ri
        JOIN products p ON ri.product_id = p.id
        WHERE ri.recipe_id = ?
    """, (recipe_id,)).fetchall()

    return jsonify({
        "message": "Рецепт и ингредиенты успешно обновлены",
        "recipe": dict(updated_recipe),
        "ingredients": [dict(row) for row in ingredients]
    }), 200


@app.route('/menus', methods=['GET'])
def get_recipes_in_menu():
    db = get_db()

    recipes = db.execute("""
        SELECT 
            r.id,
            r.name,
            r.description,
            r.instructions
        FROM recipes r
        LEFT JOIN menu_recipes mr ON r.id = mr.recipe_id
        WHERE mr.menu_id = 1
        ORDER BY r.name
    """).fetchall()

    return jsonify([dict(row) for row in recipes])


@app.route('/menus/<int:recipe_id>', methods=['POST'])
def add_recipe_to_menu(recipe_id):
    db = get_db()
 
    recipe = db.execute("SELECT id, name FROM recipes WHERE id = ?", (recipe_id,)).fetchone()
    if not recipe:
        return jsonify({"error": "Рецепт не найден"}), 404

    try:
        db.execute(
            "INSERT INTO menu_recipes (menu_id, recipe_id) VALUES (?, ?)",
            (1, recipe_id)
        )
        db.commit()

        return jsonify({
            "message": "Рецепт успешно добавлен в меню",
            "added": {
                "recipe_id": recipe_id,
                "recipe_name": recipe["name"]
            }
        }), 201

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/menus/<int:recipe_id>', methods=['DELETE'])
def remove_recipe_from_menu(recipe_id):
    db = get_db()

    link = db.execute(
        """SELECT r.name 
           FROM menu_recipes mr
           JOIN recipes r ON mr.recipe_id = r.id
           WHERE mr.menu_id = 1 AND mr.recipe_id = ?""",
        (recipe_id)
    ).fetchone()

    if not link:
        return jsonify({"error": "Рецепт не найден в этом меню"}), 404

    try:
        db.execute(
            "DELETE FROM menu_recipes WHERE menu_id = 1 AND recipe_id = ?",
            (recipe_id)
        )
        db.commit()

        return jsonify({
            "message": "Рецепт успешно удалён из меню",
            "removed": {
                "recipe_id": recipe_id,
                "recipe_name": link["name"]
            }
        }), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/inventory', methods=['GET'])

def get_inventory():

    db = get_db()

    products = db.execute("""
        SELECT 
            p.id,
            p.name,
            p.unit,
            i.quantity
        FROM products p
        LEFT JOIN inventory i ON p.id = i.product_id
        ORDER BY p.name
    """).fetchall()

    return jsonify([dict(row) for row in products])


@app.route('/inventory', methods=['POST'])
def add_to_inventory():
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Нет данных в запросе"}), 400

    product_id = data.get("product_id")
    quantity = data.get("quantity")

    if not product_id or quantity is None:
        return jsonify({"error": "Укажите product_id и quantity"}), 400

    if not isinstance(quantity, (int, float)) or quantity < 0:
        return jsonify({"error": "quantity должно быть неотрицательным числом"}), 400

    db = get_db()

    product = db.execute(
        "SELECT id, name, unit FROM products WHERE id = ?", 
        (product_id,)
    ).fetchone()

    if not product:
        return jsonify({"error": "Продукт с таким ID не найден"}), 404

    exists = db.execute(
        "SELECT quantity FROM inventory WHERE product_id = ?", 
        (product_id,)
    ).fetchone()

    if exists:
        return jsonify({
            "error": "Продукт уже есть в инвентаре. Используйте PATCH или PUT для обновления"
        }), 409

    try:
        db.execute(
            "INSERT INTO inventory (product_id, quantity) VALUES (?, ?)",
            (product_id, quantity)
        )
        db.commit()

        return jsonify({
            "message": "Продукт успешно добавлен в инвентарь",
            "inventory_item": {
                "product_id": product_id,
                "product_name": product["name"],
                "quantity": quantity,
                "unit": product["unit"]
            }
        }), 201

    except Exception as e:
        db.rollback()
        return jsonify({"error": "Ошибка при добавлении", "details": str(e)}), 500


@app.route('/inventory/<int:product_id>', methods=['PUT'])
def update_inventory(product_id):
    data = request.get_json()

    if not data or 'quantity' not in data:
        return jsonify({"error": "Поле 'quantity' обязательно"}), 400

    quantity = data['quantity']
    if not isinstance(quantity, (int, float)) or quantity < 0:
        return jsonify({"error": "quantity должно быть неотрицательным числом"}), 400

    db = get_db()


    product = db.execute(
        "SELECT id, name, unit FROM products WHERE id = ?", 
        (product_id,)
    ).fetchone()

    if not product:
        return jsonify({"error": "Продукт не найден"}), 404

    try:

        result = db.execute(
            "UPDATE inventory SET quantity = ? WHERE product_id = ?",
            (quantity, product_id)
        )

        if result.rowcount == 0:
            db.execute(
                "INSERT INTO inventory (product_id, quantity) VALUES (?, ?)",
                (product_id, quantity)
            )
        else:
            pass

        db.commit()

        return jsonify({
            "message": "Инвентарь успешно обновлён",
            "product": {
                "id": product_id,
                "name": product["name"],
                "unit": product["unit"],
                "quantity": quantity
            }
        }), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": "Ошибка базы данных", "details": str(e)}), 500


@app.route('/inventory/<int:product_id>', methods=['DELETE'])
def remove_from_inventory(product_id):
    db = get_db()

    product = db.execute("SELECT name FROM products WHERE id = ?", (product_id,)).fetchone()
    if not product:
        return jsonify({"error": "Продукт не найден"}), 404

    try:
        result = db.execute("DELETE FROM inventory WHERE product_id = ?", (product_id,))
        db.commit()

        if result.rowcount == 0:
            return jsonify({"message": "Продукта и так не было в инвентаре"}), 200

        return jsonify({
            "message": "Продукт удалён из инвентаря",
            "removed": {
                "product_id": product_id,
                "product_name": product["name"]
            }
        }), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/shoplist', methods=['POST'])
def shopping_list():
    data = request.get_json()
    recipe_ids = data["recipes"]

    if not recipe_ids:
        return jsonify({"error": "Укажите recipe_ids"}), 400
    
    if not recipe_ids:
        return []

    db = get_db()

    placeholders = ",".join("?" for _ in recipe_ids)
    required_query = f"""
        SELECT 
            p.id AS product_id,
            p.name AS product_name,
            p.unit AS unit,
            SUM(ri.amount) AS total_required
        FROM recipe_ingredients ri
        JOIN products p ON ri.product_id = p.id
        WHERE ri.recipe_id IN ({placeholders})
        GROUP BY p.id, p.name, p.unit
    """

    required = db.execute(required_query, recipe_ids).fetchall()

    if not required:
        return []

    product_ids = [row["product_id"] for row in required]
    placeholders = ",".join("?" for _ in product_ids)

    stock_query = f"""
        SELECT product_id, quantity AS in_stock
        FROM inventory
        WHERE product_id IN ({placeholders})
    """
    stock_rows = db.execute(stock_query, product_ids).fetchall()
    stock_dict = {row["product_id"]: row["in_stock"] for row in stock_rows}

    shopping_list = []
    for row in required:
        product_id = row["product_id"]
        needed = row["total_required"]
        have = stock_dict.get(product_id, 0) or 0
        to_buy = max(0, needed - have)

        if to_buy > 0:
            shopping_list.append({
                "product_id": product_id,
                "product_name": row["product_name"],
                "unit": row["unit"],
                "required": needed,
                "in_stock": have,
                "to_buy": to_buy
            })
    
    shopping_list.sort(key=lambda x: x["product_name"]) 

    return jsonify({
        "message": f"Нужно докупить {len(shopping_list)} продуктов",
        "to_buy": shopping_list
    })

if __name__ == "__main__":
    app.run(debug=True)   