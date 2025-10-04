import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import React, { useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function Scanner() {
    // 1. Use the new permissions hook instead of useEffect
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const router = useRouter();

    // 2. Handler for a successful scan (your logic was already good)
    const handleBarcodeScanned = ({ type, data }) => {
        if (!scanned) {
            setScanned(true); // Stop scanning immediately
            console.log(`Barcode Scanned: Type=${type}, Data=${data}`);
            
            // Navigate to the analysis page and pass the barcode data
            router.replace({ pathname: '/(app)/analysis', params: { barcode: data } });
        }
    };

    // --- UI Logic based on the new hook ---
    if (!permission) {
        // Camera permissions are still loading.
        return <View style={styles.permissionContainer} />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.permissionContainer}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* The Camera View - fills the screen */}
            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                style={StyleSheet.absoluteFillObject}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr", "ean13", "upc_a", "upc_e"], // Specify common barcode types
                }}
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