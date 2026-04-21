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
} from "lucide-react";

const sections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "modules", label: "Modules", icon: Sparkles },
  { id: "workflows", label: "Workflows", icon: Workflow },
  { id: "operations", label: "Operations", icon: PlayCircle },
  { id: "data", label: "Data Model", icon: Database },
  { id: "support", label: "Support", icon: LifeBuoy },
];

const modules = [
  {
    id: "dashboard",
    title: "Executive Overview",
    route: "/dashboard",
    icon: LayoutDashboard,
    owner: "Leadership and operations",
    description:
      "Top-line KPIs, marketplace pulse, and executive visibility into sales, finance, partners, and demand.",
    capabilities: [
      "Marketplace KPIs",
      "Revenue pulse",
      "Lead and deal snapshot",
      "Cross-functional health view",
    ],
  },
  {
    id: "customers",
    title: "Customer CRM",
    route: "/customers",
    icon: UsersRound,
    owner: "Sales, onboarding, and underwriting prep",
    description:
      "Customer onboarding, interest capture, loan applications, and document attachment connected to the CRM service.",
    capabilities: [
      "Customer registry",
      "Vehicle interests",
      "Loan applications",
      "Document uploads",
    ],
  },
  {
    id: "vehicles",
    title: "Vehicle Inventory",
    route: "/vehicles",
    icon: CarFront,
    owner: "Supply and inventory operations",
    description:
      "Supplier onboarding, live vehicle inventory, inventory state changes, and lead-to-supplier routing.",
    capabilities: [
      "Vehicle CRUD",
      "Supplier registry",
      "Inventory summary",
      "Lead routing",
    ],
  },
  {
    id: "deals",
    title: "Deal Lifecycle",
    route: "/deals",
    icon: Workflow,
    owner: "Commercial operations",
    description:
      "End-to-end transaction flow from inquiry through completion with stage transitions and financial context.",
    capabilities: [
      "Deal creation",
      "Stage progression",
      "Pipeline board",
      "Cancelled/completed tracking",
    ],
  },
  {
    id: "finance",
    title: "Financial Portal",
    route: "/finance",
    icon: WalletCards,
    owner: "Credit and underwriting teams",
    description:
      "Finance review desk, lender registry, document requests, and approval decisions backed by live review records.",
    capabilities: [
      "Loan reviews",
      "Institution registry",
      "Document requests",
      "Approval actions",
    ],
  },
  {
    id: "partners",
    title: "Partnerships",
    route: "/partners",
    icon: HeartHandshake,
    owner: "Business development and ecosystem managers",
    description:
      "Partner onboarding, agreements, commissions, and focused partner context for the operating network.",
    capabilities: [
      "Partner registry",
      "Agreement management",
      "Commission ledger",
      "Focused partner view",
    ],
  },
  {
    id: "marketing",
    title: "Lead & Marketing",
    route: "/marketing",
    icon: Megaphone,
    owner: "Growth and acquisition teams",
    description:
      "Leads, campaigns, and referrals with live conversion metrics and campaign performance tracking.",
    capabilities: [
      "Lead capture",
      "Campaign tracking",
      "Referral ledger",
      "Conversion metrics",
    ],
  },
  {
    id: "analytics",
    title: "Reporting & Analytics",
    route: "/analytics",
    icon: BarChart3,
    owner: "Leadership and analysts",
    description:
      "Aggregated KPIs from live CRM, deal, finance, partner, vehicle, and lead data instead of hardcoded mock values.",
    capabilities: [
      "Live summary KPIs",
      "Revenue trends",
      "Financing outcomes",
      "Partner performance",
    ],
  },
  {
    id: "health",
    title: "System Health",
    route: "/health",
    icon: Activity,
    owner: "Admins and support",
    description:
      "Gateway and service reachability checks, audit visibility, and operational confidence monitoring.",
    capabilities: [
      "Gateway reachability",
      "Service checks",
      "Audit trail explorer",
      "Refreshable status view",
    ],
  },
  {
    id: "search",
    title: "Global Search",
    route: "/search",
    icon: Search,
    owner: "All operators",
    description:
      "Cross-entity search across customers, vehicles, and deals routed through the API gateway.",
    capabilities: [
      "Cross-module lookup",
      "Customer search",
      "Vehicle search",
      "Deal search",
    ],
  },
  {
    id: "settings",
    title: "Workspace Settings",
    route: "/settings",
    icon: Settings2,
    owner: "Admins",
    description:
      "Workspace preferences, language, theming, and platform-level controls.",
    capabilities: [
      "Theme controls",
      "Language selection",
      "Workspace preferences",
      "Admin configuration",
    ],
  },
];

