import React, { useState, useRef } from "react";
import { View, Text, Pressable, Image, ScrollView, TextInput, StyleSheet } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import Feather from '@expo/vector-icons/Feather';
import Modeselector from "./Modeselecter";


const ChatScreen = () => {
    interface Message {
        id: number;
        text?: string;
        image?: string;
        time: string;
        isMe: boolean;
    }
    const modes = [
        "How are you?",
        "How to manage anger?",
        "How to reduce anger?"
    ]

    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! How can I help you today?", time: "10:30 AM", isMe: false },
        { id: 2, text: "I'm feeling a bit anxious", time: "10:32 AM", isMe: true },
        { id: 3, text: "I understand. Can you tell me more about what's making you feel this way?", time: "10:33 AM", isMe: false },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const scrollViewRef = useRef<ScrollView>(null);
    const [mode, setmode] = useState("");

    // User profile image (replace with your actual user image)
    const userProfileImage = require('@/assets/images/chatlogo.png');
    // AI profile image (using your main logo)
    const aiProfileImage = require('@/assets/images/chatlogo.png');

    const handleSend = () => {
        if (newMessage.trim()) {
            const newMsg = {
                id: messages.length + 1,
                text: newMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: true
            };
            setMessages([...messages, newMsg]);
            setNewMessage("");
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    const openCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera is required!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const newMsg = {
                id: messages.length + 1,
                image: result.assets[0].uri,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: true
            };
            setMessages([...messages, newMsg]);
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Image
                        source={aiProfileImage}
                        style={styles.logo}
                    />
                    <View style={styles.headerText}>
                        <Text style={styles.headerTitle}>Emotions <Text style={styles.aiText}>AI</Text></Text>
                        <Text style={styles.statusText}>Online</Text>
                    </View>
                </View>
                <Pressable style={styles.menuButton}>
                    <Entypo name="dots-three-vertical" size={20} color="#04714A" />
                </Pressable>
            </View>

            {/* Chat Messages */}
            <ScrollView
                ref={scrollViewRef}
                style={styles.chatContainer}
                contentContainerStyle={styles.chatContent}
                showsVerticalScrollIndicator={false}
            >
                {mode === "" && <Modeselector selectedmode={mode} setmode={setmode} modes={modes} />}
                {mode.length > 0 && messages.map((message) => (
                    <View
                        key={message.id}
                        style={[
                            styles.messageWrapper,
                            message.isMe ? styles.myMessageWrapper : styles.otherMessageWrapper
                        ]}
                    >
                        {!message.isMe && (
                            <Image
                                source={aiProfileImage}
                                style={styles.profileImage}
                            />
                        )}
                        <View
                            style={[
                                styles.messageContainer,
                                message.isMe ? styles.myMessage : styles.otherMessage
                            ]}
                        >
                            {message.image ? (
                                <Image source={{ uri: message.image }} style={styles.messageImage} />
                            ) : (
                                <Text style={message.isMe ? styles.myMessageText : styles.otherMessageText}>
                                    {message.text}
                                </Text>
                            )}
                            <Text style={[
                                styles.messageTime,
                                message.isMe ? styles.myMessageTime : styles.otherMessageTime
                            ]}>
                                {message.time}
                            </Text>
                        </View>
                        {message.isMe && (
                            <Image
                                source={userProfileImage}
                                style={styles.profileImage}
                            />
                        )}
                    </View>
                ))}

            </ScrollView>

            {/* Input Area */}
            <View style={styles.inputContainer}>
                <Pressable style={styles.cameraButton} onPress={openCamera}>
                    <Ionicons name="camera-outline" size={24} color="#ffffff" />
                </Pressable>
                <TextInput
                    style={styles.input}
                    placeholder="Ask me anything.."
                    value={newMessage}
                    onChangeText={setNewMessage}
                    multiline
                />
                <Pressable
                    style={styles.sendButton}
                    onPress={handleSend}
                    disabled={!newMessage.trim()}
                >
                    <Feather
                        name="send"
                        size={24}
                        color={newMessage.trim() ? "#ffffff" : "#ffffff"}
                    />
                </Pressable>
            </View>

            {/* Floating Action Button */}
            <Pressable style={styles.fab} onPress={openCamera}>
                <Ionicons name="add" size={28} color="white" />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0FFFA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 40,
        backgroundColor: 'white',
        height: 40,
        marginRight: 12,
        borderRadius: 5, // Circular logo
    },
    profileImage: {
        width: 32,
        height: 32,
        borderRadius: 25,
        marginHorizontal: 8,
    },
    headerText: {
        flexDirection: 'column',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    aiText: {
        color: '#04714A',
        fontWeight: 'bold',
    },
    statusText: {
        fontSize: 12,
        color: '#04714A',
    },
    menuButton: {
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 10,
    },
    chatContainer: {
        flex: 1,
        paddingHorizontal: 8, // Reduced padding to accommodate profile images
    },
    chatContent: {
        paddingVertical: 16,
    },
    messageWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 16,
        maxWidth: '100%',
    },
    myMessageWrapper: {
        justifyContent: 'flex-end',
    },
    otherMessageWrapper: {
        justifyContent: 'flex-start',
    },
    messageContainer: {
        maxWidth: '70%',
        padding: 12,
        borderRadius: 12,
    },
    myMessage: {
        backgroundColor: 'white',
        borderBottomRightRadius: 0,
    },
    otherMessage: {
        backgroundColor: '#04714A',
        borderBottomLeftRadius: 0,
    },
    myMessageText: {
        color: 'black',
        fontSize: 16,
    },
    otherMessageText: {
        color: 'white',
        fontSize: 16,
    },
    messageTime: {
        fontSize: 10,
        marginTop: 4,
    },
    myMessageTime: {
        color: '#666',
        textAlign: 'right',
    },
    otherMessageTime: {
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'left',
    },
    messageImage: {
        width: 200,
        height: 150,
        borderRadius: 8,
        marginBottom: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        margin: 10,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    cameraButton: {
        backgroundColor: "black",
        padding: 8,
        color: "white",
        borderRadius: 20,
        marginRight: 8,
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 120,
        paddingHorizontal: 2,
        fontWeight: "800",
        paddingVertical: 8,
        borderRadius: 20,
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: "#04714A",
        color: "ffffff",
        borderRadius: 30,
        padding: 10,
    },
    fab: {
        position: 'absolute',
        right: 12,
        bottom: 80,
        width: 46,
        height: 46,
        borderRadius: 28,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    button: {
        width: '100%',
        marginTop: 32,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#04714A",
        borderRadius: 8
    },
    buttonPressed: {
        opacity: 0.8
    },
    buttonText: {
        color: 'white',
        fontSize: 18
    }
});

export default ChatScreen;