import React, { useState } from "react";
import {
    View,
    Pressable,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
    ScrollView,
    Modal,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { BlurView } from "expo-blur";
import userdata from "@/types/userprofile.types";
import LogoutIcon from "@/assets/icons/Logout";
import { useAuthStore } from "@/store/authStore";
import Authdata from "@/types/authdata.types";

interface OtpScreenProps {
    authData: Authdata
    userdata: userdata;
    setauthData: (authData: Authdata) => void;
    setUserData: (userdata: userdata) => void;
    onSubmit: () => Promise<void>;
    loading: boolean;
    error: string;
}

export default function Stepone({ userdata, authData, onSubmit, loading, error, setauthData, setUserData }: OtpScreenProps) {
    const [isChecked, setIsChecked] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [profileImage, setProfileImage] = useState(
        require("@/assets/images/chatlogo.png")
    );
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const clearAuth = useAuthStore((state) => state.clearAuth);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage({ uri: result.assets[0].uri });
        }
    };

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await clearAuth();
            router.replace("/auth");
        } catch (error) {
            console.error("Logout failed:", error);
            Alert.alert("Logout Error", "Failed to logout. Please try again.");
        } finally {
            setIsLoggingOut(false);
        }
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow the app to access your camera!");
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage({ uri: result.assets[0].uri });
        }
    };

    const showImagePickerOptions = () => {
        Alert.alert(
            "Change Profile Picture",
            "Choose an option",
            [
                {
                    text: "Take Photo",
                    onPress: takePhoto,
                },
                {
                    text: "Choose from Gallery",
                    onPress: pickImage,
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ],
            { cancelable: true }
        );
    };

    const handleSubmit = async () => {
        try {
            await onSubmit();
            Alert.alert("Success", "Profile updated successfully");
        } catch (err) {
            console.error('Submit error:', err);
            // Error is already handled in the parent component
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.headerContainer}>
                        <Pressable
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <AntDesign name="arrowleft" size={24} color="black" />
                        </Pressable>
                        <Pressable
                            onPress={() => setShowLogoutModal(true)}
                            style={styles.logoutButton}
                        >
                            <LogoutIcon />
                        </Pressable>
                    </View>

                   

                    <View style={styles.nameInputContainer}>
                        <View style={styles.nameInputWrapper}>
                            <Text style={styles.inputLabel}>First Name</Text>
                            <TextInput
                                placeholder="Your First Name"
                                value={userdata.firstname}
                                onChangeText={(text) =>
                                    setUserData({ ...userdata, firstname: text })
                                }
                                style={styles.textInput}
                            />
                        </View>

                        <View style={styles.nameInputWrapper}>
                            <Text style={styles.inputLabel}>Last Name</Text>
                            <TextInput
                                placeholder="Your Last Name"
                                value={userdata.lastname}
                                onChangeText={(text) =>
                                    setUserData({ ...userdata, lastname: text })
                                }
                                style={styles.textInput}
                            />
                        </View>
                    </View>

                    <View style={styles.genderContainer}>
                        <Text style={styles.inputLabel}>Gender</Text>
                        <View style={styles.genderOptionsContainer}>
                            {["male", "female", "other"].map((gender) => (
                                <Pressable
                                    key={gender}
                                    style={[
                                        styles.genderOption,
                                        userdata.gender === gender && styles.genderOptionSelected,
                                    ]}
                                    onPress={() => setUserData({ ...userdata, gender })}
                                >
                                    {gender === "male" && (
                                        <FontAwesome
                                            name="mars"
                                            size={20}
                                            color={userdata.gender === gender ? "white" : "black"}
                                        />
                                    )}
                                    {gender === "female" && (
                                        <FontAwesome
                                            name="venus"
                                            size={20}
                                            color={userdata.gender === gender ? "white" : "black"}
                                        />
                                    )}
                                    {gender === "other" && (
                                        <FontAwesome
                                            name="genderless"
                                            size={20}
                                            color={userdata.gender === gender ? "white" : "black"}
                                        />
                                    )}
                                    <Text
                                        style={[
                                            styles.genderOptionText,
                                            userdata.gender === gender &&
                                            styles.genderOptionTextSelected,
                                        ]}
                                    >
                                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Mobile Number</Text>
                        <TextInput
                            placeholder="Your Mobile Number"
                            keyboardType="phone-pad"
                            value={userdata.phone}
                            editable={false}
                            onChangeText={(text) =>
                                setUserData({ ...userdata, phone: text })
                            }
                            style={styles.textInput}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <TextInput
                            placeholder="Your Email"
                            keyboardType="email-address"
                            editable={false}
                            value={authData.email}
                            onChangeText={(text) =>
                                setauthData({ ...authData, email: text })
                            }
                            style={styles.textInput}
                        />
                    </View>

                    <View style={styles.locationInputContainer}>
                        <View style={styles.locationInputWrapper}>
                            <Text style={styles.inputLabel}>City</Text>
                            <TextInput
                                placeholder="Your City"
                                value={userdata.city}
                                onChangeText={(text) =>
                                    setUserData({ ...userdata, city: text })
                                }
                                style={styles.textInput}
                            />
                        </View>
                        <View style={styles.locationInputWrapper}>
                            <Text style={styles.inputLabel}>Country</Text>
                            <TextInput
                                placeholder="Your Country"
                                value={userdata.country}
                                onChangeText={(text) =>
                                    setUserData({ ...userdata, country: text })
                                }
                                style={styles.textInput}
                            />
                        </View>
                    </View>

                    {/* Error message */}
                    {error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : null}

                    {/* Submit button */}
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.submitButtonText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={showLogoutModal}
                        onRequestClose={() => setShowLogoutModal(false)}
                    >
                        <BlurView
                            intensity={30}
                            tint="dark"
                            style={StyleSheet.absoluteFill}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContainer}>
                                    <Text style={styles.modalTitle}>Logout Confirmation</Text>
                                    <Text style={styles.modalMessage}>
                                        Are you sure you want to logout?
                                    </Text>

                                    <View style={styles.modalButtonContainer}>
                                        <TouchableOpacity
                                            style={[styles.modalButton, styles.cancelButton]}
                                            onPress={() => setShowLogoutModal(false)}
                                            disabled={isLoggingOut}
                                        >
                                            <Text style={styles.cancelButtonText}>Cancel</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.modalButton, styles.logoutConfirmButton]}
                                            onPress={handleLogout}
                                            disabled={isLoggingOut}
                                        >
                                            {isLoggingOut ? (
                                                <ActivityIndicator color="white" />
                                            ) : (
                                                <Text style={styles.logoutConfirmButtonText}>
                                                    Yes, Logout
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </BlurView>
                    </Modal>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0FFFA",
        marginBottom: 70,
    },
    scrollViewContent: {
        flexGrow: 1,
        padding: 20
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    backButton: {
        backgroundColor: "white",
        padding: 8,
        borderRadius: 8,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoutButton: {
        backgroundColor: "white",
        padding: 8,
        borderRadius: 8,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileSection: {
        marginTop: 30,
        alignItems: 'center'
    },
    profileImageContainer: {
        position: 'relative'
    },
    profileImage: {
        height: 100,
        width: 100,
        borderRadius: 50
    },
    cameraButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: '#04714A',
        borderRadius: 20,
        padding: 5,
        borderWidth: 1,
        borderColor: 'gray'
    },
    nameInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20,
        marginTop: 20
    },
    nameInputWrapper: {
        width: '48%'
    },
    inputLabel: {
        fontWeight: '800',
        fontSize: 14,
        marginVertical: 8
    },
    textInput: {
        height: 50,
        backgroundColor: "white",
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10
    },
    genderContainer: {
        marginTop: 10
    },
    genderOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    genderOption: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        width: '30%',
        backgroundColor: 'white',
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    genderOptionSelected: {
        backgroundColor: '#04714A'
    },
    genderOptionText: {
        color: 'black'
    },
    genderOptionTextSelected: {
        color: 'white'
    },
    inputContainer: {
        marginTop: 20
    },
    locationInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20,
        marginTop: 10
    },
    locationInputWrapper: {
        width: '48%'
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    cancelButton: {
        backgroundColor: "transparent",
        padding: 15,
        borderWidth: 1,
        borderRadius: 20,
        flex: 1,
        marginRight: 10,
        borderColor: '#E5E7EB'
    },
    cancelButtonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#1F2937'
    },
    logoutConfirmButton: {
        backgroundColor: '#04714A',
        padding: 15,
        borderRadius: 20,
        flex: 1,
        marginLeft: 10
    },
    logoutConfirmButtonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 25,
        width: "80%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: "center",
        color: "#555",
    },

    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 120,
    },
    // New styles for submit button and error message
    submitButton: {
        backgroundColor: '#04714A',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 0,
        marginTop: 20,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        color: '#FF3B30',
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
    },
});