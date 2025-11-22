# app/database/db.py
import sqlite3
import os
from flask import current_app, g

# Путь к БД — относительно корня проекта
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, "..", "..", "OurTeamDB.db")  # или где у тебя лежит

def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()

def init_db():
    """Создаёт таблицы из migrations.sql (один раз при первом запуске)"""
    db = sqlite3.connect(DB_PATH)
    db.executescript("PRAGMA foreign_keys = ON;")  # включаем внешние ключи

    try:
        # Правильный путь к файлу миграций
        migrations_path = os.path.join(BASE_DIR, "migrations.sql")
        
        with open(migrations_path, "r", encoding="utf-8") as f:
            sql_script = f.read()
        
        db.executescript(sql_script)
        db.commit()  # ← ЭТО ОБЯЗАТЕЛЬНО!
        print("База данных успешно инициализирована!")
    
    except sqlite3.Error as e:
        print(f"Ошибка при создании таблиц: {e}")
        db.rollback()
    finally:
        db.close()