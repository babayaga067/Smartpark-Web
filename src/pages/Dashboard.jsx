import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css'; 
import Navbar from '../components/Navbar.jsx'; // Assuming you want Navbar at the top


const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading data...</p>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="error-message">
    <p>Error: {message}</p>
  </div>
);

// Admin-specific components
const AdminOverviewContent = ({ stats }) => (
  <div className="dashboard-content-card">
    <h3>Admin Overview</h3>
    <p>Welcome, Administrator! Here's a summary of your parking operations.</p>
    <div className="stats-grid">
      <div className="stat-card">
        <h4>Total Parking Slots</h4>
        <p className="stat-value">{stats.totalSlots}</p>
      </div>
      <div className="stat-card">
        <h4>Occupied Slots</h4>
        <p className="stat-value">{stats.occupiedSlots}</p>
      </div>
      <div className="stat-card">
        <h4>Available Slots</h4>
        <p className="stat-value">{stats.availableSlots}</p>
      </div>
      <div className="stat-card">
        <h4>Active Bookings</h4>
        <p className="stat-value">{stats.activeBookings}</p>
      </div>
    </div>
    <div className="data-charts" style={{ minHeight: '100px', fontSize: '0.9em' }}>
      <p>Graphical representations (e.g., occupancy trends, revenue charts) would go here.</p>
    </div>
  </div>
);

