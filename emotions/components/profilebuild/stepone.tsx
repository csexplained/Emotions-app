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
    ScrollView,
    StyleSheet
} from "react-native";
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Checkbox from "expo-checkbox";
import userdata from "@/types/user.types";

interface OtpScreenProps {
    userdata: userdata;
    setUserData: (userdata: userdata) => void;
    setstep: (step: number) => void;
    totalsteps: number;
    step: number;
}

export default function Stepone({ step, totalsteps, userdata, setUserData, setstep }: OtpScreenProps) {
    const [isChecked, setIsChecked] = useState(false);

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
                            onPress={() => setstep(2)}
                            style={styles.backButton}
                        >
                            <AntDesign name="arrowleft" size={24} color="black" />
                        </Pressable>
                        <View style={styles.stepIndicator}>
                            <Text>{step}/{totalsteps}</Text>
                        </View>
                    </View>

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Create Your Profile</Text>
                        <Text style={styles.subtitle}>
                            Start Your journey towards better Mental Health
                        </Text>
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

                    <View style={styles.termsContainer}>
                        <Checkbox
                            style={styles.checkbox}
                            value={isChecked}
                            onValueChange={setIsChecked}
                            color={isChecked ? "#04714A" : undefined}
                        />
                        <Text style={styles.termsText}>
                            I accept the <Text style={styles.termsLink}>Terms and Conditions</Text>
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Pressable
                            onPress={() => setstep(step + 1)}
                            style={styles.continueButton}
                        >
                            <Text style={styles.continueButtonText}>Continue</Text>
                        </Pressable>
                    </View>
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
        alignItems: 'center'
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
    stepIndicator: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 8,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8
    },
    titleContainer: {
        marginTop: 30
    },
    title: {
        fontSize: 28,
        fontWeight: '700'
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.5)',
        fontWeight: 'normal',
        marginVertical: 8
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
        fontWeight: '600',
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
    termsContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkbox: {
        borderColor: "#04714A",
        borderRadius: 5,
        width: 20,
        height: 20
    },
    termsText: {
        paddingLeft: 10,
        fontWeight: "500"
    },
    termsLink: {
        color: "#04714A",
        textDecorationLine: "underline"
    },
    buttonContainer: {
        marginBottom: 20,
        marginTop: 20
    },
    continueButton: {
        width: '100%',
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#04714A',
        borderRadius: 8
    },
    continueButtonPressed: {
        opacity: 0.8
    },
    continueButtonText: {
        color: 'white',
        fontSize: 18
    }
});