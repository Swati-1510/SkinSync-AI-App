import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react'; 0
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CheckCircleIcon } from 'react-native-heroicons/solid';

// Placeholder icons
const WaterDropIcon = () => <Text>💧</Text>;
const SparkleIcon = () => <Text>✨</Text>;
const SunIcon = () => <Text>☀️</Text>;
const BottleIcon = () => <Text>🧴</Text>;

const RoutineIcon = ({ stepTitle }) => {
  if (stepTitle === 'Cleanse') return <WaterDropIcon />;
  if (stepTitle === 'Treat') return <SparkleIcon />;
  if (stepTitle === 'Moisturize') return <BottleIcon />;
  if (stepTitle === 'Protect') return <SunIcon />;
  return <SparkleIcon />;
};

export default function RoutineStepCard({ data, isChecked, onToggle }) {
    const { step, title, productName, tip } = data;


  return (
    <View
      className="bg-white rounded-2xl shadow-sm p-4"
      style={{ opacity: isChecked ? 0.5 : 1 }}
    >
      {/* Top part of the card */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-sage font-nunito-sans-bold text-sm">Step {step}: {title}</Text>

        {/* --- CHANGE: The onPress now calls the 'onToggle' prop from the parent --- */}
        <TouchableOpacity onPress={onToggle}>
          {isChecked ? ( // It now uses the 'isChecked' prop
            <CheckCircleIcon color="#FA7268" size={hp(4)} />
          ) : (
            <View
              style={{ width: hp(4), height: hp(4) }}
              className="rounded-full border-2 border-sage"
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Divider Line */}
      <View className="h-[1px] bg-gray-200 mb-4" />

      {/* Main Content: Product Info */}
      <View className="flex-row items-center gap-x-4">
        {/* Placeholder for Product Image */}
        <View className="w-16 h-16 bg-gray-100 rounded-lg justify-center items-center">
          <RoutineIcon stepTitle={title} />
        </View>

        {/* Text Block */}
        <View className="flex-1">
          <Text
            className="font-nunito-sans-bold text-dark-olive-green text-base"
            style={{ fontSize: hp(2) }}
          >
            {productName || title}
          </Text>
          {tip && (
            <Text className="text-sage text-sm mt-1" style={{ fontSize: hp(1.6) }}>
              ✨ {tip}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}