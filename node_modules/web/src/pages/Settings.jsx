import React, { useEffect, useState } from 'react';
import { LockKeyhole, Palette, ShieldCheck, SlidersHorizontal, UserCircle2 } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';
import { useI18n } from '../context/i18nContext';
import { useTheme } from '../context/ThemeContext';

const profileKey = 'merkatomotors_profile';
const systemKey = 'merkatomotors_system';

export default function Settings() {
  const toast = useToast();
  const { locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState({ name: 'Sarem Tadele', email: 'sarem@merkatomotors.com', role: 'Administrator', avatar: 'ST' });
  const [system, setSystem] = useState({ currency: 'ETB', timezone: 'Africa/Addis_Ababa', itemsPerPage: '10', notificationsEnabled: true });
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    try {
      setProfile(JSON.parse(localStorage.getItem(profileKey) || JSON.stringify(profile)));
      setSystem(JSON.parse(localStorage.getItem(systemKey) || JSON.stringify(system)));
    } catch {
      // keep defaults
    }
  }, []);

  function saveProfile(event) {
    event.preventDefault();
    localStorage.setItem(profileKey, JSON.stringify(profile));
    toast.success('Profile preferences saved');
    setActiveModal(null);
  }

  function saveSystem(event) {
    event.preventDefault();
    localStorage.setItem(systemKey, JSON.stringify(system));
    toast.success('System settings saved');
    setActiveModal(null);
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>Settings and configuration</h1>
          <p>Manage operator preferences, regional settings, interface mode, and basic workspace security guidance.</p>
        </div>
        <div className="pill-list">
          <span className="pill">Operator profile</span>
          <span className="pill">Workspace preferences</span>
          <span className="pill">Security posture</span>
        </div>
      </div>

      <div className="stats-grid">
        <MetricCard icon={UserCircle2} label="Profile" value={profile.name} detail={profile.role} tone="accent" />
        <MetricCard icon={Palette} label="Theme" value={theme === 'dark' ? 'Dark mode' : 'Light mode'} detail="Applied immediately across the workspace" tone="info" />
        <MetricCard icon={SlidersHorizontal} label="Locale" value={locale === 'en' ? 'English' : 'Amharic'} detail="Controls translated labels and interface language" tone="warning" />
        <MetricCard icon={ShieldCheck} label="Notifications" value={system.notificationsEnabled ? 'Enabled' : 'Muted'} detail="Operational alerts and event signals" tone="success" />
      </div>

      <div className="section-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Profile details</div>
              <div className="card-subtitle">Used for operator identity throughout the workspace.</div>
            </div>
            <button className="btn btn-primary" type="button" onClick={() => setActiveModal('profile')}>
              Edit profile
            </button>
          </div>
          <div className="list-stack">
            <div className="list-row">
              <div className="list-row-head">
                <div>
                  <div className="list-row-title">{profile.name}</div>
                  <div className="list-row-meta">{profile.email}</div>
                </div>
                <div className="header-avatar">{profile.avatar || 'ST'}</div>
              </div>
              <div className="list-row-meta">{profile.role}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Workspace preferences</div>
              <div className="card-subtitle">Local presentation controls for the current operator.</div>
            </div>
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal('system')}>
              Edit preferences
            </button>
          </div>
          <div className="list-stack">
            <div className="list-row">
              <div className="list-row-head">
                <div>
                  <div className="list-row-title">Language and theme</div>
                  <div className="list-row-meta">{locale === 'en' ? 'English' : 'Amharic'} · {theme === 'dark' ? 'Dark mode' : 'Light mode'}</div>
                </div>
                <ShieldCheck size={18} />
              </div>
              <div className="list-row-meta">{system.notificationsEnabled ? 'Notifications enabled' : 'Notifications muted'}</div>
            </div>
            <div className="list-row">
              <div className="list-row-title">Regional defaults</div>
              <p>{system.currency} · {system.timezone} · {system.itemsPerPage} items per page</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '980px' }}>
        <div className="card-header">
          <div>
            <div className="card-title">Security controls</div>
            <div className="card-subtitle">Operator-side guidance for password hygiene and access review.</div>
          </div>
        </div>
        <div className="list-stack">
          <div className="list-row">
            <div className="list-row-head">
              <div>
                <div className="list-row-title">Password management</div>
                <div className="list-row-meta">Connected APIs still control actual authentication. This panel is for workspace guidance.</div>
              </div>
              <LockKeyhole size={18} />
            </div>
            <p>Use strong passwords, rotate shared demo accounts before deployment, and move seeded credentials into environment-managed secrets before any production release.</p>
          </div>
          <div className="list-row">
            <div className="list-row-title">Operational recommendation</div>
            <p>Add role-based permissions next if multiple staff types will use the same environment.</p>
          </div>
        </div>
      </div>

      <Modal
        open={activeModal === 'profile'}
        onClose={() => setActiveModal(null)}
        title="Edit profile"
        subtitle="Update the operator identity used across the workspace."
        size="large"
      >
        <form onSubmit={saveProfile} className="list-stack">
          <div className="form-grid">
            <div className="form-group"><label>Full name</label><input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></div>
            <div className="form-group"><label>Email</label><input type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} /></div>
            <div className="form-group"><label>Role</label><input value={profile.role} onChange={(event) => setProfile({ ...profile, role: event.target.value })} /></div>
            <div className="form-group"><label>Avatar initials</label><input value={profile.avatar} onChange={(event) => setProfile({ ...profile, avatar: event.target.value.slice(0, 2).toUpperCase() })} /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit">Save profile</button>
          </div>
        </form>
      </Modal>

      <Modal
        open={activeModal === 'system'}
        onClose={() => setActiveModal(null)}
        title="Edit workspace preferences"
        subtitle="Adjust the presentation defaults for the current operator."
        size="large"
      >
        <form onSubmit={saveSystem} className="list-stack">
          <div className="form-grid">
            <div className="form-group">
              <label>Language</label>
              <select value={locale} onChange={(event) => setLocale(event.target.value)}>
                <option value="en">English</option>
                <option value="am">Amharic</option>
              </select>
            </div>
            <div className="form-group">
              <label>Theme</label>
              <select value={theme} onChange={(event) => setTheme(event.target.value)}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
            <div className="form-group"><label>Currency</label><input value={system.currency} onChange={(event) => setSystem({ ...system, currency: event.target.value })} /></div>
            <div className="form-group"><label>Timezone</label><input value={system.timezone} onChange={(event) => setSystem({ ...system, timezone: event.target.value })} /></div>
            <div className="form-group"><label>Items per page</label><input value={system.itemsPerPage} onChange={(event) => setSystem({ ...system, itemsPerPage: event.target.value })} /></div>
            <div className="form-group"><label>Notifications enabled</label><select value={String(system.notificationsEnabled)} onChange={(event) => setSystem({ ...system, notificationsEnabled: event.target.value === 'true' })}><option value="true">Enabled</option><option value="false">Muted</option></select></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit">Save settings</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
