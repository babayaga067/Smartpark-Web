# SmartPark Setup Guide

This guide will help you set up the SmartPark application on your local machine.

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## Step 1: Clone the Repository

```bash
git clone https://github.com/babayaga067/Smartpark-Web.git
cd Smartpark-Web
```

## Step 2: Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Or install separately:
npm install                    # Backend dependencies
cd Frontend && npm install    # Frontend dependencies
```

## Step 3: Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/smartpark
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/smartpark

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRE=30d
JWT_REFRESH_SECRET=your_refresh_token_secret_change_this_in_production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Email Configuration (optional, for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Security
BCRYPT_ROUNDS=12
```

## Step 4: Database Setup

### Option A: Local MongoDB

1. **Install MongoDB Community Edition**
   - [Download MongoDB](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB**
   ```bash
   # On Windows
   net start MongoDB
   
   # On macOS/Linux
   sudo systemctl start mongod
   # or
   brew services start mongodb-community
   ```

3. **Verify MongoDB is running**
   ```bash
   mongosh
   # or
   mongo
   ```

### Option B: MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account

2. **Create a cluster**
   - Choose the free tier
   - Select your preferred region

3. **Get connection string**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

4. **Update your .env file**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smartpark
   ```

## Step 5: Start the Application

### Development Mode (Recommended)

```bash
# Start both frontend and backend
npm run dev

# This will start:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:5000
```

### Individual Servers

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

## Step 6: Verify Installation

1. **Frontend**: Open http://localhost:3000
   - You should see the SmartPark homepage
   - Navigation should work properly

2. **Backend**: Open http://localhost:5000/api/health
   - You should see a JSON response with status "OK"

3. **Database**: Check MongoDB connection
   ```bash
   # If using local MongoDB
   mongosh smartpark
   show collections
   ```

## Step 7: Create Admin User

1. **Register a new user** through the frontend
2. **Update user role to admin** in the database:

```javascript
// In MongoDB shell or MongoDB Compass
use smartpark
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port 3000 or 5000
   lsof -i :3000
   lsof -i :5000
   
   # Kill the process
   kill -9 <PID>
   ```

2. **MongoDB connection failed**
   - Check if MongoDB is running
   - Verify connection string in .env
   - Check firewall settings

3. **Frontend build errors**
   ```bash
   # Clear node_modules and reinstall
   npm run clean:install
   ```

4. **Backend errors**
   ```bash
   # Check logs
   npm run dev:backend
   
   # Verify environment variables
   node -e "console.log(require('dotenv').config())"
   ```

### Development Tools

1. **MongoDB Compass** (GUI for MongoDB)
   - Download from [MongoDB Compass](https://www.mongodb.com/products/compass)
   - Connect to your database for easy data management

2. **Postman** (API Testing)
   - Download from [Postman](https://www.postman.com/)
   - Import API collection for testing endpoints

3. **VS Code Extensions**
   - MongoDB for VS Code
   - REST Client
   - Thunder Client

## Production Deployment

### Frontend Deployment

1. **Build the application**
   ```bash
   npm run build:frontend
   ```

2. **Deploy the `Frontend/dist` folder** to:
   - Netlify
   - Vercel
   - AWS S3
   - Any static hosting service

### Backend Deployment

1. **Set production environment variables**
   ```env
   NODE_ENV=production
   MONGO_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   FRONTEND_URL=https://your-domain.com
   ```

2. **Deploy to**:
   - Heroku
   - AWS EC2
   - DigitalOcean
   - Railway
   - Any Node.js hosting service

## Additional Configuration

### Email Setup (Optional)

For password reset and notifications:

1. **Gmail Setup**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

2. **Generate App Password**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"

### File Upload Setup

1. **Create uploads directory**
   ```bash
   mkdir -p Backend/uploads
   ```

2. **Set permissions**
   ```bash
   chmod 755 Backend/uploads
   ```

### SSL/HTTPS (Production)

1. **Obtain SSL certificate**
   - Let's Encrypt (free)
   - Your hosting provider

2. **Configure in production**
   ```env
   HTTPS=true
   SSL_CERT_PATH=/path/to/cert.pem
   SSL_KEY_PATH=/path/to/key.pem
   ```

## Support

If you encounter issues:

1. **Check the logs**
   ```bash
   npm run dev:backend  # Backend logs
   npm run dev:frontend # Frontend logs
   ```

2. **Verify all requirements**
   - Node.js version: `node --version`
   - npm version: `npm --version`
   - MongoDB: `mongosh --version`

3. **Create an issue** on GitHub with:
   - Error message
   - Steps to reproduce
   - Environment details

## Next Steps

After successful setup:

1. **Explore the application**
   - Register a new account
   - Test the booking flow
   - Try admin features

2. **Customize the application**
   - Modify styling in `Frontend/src/index.css`
   - Add new features
   - Configure business logic

3. **Deploy to production**
   - Follow deployment guides
   - Set up monitoring
   - Configure backups

---

**Happy coding! 🚗✨** 