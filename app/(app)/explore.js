import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import BarcodeScanner from '../../assets/icons/BarcodeScanner.svg';
import ExploreIcon from '../../assets/icons/ExploreIcon.svg';
import StarIcon from '../../assets/icons/StarIcon.svg';
import Card from '../../components/Card';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { getAiProductRecommendations, searchProductsAI } from '../../utils/aiService';
import useDebounce from '../../utils/useDebounce';


// --- Static Data for UI Building ---
const concerns = [
    { name: 'Acne', icon: '🔥' },
    { name: 'Anti-Aging', icon: '⏳' },
    { name: 'Dullness', icon: '✨' },
    { name: 'Redness', icon: '🔴' },
    { name: 'Dryness', icon: '💧' },
];

// Function to render a single product card
const renderProductCard = ({ item }) => (
    <View key={item.name} style={{ width: wp(60), marginRight: 16 }}>
        <TouchableOpacity
            onPress={() => console.log("Tapped on:", item.name)}
        >
            <Card style={{ padding: 0 }}>
                {/* Image Placeholder */}
                <View
                    style={{ height: hp(15), borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                    className="bg-white justify-center items-center"
                />


                {/* Card Content Container: Fixed height is key */}
                <View style={{ padding: 10, height: hp(20), justifyContent: 'space-between' }}>

                    {/* Top Text Block */}
                    <View>
                        <Text className="text-sage font-nunito-sans-regular text-xs">{item.brand}</Text>
                        <Text
                            className="text-dark-olive-green font-nunito-sans-bold text-[16px] mt-1"
                            numberOfLines={2}
                        >
                            {item.name}
                        </Text>
                    </View>

                    {/* Bottom Block (Rating and Tag) */}
                    <View className="flex-col">
                        {/* Ratings */}
                        <View className="flex-row items-center mb-2">
                            <StarIcon width={16} height={16} fill="#FFD700" />
                            <Text style={{ color: '#B2AC88' }} className="text-xs ml-1 font-nunito-sans-bold">{item.rating}</Text>
                        </View>

                        {/* Personalized Tag */}
                        <View
                            style={{ backgroundColor: '#D0F0C0', alignSelf: 'flex-start' }}
                            className="rounded-full py-1 px-3 flex-row items-left"
                        >
                            <Text className="text-green-800 font-bold text-sm mr-1">✅</Text>
                            <Text className="text-dark-olive-green font-nunito-sans-bold" style={{ fontSize: hp(1.3) }}>
                                {item.tag.replace('✅', '').trim()}
                            </Text>
                        </View>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    </View>
);

// --- The Main Component ---
const Explore = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(''); // NEW: The immediate input value
    const debouncedSearchTerm = useDebounce(searchTerm, 1000); // NEW: The debounced value (waits 500ms)
    const [initialProducts, setInitialProducts] = useState([]);
    const [activeFilter, setActiveFilter] = useState(null);

    const handleSearch = async (term) => {
        if (!term.trim()) return; // Don't search if the input is empty
        
        setActiveFilter(null);
        setIsLoadingProducts(true);
        try {
            const searchResults = await searchProductsAI(term, user.skinProfile);
            setProducts(searchResults); // Display the search results
        } catch (error) {
            console.error("Failed to get AI search results:", error);
            setProducts([]);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const fetchInitialProducts = async () => {
        if (user?.skinProfile) {
            setIsLoadingProducts(true);
            try {
                const recommendedProducts = await getAiProductRecommendations(user.skinProfile);
                setProducts(recommendedProducts);
                setInitialProducts(recommendedProducts);
            } catch (error) {
                console.error("Failed to fetch initial AI products:", error);
                setProducts([]);
            } finally {
                setIsLoadingProducts(false);
            }
        } else {
            setIsLoadingProducts(false);
        }
    };

    useEffect(() => {
        fetchInitialProducts();
    }, [user]);

    // --- NEW: The useEffect that fires ONLY when typing stops ---
    useEffect(() => {
        if (debouncedSearchTerm) {
            // If there's a term, search the AI.
            handleSearch(debouncedSearchTerm);
        } else {
            // If the term is empty, just restore the saved list. This avoids an API call.
            setProducts(initialProducts);
            setIsLoadingProducts(false);
        }
    }, [debouncedSearchTerm]); // Only trigger when the debounced value changes

    const filteredProducts = products.filter(product => {
        if (!activeFilter) {
            return true; // If no filter is active, show all products
        }
        // If a product's tag is not available, it will not be included in the filtered results.
        if (!product.tag) {
            return false;
        }
        // Core Filtering Logic
        return product.tag.toLowerCase().includes(activeFilter.toLowerCase());
    });

    return (
        <View className="flex-1 bg-app-bg">
            <StatusBar style="dark" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: hp(8), paddingHorizontal: wp(2), paddingBottom: hp(10) }}
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
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                </View>

                {/* Scan Your Shelf Card */}
                <TouchableOpacity
                    style={{ padding: hp(2) }}
                    className="bg-primary rounded-2xl shadow-md flex-row items-center mb-8"
                    onPress={() => router.push('/(app)/scanner')}
                >
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
                                    onPress={() => setActiveFilter(item.name === activeFilter ? null : item.name)}
                                    className="rounded-full py-2 px-4 flex-row items-center"
                                    style={{
                                        marginRight: 12,
                                        backgroundColor: item.name === activeFilter ? '#FA7268' : 'white',
                                        borderColor: item.name === activeFilter ? '#FA7268' : '#B2AC88',
                                        borderWidth: 1,
                                    }}
                                >
                                    <Text style={{ color: item.name === activeFilter ? 'white' : '#B2AC88' }}>{item.icon}</Text>
                                    <Text
                                        className="font-nunito-sans-bold text-sm ml-2"
                                        style={{ color: item.name === activeFilter ? 'white' : '#B2AC88' }}
                                    >
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* --- Top-Rated for You --- */}
                <View>
                    <Text className="text-dark-olive-green font-nunito-sans-bold text-xl">{debouncedSearchTerm ? 'Search Results' : 'Top-Rated for You'}</Text>
                    <Text className="text-sage font-nunito-sans-regular text-sm mb-4">
                        Based on your {user?.skinProfile?.step1_q0 || 'skin profile'}.
                    </Text>

                    {isLoadingProducts ? (
                        <View style={{ width: wp(90), height: hp(30), justifyContent: 'center', alignItems: 'center' }}>
                            <Text className="text-center text-sage">Finding products just for you...</Text>
                        </View>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingRight: wp(5) }}
                        >
                            <View className="flex-row" style={{ gap: 16 }}>
                                {filteredProducts.map((product, index) => (
                                    <View key={`${product.name}-${index}`}>
                                        {renderProductCard({ item: product })}
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

export default Explore;