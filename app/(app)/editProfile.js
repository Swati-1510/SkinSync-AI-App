import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import Card from '../../components/Card';
import { UserIcon } from 'react-native-heroicons/solid';

const colors = {
    primary: '#FA7268',
    sage: '#B2AC88',
    darkOliveGreen: '#556B2F',
};

export default function EditProfile() {
    const { user } = useAuth();
    const router = useRouter();
    const [username, setUsername] = useState(user?.username || '');

    const handleSave = () => {
        // Add logic to save the updated profile information
        console.log('Saving profile with username:', username);
        router.back(); // Go back to the profile page after saving
    };

    return (
        <ScrollView
            className="flex-1 bg-app-bg"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: hp(8), paddingHorizontal: wp(5), paddingBottom: hp(10) }}
        >
            <Text style={{ fontSize: hp(3.5) }} className="font-nunito-sans-bold text-dark-olive-green text-center mb-8">
                Edit Profile
            </Text>

            <Card className="p-4 mb-8">
                <Text className="text-sage font-bold text-sm mb-2">USERNAME</Text>
                <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
                    <UserIcon size={hp(2.7)} color="gray" />
                    <TextInput
                        style={{ fontSize: hp(2) }}
                        className="flex-1 font-semibold text-neutral-700"
                        placeholder="Username"
                        placeholderTextColor={'gray'}
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>
            </Card>

            <TouchableOpacity
                onPress={handleSave}
                style={{ height: hp(7), backgroundColor: colors.primary }}
                className="rounded-full justify-center items-center"
            >
                <Text style={{ fontSize: hp(2.2) }} className="text-white font-bold tracking-wider">Save Changes</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
