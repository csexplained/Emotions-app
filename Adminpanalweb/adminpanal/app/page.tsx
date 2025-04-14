"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "@/store/authSlice";
import { Account, Client } from "appwrite";

export default function Home() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    // Appwrite client setup
    const client = new Client();
    client
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

    const account = new Account(client);

    useEffect(() => {
        // Check session on load
        const checkSession = async () => {
            try {
                const user = await account.get();
                dispatch(setUser(user));
                router.push("/dashboard"); // Redirect to dashboard if logged in
            } catch (error) {
                console.log("No active session or session expired.");
                dispatch(clearUser());
                setLoading(false); // Allow page to load for login
            }
        };

        checkSession();

        // Optional: Cleanup on tab close
        const handleTabClose = async () => {
            try {
                await account.deleteSession("current");
                dispatch(clearUser());
                localStorage.removeItem("refreshToken");
            } catch (error) {
                console.log("Error cleaning up session:", error);
            }
        };

        window.addEventListener("beforeunload", handleTabClose);

        return () => {
            window.removeEventListener("beforeunload", handleTabClose);
        };
    }, [dispatch, router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <h1 className="text-2xl font-bold mb-6">Checking Session...</h1>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <h1 className="text-2xl font-bold mb-6">Product Management</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        href="/Login"
                        className="px-6 w-full text-center py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </>
    );
}
