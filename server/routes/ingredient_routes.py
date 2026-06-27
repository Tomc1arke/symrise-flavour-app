from flask import Blueprint, jsonify
from db import get_db_connection

ingredient_routes = Blueprint("ingredient_routes", __name__)


@ingredient_routes.route("/api/ingredients", methods=["GET"])
def get_ingredients():
    conn = get_db_connection()

    ingredients = conn.execute("""
        SELECT 
            id,
            name,
            label,
            description,
            price_per_unit,
            price_unit
        FROM ingredient
        ORDER BY name
    """).fetchall()

    conn.close()

    return jsonify([dict(row) for row in ingredients]), 200