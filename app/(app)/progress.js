import { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'; 
import { db } from '../../firebaseConfig'; 
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card';
import JournalEntryModal from '../../components/JournalEntryModal';
import { getJournalEntriesFromDB, saveJournalEntry, fetchLifestyleData } from '../../utils/firestore'; 
import LineChartCard from '../../components/LineChartCard';
import * as ImagePicker from 'expo-image-picker';
import { uploadPhoto } from '../../utils/storageService'; 

// --- TEMPORARY FIX for Metro bundler bug ---
const _query = query;
const _collection = collection;
const _where = where;
const _orderBy = orderBy;


// --- END OF TEMPORARY FIX ---


// --- The Main Component ---
const ProgressPage = () => {
    // --- State Variables ---
    const { user } = useAuth();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [journalEntries, setJournalEntries] = useState([]); // This will hold the live data
    const [activeTab, setActiveTab] = useState('Journal'); // Default to Journal for the first test
    const [lifestylePeriod, setLifestylePeriod] = useState('Weekly');
    const [chartData, setChartData] = useState({ dates: [], water: [], sleep: [] });
    const primaryColor = (opacity = 1) => `rgba(250, 114, 104, ${opacity})`; // Living Coral
    const waterColor = (opacity = 1) => `rgba(66, 133, 244, ${opacity})`; // A blue color for water
    const [photoEntries, setPhotoEntries] = useState([]); // State for live photo data
    const [isUploading, setIsUploading] = useState(false); // State for loading indicator
    
    const fetchPhotoEntries = async () => {
    if (!user?.uid) return;
    try {
        const q = _query(
            _collection(db, "progressPhotos"),
            _where("userId", "==", user.uid),
            _orderBy("createdAt", "desc") // Sort by the creation time
        );
        const querySnapshot = await getDocs(q);

        const entries = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                // Use the Firebase Timestamp to format the date
                date: data.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                uri: data.url, // The public download URL
            };
        });
        setPhotoEntries(entries);
    } catch (e) {
        console.error("Error fetching photos:", e);
    }
};

// Use a useEffect to load the photos when the user is available
useEffect(() => {
    if (user?.uid) {
        fetchPhotoEntries();
    }
}, [user]);

