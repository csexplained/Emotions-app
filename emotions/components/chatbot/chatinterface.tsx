import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    View,
    Text,
    Pressable,
    Image,
    FlatList,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Animated,
    ActivityIndicator,
    Keyboard
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import Feather from '@expo/vector-icons/Feather';
import Modeselector from "./Modeselecter";
import { getOpenAIResponse } from "@/lib/openai";

const ChatScreen = () => {
    interface Message {
        id: string;
        text?: string;
        image?: string;
        time: string;
        isMe: boolean;
        isLoading?: boolean;
    }

    const modes = ["Anger", "Fear", "Happiness"];
    const [mode, setMode] = useState("");
    const initialMessages: Message[] = [
        { id: '1', text: `Hello! How can I help you today?`, time: "", isMe: false },
    ];

    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState("");
    const scrollViewRef = useRef<FlatList>(null);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const userProfileImage = require('@/assets/images/chatlogo.png');
    const aiProfileImage = require('@/assets/images/chatlogo.png');

    const generateId = () => Math.random().toString(36).substr(2, 9);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setIsKeyboardVisible(true);
                scrollToBottom();
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setIsKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const scrollToBottom = useCallback(() => {
        if (scrollViewRef.current && messages.length > 0) {
            requestAnimationFrame(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            });
        }
    }, [messages]);

    const handleSend = async () => {
        if (newMessage.trim() && mode.length > 0) {
            const userMsg = {
                id: generateId(),
                text: newMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: true
            };

            setMessages(prev => [...prev, userMsg]);
            setNewMessage("");

            const loadingMsg = {
                id: generateId(),
                text: "",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: false,
                isLoading: true
            };
            setMessages(prev => [...prev, loadingMsg]);

            try {
                const aiReplyText = await getOpenAIResponse(newMessage, mode);

                setMessages(prev => [
                    ...prev.filter(msg => msg.id !== loadingMsg.id),
                    {
                        ...loadingMsg,
                        text: aiReplyText,
                        isLoading: false
                    }
                ]);
            } catch (error) {
                console.error("Error getting AI response:", error);
                setMessages(prev => [
                    ...prev.filter(msg => msg.id !== loadingMsg.id),
                    {
                        ...loadingMsg,
                        text: "Sorry, I encountered an error. Please try again.",
                        isLoading: false
                    }
                ]);
            } finally {
                scrollToBottom();
            }
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
                id: generateId(),
                image: result.assets[0].uri,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: true
            };
            setMessages(prev => [...prev, newMsg]);
            setTimeout(scrollToBottom, 100);
        }
    };

    const renderMessage = useCallback(({ item }: { item: Message }) => (
        <Animated.View
            key={item.id}
            style={[
                styles.messageWrapper,
                item.isMe ? styles.myMessageWrapper : styles.otherMessageWrapper,
                { opacity: fadeAnim }
            ]}
        >
            {!item.isMe && (
                <Image
                    source={aiProfileImage}
                    style={styles.profileImage}
                />
            )}
            <View
                style={[
                    styles.messageContainer,
                    item.isMe ? styles.myMessage : styles.otherMessage,
                    item.isLoading && styles.loadingMessage
                ]}
            >
                {item.image ? (
                    <Image
                        source={{ uri: item.image }}
                        style={styles.messageImage}
                        resizeMode="cover"
                    />
                ) : item.isLoading ? (
                    <ActivityIndicator size="small" color="#04714A" />
                ) : (
                    <Text style={item.isMe ? styles.myMessageText : styles.otherMessageText}>
                        {item.text}
                    </Text>
                )}
                {!item.isLoading && (
                    <Text style={[
                        styles.messageTime,
                        item.isMe ? styles.myMessageTime : styles.otherMessageTime
                    ]}>
                        {item.time}
                    </Text>
                )}
            </View>
            {item.isMe && (
                <Image
                    source={userProfileImage}
                    style={styles.profileImage}
                />
            )}
        </Animated.View>
    ), []);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
            {/* Header */}
            <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
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
            </Animated.View>

            {/* Chat Messages */}
            <Pressable
                style={styles.messagesContainer}
                onPress={Keyboard.dismiss}
            >
                <FlatList
                    ref={scrollViewRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    style={styles.chatContainer}
                    contentContainerStyle={styles.chatContent}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={scrollToBottom}
                    onLayout={scrollToBottom}
                    keyboardShouldPersistTaps="handled"
                    removeClippedSubviews={Platform.OS === 'android'}
                    ListHeaderComponent={mode === "" ? <Modeselector selectedmode={mode} setmode={setMode} modes={modes} /> : null}
                    overScrollMode="always"
                    bounces={true}
                    alwaysBounceVertical={true}
                    nestedScrollEnabled={true}
                />
            </Pressable>

            {/* Input Area */}
            <Animated.View
                style={[
                    styles.inputContainer,
                    isKeyboardVisible && styles.inputContainerKeyboardActive,
                    { opacity: fadeAnim }
                ]}
            >
                <Pressable
                    style={styles.cameraButton}
                    onPress={openCamera}
                    android_ripple={{ color: '#333', borderless: true }}
                >
                    <Ionicons name="camera-outline" size={24} color="#ffffff" />
                </Pressable>
                <TextInput
                    style={styles.input}
                    placeholder="Ask me anything.."
                    placeholderTextColor="#999"
                    value={newMessage}
                    onChangeText={setNewMessage}
                    multiline
                    onSubmitEditing={handleSend}
                    blurOnSubmit={false}
                />
                <Pressable
                    style={({ pressed }) => [
                        styles.sendButton,
                        pressed && styles.sendButtonPressed,
                        (!newMessage.trim() || !mode) && styles.sendButtonDisabled
                    ]}
                    onPress={handleSend}
                    disabled={!newMessage.trim() || !mode}
                >
                    <Feather
                        name="send"
                        size={24}
                        color={newMessage.trim() && mode ? "#000000" : "#000000"}
                    />
                </Pressable>
            </Animated.View>

            {/* Floating Action Button */}
            {!isKeyboardVisible && (
                <Animated.View style={[styles.fab, { opacity: fadeAnim }]}>
                    <Pressable
                        onPress={openCamera}
                        style={({ pressed }) => [
                            styles.fabButton,
                            pressed && styles.fabPressed
                        ]}
                    >
                        <Ionicons name="add" size={28} color="white" />
                    </Pressable>
                </Animated.View>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0FFFA',
    },
    messagesContainer: {
        flex: 1,
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingTop: Platform.OS === 'ios' ? 50 : 16,
        backgroundColor: '#F0FFFA',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 10,
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
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    profileImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    headerText: {
        flexDirection: 'column',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    aiText: {
        color: '#04714A',
        fontWeight: 'bold',
    },
    statusText: {
        fontSize: 12,
        color: '#04714A',
    },
    chatContainer: {
        flex: 1,
    },
    chatContent: {
        paddingVertical: 16,
        paddingBottom: Platform.OS === 'ios' ? 100 : 80,
        flexGrow: 1,
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
        maxWidth: '80%',
        padding: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    loadingMessage: {
        minWidth: 80,
        minHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
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
        color: '#333',
        fontSize: 16,
        lineHeight: 22,
    },
    otherMessageText: {
        color: 'white',
        fontSize: 16,
        lineHeight: 22,
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
        padding: 8,
        margin: 10,
        borderRadius: 30,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputContainerKeyboardActive: {
        marginBottom: Platform.OS === 'ios' ? 0 : 20,
    },
    cameraButton: {
        backgroundColor: "#04714A",
        padding: 10,
        borderRadius: 20,
        marginRight: 8,
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 120,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        fontSize: 16,
        color: '#333',
    },
    sendButton: {
        backgroundColor: "#04714A",
        borderRadius: 20,
        padding: 10,
        marginLeft: 8,
    },
    sendButtonPressed: {
        opacity: 0.8,
    },
    sendButtonDisabled: {
        backgroundColor: "#cccccc",
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 90,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#04714A',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    fabButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 28,
    },
    fabPressed: {
        opacity: 0.8,
    },
});

export default ChatScreen;