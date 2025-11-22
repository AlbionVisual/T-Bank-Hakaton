from flask import *
from app.database.db import init_db
# from app.routes.recipes import recipes_bp
# from app.routes.menu import menu_bp
# from app.routes.stock import stock_bp
# from app.routes.shopping_list import shopping_bp


def create_app():
    app = Flask(__name__)

    init_db()

    # app.register_blueprint(recipes_bp, url_prefix="/recipes")
    # app.register_blueprint(menu_bp, url_prefix="/menu")
    # app.register_blueprint(stock_bp, url_prefix="/stock")
    # app.register_blueprint(shopping_bp, url_prefix="/shopping-list")

    return app
