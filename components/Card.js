import { View } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function Card({ children, style }) {
    return (
        <View className="bg-white rounded-2xl shadow-sm" style={[{ padding: wp(4) }, style]}>
            {children} 
        </View>
    );
}