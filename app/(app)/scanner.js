import { View, Text, StyleSheet, TouchableOpacity, Button, Animated, Easing } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

export default function Scanner() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const router = useRouter();
    const isFocused = useIsFocused();
    // --- Animation for the scanning line ---
    const scanAnimation = useRef(new Animated.Value(0)).current;

     // This effect runs whenever the user enters or leaves the screen.
    useEffect(() => {
        // When the screen comes into focus (the user navigates to it)
        if (isFocused) {
            // Reset the 'scanned' state to false. This "issues a new ticket"
            // and re-enables the onBarcodeScanned prop.
            setScanned(false);
            console.log("Scanner reset and ready for a new scan.");
        }
    }, [isFocused]); // The hook's dependency is the isFocused boolean

    useEffect(() => {
        let animation;
        const startAnimation = () => {
            scanAnimation.setValue(0); // Reset animation
            animation = Animated.loop(
                Animated.timing(scanAnimation, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            );
            animation.start();
        };

        if (isFocused) {
            startAnimation();
        }

        return () => {
            if (animation) {
                animation.stop();
            }
        };
    }, [isFocused]);

    const animatedStyle = {
        transform: [
            {
                translateY: scanAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, hp(30)], // Moves from top to bottom of viewfinder
                }),
            },
        ],
    };
    // --- End Animation ---


    const handleBarcodeScanned = ({ type, data }) => {
        if (!scanned) {
            setScanned(true);
            console.log(`Barcode Scanned: Type=${type}, Data=${data}`);
            router.replace({ pathname: '/(app)/analysis', params: { barcode: data } });
        }
    };

    if (!permission) {
        return <View style={styles.permissionContainer} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Feather name="camera-off" size={40} color="#5D5C5B" />
                <Text style={styles.permissionText}>We need your permission to show the camera</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isFocused && (
                <CameraView
                    onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                    style={StyleSheet.absoluteFillObject}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr", "ean13", "upc_a", "upc_e"],
                    }}
                />
            )}
            
            {/* Dark overlay to create a "window" effect */}
            <View style={[StyleSheet.absoluteFill, styles.overlay]} />
            
            {/* Header with back button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/(app)/explore')} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Viewfinder in the center */}
            <View style={styles.centerContent}>
                <Text style={styles.instructions}>Center a product barcode inside the frame</Text>
                <View style={styles.viewfinder}>
                    <View style={[styles.corner, styles.cornerTopLeft]} />
                    <View style={[styles.corner, styles.cornerTopRight]} />
                    <View style={[styles.corner, styles.cornerBottomLeft]} />
                    <View style={[styles.corner, styles.cornerBottomRight]} />
                    <Animated.View style={[styles.scanLine, animatedStyle]} />
                </View>
            </View>
            
            {/* This empty view helps with flexbox centering */}
            <View style={styles.footer} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    overlay: { backgroundColor: 'rgba(0,0,0,0.6)' },
    header: {
        height: hp(15),
        justifyContent: 'center',
        paddingTop: hp(5),
    },
    backButton: {
        marginLeft: wp(5),
        padding: 10,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        height: hp(15),
    },
    instructions: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'semibold',
        textAlign: 'center',
        marginBottom: 28,
    },
    viewfinder: {
        width: wp(85),
        height: hp(30),
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    corner: {
        width: 40,
        height: 40,
        borderColor: 'white',
        borderWidth: 5,
        position: 'absolute',
    },
    cornerTopLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    cornerTopRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    cornerBottomLeft: {
        bottom: 0,
        left: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },
    cornerBottomRight: {
        bottom: 0,
        right: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },
    scanLine: {
        width: '100%',
        height: 2,
        backgroundColor: '#FA7268',
        position: 'absolute',
        top: 0,
        shadowColor: '#FA7268',
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 5,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F0E6',
        padding: wp(10)
    },
    permissionText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#5D5C5B',
        marginTop: 16,
        marginBottom: 24
    },
    permissionButton: {
        backgroundColor: '#FA7268',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    permissionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

