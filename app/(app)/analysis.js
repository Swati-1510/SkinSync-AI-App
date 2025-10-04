// in app/(app)/analysis.js
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../context/authContext';
import { analyzeProductByBarcode } from '../../utils/aiService';
import Card from '../../components/Card';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Analysis() {
    const { barcode } = useLocalSearchParams(); // Get the barcode from the navigation params
    const { user } = useAuth();
    const router = useRouter();

    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Data Fetch Logic ---
    useEffect(() => {
        const performAnalysis = async () => {
            if (!barcode || !user?.skinProfile) {
                setError("Barcode or user profile is missing.");
                setIsLoading(false);
                return;
            }
            try {
                const result = await analyzeProductByBarcode(barcode, user.skinProfile);
                
                if (result.error) {
                    setError(result.error);
                } else {
                    setAnalysisResult(result);
                }
            } catch (e) {
                setError("A critical error occurred during analysis. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        performAnalysis();
    }, [barcode, user]); // Reruns if the barcode or user profile changes

    // --- Helper for UI Styling ---
    const getVerdictStyle = (verdict) => {
        if (verdict === 'Good Match') return 'border-green-600 bg-green-50';
        if (verdict === 'Use with Caution') return 'border-yellow-600 bg-yellow-50';
        return 'border-red-600 bg-red-50';
    };

    // --- UI Rendering ---
    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-app-bg">
                <ActivityIndicator size="large" color="#FA7268" style={{ transform: [{ scale: 1.5 }] }} />
                <Text className="text-dark-olive-green mt-4 font-bold text-lg">Analyzing Product...</Text>
                <Text className="text-sage text-sm mt-2">Connecting to Gemini AI and OpenFoodFacts...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-app-bg p-5">
                <Text className="text-primary font-bold text-xl mb-4">Analysis Failed</Text>
                <Text className="text-sage text-center">{error}</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-8 bg-primary rounded-full py-3 px-6">
                    <Text className="text-white font-bold">Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-app-bg" contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
            <Text className="text-dark-olive-green font-bold text-3xl text-center mb-6">Analysis Complete</Text>

            <Card style={{ padding: 20 }}>
                <Text className="text-dark-olive-green font-bold text-xl mb-4">{analysisResult?.productName}</Text>

                {/* Verdict Banner */}
                <View className={`border-l-4 p-4 rounded-r-lg mb-6 border-2 ${getVerdictStyle(analysisResult?.verdict)}`}>
                    <Text className="text-dark-olive-green font-bold text-lg">{analysisResult?.verdict}</Text>
                    <Text className="text-sage mt-1 text-sm">{analysisResult?.analysis}</Text>
                </View>

                {/* Notable Ingredients */}
                <Text className="text-dark-olive-green font-bold text-lg mb-3">Notable Ingredients:</Text>
                <View className="gap-y-3">
                    {analysisResult?.notableIngredients?.map((item, index) => (
                        <View key={index}>
                            <Text className="text-dark-olive-green font-bold text-base">• {item.name}</Text>
                            <Text className="text-sage ml-4 text-sm">{item.reason}</Text>
                        </View>
                    ))}
                </View>
            </Card>
        </ScrollView>
    );
}