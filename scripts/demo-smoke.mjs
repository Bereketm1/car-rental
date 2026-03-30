import fs from 'fs';
import path from 'path';

const API_BASE = process.env.API_BASE || 'http://localhost:3000/api';
const SAMPLE_FILE = path.resolve(process.cwd(), 'test-document.txt');
const RUN_ID = Date.now();

let token = '';
const results = [];

function record(step, ok, detail) {
  results.push({ step, ok, detail });
  const marker = ok ? 'PASS' : 'FAIL';
  console.log(`[${marker}] ${step}${detail ? `: ${detail}` : ''}`);
}

function unwrap(payload) {
  if (payload && typeof payload === 'object' && 'success' in payload && 'data' in payload) {
    return payload.data;
  }
  return payload;
}

async function request(method, route, body, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const requestOptions = { method, headers };
  if (body instanceof FormData) {
    requestOptions.body = body;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${route}`, requestOptions);
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = Array.isArray(payload?.message) ? payload.message[0] : payload?.message || response.statusText;
    throw new Error(`${method} ${route} failed: ${message}`);
  }

  return unwrap(payload);
}

const get = (route) => request('GET', route);
const post = (route, body) => request('POST', route, body);
const put = (route, body) => request('PUT', route, body);

async function main() {
  console.log(`Running demo smoke against ${API_BASE}`);

  const auth = await request('POST', '/auth/login', {
    email: 'admin@merkatomotors.com',
    password: 'admin123',
  });

  token = auth.access_token;
  record('Admin login', Boolean(token), auth.user?.email || 'token received');

  const supplier = await post('/vehicles/suppliers', {
    companyName: `Demo Supplier ${RUN_ID}`,
    contactPerson: 'Demo Operator',
    email: `demo-supplier-${RUN_ID}@merkatomotors.com`,
    phone: '+251911000001',
    city: 'Addis Ababa',
    address: 'Bole Road, Addis Ababa',
    licenseNumber: `LIC-${RUN_ID}`,
  });
  record('Supplier registration', Boolean(supplier?.id), supplier.companyName);

  const vehicle = await post('/vehicles', {
    make: 'Toyota',
    model: `Corolla Demo ${RUN_ID}`,
    year: 2024,
    color: 'White',
    price: 2450000,
    condition: 'new',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    mileage: 0,
    status: 'available',
    supplierName: supplier.companyName,
    description: 'Demo vehicle for supplier intake and matching',
  });
  record('Vehicle registration', Boolean(vehicle?.id), `${vehicle.make} ${vehicle.model}`);

  const customer = await post('/customers', {
    firstName: 'Demo',
    lastName: `Buyer${RUN_ID}`,
    email: `demo-buyer-${RUN_ID}@merkatomotors.com`,
    phone: '+251922000002',
    city: 'Addis Ababa',
    address: 'Kazanchis, Addis Ababa',
  });
  record('Customer registration', Boolean(customer?.id), `${customer.firstName} ${customer.lastName}`);

  const interest = await post(`/customers/${customer.id}/interests`, {
    vehicleId: vehicle.id,
    notes: 'Buyer wants automatic transmission and fast approval',
  });
  record('Vehicle interest selection', Boolean(interest?.id), vehicle.model);

  const loanApplication = await post('/customers/loan-applications', {
    customerId: customer.id,
    vehicleId: vehicle.id,
    requestedAmount: 2000000,
    termMonths: 48,
    monthlyIncome: 85000,
    employmentStatus: 'employed',
  });
  record('Loan application submission', Boolean(loanApplication?.id), `ETB ${loanApplication.requestedAmount}`);

  const formData = new FormData();
  formData.append('file', new Blob([fs.readFileSync(SAMPLE_FILE)], { type: 'text/plain' }), 'test-document.txt');
  const uploaded = await post('/documents/upload', formData);
  record('Document upload', Boolean(uploaded?.filename), uploaded?.filename);

  const attachedDocument = await post(`/customers/${customer.id}/documents`, {
    name: 'Demo identity file',
    url: uploaded.url,
    fileName: uploaded.filename,
    size: uploaded.size,
    type: uploaded.mimeType,
  });
  record('Customer document attachment', Boolean(attachedDocument?.id), attachedDocument.name);

  const institution = await post('/finance/institutions', {
    name: `Demo Bank ${RUN_ID}`,
    code: `DB${String(RUN_ID).slice(-4)}`,
    type: 'bank',
    maxLoanAmount: 6000000,
    interestRate: 12.5,
    maxTerm: 60,
  });
  record('Financial institution creation', Boolean(institution?.id), institution.name);

  const deal = await post('/deals', {
    customerName: `${customer.firstName} ${customer.lastName}`,
    vehicleDescription: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
    amount: vehicle.price,
    stage: 'vehicle_selected',
    notes: 'Demo lifecycle transaction',
  });
  record('Deal creation', Boolean(deal?.id), deal.stage);

  const review = await post('/finance/reviews', {
    customerName: `${customer.firstName} ${customer.lastName}`,
    vehicleDescription: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
    requestedAmount: 2000000,
    term: 48,
    interestRate: 12.5,
    institution: institution.name,
    notes: 'Demo review created from smoke flow',
    dealId: deal.id,
  });
  record('Loan review creation', Boolean(review?.id), review.status);

  const documentRequest = await post('/finance/document-requests', {
    reviewId: review.id,
    documentType: 'Bank statement',
    description: 'Recent six-month statement requested for underwriting',
  });
  record('Document request creation', Boolean(documentRequest?.id), documentRequest.documentType);

  const approved = await post(`/finance/reviews/${review.id}/approve`, {
    approvedAmount: 1900000,
    notes: 'Approved for demo walkthrough',
  });
  record('Financing approval', approved?.status === 'approved', approved.status);

  const advancedDeal = await put(`/deals/${deal.id}/stage`, { stage: 'completed' });
  record('Deal stage update', advancedDeal?.stage === 'completed', advancedDeal.stage);

  const partner = await post('/partners', {
    name: `Demo Finance Partner ${RUN_ID}`,
    type: 'finance',
    email: `partner-${RUN_ID}@merkatomotors.com`,
    phone: '+251933000003',
    city: 'Addis Ababa',
    commissionRate: 3,
  });
  record('Partner creation', Boolean(partner?.id), partner.name);

  const agreement = await post('/partners/agreements', {
    partnerId: partner.id,
    title: 'Demo lender cooperation agreement',
    terms: 'Referral and financing support agreement for marketplace transactions.',
    startDate: '2026-03-01',
    endDate: '2027-03-01',
  });
  record('Agreement creation', Boolean(agreement?.id), agreement.title);

  const commission = await post(`/partners/${partner.id}/commissions`, {
    dealId: deal.id,
    amount: 60000,
  });
  record('Commission creation', Boolean(commission?.id), `ETB ${commission.amount}`);

  const campaign = await post('/leads/campaigns', {
    name: `Demo Digital Campaign ${RUN_ID}`,
    type: 'digital',
    budget: 125000,
    startDate: '2026-03-01',
    endDate: '2026-04-30',
    description: 'Demo campaign for vehicle finance lead generation',
  });
  record('Campaign creation', Boolean(campaign?.id), campaign.name);

  const lead = await post('/leads', {
    name: `Demo Lead ${RUN_ID}`,
    email: `lead-${RUN_ID}@merkatomotors.com`,
    phone: '+251944000004',
    source: 'campaign',
    vehicleInterest: `${vehicle.make} ${vehicle.model}`,
    notes: 'Lead generated during demo preparation',
    campaignId: campaign.id,
  });
  record('Lead capture', Boolean(lead?.id), lead.name);

  const updatedLead = await put(`/leads/${lead.id}`, { status: 'qualified' });
  record('Lead status update', updatedLead?.status === 'qualified', updatedLead.status);

  const referral = await post('/leads/referrals', {
    referrerName: 'Demo Referrer',
    referrerEmail: `referrer-${RUN_ID}@merkatomotors.com`,
    referredName: 'Demo Referred Buyer',
    referredEmail: `referred-${RUN_ID}@merkatomotors.com`,
    reward: 2500,
  });
  record('Referral creation', Boolean(referral?.id), referral.referrerName);

  const checks = {
    customers: await get('/customers'),
    applications: await get('/customers/loan-applications/all'),
    vehicles: await get('/vehicles'),
    suppliers: await get('/vehicles/suppliers/all'),
    inventory: await get('/vehicles/inventory/summary'),
    reviews: await get('/finance/reviews'),
    pipeline: await get('/finance/pipeline'),
    institutions: await get('/finance/institutions'),
    deals: await get('/deals'),
    partners: await get('/partners'),
    agreements: await get('/partners/agreements/all'),
    commissions: await get(`/partners/${partner.id}/commissions`),
    leads: await get('/leads'),
    campaigns: await get('/leads/campaigns/all'),
    referrals: await get('/leads/referrals/all'),
    analyticsSummary: await get('/analytics/summary'),
    analyticsSales: await get('/analytics/sales?period=month'),
    analyticsFinancing: await get('/analytics/financing'),
    analyticsPartners: await get('/analytics/partners'),
    analyticsRevenue: await get('/analytics/revenue'),
    analyticsTrends: await get('/analytics/trends'),
    search: await get('/search?q=demo'),
    audit: await get('/audit'),
    notifications: await get('/notifications'),
  };

  record('Readback checks', true, [
    `customers=${checks.customers.length}`,
    `vehicles=${checks.vehicles.length}`,
    `reviews=${checks.reviews.length}`,
    `deals=${checks.deals.length}`,
    `leads=${checks.leads.length}`,
  ].join(', '));

  const failed = results.filter((result) => !result.ok);
  console.log('');
  console.log('Demo entity IDs');
  console.log(JSON.stringify({
    runId: RUN_ID,
    supplierId: supplier.id,
    vehicleId: vehicle.id,
    customerId: customer.id,
    loanApplicationId: loanApplication.id,
    financeInstitutionId: institution.id,
    financeReviewId: review.id,
    documentRequestId: documentRequest.id,
    dealId: deal.id,
    partnerId: partner.id,
    agreementId: agreement.id,
    commissionId: commission.id,
    campaignId: campaign.id,
    leadId: lead.id,
    referralId: referral.id,
  }, null, 2));

  if (failed.length) {
    throw new Error(`${failed.length} demo smoke step(s) failed.`);
  }

  console.log('');
  console.log('Demo smoke completed successfully.');
}

main().catch((error) => {
  console.error('');
  console.error(error.message || error);
  process.exit(1);
});
