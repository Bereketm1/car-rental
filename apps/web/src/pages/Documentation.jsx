import React, { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  CarFront,
  Database,
  HeartHandshake,
  LayoutDashboard,
  LifeBuoy,
  Megaphone,
  Network,
  PlayCircle,
  ScrollText,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  UsersRound,
  WalletCards,
  Workflow,
  BookOpen,
  Presentation,
  CheckCircle2
} from "lucide-react";

const sections = [
  { id: "overview", label: "Platform Overview", icon: LayoutDashboard },
  { id: "demo-guide", label: "Demo Guide", icon: Presentation },
  { id: "modules", label: "Module Guide", icon: Sparkles },
  { id: "technical", label: "Technical Reference", icon: Database },
];

const modules = [
  {
    id: "dashboard",
    title: "Executive Dashboard",
    route: "/dashboard",
    icon: LayoutDashboard,
    owner: "Leadership and operations",
    description: "Top-line KPIs, marketplace pulse, and executive visibility into sales, finance, partners, and demand. Aggregates live data from all microservices to show total revenue, active deals, and approval rates.",
    capabilities: ["Marketplace KPIs", "Revenue pulse", "Lead and deal snapshot", "Cross-functional health view"],
  },
  {
    id: "customers",
    title: "Customer CRM",
    route: "/customers",
    icon: UsersRound,
    owner: "Sales & Onboarding",
    description: "Manage the customer registry, record vehicle interests, submit loan applications, and attach identity documents securely.",
    capabilities: ["Customer registry", "Vehicle interests", "Loan applications", "Document uploads"],
  },
  {
    id: "vehicles",
    title: "Vehicle Inventory",
    route: "/vehicles",
    icon: CarFront,
    owner: "Supply & Inventory",
    description: "Track live vehicle inventory, manage supplier relationships, and change inventory status from available to reserved or sold.",
    capabilities: ["Vehicle CRUD", "Supplier registry", "Inventory summary", "Status management"],
  },
  {
    id: "deals",
    title: "Deal Lifecycle",
    route: "/deals",
    icon: Workflow,
    owner: "Commercial Operations",
    description: "End-to-end transaction flow from inquiry through completion with stage transitions and financial context.",
    capabilities: ["Deal creation", "Stage progression", "Pipeline tracking", "Commission calculations"],
  },
  {
    id: "finance",
    title: "Financial Portal",
    route: "/finance",
    icon: WalletCards,
    owner: "Credit & Underwriting",
    description: "Review loan applications, manage lending institutions, request additional documents, and approve or reject financing.",
    capabilities: ["Loan reviews", "Institution registry", "Document requests", "Approval actions"],
  },
  {
    id: "partners",
    title: "Partnerships",
    route: "/partners",
    icon: HeartHandshake,
    owner: "Business Development",
    description: "Onboard partners (dealers, insurance, banks), manage commercial agreements, and track earned commissions.",
    capabilities: ["Partner registry", "Agreement management", "Commission ledger"],
  },
  {
    id: "marketing",
    title: "Lead & Marketing",
    route: "/marketing",
    icon: Megaphone,
    owner: "Growth & Acquisition",
    description: "Capture leads, track marketing campaigns, manage referral programs, and monitor conversion metrics.",
    capabilities: ["Lead capture", "Campaign tracking", "Referral ledger", "Conversion metrics"],
  },
];

