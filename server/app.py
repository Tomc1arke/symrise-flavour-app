from flask import Flask, jsonify
from flask_cors import CORS

from routes.ingredient_routes import ingredient_routes


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(ingredient_routes)

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({"status": "ok"}), 200

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)