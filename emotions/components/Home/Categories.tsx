import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Humanicon from "@/assets/icons/humanicon";
import { Link, RelativePathString } from 'expo-router';
import defaultCategories from '@/Data/Categorys';

const Categories = ({ categories = [] }) => {


    const items = categories.length > 0 ? categories : defaultCategories;

    return (
        <View style={{ padding: 16 }}>

            <Text style={{ fontWeight: '800', fontSize: 20, marginBottom: 5 }}>Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 5 }}>
                {items.map((item, index) => (
                    <Link key={index} style={{ marginRight: 10 }} href={`/Activitys/${item.type}` as RelativePathString}>
                        <View
                            style={{
                                backgroundColor: item.bgColor,
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
                    </Link>
                ))}
            </ScrollView>

        </View>
    );
};

export default Categories;