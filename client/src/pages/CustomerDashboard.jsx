import React, { useEffect, useState } from "react";
import { getCustomerFlavors } from "../api/flavourApi";
import FlavorForm from "../components/FlavorForm";

function CustomerDashboard({ user, onLogout }) {
  const [flavors, setFlavors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

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
    loadFlavors();
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

        <div className="panel">
          <div className="panel-header">
            <h2>Your Flavors</h2>
            <button type="button" onClick={() => setShowCreateForm(true)}>
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