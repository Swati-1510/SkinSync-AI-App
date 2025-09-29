import { View, Text, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '../context/authContext';
import { analyzeProductByBarcode } from '../utils/aiService';
import Card from '../components/Card';
import { ScrollView } from 'react-native-gesture-handler';

export default function Analysis() {
    const { barcode } = useLocalSearchParams(); // Get the barcode from the navigation params
    const { user } = useAuth();
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const performAnalysis = async () => {
            if (barcode && user?.skinProfile) {
                try {
                    const result = await analyzeProductByBarcode(barcode, user.skinProfile);
                    if (result.error) {
                        setError(result.error);
                    } else {
                        setAnalysisResult(result);
                    }
                } catch (e) {
                    setError("A critical error occurred. Please try again.");
                } finally {
                    setIsLoading(false);
                }
            } else {
                setError("Barcode or user profile is missing.");
                setIsLoading(false);
            }
        };
        performAnalysis();
    }, [barcode, user]);

    const getVerdictColor = (verdict) => {
        if (verdict === 'Good Match') return 'bg-green-100 border-green-500';
        if (verdict === 'Use with Caution') return 'bg-yellow-100 border-yellow-500';
        return 'bg-red-100 border-red-500';
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-app-bg">
                <ActivityIndicator size="large" color="#FA7268" />
                <Text className="text-sage mt-4">Analyzing your product...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-app-bg p-5">
                <Text className="text-red-500 font-bold text-lg">Analysis Failed</Text>
                <Text className="text-sage mt-2 text-center">{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-app-bg" contentContainerStyle={{padding: 20, paddingTop: 60}}>
            <Text className="text-dark-olive-green font-bold text-3xl text-center mb-6">Analysis Complete</Text>

            <Card>
                <Text className="text-dark-olive-green font-bold text-xl mb-4">{analysisResult?.productName}</Text>

                <View className={`border-l-4 p-4 rounded-r-lg mb-6 ${getVerdictColor(analysisResult?.verdict)}`}>
                    <Text className="text-dark-olive-green font-bold text-lg">{analysisResult?.verdict}</Text>
                    <Text className="text-sage mt-1">{analysisResult?.analysis}</Text>
                </View>

                <Text className="text-dark-olive-green font-bold text-lg mb-3">Notable Ingredients:</Text>
                <View className="gap-y-3">
                    {analysisResult?.notableIngredients?.map((item, index) => (
                        <View key={index}>
                            <Text className="text-dark-olive-green font-bold">• {item.name}</Text>
                            <Text className="text-sage ml-4">{item.reason}</Text>
                        </View>
                    ))}
                </View>
            </Card>
        </ScrollView>
    );
}