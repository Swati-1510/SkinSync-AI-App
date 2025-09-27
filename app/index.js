import { View } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loading from '../components/Loading'; // Make sure this path is correct
import { StatusBar } from 'expo-status-bar';

export default function Index() {
  // This page is now a dedicated loading screen.
  // The redirect logic in the root layout will handle navigation.
  return (
    <View className="flex-1 items-center justify-center bg-app-bg">
      <StatusBar style="dark" />
      <Loading size={hp(10)} />
    </View>
  );
}