import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useDocuments } from '../contexts/DocumentContext';
import { Navigation } from '../components/Navigation';
import { FileText, BookOpen, Settings, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';

export function Dashboard() {
  const { user } = useAuth();
  const { documents } = useDocuments();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-xl text-blue-100">
            Ready to continue your reading journey?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">{documents.length}</div>
            <div className="text-gray-600">Total Documents</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="text-green-600" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">12</div>
            <div className="text-gray-600">Reading Sessions</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">87%</div>
            <div className="text-gray-600">Progress</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Settings className="text-orange-600" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">Active</div>
            <div className="text-gray-600">Profile Status</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/documents')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
            >
              <FileText className="text-blue-600 mb-3" size={32} />
              <h3 className="font-bold text-gray-800 mb-2">Upload Document</h3>
              <p className="text-gray-600 text-sm">Add new reading materials</p>
            </button>

            <button
              onClick={() => navigate('/settings')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
            >
              <Settings className="text-blue-600 mb-3" size={32} />
              <h3 className="font-bold text-gray-800 mb-2">Adjust Settings</h3>
              <p className="text-gray-600 text-sm">Customize your reading experience</p>
            </button>

            <button
              onClick={() => navigate('/help')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
            >
              <BookOpen className="text-blue-600 mb-3" size={32} />
              <h3 className="font-bold text-gray-800 mb-2">View Tutorials</h3>
              <p className="text-gray-600 text-sm">Learn how to use the tools</p>
            </button>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Documents</h2>
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 mb-4">No documents yet</p>
              <button
                onClick={() => navigate('/documents')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Upload Your First Document
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.slice(0, 5).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/reader/${doc.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{doc.title}</h3>
                      <p className="text-sm text-gray-600">{doc.category} • {doc.uploadDate}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Read
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
