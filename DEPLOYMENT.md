# Collabzz Board - Deployment Guide

## 🚀 Deploy the Backend API

### Option 1: Deploy on Railway (Recommended - Easiest)

**Step 1: Create a Railway Account**
1. Go to https://railway.app
2. Sign up with GitHub or email
3. Create a new project

**Step 2: Deploy Backend**
1. In Railway dashboard, click "New Project"
2. Select "Deploy from GitHub"
3. Connect your GitHub account and authorize Railway
4. Select this repository
5. Railway will auto-detect the Node.js app

**Step 3: Set Environment Variables in Railway**
In your Railway project settings, add these variables:
```
MONGODB_URI=mongodb+srv://bhargavjagdishs64_db_user:TH3A4COd33sUthQx@co-1.1pvgnbu.mongodb.net/collabzz-board?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-url.vercel.app
PORT=3000
```

**Step 4: Deploy**
- Railway auto-deploys when you push to main branch
- You'll get a public URL like: `https://collabzz-api-production.up.railway.app`

---

### Option 2: Manual Git Push to Railway

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize Railway in your project
railway init

# 4. Link to your project
railway link

# 5. Set environment variables
railway variables set MONGODB_URI="your-mongodb-uri"
railway variables set JWT_SECRET="your-secret"
railway variables set JWT_EXPIRES_IN="7d"
railway variables set CLIENT_URL="https://your-frontend-url"

# 6. Deploy
railway up
```

---

### Option 3: Deploy on Render.com

1. Go to https://render.com
2. Connect GitHub repository
3. Create new Web Service
4. Set build command: `cd backend && npm install && npm run build`
5. Set start command: `cd backend && npm run start`
6. Add environment variables
7. Deploy

---

## 🌐 Update Frontend with Deployed API URL

Once you have your deployed API URL, update the frontend `.env` file:

```env
NEXT_PUBLIC_API_URL=https://your-deployed-api-url.com/api
```

For example:
```env
NEXT_PUBLIC_API_URL=https://collabzz-api-production.up.railway.app/api
```

---

## 📋 Deployed Links Template

After deployment, you'll have:

**Backend API:** `https://your-api-domain.com`
- Health Check: `https://your-api-domain.com/api/health`
- Register: `POST https://your-api-domain.com/api/auth/register`
- Login: `POST https://your-api-domain.com/api/auth/login`

**Frontend:** (Deploy separately on Vercel)
- https://your-frontend-domain.vercel.app

---

## ✅ Verify Deployment

Test your deployed API:

```bash
curl https://your-api-domain.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Collabzz Board API is running"
}
```

---

## 🔒 Important Security Notes

1. **Never commit .env files** - Already excluded in .gitignore
2. **Keep MongoDB URI secret** - Use Railway/Render environment variables
3. **Update JWT_SECRET** - Generate a secure random string
4. **Enable HTTPS** - Railway and Render provide free HTTPS
5. **Set CORS properly** - Update CLIENT_URL to match your frontend domain

---

## 📞 Troubleshooting

**App crashes on startup:**
- Check logs in Railway/Render dashboard
- Verify MONGODB_URI is correct
- Ensure all required env variables are set

**API not responding:**
- Check if service is running in dashboard
- Verify firewall/network settings
- Check logs for errors

**MongoDB connection error:**
- Verify connection string
- Check IP whitelist in MongoDB Atlas
- Ensure username/password are correct

---

## 🎉 You're Done!

Your Collabzz Board API is now live and accessible from anywhere!
