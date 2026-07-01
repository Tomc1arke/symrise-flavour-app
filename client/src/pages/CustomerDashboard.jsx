import React, { useEffect, useState } from "react";
import { getCustomerFlavors, submitFlavor } from "../api/flavourApi";
import FlavorForm from "../components/FlavorForm";
import FlavorDetail from "../components/FlavorDetail";

function CustomerDashboard({ user, onLogout }) {
  const [flavors, setFlavors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedFlavorId, setSelectedFlavorId] = useState(null);
  const [flavorBeingRevised, setFlavorBeingRevised] = useState(null);

  const submittedCount = flavors.filter(
    (flavor) => flavor.state === "submitted"
  ).length;

  const approvedCount = flavors.filter(
    (flavor) => flavor.state === "approved"
  ).length;

  const rejectedCount = flavors.filter(
    (flavor) => flavor.state === "rejected"
  ).length;

  async function loadFlavors() {
    try {
      setLoading(true);
      const data = await getCustomerFlavors(user.id);
      setFlavors(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFlavors();
  }, [user.id]);

  function handleFlavorCreated() {
    setShowCreateForm(false);
    setFlavorBeingRevised(null);
    setSelectedFlavorId(null);
    loadFlavors();
  }

  function handleStartRevise(flavor) {
    setFlavorBeingRevised(flavor);
    setShowCreateForm(false);
    setSelectedFlavorId(null);
  }

  async function handleSubmitFlavor(flavorId) {
  try {
      setError("");
      await submitFlavor(flavorId);
      loadFlavors();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main className="page">
      <section className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Customer Dashboard</h1>
            <p>
              Welcome, {user.firstName} {user.lastName}
            </p>
          </div>

          <button onClick={onLogout}>Logout</button>
        </div>

        {showCreateForm && (
          <FlavorForm
            user={user}
            onFlavorCreated={handleFlavorCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {flavorBeingRevised && (
          <FlavorForm
            user={user}
            mode="revise"
            initialFlavor={flavorBeingRevised}
            onFlavorCreated={handleFlavorCreated}
            onCancel={() => setFlavorBeingRevised(null)}
          />
        )}

        {selectedFlavorId && (
          <FlavorDetail
            flavorId={selectedFlavorId}
            onClose={() => setSelectedFlavorId(null)}
            onRevise={handleStartRevise}
          />
        )}

        <div className="notification-panel">
          <h2>Notifications</h2>

          {submittedCount === 0 && approvedCount === 0 && rejectedCount === 0 ? (
            <p>No flavor updates at the moment.</p>
          ) : (
            <ul>
              {submittedCount > 0 && (
                <li>
                  {submittedCount} flavor{submittedCount === 1 ? "" : "s"} under review.
                </li>
              )}

              {approvedCount > 0 && (
                <li>
                  {approvedCount} flavor{approvedCount === 1 ? "" : "s"} approved.
                </li>
              )}

              {rejectedCount > 0 && (
                <li>
                  {rejectedCount} flavor{rejectedCount === 1 ? "" : "s"} rejected and ready to revise.
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Your Flavors</h2>
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(true);
                setFlavorBeingRevised(null);
                setSelectedFlavorId(null);
              }}
            >
              Create New Flavor
            </button>
          </div>

          {loading && <p>Loading flavors...</p>}

          {error && <p className="error">{error}</p>}

          {!loading && !error && flavors.length === 0 && (
            <p>You have not created any flavors yet.</p>
          )}

          {!loading && !error && flavors.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Label</th>
                  <th>Version</th>
                  <th>State</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {flavors.map((flavor) => (
                  <tr key={flavor.id}>
                    <td>{flavor.name}</td>
                    <td>{flavor.label}</td>
                    <td>{flavor.version}</td>
                    <td>
                      <span className={`status status-${flavor.state}`}>
                        {flavor.state}
                      </span>
                    </td>
                    <td>{flavor.description}</td>
                    <td>
                      <div className="action-row">
                        <button type="button" onClick={() => setSelectedFlavorId(flavor.id)}>
                          View Details
                        </button>

                        {flavor.state === "new" ? (
                          <button type="button" onClick={() => handleSubmitFlavor(flavor.id)}>
                            Submit for Review
                          </button>
                        ) : (
                          <span className="muted">No submit action</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}

export default CustomerDashboard;