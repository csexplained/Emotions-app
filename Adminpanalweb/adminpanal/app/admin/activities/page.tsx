'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ActivityService } from '@/services/ActivityService';
import { EmotionTypeService } from '@/services/EmotionTypeService';
import type { ActivityType, EmotionType } from '@/services';
import ActivityCard from '@/components/ActivityCard';

// Icons
import {
    ArrowLeft,
    Plus,
    Search,
    Filter,
    Grid,
    List,
    Edit3,
    Trash2,
    Star,
    Clock,
    Activity
} from 'lucide-react';

export default function ActivitiesPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [activities, setActivities] = useState<ActivityType[]>([]);
    const [emotions, setEmotions] = useState<EmotionType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmotion, setSelectedEmotion] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const activityTypes = ["Read", "Music", "Exercise"];
    const difficulties = ["Easy", "Medium", "Hard"];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [activitiesData, emotionsData] = await Promise.all([
                new ActivityService().getAll(),
                new EmotionTypeService().getAllEmotions()
            ]);

            setActivities(activitiesData.documents);
            setEmotions(emotionsData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast({
                title: "Error",
                description: "Failed to load activities. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const deleteActivity = async (activityId: string) => {
        if (!confirm('Are you sure you want to delete this activity? This action cannot be undone.')) {
            return;
        }

        try {
            const activityService = new ActivityService();
            await activityService.delete(activityId);

            toast({
                title: "Activity Deleted",
                description: "The activity has been successfully deleted.",
            });

            // Refresh the list
            fetchData();
        } catch (error) {
            console.error('Error deleting activity:', error);
            toast({
                title: "Delete Failed",
                description: "There was an error deleting the activity. Please try again.",
                variant: "destructive",
            });
        }
    };

    // Filter activities
    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesEmotion = selectedEmotion === 'all' || activity.type === selectedEmotion;
        const matchesType = selectedType === 'all' || activity.activitytype === selectedType;
        const matchesDifficulty = selectedDifficulty === 'all' || activity.difficulty === selectedDifficulty;

        return matchesSearch && matchesEmotion && matchesType && matchesDifficulty;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading activities...</p>
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
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">All Activities</h1>
                            <p className="text-gray-600 mt-2">Browse and manage your mental wellness activities</p>
                        </div>
                        <button
                            onClick={() => router.push('/admin/addactivity')}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Add Activity
                        </button>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                        {/* Search */}
                        <div className="flex-1 relative min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search activities by title, description, or tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded transition-colors ${viewMode === 'grid'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Grid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded transition-colors ${viewMode === 'list'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {/* Emotion Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Emotion Type
                            </label>
                            <select
                                value={selectedEmotion}
                                onChange={(e) => setSelectedEmotion(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Emotions</option>
                                {emotions.map(emotion => (
                                    <option key={emotion.$id} value={emotion.name}>
                                        {emotion.displayName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Activity Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Activity Type
                            </label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Types</option>
                                {activityTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Difficulty Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Difficulty
                            </label>
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Difficulties</option>
                                {difficulties.map(difficulty => (
                                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Activities Count */}
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-gray-600">
                        Showing {filteredActivities.length} of {activities.length} activities
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {activities.filter(a => a.isFeatured).length} featured
                        </span>
                        <span className="flex items-center gap-1">
                            <Activity className="h-4 w-4 text-blue-500" />
                            {activities.length} total
                        </span>
                    </div>
                </div>

                {/* Activities Grid View */}
                {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredActivities.map((activity) => (
                            <div key={activity.$id} className="relative group">
                                <ActivityCard activity={activity} />

                                {/* Admin Actions Overlay */}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => router.push(`/admin/activities/edit/${activity.$id}`)}
                                        className="p-2 bg-white text-blue-600 rounded-lg shadow-md hover:bg-blue-50 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteActivity(activity.$id)}
                                        className="p-2 bg-white text-red-600 rounded-lg shadow-md hover:bg-red-50 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Activity Badges */}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    {activity.isFeatured && (
                                        <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                                            <Star className="h-3 w-3" />
                                            Featured
                                        </span>
                                    )}
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${activity.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                        activity.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {activity.difficulty}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Activities List View */}
                {viewMode === 'list' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        {filteredActivities.map((activity, index) => (
                            <div
                                key={activity.$id}
                                className={`flex items-center gap-6 p-6 hover:bg-gray-50 transition-colors group ${index < filteredActivities.length - 1 ? 'border-b border-gray-200' : ''
                                    }`}
                            >
                                {/* Activity Preview */}
                                <div
                                    className="w-20 h-20 rounded-xl flex-shrink-0"
                                    style={{
                                        background: `linear-gradient(135deg, ${activity.colors[0]}, ${activity.colors[1]})`
                                    }}
                                >
                                    {activity.imagepath && activity.imagepath.length > 0 && (
                                        <img
                                            src={activity.imagepath[0]}
                                            alt={activity.title}
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-gray-900 text-lg">
                                            {activity.title}
                                        </h3>
                                        {activity.isFeatured && (
                                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                        )}
                                    </div>

                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {activity.description}
                                    </p>

                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                                            {activity.type}
                                        </span>
                                        <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                                            {activity.activitytype}
                                        </span>
                                        <span className={`px-2 py-1 rounded ${activity.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                            activity.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {activity.difficulty}
                                        </span>
                                        {activity.duration && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {activity.duration}
                                            </span>
                                        )}
                                    </div>

                                    {/* Tags */}
                                    {activity.tags && activity.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {activity.tags.slice(0, 3).map((tag, index) => (
                                                <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    #{tag}
                                                </span>
                                            ))}
                                            {activity.tags.length > 3 && (
                                                <span className="text-xs text-gray-500">
                                                    +{activity.tags.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => router.push(`/activities/edit/${activity.$id}`)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteActivity(activity.$id)}
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
                {filteredActivities.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Activity className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No activities found</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {searchTerm || selectedEmotion !== 'all' || selectedType !== 'all' || selectedDifficulty !== 'all'
                                ? 'No activities match your search criteria. Try adjusting your filters.'
                                : 'Get started by creating your first mental wellness activity.'
                            }
                        </p>
                        <div className="flex gap-4 justify-center">
                            {(searchTerm || selectedEmotion !== 'all' || selectedType !== 'all' || selectedDifficulty !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedEmotion('all');
                                        setSelectedType('all');
                                        setSelectedDifficulty('all');
                                    }}
                                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                            <button
                                onClick={() => router.push('/activities/add')}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create First Activity
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}