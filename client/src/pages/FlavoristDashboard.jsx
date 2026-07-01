import React, { useEffect, useState } from "react";
import {
  getSubmittedFlavors,
  approveFlavor,
  rejectFlavor,
  addFlavorComment,
} from "../api/flavourApi";

function FlavoristDashboard({ user, onLogout }) {
  const [flavors, setFlavors] = useState([]);
  const [commentTextByFlavorId, setCommentTextByFlavorId] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const submittedCount = flavors.length;

  async function loadSubmittedFlavors() {
    try {
      setLoading(true);
      setError("");
      const data = await getSubmittedFlavors();
      setFlavors(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubmittedFlavors();
  }, []);

  function updateCommentText(flavorId, text) {
    setCommentTextByFlavorId({
      ...commentTextByFlavorId,
      [flavorId]: text,
    });
  }

  async function handleAddComment(flavorId) {
    const text = commentTextByFlavorId[flavorId];

    if (!text || !text.trim()) {
      setError("Comment text is required.");
      return;
    }

    try {
      setError("");
      await addFlavorComment(flavorId, user.id, text);
      setCommentTextByFlavorId({
        ...commentTextByFlavorId,
        [flavorId]: "",
      });
      alert("Comment added successfully.");
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleApprove(flavorId) {
    try {
      setError("");
      await approveFlavor(flavorId, user.id);
      loadSubmittedFlavors();
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleReject(flavorId) {
    try {
      setError("");
      await rejectFlavor(flavorId, user.id);
      loadSubmittedFlavors();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main className="page">
      <section className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Review Submitted Flavors</h1>
            <p>
              Welcome, {user.firstName} {user.lastName}
            </p>
          </div>

          <button onClick={onLogout}>Logout</button>
        </div>

        <div className="notification-panel">
          <h2>Notifications</h2>

          {submittedCount === 0 ? (
            <p>No submitted flavors awaiting review.</p>
          ) : (
            <p>
              You have {submittedCount} submitted flavor
              {submittedCount === 1 ? "" : "s"} awaiting review.
            </p>
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Submitted Flavors</h2>
            <button type="button" className="secondary-button" onClick={loadSubmittedFlavors}>
              Refresh
            </button>
          </div>

          {loading && <p>Loading submitted flavors...</p>}

          {error && <p className="error">{error}</p>}

          {!loading && !error && flavors.length === 0 && (
            <p>There are no submitted flavors awaiting review.</p>
          )}

          {!loading && !error && flavors.length > 0 && (
            <div className="review-list">
              {flavors.map((flavor) => (
                <article className="review-card" key={flavor.id}>
                  <div className="review-card-header">
                    <div>
                      <h3>{flavor.name}</h3>
                      <p>
                        <strong>Label:</strong> {flavor.label}
                      </p>
                      <p>
                        <strong>Version:</strong> {flavor.version}
                      </p>
                      <p>
                        <strong>Submitted by:</strong> {flavor.created_by_name}
                      </p>
                      <p>
                        <strong>Description:</strong> {flavor.description}
                      </p>
                    </div>

                    <span className={`status status-${flavor.state}`}>
                      {flavor.state}
                    </span>
                  </div>

                  <div className="comment-box">
                    <label>
                      Comment
                      <textarea
                        value={commentTextByFlavorId[flavor.id] || ""}
                        onChange={(event) =>
                          updateCommentText(flavor.id, event.target.value)
                        }
                        placeholder="Leave feedback or feasibility notes for the customer..."
                      />
                    </label>

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => handleAddComment(flavor.id)}
                    >
                      Add Comment
                    </button>
                  </div>

                  <div className="action-row">
                    <button type="button" onClick={() => handleApprove(flavor.id)}>
                      Approve
                    </button>

                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleReject(flavor.id)}
                    >
                      Reject
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default FlavoristDashboard;