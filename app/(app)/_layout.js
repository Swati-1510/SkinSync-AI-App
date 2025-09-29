import { Tabs } from 'expo-router';
import React from 'react';

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
    lightCoral: '#FECECE', // The fill colorw
    sage: '#B2AC88',       // Sage
};

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: colors.sage,
          height: 60,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'NunitoSans_700Bold',
          fontSize: 12,
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary, // Set the ACTIVE label color
        tabBarInactiveTintColor: colors.sage, // Set the INACTIVE label color
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

       {/* Quiz Screen (Hidden from tabs, but accessible via router.replace) */}
       <Tabs.Screen name="quiz" options={{ href: null }} />
    </Tabs>
  );
}