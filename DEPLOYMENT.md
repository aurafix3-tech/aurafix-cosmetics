# AuraFix Deployment Guide

This guide covers deploying the AuraFix ecommerce platform to production environments.

## 🚀 Quick Start

### Local Development
```bash
# Install all dependencies
npm run install-all

# Start all services (backend, client, admin)
npm run dev
```

### Production Build
```bash
# Build client and admin for production
npm run build

# Start production server
npm start
```

## 🌐 Environment Setup

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aurafix
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters
JWT_EXPIRE=30d

# Cloudinary (Image/File Storage)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Stripe (Payment Processing)
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key

# Email (SMTP Configuration)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-business-email@gmail.com
SMTP_PASSWORD=your-app-specific-password

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## 🏗️ Deployment Options

### Option 1: Railway (Recommended)
1. **Backend Deployment**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Deploy backend
   cd server
   railway deploy
   ```

2. **Frontend Deployment**
   ```bash
   # Deploy client to Netlify/Vercel
   cd client
   npm run build
   # Upload build folder to hosting service
   ```

### Option 2: Heroku
1. **Backend Setup**
   ```bash
   # Install Heroku CLI
   # Create Heroku app
   heroku create aurafix-api
   
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   
   # Deploy
   git subtree push --prefix server heroku main
   ```

### Option 3: DigitalOcean Droplet
1. **Server Setup**
   ```bash
   # Create Ubuntu 20.04 droplet
   # Install Node.js, MongoDB, Nginx
   
   # Clone repository
   git clone your-repo-url
   cd AuraFix
   
   # Install dependencies
   npm run install-all
   
   # Build production
   npm run build
   
   # Start with PM2
   npm install -g pm2
   pm2 start server/server.js --name "aurafix-api"
   ```

## 🗄️ Database Setup

### MongoDB Atlas (Cloud)
1. Create MongoDB Atlas account
2. Create new cluster
3. Add database user
4. Whitelist IP addresses
5. Get connection string
6. Update MONGODB_URI in environment

### Local MongoDB
```bash
# Install MongoDB
# Start MongoDB service
mongod --dbpath /data/db

# Create database
mongo
use aurafix
```

## 📁 File Storage Setup

### Cloudinary (Recommended)
1. Create Cloudinary account
2. Get API credentials from dashboard
3. Configure upload presets:
   - Products: `aurafix_products`
   - Categories: `aurafix_categories`
   - Users: `aurafix_users`

### AWS S3 Alternative
```javascript
// Alternative S3 configuration
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});
```

## 💳 Payment Setup

### Stripe Configuration
1. Create Stripe account
2. Get API keys from dashboard
3. Configure webhooks:
   - Endpoint: `https://your-api.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

### Test Cards
```
# Visa
4242 4242 4242 4242

# Mastercard
5555 5555 5555 4444

# Declined
4000 0000 0000 0002
```

## 📧 Email Setup

### Gmail SMTP
1. Enable 2-factor authentication
2. Generate app-specific password
3. Use in SMTP_PASSWORD

### SendGrid Alternative
```env
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@aurafix.com
FROM_NAME=AuraFix Team
```

## 🔒 Security Checklist

### SSL/HTTPS
- [ ] SSL certificate installed
- [ ] HTTPS redirect configured
- [ ] HSTS headers enabled

### Environment Variables
- [ ] All secrets in environment variables
- [ ] No hardcoded credentials
- [ ] Different keys for production

### Database Security
- [ ] MongoDB authentication enabled
- [ ] IP whitelist configured
- [ ] Regular backups scheduled

### API Security
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] SQL injection protection

## 🚦 Health Checks

### API Health Endpoint
```javascript
// GET /api/health
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "version": "1.0.0"
}
```

### Monitoring Setup
```bash
# Install monitoring tools
npm install -g pm2
pm2 install pm2-logrotate

# Monitor processes
pm2 monit

# Setup alerts
pm2 set pm2:autodump true
```

## 📊 Performance Optimization

### Backend Optimization
- Enable gzip compression
- Implement Redis caching
- Database indexing
- Image optimization

### Frontend Optimization
- Code splitting
- Lazy loading
- Image compression
- CDN integration

### Example Nginx Configuration
```nginx
server {
    listen 80;
    server_name aurafix.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name aurafix.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Static files
    location / {
        root /var/www/aurafix/client/build;
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy AuraFix

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Install dependencies
      run: npm run install-all
    
    - name: Build applications
      run: npm run build
    
    - name: Deploy to production
      run: |
        # Your deployment commands
```

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB URI
   - Verify network access
   - Check credentials

2. **File Upload Errors**
   - Verify Cloudinary credentials
   - Check file size limits
   - Validate file types

3. **Payment Processing Issues**
   - Verify Stripe keys
   - Check webhook endpoints
   - Test with Stripe CLI

4. **Email Not Sending**
   - Verify SMTP credentials
   - Check spam folders
   - Test email configuration

### Logs and Debugging
```bash
# View application logs
pm2 logs aurafix-api

# Check system resources
htop
df -h

# Monitor network
netstat -tulpn
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Load balancer setup
- Multiple server instances
- Database clustering
- CDN implementation

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching layers
- Code optimization

---

For additional support, refer to the main README.md or create an issue in the repository.
