import { View, Image, Text, StyleSheet } from "react-native";

export default function LoadingScreen() {
    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/Emotionslogo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <View style={styles.headerText}>
                <Text style={styles.headerTitle}>Emotions <Text style={styles.aiText}>Ai</Text></Text>
                {/* <Text style={styles.statusText}>By IIt Madras</Text> */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#04714A',
        height: '100%',
    },
    logo: {
        aspectRatio: 1,
        width: 100,
        height: 100,
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'sans-serif',
        fontWeight: '600',
    },
    headerText: {
        flexDirection: 'column',
    },
    headerTitle: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    aiText: {
        color: 'white',
        fontWeight: 'bold',
    },
    statusText: {
        fontSize: 12,
        color: 'white',
    },
});