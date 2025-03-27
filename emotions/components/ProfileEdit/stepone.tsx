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
    StyleSheet
} from "react-native";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from 'expo-image-picker';
import userdata from "@/types/user.types";
import LogoutIcon from "@/assets/icons/Logout";

interface OtpScreenProps {
    userdata: userdata;
    setUserData: (userdata: userdata) => void;
}

export default function Stepone({ userdata, setUserData }: OtpScreenProps) {
    const [isChecked, setIsChecked] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [profileImage, setProfileImage] = useState(require("@/assets/images/chatlogo.png"));

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

                    <View style={styles.profileSection}>
                        <View style={styles.profileImageContainer}>
                            <Image
                                style={styles.profileImage}
                                source={profileImage}
                            />
                            <Pressable
                                onPress={showImagePickerOptions}
                                style={styles.cameraButton}
                            >
                                <FontAwesome name="camera" size={16} color="white" />
                            </Pressable>
                        </View>
                    </View>

                    <View style={styles.nameInputContainer}>
                        <View style={styles.nameInputWrapper}>
                            <Text style={styles.inputLabel}>First Name</Text>
                            <TextInput
                                placeholder="Your First Name"
                                value={userdata.firstname}
                                onChangeText={(text) => setUserData({ ...userdata, firstname: text })}
                                style={styles.textInput}
                            />
                        </View>

                        <View style={styles.nameInputWrapper}>
                            <Text style={styles.inputLabel}>Last Name</Text>
                            <TextInput
                                placeholder="Your Last Name"
                                value={userdata.lastname}
                                onChangeText={(text) => setUserData({ ...userdata, lastname: text })}
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
                                        userdata.gender === gender && styles.genderOptionSelected
                                    ]}
                                    onPress={() => setUserData({ ...userdata, gender })}
                                >
                                    {gender === "male" && <FontAwesome name="mars" size={20} color={userdata.gender === gender ? "white" : "black"} />}
                                    {gender === "female" && <FontAwesome name="venus" size={20} color={userdata.gender === gender ? "white" : "black"} />}
                                    {gender === "other" && <FontAwesome name="genderless" size={20} color={userdata.gender === gender ? "white" : "black"} />}
                                    <Text style={[
                                        styles.genderOptionText,
                                        userdata.gender === gender && styles.genderOptionTextSelected
                                    ]}>
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
                            value={userdata.mobileNumber}
                            onChangeText={(text) => setUserData({ ...userdata, mobileNumber: text })}
                            style={styles.textInput}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <TextInput
                            placeholder="Your Email"
                            keyboardType="email-address"
                            value={userdata.email}
                            onChangeText={(text) => setUserData({ ...userdata, email: text })}
                            style={styles.textInput}
                        />
                    </View>

                    <View style={styles.locationInputContainer}>
                        <View style={styles.locationInputWrapper}>
                            <Text style={styles.inputLabel}>City</Text>
                            <TextInput
                                placeholder="Your City"
                                value={userdata.city}
                                onChangeText={(text) => setUserData({ ...userdata, city: text })}
                                style={styles.textInput}
                            />
                        </View>
                        <View style={styles.locationInputWrapper}>
                            <Text style={styles.inputLabel}>Country</Text>
                            <TextInput
                                placeholder="Your Country"
                                value={userdata.country}
                                onChangeText={(text) => setUserData({ ...userdata, country: text })}
                                style={styles.textInput}
                            />
                        </View>
                    </View>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={showLogoutModal}
                        onRequestClose={() => setShowLogoutModal(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalButtonContainer}>
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => setShowLogoutModal(false)}
                                    >
                                        <Text style={styles.cancelButtonText}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.logoutConfirmButton}
                                        onPress={() => {
                                            setShowLogoutModal(false);
                                            // Handle logout logic
                                        }}
                                    >
                                        <Text style={styles.logoutConfirmButtonText}>
                                            Yes, Logout
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0FFFA"
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContainer: {
        backgroundColor: '#F0FFFA',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
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
    }
});