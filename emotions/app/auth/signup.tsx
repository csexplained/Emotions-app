import React, { useState, useEffect } from "react";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import EmailScreen from "@/components/authflow/EmailScreen";
import PasswordScreen from "@/components/authflow/PasswordScreen";
import ThankYouScreen from "@/components/CompleteScreen";
import { useAuthStore } from "@/store/authStore";
import UserProfileService from "@/lib/userProfileService";
import { loginOrSignUpWithEmail } from "@/lib/auth";

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