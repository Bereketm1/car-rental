// ============ CUSTOMER / CRM ============
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId: string;
  address: string;
  city: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleInterest {
  id: string;
  customerId: string;
  vehicleId: string;
  notes: string;
  createdAt: Date;
}

export interface LoanApplication {
  id: string;
  customerId: string;
  vehicleId: string;
  requestedAmount: number;
  termMonths: number;
  monthlyIncome: number;
  employmentStatus: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  applicationId: string;
  type: 'id_card' | 'income_proof' | 'bank_statement' | 'employment_letter' | 'other';
  filename: string;
  url: string;
  uploadedAt: Date;
}

// ============ VEHICLE ============
export interface Vehicle {
  id: string;
  supplierId: string;
  make: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  price: number;
  condition: 'new' | 'used' | 'certified';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'automatic' | 'manual';
  status: 'available' | 'reserved' | 'sold';
  images: string[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  licenseNumber: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
}

// ============ FINANCE ============
export interface FinancialInstitution {
  id: string;
  name: string;
  type: 'bank' | 'microfinance' | 'credit_union';
  contactPerson: string;
  email: string;
  phone: string;
  interestRateMin: number;
  interestRateMax: number;
  maxLoanAmount: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface LoanReview {
  id: string;
  applicationId: string;
  institutionId: string;
  reviewerName: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'more_info_needed';
  approvedAmount?: number;
  interestRate?: number;
  termMonths?: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentRequest {
  id: string;
  reviewId: string;
  documentType: string;
  description: string;
  status: 'requested' | 'submitted' | 'accepted' | 'rejected';
  createdAt: Date;
}

// ============ DEAL ============
export interface Deal {
  id: string;
  customerId: string;
  vehicleId: string;
  applicationId: string;
  reviewId: string;
  stage: 'vehicle_selected' | 'loan_applied' | 'under_review' | 'approved' | 'contract_signed' | 'completed' | 'cancelled';
  totalAmount: number;
  downPayment: number;
  financedAmount: number;
  commission: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============ PARTNER ============
export interface Partner {
  id: string;
  type: 'supplier' | 'financial_institution';
  entityId: string;
  name: string;
  commissionRate: number;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
}

export interface Commission {
  id: string;
  partnerId: string;
  dealId: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  paidAt?: Date;
  createdAt: Date;
}

export interface Agreement {
  id: string;
  partnerId: string;
  title: string;
  terms: string;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  createdAt: Date;
}

// ============ LEAD / MARKETING ============
export interface Campaign {
  id: string;
  name: string;
  type: 'digital' | 'referral' | 'social' | 'email';
  budget: number;
  spent: number;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'paused' | 'completed';
  leadsGenerated: number;
  conversions: number;
  createdAt: Date;
}

export interface Lead {
  id: string;
  campaignId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: 'website' | 'referral' | 'social' | 'walk_in' | 'campaign';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Referral {
  id: string;
  referrerName: string;
  referrerEmail: string;
  referredName: string;
  referredEmail: string;
  status: 'pending' | 'contacted' | 'converted';
  reward: number;
  rewardStatus: 'pending' | 'paid';
  createdAt: Date;
}

// ============ ANALYTICS ============
export interface AnalyticsSummary {
  totalVehiclesSold: number;
  totalRevenue: number;
  totalLoansApproved: number;
  totalLoansRejected: number;
  totalActiveDeals: number;
  totalPartners: number;
  totalLeads: number;
  conversionRate: number;
  averageDealValue: number;
  monthlyTrends: MonthlyTrend[];
}

export interface MonthlyTrend {
  month: string;
  sales: number;
  revenue: number;
  loans: number;
  leads: number;
}

// ============ COMMON ============
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
