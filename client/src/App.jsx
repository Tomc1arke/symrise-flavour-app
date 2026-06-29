import React, { useState } from "react";
import Login from "./pages/Login";
import CustomerDashboard from "./pages/CustomerDashboard";
import FlavoristDashboard from "./pages/FlavoristDashboard";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  function handleLogout() {
    setUser(null);
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  if (user.role === "customer") {
    return <CustomerDashboard user={user} onLogout={handleLogout} />;
  }

  if (user.role === "flavorist") {
    return <FlavoristDashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <main className="page">
      <section className="card">
        <h1>Unsupported role</h1>
        <p>Your account role is not supported.</p>
        <button onClick={handleLogout}>Logout</button>
      </section>
    </main>
  );
}

export default App;