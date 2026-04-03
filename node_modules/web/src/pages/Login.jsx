import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, CarFront, HeartHandshake, ShieldCheck, UsersRound, WalletCards } from 'lucide-react';
import api from '../api';
import { useToast } from '../components/Toast';

const showcaseFeatures = [
  {
    icon: UsersRound,
    title: 'Customer Management',
    copy: 'Register customers, capture vehicle interest, upload documents, and submit loan applications.',
  },
  {
    icon: CarFront,
    title: 'Vehicle & Supplier Portal',
    copy: 'Manage vehicle inventory, supplier records, and route customer leads to matching dealers.',
  },
  {
    icon: WalletCards,
    title: 'Financing & Bank Portal',
    copy: 'Review loan applications, request documents, approve or reject financing decisions.',
  },
  {
    icon: HeartHandshake,
    title: 'Partnerships & Revenue',
    copy: 'Track agreements, commissions, marketing campaigns, and full transaction reporting.',
  },
];

const demoCredentials = [
  { role: 'Administrator', email: 'admin@merkatomotors.com', password: 'admin123' },
  { role: 'Supplier Demo', email: 'supplier@merkatomotors.com', password: 'vendor123' },
];

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState(demoCredentials[0].email);
  const [password, setPassword] = useState(demoCredentials[0].password);
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (!response?.access_token) throw new Error('Invalid response from server');
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      onLogin(response.user);
      navigate('/dashboard');
      toast.success('Welcome back.', 'Signed in');
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Left showcase panel */}
        <section className="login-showcase">
          <span className="eyebrow">Merkato Motors Platform</span>
          <h1>Ethiopia's Vehicle Financing Marketplace</h1>
          <p>
            A complete platform connecting customers, vehicle suppliers, and financial institutions
            — from vehicle selection to loan approval and purchase completion.
          </p>

          <div className="login-feature-list">
            {showcaseFeatures.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="login-feature">
                  <div className="metric-icon-wrap">
                    <Icon size={16} strokeWidth={2.2} />
                  </div>
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
                <div className="list-row-title" style={{ color: 'rgba(255,255,255,0.85)' }}>Transaction lifecycle</div>
                <div className="list-row-meta" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Customer → Vehicle selection → Loan application → Bank approval → Purchase
                </div>
              </div>
              <ShieldCheck size={18} style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} strokeWidth={2} />
            </div>
          </div>
        </section>

        {/* Right login panel */}
        <section className="login-panel">
          <div className="brand-mark">M</div>
          <span className="eyebrow">Workspace Access</span>
          <h2>Sign in</h2>
          <p>Select a demo account below or enter your credentials.</p>

          <div className="login-credential-list">
            {demoCredentials.map((item) => (
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
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Enter Workspace'}
              {!loading && <ArrowRight size={16} strokeWidth={2.2} />}
            </button>
          </form>

          <div className="login-panel-footnote">
            <Building2 size={14} strokeWidth={2} />
            <span>Prepared for operations and executive demonstration.</span>
          </div>
        </section>
      </div>
    </div>
  );
}
