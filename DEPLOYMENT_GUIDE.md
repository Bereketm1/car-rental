# Zelalem Motors Deployment Guide

Because this application relies on **persistent local SQLite files** and **multiple long-running Node.js microservices**, it cannot be entirely deployed to a "Serverless" platform like Vercel (which wipes all files on every request). 

The optimal strategy is a **Hybrid Deployment**:
1. **Frontend:** Deployed to Vercel for lightning-fast UI delivery.
2. **Backend:** Deployed to Render (or Railway) for persistent data storage and long-running Express microservice processes.

---

## 1. Deploy the Backend (API & Microservices)

We recommend using **Render** as it natively handles background Node.js processes and persistent disks perfectly.

### Using Render.com
1. Create a free account at [render.com](https://render.com).
2. Create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the following configuration:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run start` *(Ensure your root `package.json` has a `"start": "node apps/api-gateway/src/index.js & node apps/services/crm/src/index.js ..."` script, or use PM2).*
5. **CRITICAL STEP (Persistent Data):** Go to the "Advanced" settings and add a **Disk**.
   - Name: `sqlite-data`
   - Mount Path: `/opt/render/project/src/apps/services`
   - Size: `1 GB`
6. Click **Create Web Service**.
7. Once deployed, Render will give you a public URL (e.g., `https://zelalem-api.onrender.com`). **Copy this URL**.

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
