from flask import Blueprint, jsonify, request
from services.flavour_service import get_flavors, get_flavor_by_id, create_flavor
from services.validation_service import validate_flavor_ingredients

flavour_routes = Blueprint("flavour_routes", __name__)


@flavour_routes.route("/api/flavors", methods=["GET"])
def list_flavors():
    role = request.args.get("role")
    user_id = request.args.get("userId")

    flavors = get_flavors(role=role, user_id=user_id)

    return jsonify(flavors), 200


@flavour_routes.route("/api/flavors/<int:flavor_id>", methods=["GET"])
def flavor_detail(flavor_id):
    flavor = get_flavor_by_id(flavor_id)

    if flavor is None:
        return jsonify({"error": "Flavor not found"}), 404

    return jsonify(flavor), 200

@flavour_routes.route("/api/flavors", methods=["POST"])
def create_new_flavor():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    required_fields = ["name", "createdById", "ingredients"]

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    validation_errors = validate_flavor_ingredients(data["ingredients"])

    if validation_errors:
        return jsonify({"errors": validation_errors}), 400

    try:
        flavor = create_flavor(data)
        return jsonify(flavor), 201

    except Exception as error:
        return jsonify({
            "error": "Failed to create flavor",
            "details": str(error)
        }), 500