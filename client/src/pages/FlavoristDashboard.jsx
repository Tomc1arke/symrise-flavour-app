import React from "react";

function FlavoristDashboard({ user, onLogout }) {
  return (
    <main className="page">
      <section className="card">
        <h1>Flavorist Dashboard</h1>
        <p>
          Welcome, {user.firstName} {user.lastName}
        </p>
        <p>Role: {user.role}</p>

        <button onClick={onLogout}>Logout</button>
      </section>
    </main>
  );
}

export default FlavoristDashboard;