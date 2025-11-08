'use client';

import { useState, useEffect } from 'react';

import { EmotionTypeService } from '@/services/EmotionTypeService';
import type { EmotionType } from '@/services/EmotionTypeService';

// Icons
import {
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
  const router = useRouter();
  const [emotions, setEmotions] = useState<EmotionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchEmotions();
  }, []);

  const fetchEmotions = async () => {
    try {
      const emotionService = new EmotionTypeService();
      const emotionData = await emotionService.getAllEmotions();
      setEmotions(emotionData);
    } catch (error) {
      console.error('Error fetching emotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEmotionActive = async (emotion: EmotionType) => {
    try {
      const emotionService = new EmotionTypeService();
      await emotionService.toggleActive(emotion.$id);
      // Refresh the list
      fetchEmotions();
    } catch (error) {
      console.error('Error toggling emotion:', error);
    }
  };

  const deleteEmotion = async (emotionId: string) => {
    if (!confirm('Are you sure you want to delete this emotion category? This action cannot be undone.')) {
      return;
    }

    try {
      const emotionService = new EmotionTypeService();
      await emotionService.delete(emotionId);
      // Refresh the list
      fetchEmotions();
    } catch (error) {
      console.error('Error deleting emotion:', error);
    }
  };

  // Filter emotions based on search and filter
  const filteredEmotions = emotions.filter(emotion => {
    const matchesSearch = emotion.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emotion.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterActive === 'all' ||
      (filterActive === 'active' && emotion.isActive) ||
      (filterActive === 'inactive' && !emotion.isActive);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Emotion Categories</h1>
              <p className="text-gray-600 mt-2">Manage and organize your emotion categories</p>
            </div>
            <button
              onClick={() => router.push("/add")}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Category
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search categories by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${viewMode === 'grid'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${viewMode === 'list'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterActive('all')}
                className={`px-4 py-2 rounded-lg border transition-colors ${filterActive === 'all'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterActive('active')}
                className={`px-4 py-2 rounded-lg border transition-colors ${filterActive === 'active'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterActive('inactive')}
                className={`px-4 py-2 rounded-lg border transition-colors ${filterActive === 'inactive'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* Categories Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredEmotions.length} of {emotions.length} categories
          </p>
        </div>

        {/* Categories Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmotions.map((emotion) => (
              <div
                key={emotion.$id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Icon/Color Header */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-md"
                    style={{ backgroundColor: emotion.color }}
                  >
                    {emotion.icon}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => router.push(`/admin/categories/edit/${emotion.$id}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteEmotion(emotion.$id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    {emotion.displayName}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2 font-mono">
                    {emotion.name}
                  </p>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {emotion.description || 'No description provided'}
                  </p>

                  {/* Status and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleEmotionActive(emotion)}
                        className={`p-1 rounded-lg transition-colors ${emotion.isActive
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-50'
                          }`}
                        title={emotion.isActive ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                      >
                        {emotion.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${emotion.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                        }`}>
                        {emotion.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      #{emotion.order}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Categories List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {filteredEmotions.map((emotion, index) => (
              <div
                key={emotion.$id}
                className={`flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors ${index < filteredEmotions.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                  style={{ backgroundColor: emotion.color }}
                >
                  {emotion.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {emotion.displayName}
                    </h3>
                    <span className="text-gray-500 text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {emotion.name}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {emotion.description || 'No description provided'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${emotion.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                      }`}>
                      {emotion.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {emotion.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span>Order: {emotion.order}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleEmotionActive(emotion)}
                    className={`p-2 rounded-lg transition-colors ${emotion.isActive
                      ? 'text-green-600 hover:bg-green-50'
                      : 'text-gray-400 hover:bg-gray-50'
                      }`}
                    title={emotion.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {emotion.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => router.push(`/admin/categories/edit/${emotion.$id}`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteEmotion(emotion.$id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredEmotions.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎭</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No categories found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || filterActive !== 'all'
                ? 'No categories match your search criteria. Try adjusting your filters or search term.'
                : 'Get started by creating your first emotion category to organize your activities.'
              }
            </p>
            <div className="flex gap-4 justify-center">
              {(searchTerm || filterActive !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterActive('all');
                  }}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={() => router.push(`/admin/categories/add`)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create First Category
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}