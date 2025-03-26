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
    Alert
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
            style={{ flex: 1, backgroundColor: "#F0FFFA" }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, padding: 20 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ width: "auto", justifyContent: "space-between" }} className="flex-row w-screen justify-between items-center">
                        <Pressable
                            onPress={() => router.back()}
                            className="bg-white p-2 rounded-lg w-10 h-10 flex items-center justify-center"
                        >
                            <AntDesign name="arrowleft" size={24} color="black" />
                        </Pressable>
                        <Pressable
                            onPress={() => setShowLogoutModal(true)}
                            className="bg-white p-2 rounded-lg w-10 h-10 flex items-center justify-center"
                        >
                            <LogoutIcon />
                        </Pressable>
                    </View>

                    <View style={{ marginTop: 30 }}>
                        <View className="flex-row justify-center items-center">
                            <View style={{ position: 'relative' }}>
                                <Image
                                    style={{
                                        height: 100,
                                        width: 100,
                                        borderRadius: 100
                                    }}
                                    source={profileImage}
                                />
                                <Pressable
                                    onPress={showImagePickerOptions}
                                    style={{
                                        position: 'absolute',
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: '#04714A',
                                        borderRadius: 20,
                                        padding: 5,
                                        borderWidth: 1,
                                        borderColor: 'gray'
                                    }}
                                >
                                    <FontAwesome name="camera" size={16} color="white" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    <View style={{ gap: 20, }} className="flex-row gap-2 justify-between">


                        <View style={{ width: "45%" }} className="w-1/2 ">
                            <Text style={{ fontWeight: "800" }} className="text-sm my-2">First Name</Text>
                            <TextInput
                                placeholder="Your First Name"
                                value={userdata.firstname}
                                onChangeText={(text) => setUserData({ ...userdata, firstname: text })}
                                style={{ height: 50, backgroundColor: "white", borderColor: 'gray', borderWidth: 1, borderRadius: 10, padding: 10 }}
                            />
                        </View>

                        <View style={{ width: "45%" }} className="w-1/2 ">
                            <Text style={{ fontWeight: "800" }} className="text-sm my-2">Last Name</Text>
                            <TextInput
                                placeholder="Your Last Name"
                                value={userdata.lastname}
                                onChangeText={(text) => setUserData({ ...userdata, lastname: text })}
                                style={{ height: 50, backgroundColor: "white", borderColor: 'gray', borderWidth: 1, borderRadius: 10, padding: 10 }}
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontWeight: "400" }} className="text-sm my-2">Gender</Text>
                        <View style={{ width: "auto", justifyContent: "space-between" }} className="flex-row justify-between">
                            {["male", "female", "other"].map((gender) => (
                                <Pressable
                                    key={gender}
                                    style={{ borderColor: 'gray', borderWidth: 1, borderRadius: 10, padding: 10, width: "30%", backgroundColor: userdata.gender === gender ? "green" : "white" }}
                                    className={`p-2 rounded-lg border flex flex-row gap-2 justify-center items-center ${userdata.gender === gender ? 'bg-green-500' : 'bg-white'}`}
                                    onPress={() => setUserData({ ...userdata, gender })}
                                >
                                    {gender === "male" && <FontAwesome name="mars" size={20} color={userdata.gender === gender ? "white" : "black"} />}
                                    {gender === "female" && <FontAwesome name="venus" size={20} color={userdata.gender === gender ? "white" : "black"} />}
                                    {gender === "other" && <FontAwesome name="genderless" size={20} color={userdata.gender === gender ? "white" : "black"} />}
                                    <Text className={userdata.gender === gender ? "text-white" : "text-black"}>
                                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text className="text-lg font-semibold my-2">Mobile Number</Text>
                        <TextInput
                            placeholder="Your Mobile Number"
                            keyboardType="phone-pad"
                            value={userdata.mobileNumber}
                            onChangeText={(text) => setUserData({ ...userdata, mobileNumber: text })}
                            style={{ height: 50, backgroundColor: "white", borderColor: 'gray', borderWidth: 1, borderRadius: 10, padding: 10 }}
                        />
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text className="text-lg font-semibold my-2">Email</Text>
                        <TextInput
                            placeholder="Your Email"
                            keyboardType="email-address"
                            value={userdata.email}
                            onChangeText={(text) => setUserData({ ...userdata, email: text })}
                            style={{ height: 50, backgroundColor: "white", borderColor: 'gray', borderWidth: 1, borderRadius: 10, padding: 10 }}
                        />
                    </View>
                    <View style={{ gap: 20, marginTop: 10 }} className="flex-row gap-2 justify-between">
                        <View style={{ width: "45%" }} className="w-1/2 ">
                            <Text style={{ fontWeight: 600 }} className="text-sm  my-2">City</Text>
                            <TextInput
                                className="rounded-lg"
                                placeholder="Your City"
                                value={userdata.city}
                                onChangeText={(text) => setUserData({ ...userdata, city: text })}
                                style={{ height: 50, backgroundColor: "white", borderColor: 'gray', borderWidth: 1, borderRadius: 10, padding: 10 }}
                            />
                        </View>
                        <View style={{ width: "45%" }} className="w-1/2 ">
                            <Text style={{ fontWeight: 600 }} className="text-sm  my-2">Country</Text>
                            <TextInput
                                className="rounded-lg"
                                placeholder="Your Country"
                                value={userdata.country}
                                onChangeText={(text) => setUserData({ ...userdata, country: text })}
                                style={{ height: 50, backgroundColor: "white", borderColor: 'gray', borderWidth: 1, borderRadius: 10, padding: 10 }}
                            />
                        </View>
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={showLogoutModal}
                        onRequestClose={() => setShowLogoutModal(false)}
                    >
                        <View style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            backgroundColor: 'rgba(0,0,0,0.5)'
                        }}>
                            <View style={{
                                backgroundColor: '#F0FFFA',
                                padding: 20,
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20
                            }}>


                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: "transparent",
                                            padding: 15,
                                            borderWidth: 1,
                                            borderRadius: 20,
                                            flex: 1,
                                            marginRight: 10
                                        }}
                                        onPress={() => setShowLogoutModal(false)}
                                    >
                                        <Text style={{
                                            textAlign: 'center',
                                            fontWeight: 'bold'
                                        }}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: '#04714A',
                                            padding: 15,
                                            borderRadius: 20,
                                            flex: 1,
                                            marginLeft: 10
                                        }}
                                        onPress={() => {
                                            // Handle logout logic here
                                            setShowLogoutModal(false);
                                            // navigation.navigate('Login'); or whatever your logout flow is
                                        }}
                                    >
                                        <Text style={{
                                            textAlign: 'center',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}>
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
