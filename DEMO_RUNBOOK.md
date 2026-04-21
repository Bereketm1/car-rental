# MerkatoMotors Demo Runbook

## 1. Pre-Demo Checklist

Run these from the repository root.

```powershell
npm install
npm run dev
```

This local setup is fully native now:

- no Docker
- no separate PostgreSQL service
- each backend service persists to its own local SQLite file

Wait for these URLs to respond:

- Web: `http://localhost:5173`
- API gateway docs: `http://localhost:3000/api/docs`
- CRM docs: `http://localhost:3001/api/docs`
- Vehicle docs: `http://localhost:3002/api/docs`
- Finance docs: `http://localhost:3003/api/docs`
- Deal docs: `http://localhost:3004/api/docs`
- Partner docs: `http://localhost:3005/api/docs`
- Lead docs: `http://localhost:3006/api/docs`
- Analytics docs: `http://localhost:3007/api/docs`

Run the demo smoke test before the meeting:

```powershell
npm run demo:smoke
```

If that passes, the key showcase flow is working.

## 2. Demo Credentials

- Admin: `admin@merkatomotors.com` / `admin123`
- Supplier demo: `supplier@merkatomotors.com` / `vendor123`

Use the admin login for the full platform walkthrough.

## 3. Demo Narrative

Present the platform as a vehicle financing marketplace built for the Ethiopian financing ecosystem.

Opening message:

1. This is not only a CRM.
2. It connects buyers, suppliers, lenders, and partners in one transaction workflow.
3. The full lifecycle is visible from lead capture to financed vehicle purchase.

## 4. Recommended Demo Order

### Dashboard

Show first:

- Executive summary
- Priority items
- Module coverage
- Transaction stages
- Recent activity

Talk track:

- Explain that management sees revenue, financing momentum, customer flow, partner coverage, and operational bottlenecks from one page.

### CRM / Customer Management System

Open `/customers`.

Show these features:

- customer registration
- vehicle interest selection
- loan application submission
- document upload
- application tracking

Demo sequence:

1. Create a new customer in the onboarding studio.
2. Select a preferred vehicle.
3. Enter requested amount, term, and income.
4. Save the workflow.
5. Open the document workspace for that customer.
6. Upload `test-document.txt` as a placeholder compliance document.
7. Switch to `Application tracker` and point out the submitted loan file.

What to say:

- The CRM does not stop at contact capture. It progresses directly into financing readiness.

### Vehicle Supplier Portal

Open `/vehicles`.

Show these features:

- register vehicles
- upload vehicle details
- manage inventory
- receive customer leads

Demo sequence:

1. Show the inventory command tab.
2. Add a supplier if needed.
3. Add a vehicle with supplier name, price, condition, and description.
4. Show inventory composition and supplier highlights.
5. Open `Lead desk`.
6. Show that buyer demand is matched to supplier inventory.
7. Mark a lead as `Contacted` or `Qualified` from the supplier portal.

What to say:

- Suppliers are not only listing stock. They can see matched buyer demand and respond from the same workspace.

### Financial Institution Portal

Open `/finance`.

Show these features:

- review loan applications
- request documents
- approve or reject financing
- track loan pipeline

Demo sequence:

1. In `Review desk`, show active reviews.
2. Create a review or open one seeded by the smoke test.
3. Switch to `Document requests` and request a bank statement or salary letter.
4. Return to `Review desk` and approve one financing file.
5. Point to the pipeline metrics at the top.

What to say:

- Lenders can underwrite, request supporting documents, and make financing decisions without leaving the system.

### Deal Management System

Open `/deals`.

Show these features:

- full transaction lifecycle
- stage movement from selection to purchase

Demo sequence:

1. Create a new deal from customer and vehicle.
2. Show the lifecycle board.
3. Move the deal forward with `Advance`.
4. Explain the stages: vehicle selected, loan applied, under review, approved, completed.

What to say:

- This is the transaction spine of the platform. Every commercial event can be traced here.

### Partnership Management System

Open `/partners`.

Show these features:

- suppliers
- financial institutions
- commissions
- partnership agreements

Demo sequence:

1. Show partner registry.
2. Create a partner if needed.
3. Switch to agreement desk and create an agreement.
4. Switch to commission ledger and record a commission against a deal.

What to say:

- The platform tracks the commercial relationships behind the marketplace, not only end customers.

### Lead Generation & Marketing System

Open `/marketing`.

Show these features:

- digital campaign tracking
- lead capture forms
- referral programs
- marketing analytics

Demo sequence:

1. Capture a new lead.
2. Update status to `Qualified` or `Converted`.
3. Create a campaign.
4. Create a referral record.
5. Point to lead volume, conversion rate, campaign count, and budget metrics.

What to say:

- Marketing is connected to the downstream commercial workflow, so demand generation is measurable and operational.

### Reporting & Analytics Dashboard

Open `/analytics`.

Show these features:

- vehicle sales volume
- financing approvals
- partner performance
- revenue from transactions

Demo sequence:

1. Show summary cards.
2. Show revenue progression.
3. Show financing pipeline breakdown.
4. Show sales by make.
5. Show top partners.
6. Use the period selector to switch between time ranges.

What to say:

- Management gets commercial intelligence, not only operational screens.

## 5. Closing Positioning

End with this framing:

1. The platform connects customer acquisition, supplier inventory, financing, deal execution, partnerships, and management reporting.
2. It behaves like a localized vehicle financing marketplace.
3. The product can evolve toward the operating shape of AutoTrader, Carvana, or Cars.com, but adapted to Ethiopian financing realities.

## 6. If Time Is Short

Use this 5-minute version:

1. Dashboard
2. Customers
3. Vehicles Lead Desk
4. Finance
5. Deals
6. Analytics

## 7. Recovery Plan If Something Looks Off

1. Refresh the page once.
2. Confirm the services are still running.
3. Run `npm run demo:smoke`.
4. Use seeded records already visible in the tables instead of creating a fresh one live.
