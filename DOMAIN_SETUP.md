# Domain Setup Guide for AuraFix

## Domain Structure
- **kibetronoh.com** → Main store (client)
- **admin.kibetronoh.com** → Admin panel
- **api.kibetronoh.com** → Backend API (optional, can use Render URL)

## Step 1: Deploy Admin Panel First

### Build Admin Panel:
```bash
cd admin
npm install
npm run build
```

### Deploy to Netlify:
1. Go to netlify.com/drop
2. Drag the `admin/build` folder
3. Note the temporary URL (e.g., `amazing-name-123456.netlify.app`)

## Step 2: Configure Custom Domains in Netlify

### For Main Site (kibetronoh.com):
1. Go to your main Netlify site dashboard
2. **Site settings** → **Domain management**
3. Click **Add custom domain**
4. Enter: `kibetronoh.com`
5. Also add: `www.kibetronoh.com`

### For Admin Panel (admin.kibetronoh.com):
1. Go to your admin Netlify site dashboard
2. **Site settings** → **Domain management**
3. Click **Add custom domain**
4. Enter: `admin.kibetronoh.com`

## Step 3: Configure DNS in Namecheap

### Login to Namecheap:
1. Go to namecheap.com
2. Login to your account
3. Go to **Domain List** → **Manage** (for kibetronoh.com)
4. Click **Advanced DNS**

### Add DNS Records:

#### For Main Domain (kibetronoh.com):
```
Type: A Record
Host: @
Value: 75.2.60.5
TTL: Automatic

Type: CNAME
Host: www
Value: your-main-site.netlify.app
TTL: Automatic
```

#### For Admin Subdomain (admin.kibetronoh.com):
```
Type: CNAME
Host: admin
Value: your-admin-site.netlify.app
TTL: Automatic
```

#### Optional - API Subdomain (api.kibetronoh.com):
```
Type: CNAME
Host: api
Value: your-backend.onrender.com
TTL: Automatic
```

## Step 4: Update Environment Variables

### Client (.env.production):
```
REACT_APP_API_URL=https://your-backend.onrender.com
REACT_APP_SITE_URL=https://kibetronoh.com
```

### Admin (.env.production):
```
REACT_APP_API_URL=https://your-backend.onrender.com
REACT_APP_SITE_URL=https://admin.kibetronoh.com
```

## Step 5: SSL Certificates
Netlify automatically provides free SSL certificates for custom domains.
After DNS propagation (24-48 hours), your sites will have HTTPS.

## Step 6: Verification Steps

### Test URLs:
- https://kibetronoh.com → Main store
- https://www.kibetronoh.com → Redirects to main store
- https://admin.kibetronoh.com → Admin panel

### DNS Propagation Check:
Use tools like:
- whatsmydns.net
- dnschecker.org

## Timeline:
- **Immediate**: Netlify deployment
- **15 minutes**: Netlify recognizes custom domains
- **24-48 hours**: Full DNS propagation worldwide

## Troubleshooting:

### Domain Not Working:
1. Check DNS records in Namecheap
2. Wait for DNS propagation
3. Clear browser cache
4. Try incognito/private mode

### SSL Certificate Issues:
1. Wait 24 hours after DNS setup
2. Contact Netlify support if needed
3. Check domain verification in Netlify

### CORS Errors:
Update backend CORS_ORIGIN to include both:
- https://kibetronoh.com
- https://admin.kibetronoh.com