const demoSteps = [
  {
    title: "1. The Big Picture (Executive Dashboard)",
    action: "Start on the Dashboard page.",
    talkingPoints: [
      "Welcome to Zelalem Motors. This is the Executive Command Center.",
      "Highlight the KPIs at the top: These are live metrics aggregated from our 7 microservices.",
      "Point out the 'Closed Revenue' and 'Active Deals' to show system scale.",
      "Mention the charts: 'Revenue and lead momentum' shows our month-over-month growth."
    ],
    outcome: "Establishes that this is a comprehensive, data-driven platform."
  },
  {
    title: "2. Capturing Demand (Marketing & Leads)",
    action: "Navigate to 'Leads & Marketing' in the sidebar.",
    talkingPoints: [
      "Every sale starts with a lead. Here we track prospects across campaigns and referrals.",
      "Show the 'Lead capture' tab and click 'Capture lead' to show the modal.",
      "Explain how leads flow through statuses: New → Contacted → Qualified → Converted.",
      "Point out the 'Export' button: 'All our tables feature one-click professional PDF and CSV exports.'"
    ],
    outcome: "Demonstrates top-of-funnel capabilities."
  },
  {
    title: "3. Knowing the Customer (CRM)",
    action: "Navigate to 'Customer CRM'.",
    talkingPoints: [
      "Once a lead converts, they become a Customer. This is our unified view of the buyer.",
      "Expand a customer record (e.g., Abebe Kebede).",
      "Show the sub-tabs: Vehicle Interests, Loan Applications, and Documents.",
      "Click 'View' on a document to show the secure file serving capability."
    ],
    outcome: "Shows deep customer context and document management."
  },
  {
    title: "4. Managing Supply (Vehicle Inventory)",
    action: "Navigate to 'Vehicle Inventory'.",
    talkingPoints: [
      "To satisfy the customer, we need inventory. This module tracks our vehicles and suppliers.",
      "Highlight the 'Status' badges (Available, Reserved, Sold).",
      "Show the 'Suppliers' tab to demonstrate how we manage our dealer network.",
      "Mention the professional UI: 'Notice the clean, responsive data tables and status indicators.'"
    ],
    outcome: "Proves we handle the physical assets and supply chain."
  },
  {
    title: "5. Connecting Buyer to Vehicle (Deals)",
    action: "Navigate to 'Deal Lifecycle'.",
    talkingPoints: [
      "The Deal connects the Customer to the Vehicle.",
      "Show how deals progress through stages (Inquiry → Negotiation → Financing → Completed).",
      "Highlight the financial math: Amounts, Down Payments, and Financed Amounts are tracked here."
    ],
    outcome: "Shows the core transaction engine."
  },
  {
    title: "6. Securing the Capital (Financial Portal)",
    action: "Navigate to 'Financial Portal'.",
    talkingPoints: [
      "Since most vehicles are financed, our Underwriting team uses this portal.",
      "Show the 'Loan Reviews' tab. This is where banks (like CBE or Awash) process applications.",
      "Demonstrate the action buttons: Approve, Reject, or Request Docs.",
      "Show the 'Institutions' tab to highlight multi-lender support."
    ],
    outcome: "Demonstrates the fintech/lending capability."
  },
  {
    title: "7. Rewarding the Network (Partnerships)",
    action: "Navigate to 'Partnerships'.",
    talkingPoints: [
      "We don't operate alone. We rely on dealers, insurance companies, and banks.",
      "Show how we track Commission Rates per partner.",
      "Explain that when a deal closes, commissions are automatically calculated based on these agreements."
    ],
    outcome: "Shows ecosystem management."
  },
  {
    title: "8. System Reliability (Health & Search)",
    action: "Show 'Global Search' then 'System Health'.",
    talkingPoints: [
      "Search: 'Our API Gateway provides unified cross-service search.' Type 'Toyota' to show vehicles, leads, and deals in one view.",
      "Health: 'Enterprise reliability.' Show the microservice health checks and the live audit trail of everything we just did.",
      "Conclude: 'Zelalem Motors is a complete, scalable operating system for mobility finance.'"
    ],
    outcome: "Leaves a strong technical and enterprise-grade impression."
  }
];

