from flask import Blueprint, request, jsonify
from db import get_db_connection

auth_routes = Blueprint("auth_routes", __name__)


@auth_routes.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    login = data.get("login")
    password = data.get("password")

    if not login or not password:
        return jsonify({"error": "Login and password are required"}), 400

    conn = get_db_connection()

    user = conn.execute("""
        SELECT 
            u.id,
            u.first_name,
            u.last_name,
            u.login,
            u.password_hash,
            ur.name AS role
        FROM user u
        JOIN user_role_map urm ON u.id = urm.user_id
        JOIN user_role ur ON urm.user_role_id = ur.id
        WHERE u.login = ?
    """, (login,)).fetchone()

    conn.close()

    if user is None:
        return jsonify({"error": "Invalid login details"}), 401

    # Simple check for assessment purposes.
    # Later, this can be replaced with proper password hashing if needed.
    if password != user["password_hash"]:
        return jsonify({"error": "Invalid login details"}), 401

    return jsonify({
        "id": user["id"],
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "login": user["login"],
        "role": user["role"]
    }), 200