def validate_flavor_ingredients(ingredients):
    """
    Validates ingredient composition rules:
    - must have 1 to 5 ingredients
    - no duplicate ingredients
    - each percent must be greater than 0
    - each percent must be in increments of 0.05
    - total percent must equal 1.0
    """

    errors = []

    if not ingredients:
        errors.append("A flavor must contain at least one ingredient.")
        return errors

    if len(ingredients) > 5:
        errors.append("A flavor can contain a maximum of 5 ingredients.")

    ingredient_ids = []

    total_percent = 0

    for ingredient in ingredients:
        ingredient_id = ingredient.get("ingredientId")
        percent = ingredient.get("percent")

        if ingredient_id is None:
            errors.append("Each ingredient must include an ingredientId.")
            continue

        if percent is None:
            errors.append("Each ingredient must include a percent value.")
            continue

        ingredient_ids.append(ingredient_id)

        try:
            percent = float(percent)
        except ValueError:
            errors.append("Ingredient percent values must be numbers.")
            continue

        if percent <= 0:
            errors.append("Ingredient percent values must be greater than 0.")

        # Convert to percentage points to avoid floating point precision issues.
        # 0.05 becomes 5, 0.30 becomes 30, etc.
        percent_as_whole_number = round(percent * 100)

        if percent_as_whole_number % 5 != 0:
            errors.append("Ingredient percentages must be in increments of 0.05.")

        total_percent += percent

    if len(ingredient_ids) != len(set(ingredient_ids)):
        errors.append("Duplicate ingredients are not allowed in the same flavor.")

    if round(total_percent * 100) != 100:
        errors.append("Ingredient percentages must total 1.0.")

    return errors