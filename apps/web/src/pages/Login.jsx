import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, CarFront, HeartHandshake, ShieldCheck, UsersRound, WalletCards } from 'lucide-react';
import api from '../api';
import { useToast } from '../components/Toast';

const showcaseHighlights = [
  {
    icon: UsersRound,
    title: 'Customer intake',
    copy: 'Registration, vehicle interest, document upload, and loan submission in one place.',
  },
  {
    icon: CarFront,
    title: 'Supplier and vehicle control',
    copy: 'A clean inventory workspace for suppliers, listed vehicles, and lead follow-up.',
  },
  {
    icon: WalletCards,
    title: 'Financing oversight',
    copy: 'Reviews, lender coordination, requested documents, and approval decisions.',
  },
  {
    icon: HeartHandshake,
    title: 'Partner and revenue visibility',
    copy: 'Agreements, commissions, campaigns, and reporting tied to the full transaction flow.',
  },
];

const credentials = [
  { role: 'Administrator', email: 'admin@merkatomotors.com', password: 'admin123' },
  { role: 'Supplier portal demo', email: 'supplier@merkatomotors.com', password: 'vendor123' },
];

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState(credentials[0].email);
  const [password, setPassword] = useState(credentials[0].password);
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      if (!response?.access_token) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      onLogin(response.user);
      navigate('/dashboard');
      toast.success('Workspace access granted.', 'Signed in');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <section className="login-showcase">
          <p className="eyebrow">Ethiopian vehicle financing platform</p>
          <h1>A calm, professional workspace for vehicle financing operations.</h1>
          <p>
            Run customer onboarding, supplier inventory, lender review, partner management, deal execution,
            and reporting from one clear product surface.
          </p>

          <div className="login-feature-list">
            {showcaseHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="login-feature">
                  <div className="metric-icon-wrap"><Icon size={18} strokeWidth={2.2} /></div>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.copy}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="login-note">
            <div className="list-row-head">
              <div>
                <div className="list-row-title">Operational scope</div>
                <div className="list-row-meta">Customer to vehicle, loan review, approval, and completed purchase.</div>
              </div>
              <ShieldCheck size={18} strokeWidth={2.2} />
            </div>
          </div>
        </section>

        <section className="login-panel">
          <div className="brand-mark">M</div>
          <p className="eyebrow">Workspace access</p>
          <h2>Sign in</h2>
          <p>Use a seeded demo identity below, or enter the credentials configured in the API.</p>

          <div className="login-credential-list">
            {credentials.map((item) => (
              <button
                key={item.role}
                type="button"
                className="login-credential"
                onClick={() => {
                  setEmail(item.email);
                  setPassword(item.password);
                }}
              >
                <div className="list-row-title">{item.role}</div>
                <div className="list-row-meta">{item.email} · {item.password}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Email address</label>
              <input className="form-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="form-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Enter workspace'} <ArrowRight size={16} strokeWidth={2.2} />
            </button>
          </form>

          <div className="login-panel-footnote">
            <Building2 size={16} strokeWidth={2.2} />
            <span>Prepared for executive demonstrations and day-to-day operations.</span>
          </div>
        </section>
      </div>
    </div>
  );
}
