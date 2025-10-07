import { View, Text, TouchableOpacity, Pressable } from 'react-native';
// 1. Import 'useEffect' from React
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import GoogleIcon from '../assets/icons/Google.svg';
import AppLogoo from '../assets/icons/AppLogoo.svg';

// This is required for the login pop-up to close correctly after completion.
import { useAuth } from '../context/authContext';

export default function StartPage() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();

  

  return (
    // The main container fills the screen and provides overall padding.
    <View 
      className="flex-1 bg-app-bg" 
      style={{paddingTop: hp(10), paddingHorizontal: wp(2)}}
    >
      
      {/* This container holds both sections and controls the space between them */}
      <View className="gap-40"> 
      
        {/* Header Section */}
        <View className="items-center">
          <Text style={{fontSize: hp(6)}} className="font-playfair-display-regular text-dark-olive-green">
            SkinSync
          </Text>
          <Text style={{fontSize: hp(2)}} className="font-playfair-display-regular text-muted-khaki mt-2">
            Your Personal AI Skincare Coach
          </Text>
        </View>

        {/* Logo */}
        <View className="items-center" style={{ marginVertical: -hp(18) }}>
          <AppLogoo width={wp(60)} height={hp(23)} />
        </View>
        
        {/* Buttons Section */}
        <View style={{width: '100%'}} className="gap-4">

          {/* Continue with Google Button */}
          <TouchableOpacity
            style={{ height: hp(7) }}
            className="bg-white border border-muted-khaki rounded-full flex-row justify-center items-center"
            // 5. Change the onPress to trigger the Google login prompt.
            //    'disabled' prevents clicking before the request is ready.
            onPress={() => loginWithGoogle()}
          >
            <GoogleIcon width={wp(6)} height={hp(3)} />
            <Text style={{ fontSize: hp(2) }} className="text-dark-olive-green font-nunito-sans-semibold tracking-wider ml-2">
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* "or" Divider */}
          <View className="flex-row items-center my-2">
            <View className="flex-1 h-px bg-muted-khaki" />
            <Text style={{ fontSize: hp(2) }} className="mx-4 font-nunito-sans-regular text-muted-khaki">
              or
            </Text>
            <View className="flex-1 h-px bg-muted-khaki" />
          </View>
          
          {/* Create an Account Button */}
          <TouchableOpacity
            style={{ height: hp(7) }}
            className="bg-primary rounded-full flex justify-center items-center"
            onPress={() => router.push('signUp')}
          >
            <Text style={{ fontSize: hp(2) }} className="text-white font-nunito-sans-semibold tracking-wider">
              Create an Account
            </Text>
          </TouchableOpacity>
          
          {/* Log In Button */}
          <Pressable onPress={() => router.push('logIn')} className="mt-5">
            <Text style={{ fontSize: hp(2) }} className="text-center font-nunito-sans-regular text-muted-khaki">
              Log In
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}