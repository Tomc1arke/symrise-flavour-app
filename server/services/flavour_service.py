from db import get_db_connection


def get_flavors(role=None, user_id=None):
    conn = get_db_connection()

    query = """
        SELECT 
            f.id,
            f.name,
            f.label,
            f.description,
            f.created_by_id,
            f.approved_by_id,
            f.state,
            f.version,
            f.created_at,
            creator.first_name || ' ' || creator.last_name AS created_by_name,
            approver.first_name || ' ' || approver.last_name AS approved_by_name
        FROM flavor f
        LEFT JOIN user creator ON f.created_by_id = creator.id
        LEFT JOIN user approver ON f.approved_by_id = approver.id
    """

    params = []

    if role == "customer" and user_id:
        query += " WHERE f.created_by_id = ?"
        params.append(user_id)

    elif role == "flavorist":
        query += " WHERE f.state = 'submitted'"

    query += " ORDER BY f.created_at DESC, f.version DESC"

    rows = conn.execute(query, params).fetchall()
    conn.close()

    return [dict(row) for row in rows]


def get_flavor_by_id(flavor_id):
    conn = get_db_connection()

    flavor = conn.execute("""
        SELECT 
            f.id,
            f.name,
            f.label,
            f.description,
            f.created_by_id,
            f.approved_by_id,
            f.state,
            f.version,
            f.created_at,
            creator.first_name || ' ' || creator.last_name AS created_by_name,
            approver.first_name || ' ' || approver.last_name AS approved_by_name
        FROM flavor f
        LEFT JOIN user creator ON f.created_by_id = creator.id
        LEFT JOIN user approver ON f.approved_by_id = approver.id
        WHERE f.id = ?
    """, (flavor_id,)).fetchone()

    if flavor is None:
        conn.close()
        return None

    ingredients = conn.execute("""
        SELECT 
            fim.id,
            fim.flavor_id,
            fim.ingredient_id,
            fim.percent,
            i.name,
            i.label,
            i.description,
            i.price_per_unit,
            i.price_unit
        FROM flavor_ingredient_map fim
        JOIN ingredient i ON fim.ingredient_id = i.id
        WHERE fim.flavor_id = ?
        ORDER BY i.name
    """, (flavor_id,)).fetchall()

    conn.close()

    flavor_dict = dict(flavor)
    flavor_dict["ingredients"] = [dict(row) for row in ingredients]

    return flavor_dict