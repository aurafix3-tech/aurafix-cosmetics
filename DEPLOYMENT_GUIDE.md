# AuraFix Deployment Guide - kibetronoh.com

## 🚀 Complete Deployment Instructions

### Prerequisites
- Node.js 18+ installed
- Git installed
- Netlify account
- MongoDB Atlas account (for database)
- Your kibetronoh.com domain from Namecheap

## Phase 1: Backend Deployment (Render/Railway)

### 1. Deploy Backend to Render
1. Go to [render.com](https://render.com) and create account
2. Connect your GitHub repository
3. Create new Web Service
4. Use these settings:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_jwt_secret_key
     PORT=5000
     CORS_ORIGIN=https://kibetronoh.com
     ```

### 2. Get MongoDB Atlas Database
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Add to Render environment variables

## Phase 2: Frontend Deployment (Netlify)

### 1. Build the Client
```bash
cd client
npm install
npm run build
```

### 2. Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `client/build` folder
3. Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=client/build
   ```

### 3. Configure Custom Domain
1. In Netlify dashboard → Domain settings
2. Add custom domain: `kibetronoh.com`
3. Follow DNS configuration instructions

## Phase 3: Admin Panel Deployment

### 1. Build Admin Panel
```bash
cd admin
npm install
npm run build
```

### 2. Deploy Admin to Subdomain
- Deploy admin build to `admin.kibetronoh.com`
- Or create separate Netlify site

## Phase 4: Domain Configuration (Namecheap)

### DNS Settings in Namecheap:
```
Type: CNAME
Host: www
Value: your-netlify-site.netlify.app

Type: A
Host: @
Value: 75.2.60.5 (Netlify's load balancer)

Type: CNAME  
Host: admin
Value: your-admin-netlify-site.netlify.app
```

## Phase 5: Environment Variables

### Client (.env.production)
```
REACT_APP_API_URL=https://your-backend.onrender.com
REACT_APP_SITE_URL=https://kibetronoh.com
GENERATE_SOURCEMAP=false
```

### Admin (.env.production)
```
REACT_APP_API_URL=https://your-backend.onrender.com
REACT_APP_SITE_URL=https://admin.kibetronoh.com
GENERATE_SOURCEMAP=false
```

## Phase 6: Testing Checklist

- [ ] Backend API responds at your Render URL
- [ ] Frontend loads at kibetronoh.com
- [ ] Admin panel loads at admin.kibetronoh.com
- [ ] User registration works
- [ ] Product creation works
- [ ] Featured products display on homepage
- [ ] Cart functionality works
- [ ] Database connections work

## Quick Deploy Commands

### Option 1: Manual Upload
1. Build: `npm run build` in client folder
2. Upload `build` folder to Netlify
3. Configure domain

### Option 2: Git Integration
1. Push code to GitHub
2. Connect Netlify to repository
3. Auto-deploy on commits

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Update backend CORS_ORIGIN
2. **API Not Found**: Check API URL in environment variables
3. **Build Fails**: Check Node.js version compatibility
4. **Domain Not Working**: Verify DNS propagation (24-48 hours)

## Production Optimizations

### Performance:
- Enable Gzip compression
- Add CDN for images
- Optimize bundle size
- Enable caching headers

### Security:
- HTTPS only
- Security headers configured
- Environment variables secured
- Database access restricted

## Support
- Backend logs: Check Render dashboard
- Frontend errors: Browser console
- DNS issues: Use DNS checker tools
