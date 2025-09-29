import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { AuthContextProvider, useAuth } from '../context/authContext';
import { StatusBar } from 'expo-status-bar';
import Loading from '../components/Loading'; // Import your custom Loading component
import { useFonts, NunitoSans_400Regular, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';
import { PlayfairDisplay_400Regular } from '@expo-google-fonts/playfair-display';
import * as SplashScreen from 'expo-splash-screen';
import "../global.css";

SplashScreen.preventAutoHideAsync(); // Keep the splash screen visible


const MainLayout = () => {
    // Get the full user object to check for skinProfile and firestoreChecked flag
    const { isAuthenticated, user } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        // This effect handles all redirection logic.
        
        if (typeof isAuthenticated === 'undefined' || (isAuthenticated && !user?.firestoreChecked)) {
            return;
        }

        const inApp = segments[0] === '(app)';

        if (isAuthenticated) {
            // User is authenticated and Firestore data has been checked.
            if (!inApp) {
                // User is on a public screen (e.g., login), so we need to redirect them.
                if (user?.skinProfile) {
                    // User has a skin profile, send them to the main app.
                    router.replace('(app)/home');
                } else {
                    // User does NOT have a skin profile, send them to the quiz.
                    // --- THIS IS THE CORRECTED LINE ---
                    router.replace('/quiz'); 
                }
            }
        } else {
            // User is NOT logged in.
            if (inApp) {
                // If they are inside a protected area, redirect them to the start page.
                router.replace('/');
            }
        }
    }, [isAuthenticated, user, segments, router]);

    // Show a loading screen while checking auth state OR waiting for Firestore data.
    if (typeof isAuthenticated === 'undefined' || (isAuthenticated && !user?.firestoreChecked)) {
        return (
            <View className="flex-1 items-center justify-center bg-app-bg">
                <Loading size={100} />
            </View>
        );
    }

    // After all checks, render the correct route group (public or private).
    return <Slot />;
}


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

    // The AuthContextProvider wraps everything, making auth state available everywhere.
    return (
        <AuthContextProvider>
            <MainLayout />
        </AuthContextProvider>
    );
}