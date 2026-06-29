import React, { useState } from "react";

function Login({ onLogin }) {
  const [login, setLogin] = useState("rpatel@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: login,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      onLogin(data);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main className="page">
      <section className="card">
        <h1>Symrise Flavor Creation</h1>
        <p>Login as a customer or flavorist.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit">Login</button>
        </form>

        <div className="hint">
          <p><strong>Customer:</strong> rpatel@example.com / password</p>
          <p><strong>Flavorist:</strong> jdupont@example.com / password</p>
        </div>
      </section>
    </main>
  );
}

export default Login;