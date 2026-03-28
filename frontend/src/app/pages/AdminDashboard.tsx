import { useAuth } from '../contexts/AuthContext';
import { Navigation } from '../components/Navigation';
import { Users, BarChart3, MessageSquare, Info } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';

export function AdminDashboard() {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                <Users />
              </div>
              <h2 className="text-xl font-bold">User Management</h2>
            </div>
            <p className="text-gray-600 mb-4">
              View, edit, or suspend user accounts.
            </p>
            <Link
              to="/admin/users"
              className="text-blue-600 font-semibold hover:underline"
            >
              Manage Users &rarr;
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-lg text-green-600">
                <BarChart3 />
              </div>
              <h2 className="text-xl font-bold">System Analytics</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Track feature usage (e.g., most used fonts) to inform future
              updates.
            </p>
            <button className="text-green-600 font-semibold hover:underline">
              View Analytics &rarr;
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                <MessageSquare />
              </div>
              <h2 className="text-xl font-bold">Support Tickets</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Address user issues submitted via the Help module.
            </p>
            <button className="text-purple-600 font-semibold hover:underline">
              View Tickets &rarr;
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600">
                <Info />
              </div>
              <h2 className="text-xl font-bold">Help / Support Management</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Manage tutorials and direct admin troubleshooting channels.
            </p>
            <button className="text-yellow-600 font-semibold hover:underline">
              Manage Content &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
