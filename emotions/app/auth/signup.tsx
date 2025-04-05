import React, { useState, useEffect } from "react";
import { View, Alert, KeyboardAvoidingView, Platform } from "react-native";
import EmailScreen from "@/components/authflow/EmailScreen";
import PasswordScreen from "@/components/authflow/PasswordScreen";
import ThankYouScreen from "@/components/CompleteScreen";
import { useAuthStore } from "@/store/authStore";
import { ID } from "react-native-appwrite"; // Use this for ID generation
import { User } from "@/types/auth.types";
import UserProfileService from "@/lib/userProfileService";
import Userprofile from "@/types/userprofile.types";
import { account } from "@/lib/appwrite";

export const loginOrSignUpWithEmail = async (
  email: string,
  password: string,
  name: string = 'User'
) => {
  const { setUser } = useAuthStore.getState();
  // Validate email format before making any requests
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: "Please enter a valid email address",
    };
  }
  // Validate password requirements
  if (password.length < 6) {
    return {
      success: false,
      error: "Password must be at least 6 characters",
    };
  }
  try {
    // First try to login
    await account.createEmailPasswordSession(email, password);
  } catch (loginError: any) {
    // Handle rate limiting
    if (loginError?.code === 429 || loginError?.message?.includes('Rate limit')) {
      return {
        success: false,
        error: "Too many attempts. Please wait before trying again.",
        isRateLimited: true,
      };
    }
    // First, try to create a new account if login failed
    try {
      // Use Appwrite's built-in ID generation instead of react-native-uuid
      const userId = ID.unique();
      
      // Create the account with Appwrite's ID generator
      await account.create(userId, email, password, name);
      
      // Add small delay between signup and login to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      await account.createEmailPasswordSession(email, password);
    } catch (signupError: any) {
      // If signup failed because email exists, it means the original login
      // failed due to wrong password
      if (signupError?.message?.includes("already exists")) {
        return {
          success: false,
          error: "Wrong password. Please try again.",
        };
      }
      if (signupError?.code === 429) {
        return {
          success: false,
          error: "Too many signup attempts. Please wait.",
          isRateLimited: true,
        };
      }
      console.error("Signup failed:", signupError);
      return {
        success: false,
        error: signupError.message || "Account creation failed",
      };
    }
  }
  try {
    // Success case - get user data
    const user = await account.get();
    const formattedUser: User = {
      ...user,
      createdAt: user.$createdAt ?? new Date().toISOString(),
      emailVerification: user.emailVerification || false,
      phoneVerification: user.phoneVerification || false,
    };
    setUser(formattedUser);
    return {
      success: true,
      user: formattedUser,
    };
  } catch (getUserError: any) {
    console.error("Failed to get user:", getUserError);
    return {
      success: false,
      error: getUserError.message || "Failed to load user profile",
    };
  }
};

export default function EmailLoginScreen() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [retryDelay, setRetryDelay] = useState(0);
  const [redirect, setRedirect] = useState("/profile");
  const { setUser, setuserProfile } = useAuthStore();

  // Handle retry countdown
  useEffect(() => {
    if (retryDelay <= 0) return;

    const timer = setTimeout(() => {
      setRetryDelay(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [retryDelay]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (retryDelay > 0) {
      Alert.alert(
        "Please Wait",
        `Too many attempts. Try again in ${retryDelay} seconds.`
      );
      return;
    }

    setLoading(true);
    try {
      const response = await loginOrSignUpWithEmail(email, password, "User");
      if (response.success) {
        if (response.user && response.user.$id) {
          const userProfile = await UserProfileService.getUserProfile(response.user.$id);
          if (userProfile) {
            setuserProfile(userProfile);
            setRedirect("/");
          }
        }
        console.log(response.user?.$id);
        setUser(response.user ?? null);
        setStep(3); // Go to Thank You screen
      } else {
        if (response.isRateLimited) {
          // Set 30 second cooldown for rate limits
          setRetryDelay(30);
          Alert.alert(
            "Too Many Attempts",
            "Please wait 30 seconds before trying again"
          );
        } else {
          Alert.alert("Error", response.error || "Authentication failed");
        }
      }
    } catch (error: any) {
      console.error("Email Auth Error:", error);
      Alert.alert(
        "Error",
        error.message || "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const screens = {
    1: (
      <EmailScreen
        email={email}
        setEmail={setEmail}
        onNext={() => {
          if (!validateEmail(email)) {
            Alert.alert("Error", "Please enter a valid email address");
            return;
          }
          setStep(2);
        }}
      />
    ),
    2: (
      <PasswordScreen
        password={password}
        setPassword={setPassword}
        onSubmit={handleSubmit}
        onBack={handleBack}
        loading={loading}
        retryDelay={retryDelay}
      />
    ),
    3: <ThankYouScreen redirectTo={redirect} />
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      {screens[step]}
    </KeyboardAvoidingView>
  );
}