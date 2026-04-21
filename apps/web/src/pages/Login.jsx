import React, { useState } from "react";
import { ArrowRight, Building2, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useToast } from "../components/Toast";

const demoAccounts = [
  {
    role: "Marketplace Admin",
    email: "admin@merkatomotors.com",
    password: "admin123",
  },
  {
    role: "Supplier Operator",
    email: "supplier@merkatomotors.com",
    password: "vendor123",
  },
];

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState(demoAccounts[0].email);
  const [password, setPassword] = useState(demoAccounts[0].password);
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      if (!response?.access_token) {
        throw new Error("Login response is missing access token.");
      }

      localStorage.setItem("token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user || {}));
      onLogin(response.user || {});
      toast.success("Signed in successfully", "Welcome back");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.message || "Unable to sign in with the provided credentials.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-grid">
        <section className="auth-hero">
          <div className="auth-badge">
            <Building2 size={16} />
            Native full-stack workspace
          </div>
          <h1>Merkato Motors Workspace</h1>
          <p>
            Unified CRM, supplier, finance, deal, partnership, and analytics
            operations tailored for the Ethiopian mobility financing ecosystem.
          </p>
          <div className="auth-highlight">
            <ShieldCheck size={18} />
            Secure API gateway access with role-aware workspace entry
          </div>
        </section>

        <section className="auth-card">
          <h2>Sign in</h2>
          <p className="auth-subtitle">
            Use one of the demo accounts or enter credentials manually.
          </p>

          <div className="account-grid">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                className="account-chip"
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
              >
                <strong>{account.role}</strong>
                <span>{account.email}</span>
              </button>
            ))}
          </div>

          <form className="auth-form" onSubmit={submit}>
            <div>
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Access workspace"}
              {!loading ? (
                <ArrowRight size={15} style={{ marginLeft: 8 }} />
              ) : null}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
