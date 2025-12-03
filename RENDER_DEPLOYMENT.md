# Deploy Backend to Render - Step by Step Guide

This guide will walk you through deploying your Assaana CMS Backend to Render.

## Prerequisites

1. ✅ GitHub account with your code pushed to a repository
2. ✅ MongoDB Atlas account (database connection string)
3. ✅ Cloudinary account (for file uploads)
4. ✅ Render account (sign up at [render.com](https://render.com))

---

## Step 1: Prepare Your Code

### 1.1 Ensure your code is on GitHub

1. If not already done, initialize git and push to GitHub:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. Make sure your `.env` file is **NOT** committed (should be in `.gitignore`)

### 1.2 Verify `.gitignore` includes:
   ```
   node_modules/
   .env
   uploads/
   *.log
   .DS_Store
   ```

---

## Step 2: Create MongoDB Atlas Database (if not done)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier is fine)
3. Create a database user:
   - Go to **Database Access** → **Add New Database User**
   - Username: `your-username`
   - Password: Generate a secure password (save it!)
   - Database User Privileges: **Read and write to any database**
4. Whitelist IP addresses:
   - Go to **Network Access** → **Add IP Address**
   - Click **Allow Access from Anywhere** (or add Render's IP ranges)
   - IP Address: `0.0.0.0/0`
5. Get your connection string:
   - Go to **Database** → **Connect** → **Connect your application**
   - Copy the connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/assana?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password

---

## Step 3: Get Cloudinary Credentials

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy your credentials:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

---

## Step 4: Create Web Service on Render

### 4.1 Sign up / Log in to Render

1. Go to [render.com](https://render.com)
2. Sign up or log in (you can use GitHub to sign in)

### 4.2 Create New Web Service

1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Connect your GitHub account (if not already connected)
4. Select your repository containing the backend code
5. Click **"Connect"**

### 4.3 Configure the Web Service

Fill in the following details:

- **Name**: `assaana-backend` (or your preferred name)
- **Region**: Choose closest to your users (e.g., `Oregon (US West)`)
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend` ⚠️ **IMPORTANT: Set this to `backend`**
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4.4 Set Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

#### Required Variables:

1. **MONGODB_URI**
   - Key: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/assana?retryWrites=true&w=majority`

2. **CLOUDINARY_CLOUD_NAME**
   - Key: `CLOUDINARY_CLOUD_NAME`
   - Value: Your Cloudinary cloud name

3. **CLOUDINARY_API_KEY**
   - Key: `CLOUDINARY_API_KEY`
   - Value: Your Cloudinary API key

4. **CLOUDINARY_API_SECRET**
   - Key: `CLOUDINARY_API_SECRET`
   - Value: Your Cloudinary API secret

#### Optional Variables:

5. **CLOUDINARY_FOLDER** (optional)
   - Key: `CLOUDINARY_FOLDER`
   - Value: `assana-uploads` (or your preferred folder name)

6. **NODE_ENV** (optional)
   - Key: `NODE_ENV`
   - Value: `production`

7. **PORT** (optional - Render sets this automatically)
   - Key: `PORT`
   - Value: `10000` (Render will override this, but you can set it)

### 4.5 Create the Service

1. Scroll down and click **"Create Web Service"**
2. Render will start building and deploying your service
3. This may take 5-10 minutes on first deploy

---

## Step 5: Monitor Deployment

1. Watch the **"Logs"** tab for build progress
2. Look for these success messages:
   - ✅ `npm install` completes successfully
   - ✅ `Cloudinary configured: your-cloud-name`
   - ✅ `MongoDB Connected Successfully!`
   - ✅ `Server started successfully!`

3. If you see errors:
   - Check that all environment variables are set correctly
   - Verify MongoDB connection string is correct
   - Ensure Cloudinary credentials are correct
   - Check that `Root Directory` is set to `backend`

---

## Step 6: Verify Deployment

### 6.1 Check Health Endpoint

Once deployed, your service will have a URL like:
```
https://assaana-backend.onrender.com
```

Test the health endpoint:
```
https://assaana-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Assaana CMS Backend is running",
  "database": {
    "connected": true,
  "state": "connected",
    "readyState": 1
  }
}
```

### 6.2 Test File Upload

1. Use your CMS to upload an image
2. Verify the image URL is a Cloudinary URL (starts with `https://res.cloudinary.com/`)
3. Check that the image is accessible

---

## Step 7: Update Frontend/CMS API URLs

### 7.1 Update CMS API Configuration

In your CMS project, update the API base URL:

**File**: `cms/src/services/api.js`

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://assaana-backend.onrender.com/api',
  // ... rest of config
});
```

Or set environment variable:
- Create `.env` in CMS folder:
  ```
  VITE_API_BASE_URL=https://assaana-backend.onrender.com/api
  ```

### 7.2 Update Frontend API Configuration

In your frontend project (`aasana_new`), update API calls to use the Render URL.

---

## Step 8: Configure CORS (if needed)

If your frontend is on a different domain, update CORS in `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000', // Local development
    'https://your-frontend-domain.com', // Production frontend
    'https://your-cms-domain.com' // Production CMS
  ],
  credentials: true
}));
```

---

## Important Notes

### Free Tier Limitations

- ⚠️ **Service spins down after 15 minutes of inactivity**
- ⚠️ **First request after spin-down takes 30-60 seconds** (cold start)
- ⚠️ **Consider paid tier for production** ($7/month for always-on)

### Environment Variables

- ✅ Never commit `.env` files to Git
- ✅ All sensitive data should be in Render's environment variables
- ✅ Update environment variables in Render dashboard, not in code

### Database

- ✅ MongoDB Atlas free tier: 512MB storage
- ✅ Ensure IP whitelist includes `0.0.0.0/0` for Render

### File Storage

- ✅ All files are stored in Cloudinary (persistent)
- ✅ No local file storage needed on Render

---

## Troubleshooting

### Build Fails

**Error**: `npm install` fails
- **Solution**: Check `package.json` is correct, verify Node version

**Error**: `Cannot find module`
- **Solution**: Ensure `Root Directory` is set to `backend`

### Server Won't Start

**Error**: `Cloudinary configuration missing`
- **Solution**: Verify all Cloudinary environment variables are set

**Error**: `MongoDB Connection Failed`
- **Solution**: 
  - Check MongoDB connection string
  - Verify IP whitelist includes `0.0.0.0/0`
  - Check username/password are correct

### 404 Errors

**Error**: Routes return 404
- **Solution**: Check that API calls use `/api/` prefix

### Slow Response Times

**Issue**: First request is very slow
- **Solution**: This is normal on free tier (cold start). Consider paid tier for production.

---

## Next Steps

1. ✅ Set up custom domain (optional)
2. ✅ Enable auto-deploy on git push
3. ✅ Set up monitoring/alerts
4. ✅ Configure SSL (automatic on Render)
5. ✅ Set up staging environment (optional)

---

## Quick Reference

### Render Dashboard
- **URL**: https://dashboard.render.com
- **Service URL**: `https://your-service-name.onrender.com`

### Environment Variables Checklist
- [ ] `MONGODB_URI`
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `CLOUDINARY_FOLDER` (optional)
- [ ] `NODE_ENV` (optional)

### Test Endpoints
- Health: `https://your-service.onrender.com/api/health`
- Upload: `POST https://your-service.onrender.com/api/uploads`

---

**Need Help?** Check Render's documentation: https://render.com/docs

