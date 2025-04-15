"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import { Account, Client, ID } from "appwrite";

// Appwrite client setup - moved outside component
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

const account = new Account(client);

type FormData = {
    login: string;
    password: string;
};

type FormErrors = {
    login: string;
    password: string;
};

const LoginPage = () => {
    const [formData, setFormData] = useState<FormData>({
        login: "",
        password: "",
    });

    const [formErrors, setFormErrors] = useState<FormErrors>({
        login: "",
        password: "",
    });

    const router = useRouter();
    const { toast } = useToast();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));

        // Clear error when user types
        setFormErrors((prev) => ({
            ...prev,
            [id]: "",
        }));
        setError("");
    };

    const validateForm = (): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const newErrors: FormErrors = {
            login: !formData.login
                ? "Email is required"
                : !emailRegex.test(formData.login)
                    ? "Please enter a valid email address"
                    : "",
            password: !formData.password
                ? "Password is required"
                : formData.password.length < 8
                    ? "Password must be at least 8 characters"
                    : "",
        };

        setFormErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Create session
            await account.createEmailPasswordSession(formData.login, formData.password);

            // Get user details
            const user = await account.get();
            dispatch(setUser(user));

            toast({
                title: "Login Successful",
                description: "You have successfully logged in",
            });

            router.push("/admin");
        } catch (error: any) {
            console.error("Login Error:", error);

            let errorMessage = "Login failed. Please check your credentials and try again.";

            if (error?.type === 'user_invalid_credentials') {
                errorMessage = "Invalid email or password";
            } else if (error?.message) {
                errorMessage = error.message;
            }

            setError(errorMessage);
            toast({
                title: "Login Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#FFF9EA] min-h-screen flex flex-col lg:flex-row justify-center items-center w-full">
            {/* Left Section */}
            <div className="w-full lg:w-1/2 py-8 px-4 lg:px-16 gap-8 flex flex-col justify-center items-center">
                <div className="w-full max-w-[470px] gap-8 flex flex-col justify-center items-start">
                    <Image
                        className="h-16 w-16"
                        src={"https://res.cloudinary.com/dxae5w6hn/image/upload/v1744625275/azyl7octqwqctc1tipgb.png"}
                        alt="logo"
                        height={100}
                        width={100}
                        priority
                    />
                    <h3 className="text-2xl font-bold font-inter">Admin Panel Login</h3>

                    {error && (
                        <div className="w-full p-3 bg-red-100 text-red-600 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form
                        className="gap-6 flex justify-center items-start flex-col w-full"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        {/* Email Input */}
                        <div className="w-full">
                            <label htmlFor="login" className="block text-sm font-medium text-[#000000]">
                                Email Address<span className="text-red-500"> *</span>
                            </label>
                            <input
                                type="email"
                                id="login"
                                placeholder="Enter your email address"
                                className={`mt-1 w-full p-3 border rounded-lg bg-white ${formErrors.login ? 'border-red-500' : 'border-black'
                                    }`}
                                required
                                value={formData.login}
                                onChange={handleChange}
                                disabled={loading}
                                autoComplete="email"
                            />
                            {formErrors.login && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.login}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="w-full">
                            <label htmlFor="password" className="block text-sm font-medium text-[#000000]">
                                Password<span className="text-red-500"> *</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                className={`mt-1 w-full p-3 border rounded-lg bg-white ${formErrors.password ? 'border-red-500' : 'border-black'
                                    }`}
                                required
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                                autoComplete="current-password"
                            />
                            {formErrors.password && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 text-white bg-custom-red rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging In...
                                </span>
                            ) : "Submit"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;