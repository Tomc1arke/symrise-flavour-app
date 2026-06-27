from flask import Blueprint, jsonify, request
from services.flavour_service import get_flavors, get_flavor_by_id

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