# Zelalem Motors Deployment Guide

Because this application relies on **persistent local SQLite files** and **multiple long-running Node.js microservices**, it cannot be entirely deployed to a "Serverless" platform like Vercel (which wipes all files on every request). 

The optimal strategy is a **Hybrid Deployment**:
1. **Frontend:** Deployed to Vercel for lightning-fast UI delivery.
2. **Backend:** Deployed to Render (or Railway) for persistent data storage and long-running Express microservice processes.

---

## 1. Deploy the Backend (API & Microservices)

We recommend using **Render.com** because it has a generous **100% Free Tier** that perfectly hosts our Node.js microservices.

*Note: Render's Free Tier automatically puts servers to "sleep" after 15 minutes of inactivity, which resets local files. To ensure your platform always works perfectly for demos, we have added a smart boot script (`start-prod.js`) that automatically seeds the database with fresh demo data every time the server wakes up!*

### Using Render.com (100% Free)
1. Create a free account at [render.com](https://render.com).
2. Click **New** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following configuration:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` *(This runs the new `start-prod.js` script to auto-seed data and boot all microservices)*
   - **Instance Type:** `Free`
5. Click **Create Web Service**.
6. Once deployed, Render will give you a public URL (e.g., `https://zelalem-api.onrender.com`). **Copy this URL**.

---

## 2. Deploy the Frontend to Vercel

We have already updated your `api.js` to accept a custom production URL and created the necessary `vercel.json` for React routing.

### Using Vercel Dashboard
1. Create a free account at [vercel.com](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository.
3. In the "Configure Project" screen, make the following changes:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click `Edit` and select `apps/web`.
4. Open the **Environment Variables** section and add:
   - **Name:** `VITE_API_URL`
   - **Value:** `[YOUR RENDER BACKEND URL]/api` *(e.g., `https://zelalem-api.onrender.com/api`)*
5. Click **Deploy**.

Vercel will build the frontend and host it. Your frontend will now securely communicate with your persistent backend!

---

## 3. Alternative: Deploying Everything to a VPS

If you have a Linux VPS (DigitalOcean Droplet, AWS EC2), you can simply SSH in and run:
```bash
git clone <your-repo>
cd <repo>
npm install
npm run build
npx pm2 start start_all.ps1 --interpreter pwsh # Or convert to a standard bash script
```
