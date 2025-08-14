import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { router } from 'expo-router';

export default function SignInScreen() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!signIn) {
            Alert.alert('Error', 'Sign in is not available');
            return;
        }

        setIsLoading(true);
        try {
            const result = await signIn.create({
                identifier: email,
                password,
            });

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
            } else {
                Alert.alert('Error', 'Sign in failed. Please try again.');
            }
        } catch (err: any) {
            console.error('Sign in error:', err);
            Alert.alert('Error', err.errors?.[0]?.message || 'Sign in failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isLoaded) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
                <View className="flex-1 px-8 justify-center">
                    {/* Header */}
                    <View className="mb-8">
                        <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome back</Text>
                        <Text className="text-gray-600 text-base">Sign in to your account</Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-4">
                        <View>
                            <Text className="text-gray-700 font-medium mb-2">Email</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View>
                            <Text className="text-gray-700 font-medium mb-2">Password</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoCapitalize="none"
                            />
                        </View>

                        <TouchableOpacity
                            className="bg-blue-600 rounded-lg py-4 mt-6"
                            onPress={handleSignIn}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white text-center font-semibold text-base">
                                    Sign In
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity className="mt-4">
                        <Text className="text-blue-600 text-center font-medium">
                            Forgot your password?
                        </Text>
                    </TouchableOpacity>

                    {/* Sign Up Link */}
                    <View className="mt-8 flex-row justify-center">
                        <Text className="text-gray-600">Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.replace("/(auth)/sign-up")}>
                            <Text className="text-blue-600 font-medium">Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
