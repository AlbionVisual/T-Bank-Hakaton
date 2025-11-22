# app.py — ПРАВИЛЬНО
from flask import Flask, jsonify, request
from database.db import init_db,get_db,close_db
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/*": {
    "origins": "http://localhost:3000",
    "methods": ["GET", "POST", "DELETE", "OPTIONS"],
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
    title = data.get("title") or data.get("name")
    if not title:
        return jsonify({"error": "Не указано название рецепта"}), 400
    
    description = data.get("description", "")
    instructions = data.get("instructions", "")

    db = get_db()
    try:
        cursor = db.execute(
            """INSERT INTO recipes (title, description, instructions) 
               VALUES (?, ?, ?)""", (title, description, instructions)
        )
        db.commit()  

        new_recipe_id = cursor.lastrowid  

        return jsonify({
            "message": "Рецепт успешно добавлен",
            "recipe": {
                "id": new_recipe_id,
                "title": title,
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
        "SELECT id, title FROM recipes WHERE id = ?",
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
                "title": recipe["title"]
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

@app.route("/products/<int:product_id>", methods=['GET'])
def get_product(product_id):
    db = get_db()
    product = db.execute(
        "SELECT * FROM products WHERE id = ?",
        (product_id,)
    ).fetchone() 
    if product is None:
        return jsonify({"error": "Продукт не найден"}), 404

    return jsonify(dict(product))

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




if __name__ == "__main__":
    app.run(debug=True)   