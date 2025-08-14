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
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';

export default function ForgotPasswordScreen() {
    const { signIn, isLoaded } = useSignIn();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSendResetEmail = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        if (!signIn) {
            Alert.alert('Error', 'Password reset is not available');
            return;
        }

        setIsLoading(true);
        try {
            await signIn.create({
                strategy: 'reset_password_email_code',
                identifier: email,
            });

            setIsEmailSent(true);
            Alert.alert(
                'Email Sent',
                'A 6-digit code has been sent to your email address.',
                [{ text: 'OK' }]
            );
        } catch (err: any) {
            console.error('Password reset error:', err);
            // Don't show specific error messages for security reasons
            Alert.alert(
                'Email Sent',
                'A 6-digit code has been sent to your email address.',
                [{ text: 'OK' }]
            );
            setIsEmailSent(true); // Still show as sent for security
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!code || code.length !== 6) {
            Alert.alert('Error', 'Please enter the 6-digit code');
            return;
        }

        if (!signIn) {
            Alert.alert('Error', 'Password reset is not available');
            return;
        }

        setIsLoading(true);
        try {
            const result = await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
            });

            if (result.status === 'needs_new_password') {
                setIsCodeVerified(true);
                Alert.alert('Success', 'Code verified! Please enter your new password.');
            } else {
                Alert.alert('Error', 'Invalid code. Please try again.');
            }
        } catch (err: any) {
            console.error('Code verification error:', err);
            Alert.alert('Error', err.errors?.[0]?.message || 'Invalid code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters long');
            return;
        }

        if (!signIn) {
            Alert.alert('Error', 'Password reset is not available');
            return;
        }

        setIsLoading(true);
        try {
            const result = await signIn.resetPassword({
                password: newPassword,
            });

            if (result.status === 'complete') {
                Alert.alert(
                    'Success',
                    'Your password has been reset successfully!',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.replace('/(auth)/sign-in'),
                        },
                    ]
                );
            } else {
                Alert.alert('Error', 'Password reset failed. Please try again.');
            }
        } catch (err: any) {
            console.error('Password reset error:', err);
            Alert.alert('Error', err.errors?.[0]?.message || 'Password reset failed. Please try again.');
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
                        <Text className="text-3xl font-bold text-gray-900 mb-2">Reset Password</Text>
                        <Text className="text-gray-600 text-base">
                            {!isEmailSent
                                ? "Enter your email address and we'll send you a 6-digit code"
                                : !isCodeVerified
                                    ? "Enter the 6-digit code sent to your email"
                                    : "Enter your new password"
                            }
                        </Text>
                    </View>

                    {/* Step 1: Email Input */}
                    {!isEmailSent && (
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

                            <TouchableOpacity
                                className="bg-blue-600 rounded-lg py-4 mt-6"
                                onPress={handleSendResetEmail}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white text-center font-semibold text-base">
                                        Send Reset Code
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Step 2: Code Verification */}
                    {isEmailSent && !isCodeVerified && (
                        <View className="space-y-4">
                            <View>
                                <Text className="text-gray-700 font-medium mb-2">6-Digit Code</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                                    placeholder="Enter 6-digit code"
                                    value={code}
                                    onChangeText={setCode}
                                    keyboardType="numeric"
                                    maxLength={6}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>

                            <TouchableOpacity
                                className="bg-blue-600 rounded-lg py-4 mt-6"
                                onPress={handleVerifyCode}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white text-center font-semibold text-base">
                                        Verify Code
                                    </Text>
                                )}
                            </TouchableOpacity>

                            {/* Resend Code Option */}
                            <TouchableOpacity
                                className="mt-4"
                                onPress={handleSendResetEmail}
                                disabled={isLoading}
                            >
                                <Text className="text-blue-600 text-center font-medium">
                                    Resend Code
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Step 3: New Password */}
                    {isCodeVerified && (
                        <View className="space-y-4">
                            <View>
                                <Text className="text-gray-700 font-medium mb-2">New Password</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                                    placeholder="Enter your new password"
                                    value={newPassword}
                                    onChangeText={setNewPassword}
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
                    )}

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