import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
interface ChatScreenProps {
    modes: string[];
    selectedmode: string;
    setmode: (value: string) => void;
}

const Modeselector = ({ modes, setmode, selectedmode }: ChatScreenProps) => {

    return (
        <View style={styles.container}>
            <View style={{ padding: 30 }}>
                <Text style={styles.titleText}>Select how do you want to Connect?</Text>
            </View>
            <View style={{ marginHorizontal: 24, marginVertical: 40 }}>
                {
                    modes.map((mode, index) => (
                        <Pressable
                            onPress={() => setmode(mode)}
                            key={index}
                            style={styles.button || { backgroundColor: selectedmode === mode ? '#04714A' : 'white' }}
                        >
                            <Text style={styles.buttonText}>{mode}</Text>
                            <View style={styles.fab}>
                                <AntDesign name="arrowright" size={22} color="white" />
                            </View>

                        </Pressable>
                    ))
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",

    },
    arrowbutton: {
        height: 20,
        width: 20,
        borderRadius: 30,
        backgroundColor: 'black',
        padding: 10,
    },
    button: {
        padding: 20,
        width: '100%',
        marginTop: 32,
        height: 65,
        display: "flex",
        flexDirection: "row",
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        alignItems: 'center',
        backgroundColor: "#ffffff",
        borderRadius: 8,

    },

    titleText: {
        fontSize: 24,
        textAlign: 'center',
        fontWeight: '800'
    },
    buttonPressed: {
        opacity: 0.8
    },
    buttonText: {
        color: 'black',
        fontSize: 16
    },
    fab: {
        width: 46,
        height: 46,
        borderRadius: 28,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
});

export default Modeselector;