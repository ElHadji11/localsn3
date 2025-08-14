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
    Image,
} from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useOAuth } from '@/hooks/useOAuth';

export default function SignUpScreen() {
    const { signUp, setActive, isLoaded } = useSignUp();
    const { isLoading: oauthLoading, handleOAuth } = useOAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [verificationPending, setVerificationPending] = useState(false);

    const handleSignUp = async () => {
        if (!firstName || !lastName || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!signUp) {
            Alert.alert('Error', 'Sign up is not available');
            return;
        }

        setIsLoading(true);
        try {
            const result = await signUp.create({
                firstName,
                lastName,
                emailAddress: email,
                password,
            });

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
            } else if (result.status === 'missing_requirements') {
                // Email verification required
                setVerificationPending(true);
                Alert.alert(
                    'Email Verification Required',
                    'Please check your email and enter the 6-digit verification code below.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // Stay on the sign-up screen to show verification status
                            }
                        }
                    ]
                );
            } else {
                Alert.alert('Error', 'Sign up failed. Please try again.');
            }
        } catch (err: any) {
            console.error('Sign up error:', err);
            Alert.alert('Error', err.errors?.[0]?.message || 'Sign up failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!verificationCode || verificationCode.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit verification code');
            return;
        }

        if (!signUp) {
            Alert.alert('Error', 'Verification is not available');
            return;
        }

        setIsLoading(true);
        try {
            const result = await signUp.attemptEmailAddressVerification({
                code: verificationCode,
            });

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                Alert.alert('Success', 'Email verified successfully!');
            } else {
                Alert.alert('Error', 'Invalid verification code. Please try again.');
            }
        } catch (err: any) {
            console.error('Verification error:', err);
            Alert.alert('Error', err.errors?.[0]?.message || 'Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendVerification = async () => {
        if (!signUp) return;

        try {
            await signUp.prepareEmailAddressVerification();
            Alert.alert('Success', 'Verification code sent again. Please check your inbox.');
        } catch (err: any) {
            Alert.alert('Error', 'Failed to resend verification code. Please try again.');
        }
    };

    if (!isLoaded) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (verificationPending) {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 bg-white"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
                    <View className="flex-1 px-8 justify-center">
                        {/* Header */}
                        <View className="mb-8">
                            <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
                                Verify Your Email
                            </Text>
                            <Text className="text-gray-600 text-base text-center">
                                We've sent a 6-digit code to{' '}
                                <Text className="font-semibold">{email}</Text>
                            </Text>
                        </View>

                        {/* Verification Code Input */}
                        <View className="mb-8">
                            <Text className="text-gray-700 font-medium mb-2 text-center">
                                Enter Verification Code
                            </Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-4 py-3 text-base text-center text-xl font-mono"
                                placeholder="000000"
                                value={verificationCode}
                                onChangeText={setVerificationCode}
                                keyboardType="number-pad"
                                maxLength={6}
                                autoFocus
                            />
                        </View>

                        {/* Verify Button */}
                        <TouchableOpacity
                            className="bg-blue-600 rounded-lg py-4 mb-6"
                            onPress={handleVerifyCode}
                            disabled={isLoading || verificationCode.length !== 6}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white text-center font-semibold text-base">
                                    Verify Email
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Action Buttons */}
                        <View className="space-y-3">
                            <TouchableOpacity
                                className="bg-gray-100 rounded-lg py-3 px-6"
                                onPress={handleResendVerification}
                                disabled={isLoading}
                            >
                                <Text className="text-gray-700 text-center font-medium text-base">
                                    Resend Verification Code
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="bg-transparent rounded-lg py-3 px-6"
                                onPress={() => {
                                    setVerificationPending(false);
                                    setVerificationCode('');
                                }}
                            >
                                <Text className="text-blue-600 text-center font-medium text-base">
                                    Back to Sign Up
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Help Text */}
                        <View className="mt-8">
                            <Text className="text-gray-500 text-xs text-center leading-4">
                                Didn't receive the code? Check your spam folder or try resending.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
                        <Text className="text-3xl font-bold text-gray-900 mb-2">Create account</Text>
                        <Text className="text-gray-600 text-base">Sign up to get started</Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-4">
                        <View className="flex-row space-x-3">
                            <View className="flex-1">
                                <Text className="text-gray-700 font-medium mb-2">First Name</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                                    placeholder="First name"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-700 font-medium mb-2">Last Name</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                                    placeholder="Last name"
                                    value={lastName}
                                    onChangeText={setLastName}
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

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
                                placeholder="Create a password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoCapitalize="none"
                            />
                        </View>

                        <TouchableOpacity
                            className="bg-blue-600 rounded-lg py-4 mt-6"
                            onPress={handleSignUp}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white text-center font-semibold text-base">
                                    Create Account
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View className="flex-row items-center my-8">
                        <View className="flex-1 h-px bg-gray-300" />
                        <Text className="mx-4 text-gray-500">or</Text>
                        <View className="flex-1 h-px bg-gray-300" />
                    </View>

                    {/* OAuth Buttons */}
                    <View className="space-y-3">
                        <TouchableOpacity
                            className="flex-row items-center justify-center bg-white border border-gray-300 rounded-lg py-3 px-6"
                            onPress={() => handleOAuth("oauth_google")}
                            disabled={oauthLoading}
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 2,
                                elevation: 2,
                            }}
                        >
                            {oauthLoading ? (
                                <ActivityIndicator size="small" color="#4285F4" />
                            ) : (
                                <View className="flex-row items-center justify-center">
                                    <Image
                                        source={require("../../assets/images/google.png")}
                                        className="size-10 mr-3"
                                        resizeMode="contain"
                                    />
                                    <Text className="text-black font-medium text-base">Continue with Google</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Terms and Privacy */}
                    <Text className="text-center text-gray-500 text-xs leading-4 mt-6 px-2">
                        By signing up, you agree to our <Text className="text-blue-500">Terms</Text>
                        {", "}
                        <Text className="text-blue-500">Privacy Policy</Text>
                        {", and "}
                        <Text className="text-blue-500">Cookie Use</Text>.
                    </Text>

                    {/* Sign In Link */}
                    <View className="mt-8 flex-row justify-center">
                        <Text className="text-gray-600">Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")}>
                            <Text className="text-blue-600 font-medium">Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
} 