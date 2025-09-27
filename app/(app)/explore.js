import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import BarcodeScanner from '../../assets/icons/BarcodeScanner.svg';
import ExploreIcon from '../../assets/icons/ExploreIcon.svg';
import StarIcon from '../../assets/icons/StarIcon.svg';
import Card from '../../components/Card';
import React, { useState, useEffect } from 'react'; // Add useState and useEffect
import { useAuth } from '../../context/authContext'; // Import useAuth
import { getAiProductRecommendations } from '../../utils/aiService';

// --- Static Data for UI Building ---
const concerns = [
    { name: 'Acne', icon: '🔥' },
    { name: 'Anti-Aging', icon: '⏳' },
    { name: 'Dullness', icon: '✨' },
    { name: 'Redness', icon: '🔴' },
    { name: 'Dryness', icon: '💧' },
];



// --- The Main Component ---
const Explore = () => {
    const { user } = useAuth(); // Get the current user
    const [products, setProducts] = useState([]); // To store the AI recommendations
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            if (user?.skinProfile) {
                setIsLoadingProducts(true);
                try {
                    const recommendedProducts = await getAiProductRecommendations(user.skinProfile);
                    setProducts(recommendedProducts);
                } catch (error) {
                    console.error("Failed to fetch AI products:", error);
                } finally {
                    setIsLoadingProducts(false);
                }
            } else {
                setIsLoadingProducts(false); // No profile, so not loading
            }
        };
        fetchProducts();
    }, [user]);
    return (
        <View className="flex-1 bg-app-bg">
            <StatusBar style="dark" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: hp(8), paddingHorizontal: wp(5), paddingBottom: hp(10) }}
            >
                {/* Header */}
                <View className="items-center mb-8">
                    <Text className="text-dark-olive-green font-nunito-sans-bold" style={{ fontSize: hp(3.5) }}>Explore</Text>
                </View>

                {/* Search Bar */}
                <View style={{ height: hp(6.5) }} className="bg-white rounded-full flex-row items-center px-4 shadow-sm mb-8">
                    <ExploreIcon width={22} height={22} stroke="#B2AC88" />
                    <TextInput
                        placeholder="Search products, ingredients, or concerns..."
                        placeholderTextColor="#B2AC88"
                        className="flex-1 ml-3 text-base text-dark-olive-green font-nunito-sans-regular"
                    />
                </View>

                {/* Scan Your Shelf Card */}
                <TouchableOpacity
                    style={{ padding: hp(2) }}
                    className="bg-primary rounded-2xl shadow-md flex-row items-center mb-8"
                    // --- THIS IS THE NEW LINE ---
                    onPress={() => router.push('/(app)/scanner')}                >
                    <BarcodeScanner width={65} height={70} fill="white" />
                    <View className="ml-4 flex-1">
                        <Text className="text-white font-nunito-sans-bold" style={{ fontSize: hp(2.2) }}>Scan Your Shelf</Text>
                        <Text className="text-white font-nunito-sans-regular text-base opacity-90 mt-1 leading-relaxed">Analyze products you already own to see if they're right for you.</Text>
                    </View>
                </TouchableOpacity>

                {/* Browse by Concern */}
                <View className="mb-8">
                    <Text className="text-dark-olive-green font-nunito-sans-bold text-xl mb-4">Browse by Concern</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: wp(5) }}>
                        <View className="flex-row" style={{ gap: 12 }}>
                            {concerns.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className="bg-white border border-sage rounded-full py-2 px-4 flex-row items-center"
                                >
                                    <Text>{item.icon}</Text>
                                    <Text className="text-sage font-nunito-sans-bold text-sm ml-2">{item.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* --- Top-Rated for You --- */}
                <View>
                    <Text className="text-dark-olive-green font-nunito-sans-bold text-xl">Top-Rated for You</Text>
                    <Text className="text-sage font-nunito-sans-regular text-sm mb-4">
                        Based on your {user?.skinProfile?.step1_q0 || 'skin profile'}.
                    </Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: wp(5), minHeight: hp(30) }} // Use minHeight to prevent layout shifts
                    >
                        <View className="flex-row" style={{ gap: 16 }}>

                            {/* --- Conditional Logic: Show Loader or Products --- */}
                            {isLoadingProducts ? (
                                // This View is shown while waiting for the AI
                                <View style={{ width: wp(80), height: hp(30), justifyContent: 'center', alignItems: 'center' }}>
                                    <Text className="text-center text-sage">Finding products just for you...</Text>
                                    {/* For a better experience, you can add your <Loading /> Lottie component here */}
                                </View>
                            ) : (
                                // This part is shown after the AI responds
                                products.map((product, index) => (
                                    // Main container for one product in the scroll view
                                    <View key={`${product.name}-${index}`} style={{ width: wp(60), paddingBottom: hp(2) }}>

                                        {/* --- ELEMENT 1: THE MAIN CARD (Clickable) --- */}
                                        <TouchableOpacity
                                            style={{ marginBottom: hp(2) }} // Make room for the tag
                                            onPress={() => console.log("Tapped on:", product.name)} // Placeholder action
                                        >
                                            <Card style={{ padding: 0 }}>
                                                {/* Image is removed for the text-only design */}

                                                {/* Card Content Container with fixed height */}
                                                <View style={{ padding: 12, height: hp(22), justifyContent: 'space-between' }}>
                                                    {/* Top Text Block */}
                                                    <View>
                                                        <Text className="text-sage font-nunito-sans-regular text-xs">{product.brand}</Text>
                                                        <Text
                                                            className="text-dark-olive-green font-nunito-sans-bold text-[16px] mt-1"
                                                            numberOfLines={3} // Allow for longer names
                                                        >
                                                            {product.name}
                                                        </Text>
                                                    </View>
                                                    {/* Bottom Text Block (Rating) */}
                                                    <View
                                                        className="flex-row items-center"
                                                        style={{ marginBottom: -hp(1) }} // Adjust to lift the rating
                                                    >
                                                        <StarIcon width={16} height={16} fill="#FFD700" />
                                                        <Text style={{ color: '#B2AC88' }} className="text-xs ml-1 font-nunito-sans-bold">
                                                            {product.rating}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </Card>
                                        </TouchableOpacity>

                                        {/* --- ELEMENT 2: THE OVERLAPPING TAG (also Clickable) --- */}
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: '#D0F0C0', // Tea Green
                                                position: 'absolute',
                                                bottom: 0,
                                                left: '50%',
                                                transform: [{ translateX: -wp(22) }], // Adjust for perfect centering
                                                width: wp(44), // Adjust width
                                                zIndex: 10,
                                            }}
                                            className="rounded-full py-2 flex-row items-center justify-center shadow-md"
                                        >
                                            <Text>✅</Text>
                                            <Text className="text-dark-olive-green font-nunito-sans-bold ml-1.5" style={{ fontSize: hp(1.5) }}>
                                                {product.tag}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                ))
                            )}
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
}

export default Explore;