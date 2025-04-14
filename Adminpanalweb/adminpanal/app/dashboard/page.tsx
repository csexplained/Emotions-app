"use client";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <h1 className="text-2xl font-bold mb-6">Emotion App Management</h1>
                <div className="flex justify-items-center gap-4">

                    <Link href="/addactivity" className="px-6 w-full text-center py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
                        Add activity
                    </Link>
                    <Link href="/allactivitys" className="px-6 w-full text-center py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
                        All activitys
                    </Link>

                </div>
            </div>
        </>
    );
}
