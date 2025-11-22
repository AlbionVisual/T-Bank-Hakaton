# app.py — ПРАВИЛЬНО
from flask import Flask
from database.db import init_db,get_db,close_db

app = Flask(__name__)

# Инициализация БД при старте
with app.app_context():
    init_db()

@app.route("/")
def index():
    
    db = get_db()
    recipes = db.execute("SELECT * FROM recipes").fetchall()
    return f"Найдено рецептов: {len(recipes)}"

if __name__ == "__main__":

    app.run(debug=True)   