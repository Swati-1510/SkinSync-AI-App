import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Camera, CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Scanner() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const router = useRouter();

    // 1. Request camera permission
    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getBarCodeScannerPermissions();
    }, []);

    // 2. Handler for a successful scan
    const handleBarCodeScanned = ({ type, data }) => {
        if (!scanned) {
            setScanned(true); // Stop scanning immediately
            console.log(`Barcode Scanned: Type=${type}, Data=${data}`);
            
            // Navigate to the analysis page and pass the barcode data
            router.replace({ pathname: '/(app)/analysis', params: { barcode: data } });
        }
    };

    // --- UI Logic ---
    if (hasPermission === null) {
        return <View style={styles.permissionContainer}><Text>Requesting camera permission...</Text></View>;
    }
    if (hasPermission === false) {
        return <View style={styles.permissionContainer}><Text>No access to camera. Please enable in settings.</Text></View>;
    }

    return (
        <View style={styles.container}>
            {/* The Camera View - fills the screen */}
            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Overlay for instructions and back button */}
            <View style={styles.overlay}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.instructions}>Center a product barcode in the frame</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    overlay: { 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'space-between', 
        paddingTop: hp(8),
        paddingHorizontal: wp(5),
    },
    backButton: { 
        backgroundColor: 'rgba(250, 114, 104, 0.7)', // Primary color with opacity
        padding: 10, 
        borderRadius: 8, 
        alignSelf: 'flex-start' 
    },
    backButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    instructions: { 
        color: 'white', 
        fontSize: 18, 
        alignSelf: 'center', 
        marginBottom: hp(15), // Lift instructions slightly above the bottom
        backgroundColor: 'rgba(0,0,0,0.5)', 
        padding: 10, 
        borderRadius: 8 
    },
    permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F0E6' }
});