const workflows = [
  {
    id: "customer-to-funding",
    title: "Customer to Funding Workflow",
    outcome: "Turns a prospect into an approved and tracked financing record.",
    steps: [
      "Create the customer in CRM and record vehicle interest.",
      "Submit a loan application tied to a real vehicle record.",
      "Open a finance review from the application and assign an institution.",
      "Approve, reject, or request more documents from the finance desk.",
    ],
  },
  {
    id: "inventory-to-deal",
    title: "Inventory to Deal Workflow",
    outcome:
      "Moves a real inventory unit from availability into an executable commercial deal.",
    steps: [
      "Register the supplier and add the vehicle to inventory.",
      "Reserve or sell the vehicle from the inventory workspace.",
      "Create a deal linked to the selected customer, vehicle, and financing context.",
      "Progress the deal board until completion or cancellation.",
    ],
  },
  {
    id: "partner-commercialization",
    title: "Partner Commercialization Workflow",
    outcome: "Formalizes ecosystem relationships and tracks payouts.",
    steps: [
      "Create the partner with its commercial type and commission rate.",
      "Register an agreement with active dates and terms.",
      "Record commissions against the partner and related deal references.",
      "Review partner throughput in analytics and the partner workspace.",
    ],
  },
  {
    id: "growth-ops",
    title: "Growth Operations Workflow",
    outcome:
      "Captures demand and measures campaign quality using live lead data.",
    steps: [
      "Capture a lead or attach the lead to a campaign.",
      "Advance lead status through contacted, qualified, and converted.",
      "Create campaigns and referrals from the marketing workspace.",
      "Track campaign conversions and referral pipeline in analytics-ready views.",
    ],
  },
];

const architecture = [
  { name: "Web app", port: "5173", note: "Vite-powered admin frontend." },
  {
    name: "API gateway",
    port: "3000",
    note: "Auth, routing, search, notifications, and audit interception.",
  },
  {
    name: "CRM service",
    port: "3001",
    note: "Customers, interests, documents, and loan applications.",
  },
  {
    name: "Vehicle service",
    port: "3002",
    note: "Vehicles, suppliers, and inventory summary.",
  },
  {
    name: "Finance service",
    port: "3003",
    note: "Reviews, institutions, and document requests.",
  },
  {
    name: "Deal service",
    port: "3004",
    note: "Deal lifecycle and stage orchestration.",
  },
  {
    name: "Partner service",
    port: "3005",
    note: "Partners, agreements, and commissions.",
  },
  {
    name: "Lead service",
    port: "3006",
    note: "Leads, campaigns, and referrals.",
  },
  {
    name: "Analytics service",
    port: "3007",
    note: "Cross-service KPI aggregation and reporting.",
  },
];

const operations = [
  {
    id: "startup",
    title: "Local Startup",
    summary: "Run the whole platform natively without Docker.",
    commands: ["npm install", "npm run dev"],
    checks: [
      "Frontend on http://localhost:5173",
      "Gateway on http://localhost:3000/api",
      "Services on ports 3001-3007",
    ],
  },
  {
    id: "build",
    title: "Build Verification",
    summary: "Confirm every package compiles before release or demo.",
    commands: ["npm run build"],
    checks: [
      "Turbo completes successfully",
      "Web bundle builds",
      "All Nest services compile",
    ],
  },
  {
    id: "smoke",
    title: "Smoke Testing",
    summary: "Validate the happy path after changes or before handoff.",
    commands: ["npm run demo:smoke"],
    checks: [
      "Login succeeds",
      "Core modules respond",
      "Search and analytics return live data",
    ],
  },
  {
    id: "storage",
    title: "Data Storage Model",
    summary:
      "Services persist locally using embedded SQLite via sql.js auto-save files.",
    commands: ["*.sqlite files are created in service working directories"],
    checks: [
      "No Postgres dependency for local development",
      "Database files are gitignored",
      "Service state survives restarts locally",
    ],
  },
];

const dataModel = [
  {
    name: "Customer",
    entities: "customer, vehicle interest, loan application, attached document",
  },
  { name: "Vehicle", entities: "vehicle, supplier, inventory summary" },
  { name: "Finance", entities: "loan review, institution, document request" },
  { name: "Deal", entities: "deal, stage, commission context" },
  { name: "Partner", entities: "partner, agreement, commission" },
  { name: "Growth", entities: "lead, campaign, referral" },
  { name: "Audit", entities: "audit log, notification" },
  {
    name: "Analytics",
    entities: "snapshot, summary KPIs, revenue trend, partner rollups",
  },
];

