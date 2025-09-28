// This is the complete and correct code for app/_layout.js

import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { AuthContextProvider, useAuth } from '../context/authContext';
import { StatusBar } from 'expo-status-bar';
import Loading from '../components/Loading'; // Your custom Loading component
import { useFonts, NunitoSans_400Regular, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';
import { PlayfairDisplay_400Regular } from '@expo-google-fonts/playfair-display';
import * as SplashScreen from 'expo-splash-screen';
import "../global.css";

// Keep the splash screen visible while we do all our initial loading
SplashScreen.preventAutoHideAsync();

// This is the "brain" component that decides what to render
const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // If the initial check isn't done, do nothing.
    if (typeof isAuthenticated === 'undefined') return;

    const inApp = segments[0] === '(app)';

    if (isAuthenticated && !inApp) {
      router.replace('/home');
    } else if (isAuthenticated === false && inApp) {
      router.replace('/');
    }
  }, [isAuthenticated, segments, router]);

    // Show a full-screen loader ONLY while we wait for the initial auth check.
    if (typeof isAuthenticated === 'undefined') {
        return (
            <View className="flex-1 items-center justify-center bg-app-bg">
                <Loading size={100} />
            </View>
        );
    }

    // After the check is complete, render the correct page (public or private).
    return <Slot />;
}

// This is the main Root Layout component for the entire app.
export default function RootLayout() {
    // Load all necessary fonts
    const [fontsLoaded, fontError] = useFonts({
        NunitoSans_400Regular,
        NunitoSans_700Bold,
        PlayfairDisplay_400Regular,
    });

    useEffect(() => {
        // Hide the splash screen ONLY after the fonts are loaded.
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    // Do not render anything until the fonts are loaded.
    if (!fontsLoaded && !fontError) {
        return null;
    }

    // The AuthContextProvider wraps everything.
    return (
        <AuthContextProvider>
            <MainLayout />
        </AuthContextProvider>
    );
}