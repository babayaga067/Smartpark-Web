import React, { useEffect, useState } from 'react';
import { Search, Filter, MoreVertical, Ban, CheckCircle, Mail, Phone, Calendar } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const mockUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-15',
      totalBookings: 25,
      totalSpent: 245.5,
      lastLogin: '2024-01-20T10:30:00Z',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 234-5678',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-10',
      totalBookings: 42,
      totalSpent: 520.75,
      lastLogin: '2024-01-21T14:15:00Z',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1 (555) 345-6789',
      role: 'user',
      status: 'suspended',
      joinDate: '2023-12-20',
      totalBookings: 8,
      totalSpent: 95.25,
      lastLogin: '2024-01-18T09:45:00Z',
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+1 (555) 456-7890',
      role: 'admin',
      status: 'active',
      joinDate: '2023-11-01',
      totalBookings: 15,
      totalSpent: 180.0,
      lastLogin: '2024-01-21T16:20:00Z',
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleUserAction = (userId, action) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    if (action === 'delete') {
      if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
        setUsers(users.filter((u) => u.id !== userId));
        return;
      }
      return;
    }

    const updatedStatus = action === 'suspend' ? 'suspended' : 'active';
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, status: updatedStatus } : u))
    );
  };

  const getStatusBadge = (status) => {
    const map = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  const getRoleBadge = (role) => {
    const map = {
      admin: 'bg-purple-100 text-purple-800',
      user: 'bg-blue-100 text-blue-800',
    };
    return map[role] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  const formatLastLogin = (dateString) => {
    const now = new Date();
    const login = new Date(dateString);
    const hoursAgo = Math.floor((now - login) / (1000 * 60 * 60));
    if (hoursAgo < 1) return 'Just now';
    if (hoursAgo < 24) return `${hoursAgo}h ago`;
    return formatDate(dateString);
  };

  if (loading) return <LoadingSpinner text="Loading users..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-2">View and manage all registered users</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Users', value: users.length, color: 'blue' },
            { label: 'Active Users', value: users.filter((u) => u.status === 'active').length, color: 'green' },
            { label: 'Suspended', value: users.filter((u) => u.status === 'suspended').length, color: 'red' },
            { label: 'Admins', value: users.filter((u) => u.role === 'admin').length, color: 'purple' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className={`bg-${stat.color}-500 p-3 rounded-lg mr-4`}>
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['User', 'Contact', 'Role & Status', 'Activity', 'Stats', 'Actions'].map((header, i) => (
                  <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    <div className="h-10 w-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">ID: {user.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center"><Mail className="h-4 w-4 mr-1" />{user.email}</div>
                    <div className="flex items-center text-gray-500"><Phone className="h-4 w-4 mr-1" />{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user.role)}`}>{user.role}</span><br />
                    <span className={`inline-block px-2 py-1 mt-1 rounded-full text-xs font-semibold ${getStatusBadge(user.status)}`}>{user.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" />Joined {formatDate(user.joinDate)}</div>
                    <div className="text-xs text-gray-400">Last login: {formatLastLogin(user.lastLogin)}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div>{user.totalBookings} bookings</div>
                    <div className="text-green-600 font-medium">${user.totalSpent.toFixed(2)} spent</div>
                  </td>
                  <td className="px-6 py-4 text-sm flex space-x-2">
                    {user.status === 'active' ? (
                      <button onClick={() => handleUserAction(user.id, 'suspend')} title="Suspend" className="text-red-600"><Ban className="h-4 w-4" /></button>
                    ) : (
                      <button onClick={() => handleUserAction(user.id, 'activate')} title="Activate" className="text-green-600"><CheckCircle className="h-4 w-4" /></button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUserModal(true);
                      }}
                      title="View"
                      className="text-blue-600"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <Modal
            isOpen={showUserModal}
            onClose={() => setShowUserModal(false)}
            title="User Details"
            size="lg"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Personal Info</h4>
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Phone:</strong> {selectedUser.phone}</p>
                  <p><strong>Role:</strong> {selectedUser.role}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Account</h4>
                  <p><strong>Status:</strong> <span className={`px-2 py-1 ml-2 text-xs rounded-full ${getStatusBadge(selectedUser.status)}`}>{selectedUser.status}</span></p>
                  <p><strong>Joined:</strong> {formatDate(selectedUser.joinDate)}</p>
                  <p><strong>Last Login:</strong> {formatLastLogin(selectedUser.lastLogin)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium text-blue-900">Total Bookings</p>
                  <p className="text-2xl font-bold">{selectedUser.totalBookings}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-medium text-green-900">Total Spent</p>
                  <p className="text-2xl font-bold">${selectedUser.totalSpent.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t">
                {selectedUser.status === 'active' ? (
                  <button
                    onClick={() => {
                      handleUserAction(selectedUser.id, 'suspend');
                      setShowUserModal(false);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Suspend User
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleUserAction(selectedUser.id, 'activate');
                      setShowUserModal(false);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Activate User
                  </button>
                )}
                <button
                  onClick={() => setShowUserModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