const supportTopics = [
  {
    id: "empty-data",
    title: "A page looks empty or stale",
    body: "Use System Health first. If services are online, create or update records in the owning module and refresh the page. Analytics only reflects real underlying data now, so empty charts usually mean empty source tables.",
  },
  {
    id: "modal-layering",
    title: "A modal appears behind the layout",
    body: "The modal layer is configured above the app shell. If a modal still seems hidden, reload the frontend and confirm you are on the latest build.",
  },
  {
    id: "search",
    title: "Global search is missing results",
    body: "Search now unwraps gateway payloads correctly. Recheck the exact customer, vehicle, or deal text in the source module, then search again from the header or the dedicated search page.",
  },
  {
    id: "dark-mode",
    title: "Dark mode feels inconsistent",
    body: "Most shell and content surfaces are tokenized for theme mode. If you see a page with poor contrast, log it against the specific module so the remaining isolated hardcoded colors can be normalized.",
  },
];

function filterCollection(items, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return items;
  }

  return items.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(normalized),
  );
}

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("overview");
  const [query, setQuery] = useState("");

  const filteredModules = useMemo(
    () => filterCollection(modules, query),
    [query],
  );
  const filteredWorkflows = useMemo(
    () => filterCollection(workflows, query),
    [query],
  );
  const filteredOperations = useMemo(
    () => filterCollection(operations, query),
    [query],
  );
  const filteredDataModel = useMemo(
    () => filterCollection(dataModel, query),
    [query],
  );
  const filteredSupport = useMemo(
    () => filterCollection(supportTopics, query),
    [query],
  );
  const filteredArchitecture = useMemo(
    () => filterCollection(architecture, query),
    [query],
  );

  return (
    <div className="page-shell">
      <div className="card docs-hero">
        <div className="docs-hero-main">
          <div className="pill-list">
            <span className="pill">Admin documentation</span>
            <span className="pill">Live-data platform guide</span>
            <span className="pill">Operations runbook</span>
          </div>
          <h1>Complete system guide for the Merkato Motors platform</h1>
          <p>
            This admin-facing guide covers every major module, the main
            workflows that connect them, how the stack runs locally, what each
            service owns, and how to troubleshoot the platform with confidence.
          </p>
        </div>

        <div className="docs-kpi-grid">
          <div className="docs-kpi">
            <span className="docs-kpi-label">Modules</span>
            <strong>{modules.length}</strong>
          </div>
          <div className="docs-kpi">
            <span className="docs-kpi-label">Workflows</span>
            <strong>{workflows.length}</strong>
          </div>
          <div className="docs-kpi">
            <span className="docs-kpi-label">Services</span>
            <strong>{architecture.length}</strong>
          </div>
          <div className="docs-kpi">
            <span className="docs-kpi-label">Runtime</span>
            <strong>NPM + SQLite</strong>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header compact row-between">
          <div>
            <div className="card-title">Guide navigation</div>
            <div className="card-subtitle">
              Jump between sections and search for modules, entities, commands,
              or troubleshooting topics.
            </div>
          </div>
          <input
            className="table-search-input docs-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search modules, commands, workflows, ports, or support topics"
          />
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

      {activeSection === "overview" ? (
        <div className="section-grid">
          <div className="card">
            <div className="card-header compact">
              <div>
                <div className="card-title">Platform architecture</div>
                <div className="card-subtitle">
                  Service ownership and local runtime map.
                </div>
              </div>
            </div>
            <div className="docs-grid docs-grid-tight">
              {filteredArchitecture.map((service) => (
                <div key={service.name} className="docs-mini-card">
                  <div className="docs-mini-heading">{service.name}</div>
                  <div className="docs-mini-port">:{service.port}</div>
                  <p>{service.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header compact">
              <div>
                <div className="card-title">What is fixed in this build</div>
                <div className="card-subtitle">
                  The platform is positioned as a live workspace instead of a
                  mock demo.
                </div>
              </div>
            </div>
            <div className="list-stack">
              <div className="list-row">
                <div className="list-row-title">
                  Analytics uses live service data
                </div>
                <div className="list-row-meta">
                  Revenue, financing, partner contribution, and KPI summaries
                  are aggregated from the backend services.
                </div>
              </div>
              <div className="list-row">
                <div className="list-row-title">
                  Search unwraps gateway payloads correctly
                </div>
                <div className="list-row-meta">
                  Customer, vehicle, and deal search results come from real
                  gateway responses instead of silently collapsing to empty
                  arrays.
                </div>
              </div>
              <div className="list-row">
                <div className="list-row-title">
                  Finance review creation uses readable vehicle records
                </div>
                <div className="list-row-meta">
                  Review creation now resolves application vehicle IDs into
                  human-readable descriptions.
                </div>
              </div>
              <div className="list-row">
                <div className="list-row-title">
                  Notifications and audit activity are surfaced together
                </div>
                <div className="list-row-meta">
                  Mutating actions now create audit logs and user-visible
                  notifications for operators.
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {activeSection === "modules" ? (
        <div className="docs-grid">
          {filteredModules.map((module) => {
            const Icon = module.icon;
            return (
              <div key={module.id} className="card docs-card">
                <div className="card-header compact">
                  <div>
                    <div className="docs-card-title">
                      <Icon size={16} />
                      {module.title}
                    </div>
                    <div className="card-subtitle">{module.owner}</div>
                  </div>
                  <code className="docs-route">{module.route}</code>
                </div>
                <div className="docs-card-body">
                  <p>{module.description}</p>
                  <div className="pill-list">
                    {module.capabilities.map((capability) => (
                      <span key={capability} className="pill">
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          {!filteredModules.length ? (
            <div className="empty-state">
              <h3>No module matches</h3>
              <p>
                Try a different search term such as finance, analytics,
                document, or partner.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {activeSection === "workflows" ? (
        <div className="docs-grid">
          {filteredWorkflows.map((workflow) => (
            <div key={workflow.id} className="card docs-card">
              <div className="card-header compact">
                <div>
                  <div className="card-title">{workflow.title}</div>
                  <div className="card-subtitle">{workflow.outcome}</div>
                </div>
              </div>
              <div className="docs-step-list">
                {workflow.steps.map((step, index) => (
                  <div key={step} className="docs-step">
                    <span className="docs-step-index">{index + 1}</span>
                    <div className="docs-step-text">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {!filteredWorkflows.length ? (
            <div className="empty-state">
              <h3>No workflow matches</h3>
              <p>Search for onboarding, inventory, finance, or growth.</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {activeSection === "operations" ? (
        <div className="docs-stack">
          {filteredOperations.map((item) => (
            <details key={item.id} className="card docs-disclosure" open>
              <summary>
                <span>{item.title}</span>
                <span className="docs-summary-meta">{item.summary}</span>
              </summary>
              <div className="docs-disclosure-body">
                <div>
                  <div className="docs-section-label">Commands</div>
                  {item.commands.map((command) => (
                    <code key={command} className="docs-snippet">
                      {command}
                    </code>
                  ))}
                </div>
                <div>
                  <div className="docs-section-label">Verification</div>
                  <div className="pill-list">
                    {item.checks.map((check) => (
                      <span key={check} className="pill">
                        {check}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>
      ) : null}

      {activeSection === "data" ? (
        <div className="docs-grid docs-grid-tight">
          {filteredDataModel.map((item) => (
            <div key={item.name} className="card docs-card">
              <div className="card-header compact">
                <div>
                  <div className="card-title">{item.name}</div>
                  <div className="card-subtitle">
                    Primary records and ownership model
                  </div>
                </div>
              </div>
              <div className="docs-card-body">
                <p>{item.entities}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {activeSection === "support" ? (
        <div className="docs-stack">
          <div className="card">
            <div className="card-header compact">
              <div>
                <div className="card-title">Support and troubleshooting</div>
                <div className="card-subtitle">
                  Quick answers for the issues operators will hit most often.
                </div>
              </div>
            </div>
            <div className="docs-support-list">
              {filteredSupport.map((topic) => (
                <details key={topic.id} className="docs-support-item" open>
                  <summary>{topic.title}</summary>
                  <p>{topic.body}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header compact">
              <div>
                <div className="card-title">Admin quick references</div>
                <div className="card-subtitle">
                  Fast reminders for day-to-day platform ownership.
                </div>
              </div>
            </div>
            <div className="list-stack">
              <div className="list-row">
                <div className="docs-card-title">
                  <ShieldCheck size={16} /> Authentication
                </div>
                <div className="list-row-meta">
                  Use the seeded admin or supplier credentials from the login
                  screen when working locally.
                </div>
              </div>
              <div className="list-row">
                <div className="docs-card-title">
                  <Network size={16} /> Runtime model
                </div>
                <div className="list-row-meta">
                  The platform runs fully through native npm processes and local
                  SQLite persistence. Docker is no longer required for local
                  verification.
                </div>
              </div>
              <div className="list-row">
                <div className="docs-card-title">
                  <ScrollText size={16} /> Auditability
                </div>
                <div className="list-row-meta">
                  Create, update, approve, reject, and delete flows are designed
                  to appear in audit logs and notifications for support
                  visibility.
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