const handleAddPhoto = async () => {
    // 1. Check/request media library permissions
     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); 
     if (status !== 'granted') {
        alert('Permission to access media library is required for photo upload!');
        return;
    }

    // 2. Open the image picker/camera roll
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
    });

    if (result.canceled) return; // User cancelled the selection
    
    const localUri = result.assets[0].uri;
    const newPhoto = {
        id: Date.now().toString(), // Unique ID
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // e.g., Oct 03
        uri: localUri, // The local file path
    };

    setPhotoEntries(prevPhotos => [newPhoto, ...prevPhotos]);

    console.log("Photo added locally. Storage upload skipped (Free Tier Model).");

    
};

    // --- Data Loading Logic ---
    // Function to fetch journal entries from the database
    const loadJournalData = async () => {
        if (!user?.uid) return;
        try {
            // Call the imported service function to get the data
            const entries = await getJournalEntriesFromDB(user.uid);
            setJournalEntries(entries);
        } catch (e) {
            console.error("Error fetching journal entries:", e);
            setJournalEntries([]); // Set to empty array on failure
        }
    };

    // useEffect to run the fetch on load/user change
    useEffect(() => {
        if (user?.uid) {
            loadJournalData();
        }
    }, [user]);

    // --- Modal Handler (The bridge between UI and DB Save) ---
    const handleSaveNote = async (noteContent) => {
        try {
            // 1. Save the note to Firestore (using the imported function)
            await saveJournalEntry(user.uid, noteContent);

            // 2. Refresh the list from the database to update the UI
            await loadJournalData();

            console.log("Journal saved and list refreshed!");

        } catch (e) {
            console.error("Failed to save and refresh journal:", e);
            alert("Failed to save entry. Check your internet or Firestore rules.");
        }
    };

    // --- FIX: useEffect to fetch Lifestyle Data when period changes ---
    useEffect(() => {
        if (user?.uid) {
            // Call the imported service function, passing the user ID and the period
            fetchLifestyleData(user.uid, lifestylePeriod) 
                .then(data => {
                    setChartData(data); // Assume data is { dates: [...], water: [...], sleep: [...] }
                })
                .catch(e => {
                    console.error("Error fetching lifestyle data:", e);
                    setChartData({ dates: [], water: [], sleep: [] });
                });
        }
    }, [user, lifestylePeriod]); // Run when user or period changes


    // ====================================================================
    // --- RENDER FUNCTION DEFINITIONS ---
    // ====================================================================

    const renderTabs = () => (
        <View style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(178, 172, 136, 0.2)' }} className="flex-row justify-around mt-6">
            {['Photos', 'Journal', 'Lifestyle'].map(tab => (
                <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} className="items-center">
                    <Text style={{ fontSize: 16, color: activeTab === tab ? '#FA7268' : '#B2AC88' }} className="font-nunito-sans-bold">
                        {tab}
                    </Text>
                    {activeTab === tab && (
                        <View style={{ height: 3, backgroundColor: '#FA7268', marginTop: 8, width: '100%' }} />
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderPhotosContent = () => (
    <View className="flex-1">
        <TouchableOpacity 
            onPress={handleAddPhoto} 
            style={{ height: hp(6.5) }} 
            className="bg-primary rounded-full items-center justify-center my-6 mx-4"
        >
            <Text style={{ fontSize: 16 }} className="text-white font-nunito-sans-bold">[ + ] Add Today's Photo</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={{ paddingHorizontal: wp(4) }}>
            <View className="flex-row flex-wrap justify-between">
                {/* --- MAP OVER LIVE LOCAL PHOTO DATA --- */}
                {photoEntries.map(photo => (
                    <TouchableOpacity key={photo.id} style={{ width: wp(44), marginBottom: wp(4) }} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <Image source={{ uri: photo.uri }} style={{ height: hp(20) }} />
                        <View className="p-3">
                            <Text style={{ fontSize: 14, color: '#B2AC88' }} className="font-nunito-sans-regular">🗓️ {photo.date}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
                {/* Show a placeholder message if the list is empty */}
                {photoEntries.length === 0 && (
                    <Text className="text-sage mt-10 w-full text-center">Tap the button above to add your first progress photo!</Text>
                )}
            </View>
        </ScrollView>

        {/* The Compare FAB button (static, no logic change) */}
        <TouchableOpacity style={{ width: 56, height: 56, bottom: hp(4), right: wp(4) }} className="absolute bg-primary rounded-full items-center justify-center shadow-lg">
            <Text style={{ fontSize: 24, color: 'white' }}>◨</Text>
        </TouchableOpacity>
    </View>
);

    const renderJournalContent = () => (
        <ScrollView contentContainerStyle={{ paddingHorizontal: wp(4), paddingTop: hp(3), paddingBottom: hp(10) }}>
            {journalEntries.map((item) => (
                <View key={item.id} className="mb-6">
                    {/* The date is now a property of the item, converted to string */}
                    <Text style={{ fontSize: 20, color: '#556B2F' }} className="font-nunito-sans-bold mb-3">🗓️ {item.date}</Text>
                    <Card>
                        {/* The entry is now a property of the item, converted to string */}
                        <Text style={{ fontSize: 16, color: '#556B2F', lineHeight: 24 }} className="font-nunito-sans-regular">{String(item.entry)}</Text>
                    </Card>
                </View>
            ))}

            {/* Show message if no entries exist */}
            {journalEntries.length === 0 && (
                <Text className="text-center text-sage mt-10">No journal entries yet. Tap below to add your first note!</Text>
            )}

            {/* ADD A JOURNAL ENTRY BUTTON */}
            <TouchableOpacity onPress={() => setIsModalVisible(true)} style={{ height: 50 }} className="bg-primary rounded-full items-center justify-center mt-6">
                <Text className="text-white font-bold">Add New Entry</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    const renderLifestyleContent = () => (
        <ScrollView contentContainerStyle={{ paddingHorizontal: wp(4), paddingTop: hp(3), paddingBottom: hp(10) }}>

            {/* --- Toggle Buttons (Connecting the Logic) --- */}
            <View className="flex-row justify-center mb-6">
                <View className="flex-row bg-white rounded-full border border-sage overflow-hidden">

                    {/* Weekly View Button */}
                    <TouchableOpacity
                        onPress={() => setLifestylePeriod('Weekly')}
                        style={{ backgroundColor: lifestylePeriod === 'Weekly' ? '#FA7268' : 'transparent' }}
                        className="py-2 px-6 border-r border-sage"
                    >
                        <Text style={{ fontSize: 14, color: lifestylePeriod === 'Weekly' ? 'white' : '#556B2F' }} className="font-nunito-sans-bold">Weekly View</Text>
                    </TouchableOpacity>

                    {/* Monthly View Button */}
                    <TouchableOpacity
                        onPress={() => setLifestylePeriod('Monthly')}
                        style={{ backgroundColor: lifestylePeriod === 'Monthly' ? '#FA7268' : 'transparent' }}
                        className="py-2 px-6"
                    >
                        <Text style={{ fontSize: 14, color: lifestylePeriod === 'Monthly' ? 'white' : '#556B2F' }} className="font-nunito-sans-bold">Monthly View</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* --- 1. Water Intake Chart Card (Displaying Data) --- */}
            <LineChartCard
                title={`💧 Water Intake (${lifestylePeriod})`}
                labels={chartData.dates}
                data={chartData.water}
                chartColor={waterColor}
                style={{ marginBottom: 20 }} // Add a consistent margin to separate the cards
            />

            {/* --- 2. Sleep Chart Card (Displaying Data) --- */}

            <LineChartCard
                title={`😴 Sleep vs. Reported Breakouts (${lifestylePeriod})`}
                labels={chartData.dates}
                data={chartData.sleep}
                chartColor={primaryColor} // Use Living Coral for the sleep line
            />


        </ScrollView>
    );


    // ====================================================================
    // --- MAIN RENDER BLOCK ---
    // ====================================================================
    return (
        <SafeAreaView className="flex-1 bg-app-bg">
            <View style={{ paddingTop: hp(4) }} className="items-center">
                <Text style={{ fontSize: hp(3) }} className="font-nunito-sans-bold text-dark-olive-green">My Progress</Text>
            </View>


            {renderTabs()}

            <View className="flex-1">
                {activeTab === 'Photos' && renderPhotosContent()}
                {activeTab === 'Journal' && renderJournalContent()}
                {activeTab === 'Lifestyle' && renderLifestyleContent()}
            </View>


            <JournalEntryModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)} // Function to close the modal
                onSave={handleSaveNote} // Function to call when the save button is pressed
            />
        </SafeAreaView>
    );
};

export default ProgressPage;