# Aurafixx - Cosmetics Ecommerce Store

A modern, full-featured cosmetics ecommerce platform with 3D product visualization and comprehensive admin dashboard.

## 🌟 Features

### Customer Frontend
- **3D Product Visualization** - Interactive 3D models using React Three Fiber
- **Modern Shopping Experience** - Cart, wishlist, checkout, user profiles
- **Advanced Product Catalog** - Filtering, search, pagination, categories
- **Responsive Design** - Mobile-first approach with smooth animations
- **User Authentication** - Secure login/register with JWT tokens

### Admin Dashboard
- **Analytics Dashboard** - Revenue tracking, sales charts, performance metrics
- **Product Management** - Full CRUD with image/3D model uploads, variants, SEO
- **Category Management** - Hierarchical categories with image support
- **Order Management** - Complete order tracking and status updates
- **User Management** - Role-based access control and user administration
- **Settings Panel** - Profile management, security, notifications

### Backend API
- **RESTful API** - Complete product, order, user, and category endpoints
- **Authentication** - JWT-based auth with role-based access control
- **File Uploads** - Support for images and 3D models
- **Database Integration** - MongoDB with Mongoose ODM
- **Security** - Helmet, rate limiting, input validation

## 🛠️ Tech Stack

### Frontend
- **React** - Modern hooks-based components
- **React Three Fiber** - 3D graphics and animations
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Smooth animations and transitions
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **React Router** - Client-side routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **Bcrypt** - Password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Aurafixx
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Install admin dependencies**
   ```bash
   cd ../admin
   npm install
   ```

### Environment Setup

1. **Backend Environment Variables**
   Create a `.env` file in the `server` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/aurafixx
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=30d
   
   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   
   # Stripe (for payments)
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   
   # Email (for notifications)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_EMAIL=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   ```

2. **Database Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Update the `MONGODB_URI` in your `.env` file

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on http://localhost:5000

2. **Start the client application**
   ```bash
   cd client
   npm start
   ```
   Client will run on http://localhost:3000

3. **Start the admin dashboard**
   ```bash
   cd admin
   npm start
   ```
   Admin will run on http://localhost:3001

## 📁 Project Structure

```
Aurafixx/
├── server/                 # Backend API
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── uploads/           # File uploads directory
│   └── server.js          # Main server file
├── client/                # Customer frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # State management
│   │   └── App.js         # Main app component
│   └── public/            # Static assets
├── admin/                 # Admin dashboard
│   ├── src/
│   │   ├── components/    # Admin components
│   │   ├── pages/         # Admin pages
│   │   ├── store/         # Admin state
│   │   └── App.js         # Admin app component
│   └── public/            # Admin assets
└── README.md              # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/analytics` - Analytics data

## 🎨 Customization

### Adding New Product Categories
1. Use the admin dashboard to create categories
2. Categories support hierarchical structure (parent/child)
3. Upload category images for better visual representation

### Customizing 3D Models
1. Upload 3D models in GLB/GLTF format
2. Models are automatically optimized for web display
3. Supports interactive controls and color variants

### Styling and Themes
- Modify styled-components in each component file
- Global styles are in `src/index.css`
- Color scheme can be updated in the styled-components theme

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt for secure password storage
- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Configured for secure cross-origin requests
- **Helmet Security** - Additional security headers

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)
1. Set environment variables on your hosting platform
2. Configure MongoDB connection string
3. Set up Cloudinary for image hosting
4. Configure Stripe for payments

### Frontend Deployment (Netlify/Vercel)
1. Build the client: `npm run build`
2. Deploy the build folder
3. Configure API proxy settings
4. Set up custom domain (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🎯 Future Enhancements

- [ ] Multi-language support (i18n)
- [ ] Advanced analytics and reporting
- [ ] Social media integration
- [ ] Email marketing automation
- [ ] Advanced search with filters
- [ ] Product recommendations
- [ ] Inventory management alerts
- [ ] Customer reviews and ratings
- [ ] Wishlist sharing
- [ ] Progressive Web App (PWA) features

---

Built with ❤️ for the modern cosmetics industry
