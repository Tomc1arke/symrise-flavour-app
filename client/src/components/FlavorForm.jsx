import React, { useEffect, useState } from "react";
import { getIngredients } from "../api/ingredientApi";
import { createFlavor, reviseFlavor } from "../api/flavourApi";

function FlavorForm({
  user,
  onFlavorCreated,
  onCancel,
  initialFlavor = null,
  mode = "create",
}) {
  const [ingredients, setIngredients] = useState([]);

  const [name, setName] = useState(initialFlavor?.name || "");
  const [label, setLabel] = useState(initialFlavor?.label || "");
  const [description, setDescription] = useState(initialFlavor?.description || "");
  const [selectedIngredients, setSelectedIngredients] = useState(
    initialFlavor?.ingredients?.length
      ? initialFlavor.ingredients.map((ingredient) => ({
          ingredientId: ingredient.ingredient_id,
          percent: ingredient.percent,
        }))
      : [{ ingredientId: "", percent: 0.2 }]
    );
  
  const [error, setError] = useState("");
  const [loadingIngredients, setLoadingIngredients] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadIngredients() {
      try {
        const data = await getIngredients();
        setIngredients(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingIngredients(false);
      }
    }

    loadIngredients();
  }, []);

  const totalPercent = selectedIngredients.reduce((total, item) => {
    return total + Number(item.percent || 0);
  }, 0);

  function updateIngredient(index, field, value) {
    const updated = [...selectedIngredients];
    updated[index] = {
      ...updated[index],
      [field]: field === "percent" ? Number(value) : value,
    };

    setSelectedIngredients(updated);
  }

  function addIngredientRow() {
    if (selectedIngredients.length >= 5) {
      setError("A flavor can contain a maximum of 5 ingredients.");
      return;
    }

    setSelectedIngredients([
      ...selectedIngredients,
      { ingredientId: "", percent: 0.2 },
    ]);
  }

  function removeIngredientRow(index) {
    setSelectedIngredients(
      selectedIngredients.filter((_, currentIndex) => currentIndex !== index)
    );
  }

  function validateForm() {
    if (!name.trim()) {
      return "Flavor name is required.";
    }

    if (selectedIngredients.length === 0) {
      return "At least one ingredient is required.";
    }

    const ingredientIds = selectedIngredients.map((item) => item.ingredientId);

    if (ingredientIds.some((id) => !id)) {
      return "Please select an ingredient for every row.";
    }

    if (new Set(ingredientIds).size !== ingredientIds.length) {
      return "Duplicate ingredients are not allowed.";
    }

    for (const item of selectedIngredients) {
      const percent = Number(item.percent);

      if (percent <= 0) {
        return "Ingredient percentages must be greater than 0.";
      }

      if (Math.round(percent * 100) % 5 !== 0) {
        return "Ingredient percentages must be in increments of 0.05.";
      }
    }

    if (Math.round(totalPercent * 100) !== 100) {
      return "Ingredient percentages must total 1.0.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const flavorData = {
      name: name.trim(),
      label: label.trim(),
      description: description.trim(),
      createdById: user.id,
      ingredients: selectedIngredients.map((item) => ({
        ingredientId: Number(item.ingredientId),
        percent: Number(item.percent),
      })),
    };

    try {
      setSubmitting(true);

      if (mode === "revise" && initialFlavor) {
        await reviseFlavor(initialFlavor.id, flavorData);
      } else {
        await createFlavor(flavorData);
      }

      onFlavorCreated();
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>{mode === "revise" ? "Revise Flavor" : "Create New Flavor"}</h2>
        <button type="button" className="secondary-button" onClick={onCancel}>
          Cancel
        </button>
      </div>

      {loadingIngredients ? (
        <p>Loading ingredients...</p>
      ) : (
        <form className="flavor-form" onSubmit={handleSubmit}>
          <label>
            Flavor Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Cool Mint Blast"
            />
          </label>

          <label>
            Label
            <input
              type="text"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="e.g. Cool Mint"
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the flavor profile..."
            />
          </label>

          <div>
            <div className="panel-header">
              <h3>Ingredients</h3>
              <button
                type="button"
                className="secondary-button"
                onClick={addIngredientRow}
              >
                Add Ingredient
              </button>
            </div>

            <p className="hint">
              Choose up to 5 ingredients. Percentages must use 0.05 increments
              and total 1.0.
            </p>

            {selectedIngredients.map((item, index) => (
              <div className="ingredient-row" key={index}>
                <select
                  value={item.ingredientId}
                  onChange={(event) =>
                    updateIngredient(index, "ingredientId", event.target.value)
                  }
                >
                  <option value="">Select ingredient</option>
                  {ingredients.map((ingredient) => (
                    <option key={ingredient.id} value={ingredient.id}>
                      {ingredient.label} - {ingredient.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={item.percent}
                  onChange={(event) =>
                    updateIngredient(index, "percent", event.target.value)
                  }
                />

                <button
                  type="button"
                  className="danger-button"
                  onClick={() => removeIngredientRow(index)}
                  disabled={selectedIngredients.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}

            <p>
              <strong>Total:</strong> {totalPercent.toFixed(2)}
            </p>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting
              ? mode === "revise"
                ? "Saving Revision..."
                : "Creating..."
              : mode === "revise"
                ? "Save Revision"
                : "Create Flavor"}
          </button>
        </form>
      )}
    </div>
  );
}

export default FlavorForm;