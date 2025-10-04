import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useAuth } from '../../context/authContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import Card from '../../components/Card';
import { ChevronRightIcon } from 'react-native-heroicons/solid';

// --- IMPORT YOUR ACTUAL SVG ICONS ---
// Ensure these files exist in your assets/icons folder
import EditIcon from '../../assets/icons/EditIcon.svg'; 
import DnaIcon from '../../assets/icons/DnaIcon.svg'; 
import AppleIcon from '../../assets/icons/AppleIcon.svg'; 
import BellIcon from '../../assets/icons/BellIcon.svg';
import DocIcon from '../../assets/icons/DocIcon.svg'; // Placeholder for Terms/Privacy document
import LockShieldIcon from '../../assets/icons/LockShieldIcon.svg'; // Placeholder for Privacy Policy
import MessageIcon from '../../assets/icons/MessageIcon.svg'; // Placeholder for Reviews
import BookmarkIcon from '../../assets/icons/BookmarkIcon.svg'; // Placeholder for Saved Products

const colors = {
    primary: '#FA7268',
    sage: '#B2AC88',
    darkOliveGreen: '#556B2F',
    lightCoral: '#FECECE', // Used for the Log Out button background
};


// --- Reusable Menu Item Component ---
const MenuItem = ({ icon: Icon, title, onPress, isLast }) => (
    <TouchableOpacity onPress={onPress} className="flex-row justify-between items-center px-4 py-3">
        <View className="flex-row items-center gap-x-3">
            {/* The icon takes the sage color for consistency */}
            <Icon color={colors.sage} width={22} height={22} />
            <Text className="text-dark-olive-green text-base font-nunito-sans-regular">{title}</Text>
        </View>
        <ChevronRightIcon color={colors.sage} size={hp(2.2)} />
    </TouchableOpacity>
);


export default function Profile() {
    const { user, logout } = useAuth();
    const router = useRouter();

    return (
        <ScrollView 
            className="flex-1 bg-app-bg"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: hp(8), paddingHorizontal: wp(5), paddingBottom: hp(10) }}
        >
            {/* --- Header --- */}
            <Text style={{ fontSize: hp(3.5) }} className="font-nunito-sans-bold text-dark-olive-green text-center mb-8">
                Profile
            </Text>

            {/* --- 1. User Info Card --- */}
            <Card className="flex-row items-center p-4 mb-8">
                {/* Placeholder for Avatar */}
                <View className="w-16 h-16 bg-white rounded-full border-2 border-primary mr-4 overflow-hidden">
                    {/* Placeholder image or the user's uploaded avatar */}
                    <Image source={{ uri: 'YOUR_AVATAR_URI' }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                </View>
                <View>
                    <Text style={{ fontSize: hp(2.5) }} className="font-nunito-sans-bold text-dark-olive-green">
                        {user?.username || 'Swati Mahajan'}
                    </Text>
                    <Text className="text-sage text-base">
                        {user?.email || 'swati@gmail.com'}
                    </Text>
                </View>
            </Card>

            {/* --- 2. ACCOUNT Section --- */}
            <Text className="text-sage font-bold text-sm mb-2">ACCOUNT</Text>
            <Card style={{ padding: 0 }} className="mb-6">
                <MenuItem icon={EditIcon} title="Edit Profile" onPress={() => console.log('NAVIGATE TO EDIT SCREEN')} />
                <View className="h-[1px] bg-gray-200 mx-4" />
                <MenuItem icon={DnaIcon} title="My Skin Genome" onPress={() => router.push('/(app)/quiz')} />
                <View className="h-[1px] bg-gray-200 mx-4" />
                <MenuItem icon={AppleIcon} title="Diet & Nutrition Plan" onPress={() => console.log('NAVIGATE TO DIET PLAN')} />
                <View className="h-[1px] bg-gray-200 mx-4" />
                <MenuItem icon={BellIcon} title="Notifications" onPress={() => console.log('NAVIGATE TO NOTIFICATIONS')} />
            </Card>

            {/* --- 3. APP Section --- */}
            <Text className="text-sage font-bold text-sm mb-2">APP</Text>
            <Card style={{ padding: 0 }} className="mb-6">
                <MenuItem icon={DocIcon} title="Terms of Service" onPress={() => console.log('NAVIGATE TO TERMS')} />
                <View className="h-[1px] bg-gray-200 mx-4" />
                <MenuItem icon={LockShieldIcon} title="Privacy Policy" onPress={() => console.log('NAVIGATE TO PRIVACY')} />
            </Card>

            {/* --- 4. COMMUNITY Section --- */}
            <Text className="text-sage font-bold text-sm mb-2">COMMUNITY</Text>
            <Card style={{ padding: 0 }} className="mb-6">
                <MenuItem icon={MessageIcon} title="My Reviews" onPress={() => console.log('NAVIGATE TO REVIEWS')} />
                <View className="h-[1px] bg-gray-200 mx-4" />
                <MenuItem icon={BookmarkIcon} title="My Saved Products" onPress={() => console.log('NAVIGATE TO SAVED PRODUCTS')} />
            </Card>

            {/* --- Log Out Button --- */}
            <TouchableOpacity 
                onPress={logout} 
                style={{ height: hp(7), backgroundColor: colors.lightCoral, borderColor: colors.primary }}
                className="mt-6 rounded-full justify-center items-center border"
            >
                <Text style={{ fontSize: hp(2.2) }} className="text-primary font-bold tracking-wider">Log Out</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}