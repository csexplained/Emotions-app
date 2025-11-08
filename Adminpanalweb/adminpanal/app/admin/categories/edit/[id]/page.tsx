'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { EmotionTypeService } from '@/services/EmotionTypeService';
import type { EmotionType } from '@/services/EmotionTypeService';

// Icons
import {
    ArrowLeft,
    Save,
    Palette,
    Type,
    Hash,
    Eye,
    EyeOff,
    ArrowUp,
    ArrowDown,
    Loader
} from 'lucide-react';

// Common emotion icons for selection
const emotionIcons = [
    '😊', '😢', '😠', '😨', '😰', '😐', '😌', '😔', '😤', '😰',
    '😍', '😎', '😭', '😱', '🤔', '😴', '🥰', '🤯', '😈', '👻',
    '💀', '❤️', '🔥', '⭐', '🌈', '🎭', '🧠', '💭', '💫', '🌀'
];

// Default colors for emotions
const defaultColors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3',
    '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84', '#ee5a24'
];

export default function EditCategoryPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showIconPicker, setShowIconPicker] = useState(false);

    const emotionId = params.id as string;

    const [formData, setFormData] = useState<EmotionType>({
        $id: '',
        $collectionId: '',
        $databaseId: '',
        $createdAt: '',
        $updatedAt: '',
        $permissions: [],
        name: '',
        displayName: '',
        color: defaultColors[0],
        description: '',
        icon: '😊',
        isActive: true,
        order: 1,
    });

    useEffect(() => {
        fetchEmotion();
    }, [emotionId]);

    const fetchEmotion = async () => {
        try {
            const emotionService = new EmotionTypeService();
            const emotionData = await emotionService.getById(emotionId);
            setFormData(emotionData);
        } catch (error) {
            console.error('Error fetching emotion:', error);
            toast({
                title: "Error",
                description: "Failed to load emotion category.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? parseInt(value) || 0 : value,
        }));
    };

    const handleColorSelect = (color: string) => {
        setFormData(prev => ({
            ...prev,
            color,
        }));
    };

    const handleIconSelect = (icon: string) => {
        setFormData(prev => ({
            ...prev,
            icon,
        }));
        setShowIconPicker(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!formData.name.trim() || !formData.displayName.trim()) {
            toast({
                title: "Validation Error",
                description: "Name and Display Name are required fields.",
                variant: "destructive",
            });
            return;
        }

        setSaving(true);
        try {
            const emotionService = new EmotionTypeService();

            await emotionService.update(formData.$id, {
                name: formData.name.toLowerCase().trim(),
                displayName: formData.displayName.trim(),
                color: formData.color,
                description: formData.description.trim(),
                icon: formData.icon,
                isActive: formData.isActive,
                order: formData.order,
            });

            toast({
                title: "Emotion Category Updated!",
                description: "Your changes have been saved successfully.",
            });

            setTimeout(() => {
                router.push("/admin/categories")
            }, 1500);

        } catch (error) {
            console.error("Update emotion error:", error);
            toast({
                title: "Update Failed",
                description: "There was an error updating the emotion category. Please try again.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading category...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">


            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push("/admin/categories")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Categories
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Emotion Category</h1>
                    <p className="text-gray-600 mt-2">Update your emotion category details</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-4 w-4" />
                                        Name *
                                    </div>
                                </label>
                                <input
                                    name="name"
                                    placeholder="e.g., calm, anger, happiness"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Lowercase, no spaces. Used for internal reference.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Type className="h-4 w-4" />
                                        Display Name *
                                    </div>
                                </label>
                                <input
                                    name="displayName"
                                    placeholder="e.g., Calm, Anger, Happiness"
                                    value={formData.displayName}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    This will be shown to users.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                placeholder="Describe this emotion and when it might be helpful..."
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Visual Design */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Visual Design</h2>

                        {/* Color Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                <div className="flex items-center gap-2">
                                    <Palette className="h-4 w-4" />
                                    Color *
                                </div>
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {defaultColors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => handleColorSelect(color)}
                                        className={`w-10 h-10 rounded-lg border-2 transition-all ${formData.color === color
                                            ? 'border-gray-900 scale-110 shadow-md'
                                            : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                            <div className="mt-3 flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded border border-gray-300"
                                    style={{ backgroundColor: formData.color }}
                                />
                                <input
                                    type="text"
                                    value={formData.color}
                                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                                    placeholder="#hexcolor"
                                />
                            </div>
                        </div>

                        {/* Icon Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Icon *
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="text-4xl bg-gray-100 rounded-2xl w-16 h-16 flex items-center justify-center">
                                    {formData.icon}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowIconPicker(!showIconPicker)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Choose Icon
                                </button>
                            </div>

                            {showIconPicker && (
                                <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
                                        {emotionIcons.map((icon, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => handleIconSelect(icon)}
                                                className={`text-2xl p-2 rounded-lg hover:bg-white transition-colors ${formData.icon === icon ? 'bg-white shadow border border-gray-300' : ''
                                                    }`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Active Status */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h3 className="font-medium text-gray-900">Active Status</h3>
                                    <p className="text-sm text-gray-600">
                                        {formData.isActive ? 'Category is visible' : 'Category is hidden'}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Display Order */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Display Order
                                </label>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            order: Math.max(1, prev.order - 1)
                                        }))}
                                        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <ArrowDown className="h-4 w-4" />
                                    </button>
                                    <input
                                        type="number"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleChange}
                                        min="1"
                                        className="w-20 p-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            order: prev.order + 1
                                        }))}
                                        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <ArrowUp className="h-4 w-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Lower numbers appear first
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.push("/admin/categories")}
                            className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}