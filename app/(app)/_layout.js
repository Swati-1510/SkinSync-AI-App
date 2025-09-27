import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useAuth } from '../../context/authContext';

import HomeSolidIcon from '../../assets/icons/home-solid.svg'; 
import HomeOutlineIcon from '../../assets/icons/HomeIcon.svg'; 
import RoutineSolidIcon from '../../assets/icons/routine-solid.svg';
import RoutineOutlineIcon from '../../assets/icons/RoutineIcon.svg';
import ExploreSolidIcon from '../../assets/icons/explore-solid.svg';
import ExploreOutlineIcon from '../../assets/icons/ExploreIcon.svg';
import ProgressSolidIcon from '../../assets/icons/progress-solid.svg';
import ProgressOutlineIcon from '../../assets/icons/ProgressIcon.svg';
import ProfileSolidIcon from '../../assets/icons/profile-solid.svg';
import ProfileOutlineIcon from '../../assets/icons/ProfileIcon.svg';

const colors = {
    primary: '#FA7268',    // Living Coral
    lightCoral: '#FECECE', // The fill color
    sage: '#B2AC88',       // Sage
};

export default function AppLayout() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
        // We only run this check if we have the user's data loaded from Firestore.
        if (user?.username) { 
            if (!user.skinProfile || Object.keys(user.skinProfile).length === 0) {
                // User is inside the app but has no profile, send them to the quiz.
                router.replace('/(app)/quiz');
            }
        }
    }, [user]);
  return (
    <Tabs
      screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: colors.sage,
                    height: 90,
                    paddingBottom: 10,
                    paddingTop: 5,
                },
                tabBarLabelStyle: {
                    fontFamily: 'NunitoSans_700Bold',
                    fontSize: 12,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.sage,
            }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => 
            focused ? 
            <HomeSolidIcon stroke={colors.primary} fill={colors.lightCoral} width={28} height={28} /> : 
            <HomeOutlineIcon stroke={colors.sage} width={28} height={28} />,
        }}
      />

      {/* Routine Tab */}
      <Tabs.Screen
        name="routine"
        options={{
          title: 'Routine',
          tabBarIcon: ({ focused }) => 
            focused ? 
            <RoutineSolidIcon stroke={colors.primary} fill={colors.lightCoral} width={28} height={28} /> : 
            <RoutineOutlineIcon stroke={colors.sage} width={28} height={28} />,
        }}
      />
      
      {/* Explore Tab */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => 
            focused ? 
            <ExploreSolidIcon stroke={colors.primary} fill={colors.lightCoral} width={28} height={28} /> : 
            <ExploreOutlineIcon stroke={colors.sage} width={28} height={28} />,
        }}
      />
      
      {/* Progress Tab */}
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ focused }) => 
            focused ? 
            <ProgressSolidIcon stroke={colors.primary} fill={colors.lightCoral} width={28} height={28} /> : 
            <ProgressOutlineIcon stroke={colors.sage} width={28} height={28} />,
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => 
            focused ? 
            <ProfileSolidIcon stroke={colors.primary} fill={colors.lightCoral} width={28} height={28} /> : 
            <ProfileOutlineIcon stroke={colors.sage} width={28} height={28} />,
        }}
      />

       {/* Quiz Screen (Hidden) */}
       <Tabs.Screen name="quiz" options={{ href: null }} />
    </Tabs>
  );
}