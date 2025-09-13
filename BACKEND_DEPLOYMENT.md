# Backend Deployment Guide - Render

## Step 1: Deploy to Render

### 1. Go to Render.com
1. Visit https://render.com
2. Sign up or login
3. Click **"New Web Service"**

### 2. Connect GitHub Repository
1. Click **"Connect GitHub"**
2. Select your `aurafix-cosmetics` repository
3. Click **"Connect"**

### 3. Configure Service Settings
```
Name: aurafix-backend
Root Directory: server
Environment: Node
Region: Oregon (US West) - or closest to you
Branch: main (or master)
Build Command: npm install
Start Command: npm start
```

### 4. Set Instance Type
- **Free Tier**: Free (but sleeps after 15 min of inactivity)
- **Starter**: $7/month (recommended for production)

## Step 2: Environment Variables

Add these in Render's Environment Variables section:

### Required Variables:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here
CORS_ORIGIN=https://kibetronoh.com,https://admin.kibetronoh.com
```

### Optional Variables (if using):
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Step 3: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Start your server (`npm start`)

## Step 4: Get Your Backend URL

After deployment, you'll get a URL like:
`https://aurafix-backend-xyz123.onrender.com`

## Step 5: Update Frontend Environment Variables

### Update Client (Netlify):
1. Go to your main Netlify site
2. Site settings → Environment variables
3. Update: `REACT_APP_API_URL=https://your-render-url.onrender.com`

### Update Admin (when deployed):
Same process for admin panel.

## Step 6: Test Backend

Visit these URLs to test:
- `https://your-render-url.onrender.com/api/health` - Health check
- `https://your-render-url.onrender.com/api/products` - Products API

## Troubleshooting

### Common Issues:
1. **Build fails**: Check Node.js version in package.json
2. **MongoDB connection fails**: Verify MONGODB_URI
3. **CORS errors**: Update CORS_ORIGIN with your domains
4. **JWT errors**: Set a strong JWT_SECRET

### Logs:
- Check Render dashboard for deployment logs
- Look for error messages during build/start

## Free Tier Limitations:
- Sleeps after 15 minutes of inactivity
- Takes 30+ seconds to wake up
- 750 hours/month limit

## Production Recommendations:
- Use Starter plan ($7/month) for always-on service
- Set up health check endpoint
- Enable auto-deploy from GitHub
- Monitor logs regularly
