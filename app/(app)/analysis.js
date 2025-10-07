import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../context/authContext';
import { analyzeProductByBarcode } from '../../utils/aiService';
import Card from '../../components/Card';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons'; // Using Expo's built-in icon library

export default function Analysis() {
    const { barcode } = useLocalSearchParams(); // Get the barcode from the navigation params
    const { user } = useAuth();
    const router = useRouter();

    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); // Will now hold the full error object

    // --- Data Fetch Logic ---
    useEffect(() => {
        const performAnalysis = async () => {
            if (!barcode || !user?.skinProfile) {
                setError({ error: 'PRECONDITION_FAILED', message: "Barcode or user profile is missing." });
                setIsLoading(false);
                return;
            }
            try {
                const result = await analyzeProductByBarcode(barcode, user.skinProfile);
                
                if (result.error) {
                    // Store the entire error object (e.g., { error: 'NOT_FOUND', message: '...' })
                    setError(result);
                } else {
                    setAnalysisResult(result);
                }
            } catch (e) {
                setError({ error: 'CRITICAL', message: "A critical error occurred during analysis. Please try again." });
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
                <Text className="text-sage text-sm mt-2">Connecting to our databases...</Text>
            </View>
        );
    }

    // Specific UI for "Product Not Found"
    if (error?.error === 'NOT_FOUND') {
        return (
            <View className="flex-1 justify-center items-center bg-app-bg p-5 gap-y-5">
                <Feather name="search" size={40} color="#B2AC88" />
                <Text className="text-dark-olive-green font-bold text-2xl text-center">Product Not Found</Text>
                <Text className="text-sage text-center text-base">{error.message}</Text>
                
                <TouchableOpacity onPress={() => router.push('/ocr-scanner')} className="mt-4 bg-primary rounded-full py-4 px-6 w-full flex-row justify-center items-center gap-x-3">
                    <Feather name="camera" size={20} color="white" />
                    <Text className="text-white font-bold text-base">Scan Ingredients with Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/(app)/scanner')} className="bg-white border border-primary rounded-full py-4 px-6 w-full flex-row justify-center items-center gap-x-3">
                     <Feather name="refresh-cw" size={20} color="#FA7268" />
                    <Text className="text-primary font-bold text-base">Scan Another Product</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Catch-all for any other error
    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-app-bg p-5">
                <Feather name="alert-circle" size={40} color="#DC143C" />
                <Text className="text-primary font-bold text-xl text-center mt-4 mb-2">Analysis Failed</Text>
                <Text className="text-sage text-center">{error.message || "An unknown error occurred."}</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-8 bg-primary rounded-full py-3 px-6">
                    <Text className="text-white font-bold">Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Success UI
    return (
        <ScrollView className="flex-1 bg-app-bg" contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 40 }}>
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
            
            <TouchableOpacity onPress={() => router.back()} className="mt-8 bg-white border border-primary rounded-full py-3 px-6">
                <Text className="text-primary font-bold text-center">Done</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

