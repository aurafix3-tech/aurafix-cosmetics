# GitHub Setup Guide for AuraFix

## Step 1: Install Git
1. Download Git from: https://git-scm.com/download/win
2. Run the installer with default settings
3. Restart your terminal/command prompt

## Step 2: Configure Git (First time only)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Create GitHub Repository
1. Go to https://github.com
2. Click "New repository"
3. Repository name: `aurafix-cosmetics`
4. Description: `Premium cosmetics ecommerce store for Egerton University`
5. Make it **Public** (so you can deploy for free)
6. Don't initialize with README (we already have files)
7. Click "Create repository"

## Step 4: Push Your Code
Open terminal in your AuraFix folder and run:

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: AuraFix cosmetics ecommerce store"

# Add GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/aurafix-cosmetics.git

# Push to GitHub
git push -u origin main
```

## Step 5: Deploy from GitHub

### Frontend (Netlify):
1. Go to https://netlify.com
2. Click "New site from Git"
3. Connect to GitHub
4. Select `aurafix-cosmetics` repository
5. Build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`
6. Add environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   REACT_APP_SITE_URL=https://kibetronoh.com
   ```
7. Deploy!

### Backend (Render):
1. Go to https://render.com
2. Click "New Web Service"
3. Connect to GitHub
4. Select `aurafix-cosmetics` repository
5. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables (see server/.env.example)
7. Deploy!

### Admin Panel:
1. Create another Netlify site
2. Same repository, but:
   - **Base directory**: `admin`
   - **Build command**: `npm run build`
   - **Publish directory**: `admin/build`

## Step 6: Configure Custom Domain
1. In Netlify → Domain settings
2. Add custom domain: `kibetronoh.com`
3. In Namecheap DNS:
   ```
   Type: A
   Host: @
   Value: 75.2.60.5

   Type: CNAME
   Host: www
   Value: your-site.netlify.app
   ```

## Quick Commands Reference
```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push changes
git push

# Pull latest changes
git pull
```

## Troubleshooting
- **Git not found**: Install Git from git-scm.com
- **Permission denied**: Use HTTPS URL instead of SSH
- **Build fails**: Check Node.js version (use Node 18+)
- **Environment variables**: Make sure they're set in deployment platform
