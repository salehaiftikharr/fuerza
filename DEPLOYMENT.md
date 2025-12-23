# Fuerza Deployment Guide

This guide walks through deploying the Fuerza app with:
- **Frontend**: Vercel
- **Backend**: Railway
- **Database**: Railway MySQL (or PlanetScale)

## Prerequisites

- GitHub account with this repo pushed
- Vercel account (free tier works)
- Railway account (free tier works)

---

## Step 1: Deploy the Database (Railway)

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"** → **"Provision MySQL"**
3. Once created, click on the MySQL service
4. Go to **"Variables"** tab and copy these values:
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`
   - Or use the `DATABASE_URL` (recommended)

5. **Run the schema**: Connect to your database using a MySQL client and run the contents of `database/schema.sql`

   Using Railway CLI:
   ```bash
   railway connect mysql
   # Then paste the contents of database/schema.sql
   ```

   Or use a GUI tool like TablePlus/DBeaver with the connection details.

---

## Step 2: Deploy the Backend (Railway)

1. In your Railway project, click **"New"** → **"GitHub Repo"**
2. Select your Fuerza repository
3. Railway will detect a monorepo. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. Go to **"Variables"** tab and add:
   ```
   NODE_ENV=production
   DATABASE_URL=${{MySQL.DATABASE_URL}}  (use the reference variable)
   JWT_SECRET=<generate-a-strong-secret>
   JWT_REFRESH_SECRET=<generate-another-strong-secret>
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   CLIENT_URL=<your-vercel-url>  (add after Step 3)
   ```

   To generate secrets, run in terminal:
   ```bash
   openssl rand -base64 32
   ```

5. Go to **"Settings"** → **"Networking"** → **"Generate Domain"**
6. Copy your Railway URL (e.g., `https://fuerza-server-production.up.railway.app`)

---

## Step 3: Deploy the Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variable:
   - `VITE_API_URL` = `https://your-railway-url.up.railway.app` (from Step 2)

6. Click **"Deploy"**

7. Copy your Vercel URL (e.g., `https://fuerza.vercel.app`)

---

## Step 4: Update CORS Settings

1. Go back to Railway → your server service → Variables
2. Update `CLIENT_URL` with your Vercel URL:
   ```
   CLIENT_URL=https://fuerza.vercel.app
   ```
3. Railway will automatically redeploy

---

## Verification

1. Visit your Vercel URL
2. Try to sign up/login
3. Check Railway logs if you encounter issues:
   - Railway Dashboard → Server Service → Logs

---

## Environment Variables Summary

### Server (Railway)
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@host:port/db` |
| `JWT_SECRET` | Access token secret | Random 32+ char string |
| `JWT_REFRESH_SECRET` | Refresh token secret | Random 32+ char string |
| `JWT_EXPIRES_IN` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `7d` |
| `CLIENT_URL` | Frontend URL for CORS | `https://fuerza.vercel.app` |

### Client (Vercel)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://fuerza-server.up.railway.app` |

---

## Troubleshooting

### 404 Error on Routes
The `client/vercel.json` handles SPA routing. If you still get 404s on routes like `/explore`, ensure the vercel.json is deployed.

### CORS Errors
Make sure `CLIENT_URL` in Railway matches your exact Vercel URL (including `https://`).

### Database Connection Issues
- Check that `DATABASE_URL` is correctly set in Railway
- Verify the schema was run on the database
- Check Railway logs for connection errors

### API Errors
- Check browser DevTools Network tab for the actual error
- Check Railway server logs
- Ensure `VITE_API_URL` in Vercel doesn't have a trailing slash
