import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';

import RoutineStepCard from '../../components/RoutineStepCard'; // Adjust path if needed

export default function Routine() {
  const { user, routine } = useAuth();
  const [activeTab, setActiveTab] = useState('AM');
  const [completedAmSteps, setCompletedAmSteps] = useState([]);
  const [completedPmSteps, setCompletedPmSteps] = useState([]);


  const handleToggleStep = (title) => {
    if (activeTab === 'AM') {
      // Logic for the AM routine
      if (completedAmSteps.includes(title)) {
        setCompletedAmSteps(completedAmSteps.filter(id => id !== title));
      } else {
        setCompletedAmSteps([...completedAmSteps, title]);
      }
    } else {
      // Logic for the PM routine
      if (completedPmSteps.includes(title)) {
        setCompletedPmSteps(completedPmSteps.filter(id => id !== title));
      } else {
        setCompletedPmSteps([...completedPmSteps, title]);
      }
    }
  };
  // --- This is the one and only place this variable should be defined ---
  const currentRoutineSteps = activeTab === 'AM' ? routine?.am || [] : routine?.pm || [];

  const isAllStepsCompleted = currentRoutineSteps.length > 0 &&
    (activeTab === 'AM'
      ? currentRoutineSteps.every(step => completedAmSteps.includes(step.title))
      : currentRoutineSteps.every(step => completedPmSteps.includes(step.title))
    );
  console.log("Is Routine Complete?", isAllStepsCompleted);


  return (
    <View className="flex-1 bg-app-bg">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(10), paddingTop: hp(8), paddingHorizontal: wp(5) }}
      >
        {/* --- Header --- */}
        <View className="mb-8 items-center">
          <Text style={{ fontSize: hp(3) }} className="font-nunito-sans-bold text-dark-olive-green">
            My Routine
          </Text>
        </View>

        {/* --- AM/PM Toggle --- */}
        <View className="flex-row justify-center mb-8">
          <View className="flex-row bg-white border border-muted-khaki rounded-full p-[1px]">
            <TouchableOpacity
              onPress={() => setActiveTab('AM')}
              className={activeTab === 'AM' ? "bg-primary rounded-full py-2 px-6" : "py-2 px-6"}
            >
              <Text className={activeTab === 'AM' ? "text-white font-bold" : "text-muted-khaki font-bold"}>☀️ AM</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('PM')}
              className={activeTab === 'PM' ? "bg-primary rounded-full py-2 px-6" : "py-2 px-6"}
            >
              <Text className={activeTab === 'PM' ? "text-white font-bold" : "text-muted-khaki font-bold"}>🌙 PM</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Routine Steps List --- */}
        <View className="gap-y-4">
          {/* --- THIS IS THE NEW LOGIC --- */}
          {!routine ? (
            // If the entire routine object is null, it's still.
            <Text className="text-center text-sage">Fetching your AI routine...</Text>
          ) : currentRoutineSteps.length > 0 ? (
            // If the routine exists and has steps, map over them
            currentRoutineSteps.map((stepData, index) => (
              <RoutineStepCard
                key={`${activeTab}-${stepData.title}-${index}`}
                data={stepData}
                isChecked={
                  activeTab === 'AM'
                    ? completedAmSteps.includes(stepData.title)
                    : completedPmSteps.includes(stepData.title)
                }
                onToggle={() => handleToggleStep(stepData.title)}
              />
            ))
          ) : (
            // If the routine exists but is empty (e.g., an AI error)
            <Text className="text-center text-sage">No routine steps found for today.</Text>
          )}
        </View>

        {/* Conditionally render the "All Done!" card */}
        {isAllStepsCompleted && (
          <View className="bg-tea-green rounded-2xl p-6 items-center mt-8 border border-dark-olive-green/20">
            <Text style={{ fontSize: hp(5) }}>🏆</Text>
            <Text style={{ fontSize: hp(2.5) }} className="font-nunito-sans-bold text-dark-olive-green mt-4">
              All Done! Your skin thanks you.
            </Text>
            <Text style={{ fontSize: hp(1.8) }} className="text-dark-olive-green mt-2">
              Consistency is key. See you {activeTab === 'AM' ? 'tonight' : 'in the morning'}!
            </Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
}