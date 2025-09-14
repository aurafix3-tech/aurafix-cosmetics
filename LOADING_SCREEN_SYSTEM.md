# Loading Screen & Page Background System

## Overview

The AuraFix application now includes a comprehensive loading screen and page background management system that allows administrators to customize backgrounds for different pages and loading screens through the admin panel.

## Features

### 🎨 Customizable Page Backgrounds
- **Home Page**: Custom background for the main landing page
- **Products Page**: Dedicated background for product listings
- **About Page**: Personalized background for company information
- **Contact Page**: Custom background for contact forms
- **Loading Screen**: Special background shown during page loads

### 🎬 Media Support
- **Images**: JPEG, PNG, WebP, GIF formats supported
- **Videos**: MP4, WebM, MOV formats supported with auto-loop and mute
- **File Size**: Up to 50MB for videos, 5MB for images

### ⚙️ Customization Options
- **Overlay Color**: Adjustable overlay color with color picker
- **Overlay Opacity**: Slider control from 0-100%
- **Media Position**: Cover, Contain, Center, Top, Bottom options
- **Loading Duration**: Configurable loading screen duration (1-10 seconds)
- **Active/Inactive**: Toggle backgrounds on/off per page

## Admin Interface

### Accessing Page Backgrounds
1. Log into the admin panel
2. Navigate to **Page Backgrounds** in the sidebar
3. View all page background cards with previews

### Adding/Editing Backgrounds
1. Click **Add Background** or **Edit** on existing background
2. Select the target page from dropdown
3. Upload image or video file (drag & drop supported)
4. Configure overlay settings:
   - Choose overlay color
   - Adjust opacity slider
   - Set media position
5. For loading screens, set duration in milliseconds
6. Save changes

### Managing Backgrounds
- **Enable/Disable**: Toggle backgrounds without deleting
- **Delete**: Remove backgrounds completely
- **Preview**: See live preview with overlay effects

## Technical Implementation

### Backend Components
- **Model**: `server/models/PageBackground.js` - MongoDB schema
- **Routes**: `server/routes/pageBackgrounds.js` - API endpoints
- **Storage**: Files stored in `server/public/uploads/backgrounds/`

### Frontend Components
- **PageLoadingScreen**: `client/src/components/UI/PageLoadingScreen.js`
- **PageWrapper**: `client/src/components/Layout/PageWrapper.js`
- **Admin Interface**: `admin/src/pages/PageBackgrounds.js`
- **Hook**: `client/src/hooks/usePageBackground.js`

### API Endpoints
```
GET    /api/backgrounds          - Get all backgrounds
GET    /api/backgrounds/:page    - Get specific page background
POST   /api/backgrounds          - Create/update background
DELETE /api/backgrounds/:page    - Delete background
PATCH  /api/backgrounds/:page/toggle - Toggle active status
```

## Usage

### Client-Side Integration
Pages are automatically wrapped with `PageWrapper` component:

```jsx
<PageWrapper pageName="home" loadingText="Welcome to AuraFix">
  <YourPageContent />
</PageWrapper>
```

### Loading Screen Behavior
- Shows once per session per page
- Displays progress bar and animated dots
- Uses session storage to prevent repeated loading
- Automatically transitions to page content

### Background Display
- Fixed position backgrounds cover entire viewport
- Configurable overlay for text readability
- Video backgrounds auto-play, muted, and loop
- Responsive design for all screen sizes

## File Structure
```
server/
├── models/PageBackground.js
├── routes/pageBackgrounds.js
├── scripts/seedPageBackgrounds.js
└── public/uploads/backgrounds/

client/src/
├── components/
│   ├── UI/PageLoadingScreen.js
│   └── Layout/PageWrapper.js
├── hooks/usePageBackground.js
└── pages/ (wrapped with PageWrapper)

admin/src/
└── pages/PageBackgrounds.js
```

## Setup Instructions

1. **Install Dependencies**: All required packages are already included
2. **Database**: PageBackground model will auto-create collection
3. **File Storage**: Upload directory created automatically
4. **Admin Access**: Navigate to `/backgrounds` in admin panel
5. **Seed Data**: Run `node server/scripts/seedPageBackgrounds.js` (optional)

## Best Practices

### Image Guidelines
- **Resolution**: Minimum 1920x1080 for full HD displays
- **Format**: WebP recommended for best compression
- **Content**: Ensure images work well with overlay
- **File Size**: Keep under 2MB for optimal loading

### Video Guidelines
- **Duration**: 10-30 seconds for seamless loops
- **Format**: MP4 with H.264 codec recommended
- **Resolution**: 1920x1080 maximum
- **File Size**: Keep under 20MB for web performance

### UX Considerations
- **Loading Duration**: 2-3 seconds optimal for user experience
- **Overlay Opacity**: 0.3-0.5 for good text readability
- **Content Relevance**: Match backgrounds to page purpose
- **Accessibility**: Provide meaningful alt text

## Troubleshooting

### Common Issues
1. **Upload Fails**: Check file size limits and format support
2. **Background Not Showing**: Verify background is active and file exists
3. **Loading Screen Stuck**: Check network connection and API endpoints
4. **Admin Access Denied**: Ensure user has admin role

### File Path Issues
- Backgrounds stored in `/server/public/uploads/backgrounds/`
- URLs served as `/uploads/backgrounds/filename`
- Static file serving configured in server.js

## Future Enhancements

### Planned Features
- **Scheduled Backgrounds**: Time-based background changes
- **A/B Testing**: Multiple backgrounds per page with analytics
- **Template Library**: Pre-made background collections
- **Bulk Upload**: Multiple file upload with batch processing
- **CDN Integration**: External storage for better performance
- **Animation Effects**: Parallax and other visual effects
