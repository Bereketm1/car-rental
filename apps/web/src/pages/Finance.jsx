import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@mui/material";
import {
  Building2,
  CheckCircle2,
  FileWarning,
  Landmark,
  ShieldX,
  WalletCards,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
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
import { formatCurrency, formatDateTime, safeArray } from "../utils/format";

const emptyReviewForm = {
  applicationId: "",
  dealId: "",
  institutionId: "",
  institution: "",
  customerName: "",
  vehicleDescription: "",
  requestedAmount: "",
  termMonths: "48",
  interestRate: "12.5",
  notes: "",
};

const emptyInstitutionForm = {
  name: "",
  code: "",
  type: "bank",
  contactPerson: "",
  email: "",
  phone: "",
  maxLoanAmount: "",
  interestRate: "12",
  maxTerm: "60",
};

const emptyRequestForm = {
  reviewId: "",
  documentType: "",
  description: "",
};

export default function Finance() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("reviews");
  const [activeModal, setActiveModal] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [pipeline, setPipeline] = useState({});
  const [applications, setApplications] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [reviewForm, setReviewForm] = useState(emptyReviewForm);
  const [institutionForm, setInstitutionForm] = useState(emptyInstitutionForm);
  const [requestForm, setRequestForm] = useState(emptyRequestForm);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [
        reviewRes,
        institutionRes,
        pipelineRes,
        applicationRes,
        vehicleRes,
      ] = await Promise.all([
        api.get("/finance/reviews").catch(() => []),
        api.get("/finance/institutions").catch(() => []),
        api.get("/finance/pipeline").catch(() => ({})),
        api.get("/customers/loan-applications/all").catch(() => []),
        api.get("/vehicles").catch(() => []),
      ]);

      setReviews(safeArray(reviewRes));
      setInstitutions(safeArray(institutionRes));
      setPipeline(pipelineRes || {});
      setApplications(safeArray(applicationRes));
      setVehicles(safeArray(vehicleRes));
    } finally {
      setLoading(false);
    }
  }

  async function submitReview(event) {
    event.preventDefault();
    try {
      await api.post("/finance/reviews", {
        ...reviewForm,
        requestedAmount: Number(reviewForm.requestedAmount),
        interestRate: Number(reviewForm.interestRate),
        termMonths: Number(reviewForm.termMonths),
        term: Number(reviewForm.termMonths),
      });
      toast.success("Loan review created");
      setReviewForm(emptyReviewForm);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || "Unable to create loan review.");
    }
  }

  async function submitInstitution(event) {
    event.preventDefault();
    try {
      await api.post("/finance/institutions", {
        ...institutionForm,
        maxLoanAmount: Number(institutionForm.maxLoanAmount),
        interestRate: Number(institutionForm.interestRate),
        maxTerm: Number(institutionForm.maxTerm),
      });
      toast.success("Institution registered");
      setInstitutionForm(emptyInstitutionForm);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || "Unable to register institution.");
    }
  }

  async function submitDocumentRequest(event) {
    event.preventDefault();
    try {
      await api.post("/finance/document-requests", requestForm);
      toast.success("Document request sent");
      setRequestForm(emptyRequestForm);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || "Unable to request document.");
    }
  }

  async function approveReview(review) {
    try {
      await api.post(`/finance/reviews/${review.id}/approve`, {
        approvedAmount: Number(review.requestedAmount || 0),
        notes: "Approved by financial institution portal",
      });
      toast.success("Financing approved");
      await loadData();
    } catch (error) {
      toast.error(error.message || "Unable to approve review.");
    }
  }

  async function rejectReview(reviewId) {
    try {
      await api.post(`/finance/reviews/${reviewId}/reject`, {
        reason: "Rejected by financial institution portal",
      });
      toast.info("Financing rejected");
      await loadData();
    } catch (error) {
      toast.error(error.message || "Unable to reject review.");
    }
  }

  async function markInReview(reviewId) {
    try {
      await api.put(`/finance/reviews/${reviewId}`, { status: "in_review" });
      toast.success("Review moved to in_review");
      await loadData();
    } catch (error) {
      toast.error(error.message || "Unable to update review status.");
    }
  }

  const documentRequests = useMemo(
    () =>
      reviews.flatMap((review) =>
        safeArray(review.documentRequests).map((request) => ({
          ...request,
          review,
        })),
      ),
    [reviews],
  );

  const pipelineChartData = useMemo(
    () => [
      { name: "Pending", value: pipeline.pending || 0 },
      { name: "In Review", value: pipeline.inReview || 0 },
      { name: "Approved", value: pipeline.approved || 0 },
      { name: "Rejected", value: pipeline.rejected || 0 },
      { name: "More Info", value: pipeline.moreInfoNeeded || 0 },
    ],
    [pipeline],
  );

  const institutionMap = useMemo(
    () =>
      Object.fromEntries(
        institutions.map((institution) => [institution.id, institution]),
      ),
    [institutions],
  );
  const vehicleMap = useMemo(
    () => Object.fromEntries(vehicles.map((vehicle) => [vehicle.id, vehicle])),
    [vehicles],
  );

  function describeVehicle(vehicleId, fallback = "") {
    const vehicle = vehicleMap[vehicleId];
    if (!vehicle) {
      return fallback || "Vehicle pending";
    }

    return [vehicle.year, vehicle.make, vehicle.model]
      .filter(Boolean)
      .join(" ");
  }

  const reviewColumns = [
    {
      key: "customerName",
      label: "Customer",
      sortable: true,
      render: (value) => value || "Customer pending",
    },
    {
      key: "vehicleDescription",
      label: "Vehicle",
      sortable: true,
      render: (value) => value || "Vehicle pending",
    },
    {
      key: "requestedAmount",
      label: "Requested",
      sortable: true,
      render: (value) => formatCurrency(value || 0),
    },
    {
      key: "institution",
      label: "Institution",
      sortable: true,
      render: (value, row) =>
        value || institutionMap[row.institutionId]?.name || "Not assigned",
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => <StatusBadge value={value || "pending"} compact />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, review) => (
        <div className="toolbar-cluster wrap">
          <button
            className="btn btn-sm btn-outline-primary"
            type="button"
            onClick={() => markInReview(review.id)}
          >
            In Review
          </button>
          <button
            className="btn btn-sm btn-outline-success"
            type="button"
            onClick={() => approveReview(review)}
          >
            Approve
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            type="button"
            onClick={() => rejectReview(review.id)}
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  const institutionColumns = [
    { key: "name", label: "Institution", sortable: true },
    { key: "code", label: "Code", sortable: true },
    { key: "type", label: "Type", sortable: true },
    {
      key: "contactPerson",
      label: "Contact",
      render: (value) => value || "Not set",
    },
    {
      key: "maxLoanAmount",
      label: "Max loan",
      sortable: true,
      render: (value) => formatCurrency(value || 0),
    },
    {
      key: "interestRate",
      label: "Rate",
      sortable: true,
      render: (value) => `${value || 0}%`,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge value={value || "active"} compact />,
    },
  ];

  const requestColumns = [
    {
      key: "reviewId",
      label: "Review reference",
      render: (_, request) =>
        `${request.review?.customerName || "Customer"} • ${request.review?.vehicleDescription || "Vehicle"}`,
    },
    { key: "documentType", label: "Document type", sortable: true },
    {
      key: "description",
      label: "Description",
      render: (value) => value || "No detail",
    },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge value={value || "requested"} compact />,
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (value) => formatDateTime(value),
    },
  ];

  if (loading) {
    return (
      <div className="page-shell">
        <div className="empty-state">
          <h3>Loading financial portal...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header row-between">
        <div>
          <h1>Financial institution portal</h1>
          <p>
            Review applications, request support documents, approve or reject
            financing, and keep pipeline visibility at executive level.
          </p>
        </div>
        <div className="toolbar-cluster wrap">
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileWarning size={16} />}
            onClick={() => setActiveModal("request")}
          >
            Request document
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Building2 size={16} />}
            onClick={() => setActiveModal("institution")}
          >
            Add institution
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<WalletCards size={16} />}
            onClick={() => setActiveModal("review")}
          >
            Create review
          </Button>
        </div>
      </div>

      <div className="stats-grid">
        <MetricCard
          icon={WalletCards}
          label="Loan reviews"
          value={reviews.length}
          detail="Financing files in review desk"
          tone="accent"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Approved"
          value={pipeline.approved || 0}
          detail="Files cleared for financing"
          tone="success"
        />
        <MetricCard
          icon={ShieldX}
          label="Rejected"
          value={pipeline.rejected || 0}
          detail="Files declined"
          tone="danger"
        />
        <MetricCard
          icon={Landmark}
          label="Institutions"
          value={institutions.length}
          detail="Active lenders in network"
          tone="info"
        />
      </div>

      <div className="tabs">
        <button
          className={`tab ${tab === "reviews" ? "active" : ""}`}
          type="button"
          onClick={() => setTab("reviews")}
        >
          Review desk
        </button>
        <button
          className={`tab ${tab === "institutions" ? "active" : ""}`}
          type="button"
          onClick={() => setTab("institutions")}
        >
          Institution registry
        </button>
        <button
          className={`tab ${tab === "requests" ? "active" : ""}`}
          type="button"
          onClick={() => setTab("requests")}
        >
          Document requests
        </button>
      </div>

      <DataTable
        title={
          tab === "reviews"
            ? "Loan reviews"
            : tab === "institutions"
              ? "Financial institutions"
              : "Document requests"
        }
        subtitle="Finance operations with sort/filter controls and direct workflow actions."
        columns={
          tab === "reviews"
            ? reviewColumns
            : tab === "institutions"
              ? institutionColumns
              : requestColumns
        }
        data={
          tab === "reviews"
            ? reviews
            : tab === "institutions"
              ? institutions
              : documentRequests
        }
        filters={
          tab === "reviews"
            ? [
                {
                  key: "status",
                  label: "Review status",
                  options: [
                    { label: "Pending", value: "pending" },
                    { label: "In Review", value: "in_review" },
                    { label: "Approved", value: "approved" },
                    { label: "Rejected", value: "rejected" },
                    { label: "More Info Needed", value: "more_info_needed" },
                  ],
                },
              ]
            : tab === "institutions"
              ? [
                  {
                    key: "type",
                    label: "Institution type",
                    options: [
                      { label: "Bank", value: "bank" },
                      { label: "Lender", value: "lender" },
                      { label: "Microfinance", value: "microfinance" },
                    ],
                  },
                ]
              : [
                  {
                    key: "status",
                    label: "Request status",
                    options: [
                      { label: "Requested", value: "requested" },
                      { label: "Submitted", value: "submitted" },
                    ],
                  },
                ]
        }
        searchPlaceholder={
          tab === "reviews"
            ? "Search customer, vehicle, institution, or status"
            : tab === "institutions"
              ? "Search institution name, code, contact, or type"
              : "Search request type, description, or status"
        }
      />

      <div className="section-grid two-up">
        <div className="card chart-card">
          <div className="card-header compact">
            <div>
              <div className="card-title">Loan pipeline status</div>
              <div className="card-subtitle">
                Current distribution across pending, in-review, approved, and
                rejected stages.
              </div>
            </div>
          </div>
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pipelineChartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 8 }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="var(--border-color)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "var(--text-muted)" }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "var(--text-muted)" }}
                />
                <RechartsTooltip />
                <Bar dataKey="value" fill="#2F73C9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header compact">
            <div>
              <div className="card-title">Recent underwriting activity</div>
              <div className="card-subtitle">
                Latest financial decisions and document events.
              </div>
            </div>
          </div>
          <div className="list-stack">
            {(tab === "requests" ? documentRequests : reviews)
              .slice(0, 6)
              .map((item) => (
                <div key={item.id} className="list-row">
                  <div className="list-row-head">
                    <div>
                      <div className="list-row-title">
                        {tab === "requests"
                          ? `${item.review?.customerName || "Customer"} • ${item.documentType}`
                          : `${item.customerName || "Customer"} • ${item.vehicleDescription || "Vehicle"}`}
                      </div>
                      <div className="list-row-meta">
                        {tab === "requests"
                          ? item.description || "Document request submitted"
                          : `${formatCurrency(item.requestedAmount || 0)} • ${item.institution || "Institution pending"}`}
                      </div>
                    </div>
                    <StatusBadge
                      value={
                        item.status ||
                        (tab === "requests" ? "requested" : "pending")
                      }
                      compact
                    />
                  </div>
                  <div className="list-row-meta">
                    {formatDateTime(item.updatedAt || item.createdAt)}
                  </div>
                </div>
              ))}
            {!(tab === "requests" ? documentRequests : reviews).length ? (
              <div className="empty-state compact">
                <h3>No activity yet</h3>
                <p>Create a review or request document to start the queue.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Modal
        open={activeModal === "review"}
        onClose={() => setActiveModal(null)}
        title="Create loan review"
        subtitle="Open a finance review for a submitted customer application."
        size="large"
      >
        <form className="form-grid" onSubmit={submitReview}>
          <div className="form-group">
            <label>Loan application</label>
            <select
              value={reviewForm.applicationId}
              onChange={(event) => {
                const app = applications.find(
                  (row) => row.id === event.target.value,
                );
                setReviewForm((current) => ({
                  ...current,
                  applicationId: event.target.value,
                  customerName: app?.customer
                    ? `${app.customer.firstName || ""} ${app.customer.lastName || ""}`.trim()
                    : current.customerName,
                  vehicleDescription: describeVehicle(
                    app?.vehicleId,
                    current.vehicleDescription || app?.vehicleDescription || "",
                  ),
                  requestedAmount:
                    app?.requestedAmount || current.requestedAmount,
                  termMonths: app?.termMonths || current.termMonths,
                }));
              }}
            >
              <option value="">Manual entry</option>
              {applications.map((application) => (
                <option key={application.id} value={application.id}>
                  {application.customer?.firstName || "Customer"}{" "}
                  {application.customer?.lastName || ""} •{" "}
                  {describeVehicle(application.vehicleId)} •{" "}
                  {formatCurrency(application.requestedAmount || 0)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Deal ID (optional)</label>
            <input
              value={reviewForm.dealId}
              onChange={(event) =>
                setReviewForm({ ...reviewForm, dealId: event.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Customer name</label>
            <input
              value={reviewForm.customerName}
              onChange={(event) =>
                setReviewForm({
                  ...reviewForm,
                  customerName: event.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Vehicle description</label>
            <input
              value={reviewForm.vehicleDescription}
              onChange={(event) =>
                setReviewForm({
                  ...reviewForm,
                  vehicleDescription: event.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Requested amount</label>
            <input
              type="number"
              value={reviewForm.requestedAmount}
              onChange={(event) =>
                setReviewForm({
                  ...reviewForm,
                  requestedAmount: event.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Term (months)</label>
            <input
              type="number"
              value={reviewForm.termMonths}
              onChange={(event) =>
                setReviewForm({ ...reviewForm, termMonths: event.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Interest rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={reviewForm.interestRate}
              onChange={(event) =>
                setReviewForm({
                  ...reviewForm,
                  interestRate: event.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Institution</label>
            <select
              value={reviewForm.institutionId}
              onChange={(event) => {
                const institution = institutions.find(
                  (row) => row.id === event.target.value,
                );
                setReviewForm((current) => ({
                  ...current,
                  institutionId: event.target.value,
                  institution: institution?.name || "",
                }));
              }}
            >
              <option value="">Select institution</option>
              {institutions.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label>Notes</label>
            <textarea
              value={reviewForm.notes}
              onChange={(event) =>
                setReviewForm({ ...reviewForm, notes: event.target.value })
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
              <WalletCards size={15} /> Create review
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={activeModal === "institution"}
        onClose={() => setActiveModal(null)}
        title="Register financial institution"
        subtitle="Add lender profile used for finance routing and approvals."
        size="large"
      >
        <form className="form-grid" onSubmit={submitInstitution}>
          <div className="form-group">
            <label>Name</label>
            <input
              value={institutionForm.name}
              onChange={(event) =>
                setInstitutionForm({
                  ...institutionForm,
                  name: event.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Code</label>
            <input
              value={institutionForm.code}
              onChange={(event) =>
                setInstitutionForm({
                  ...institutionForm,
                  code: event.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select
              value={institutionForm.type}
              onChange={(event) =>
                setInstitutionForm({
                  ...institutionForm,
                  type: event.target.value,
                })
              }
            >
              <option value="bank">Bank</option>
              <option value="lender">Lender</option>
              <option value="microfinance">Microfinance</option>
            </select>
          </div>
          <div className="form-group">
            <label>Contact person</label>
            <input
              value={institutionForm.contactPerson}
              onChange={(event) =>
                setInstitutionForm({
                  ...institutionForm,
                  contactPerson: event.target.value,
                })
              }
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={institutionForm.email}
              onChange={(event) =>
                setInstitutionForm({
                  ...institutionForm,
                  email: event.target.value,
                })
              }
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              value={institutionForm.phone}
              onChange={(event) =>
                setInstitutionForm({
                  ...institutionForm,
                  phone: event.target.value,
                })
              }
            />
          </div>
          <div className="form-group">
            <label>Max loan amount</label>
            <input
              type="number"
              value={institutionForm.maxLoanAmount}
              onChange={(event) =>
                setInstitutionForm({
                  ...institutionForm,
                  maxLoanAmount: event.target.value,
                })
              }
            />
          </div>
          <div className="form-group">
            <label>Interest rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={institutionForm.interestRate}
              onChange={(event) =>
                setInstitutionForm({
                  ...institutionForm,
                  interestRate: event.target.value,
                })
              }
            />
          </div>
          <div className="form-group">
            <label>Max term (months)</label>
            <input
              type="number"
              value={institutionForm.maxTerm}
              onChange={(event) =>
                setInstitutionForm({
                  ...institutionForm,
                  maxTerm: event.target.value,
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
              <Building2 size={15} /> Register institution
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={activeModal === "request"}
        onClose={() => setActiveModal(null)}
        title="Request documents"
        subtitle="Ask customer for missing files needed to complete underwriting."
        size="large"
      >
        <form className="form-grid" onSubmit={submitDocumentRequest}>
          <div className="form-group">
            <label>Loan review</label>
            <select
              value={requestForm.reviewId}
              onChange={(event) =>
                setRequestForm({ ...requestForm, reviewId: event.target.value })
              }
              required
            >
              <option value="">Select review</option>
              {reviews.map((review) => (
                <option key={review.id} value={review.id}>
                  {review.customerName || "Customer"} •{" "}
                  {review.vehicleDescription || "Vehicle"}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Document type</label>
            <input
              value={requestForm.documentType}
              onChange={(event) =>
                setRequestForm({
                  ...requestForm,
                  documentType: event.target.value,
                })
              }
              required
              placeholder="National ID, salary letter, bank statement"
            />
          </div>
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label>Description</label>
            <textarea
              value={requestForm.description}
              onChange={(event) =>
                setRequestForm({
                  ...requestForm,
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
              <FileWarning size={15} /> Request document
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
