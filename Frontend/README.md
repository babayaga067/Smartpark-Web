# SmartPark Frontend

A modern, responsive React application for smart parking management with real-time booking capabilities.

## 🚀 Features

### User Features
- **Real-time Parking Availability**: View available parking spots in real-time
- **Quick Booking**: Instant parking spot reservation
- **Booking Management**: View, modify, and cancel bookings
- **Payment Integration**: Secure payment processing
- **Notifications**: Real-time booking updates and alerts
- **Profile Management**: Update personal information and preferences
- **Booking History**: Complete history of all parking transactions

### Admin Features
- **Dashboard Analytics**: Comprehensive parking statistics and insights
- **Place Management**: Add, edit, and manage parking places
- **Slot Management**: Create and manage individual parking slots
- **User Management**: Administer user accounts and permissions
- **Booking Management**: Oversee all parking bookings
- **Reports**: Generate detailed reports and analytics

### Technical Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Performance Optimized**: Fast loading with code splitting
- **Security**: Protected routes and secure authentication
- **Real-time Updates**: Live data synchronization

## 🛠️ Tech Stack

- **React 19**: Latest React with hooks and modern patterns
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons
- **Axios**: HTTP client for API communication
- **Vite**: Fast build tool and development server

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Smartpark-Web/Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the Frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=SmartPark
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
Frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── LoadingSpinner.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/           # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── ParkingContext.jsx
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin-specific pages
│   │   └── ...            # User pages
│   ├── services/          # API service functions
│   │   ├── authService.js
│   │   └── parkingService.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # App entry point
│   └── index.css         # Global styles
├── package.json
└── vite.config.js
```

## 🎨 Component Library

### Core Components

#### LoadingSpinner
Multiple variants for different loading states:
```jsx
import LoadingSpinner, { FullScreenLoader, ButtonLoader } from './components/LoadingSpinner';

// Basic usage
<LoadingSpinner size="md" text="Loading..." />

// Full screen loader
<FullScreenLoader text="Loading page..." />

// Button loader
<ButtonLoader size="sm" />
```

#### Modal
Comprehensive modal system with multiple variants:
```jsx
import Modal, { ConfirmationModal, AlertModal, FormModal } from './components/Modal';

// Basic modal
<Modal isOpen={isOpen} onClose={onClose} title="Title">
  Content here
</Modal>

// Confirmation modal
<ConfirmationModal
  isOpen={isOpen}
  onClose={onClose}
  onConfirm={handleConfirm}
  title="Delete Item"
  message="Are you sure?"
  variant="danger"
/>

// Alert modal
<AlertModal
  isOpen={isOpen}
  onClose={onClose}
  title="Success"
  message="Operation completed successfully"
  type="success"
/>
```

#### ProtectedRoute
Route protection with role-based access:
```jsx
<Route path="/admin/dashboard" element={
  <ProtectedRoute adminOnly>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

## 🚦 Routing Structure

### Public Routes
- `/` - Home page
- `/about` - About page
- `/contact` - Contact page
- `/help` - Help page
- `/pricing` - Pricing page
- `/login` - Login page
- `/register` - Registration page

### User Routes (Protected)
- `/dashboard` - User dashboard
- `/parking-places` - Browse parking places
- `/view-slots/:placeId` - View slots for a place
- `/parking-slots/:placeId` - Detailed slot view
- `/booking-history` - User's booking history
- `/booking-confirmation/:bookingId` - Booking confirmation
- `/booking-details/:bookingId` - Booking details
- `/booking-search` - Search bookings
- `/quick-book` - Quick booking interface
- `/payment/:bookingId` - Payment page
- `/notifications` - User notifications
- `/settings` - User settings
- `/profile` - User profile

### Admin Routes (Protected)
- `/admin/dashboard` - Admin dashboard
- `/admin/places` - Manage parking places
- `/admin/places/create` - Create new place
- `/admin/slots` - Manage parking slots
- `/admin/slots/create` - Create new slot
- `/admin/users` - Manage users
- `/admin/bookings` - Manage all bookings
- `/admin/reports` - Generate reports

## 🎯 Key Features Implementation

### Authentication System
- JWT-based authentication
- Role-based access control (User/Admin)
- Automatic token refresh
- Secure logout functionality

### Real-time Updates
- WebSocket integration for live updates
- Real-time parking availability
- Instant booking confirmations
- Live notification system

### Responsive Design
- Mobile-first approach
- Breakpoint-specific layouts
- Touch-friendly interactions
- Optimized for all screen sizes

### Performance Optimizations
- Code splitting with React.lazy()
- Image optimization
- Bundle size optimization
- Caching strategies

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Code Style
- ESLint configuration for code quality
- Prettier for code formatting
- Consistent component structure
- TypeScript-like prop validation

### Testing
- Component testing with React Testing Library
- Integration testing
- E2E testing with Playwright (planned)

## 🚀 Deployment

### Build Process
1. Run `npm run build`
2. Generated files in `dist/` directory
3. Deploy to your hosting service

### Environment Variables
- `VITE_API_URL`: Backend API URL
- `VITE_APP_NAME`: Application name
- `VITE_ENVIRONMENT`: Environment (development/production)

## 📱 Mobile Support

- Progressive Web App (PWA) ready
- Offline functionality
- Push notifications
- App-like experience

## 🔒 Security Features

- Protected routes with authentication
- Role-based access control
- Secure API communication
- XSS protection
- CSRF protection

## 🎨 Customization

### Theming
The application uses CSS custom properties for easy theming:
```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
}
```

### Component Styling
All components use Tailwind CSS classes with custom utility classes:
- `.btn-primary`, `.btn-secondary`, etc.
- `.card`, `.card-hover`
- `.form-input`, `.form-label`
- `.badge-success`, `.badge-warning`, etc.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

---

**SmartPark Frontend** - Making parking management simple and efficient.
