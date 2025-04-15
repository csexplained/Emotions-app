"use client";

import React, { useEffect, useState } from "react";
import ActivityService from "@/lib/activity";
import { ActivityType } from "@/types/activitycard.types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const ActivityManageComponent: React.FC = () => {
    const [activities, setActivities] = useState<ActivityType[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const data = await ActivityService.getActivities();
            setActivities(data);
        } catch (error) {
            console.error("Error fetching activities:", error);
            toast({
                title: "Fetch Error",
                description: "Failed to fetch activities.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this activity?")) return;

        try {
            await ActivityService.deleteActivity(id);
            toast({
                title: "Deleted",
                description: "Activity has been deleted successfully.",
            });
            fetchActivities(); // Refresh list
        } catch (error) {
            console.error("Delete error:", error);
            toast({
                title: "Delete Failed",
                description: "There was an error deleting the activity.",
                variant: "destructive",
            });
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/editactivity/${id}`);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Manage Activities</h2>

            {loading ? (
                <p>Loading activities...</p>
            ) : activities.length === 0 ? (
                <p>No activities found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activities.map((activity) => {
                        const displayImage = activity.imagepath[0] || activity.image || "";

                        return (
                            <div key={activity.$id} className="border rounded p-4 relative group shadow hover:shadow-lg transition-all">
                                {displayImage && (
                                    <img
                                        src={displayImage}
                                        alt={activity.title}
                                        className="w-full h-40 object-cover rounded mb-3"
                                    />
                                )}

                                <h3 className="font-semibold text-lg mb-2">{activity.title}</h3>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(activity.$id)}
                                        className="flex-1 py-1 px-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(activity.$id)}
                                        className="flex-1 py-1 px-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ActivityManageComponent;
