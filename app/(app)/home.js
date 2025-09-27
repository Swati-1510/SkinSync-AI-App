import { View, Text, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { generateDynamicRoutineFromAI, getAiCoachTip } from '../../utils/aiService';
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import Card from '../../components/Card';
import GlassFullIcon from '../../assets/icons/FullGlass.svg';
import GlassEmptyIcon from '../../assets/icons/EmptyGlass.svg';
import { getTodaysLog, updateTodaysLog } from '../../utils/firestore';

// Your Icon components...
const WaterDropIcon = () => <Text>💧</Text>;
const SparkleIcon = () => <Text>✨</Text>;
const SunIcon = () => <Text>☀️</Text>;
const BottleIcon = () => <Text>🧴</Text>;
const MinusIcon = () => <Text className="text-muted-khaki font-bold">-</Text>;
const PlusIcon = () => <Text className="text-muted-khaki font-bold">+</Text>;

const RoutineIcon = ({ stepTitle }) => {
  if (stepTitle === 'Cleanse') return <WaterDropIcon />;
  if (stepTitle === 'Treat') return <SparkleIcon />;
  if (stepTitle === 'Moisturize') return <BottleIcon />;
  if (stepTitle === 'Protect') return <SunIcon />;
  return <SparkleIcon />;
};


export default function Home() {
  const { user, logout, routine, updateUserRoutine } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('AM');
  const [dailyLog, setDailyLog] = useState({ waterIntake: 0, hoursSlept: 7.5 });
  const [isLoadingRoutine, setIsLoadingRoutine] = useState(true); // For a loading message
  const [aiTip, setAiTip] = useState("Loading your daily tip...");


  // Add this entire block back into your Home component

  const handleWaterChange = (newIntake) => {
    const updatedIntake = Math.max(0, Math.min(8, newIntake));
    setDailyLog(prev => ({ ...prev, waterIntake: updatedIntake }));
    if (user?.uid) {
      updateTodaysLog(user.uid, { waterIntake: updatedIntake });
    }
  };

  const handleSleepChange = (changeAmount) => {
    setDailyLog(prevState => {
      const currentHours = Number(prevState.hoursSlept) || 0;
            let newHours = currentHours + changeAmount;
      newHours = Math.max(0, newHours); // Don't allow negative hours
      if (user?.uid) {
        updateTodaysLog(user.uid, { hoursSlept: newHours });
      }
      return { ...prevState, hoursSlept: newHours };
    });
  };

  // --- FETCH AI ROUTINE useEffect (Corrected) ---
  useEffect(() => {
    const fetchRoutine = async () => {
      if (user?.skinProfile && Object.keys(user.skinProfile).length > 0) {
        setIsLoadingRoutine(true); // Start loading
        try {
          console.log("--- 1. HOME: Preparing to call the AI with this profile: ---", user.skinProfile);
          const aiRoutine = await generateDynamicRoutineFromAI(user.skinProfile);

          console.log("--- 4. HOME: AI routine received successfully! ---", aiRoutine);
          updateUserRoutine(aiRoutine);

        } catch (error) {
          console.error("--- 4. HOME: ERROR receiving routine from AI! ---", error);
          // Optional: You could set an error message in the state to show the user
        } finally {
          setIsLoadingRoutine(false); // Stop loading, whether it succeeded or failed
        }
      } else {
        setIsLoadingRoutine(false); // No profile, so not loading
      }
    };
    fetchRoutine();
  }, [user]);// Re-run when user data is available

  useEffect(() => {
    const fetchAiTip = async () => {
      if (user?.skinProfile) {
        try {
          const tip = await getAiCoachTip(user.skinProfile);
          setAiTip(tip);
        } catch (error) {
          console.error("Failed to get AI tip:", error);
          setAiTip("Remember to stay hydrated and wear SPF!"); // Fallback
        }
      }
    };
    fetchAiTip();
  }, [user]);

  // --- FETCH DAILY LOG useEffect (No changes needed, this is good) ---
  useEffect(() => {
    const fetchLog = async () => {
      if (user?.uid) {
        const logDataFromDB = await getTodaysLog(user.uid);
        const defaultLog = { waterIntake: 0, hoursSlept: 7.5 };
        setDailyLog({ ...defaultLog, ...logDataFromDB });
      }
    };
    fetchLog();
  }, [user]);

  return (
    <ScrollView
      className="flex-1 bg-app-bg"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: hp(10), paddingTop: hp(8), paddingHorizontal: wp(5) }}>

      <StatusBar style='dark' />

      {/* --- 1. The Greeting --- */}
      <View className="mb-8 flex-row">
        <Text
          style={{ fontSize: hp(3) }}
          className="font-nunito-sans-bold text-dark-olive-green flex-1" // Add flex-1 here
          numberOfLines={2} // Allows the text to wrap to a second line if needed
        >
          Great Morning, {user?.username || 'Guest'} 😊
        </Text>
      </View>

      {/* --- 2. "Your Routine for Today" Card --- */}
      <Card>
        {/* Card Header: Title and AM/PM Toggle */}
        <View className="flex-row justify-between items-center mb-4">
          <Text style={{ fontSize: hp(2.2) }} className="font-nunito-sans-bold text-dark-olive-green">
            Your Routine for Today
          </Text>
          <View className="flex-row bg-white border border-muted-khaki rounded-full p-[1px]">
            <TouchableOpacity
              onPress={() => setActiveTab('AM')}
              className={activeTab === 'AM' ? "bg-primary rounded-full py-1 px-2" : "py-1 px-3"}
            >
              <Text className={activeTab === 'AM' ? "text-white font-bold text-xs" : "text-muted-khaki font-bold text-xs"}>AM</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('PM')}
              className={activeTab === 'PM' ? "bg-primary rounded-full py-1 px-2" : "py-1 px-3"}
            >
              <Text className={activeTab === 'PM' ? "text-white font-bold text-xs" : "text-muted-khaki font-bold text-xs"}>PM</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Routine List */}
        <View className="gap-y-3">
          {isLoadingRoutine ? (
            <Text className="text-center text-sage">Generating your AI routine...</Text>
          ) : (
            // Use optional chaining for safety
            (activeTab === 'AM' ? routine?.am : routine?.pm)?.map((item, index) => (
              // --- FIX 1: Use a safer, more unique key ---
              <View key={`${activeTab}-${item.productName}-${index}`} className="flex-row items-center gap-x-3">
                <RoutineIcon stepTitle={item.title} />
                {/* --- FIX 2: Use item.productName from the AI's response --- */}
                <Text className="text-muted-khaki text-base flex-1">
                  {item.step}. {item.title}: {item.productName}
                </Text>
              </View>
            ))
          )}
        </View>
      </Card>

      {/* --- 3. "Start My AM Routine" Button --- */}
      <TouchableOpacity
        onPress={() => router.push('/(app)/routine')} // Added navigation
        style={{ height: hp(7) }}
        className="bg-primary rounded-full justify-center items-center my-5">

        <Text style={{ fontSize: hp(2) }} className="text-white font-bold tracking-wider">
          Start My AM Routine →
        </Text>

      </TouchableOpacity>

      {/* --- 4. "AI Coach Tip" Card --- */}
      {/* --- 4. "AI Coach Tip" Card --- */}
      <Card>
        <View className="flex-row items-center justify-center gap-x-2 mb-2">
          <SparkleIcon />
          <Text style={{ fontSize: hp(2.5) }} className="font-nunito-sans-bold text-dark-olive-green">AI Coach Tip</Text>
        </View>
        <Text style={{ fontSize: hp(1.8) }} className="text-muted-khaki leading-6 text-center">
          "{aiTip}"
        </Text>
      </Card>

      {/* --- 5. "Daily Check-in" Card --- */}
      <Card style={{ marginTop: hp(2.5) }}>
        <Text style={{ fontSize: hp(2.5) }} className="font-nunito-sans-bold text-dark-olive-green text-center mb-4">
          Daily Check-in
        </Text>

        {/* Water Intake Row */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-muted-khaki text-base">Water Intake:</Text>
          <View className="flex-col items-end">
            <View className="flex-row gap-x-1 items-center">
              {[...Array(8)].map((_, index) => (
                <TouchableOpacity key={index} onPress={() => handleWaterChange(index + 1)}>
                  {index < dailyLog.waterIntake ? (
                    <GlassFullIcon width={hp(3)} height={hp(3)} />
                  ) : (
                    <GlassEmptyIcon width={hp(3)} height={hp(3)} />
                  )}
                </TouchableOpacity>
              ))}

            </View>

            <Text className="text-muted-khaki text-xs ml-1 ">
              {dailyLog.waterIntake}/8 glasses
            </Text>
          </View>
        </View>

        {/* Hours Slept Row */}
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-muted-khaki text-base">Hours Slept:</Text>
          <View className="flex-row gap-x-4 items-center">
            <TouchableOpacity onPress={() => handleSleepChange(- 0.5)} className="border border-muted-khaki w-8 h-8 rounded-full justify-center items-center">
              <MinusIcon />
            </TouchableOpacity>
            <Text className="text-muted-khaki text-lg font-nunito-sans-semibold">{dailyLog.hoursSlept} hrs</Text>
            <TouchableOpacity onPress={() => handleSleepChange(0.5)} className="border border-muted-khaki w-8 h-8 rounded-full justify-center items-center">
              <PlusIcon />
            </TouchableOpacity>
          </View>
        </View>

        {/* Journal Button */}
        <TouchableOpacity onPress={() => router.push('/(app)/progress')} className="border border-muted-khaki rounded-full py-3 items-center">
          <Text className="text-muted-khaki font-nunito-sans-bold">+ Add a Note to Your Journal</Text>
        </TouchableOpacity>
      </Card>


      {/* --- 6. "From the Glow Circle" Card --- */}
      <Card style={{ marginTop: hp(2.5) }}>
        <Text style={{ fontSize: hp(2.5) }} className="font-nunito-sans-bold text-dark-olive-green mb-4">
          From the Glow Circle
        </Text>
        {/* Top-Rated Review */}
        <View>
          <Text className="font-nunito-sans-bold text-dark-olive-green mb-1">A Top-Rated Review:</Text>
          <Text className="text-muted-khaki leading-6">
            Users with Oily, Acne-Prone skin are loving the Cosrx Snail Mucin Essence.
            <Text className="text-primary font-nunito-sans-bold"> See why...</Text>
          </Text>
        </View>
        {/* Shared Routine */}
        <View className="mt-4">
          <Text className="font-nunito-sans-bold text-dark-olive-green mb-1">A Shared Routine:</Text>
          <Text className="text-muted-khaki leading-6">
            Alen just shared their routine for achieving &apos;Glass Skin&apos;.
            <Text className="text-primary font-nunito-sans-bold"> Take a look!</Text>
          </Text>
        </View>
      </Card>

      {/* --- 7. Sign Out Button (for testing) --- */}
      <TouchableOpacity onPress={logout} className="mt-8">
        <Text className="text-center text-primary font-bold">Sign Out</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

