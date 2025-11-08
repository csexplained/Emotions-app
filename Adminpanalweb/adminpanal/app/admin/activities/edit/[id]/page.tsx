'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ActivityService } from '@/services/ActivityService';
import { EmotionTypeService } from '@/services/EmotionTypeService';
import type { ActivityStep, StepConfig, ActivityType } from '@/services/ActivityService';
import type { EmotionType } from '@/services/EmotionTypeService';
import axios from 'axios';

// Icons
import {
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    Upload,
    Music,
    FileAudio,
    Loader,
    Palette
} from 'lucide-react';

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

const activityTypes = ["Read", "Music", "Exercise"];
const difficulties = ["Easy", "Medium", "Hard"];

interface FormData {
    name: string;
    title: string;
    type: string;
    activitytype: string;
    difficulty: string;
    tags: string[];
    description: string;
    activityDescription: string;
    imagepath: string[];
    Musicpath: string;
    colors: string[];
    time?: string;
    duration?: string;
    distance?: string;
    exerciseName: string;
    steps: ActivityStep[];
    stepConfig?: StepConfig;
    isFeatured: boolean;
    popularity: number;
}

export default function EditActivityPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [emotions, setEmotions] = useState<EmotionType[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
    const [uploadsInProgress, setUploadsInProgress] = useState(0);

    const activityId = params.id as string;

    const [formData, setFormData] = useState<FormData>({
        name: "",
        title: "",
        type: "",
        activitytype: "",
        difficulty: "Easy",
        tags: [""],
        description: "",
        activityDescription: "",
        imagepath: [],
        Musicpath: "N/A",
        colors: ["#667eea", "#764ba2"],
        time: "",
        duration: "",
        distance: "",
        exerciseName: "",
        steps: [{
            stepNumber: 1,
            title: "",
            description: "",
            instructions: [""],
            tips: [],
            duration: "",
        }],
        stepConfig: {
            autoProceed: true,
            showTimer: true,
            allowSkip: true,
            repeatable: true,
        },
        isFeatured: false,
        popularity: 0,
    });

    useEffect(() => {
        fetchData();
    }, [activityId]);

    const fetchData = async () => {
        try {
            const [activityData, emotionsData] = await Promise.all([
                new ActivityService().getActivityWithParsedSteps(activityId),
                new EmotionTypeService().getAllEmotions()
            ]);

            // Transform the activity data to match our form structure
            setFormData({
                name: activityData.name,
                title: activityData.title,
                type: activityData.type,
                activitytype: activityData.activitytype,
                difficulty: activityData.difficulty,
                tags: activityData.tags,
                description: activityData.description,
                activityDescription: activityData.activityDescription,
                imagepath: activityData.imagepath,
                Musicpath: activityData.Musicpath,
                colors: activityData.colors,
                time: activityData.time || "",
                duration: activityData.duration || "",
                distance: activityData.distance || "",
                exerciseName: activityData.exerciseName,
                steps: activityData.parsedSteps,
                stepConfig: activityData.parsedStepConfig,
                isFeatured: activityData.isFeatured,
                popularity: activityData.popularity,
            });

            setEmotions(emotionsData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast({
                title: "Error",
                description: "Failed to load activity data. Please try again.",
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
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));

        if (name === "activitytype" && value !== "Music") {
            setFormData(prev => ({ ...prev, Musicpath: "N/A" }));
        }
    };

    const handleArrayChange = (index: number, value: string, arrayName: 'tags') => {
        const updatedArray = [...formData[arrayName]];
        updatedArray[index] = value;
        setFormData(prev => ({
            ...prev,
            [arrayName]: updatedArray,
        }));
    };

    const addArrayItem = (arrayName: 'tags') => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: [...prev[arrayName], ""],
        }));
    };

    const removeArrayItem = (index: number, arrayName: 'tags') => {
        const updatedArray = [...formData[arrayName]];
        if (updatedArray.length <= 1) {
            toast({
                title: "Required Field",
                description: `At least one ${arrayName} is required.`,
                variant: "destructive",
            });
            return;
        }
        updatedArray.splice(index, 1);
        setFormData(prev => ({
            ...prev,
            [arrayName]: updatedArray,
        }));
    };

    // Step Management
    const handleStepChange = (index: number, field: keyof ActivityStep, value: string | string[]) => {
        const updatedSteps = [...formData.steps];
        updatedSteps[index] = {
            ...updatedSteps[index],
            [field]: value,
        };
        setFormData(prev => ({ ...prev, steps: updatedSteps }));
    };

    const handleStepInstructionChange = (stepIndex: number, instructionIndex: number, value: string) => {
        const updatedSteps = [...formData.steps];
        const updatedInstructions = [...updatedSteps[stepIndex].instructions];
        updatedInstructions[instructionIndex] = value;
        updatedSteps[stepIndex].instructions = updatedInstructions;
        setFormData(prev => ({ ...prev, steps: updatedSteps }));
    };

    const addStepInstruction = (stepIndex: number) => {
        const updatedSteps = [...formData.steps];
        updatedSteps[stepIndex].instructions.push("");
        setFormData(prev => ({ ...prev, steps: updatedSteps }));
    };

    const removeStepInstruction = (stepIndex: number, instructionIndex: number) => {
        const updatedSteps = [...formData.steps];
        if (updatedSteps[stepIndex].instructions.length <= 1) {
            toast({
                title: "Required Field",
                description: "At least one instruction is required per step.",
                variant: "destructive",
            });
            return;
        }
        updatedSteps[stepIndex].instructions.splice(instructionIndex, 1);
        setFormData(prev => ({ ...prev, steps: updatedSteps }));
    };

    const addStep = () => {
        setFormData(prev => ({
            ...prev,
            steps: [
                ...prev.steps,
                {
                    stepNumber: prev.steps.length + 1,
                    title: "",
                    description: "",
                    instructions: [""],
                    tips: [],
                    duration: "",
                }
            ],
        }));
    };

    const removeStep = (index: number) => {
        if (formData.steps.length <= 1) {
            toast({
                title: "Required Field",
                description: "At least one step is required.",
                variant: "destructive",
            });
            return;
        }
        const updatedSteps = formData.steps.filter((_, i) => i !== index)
            .map((step, i) => ({ ...step, stepNumber: i + 1 }));
        setFormData(prev => ({ ...prev, steps: updatedSteps }));
    };

    const handleColorChange = (index: number, value: string) => {
        const updatedColors = [...formData.colors];
        updatedColors[index] = value;
        setFormData(prev => ({
            ...prev,
            colors: updatedColors,
        }));
    };

    const uploadFileToCloudinary = async (file: File, type: "image" | "music", identifier: string) => {
        const formDataCloud = new FormData();
        formDataCloud.append("file", file);
        formDataCloud.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        setUploadsInProgress(prev => prev + 1);
        setUploading(true);
        setUploadProgress(prev => ({ ...prev, [identifier]: 0 }));

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${type === "image" ? "image" : "raw"}/upload`,
                formDataCloud,
                {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / (progressEvent.total || 1)
                        );
                        setUploadProgress(prev => ({ ...prev, [identifier]: percentCompleted }));
                    },
                }
            );

            const url = response.data.secure_url;

            setFormData(prev => {
                if (type === "music") {
                    return { ...prev, Musicpath: url };
                } else if (type === "image") {
                    return { ...prev, imagepath: [...prev.imagepath, url] };
                }
                return prev;
            });

            toast({
                title: `${type === "image" ? "Image" : "Music"} Uploaded`,
                description: `Your ${type} has been uploaded successfully.`,
            });
        } catch (error) {
            console.error(`Upload error:`, error);
            toast({
                title: "Upload Failed",
                description: `Error uploading ${type}. Please try again.`,
                variant: "destructive",
            });
        } finally {
            setUploadsInProgress(prev => prev - 1);
            if (uploadsInProgress <= 1) {
                setUploading(false);
            }
            setUploadProgress(prev => ({ ...prev, [identifier]: 100 }));
        }
    };

    const removeImageFromGallery = (url: string) => {
        setFormData(prev => ({
            ...prev,
            imagepath: prev.imagepath.filter(img => img !== url),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (uploadsInProgress > 0) {
            toast({
                title: "Files still uploading",
                description: "Please wait for all uploads to complete before submitting.",
                variant: "destructive",
            });
            return;
        }

        setSaving(true);
        try {
            const activityService = new ActivityService();

            await activityService.updateActivity(activityId, {
                ...formData,
                totalSteps: formData.steps.length,
                currentStep: 1,
            });

            toast({
                title: "Activity Updated Successfully!",
                description: "Your changes have been saved.",
            });

            setTimeout(() => {
                router.push('/activities');
            }, 1500);

        } catch (error) {
            console.error("Update error:", error);
            toast({
                title: "Update Failed",
                description: "There was an error updating the activity. Please try again.",
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
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading activity data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push('/activities')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Activities
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Activity</h1>
                    <p className="text-gray-600 mt-2">Update your mental wellness activity</p>
                </div>

                {/* Progress Bars */}
                {Object.entries(uploadProgress).length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Progress</h3>
                        <div className="space-y-3">
                            {Object.entries(uploadProgress).map(([key, progress]) => (
                                <div key={key}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">{key}</span>
                                        <span className="font-medium">{progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Activity Name *
                                </label>
                                <input
                                    name="name"
                                    placeholder="e.g., deep-breathing-exercise"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Display Title *
                                </label>
                                <input
                                    name="title"
                                    placeholder="e.g., Deep Breathing Exercise"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Activity Type *
                                </label>
                                <select
                                    name="activitytype"
                                    value={formData.activitytype}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select Activity Type</option>
                                    {activityTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Emotion Type *
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select Emotion</option>
                                    {emotions.map(emotion => (
                                        <option key={emotion.$id} value={emotion.name}>
                                            {emotion.displayName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Difficulty *
                                </label>
                                <select
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    {difficulties.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Exercise Name
                                </label>
                                <input
                                    name="exerciseName"
                                    placeholder="e.g., Box Breathing"
                                    value={formData.exerciseName}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                placeholder="Brief description of the activity..."
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Detailed Activity Description *
                            </label>
                            <textarea
                                name="activityDescription"
                                placeholder="Detailed instructions and information about the activity..."
                                value={formData.activityDescription}
                                onChange={handleChange}
                                rows={4}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Timing Information */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Timing & Duration</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration
                                </label>
                                <input
                                    name="duration"
                                    placeholder="e.g., 5 minutes"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Time
                                </label>
                                <input
                                    name="time"
                                    placeholder="e.g., 10:00 AM"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Distance
                                </label>
                                <input
                                    name="distance"
                                    placeholder="e.g., 2 km"
                                    value={formData.distance}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Color Scheme */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Color Scheme</h2>
                        <div className="flex gap-4">
                            {formData.colors.map((color, index) => (
                                <div key={index} className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Color {index + 1}
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={color}
                                            onChange={(e) => handleColorChange(index, e.target.value)}
                                            className="w-16 h-12 border border-gray-300 rounded-lg cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={color}
                                            onChange={(e) => handleColorChange(index, e.target.value)}
                                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                                            placeholder="#hexcolor"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
                        {formData.tags.map((tag, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={tag}
                                    onChange={(e) => handleArrayChange(index, e.target.value, 'tags')}
                                    placeholder={`Tag ${index + 1}`}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem(index, 'tags')}
                                    className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem('tags')}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mt-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Tag
                        </button>
                    </div>

                    {/* Steps Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Activity Steps</h2>
                            <button
                                type="button"
                                onClick={addStep}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Add Step
                            </button>
                        </div>

                        <div className="space-y-6">
                            {formData.steps.map((step, stepIndex) => (
                                <div key={stepIndex} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Step {step.stepNumber}</h3>
                                        <button
                                            type="button"
                                            onClick={() => removeStep(stepIndex)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Step Title *
                                            </label>
                                            <input
                                                type="text"
                                                value={step.title}
                                                onChange={(e) => handleStepChange(stepIndex, 'title', e.target.value)}
                                                placeholder="e.g., Breathe In"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Step Description *
                                            </label>
                                            <textarea
                                                value={step.description}
                                                onChange={(e) => handleStepChange(stepIndex, 'description', e.target.value)}
                                                placeholder="Describe what to do in this step..."
                                                rows={3}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Duration (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={step.duration || ''}
                                                onChange={(e) => handleStepChange(stepIndex, 'duration', e.target.value)}
                                                placeholder="e.g., 4 seconds"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Instructions *
                                            </label>
                                            {step.instructions.map((instruction, instructionIndex) => (
                                                <div key={instructionIndex} className="flex gap-2 mb-2">
                                                    <input
                                                        type="text"
                                                        value={instruction}
                                                        onChange={(e) => handleStepInstructionChange(stepIndex, instructionIndex, e.target.value)}
                                                        placeholder={`Instruction ${instructionIndex + 1}`}
                                                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeStepInstruction(stepIndex, instructionIndex)}
                                                        className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addStepInstruction(stepIndex)}
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mt-2"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Add Instruction
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Media Upload Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Media</h2>

                        {/* Image Gallery */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Activity Images
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 mb-2">Drag and drop images here or click to browse</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            Array.from(e.target.files).forEach((file, index) => {
                                                uploadFileToCloudinary(file, "image", `image-${Date.now()}-${index}`);
                                            });
                                        }
                                    }}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                                >
                                    Select Images
                                </label>
                            </div>

                            {/* Gallery Previews */}
                            {formData.imagepath.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                    {formData.imagepath.map((img, idx) => (
                                        <div key={idx} className="relative group">
                                            <img
                                                src={img}
                                                alt={`Gallery ${idx + 1}`}
                                                className="rounded-lg w-full h-32 object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImageFromGallery(img)}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Music Upload - Conditional */}
                        {formData.activitytype === "Music" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Music File
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <FileAudio className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 mb-2">Upload music file for this activity</p>
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                uploadFileToCloudinary(e.target.files[0], "music", `music-${Date.now()}`);
                                            }
                                        }}
                                        className="hidden"
                                        id="music-upload"
                                    />
                                    <label
                                        htmlFor="music-upload"
                                        className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                                    >
                                        Select Music File
                                    </label>
                                </div>
                                {formData.Musicpath !== "N/A" && (
                                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-green-700">
                                            <Music className="h-4 w-4" />
                                            <span className="font-medium">Music file uploaded successfully!</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Featured Toggle */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Feature this Activity</h3>
                                <p className="text-gray-600 text-sm">Featured activities will be highlighted in the app</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.push('/activities')}
                            className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving || uploading || uploadsInProgress > 0}
                            className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    Saving Changes...
                                </>
                            ) : uploading || uploadsInProgress > 0 ? (
                                "Uploading Files..."
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Update Activity
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}