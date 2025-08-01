# SmartPark - Smart Parking Management System

A modern, full-stack parking management application built with React, Node.js, and MongoDB.

## 🚀 Features

### User Features
- **User Authentication**: Secure registration, login, and profile management
- **Parking Discovery**: Browse available parking places and slots
- **Real-time Booking**: Instant booking with conflict detection
- **Payment Integration**: Secure payment processing
- **Booking Management**: View, modify, and cancel bookings
- **Notifications**: Email and push notifications
- **Mobile Responsive**: Optimized for all devices

### Admin Features
- **Dashboard**: Comprehensive analytics and statistics
- **Parking Management**: Add, edit, and manage parking places and slots
- **User Management**: Monitor and manage user accounts
- **Booking Oversight**: View and manage all bookings
- **Reports**: Generate detailed reports and exports
- **System Settings**: Configure application settings

### Technical Features
- **Modern Stack**: React 18, Node.js, MongoDB, Tailwind CSS
- **Security**: JWT authentication, rate limiting, input validation
- **Performance**: Optimized queries, caching, compression
- **Scalability**: Modular architecture, RESTful APIs
- **Development**: Hot reloading, linting, testing setup

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **Jest** - Testing framework
- **Nodemon** - Development server
- **Concurrently** - Run multiple commands

## 📁 Project Structure

```
Smartpark-Web/
├── Frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   └── ui/         # Base UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind configuration
│   └── postcss.config.js   # PostCSS configuration
├── Backend/                # Node.js backend application
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   └── server.js         # Express server
├── package.json          # Root dependencies and scripts
└── README.md            # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/babayaga067/Smartpark-Web.git
   cd Smartpark-Web
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Create `.env` file in the root directory:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   
   # Database
   MONGO_URI=mongodb://localhost:27017/smartpark
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d
   JWT_REFRESH_SECRET=your_refresh_token_secret
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   
   # Email Configuration (for production)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # File Upload
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both frontend (port 3000) and backend (port 5000) servers.

### Alternative Setup

**Frontend only:**
```bash
npm run dev:frontend
```

**Backend only:**
```bash
npm run dev:backend
```

## 📚 Available Scripts

### Root Scripts
- `npm run dev` - Start both frontend and backend in development
- `npm run build` - Build frontend for production
- `npm run test` - Run all tests
- `npm run lint` - Lint all code
- `npm run clean` - Clean all node_modules and build files
- `npm run setup` - Complete setup (install + build)

### Frontend Scripts
- `npm run dev:frontend` - Start Vite dev server
- `npm run build:frontend` - Build for production
- `npm run lint:frontend` - Lint frontend code
- `npm run preview` - Preview production build

### Backend Scripts
- `npm run dev:backend` - Start backend with nodemon
- `npm run test:backend` - Run backend tests
- `npm run lint:backend` - Lint backend code

## 🔧 Configuration

### Frontend Configuration

**Vite Configuration** (`Frontend/vite.config.js`):
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

**Tailwind Configuration** (`Frontend/tailwind.config.js`):
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [],
}
```

### Backend Configuration

**Database Connection** (`Backend/config/db.js`):
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## 🗄 Database Schema

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (user/admin/manager),
  avatar: String,
  emailVerified: Boolean,
  isSuspended: Boolean,
  preferences: Object,
  // ... other fields
}
```

### Parking Place Model
```javascript
{
  name: String,
  description: String,
  address: String,
  location: {
    type: "Point",
    coordinates: [Number, Number]
  },
  capacity: Number,
  pricing: Object,
  amenities: Array,
  // ... other fields
}
```

### Booking Model
```javascript
{
  userId: ObjectId,
  placeId: ObjectId,
  slotId: ObjectId,
  startTime: Date,
  endTime: Date,
  status: String,
  amount: Number,
  payment: Object,
  // ... other fields
}
```

## 🔐 Authentication & Security

### JWT Authentication
- Access tokens (30 days)
- Refresh tokens (7 days)
- Secure token storage
- Automatic token refresh

### Security Features
- Password hashing with bcrypt
- Rate limiting
- Input validation and sanitization
- CORS protection
- Helmet security headers
- XSS protection
- SQL injection prevention

### Role-Based Access Control
- **User**: Basic booking and profile management
- **Manager**: Parking place and slot management
- **Admin**: Full system access

## 🧪 Testing

### Backend Testing
```bash
npm run test:backend
```

### Frontend Testing
```bash
npm run test:frontend
```

### Test Coverage
```bash
npm run test -- --coverage
```

## 📦 Deployment

### Frontend Deployment
```bash
npm run build:frontend
```

### Backend Deployment
```bash
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the development team

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the fast build tool
- Tailwind CSS team for the utility-first CSS framework
- MongoDB team for the flexible database
- Express.js team for the web framework

---

**Built with ❤️ by the SmartPark Team** 