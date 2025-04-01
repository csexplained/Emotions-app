import { View, Image, Text, StyleSheet } from "react-native";

export default function LoadingScreen() {
    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/Emotionslogo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>EMOTIONS Ai</Text>
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
        height: undefined,
        width: undefined,
        aspectRatio: 1,
        maxHeight: '100%',
        maxWidth: '100%',
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'sans-serif',
        fontWeight: '600',
    },
});