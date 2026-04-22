# Zelalem Motors Deployment Guide

Because this application relies on **persistent local SQLite files** and **multiple long-running Node.js microservices**, it cannot be entirely deployed to a "Serverless" platform like Vercel (which wipes all files on every request). 

The optimal strategy is a **Hybrid Deployment**:
1. **Frontend:** Deployed to Vercel for lightning-fast UI delivery.
2. **Backend:** Deployed to Render (or Railway) for persistent data storage and long-running Express microservice processes.

---

## 1. Deploy the Backend (API & Microservices)

Since many platforms are locking down their free tiers, the absolute best, most reliable platform that **guarantees no credit card is required** and supports full Node.js Docker environments is **Back4App Containers**.

*Note: Your container will sleep after 15 minutes of inactivity on the free tier, but our `start-prod.js` script will automatically re-seed your data instantly when it wakes up!*

### Using Back4App Containers (Highly Recommended)
Back4App will use the `Dockerfile` we already created in your repository to build and host your entire backend.

1. Go to [back4app.com](https://www.back4app.com) and sign up for free using your GitHub account.
2. Once logged in, click **Build a new app** and select **Containers as a Service (CaaS)**.
3. Connect your GitHub account and select this repository.
4. Set the following configuration:
   - **App Name:** `zelalem-motors-api` (or similar)
   - **Branch:** `main`
   - **Root Directory:** `./`
   - **Environment Variables:** You don't need any for the demo to work!
5. Click **Deploy**.
6. Back4App will automatically detect the `Dockerfile`, install all dependencies, and launch your microservices!
7. Once the deployment is green, you will see an "App URL" on the left sidebar (e.g., `https://zelalemmotorsapi-xxx.b4a.run`). **Copy this URL**.

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
