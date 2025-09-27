
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card'; // Assuming Card component exists

// --- Dummy Data for UI ---
const photoData = [
    { id: 1, date: 'October 26, 2023', uri: 'https://via.placeholder.com/300' },
    { id: 2, date: 'October 24, 2023', uri: 'https://via.placeholder.com/300' },
    { id: 3, date: 'October 22, 2023', uri: 'https://via.placeholder.com/300' },
    { id: 4, date: 'October 20, 2023', uri: 'https://via.placeholder.com/300' },
];

const journalData = {
    'October 25, 2023': 'Skin felt a bit less red today after trying the new serum. Still some dryness on my cheeks, but the forehead is clear.',
    'October 23, 2023': 'Ate a lot of sugary food yesterday and woke up with a new pimple. I need to track my diet more closely.',
};

const ProgressPage = () => {
    const [activeTab, setActiveTab] = useState('Photos');
    const [lifestylePeriod, setLifestylePeriod] = useState('Weekly');

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
            <TouchableOpacity style={{ height: hp(6.5) }} className="bg-primary rounded-full items-center justify-center my-6 mx-4">
                <Text style={{ fontSize: 16 }} className="text-white font-nunito-sans-bold">[ + ] Add Today's Photo</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={{ paddingHorizontal: wp(4) }}>
                <View className="flex-row flex-wrap justify-between">
                    {photoData.map(photo => (
                        <TouchableOpacity key={photo.id} style={{ width: wp(44), marginBottom: wp(4) }} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <Image source={{ uri: photo.uri }} style={{ height: hp(20) }} />
                            <View className="p-3">
                                <Text style={{ fontSize: 14, color: '#B2AC88' }} className="font-nunito-sans-regular">🗓️ {photo.date}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <TouchableOpacity style={{ width: 56, height: 56, bottom: hp(4), right: wp(4) }} className="absolute bg-primary rounded-full items-center justify-center shadow-lg">
                <Text style={{ fontSize: 24, color: 'white' }}>◨</Text>
            </TouchableOpacity>
        </View>
    );

    const renderJournalContent = () => (
        <ScrollView contentContainerStyle={{ paddingHorizontal: wp(4), paddingTop: hp(3) }}>
            {Object.entries(journalData).map(([date, entry]) => (
                <View key={date} className="mb-6">
                    <Text style={{ fontSize: 20, color: '#556B2F' }} className="font-nunito-sans-bold mb-3">{date}</Text>
                    <Card>
                        <Text style={{ fontSize: 16, color: '#556B2F', lineHeight: 24 }} className="font-nunito-sans-regular">{entry}</Text>
                    </Card>
                </View>
            ))}
        </ScrollView>
    );

    const renderLifestyleContent = () => (
        <ScrollView contentContainerStyle={{ paddingHorizontal: wp(4), paddingTop: hp(3) }}>
            <View className="flex-row justify-center mb-6">
                <View className="flex-row bg-white rounded-full border border-sage overflow-hidden">
                    <TouchableOpacity onPress={() => setLifestylePeriod('Weekly')} style={{ backgroundColor: lifestylePeriod === 'Weekly' ? '#B2AC88' : 'transparent' }} className="py-2 px-6">
                        <Text style={{ fontSize: 14, color: lifestylePeriod === 'Weekly' ? 'white' : '#556B2F' }} className="font-nunito-sans-bold">Weekly View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setLifestylePeriod('Monthly')} style={{ backgroundColor: lifestylePeriod === 'Monthly' ? '#B2AC88' : 'transparent' }} className="py-2 px-6">
                        <Text style={{ fontSize: 14, color: lifestylePeriod === 'Monthly' ? 'white' : '#556B2F' }} className="font-nunito-sans-bold">Monthly View</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Card className="mb-6">
                <Text style={{ fontSize: 20, color: '#556B2F' }} className="font-nunito-sans-bold mb-3">💧 Water Intake vs. Reported Hydration</Text>
                <View style={{ height: hp(25), backgroundColor: '#f0f0f0' }} className="items-center justify-center rounded-lg">
                    <Text className="text-sage">[Chart Placeholder]</Text>
                </View>
            </Card>

            <Card>
                <Text style={{ fontSize: 20, color: '#556B2F' }} className="font-nunito-sans-bold mb-3">😴 Sleep vs. Reported Breakouts</Text>
                <View style={{ height: hp(25), backgroundColor: '#f0f0f0' }} className="items-center justify-center rounded-lg">
                    <Text className="text-sage">[Chart Placeholder]</Text>
                </View>
            </Card>
        </ScrollView>
    );

    return (
        <SafeAreaView className="flex-1 bg-app-bg">
            <View className="mt-6 items-center">
                      <Text style={{ fontSize: hp(3) }} className="font-nunito-sans-bold text-dark-olive-green">
                        My Progress
                      </Text>
                    </View>
            

            {renderTabs()}

            <View className="flex-1">
                {activeTab === 'Photos' && renderPhotosContent()}
                {activeTab === 'Journal' && renderJournalContent()}
                {activeTab === 'Lifestyle' && renderLifestyleContent()}
            </View>
        </SafeAreaView>
    );
};

export default ProgressPage;
