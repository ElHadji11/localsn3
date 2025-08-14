import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { usePasswordReset } from '@/hooks/usePasswordReset';

export default function ResetPasswordScreen() {
    const { isLoaded, isLoading, resetPassword } = usePasswordReset();
    const params = useLocalSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleResetPassword = async () => {
        await resetPassword(params.code as string, password, confirmPassword);
        router.replace('/(tabs)')
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
                        <Text className="text-3xl font-bold text-gray-900 mb-2">Set New Password</Text>
                        <Text className="text-gray-600 text-base">
                            Enter your new password below
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-4">
                        <View>
                            <Text className="text-gray-700 font-medium mb-2">New Password</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                                placeholder="Enter your new password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoCapitalize="none"
                            />
                        </View>

                        <View>
                            <Text className="text-gray-700 font-medium mb-2">Confirm Password</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                autoCapitalize="none"
                            />
                        </View>

                        <TouchableOpacity
                            className="bg-blue-600 rounded-lg py-4 mt-6"
                            onPress={handleResetPassword}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white text-center font-semibold text-base">
                                    Reset Password
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Back to Sign In */}
                    <View className="mt-8 flex-row justify-center">
                        <Text className="text-gray-600">Remember your password? </Text>
                        <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
                            <Text className="text-blue-600 font-medium">Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}