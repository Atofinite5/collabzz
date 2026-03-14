# 🚀 Deployment Reference Card

## GitHub Repository
```
https://github.com/Atofinite5/collabzz
```

## Deployment Checklist

- [ ] Code pushed to GitHub ✅ DONE
- [ ] Signed up on Railway.app
- [ ] Created Railway project
- [ ] Connected GitHub repository
- [ ] Set environment variables
- [ ] Deployment completed
- [ ] Got deployed API URL
- [ ] Tested health endpoint
- [ ] Updated frontend .env
- [ ] Tested frontend with deployed API

## Environment Variables for Railway

```
MONGODB_URI=mongodb+srv://bhargavjagdishs64_db_user:TH3A4COd33sUthQx@co-1.1pvgnbu.mongodb.net/collabzz-board?retryWrites=true&w=majority

JWT_SECRET=collabzz-secret-key-production-2024

JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:3000
(Update after frontend deployment)

PORT=3000
```

## Important Endpoints

### Health Check (Test if API is running)
```
GET https://your-deployed-url.up.railway.app/api/health
```

### Register User
```
POST https://your-deployed-url.up.railway.app/api/auth/register
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Login
```
POST https://your-deployed-url.up.railway.app/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

## Frontend Environment File

**File:** `frontend/.env`

```
NEXT_PUBLIC_API_URL=https://your-deployed-url.up.railway.app/api
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Deployment fails | Check Railway logs for errors |
| MongoDB connection error | Verify connection string is exact |
| API not responding | Ensure environment variables are set |
| 500 errors | Check backend logs in Railway |
| Frontend can't reach API | Update `NEXT_PUBLIC_API_URL` in .env |

## Useful Links

- Railway Dashboard: https://railway.app
- GitHub Repository: https://github.com/Atofinite5/collabzz
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- API Documentation: See DEPLOYMENT.md

---

**Status:** Ready to deploy! 🎉