const ManageSlotsContent = ({ slots, fetchSlots, loading, error }) => {
  const [newSlot, setNewSlot] = useState({ slotNumber: '', location: '', type: 'Standard', hourlyRate: 5 });
  const [addSlotLoading, setAddSlotLoading] = useState(false);
  const [addSlotError, setAddSlotError] = useState(null);

  const token = localStorage.getItem('token');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSlot(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setAddSlotLoading(true);
    setAddSlotError(null);
    try {
      const response = await fetch('/api/slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newSlot)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add slot');
      }
      alert('Slot added successfully!');
      setNewSlot({ slotNumber: '', location: '', type: 'Standard', hourlyRate: 5 }); // Clear form
      fetchSlots(); // Refresh the list of slots
    } catch (err) {
      setAddSlotError(err.message);
    } finally {
      setAddSlotLoading(false);
    }
  };

  return (
    <div className="dashboard-content-card">
      <h3>Manage Parking Slots</h3>
      <p>View, add, edit, or delete parking slots.</p>

      <h4>Add New Slot</h4>
      <form onSubmit={handleAddSlot} className="add-slot-form">
        <input
          type="text"
          name="slotNumber"
          placeholder="Slot Number (e.g., P-101)"
          value={newSlot.slotNumber}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location (e.g., Level 1, Section A)"
          value={newSlot.location}
          onChange={handleInputChange}
          required
        />
        <select name="type" value={newSlot.type} onChange={handleInputChange}>
          <option value="Standard">Standard</option>
          <option value="EV">EV</option>
          <option value="Handicap">Handicap</option>
        </select>
        <input
          type="number"
          name="hourlyRate"
          placeholder="Hourly Rate"
          value={newSlot.hourlyRate}
          onChange={handleInputChange}
          required
        />
        <button type="submit" disabled={addSlotLoading}>
          {addSlotLoading ? 'Adding...' : 'Add Slot'}
        </button>
        {addSlotError && <ErrorMessage message={addSlotError} />}
      </form>

      <h4>Existing Slots</h4>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : slots.length === 0 ? (
        <p>No parking slots found. Add some!</p>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Slot No.</th>
                <th>Location</th>
                <th>Type</th>
                <th>Rate</th>
                <th>Available</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {slots.map(slot => (
                <tr key={slot._id}>
                  <td>{slot.slotNumber}</td>
                  <td>{slot.location}</td>
                  <td>{slot.type}</td>
                  <td>${slot.hourlyRate}/hr</td>
                  <td>{slot.isAvailable ? 'Yes' : 'No'}</td>
                  {/* <td>
                    <button className="table-action-button edit">Edit</button>
                    <button className="table-action-button delete">Delete</button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


// User-specific components
const UserOverviewContent = ({ myBookingsCount, navigate }) => (
  <div className="dashboard-content-card">
    <h3>User Dashboard Overview</h3>
    <p>Welcome back! Your parking journey starts here.</p>
    <div className="stats-grid">
      <div className="stat-card">
        <h4>My Active Booking</h4>
        <p className="stat-value">P-123 (Level 2)</p> {/* Placeholder for active booking */}
        <p className="stat-subtext">Ends in 2h 30m</p>
      </div>
      <div className="stat-card">
        <h4>Total Bookings</h4>
        <p className="stat-value">{myBookingsCount}</p>
      </div>
      <div className="stat-card">
        <h4>Last Parked</h4>
        <p className="stat-value">Yesterday</p> {/* Placeholder */}
      </div>
    </div>
    <button className="dashboard-action-button" onClick={() => navigate('/book-slot')}>
      Book New Slot
    </button>
  </div>
);

const UserMyBookingsContent = ({ bookings, loading, error, cancelBooking }) => {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="dashboard-content-card">
      <h3>My Bookings</h3>
      <p>View your past and upcoming parking reservations.</p>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Slot No.</th>
                <th>Location</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Cost</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id} className={booking.status}>
                  <td>{booking.slot?.slotNumber || 'N/A'}</td>
                  <td>{booking.slot?.location || 'N/A'}</td>
                  <td>{formatDateTime(booking.startTime)}</td>
                  <td>{formatDateTime(booking.endTime)}</td>
                  <td>${booking.totalCost.toFixed(2)}</td>
                  <td className={`status-${booking.status}`}>{booking.status}</td>
                  <td>
                    {booking.status === 'active' && (
                      <button className="table-action-button delete" onClick={() => cancelBooking(booking._id)}>
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// --- Main Dashboard Component ---

const Dashboard = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('user');
  const [activeTab, setActiveTab] = useState('userOverview'); // Default to user overview
  const [userName, setUserName] = useState('');

  // States for fetched data
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({ totalSlots: 0, occupiedSlots: 0, availableSlots: 0, activeBookings: 0 });

  // Loading/Error states for API calls
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  // Unified fetch function for reusability
  const fetchData = useCallback(async (endpoint, authRequired = true) => {
    setLoading(true);
    setError(null);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (authRequired && token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else if (authRequired && !token) {
        navigate('/login'); // Redirect if token missing for protected route
        return null;
      }

      const response = await fetch(endpoint, { headers });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Token expired or unauthorized
          localStorage.removeItem('token');
          localStorage.removeItem('smartpark_user_data');
          navigate('/login');
          return null;
        }
        throw new Error(data.message || `API error: ${response.status}`);
      }
      return data;
    } catch (err) {
      console.error(`Fetch error from ${endpoint}:`, err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  // Initial user type and redirect check
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('smartpark_user_data'));

    if (loggedInUser && loggedInUser.role) {
      setUserType(loggedInUser.role);
      setUserName(loggedInUser.name || loggedInUser.email); // Display name or email
      if (loggedInUser.role === 'admin') {
        setActiveTab('adminOverview');
      } else {
        setActiveTab('userOverview');
      }
    } else {
      // If no valid user data or role, redirect to login
      navigate('/login');
    }
  }, [navigate]);


  // Effect to fetch data based on activeTab and userType
  useEffect(() => {
    const loadData = async () => {
      if (!token) return; // Ensure token exists before fetching protected data

      if (userType === 'admin') {
        if (activeTab === 'adminOverview' || activeTab === 'manageSlots') {
          // Fetch slots for admin overview and management
          const fetchedSlots = await fetchData('/api/slots');
          if (fetchedSlots) {
            setSlots(fetchedSlots);
            // Calculate admin overview stats based on fetched slots
            const available = fetchedSlots.filter(s => s.isAvailable).length;
            const occupied = fetchedSlots.length - available;
            setDashboardStats({
              totalSlots: fetchedSlots.length,
              occupiedSlots: occupied,
              availableSlots: available,
              activeBookings: 0 // Will fetch actual active bookings later if needed
            });
          }
        }
        if (activeTab === 'adminOverview' || activeTab === 'analytics') {
            // Fetch all bookings for admin
            const fetchedBookings = await fetchData('/api/bookings');
            if(fetchedBookings) {
                setBookings(fetchedBookings);
                const active = fetchedBookings.filter(b => b.status === 'active').length;
                setDashboardStats(prev => ({ ...prev, activeBookings: active }));
            }
        }

      } else { // userType === 'user'
        if (activeTab === 'userOverview' || activeTab === 'myBookings') {
          const fetchedBookings = await fetchData('/api/bookings/my-bookings');
          if (fetchedBookings) {
            setBookings(fetchedBookings);
          }
        }
      }
    };
    loadData();
  }, [activeTab, userType, fetchData, token]); // Re-run when tab, userType or fetchData changes

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('smartpark_user_data');
    navigate('/login');
  };

  const handleCancelBooking = async (bookingId) => {
      if (!window.confirm('Are you sure you want to cancel this booking?')) {
          return;
      }
      const cancelResponse = await fetchData(`/api/bookings/${bookingId}/cancel`, true);
      if (cancelResponse) {
          alert('Booking cancelled successfully!');
          // Re-fetch user bookings to update the list
          const updatedBookings = await fetchData('/api/bookings/my-bookings');
          if (updatedBookings) {
              setBookings(updatedBookings);
          }
      }
  };


  return (
    <div className="dashboard-page-wrapper">
      <Navbar /> {/* Now assuming Navbar is wanted at the top */}
      <div className="dashboard-main-layout">
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <h3>{userType === 'admin' ? 'Admin Panel' : 'User Dashboard'}</h3>
          </div>
          <nav className="sidebar-nav">
            {userType === 'admin' ? (
              <>
                <button
                  className={`nav-item ${activeTab === 'adminOverview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('adminOverview')}
                >
                  Overview
                </button>
                <button
                  className={`nav-item ${activeTab === 'manageSlots' ? 'active' : ''}`}
                  onClick={() => setActiveTab('manageSlots')}
                >
                  Manage Slots
                </button>
                <button
                  className={`nav-item ${activeTab === 'manageUsers' ? 'active' : ''}`}
                  onClick={() => setActiveTab('manageUsers')}
                >
                  Manage Users
                </button>
                <button
                  className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
                  onClick={() => setActiveTab('analytics')}
                >
                  Analytics
                </button>
              </>
            ) : (
              <>
                <button
                  className={`nav-item ${activeTab === 'userOverview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('userOverview')}
                >
                  Dashboard
                </button>
                <button
                  className={`nav-item ${activeTab === 'myBookings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('myBookings')}
                >
                  My Bookings
                </button>
                <button
                  className={`nav-item ${activeTab === 'bookSlot' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bookSlot')}
                >
                  Book a Slot
                </button>
                <button
                  className={`nav-item ${activeTab === 'profileSettings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profileSettings')}
                >
                  Profile & Settings
                </button>
              </>
            )}
          </nav>
          <div className="sidebar-footer">
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </aside>

        <main className="dashboard-content-area">
          <header className="dashboard-content-header">
            <h1>{userType === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}</h1>
            <div className="user-info">
              Welcome, {userName}!
            </div>
          </header>
          <div className="dashboard-content-body">
            {/* Conditional rendering based on user type and active tab */}
            {userType === 'admin' ? (
              activeTab === 'adminOverview' ? (
                <AdminOverviewContent stats={dashboardStats} />
              ) : activeTab === 'manageSlots' ? (
                <ManageSlotsContent slots={slots} fetchSlots={() => fetchData('/api/slots')} loading={loading} error={error} />
              ) : activeTab === 'manageUsers' ? (
                <div className="dashboard-content-card">
                  <h3>Manage Users</h3>
                  <p>User management interface coming soon. This would involve fetching and displaying users from your backend (`/api/users` route, if implemented).</p>
                  {loading && <LoadingSpinner />}
                  {error && <ErrorMessage message={error} />}
                  <div className="data-table">
                    Coming Soon: User Management Table...
                  </div>
                </div>
              ) : activeTab === 'analytics' ? (
                <div className="dashboard-content-card">
                  <h3>Analytics & Reports</h3>
                  <p>In-depth analytics and reporting tools. This would utilize the full booking data (`bookings` state) to generate charts and insights.</p>
                  {loading && <LoadingSpinner />}
                  {error && <ErrorMessage message={error} />}
                  <div className="data-charts">
                    Coming Soon: Usage Graphs & Reports... (Using {bookings.length} fetched total bookings)
                  </div>
                </div>
              ) : null
            ) : ( // userType === 'user'
              activeTab === 'userOverview' ? (
                <UserOverviewContent myBookingsCount={bookings.length} navigate={navigate} />
              ) : activeTab === 'myBookings' ? (
                <UserMyBookingsContent bookings={bookings} loading={loading} error={error} cancelBooking={handleCancelBooking} />
              ) : activeTab === 'bookSlot' ? (
                <div className="dashboard-content-card">
                  <h3>Book a Parking Slot</h3>
                  <p>Find and reserve a parking spot easily. You would likely integrate a map or a more interactive slot selection UI here.</p>
                  <button className="dashboard-action-button" onClick={() => navigate('/map')}>
                    Go to Map / Booking Interface
                  </button>
                  <div className="data-table">
                    Coming Soon: Interactive Slot Booking...
                  </div>
                </div>
              ) : activeTab === 'profileSettings' ? (
                <div className="dashboard-content-card">
                  <h3>Profile Settings</h3>
                  <p>Update your personal information and preferences. Fetch user details from `/api/auth/profile` and allow updates via a `PUT` request.</p>
                  <div className="data-table">
                    Coming Soon: Profile Update Form...
                  </div>
                </div>
              ) : null
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;