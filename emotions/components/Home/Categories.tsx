import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Humanicon from "@/assets/icons/humanicon";

const Categories = ({ categories = [] }) => {
    // Default categories if none provided
    const defaultCategories = [
        { color: '#BFF9E4', icon: <Humanicon height={49} width={55} /> },
        { color: '#FFDBDB', icon: <Humanicon height={49} width={55} /> },
        { color: '#DBEBFF', icon: <Humanicon height={49} width={55} /> },
        { color: '#FFDBF6', icon: <Humanicon height={49} width={55} /> },
        { color: '#FFFBDB', icon: <Humanicon height={49} width={55} /> },
        { color: '#C17570', icon: <Humanicon height={49} width={55} /> },
        { color: '#FFDBDB', icon: <Humanicon height={49} width={55} /> },
        { color: '#DBEBFF', icon: <Humanicon height={49} width={55} /> },
        { color: '#FFDBF6', icon: <Humanicon height={49} width={55} /> },
        { color: '#FFFBDB', icon: <Humanicon height={49} width={55} /> },
    ];

    const items = categories.length > 0 ? categories : defaultCategories;

    return (
        <View style={{ padding: 16 }}>
            <Text style={{ fontWeight: '800', fontSize: 20, marginBottom: 5 }}>Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 5 }}>
                {items.map((item, index) => (
                    <View
                        key={index}
                        style={{
                            backgroundColor: item.color,
                            borderRadius: 8,
                            height: 56,
                            width: 56,
                            marginRight: 16,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {item.icon}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default Categories;