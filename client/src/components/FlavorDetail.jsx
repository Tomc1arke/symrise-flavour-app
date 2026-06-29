import React, { useEffect, useState } from "react";
import { getFlavorById } from "../api/flavourApi";

function FlavorDetail({ flavorId, onClose }) {
  const [flavor, setFlavor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFlavor() {
      try {
        setLoading(true);
        setError("");
        const data = await getFlavorById(flavorId);
        setFlavor(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadFlavor();
  }, [flavorId]);

  if (!flavorId) {
    return null;
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Flavor Details</h2>
        <button type="button" className="secondary-button" onClick={onClose}>
          Close
        </button>
      </div>

      {loading && <p>Loading flavor details...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && flavor && (
        <div className="detail-content">
          <div className="detail-grid">
            <p>
              <strong>Name:</strong> {flavor.name}
            </p>
            <p>
              <strong>Label:</strong> {flavor.label}
            </p>
            <p>
              <strong>Version:</strong> {flavor.version}
            </p>
            <p>
              <strong>State:</strong>{" "}
              <span className={`status status-${flavor.state}`}>
                {flavor.state}
              </span>
            </p>
            <p>
              <strong>Created by:</strong> {flavor.created_by_name}
            </p>
            <p>
              <strong>Approved by:</strong>{" "}
              {flavor.approved_by_name || "Not approved yet"}
            </p>
          </div>

          <p>
            <strong>Description:</strong> {flavor.description}
          </p>

          <h3>Ingredient Composition</h3>

          {flavor.ingredients.length === 0 ? (
            <p>No ingredients found for this flavor.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Label</th>
                  <th>Percent</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {flavor.ingredients.map((ingredient) => (
                  <tr key={ingredient.id}>
                    <td>{ingredient.name}</td>
                    <td>{ingredient.label}</td>
                    <td>{Number(ingredient.percent).toFixed(2)}</td>
                    <td>{ingredient.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h3>Comments</h3>

          {!flavor.comments || flavor.comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <div className="comment-list">
              {flavor.comments.map((comment) => (
                <div className="comment-card" key={comment.id}>
                  <p>{comment.text}</p>
                  <small>
                    By {comment.created_by_name} at {comment.created_at}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FlavorDetail;