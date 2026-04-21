/**
 * MerkatoMotors Database Seed Script
 * Run: npm run seed
 * Requires: local services running on localhost
 */

const API = 'http://localhost:3000/api';

async function post(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function seed() {
  console.log('🌱 Seeding MerkatoMotors database...\n');

  // ── Customers ──
  console.log('👥 Creating customers...');
  const customers = [
    { firstName: 'Abebe', lastName: 'Kebede', email: 'abebe.kebede@email.com', phone: '+251911223344', city: 'Addis Ababa', region: 'Addis Ababa', status: 'active' },
    { firstName: 'Tigist', lastName: 'Haile', email: 'tigist.haile@email.com', phone: '+251922334455', city: 'Addis Ababa', region: 'Addis Ababa', status: 'active' },
    { firstName: 'Dawit', lastName: 'Tesfaye', email: 'dawit.tesfaye@email.com', phone: '+251933445566', city: 'Dire Dawa', region: 'Dire Dawa', status: 'active' },
    { firstName: 'Mekdes', lastName: 'Tadesse', email: 'mekdes.tadesse@email.com', phone: '+251944556677', city: 'Hawassa', region: 'Sidama', status: 'active' },
    { firstName: 'Yohannes', lastName: 'Gebru', email: 'yohannes.gebru@email.com', phone: '+251955667788', city: 'Mekelle', region: 'Tigray', status: 'active' },
    { firstName: 'Hana', lastName: 'Desta', email: 'hana.desta@email.com', phone: '+251966778899', city: 'Bahir Dar', region: 'Amhara', status: 'active' },
    { firstName: 'Bereket', lastName: 'Tsegaye', email: 'bereket.tsegaye@email.com', phone: '+251977889900', city: 'Jimma', region: 'Oromia', status: 'active' },
    { firstName: 'Selam', lastName: 'Mekonnen', email: 'selam.mekonnen@email.com', phone: '+251988990011', city: 'Addis Ababa', region: 'Addis Ababa', status: 'active' },
    { firstName: 'Ermias', lastName: 'Worku', email: 'ermias.worku@email.com', phone: '+251912345678', city: 'Adama', region: 'Oromia', status: 'active' },
    { firstName: 'Bethlehem', lastName: 'Assefa', email: 'bethlehem.assefa@email.com', phone: '+251923456789', city: 'Addis Ababa', region: 'Addis Ababa', status: 'active' },
    { firstName: 'Solomon', lastName: 'Bekele', email: 'solomon.bekele@email.com', phone: '+251934567890', city: 'Gondar', region: 'Amhara', status: 'active' },
    { firstName: 'Rahel', lastName: 'Girma', email: 'rahel.girma@email.com', phone: '+251945678901', city: 'Addis Ababa', region: 'Addis Ababa', status: 'active' },
  ];
  const savedCustomers = [];
  for (const c of customers) {
    const saved = await post('/customers', c);
    savedCustomers.push(saved);
    console.log(`  ✓ ${c.firstName} ${c.lastName}`);
  }

  // ── Vehicles ──
  console.log('\n🚗 Creating vehicles...');
  const vehicles = [
    { make: 'Toyota', model: 'Corolla', year: 2024, color: 'White', price: 1800000, condition: 'new', fuelType: 'Petrol', transmission: 'Automatic', mileage: 0, status: 'available', supplierName: 'Nyala Motors', description: 'Brand new Toyota Corolla sedan, perfect for city driving' },
    { make: 'Toyota', model: 'Hilux', year: 2023, color: 'Silver', price: 2800000, condition: 'used', fuelType: 'Diesel', transmission: 'Manual', mileage: 15000, status: 'available', supplierName: 'Nyala Motors', description: 'Powerful pickup truck ideal for Ethiopian roads' },
    { make: 'Hyundai', model: 'Tucson', year: 2024, color: 'Black', price: 3500000, condition: 'new', fuelType: 'Petrol', transmission: 'Automatic', mileage: 0, status: 'available', supplierName: 'Holland Car', description: 'Premium SUV with advanced safety features' },
    { make: 'Suzuki', model: 'Vitara', year: 2023, color: 'Red', price: 2200000, condition: 'certified', fuelType: 'Petrol', transmission: 'Automatic', mileage: 8000, status: 'available', supplierName: 'Holland Car', description: 'Certified pre-owned compact SUV' },
    { make: 'Nissan', model: 'X-Trail', year: 2024, color: 'Blue', price: 4200000, condition: 'new', fuelType: 'Hybrid', transmission: 'Automatic', mileage: 0, status: 'reserved', supplierName: 'Nyala Motors', description: 'Eco-friendly hybrid SUV' },
    { make: 'Toyota', model: 'Land Cruiser', year: 2023, color: 'White', price: 8500000, condition: 'new', fuelType: 'Diesel', transmission: 'Automatic', mileage: 0, status: 'available', supplierName: 'Moenco', description: 'Flagship luxury SUV' },
    { make: 'Hyundai', model: 'Creta', year: 2024, color: 'Gray', price: 2100000, condition: 'new', fuelType: 'Petrol', transmission: 'Automatic', mileage: 0, status: 'available', supplierName: 'Holland Car', description: 'Affordable compact crossover' },
    { make: 'Toyota', model: 'Yaris', year: 2024, color: 'Red', price: 1200000, condition: 'new', fuelType: 'Petrol', transmission: 'Manual', mileage: 0, status: 'available', supplierName: 'Nyala Motors', description: 'Economical city car' },
    { make: 'Kia', model: 'Sportage', year: 2024, color: 'Silver', price: 3800000, condition: 'new', fuelType: 'Diesel', transmission: 'Automatic', mileage: 0, status: 'available', supplierName: 'Moenco', description: 'Modern SUV with panoramic roof' },
    { make: 'Toyota', model: 'RAV4', year: 2023, color: 'Green', price: 3200000, condition: 'used', fuelType: 'Petrol', transmission: 'Automatic', mileage: 22000, status: 'available', supplierName: 'Nyala Motors', description: 'Popular mid-size SUV' },
    { make: 'Mitsubishi', model: 'L200', year: 2024, color: 'Black', price: 2900000, condition: 'new', fuelType: 'Diesel', transmission: 'Manual', mileage: 0, status: 'available', supplierName: 'Moenco', description: 'Heavy-duty pickup truck' },
    { make: 'Chery', model: 'Tiggo 7', year: 2024, color: 'White', price: 1600000, condition: 'new', fuelType: 'Petrol', transmission: 'Automatic', mileage: 0, status: 'available', supplierName: 'Lifan Motors', description: 'Value-packed Chinese SUV' },
  ];
  const savedVehicles = [];
  for (const v of vehicles) {
    const saved = await post('/vehicles', v);
    savedVehicles.push(saved);
    console.log(`  ✓ ${v.make} ${v.model} (${v.year})`);
  }

  // ── Deals ──
  console.log('\n🤝 Creating deals...');
  const deals = [
    { customerName: 'Abebe Kebede', vehicleDescription: 'Toyota Corolla 2024', amount: 1800000, stage: 'negotiation', notes: 'Interested in installment plan' },
    { customerName: 'Tigist Haile', vehicleDescription: 'Hyundai Tucson 2024', amount: 3500000, stage: 'financing', notes: 'Loan application submitted to CBE' },
    { customerName: 'Dawit Tesfaye', vehicleDescription: 'Toyota Hilux 2023', amount: 2800000, stage: 'completed', notes: 'Deal closed successfully' },
    { customerName: 'Mekdes Tadesse', vehicleDescription: 'Suzuki Vitara 2023', amount: 2200000, stage: 'documentation', notes: 'Awaiting final documents' },
    { customerName: 'Yohannes Gebru', vehicleDescription: 'Nissan X-Trail 2024', amount: 4200000, stage: 'inquiry', notes: 'Initial inquiry received' },
    { customerName: 'Hana Desta', vehicleDescription: 'Toyota Land Cruiser 2023', amount: 8500000, stage: 'approval', notes: 'Pending management approval' },
    { customerName: 'Bereket Tsegaye', vehicleDescription: 'Hyundai Creta 2024', amount: 2100000, stage: 'completed', notes: 'Paid in full' },
    { customerName: 'Selam Mekonnen', vehicleDescription: 'Kia Sportage 2024', amount: 3800000, stage: 'negotiation', notes: 'Price negotiation ongoing' },
  ];
  for (const d of deals) {
    await post('/deals', d);
    console.log(`  ✓ ${d.customerName} — ${d.vehicleDescription}`);
  }

  // ── Partners ──
  console.log('\n🔗 Creating partners...');
  const partners = [
    { name: 'Nyala Motors', type: 'dealer', email: 'info@nyalamotors.et', phone: '+251115123456', city: 'Addis Ababa', status: 'active', commissionRate: 3.5 },
    { name: 'Holland Car', type: 'dealer', email: 'sales@hollandcar.et', phone: '+251115234567', city: 'Addis Ababa', status: 'active', commissionRate: 4.0 },
    { name: 'Moenco', type: 'dealer', email: 'contact@moenco.et', phone: '+251115345678', city: 'Addis Ababa', status: 'active', commissionRate: 3.0 },
    { name: 'Lifan Motors', type: 'dealer', email: 'sales@lifan.et', phone: '+251115456789', city: 'Addis Ababa', status: 'active', commissionRate: 5.0 },
    { name: 'Ethio Insurance', type: 'insurance', email: 'auto@ethioinsurance.et', phone: '+251115567890', city: 'Addis Ababa', status: 'active', commissionRate: 2.0 },
    { name: 'CBE Bancassurance', type: 'finance', email: 'loans@cbe.et', phone: '+251115678901', city: 'Addis Ababa', status: 'active', commissionRate: 1.5 },
  ];
  for (const p of partners) {
    await post('/partners', p);
    console.log(`  ✓ ${p.name}`);
  }

  // ── Leads ──
  console.log('\n📣 Creating leads...');
  const leads = [
    { name: 'Kidus Alemayehu', email: 'kidus@email.com', phone: '+251911111111', source: 'website', status: 'new', vehicleInterest: 'Toyota Corolla', notes: 'Found us on Google' },
    { name: 'Sara Fikre', email: 'sara@email.com', phone: '+251922222222', source: 'referral', status: 'contacted', vehicleInterest: 'Hyundai Tucson', notes: 'Referred by Abebe' },
    { name: 'Tewodros Hailu', email: 'tewodros@email.com', phone: '+251933333333', source: 'social', status: 'qualified', vehicleInterest: 'Toyota Hilux', notes: 'Engaged via Facebook' },
    { name: 'Liya Mesfin', email: 'liya@email.com', phone: '+251944444444', source: 'campaign', status: 'converted', vehicleInterest: 'Suzuki Vitara', notes: 'From Meskel promotion' },
    { name: 'Naod Getachew', email: 'naod@email.com', phone: '+251955555555', source: 'website', status: 'new', vehicleInterest: 'Nissan X-Trail', notes: 'Submitted web form' },
    { name: 'Frehiwot Tadesse', email: 'frehiwot@email.com', phone: '+251966666666', source: 'referral', status: 'contacted', vehicleInterest: 'Toyota RAV4', notes: 'Partner referral' },
    { name: 'Abel Workneh', email: 'abel@email.com', phone: '+251977777777', source: 'social', status: 'new', vehicleInterest: 'Kia Sportage', notes: 'Instagram inquiry' },
    { name: 'Tsion Girma', email: 'tsion@email.com', phone: '+251988888888', source: 'campaign', status: 'qualified', vehicleInterest: 'Toyota Yaris', notes: 'Holiday campaign lead' },
  ];
  for (const l of leads) {
    await post('/leads', l);
    console.log(`  ✓ ${l.name}`);
  }

  // ── Campaigns ──
  console.log('\n📢 Creating campaigns...');
  const campaigns = [
    { name: 'Meskel Season Sale', type: 'seasonal', budget: 500000, status: 'active', startDate: '2025-09-15', endDate: '2025-10-15', description: 'Special financing rates for Meskel holiday' },
    { name: 'New Year Promotion', type: 'seasonal', budget: 750000, status: 'planned', startDate: '2025-09-01', endDate: '2025-09-15', description: 'Ethiopian New Year vehicle deals' },
    { name: 'Referral Rewards', type: 'referral', budget: 200000, status: 'active', startDate: '2025-01-01', endDate: '2025-12-31', description: 'Earn rewards for referring friends' },
    { name: 'Facebook Auto Ads', type: 'digital', budget: 300000, status: 'active', startDate: '2025-03-01', endDate: '2025-06-30', description: 'Targeted social media advertising' },
  ];
  for (const c of campaigns) {
    await post('/leads/campaigns', c);
    console.log(`  ✓ ${c.name}`);
  }

  // ── Finance Reviews ──
  console.log('\n🏦 Creating finance reviews...');
  const reviews = [
    { customerName: 'Abebe Kebede', vehicleDescription: 'Toyota Corolla 2024', requestedAmount: 1500000, term: 60, interestRate: 12.5, status: 'pending', institution: 'Commercial Bank of Ethiopia', notes: 'Good credit score' },
    { customerName: 'Tigist Haile', vehicleDescription: 'Hyundai Tucson 2024', requestedAmount: 3200000, term: 48, interestRate: 13.0, status: 'under_review', institution: 'Awash Bank', notes: 'Employment verification pending' },
    { customerName: 'Dawit Tesfaye', vehicleDescription: 'Toyota Hilux 2023', requestedAmount: 2000000, term: 36, interestRate: 11.5, status: 'approved', institution: 'Dashen Bank', notes: 'Approved with conditions' },
    { customerName: 'Mekdes Tadesse', vehicleDescription: 'Suzuki Vitara 2023', requestedAmount: 1800000, term: 48, interestRate: 12.0, status: 'pending', institution: 'Abyssinia Bank', notes: 'Awaiting document upload' },
    { customerName: 'Hana Desta', vehicleDescription: 'Toyota Land Cruiser', requestedAmount: 6000000, term: 60, interestRate: 14.0, status: 'rejected', institution: 'CBE', notes: 'Exceeds DTI ratio' },
  ];
  for (const r of reviews) {
    await post('/finance/reviews', r);
    console.log(`  ✓ ${r.customerName} — ${r.status}`);
  }

  // ── Institutions ──
  console.log('\n🏛️ Creating financial institutions...');
  const institutions = [
    { name: 'Commercial Bank of Ethiopia', code: 'CBE', type: 'bank', maxLoanAmount: 10000000, interestRate: 12.5, maxTerm: 60, status: 'active' },
    { name: 'Awash Bank', code: 'AB', type: 'bank', maxLoanAmount: 8000000, interestRate: 13.0, maxTerm: 48, status: 'active' },
    { name: 'Dashen Bank', code: 'DB', type: 'bank', maxLoanAmount: 7000000, interestRate: 11.5, maxTerm: 60, status: 'active' },
    { name: 'Abyssinia Bank', code: 'BOA', type: 'bank', maxLoanAmount: 6000000, interestRate: 12.0, maxTerm: 48, status: 'active' },
  ];
  for (const inst of institutions) {
    await post('/finance/institutions', inst);
    console.log(`  ✓ ${inst.name}`);
  }

  console.log('\n✅ Database seeded successfully!');
  console.log('📊 Summary: 12 customers, 12 vehicles, 8 deals, 6 partners, 8 leads, 4 campaigns, 5 reviews, 4 institutions');
}

seed().catch(console.error);
