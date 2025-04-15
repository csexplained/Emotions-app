"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import ActivityService from "@/lib/activity";
import { ActivityType } from "@/types/activitycard.types";
import axios from "axios";

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

const activityTypes = ["Music", "Read", "Exercise"];
const types = ["Anger", "Fear", "Blame", "Sorrow", "Confusion", "Happiness", "Calm"];
const difficulties = ["Easy", "Medium", "Hard"];

type ArrayFieldKeys = Extract<keyof ActivityType, "tags" | "steps">;

const ActivityUploadForm: React.FC = () => {
    const { toast } = useToast();
    const router = useRouter();

    const [formData, setFormData] = useState<Omit<ActivityType, "$id">>({
        type: "",
        title: "",
        description: "",
        tags: [""],
        duration: "",
        image: "",
        colors: ["#ffffff", "#000000"],
        redirect: "",
        activitytype: "",
        name: "",
        currentStep: "1",
        totalSteps: "0",
        exerciseName: "",
        imagepath: [],
        Musicpath: "N/A",
        time: "",
        distance: "",
        difficulty: "",
        activityDescription: "",
        steps: [""],
    });

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
    const [uploadsInProgress, setUploadsInProgress] = useState(0);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: ["currentStep", "totalSteps"].includes(name) ? parseInt(value) || 0 : value,
        }));

        if (name === "activitytype" && value !== "Music") {
            setFormData((prev) => ({ ...prev, Musicpath: "N/A" }));
        }
    };

    const handleArrayChange = (index: number, name: ArrayFieldKeys, value: string) => {
        const updatedArray = [...formData[name]];
        updatedArray[index] = value;
        setFormData((prev) => ({
            ...prev,
            [name]: updatedArray,
        }));
    };

    const addArrayItem = (name: ArrayFieldKeys) => {
        setFormData((prev) => ({
            ...prev,
            [name]: [...prev[name], ""],
        }));
    };

    const removeArrayItem = (name: ArrayFieldKeys, index: number) => {
        const updatedArray = [...formData[name]];
        if (updatedArray.length <= 1) {
            toast({
                title: "Required Field",
                description: `At least one ${name} is required.`,
                variant: "destructive",
            });
            return;
        }
        updatedArray.splice(index, 1);
        setFormData((prev) => ({
            ...prev,
            [name]: updatedArray,
        }));
    };

    const handleColorChange = (index: number, value: string) => {
        const updatedColors = [...formData.colors];
        updatedColors[index] = value;
        setFormData((prev) => ({
            ...prev,
            colors: updatedColors as [string, string],
        }));
    };

    const uploadFileToCloudinary = async (file: File, type: "image" | "music", identifier: string) => {
        const formDataCloud = new FormData();
        formDataCloud.append("file", file);
        formDataCloud.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        setUploadsInProgress((prev) => prev + 1);
        setUploading(true);
        setUploadProgress((prev) => ({ ...prev, [identifier]: 0 }));

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${type === "image" ? "image" : "raw"}/upload`,
                formDataCloud,
                {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / (progressEvent.total || 1)
                        );
                        setUploadProgress((prev) => ({ ...prev, [identifier]: percentCompleted }));
                    },
                }
            );

            const url = response.data.secure_url;

            setFormData((prev) => {
                if (type === "image" && identifier === "mainImage") {
                    return { ...prev, image: url };
                } else if (type === "music") {
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
            setUploadsInProgress((prev) => prev - 1);
            setUploading(false);
            setUploadProgress((prev) => ({ ...prev, [identifier]: 100 }));
        }
    };

    const removeImageFromGallery = (url: string) => {
        setFormData((prev) => ({
            ...prev,
            imagepath: prev.imagepath.filter((img) => img !== url),
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

        setLoading(true);
        let Redirect = "/"; // Default redirect URL
        if (formData.activitytype === "Music") {
            Redirect = "/Musicplayer"
        } else if (formData.activitytype === "Read") {
            Redirect = "/Readingscreen"
        } else if (formData.activitytype === "Exercise") {
            Redirect = "/trainingscreen"
        }
        try {
            await ActivityService.createActivity({
                ...formData,
                colors: formData.colors as [string, string],
                currentStep: formData.currentStep,
                totalSteps: formData.steps.length.toString(),
                redirect: Redirect

            });

            toast({
                title: "Activity Uploaded",
                description: "Your activity has been successfully uploaded!",
            });


            router.push("/");
        } catch (error) {
            console.error("Upload error:", error);
            toast({
                title: "Upload Failed",
                description: "There was an error uploading the activity.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Upload Activity</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Progress Bars */}
                {Object.entries(uploadProgress).length > 0 && (
                    <div className="space-y-2">
                        {Object.entries(uploadProgress).map(([key, progress]) => (
                            <div key={key}>
                                <div className="text-xs mb-1">{key}: {progress}%</div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Main Form Fields */}
                <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" required />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" />

                <input name="exerciseName" placeholder="Exercise Name" value={formData.exerciseName} onChange={handleChange} className="w-full p-2 border rounded" />
                <input name="duration" placeholder="Duration (e.g., 5 min)" value={formData.duration} onChange={handleChange} className="w-full p-2 border rounded" />
                <input name="time" placeholder="Time" value={formData.time} onChange={handleChange} className="w-full p-2 border rounded" />
                <input name="distance" placeholder="Distance" value={formData.distance} onChange={handleChange} className="w-full p-2 border rounded" />
                <textarea name="activityDescription" placeholder="Activity Description" value={formData.activityDescription} onChange={handleChange} className="w-full p-2 border rounded" />

                {/* Dropdowns */}
                <select name="activitytype" value={formData.activitytype} onChange={handleChange} className="w-full p-2 border rounded" required>
                    <option value="">Select Activity Type</option>
                    {activityTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>

                <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded" required>
                    <option value="">Select Type</option>
                    {types.map(type => <option key={type} value={type}>{type}</option>)}
                </select>

                <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="">Select Difficulty</option>
                    {difficulties.map(level => <option key={level} value={level}>{level}</option>)}
                </select>

                {/* Color Pickers */}
                <div className="flex gap-2">
                    {formData.colors.map((color, index) => (
                        <input key={index} type="color" value={color} onChange={(e) => handleColorChange(index, e.target.value)} className="w-full p-2 border rounded" />
                    ))}
                </div>

                {/* Continue next message with tags, steps, image upload, multi gallery upload, and music upload... */}
                {/* Tags - Dynamic */}
                <div>
                    <label className="text-sm font-medium">Tags</label>
                    {formData.tags.map((tag, index) => (
                        <div key={index} className="flex gap-2 mt-1">
                            <input
                                type="text"
                                value={tag}
                                onChange={(e) => handleArrayChange(index, "tags", e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayItem("tags", index)}
                                className="bg-red-500 text-white px-2 rounded"
                            >
                                -
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem("tags")}
                        className="text-blue-500 mt-2"
                    >
                        Add Tag +
                    </button>
                </div>

                {/* Steps - Dynamic */}
                <div>
                    <label className="text-sm font-medium">Steps</label>
                    {formData.steps.map((step, index) => (
                        <div key={index} className="flex gap-2 mt-1">
                            <input
                                type="text"
                                value={step}
                                onChange={(e) => handleArrayChange(index, "steps", e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayItem("steps", index)}
                                className="bg-red-500 text-white px-2 rounded"
                            >
                                -
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem("steps")}
                        className="text-blue-500 mt-2"
                    >
                        Add Step +
                    </button>
                </div>

                {/* Main Image Upload */}
                <div>
                    <label className="text-sm font-medium">Main Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                uploadFileToCloudinary(e.target.files[0], "image", "mainImage");
                            }
                        }}
                        className="w-full p-2 border rounded"
                    />
                    {formData.image && (
                        <img src={formData.image} alt="Main Preview" className="mt-2 rounded w-full h-40 object-cover" />
                    )}
                </div>

                {/* Multi-Image Gallery Upload */}
                <div>
                    <label className="text-sm font-medium">Gallery Images</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                            if (e.target.files) {
                                Array.from(e.target.files).forEach((file, index) => {
                                    uploadFileToCloudinary(file, "image", `galleryImage-${index + 1}`);
                                });
                            }
                        }}
                        className="w-full p-2 border rounded"
                    />

                    {/* Gallery Previews */}
                    {formData.imagepath.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {formData.imagepath.map((img, idx) => (
                                <div key={idx} className="relative group">
                                    <img src={img} alt={`Gallery ${idx + 1}`} className="rounded w-full h-24 object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImageFromGallery(img)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-75 hover:opacity-100"
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
                        <label className="text-sm font-medium">Upload Music</label>
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    uploadFileToCloudinary(e.target.files[0], "music", "musicFile");
                                }
                            }}
                            className="w-full p-2 border rounded"
                        />
                        {formData.Musicpath !== "N/A" && (
                            <p className="text-green-600 text-sm mt-1">Music Uploaded ✅</p>
                        )}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || uploading || uploadsInProgress > 0}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading
                        ? "Uploading Activity..."
                        : uploading || uploadsInProgress > 0
                            ? "Uploading Files..."
                            : "Upload Activity"}
                </button>
            </form>
        </div>
    );
};

export default ActivityUploadForm;
