'use client';

import { useState, useEffect } from 'react';
import { DashboardService } from '@/services/DashboardService';
import { ActivityService } from '@/services/ActivityService';
import type { DashboardStats, ActivityType } from '@/services';
import ActionButtons from '@/components/ActionButtons';


// Icons (using Lucide React)
import {
    Activity,
    Folder,
    Star,
    TrendingUp,
    Calendar,
    Clock,
    ArrowUp,
    BarChart3,
    Target
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentActivities, setRecentActivities] = useState<ActivityType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Use navigation hook
    const router = useRouter();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const dashboardService = new DashboardService();
            const activityService = new ActivityService();

            const [dashboardStats, activities] = await Promise.all([
                dashboardService.getDashboardStats(),
                activityService.getPaginatedActivities(6)
            ]);

            setStats(dashboardStats);
            setRecentActivities(activities);
        } catch (err) {
            setError('Failed to load dashboard data. Please check your Appwrite configuration.');
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Action handlers with navigation
    const handleAddActivity = () => {
        router.push("/admin/addactivity");
    };

    const handleViewActivities = () => {
        router.push("/admin/activities");
    };

    const handleAddCategory = () => {
        router.push("/admin/categories/add");
    };

    const handleViewCategories = () => {
        router.push("/admin/categories");
    };

    const handleSettings = () => {
        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="h-8 w-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Data</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                <p className="text-gray-600 text-lg">Manage your mental wellness activities and categories</p>
            </div>

            {/* Action Buttons */}
            <ActionButtons
                onAddActivity={handleAddActivity}
                onViewActivities={handleViewActivities}
                onAddCategory={handleAddCategory}
                onViewCategories={handleViewCategories}
                onSettings={handleSettings}
            />

            {/* Rest of your dashboard content remains the same */}
            {/* Stats Grid */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Activities"
                        value={stats.totalActivities}
                        icon={<Activity className="h-6 w-6 text-blue-600" />}
                        trend={{ value: 8, isPositive: true }}
                        description="Available exercises"
                        color="blue"
                    />

                    <StatCard
                        title="Categories"
                        value={stats.totalCategories}
                        icon={<Folder className="h-6 w-6 text-green-600" />}
                        trend={{ value: 3, isPositive: true }}
                        description="Emotion types"
                        color="green"
                    />

                    <StatCard
                        title="Featured"
                        value={stats.featuredActivities}
                        icon={<Star className="h-6 w-6 text-yellow-600" />}
                        description="Highlighted activities"
                        color="yellow"
                    />

                    <StatCard
                        title="Popular"
                        value={stats.popularActivities.length}
                        icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
                        description="Top engaged"
                        color="purple"
                    />
                </div>
            )}

            {/* Recent Activities & Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
                        <Calendar className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div
                                key={activity.$id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={() => router.push(activity.$id)}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${activity.difficulty === 'Easy' ? 'bg-green-100' :
                                        activity.difficulty === 'Medium' ? 'bg-yellow-100' : 'bg-red-100'
                                        }`}>
                                        <Activity className={`h-6 w-6 ${activity.difficulty === 'Easy' ? 'text-green-600' :
                                            activity.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                                            }`} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                                        <p className="text-sm text-gray-500 capitalize">{activity.type} • {activity.difficulty}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <TrendingUp className="h-4 w-4" />
                                        <span className="font-medium">{activity.popularity || 0}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {new Date(activity.$createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Distribution */}
                {stats && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Activity Types</h2>
                            <BarChart3 className="h-5 w-5 text-gray-400" />
                        </div>

                        <div className="space-y-4">
                            {stats.activitiesByType.map((item) => (
                                <div key={item.type} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span className="font-medium text-gray-700 capitalize">{item.type}</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">{item.count}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <h3 className="font-semibold text-gray-900 mb-4">By Difficulty</h3>
                            <div className="space-y-3">
                                {stats.activitiesByDifficulty.map((item) => (
                                    <div key={item.difficulty} className="flex items-center justify-between">
                                        <span className="text-gray-600 capitalize">{item.difficulty}</span>
                                        <span className="font-semibold text-gray-900">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Popular Activities Section */}
            {stats && stats.popularActivities.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Most Popular Activities</h2>
                        <Target className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.popularActivities.map((activity) => (
                            <div
                                key={activity.$id}
                                className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:border-blue-200 cursor-pointer"
                                onClick={() => router.push(activity.$id)}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${activity.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                        activity.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {activity.difficulty}
                                    </span>
                                    <div className="flex items-center space-x-1 text-blue-600">
                                        <TrendingUp className="h-4 w-4" />
                                        <span className="font-semibold">{activity.popularity || 0}</span>
                                    </div>
                                </div>

                                <h3 className="font-bold text-gray-900 text-lg mb-2">{activity.title}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">{activity.description}</p>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span className="capitalize bg-gray-100 px-2 py-1 rounded">{activity.type}</span>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{activity.time || 'Flexible'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Stat Card Component (same as before)
interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    description: string;
    color: 'blue' | 'green' | 'yellow' | 'purple';
}

function StatCard({ title, value, icon, trend, description, color }: StatCardProps) {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        yellow: 'from-yellow-500 to-yellow-600',
        purple: 'from-purple-500 to-purple-600'
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${colorClasses[color]} rounded-xl text-white`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center space-x-1 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {trend.isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowUp className="h-4 w-4 rotate-180" />}
                        <span>{trend.value}%</span>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</h3>
                <p className="text-gray-700 font-semibold text-lg">{title}</p>
                <p className="text-gray-400 text-sm mt-1">{description}</p>
            </div>
        </div>
    );
}