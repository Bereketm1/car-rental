# Zelalem Motors Hybrid Deployment Guide

This guide explains how to host your **Backend** on your cPanel server and your **Frontend** on Vercel.

- **Backend (cPanel):** `https://zelalemapi.piassabet.com`
- **Frontend (Vercel):** `https://your-app.vercel.app`

---

## Phase 1: Set up the Backend on cPanel

1. **Log into cPanel** and go to **Subdomains**.
2. Create the subdomain `zelalemapi` for `piassabet.com`.
3. **Open Terminal via SSH** and launch the backend:
   ```bash
   cd ~/car-rental
   # Install Node.js if you haven't (curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash)
   nvm install 20
   npm install
   npx pm2 start start-prod.js --name "zelalem-api"
   ```
4. **Reverse Proxy to Port 3000:**
   In cPanel **File Manager**, go to the folder for `zelalemapi.piassabet.com`.
   Create a `.htaccess` file and paste this code:
   ```apache
   RewriteEngine On
   RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
   ```
   *Your backend is now live at `https://zelalemapi.piassabet.com`.*

---

## Phase 2: Set up the Frontend on Vercel

1. **Push your code to GitHub** (ensure all latest changes are pushed).
2. **Log into Vercel** and click **Add New Project**.
3. Import your GitHub repository.
4. **Configure Project:**
   - **Framework Preset:** `Vite`
   - **Root Directory:** Set to `apps/web`
5. **Environment Variables:**
   Add a new variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://zelalemapi.piassabet.com/api`
6. **Deploy!**

Vercel will build the React app and automatically connect it to your cPanel backend.

---

## Phase 3: Final Verification

Visit your Vercel URL. If you can log in, the connection between Vercel and your cPanel server is successful!