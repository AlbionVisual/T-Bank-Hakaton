import sqlite3
from flask import g

DB_PATH = "OurTeamDB.db"

def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db(e=None):
    db = g.pop("db", None)
    if db:
        db.close()

def init_db():
    db = sqlite3.connect(DB_PATH)
    with open("app/database/migrations.sql", "r", encoding="utf-8") as f:
        db.executescript(f.read())
    db.close()
