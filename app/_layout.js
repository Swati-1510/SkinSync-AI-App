import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { AuthContextProvider, useAuth } from '../context/authContext';
import { StatusBar } from 'expo-status-bar';
import Loading from '../components/Loading'; // Import your custom Loading component
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, NunitoSans_400Regular, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';
import { PlayfairDisplay_400Regular } from '@expo-google-fonts/playfair-display';
import * as SplashScreen from 'expo-splash-screen';
import "../global.css";

SplashScreen.preventAutoHideAsync(); // Keep the splash screen visible


const MainLayout = () => {
    const { isAuthenticated } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        // This effect ONLY handles redirecting between public and private areas.
        
        // If we don't know the auth state yet, just wait. The loader will show.
        if (typeof isAuthenticated === 'undefined') return;

        const inApp = segments[0] === '(app)';

        if (isAuthenticated && !inApp) {
            // User is logged in but is on a public screen. Send them into the app.
            router.replace('(app)/home'); // Go to a default screen in the group
        } else if (isAuthenticated === false) {
            // User is NOT logged in. If they are in the private area, kick them out.
            if (inApp) {
                router.replace('/'); // Send to the welcome/start page
            }
        }
    }, [isAuthenticated, segments, router]);

    // If the auth state is still loading, show a full-screen loader.
    // This prevents the flicker of the welcome/login page.
    if (typeof isAuthenticated === 'undefined') {
        return (
            <View className="flex-1 items-center justify-center bg-app-bg">
                <Loading size={100} />
            </View>
        );
    }

    // After the check, render the correct route group (public or private).
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
