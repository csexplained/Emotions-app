import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Alert } from "react-native";
import Stepone from "@/components/profilebuild/stepone";
import Steptwo from "@/components/profilebuild/steptwo";
import ThankYouScreen from "@/components/CompleteScreen";
import Userprofile from "@/types/userprofile.types";
import AboutYou from "@/types/aboutyoutypes";
import { useAuthStore } from "@/store/authStore";
import UserProfileService from "@/lib/userProfileService";
import QuestionsService from "@/lib/questions.Service"; // Import the QuestionsService we created
import Authdata from "@/types/authdata.types";
import userdata from "@/types/userprofile.types";

export default function Indexscreen() {
    const user = useAuthStore(state => state.user);
    const [total, setTotal] = useState(3);
    const [step, setStep] = useState(1); // Start with step 1
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const userprofile = useAuthStore(state => state.userProfile);
    const setuserprofile = useAuthStore(state => state.setuserProfile);
    const [authData, setauthData] = useState<Authdata>({
        phone: user?.phone || "",
        email: user?.email || "",
    });

    const [userdata, setUserData] = useState<userdata>({
        userId: user?.$id || "",
        firstname: userprofile?.firstname || "",
        lastname: userprofile?.lastname || "",
        gender: userprofile?.gender || "",
        city: userprofile?.city || "",
        country: userprofile?.country || "",
    });
    const [aboutyou, setAboutYou] = useState<AboutYou>({
        "Have you ever worked on your mental health?": "",
        "How do you usually cope with stress?": "",
        "Have you ever practiced meditation or mindfulness?": "",
        "Do you have a support system (friends, family, therapist)?": "",
        "How often do you prioritize self-care?": "",
        "Have you ever talked to a professional about your mental health?": "",
        "What activities make you feel happy and relaxed?": "",
        "How would you describe your sleep quality?": "",
        "Do you feel comfortable expressing your emotions?": "",
        "What are some personal goals you have for your mental well-being?": ""
    });

    const handleSubmit = async () => {
        if (!userdata.userId) {
            setSubmitError("No user ID found. Please log in again.");
            return;
        }

        if (!userdata.firstname || !userdata.lastname) {
            setSubmitError("First name and last name are required");
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Create or update user profile
            await UserProfileService.ensureUserProfileExists(userdata);
            await 
            setuserprofile(userdata)
            setStep(prev => prev + 1);
        } catch (error) {
            console.error("Profile creation failed:", error);
            setSubmitError("Failed to create profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAboutYouSubmit = async () => {
        if (!userdata.userId) {
            Alert.alert("Error", "No user ID found. Please log in again.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Save about you data using QuestionsService
            await QuestionsService.ensureQuestionsExist(userdata.userId, aboutyou);
            setStep(prev => prev + 1);
        } catch (error) {
            console.error("Failed to save about you data:", error);
            setSubmitError("Failed to save your information. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
        >
            {step === 1 && (
                <Stepone
                    step={step}
                    totalsteps={total}
                    userdata={userdata}
                    setUserData={setUserData}
                    setauthData={setauthData}
                    authData={authData}
                    setstep={setStep}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    error={submitError}
                />
            )}
            {step === 2 && (
                <Steptwo
                    step={step}
                    totalsteps={total}
                    aboutyou={aboutyou}
                    setAboutYou={setAboutYou}
                    setstep={setStep}
                    onSubmit={handleAboutYouSubmit}
                    isSubmitting={isSubmitting}
                    error={submitError}
                />
            )}
            {step === 3 && (
                <ThankYouScreen redirectTo="/" />
            )}
        </KeyboardAvoidingView>
    );
}