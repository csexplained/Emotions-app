'use client';

import React, { useState } from 'react';

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
    ArrowDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FormData {
    name: string;
    displayName: string;
    color: string;
    description: string;
    icon: string;
    isActive: boolean;
    order: number;
}

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

export default function AddCategoryPage() {
    const router = useRouter();
    const { toast } = useToast()
    const [loading, setLoading] = useState(false);
    const [showIconPicker, setShowIconPicker] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        name: "",
        displayName: "",
        color: defaultColors[0],
        description: "",
        icon: "😊",
        isActive: true,
        order: 1,
    });

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

        // Validate name format (should be lowercase, no spaces)
        const nameRegex = /^[a-z0-9-]+$/;
        if (!nameRegex.test(formData.name)) {
            toast({
                title: "Invalid Name Format",
                description: "Name should contain only lowercase letters, numbers, and hyphens (no spaces).",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const emotionService = new EmotionTypeService();

            await emotionService.createEmotion({
                name: formData.name.toLowerCase().trim(),
                displayName: formData.displayName.trim(),
                color: formData.color,
                description: formData.description.trim(),
                icon: formData.icon,
                isActive: formData.isActive,
                order: formData.order,
            });

            toast({
                title: "Emotion Category Created!",
                description: "Your new emotion category has been added successfully.",
            });

            setTimeout(() => {
                router.push("/admin/dashboard");
            }, 2000);

        } catch (error) {
            console.error("Create emotion error:", error);
            toast({
                title: "Creation Failed",
                description: "There was an error creating the emotion category. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

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
                    <h1 className="text-3xl font-bold text-gray-900">Create Emotion Category</h1>
                    <p className="text-gray-600 mt-2">Add a new emotion type for organizing activities</p>
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

                    {/* Preview */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                                style={{ backgroundColor: formData.color }}
                            >
                                {formData.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg">
                                    {formData.displayName || 'Display Name'}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {formData.description || 'Description will appear here...'}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${formData.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {formData.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                        Order: {formData.order}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.push("/admin/dashboard")}
                            className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Create Emotion Category
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}