const architecture = [
  { name: "Web Frontend", port: "5173", note: "React/Vite admin SPA with Material UI." },
  { name: "API Gateway", port: "3000", note: "Node/Express hub. Handles auth, static files (/uploads), search, and proxies requests." },
  { name: "CRM Service", port: "3001", note: "Manages customers, interests, documents, and loan applications (crm.sqlite)." },
  { name: "Vehicle Service", port: "3002", note: "Manages vehicles, suppliers, and inventory (vehicle.sqlite)." },
  { name: "Finance Service", port: "3003", note: "Manages loan reviews, institutions, and document requests (finance.sqlite)." },
  { name: "Deal Service", port: "3004", note: "Manages deal lifecycle, stages, and commercial context (deal.sqlite)." },
  { name: "Partner Service", port: "3005", note: "Manages partners, agreements, and commissions (partner.sqlite)." },
  { name: "Lead Service", port: "3006", note: "Manages leads, campaigns, and referrals (lead.sqlite)." },
  { name: "Analytics Service", port: "3007", note: "Aggregates cross-service KPIs. No dedicated DB; fetches from other services." },
];

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="page-shell">
      <div className="card docs-hero" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', color: 'white', border: 'none' }}>
        <div className="docs-hero-main" style={{ padding: '32px' }}>
          <div className="pill-list" style={{ marginBottom: '16px' }}>
            <span className="pill" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}>System Documentation</span>
            <span className="pill" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}>Zelalem Motors</span>
          </div>
          <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '16px' }}>Zelalem Motors Platform Guide</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', maxWidth: '800px' }}>
            The complete operating system for Ethiopian mobility finance. This guide covers platform architecture, 
            module capabilities, and a step-by-step walkthrough for conducting professional product demonstrations.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-header compact row-between">
          <div>
            <div className="card-title">Documentation Sections</div>
          </div>
        </div>
        <div className="list-stack">
          <div className="tabs">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  className={`tab ${activeSection === section.id ? "active" : ""}`}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                >
                  <Icon size={14} />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeSection === "overview" && (
        <div className="section-grid">
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-header">
              <div className="card-title">What is Zelalem Motors?</div>
            </div>
            <div className="docs-card-body">
              <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                <strong>Zelalem Motors</strong> is an enterprise-grade, microservices-based platform designed specifically to handle the complex workflows of vehicle financing in Ethiopia. 
              </p>
              <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                Unlike standard CRMs, Zelalem Motors connects the entire ecosystem: capturing leads, onboarding customers, managing physical vehicle inventory, coordinating with lending institutions for loan approvals, tracking the deal pipeline, and calculating partner commissions—all in one unified workspace.
              </p>
              <div style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div className="docs-mini-card" style={{ flex: '1 1 300px' }}>
                  <div className="docs-mini-heading"><Network size={16} style={{display: 'inline', marginRight: '8px'}}/> Microservices Architecture</div>
                  <p>Built on 7 independent Node.js services communicating through an Express API Gateway, ensuring scalability and fault isolation.</p>
                </div>
                <div className="docs-mini-card" style={{ flex: '1 1 300px' }}>
                  <div className="docs-mini-heading"><ShieldCheck size={16} style={{display: 'inline', marginRight: '8px'}}/> Role-Based Workspaces</div>
                  <p>Admins, Sales, Finance, and Marketing users see the same system but utilize different modules tailored to their operations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === "demo-guide" && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Demo Session Walkthrough</div>
              <div className="card-subtitle">A proven, step-by-step script for presenting Zelalem Motors to stakeholders.</div>
            </div>
          </div>
          <div className="docs-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {demoSteps.map((step, idx) => (
                <div key={idx} style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-subtle)' }}>
                  <h3 style={{ color: 'var(--accent-primary)', marginBottom: '12px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {step.title}
                  </h3>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Action:</span>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-primary)', fontWeight: '500' }}>{step.action}</p>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Talking Points:</span>
                    <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: 'var(--text-secondary)' }}>
                      {step.talkingPoints.map((point, i) => <li key={i} style={{ marginBottom: '4px' }}>{point}</li>)}
                    </ul>
                  </div>
                  <div style={{ padding: '8px 12px', background: 'var(--accent-success-soft)', color: 'var(--accent-success)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} /> Outcome: {step.outcome}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection === "modules" && (
        <div className="docs-grid">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <div key={module.id} className="card docs-card">
                <div className="card-header compact">
                  <div>
                    <div className="docs-card-title">
                      <Icon size={18} color="var(--accent-primary)" />
                      {module.title}
                    </div>
                    <div className="card-subtitle">User: {module.owner}</div>
                  </div>
                </div>
                <div className="docs-card-body">
                  <p>{module.description}</p>
                  <div className="pill-list" style={{ marginTop: 'auto' }}>
                    {module.capabilities.map((capability) => (
                      <span key={capability} className="pill" style={{ background: 'var(--bg-surface)' }}>
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeSection === "technical" && (
        <div className="section-grid">
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-header">
              <div className="card-title">Microservices Architecture Map</div>
              <div className="card-subtitle">API Gateway (Port 3000) routes to 7 local Node.js services.</div>
            </div>
            <div className="docs-card-body">
              <div className="docs-grid docs-grid-tight">
                {architecture.map((service) => (
                  <div key={service.name} className="docs-mini-card">
                    <div className="docs-mini-heading">{service.name}</div>
                    <div className="docs-mini-port">Port: {service.port}</div>
                    <p style={{ fontSize: '0.85rem' }}>{service.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-header">
              <div className="card-title">Export Capabilities</div>
            </div>
            <div className="docs-card-body">
              <p>
                All data tables across the platform support professional exporting:
              </p>
              <ul style={{ color: 'var(--text-secondary)' }}>
                <li><strong>CSV Export:</strong> Generates clean, comma-separated values files for Excel/Sheets analysis. Excludes action buttons.</li>
                <li><strong>PDF Export:</strong> Generates branded, styled PDF reports using <code>jspdf</code> and <code>jspdf-autotable</code>. Includes Zelalem Motors branding, timestamps, page numbers, and alternating row colors.</li>
              </ul>
              <p style={{ fontSize: '0.85rem', marginTop: '8px' }}><em>Note: Exports respect current table filters and sorting.</em></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
