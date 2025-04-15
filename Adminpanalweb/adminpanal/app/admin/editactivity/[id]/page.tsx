"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
    const newObj = { ...obj };
    for (const key in newObj) {
        if (key.startsWith("$")) {
            delete newObj[key];
        }
    }
    return newObj;
}

const EditActivityForm: React.FC = () => {
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const activityId = params?.id as string;

    const [formData, setFormData] = useState<Omit<ActivityType, "$id"> | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
    const [uploadsInProgress, setUploadsInProgress] = useState(0);

    useEffect(() => {
        if (activityId) fetchActivityData(activityId);
    }, [activityId]);

    const fetchActivityData = async (id: string) => {
        setLoading(true);
        try {
            const data = await ActivityService.getActivityById(id);
            const cleanedData = cleanObject(data);
            setFormData(cleanedData as Omit<ActivityType, "$id">);
        } catch (error) {
            console.error("Error fetching activity:", error);
            toast({
                title: "Fetch Error",
                description: "Failed to fetch activity data.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => prev ? ({
            ...prev,
            [name]: ["currentStep", "totalSteps"].includes(name) ? parseInt(value) || 0 : value,
        }) : prev);
    };

    const handleArrayChange = (index: number, name: ArrayFieldKeys, value: string) => {
        if (!formData) return;
        const updatedArray = [...formData[name]];
        updatedArray[index] = value;
        setFormData({
            ...formData,
            [name]: updatedArray,
        });
    };

    const addArrayItem = (name: ArrayFieldKeys) => {
        if (!formData) return;
        setFormData({
            ...formData,
            [name]: [...formData[name], ""],
        });
    };

    const removeArrayItem = (name: ArrayFieldKeys, index: number) => {
        if (!formData) return;
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
        setFormData({
            ...formData,
            [name]: updatedArray,
        });
    };

    const handleColorChange = (index: number, value: string) => {
        if (!formData) return;
        const updatedColors = [...formData.colors];
        updatedColors[index] = value;
        setFormData({
            ...formData,
            colors: updatedColors as [string, string],
        });
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
                if (!prev) return prev;
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
        if (!formData) return;
        setFormData({
            ...formData,
            imagepath: formData.imagepath.filter((img) => img !== url),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (uploadsInProgress > 0 || !formData) {
            toast({
                title: "Please wait",
                description: "Files are still uploading.",
                variant: "destructive",
            });
            return;
        }

        const redirectURL = formData.activitytype === "Music" ? "/Musicplayer" :
            formData.activitytype === "Read" ? "/Readingscreen" :
                formData.activitytype === "Exercise" ? "/trainingscreen" : "/";

        try {
            await ActivityService.updateActivity(activityId, {
                ...formData,
                redirect: redirectURL,
                colors: formData.colors as [string, string],
                totalSteps: formData.steps.length.toString(),
            });

            toast({
                title: "Activity Updated",
                description: "Your activity has been successfully updated!",
            });

            router.push("/allactivitys");
        } catch (error) {
            console.error("Update error:", error);
            toast({
                title: "Update Failed",
                description: "There was an error updating the activity.",
                variant: "destructive",
            });
        }
    };

    if (loading || !formData) {
        return <div className="text-center py-20">Fetching activity data...</div>;
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Activity</h2>
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

                {/* Inputs */}
                <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" required />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" />
                <input name="exerciseName" placeholder="Exercise Name" value={formData.exerciseName} onChange={handleChange} className="w-full p-2 border rounded" />
                <input name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} className="w-full p-2 border rounded" />
                <input name="time" placeholder="Time" value={formData.time} onChange={handleChange} className="w-full p-2 border rounded" />
                <input name="distance" placeholder="Distance" value={formData.distance} onChange={handleChange} className="w-full p-2 border rounded" />
                <textarea name="activityDescription" placeholder="Activity Description" value={formData.activityDescription} onChange={handleChange} className="w-full p-2 border rounded" />

                {/* Dropdowns */}
                <select name="activitytype" value={formData.activitytype} onChange={handleChange} className="w-full p-2 border rounded bg-gray-100 text-gray-500 cursor-not-allowed" disabled>
                    <option value="">Select Activity Type</option>
                    {activityTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>

                <select name="type" value={formData.type} disabled className="w-full p-2 border rounded bg-gray-100 text-gray-500 cursor-not-allowed">
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

                {/* Gallery Images Upload */}
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
                    disabled={uploading || uploadsInProgress > 0}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {uploading || uploadsInProgress > 0 ? "Uploading Files..." : "Update Activity"}
                </button>
            </form>
        </div>
    );
}
export default EditActivityForm;