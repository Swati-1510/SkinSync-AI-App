import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Camera, CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Scanner() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const router = useRouter();

    // 1. Ask for camera permission when the page loads
    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getCameraPermissions();
    }, []);

    // 2. This function runs when a barcode is detected
    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true); // Stop scanning to prevent multiple triggers
        console.log(`Barcode with type ${type} and data ${data} has been scanned!`);
        
        // 3. Navigate to the analysis page and pass the barcode data
        router.replace({ pathname: '/(app)/analysis', params: { barcode: data } });
    };

    // Handle different states: loading, no permission, or camera active
    if (hasPermission === null) {
        return <Text className="text-center mt-20">Requesting for camera permission...</Text>;
    }
    if (hasPermission === false) {
        return <Text className="text-center mt-20">No access to camera. Please enable it in your settings.</Text>;
    }

    return (
        <View style={styles.container}>
            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "qr"], // Common product barcode types
                }}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Optional: Add an overlay or a back button */}
            <View style={styles.overlay}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.instructions}>Scan a product barcode</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column', justifyContent: 'center' },
    overlay: { flex: 1, justifyContent: 'space-between', padding: hp(5) },
    backButton: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 5, alignSelf: 'flex-start' },
    backButtonText: { color: 'white', fontSize: 16 },
    instructions: { color: 'white', fontSize: 18, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 5 }
});
