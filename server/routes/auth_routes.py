from flask import Blueprint, request, jsonify
from db import get_db_connection
import hashlib

auth_routes = Blueprint("auth_routes", __name__)


def hash_password(password):
    """
    Hashes the plain text password using MD5 to match the provided sample database.
    Note: MD5 is not recommended for production authentication, but is used here
    because the provided assessment database stores passwords this way.
    """
    return hashlib.md5(password.encode()).hexdigest()


@auth_routes.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    login_value = data.get("login")
    password = data.get("password")

    if not login_value or not password:
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
    """, (login_value,)).fetchone()

    conn.close()

    if user is None:
        return jsonify({"error": "Invalid login details"}), 401

    entered_password_hash = hash_password(password)

    if entered_password_hash != user["password_hash"]:
        return jsonify({"error": "Invalid login details"}), 401

    return jsonify({
        "id": user["id"],
        "firstName": user["first_name"],
        "lastName": user["last_name"],
        "login": user["login"],
        "role": user["role"]
    }), 200