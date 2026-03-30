import React, { useEffect, useMemo, useState } from 'react';
import { Building2, CircleSlash2, FileWarning, ShieldCheck, WalletCards } from 'lucide-react';
import api from '../api';
import DataTable from '../components/DataTable';
import MetricCard from '../components/MetricCard';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';
import { formatCurrency, formatDateTime, safeArray } from '../utils/format';

const emptyReviewForm = {
  customerName: '',
  vehicleDescription: '',
  requestedAmount: '',
  term: '48',
  interestRate: '12.5',
  institution: '',
  notes: '',
};

const emptyInstitutionForm = {
  name: '',
  code: '',
  type: 'bank',
  maxLoanAmount: '',
  interestRate: '12',
  maxTerm: '60',
};

const emptyRequestForm = {
  reviewId: '',
  documentType: '',
  description: '',
};

export default function Finance() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('reviews');
  const [reviews, setReviews] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [pipeline, setPipeline] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, moreInfoNeeded: 0 });
  const [reviewForm, setReviewForm] = useState(emptyReviewForm);
  const [institutionForm, setInstitutionForm] = useState(emptyInstitutionForm);
  const [requestForm, setRequestForm] = useState(emptyRequestForm);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [reviewResponse, institutionResponse, pipelineResponse] = await Promise.all([
        api.get('/finance/reviews').catch(() => []),
        api.get('/finance/institutions').catch(() => []),
        api.get('/finance/pipeline').catch(() => ({})),
      ]);

      setReviews(safeArray(reviewResponse));
      setInstitutions(safeArray(institutionResponse));
      setPipeline(pipelineResponse || {});
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateReview(event) {
    event.preventDefault();
    try {
      await api.post('/finance/reviews', {
        ...reviewForm,
        requestedAmount: Number(reviewForm.requestedAmount),
        term: Number(reviewForm.term),
        interestRate: Number(reviewForm.interestRate),
      });
      toast.success('Loan review created');
      setReviewForm(emptyReviewForm);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to create review');
    }
  }

  async function handleCreateInstitution(event) {
    event.preventDefault();
    try {
      await api.post('/finance/institutions', {
        ...institutionForm,
        maxLoanAmount: Number(institutionForm.maxLoanAmount),
        interestRate: Number(institutionForm.interestRate),
        maxTerm: Number(institutionForm.maxTerm),
      });
      toast.success('Financial institution added');
      setInstitutionForm(emptyInstitutionForm);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to create institution');
    }
  }

  async function handleCreateRequest(event) {
    event.preventDefault();
    try {
      await api.post('/finance/document-requests', requestForm);
      toast.success('Document request sent');
      setRequestForm(emptyRequestForm);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to request document');
    }
  }

  async function handleApprove(id) {
    try {
      await api.post(`/finance/reviews/${id}/approve`, { approvedAmount: 0, notes: 'Approved from finance portal' });
      toast.success('Financing approved');
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to approve review');
    }
  }

  async function handleReject(id) {
    try {
      await api.post(`/finance/reviews/${id}/reject`, { reason: 'Rejected from finance portal' });
      toast.info('Financing rejected');
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to reject review');
    }
  }

  const documentRequests = useMemo(
    () => reviews.flatMap((review) => (review.documentRequests || []).map((request) => ({ ...request, review }))),
    [reviews],
  );

  const reviewColumns = [
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'vehicleDescription', label: 'Vehicle', sortable: true },
    { key: 'requestedAmount', label: 'Requested', sortable: true, render: (value) => formatCurrency(value) },
    { key: 'institution', label: 'Institution', sortable: true },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge value={value || 'pending'} compact /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, review) => (
        <div className="toolbar-cluster">
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => handleApprove(review.id)}>Approve</button>
          <button className="btn btn-danger btn-sm" type="button" onClick={() => handleReject(review.id)}>Reject</button>
        </div>
      ),
    },
  ];

  const institutionColumns = [
    { key: 'name', label: 'Institution', sortable: true },
    { key: 'code', label: 'Code', sortable: true },
    { key: 'type', label: 'Type' },
    { key: 'maxLoanAmount', label: 'Max loan', render: (value) => formatCurrency(value) },
    { key: 'interestRate', label: 'Rate', render: (value) => `${value}%` },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge value={value || 'active'} compact /> },
  ];

  const requestColumns = [
    {
      key: 'reviewId',
      label: 'Review',
      render: (_, request) => `${request.review?.customerName || 'Customer'} · ${request.review?.vehicleDescription || 'Vehicle'}`,
    },
    { key: 'documentType', label: 'Document type', sortable: true },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge value={value || 'requested'} compact /> },
    { key: 'createdAt', label: 'Created', render: (value) => formatDateTime(value) },
  ];

  const primaryAction = {
    reviews: {
      label: 'Create review',
      icon: WalletCards,
      modal: 'review',
    },
    institutions: {
      label: 'Register institution',
      icon: Building2,
      modal: 'institution',
    },
    requests: {
      label: 'Request document',
      icon: FileWarning,
      modal: 'request',
    },
  }[tab];

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-header"><Skeleton type="title" style={{ width: '31%' }} /></div>
        <div className="stats-grid"><Skeleton type="stat" count={4} /></div>
        <div className="section-grid"><Skeleton type="card" style={{ height: '520px' }} /><Skeleton type="card" style={{ height: '520px' }} /></div>
      </div>
    );
  }

  const PrimaryActionIcon = primaryAction.icon;

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>Financial institution portal</h1>
          <p>Review loan files, coordinate supporting documents, register lending partners, and monitor the financing pipeline.</p>
        </div>
        <div className="pill-list">
          <span className="pill">Loan reviews</span>
          <span className="pill">Lender network</span>
          <span className="pill">Document requests</span>
        </div>
      </div>

      <div className="stats-grid">
        <MetricCard icon={WalletCards} label="Reviews" value={reviews.length} detail="Total financing files" tone="accent" />
        <MetricCard icon={ShieldCheck} label="Approved" value={pipeline.approved || 0} detail="Files cleared for financing" tone="success" />
        <MetricCard icon={CircleSlash2} label="Rejected" value={pipeline.rejected || 0} detail="Files declined by institutions" tone="danger" />
        <MetricCard icon={Building2} label="Institutions" value={institutions.length} detail="Active lenders in the marketplace" tone="info" />
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'reviews' ? 'active' : ''}`} type="button" onClick={() => setTab('reviews')}>Review desk</button>
        <button className={`tab ${tab === 'institutions' ? 'active' : ''}`} type="button" onClick={() => setTab('institutions')}>Institution registry</button>
        <button className={`tab ${tab === 'requests' ? 'active' : ''}`} type="button" onClick={() => setTab('requests')}>Document requests</button>
      </div>

      <DataTable
        title={tab === 'reviews' ? 'Active reviews' : tab === 'institutions' ? 'Financial institutions' : 'Requested documents'}
        subtitle="Everything needed to keep financing decisions moving without leaving the workspace."
        actions={(
          <button className="btn btn-primary" type="button" onClick={() => setActiveModal(primaryAction.modal)}>
            <PrimaryActionIcon size={16} /> {primaryAction.label}
          </button>
        )}
        columns={tab === 'reviews' ? reviewColumns : tab === 'institutions' ? institutionColumns : requestColumns}
        data={tab === 'reviews' ? reviews : tab === 'institutions' ? institutions : documentRequests}
        searchPlaceholder={tab === 'reviews' ? 'Search by customer, vehicle, institution, or status' : tab === 'institutions' ? 'Search by institution, code, city, or status' : 'Search requested documents or review references'}
      />

      <div className="section-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Pipeline summary</div>
              <div className="card-subtitle">A compact status view for the full financing queue.</div>
            </div>
          </div>
          <div className="list-stack">
            {[
              { label: 'Pending review', value: pipeline.pending || 0, status: 'pending' },
              { label: 'Approved files', value: pipeline.approved || 0, status: 'approved' },
              { label: 'Rejected files', value: pipeline.rejected || 0, status: 'rejected' },
              { label: 'More information needed', value: pipeline.moreInfoNeeded || 0, status: 'draft' },
            ].map((item) => (
              <div key={item.label} className="list-row">
                <div className="list-row-head">
                  <div className="list-row-title">{item.label}</div>
                  <StatusBadge value={item.status} compact />
                </div>
                <div className="list-row-meta">{item.value} file(s) currently mapped to this state.</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent finance activity</div>
              <div className="card-subtitle">Keep an eye on recent underwriting and documentation movement.</div>
            </div>
          </div>
          <div className="list-stack">
            {(tab === 'requests' ? documentRequests : reviews).slice(0, 5).map((item) => (
              <div key={item.id} className="list-row">
                <div className="list-row-head">
                  <div>
                    <div className="list-row-title">
                      {tab === 'requests'
                        ? `${item.review?.customerName || 'Customer'} · ${item.documentType}`
                        : `${item.customerName || 'Customer'} · ${item.vehicleDescription || 'Vehicle'}`}
                    </div>
                    <div className="list-row-meta">
                      {tab === 'requests'
                        ? item.description || 'Document requested'
                        : `${formatCurrency(item.requestedAmount)} · ${item.institution || 'Institution pending'}`}
                    </div>
                  </div>
                  <StatusBadge value={item.status || (tab === 'requests' ? 'requested' : 'pending')} compact />
                </div>
                <div className="list-row-meta">Updated {formatDateTime(item.updatedAt || item.createdAt)}</div>
              </div>
            ))}
            {!(tab === 'requests' ? documentRequests : reviews).length ? (
              <div className="empty-state"><h3>No finance activity yet</h3><p>Create a finance record to start populating this queue.</p></div>
            ) : null}
          </div>
        </div>
      </div>

      <Modal
        open={activeModal === 'review'}
        onClose={() => setActiveModal(null)}
        title="Open a new loan review"
        subtitle="Create review files in a focused modal instead of leaving intake controls open on the main page."
        size="large"
      >
        <form onSubmit={handleCreateReview} className="list-stack">
          <div className="form-grid">
            <div className="form-group"><label>Customer name</label><input value={reviewForm.customerName} onChange={(event) => setReviewForm({ ...reviewForm, customerName: event.target.value })} required /></div>
            <div className="form-group"><label>Vehicle description</label><input value={reviewForm.vehicleDescription} onChange={(event) => setReviewForm({ ...reviewForm, vehicleDescription: event.target.value })} required /></div>
            <div className="form-group"><label>Requested amount</label><input type="number" value={reviewForm.requestedAmount} onChange={(event) => setReviewForm({ ...reviewForm, requestedAmount: event.target.value })} required /></div>
            <div className="form-group"><label>Term months</label><input type="number" value={reviewForm.term} onChange={(event) => setReviewForm({ ...reviewForm, term: event.target.value })} required /></div>
            <div className="form-group"><label>Interest rate</label><input type="number" step="0.1" value={reviewForm.interestRate} onChange={(event) => setReviewForm({ ...reviewForm, interestRate: event.target.value })} required /></div>
            <div className="form-group"><label>Institution</label><input value={reviewForm.institution} onChange={(event) => setReviewForm({ ...reviewForm, institution: event.target.value })} required /></div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Notes</label><textarea value={reviewForm.notes} onChange={(event) => setReviewForm({ ...reviewForm, notes: event.target.value })} /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><WalletCards size={16} /> Create review</button>
          </div>
        </form>
      </Modal>

      <Modal
        open={activeModal === 'institution'}
        onClose={() => setActiveModal(null)}
        title="Add a financial institution"
        subtitle="Keep lender onboarding as a controlled action instead of leaving the registry form exposed."
        size="large"
      >
        <form onSubmit={handleCreateInstitution} className="list-stack">
          <div className="form-grid">
            <div className="form-group"><label>Institution name</label><input value={institutionForm.name} onChange={(event) => setInstitutionForm({ ...institutionForm, name: event.target.value })} required /></div>
            <div className="form-group"><label>Code</label><input value={institutionForm.code} onChange={(event) => setInstitutionForm({ ...institutionForm, code: event.target.value })} required /></div>
            <div className="form-group"><label>Type</label><select value={institutionForm.type} onChange={(event) => setInstitutionForm({ ...institutionForm, type: event.target.value })}><option value="bank">Bank</option><option value="lender">Lender</option><option value="microfinance">Microfinance</option></select></div>
            <div className="form-group"><label>Maximum loan amount</label><input type="number" value={institutionForm.maxLoanAmount} onChange={(event) => setInstitutionForm({ ...institutionForm, maxLoanAmount: event.target.value })} required /></div>
            <div className="form-group"><label>Interest rate</label><input type="number" step="0.1" value={institutionForm.interestRate} onChange={(event) => setInstitutionForm({ ...institutionForm, interestRate: event.target.value })} required /></div>
            <div className="form-group"><label>Max term</label><input type="number" value={institutionForm.maxTerm} onChange={(event) => setInstitutionForm({ ...institutionForm, maxTerm: event.target.value })} required /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><Building2 size={16} /> Register institution</button>
          </div>
        </form>
      </Modal>

      <Modal
        open={activeModal === 'request'}
        onClose={() => setActiveModal(null)}
        title="Request supporting documents"
        subtitle="Keep supporting-document workflows in a modal so the review desk stays table-first."
        size="large"
      >
        <form onSubmit={handleCreateRequest} className="list-stack">
          <div className="form-grid">
            <div className="form-group">
              <label>Loan review</label>
              <select value={requestForm.reviewId} onChange={(event) => setRequestForm({ ...requestForm, reviewId: event.target.value })} required>
                <option value="">Select review</option>
                {reviews.map((review) => (
                  <option key={review.id} value={review.id}>{review.customerName || 'Customer'} · {review.vehicleDescription || 'Vehicle'}</option>
                ))}
              </select>
            </div>
            <div className="form-group"><label>Document type</label><input value={requestForm.documentType} onChange={(event) => setRequestForm({ ...requestForm, documentType: event.target.value })} placeholder="National ID, bank statement, salary letter" required /></div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Description</label><textarea value={requestForm.description} onChange={(event) => setRequestForm({ ...requestForm, description: event.target.value })} placeholder="Explain what the reviewer needs and why." /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><FileWarning size={16} /> Request document</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
