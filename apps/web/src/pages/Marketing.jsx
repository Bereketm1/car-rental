import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@mui/material";
import {
  BadgeDollarSign,
  Megaphone,
  Share2,
  TrendingUp,
  UserPlus,
  UsersRound,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../api";
import DataTable from "../components/DataTable";
import MetricCard from "../components/MetricCard";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import { useToast } from "../components/Toast";
import { formatCurrency, formatPercent, safeArray } from "../utils/format";

const emptyLead = {
  name: "",
  email: "",
  phone: "",
  source: "website",
  vehicleInterest: "",
  campaignId: "",
  notes: "",
};

const emptyCampaign = {
  name: "",
  type: "digital",
  budget: "",
  startDate: "",
  endDate: "",
  description: "",
};

const emptyReferral = {
  referrerName: "",
  referrerEmail: "",
  referredName: "",
  referredEmail: "",
  reward: "",
};

export default function Marketing() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("leads");
  const [activeModal, setActiveModal] = useState(null);

  const [leads, setLeads] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [referrals, setReferrals] = useState([]);

  const [leadForm, setLeadForm] = useState(emptyLead);
  const [campaignForm, setCampaignForm] = useState(emptyCampaign);
  const [referralForm, setReferralForm] = useState(emptyReferral);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [leadRes, campaignRes, referralRes] = await Promise.all([
        api.get("/leads").catch(() => []),
        api.get("/leads/campaigns/all").catch(() => []),
        api.get("/leads/referrals/all").catch(() => []),
      ]);

      setLeads(safeArray(leadRes));
      setCampaigns(safeArray(campaignRes));
      setReferrals(safeArray(referralRes));
    } finally {
      setLoading(false);
    }
  }

  async function createLead(event) {
    event.preventDefault();
    try {
      await api.post("/leads", leadForm);
      toast.success("Lead captured");
      setLeadForm(emptyLead);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || "Unable to capture lead.");
    }
  }

  async function createCampaign(event) {
    event.preventDefault();
    try {
      await api.post("/leads/campaigns", {
        ...campaignForm,
        budget: Number(campaignForm.budget || 0),
      });
      toast.success("Campaign created");
      setCampaignForm(emptyCampaign);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || "Unable to create campaign.");
    }
  }

  async function createReferral(event) {
    event.preventDefault();
    try {
      await api.post("/leads/referrals", {
        ...referralForm,
        reward: Number(referralForm.reward || 0),
      });
      toast.success("Referral record created");
      setReferralForm(emptyReferral);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || "Unable to create referral.");
    }
  }

  async function updateLeadStatus(leadId, status) {
    try {
      await api.put(`/leads/${leadId}`, { status });
      toast.success(`Lead moved to ${status}`);
      await loadData();
    } catch (error) {
      toast.error(error.message || "Unable to update lead status.");
    }
  }

  async function updateCampaignStatus(campaignId, status) {
    try {
      await api.put(`/leads/campaigns/${campaignId}`, { status });
      toast.success(`Campaign updated to ${status}`);
      await loadData();
    } catch (error) {
      toast.error(error.message || "Unable to update campaign status.");
    }
  }

  async function deleteLead(leadId) {
    if (!window.confirm("Delete this lead?")) {
      return;
    }

    try {
      await api.delete(`/leads/${leadId}`);
      toast.success("Lead deleted");
      await loadData();
    } catch (error) {
      toast.error(error.message || "Unable to delete lead.");
    }
  }

  const conversionRate = useMemo(
    () =>
      leads.length
        ? (leads.filter((lead) => lead.status === "converted").length /
            leads.length) *
          100
        : 0,
    [leads],
  );

  const totalBudget = useMemo(
    () =>
      campaigns.reduce(
        (sum, campaign) => sum + Number(campaign.budget || 0),
        0,
      ),
    [campaigns],
  );

  const campaignTrendData = useMemo(
    () =>
      campaigns.map((campaign) => ({
        name: campaign.name,
        leads: Number(campaign.leadsGenerated || 0),
        conversions: Number(campaign.conversions || 0),
      })),
    [campaigns],
  );

  const leadColumns = [
    {
      key: "name",
      label: "Lead",
      sortable: true,
      render: (value, lead) => (
        <div>
          <div className="list-row-title">
            {value ||
              `${lead.firstName || ""} ${lead.lastName || ""}`.trim() ||
              "Unnamed lead"}
          </div>
          <div className="list-row-meta">
            {lead.email || "No email"} • {lead.phone || "No phone"}
          </div>
        </div>
      ),
    },
    {
      key: "source",
      label: "Source",
      sortable: true,
      render: (value) => value || "unknown",
    },
    {
      key: "vehicleInterest",
      label: "Vehicle interest",
      sortable: true,
      render: (value) => value || "Not specified",
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => <StatusBadge value={value || "new"} compact />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, lead) => (
        <div className="toolbar-cluster wrap">
          <button
            className="btn btn-sm btn-outline-secondary"
            type="button"
            onClick={() => updateLeadStatus(lead.id, "contacted")}
          >
            Contacted
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            type="button"
            onClick={() => updateLeadStatus(lead.id, "qualified")}
          >
            Qualified
          </button>
          <button
            className="btn btn-sm btn-outline-success"
            type="button"
            onClick={() => updateLeadStatus(lead.id, "converted")}
          >
            Converted
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            type="button"
            onClick={() => deleteLead(lead.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const campaignColumns = [
    { key: "name", label: "Campaign", sortable: true },
    { key: "type", label: "Type", sortable: true },
    {
      key: "budget",
      label: "Budget",
      sortable: true,
      render: (value) => formatCurrency(value || 0),
    },
    {
      key: "leadsGenerated",
      label: "Leads",
      sortable: true,
      render: (value) => value || 0,
    },
    {
      key: "conversions",
      label: "Conversions",
      sortable: true,
      render: (value) => value || 0,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => <StatusBadge value={value || "draft"} compact />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, campaign) => (
        <div className="toolbar-cluster wrap">
          <button
            className="btn btn-sm btn-outline-primary"
            type="button"
            onClick={() => updateCampaignStatus(campaign.id, "active")}
          >
            Activate
          </button>
          <button
            className="btn btn-sm btn-outline-warning"
            type="button"
            onClick={() => updateCampaignStatus(campaign.id, "paused")}
          >
            Pause
          </button>
          <button
            className="btn btn-sm btn-outline-success"
            type="button"
            onClick={() => updateCampaignStatus(campaign.id, "completed")}
          >
            Complete
          </button>
        </div>
      ),
    },
  ];

  const referralColumns = [
    { key: "referrerName", label: "Referrer", sortable: true },
    { key: "referredName", label: "Referred lead", sortable: true },
    {
      key: "reward",
      label: "Reward",
      sortable: true,
      render: (value) => formatCurrency(value || 0),
    },
    {
      key: "status",
      label: "Referral status",
      sortable: true,
      render: (value) => <StatusBadge value={value || "pending"} compact />,
    },
    {
      key: "rewardStatus",
      label: "Reward status",
      sortable: true,
      render: (value) => <StatusBadge value={value || "pending"} compact />,
    },
  ];

  if (loading) {
    return (
      <div className="page-shell">
        <div className="empty-state">
          <h3>Loading marketing module...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header row-between">
        <div>
          <h1>Lead generation and marketing system</h1>
          <p>
            Capture prospects, operate campaigns, run referrals, and monitor
            conversion quality across acquisition channels.
          </p>
        </div>
        <div className="toolbar-cluster wrap">
          <Button
            variant="outlined"
            size="small"
            startIcon={<Megaphone size={16} />}
            onClick={() => setActiveModal("campaign")}
          >
            Create campaign
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Share2 size={16} />}
            onClick={() => setActiveModal("referral")}
          >
            Add referral
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<UserPlus size={16} />}
            onClick={() => setActiveModal("lead")}
          >
            Capture lead
          </Button>
        </div>
      </div>

      <div className="stats-grid">
        <MetricCard
          icon={UsersRound}
          label="Leads"
          value={leads.length}
          detail="Current lead pool"
          tone="accent"
        />
        <MetricCard
          icon={TrendingUp}
          label="Conversion rate"
          value={formatPercent(conversionRate)}
          detail="Converted vs total leads"
          tone="success"
        />
        <MetricCard
          icon={Megaphone}
          label="Campaigns"
          value={campaigns.length}
          detail="Active and draft initiatives"
          tone="info"
        />
        <MetricCard
          icon={BadgeDollarSign}
          label="Total budget"
          value={formatCurrency(totalBudget, {
            compact: true,
            maximumFractionDigits: 1,
          })}
          detail="Allocated campaign spend"
          tone="warning"
        />
      </div>

      <div className="tabs">
        <button
          className={`tab ${tab === "leads" ? "active" : ""}`}
          type="button"
          onClick={() => setTab("leads")}
        >
          Lead capture
        </button>
        <button
          className={`tab ${tab === "campaigns" ? "active" : ""}`}
          type="button"
          onClick={() => setTab("campaigns")}
        >
          Campaign tracking
        </button>
        <button
          className={`tab ${tab === "referrals" ? "active" : ""}`}
          type="button"
          onClick={() => setTab("referrals")}
        >
          Referral program
        </button>
      </div>

      <DataTable
        title={
          tab === "leads"
            ? "Lead pipeline"
            : tab === "campaigns"
              ? "Campaign tracker"
              : "Referral ledger"
        }
        subtitle="Simple but powerful CRM-style operations with filters and sort."
        columns={
          tab === "leads"
            ? leadColumns
            : tab === "campaigns"
              ? campaignColumns
              : referralColumns
        }
        data={
          tab === "leads" ? leads : tab === "campaigns" ? campaigns : referrals
        }
        filters={
          tab === "leads"
            ? [
                {
                  key: "status",
                  label: "Lead status",
                  options: [
                    { label: "New", value: "new" },
                    { label: "Contacted", value: "contacted" },
                    { label: "Qualified", value: "qualified" },
                    { label: "Converted", value: "converted" },
                  ],
                },
              ]
            : tab === "campaigns"
              ? [
                  {
                    key: "status",
                    label: "Campaign status",
                    options: [
                      { label: "Draft", value: "draft" },
                      { label: "Active", value: "active" },
                      { label: "Paused", value: "paused" },
                      { label: "Completed", value: "completed" },
                    ],
                  },
                ]
              : [
                  {
                    key: "status",
                    label: "Referral status",
                    options: [
                      { label: "Pending", value: "pending" },
                      { label: "Contacted", value: "contacted" },
                      { label: "Converted", value: "converted" },
                    ],
                  },
                ]
        }
        searchPlaceholder={
          tab === "leads"
            ? "Search lead name, source, interest, or status"
            : tab === "campaigns"
              ? "Search campaign name, type, status, or budget"
              : "Search referrals by referrer, referred lead, or status"
        }
      />

      <div className="section-grid two-up">
        <div className="card chart-card">
          <div className="card-header compact">
            <div>
              <div className="card-title">Campaign performance curve</div>
              <div className="card-subtitle">
                Leads generated versus conversions by campaign.
              </div>
            </div>
          </div>
          <div className="chart-shell">
            {campaignTrendData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={campaignTrendData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="var(--border-color)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: "var(--text-muted)" }}
                  />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey="leads"
                    stroke="#2F73C9"
                    strokeWidth={2.2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="conversions"
                    stroke="#2F8E75"
                    strokeWidth={2.2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state compact">
                <h3>No campaign data</h3>
                <p>Create campaigns to unlock marketing analytics.</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header compact">
            <div>
              <div className="card-title">Lead status pulse</div>
              <div className="card-subtitle">
                Current movement across capture-to-conversion lifecycle.
              </div>
            </div>
          </div>
          <div className="list-stack">
            {[
              { label: "New leads", status: "new" },
              { label: "Contacted", status: "contacted" },
              { label: "Qualified", status: "qualified" },
              { label: "Converted", status: "converted" },
            ].map((item) => (
              <div key={item.status} className="list-row">
                <div className="list-row-head">
                  <div className="list-row-title">{item.label}</div>
                  <StatusBadge value={item.status} compact />
                </div>
                <div className="list-row-meta">
                  {leads.filter((lead) => lead.status === item.status).length}{" "}
                  lead(s)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={activeModal === "lead"}
        onClose={() => setActiveModal(null)}
        title="Capture lead"
        subtitle="Add a new prospect to the lead pipeline."
        size="large"
      >
        <form className="form-grid" onSubmit={createLead}>
          <div className="form-group">
            <label>Name</label>
            <input
              value={leadForm.name}
              onChange={(event) =>
                setLeadForm({ ...leadForm, name: event.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={leadForm.email}
              onChange={(event) =>
                setLeadForm({ ...leadForm, email: event.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              value={leadForm.phone}
              onChange={(event) =>
                setLeadForm({ ...leadForm, phone: event.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Source</label>
            <select
              value={leadForm.source}
              onChange={(event) =>
                setLeadForm({ ...leadForm, source: event.target.value })
              }
            >
              <option value="website">Website</option>
              <option value="social_media">Social media</option>
              <option value="partner">Partner</option>
              <option value="referral">Referral</option>
              <option value="campaign">Campaign</option>
            </select>
          </div>
          <div className="form-group">
            <label>Campaign (optional)</label>
            <select
              value={leadForm.campaignId}
              onChange={(event) =>
                setLeadForm({ ...leadForm, campaignId: event.target.value })
              }
            >
              <option value="">No campaign</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Vehicle interest</label>
            <input
              value={leadForm.vehicleInterest}
              onChange={(event) =>
                setLeadForm({
                  ...leadForm,
                  vehicleInterest: event.target.value,
                })
              }
            />
          </div>
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label>Notes</label>
            <textarea
              value={leadForm.notes}
              onChange={(event) =>
                setLeadForm({ ...leadForm, notes: event.target.value })
              }
            />
          </div>
          <div className="modal-actions" style={{ gridColumn: "1 / -1" }}>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setActiveModal(null)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              <UserPlus size={15} /> Capture lead
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={activeModal === "campaign"}
        onClose={() => setActiveModal(null)}
        title="Create campaign"
        subtitle="Track spend, period, and performance impact."
        size="large"
      >
        <form className="form-grid" onSubmit={createCampaign}>
          <div className="form-group">
            <label>Name</label>
            <input
              value={campaignForm.name}
              onChange={(event) =>
                setCampaignForm({ ...campaignForm, name: event.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select
              value={campaignForm.type}
              onChange={(event) =>
                setCampaignForm({ ...campaignForm, type: event.target.value })
              }
            >
              <option value="digital">Digital</option>
              <option value="social">Social</option>
              <option value="event">Event</option>
              <option value="referral">Referral</option>
            </select>
          </div>
          <div className="form-group">
            <label>Budget</label>
            <input
              type="number"
              value={campaignForm.budget}
              onChange={(event) =>
                setCampaignForm({ ...campaignForm, budget: event.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Start date</label>
            <input
              type="date"
              value={campaignForm.startDate}
              onChange={(event) =>
                setCampaignForm({
                  ...campaignForm,
                  startDate: event.target.value,
                })
              }
            />
          </div>
          <div className="form-group">
            <label>End date</label>
            <input
              type="date"
              value={campaignForm.endDate}
              onChange={(event) =>
                setCampaignForm({
                  ...campaignForm,
                  endDate: event.target.value,
                })
              }
            />
          </div>
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label>Description</label>
            <textarea
              value={campaignForm.description}
              onChange={(event) =>
                setCampaignForm({
                  ...campaignForm,
                  description: event.target.value,
                })
              }
            />
          </div>
          <div className="modal-actions" style={{ gridColumn: "1 / -1" }}>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setActiveModal(null)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              <Megaphone size={15} /> Create campaign
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={activeModal === "referral"}
        onClose={() => setActiveModal(null)}
        title="Create referral record"
        subtitle="Register referrals and reward obligations."
        size="large"
      >
        <form className="form-grid" onSubmit={createReferral}>
          <div className="form-group">
            <label>Referrer name</label>
            <input
              value={referralForm.referrerName}
              onChange={(event) =>
                setReferralForm({
                  ...referralForm,
                  referrerName: event.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Referrer email</label>
            <input
              type="email"
              value={referralForm.referrerEmail}
              onChange={(event) =>
                setReferralForm({
                  ...referralForm,
                  referrerEmail: event.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Referred name</label>
            <input
              value={referralForm.referredName}
              onChange={(event) =>
                setReferralForm({
                  ...referralForm,
                  referredName: event.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Referred email</label>
            <input
              type="email"
              value={referralForm.referredEmail}
              onChange={(event) =>
                setReferralForm({
                  ...referralForm,
                  referredEmail: event.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Reward</label>
            <input
              type="number"
              value={referralForm.reward}
              onChange={(event) =>
                setReferralForm({ ...referralForm, reward: event.target.value })
              }
            />
          </div>
          <div className="modal-actions" style={{ gridColumn: "1 / -1" }}>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setActiveModal(null)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              <Share2 size={15} /> Create referral
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
