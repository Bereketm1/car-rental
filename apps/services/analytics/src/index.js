const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3007;
app.use(cors());
app.use(express.json());

// Helper to fetch from other services
async function fetchService(url) {
  try {
    const r = await fetch(url);
    const body = await r.json();
    return Array.isArray(body.data) ? body.data : body.data ? body.data : Array.isArray(body) ? body : [];
  } catch { return []; }
}

async function fetchObject(url) {
  try {
    const r = await fetch(url);
    const body = await r.json();
    return body.data || body || {};
  } catch { return {}; }
}

app.get('/health', (req, res) => res.json({ status: 'healthy', service: 'analytics' }));

// ── Summary ──
app.get('/analytics/summary', async (req, res) => {
  const [deals, vehicles, reviews, partners, leads] = await Promise.all([
    fetchService('http://localhost:3004/deals'),
    fetchService('http://localhost:3002/vehicles'),
    fetchService('http://localhost:3003/finance/reviews'),
    fetchService('http://localhost:3005/partners'),
    fetchService('http://localhost:3006/leads'),
  ]);

  const completedDeals = deals.filter(d => d.stage === 'completed');
  const activeDeals = deals.filter(d => !['completed', 'cancelled'].includes(d.stage));
  const soldVehicles = vehicles.filter(v => v.status === 'sold');
  const approvedReviews = reviews.filter(r => r.status === 'approved');
  const convertedLeads = leads.filter(l => l.status === 'converted');

  const totalRevenue = completedDeals.reduce((s, d) => s + Number(d.totalAmount || d.amount || 0), 0);
  const avgDealValue = completedDeals.length ? totalRevenue / completedDeals.length : 0;
  const conversionRate = leads.length ? (convertedLeads.length / leads.length) * 100 : 0;

  res.json({
    success: true,
    data: {
      totalVehiclesSold: soldVehicles.length,
      totalLoansApproved: approvedReviews.length,
      totalActiveDeals: activeDeals.length,
      totalPartners: partners.length,
      totalLeads: leads.length,
      totalRevenue,
      averageDealValue: Math.round(avgDealValue),
      conversionRate: Math.round(conversionRate * 10) / 10,
    },
  });
});

// ── Sales ──
app.get('/analytics/sales', async (req, res) => {
  const vehicles = await fetchService('http://localhost:3002/vehicles');
  const sold = vehicles.filter(v => v.status === 'sold');

  const byMake = {};
  for (const v of sold) {
    byMake[v.make] = (byMake[v.make] || 0) + 1;
  }
  const byMakeArr = Object.entries(byMake).map(([make, count]) => ({ make, count })).sort((a, b) => b.count - a.count);

  res.json({ success: true, data: { totalSold: sold.length, byMake: byMakeArr } });
});

// ── Financing ──
app.get('/analytics/financing', async (req, res) => {
  const reviews = await fetchService('http://localhost:3003/finance/reviews');
  const approved = reviews.filter(r => r.status === 'approved').length;
  const pending = reviews.filter(r => ['pending', 'in_review'].includes(r.status)).length;
  const rejected = reviews.filter(r => r.status === 'rejected').length;
  const approvalRate = reviews.length ? (approved / reviews.length) * 100 : 0;

  res.json({ success: true, data: { approved, pending, rejected, total: reviews.length, approvalRate: Math.round(approvalRate * 10) / 10 } });
});

// ── Partners ──
app.get('/analytics/partners', async (req, res) => {
  const partners = await fetchService('http://localhost:3005/partners');
  const deals = await fetchService('http://localhost:3004/deals');

  const topPartners = partners.slice(0, 10).map(p => {
    const partnerDeals = deals.filter(d => (d.customerName || '').toLowerCase().includes((p.name || '').toLowerCase().split(' ')[0]));
    return {
      name: p.name,
      type: p.type,
      status: p.status,
      deals: partnerDeals.length,
      commission: partnerDeals.reduce((s, d) => s + Number(d.totalAmount || d.amount || 0) * (Number(p.commissionRate || 3) / 100), 0),
      commissionRate: p.commissionRate,
      agreements: 0,
    };
  });

  res.json({ success: true, data: { topPartners } });
});

// ── Revenue ──
app.get('/analytics/revenue', async (req, res) => {
  const deals = await fetchService('http://localhost:3004/deals');
  const completedDeals = deals.filter(d => d.stage === 'completed');
  const totalRevenue = completedDeals.reduce((s, d) => s + Number(d.totalAmount || d.amount || 0), 0);

  // Generate monthly revenue data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const monthlyRevenue = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = `${months[d.getMonth()]} ${d.getFullYear()}`;
    const monthDeals = completedDeals.filter(deal => {
      const created = new Date(deal.createdAt);
      return created.getMonth() === d.getMonth() && created.getFullYear() === d.getFullYear();
    });
    const revenue = monthDeals.reduce((s, deal) => s + Number(deal.totalAmount || deal.amount || 0), 0);
    const commission = revenue * 0.04;
    monthlyRevenue.push({ month: monthLabel, revenue, commission });
  }

  res.json({ success: true, data: { totalRevenue, monthlyRevenue } });
});

// ── Trends ──
app.get('/analytics/trends', async (req, res) => {
  const deals = await fetchService('http://localhost:3004/deals');
  const leads = await fetchService('http://localhost:3006/leads');

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const trends = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = `${months[d.getMonth()]}`;
    const monthDeals = deals.filter(deal => {
      const created = new Date(deal.createdAt);
      return created.getMonth() === d.getMonth() && created.getFullYear() === d.getFullYear();
    });
    const monthLeads = leads.filter(lead => {
      const created = new Date(lead.createdAt);
      return created.getMonth() === d.getMonth() && created.getFullYear() === d.getFullYear();
    });
    const revenue = monthDeals.filter(dd => dd.stage === 'completed').reduce((s, dd) => s + Number(dd.totalAmount || dd.amount || 0), 0);
    trends.push({ month: monthLabel, revenue, leads: monthLeads.length, deals: monthDeals.length });
  }

  res.json({ success: true, data: trends });
});

app.listen(PORT, () => console.log(`📊 Analytics Service running on http://localhost:${PORT}`));
