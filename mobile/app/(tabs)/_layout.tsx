import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Tabs } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/clerk-expo';
import colors from '@/constants/Colors';

const TabLayout = () => {
    const insets = useSafeAreaInsets();

    const { isSignedIn } = useAuth();
    if (!isSignedIn) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.gray,
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderTopColor: 'gray',
                    height: 50 + insets.bottom,
                    paddingTop: 8
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen name="index" options={{
                title: '',
                tabBarIcon: ({ size, color }) => <Feather name="home" size={size} color={color} />
            }}
            />

            <Tabs.Screen name="messages" options={{
                title: '',
                tabBarIcon: ({ size, color }) => <Feather name="mail" size={size} color={color} />

            }}
            />
            <Tabs.Screen name="notifications" options={{
                title: '',
                tabBarIcon: ({ size, color }) => <Feather name="bell" size={size} color={color} />
            }}
            />
            <Tabs.Screen name="favorites" options={{
                title: '',
                tabBarIcon: ({ size, color }) => <MaterialIcons name="favorite-border" size={size} color="color" />
            }}
            />
            <Tabs.Screen name="profile" options={{
                title: '',
                tabBarIcon: ({ size, color }) => <Feather name="user" size={size} color={color} />
            }}
            />

        </Tabs>
    )
}

export default TabLayout;