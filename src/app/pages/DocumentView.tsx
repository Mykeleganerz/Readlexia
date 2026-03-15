import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useDocuments } from '../contexts/DocumentContext';
import { Navigation } from '../components/Navigation';
import { Upload, FileText, Trash2, Search, Filter } from 'lucide-react';

export function DocumentView() {
  const { user } = useAuth();
  const { documents, addDocument, deleteDocument } = useDocuments();
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Academic');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setContent(text);
        setTitle(file.name.replace('.txt', ''));
      };
      reader.readAsText(file);
    }
  };

  const handleAddDocument = () => {
    if (title && content) {
      addDocument(title, content, category);
      setTitle('');
      setContent('');
      setShowUpload(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'All' || doc.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const categories = ['All', 'Academic', 'Educational', 'Personal', 'Work', 'Other'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Documents</h1>
            <p className="text-gray-600">Manage and organize your reading materials</p>
          </div>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Upload size={20} />
            Upload Document
          </button>
        </div>

        {/* Upload Form */}
        {showUpload && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload New Document</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Text File (.txt)
                </label>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Document Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter document title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Academic</option>
                  <option>Educational</option>
                  <option>Personal</option>
                  <option>Work</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content (or paste text)
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={8}
                  placeholder="Paste or type your text here"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddDocument}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  disabled={!title || !content}
                >
                  Add Document
                </button>
                <button
                  onClick={() => setShowUpload(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search documents..."
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            All Documents ({filteredDocuments.length})
          </h2>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 mb-4">No documents found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="text-blue-600" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-lg mb-1">{doc.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{doc.category} • Uploaded {doc.uploadDate}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {doc.content.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/reader/${doc.id}`)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Read
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this document?')) {
                          deleteDocument(doc.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
