import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Image,
    Alert,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
    getGeminiResponse,
    getGeminiVisionResponse,
    getGeminiChatResponse,
    imageToBase64,
    createChatMessage,
    ChatMessage
} from '@/lib/newgeminiAi';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    imageUri?: string;
}

const MODES = [
    { id: 'general', name: 'General Support', icon: 'chatbubbles', color: '#4CAF50' },
    { id: 'anxiety', name: 'Anxiety Relief', icon: 'heart', color: '#8BC34A' },
    { id: 'stress', name: 'Stress Management', icon: 'fitness', color: '#CDDC39' },
    { id: 'mindfulness', name: 'Mindfulness', icon: 'leaf', color: '#4CAF50' },
    { id: 'motivation', name: 'Motivation', icon: 'rocket', color: '#8BC34A' },
];

export const ChatScreen: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [selectedMode, setSelectedMode] = useState('general');
    const [isLoading, setIsLoading] = useState(false);
    const [showModeSelector, setShowModeSelector] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        setMessages([{
            id: '1',
            text: "Hello! I'm your mindfulness assistant. How can I support you today? Choose a mode above to get started.",
            isUser: false,
            timestamp: new Date(),
        }]);
    }, []);

    const scrollToBottom = () => {
        flatListRef.current?.scrollToEnd({ animated: true });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                base64: true,
            });

            if (!result.canceled && result.assets[0]) {
                await sendMessageWithImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const takePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Sorry, we need camera permissions to make this work!');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                base64: true,
            });

            if (!result.canceled && result.assets[0]) {
                await sendMessageWithImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to take photo');
        }
    };

    const sendMessageWithImage = async (imageUri: string) => {
        if (!inputText.trim()) {
            Alert.alert('Message needed', 'Please add a message with your image');
            return;
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            isUser: true,
            timestamp: new Date(),
            imageUri,
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const base64Image = await imageToBase64(imageUri);
            const response = await getGeminiVisionResponse(inputText, selectedMode, base64Image);

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response,
                isUser: false,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending image message:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I couldn't process your image. Please try again.",
                isUser: false,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const chatHistory: ChatMessage[] = messages
                .filter(msg => !msg.imageUri)
                .slice(-10)
                .map(msg => createChatMessage(
                    msg.isUser ? 'user' : 'model',
                    msg.text
                ));

            const response = await getGeminiChatResponse(inputText, selectedMode, chatHistory);

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response,
                isUser: false,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having trouble responding. Please try again.",
                isUser: false,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View style={[
            styles.messageContainer,
            item.isUser ? styles.userMessage : styles.botMessage
        ]}>
            {item.imageUri && (
                <Image source={{ uri: item.imageUri }} style={styles.messageImage} />
            )}
            <Text style={[
                styles.messageText,
                item.isUser ? styles.userMessageText : styles.botMessageText
            ]}>
                {item.text}
            </Text>
            <Text style={styles.timestamp}>
                {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
    );

    const getModeInfo = (modeId: string) => {
        return MODES.find(mode => mode.id === modeId) || MODES[0];
    };

    const currentMode = getModeInfo(selectedMode);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

            {/* Custom Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={[styles.modeIndicator, { backgroundColor: currentMode.color }]}>
                        <Ionicons
                            name={currentMode.icon as any}
                            size={20}
                            color="white"
                        />
                    </View>
                    <View style={styles.headerText}>
                        <Text style={styles.headerTitle}>Mindful Assistant</Text>
                        <TouchableOpacity onPress={() => setShowModeSelector(!showModeSelector)}>
                            <Text style={styles.modeText}>{currentMode.name}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.modeSelectorButton}
                    onPress={() => setShowModeSelector(!showModeSelector)}
                >
                    <Ionicons name="chevron-down" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Mode Selector */}
            {showModeSelector && (
                <View style={styles.modeSelector}>
                    {MODES.map(mode => (
                        <TouchableOpacity
                            key={mode.id}
                            style={[
                                styles.modeOption,
                                selectedMode === mode.id && styles.selectedModeOption
                            ]}
                            onPress={() => {
                                setSelectedMode(mode.id);
                                setShowModeSelector(false);
                            }}
                        >
                            <View style={[styles.modeIcon, { backgroundColor: mode.color }]}>
                                <Ionicons name={mode.icon as any} size={16} color="white" />
                            </View>
                            <Text style={styles.modeOptionText}>{mode.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Chat Messages Area */}
            <View style={styles.chatArea}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    style={styles.messagesList}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                    onLayout={scrollToBottom}
                />
            </View>

            {/* Input Area with Keyboard Handling */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                style={styles.keyboardAvoidingView}
            >
                <View style={styles.inputContainer}>
                    <View style={styles.inputRow}>
                        <TouchableOpacity
                            style={styles.mediaButton}
                            onPress={pickImage}
                        >
                            <Ionicons name="image" size={24} color="#4CAF50" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.mediaButton}
                            onPress={takePhoto}
                        >
                            <Ionicons name="camera" size={24} color="#4CAF50" />
                        </TouchableOpacity>

                        <TextInput
                            style={styles.textInput}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Type your message..."
                            placeholderTextColor="#999"
                            multiline
                            maxLength={500}
                        />

                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                (!inputText.trim() || isLoading) && styles.sendButtonDisabled
                            ]}
                            onPress={sendMessage}
                            disabled={!inputText.trim() || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Ionicons name="send" size={20} color="white" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        backgroundColor: '#4CAF50',
        paddingTop: 10,
        paddingBottom: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    modeIndicator: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerText: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    modeText: {
        fontSize: 14,
        color: 'white',
        opacity: 0.9,
        marginTop: 2,
    },
    modeSelectorButton: {
        padding: 4,
    },
    modeSelector: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 12,
        padding: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        position: 'absolute',
        top: 120,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    modeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginVertical: 2,
    },
    selectedModeOption: {
        backgroundColor: '#E8F5E8',
    },
    modeIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    modeOptionText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    chatArea: {
        flex: 1,
    },
    messagesList: {
        flex: 1,
    },
    messagesContent: {
        padding: 16,
        paddingBottom: 16,
    },
    keyboardAvoidingView: {
        // This ensures proper keyboard handling
    },
    inputContainer: {
        backgroundColor: 'white',
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 25 : 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    mediaButton: {
        padding: 8,
        marginRight: 8,
    },
    textInput: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 16,
        maxHeight: 100,
        marginRight: 8,
    },
    sendButton: {
        backgroundColor: '#4CAF50',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#A5D6A7',
        opacity: 0.6,
    },
    messageContainer: {
        maxWidth: '80%',
        marginVertical: 4,
        padding: 12,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#4CAF50',
        borderBottomRightRadius: 4,
    },
    botMessage: {
        alignSelf: 'flex-start',
        backgroundColor: 'white',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
    },
    userMessageText: {
        color: 'white',
    },
    botMessageText: {
        color: '#333',
    },
    messageImage: {
        width: 200,
        height: 150,
        borderRadius: 8,
        marginBottom: 8,
    },
    timestamp: {
        fontSize: 11,
        color: '#999',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
});