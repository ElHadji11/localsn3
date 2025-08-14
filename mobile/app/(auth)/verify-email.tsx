import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView,
} from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { router, useLocalSearchParams } from 'expo-router';

export default function VerifyEmailScreen() {
    const { signUp } = useSignUp();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const params = useLocalSearchParams();

    useEffect(() => {
        // Get email from route params or from Clerk context
        if (params.email) {
            setEmail(params.email as string);
        }
    }, [params.email]);

    const handleResendVerification = async () => {
        setIsLoading(true);
        try {
            if (signUp) {
                await signUp.prepareEmailAddressVerification();
                Alert.alert('Success', 'Verification email sent again. Please check your inbox.');
            }
        } catch (err: any) {
            console.error('Resend verification error:', err);
            Alert.alert('Error', 'Failed to resend verification email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckVerification = async () => {
        setIsLoading(true);
        try {
            if (signUp) {
                const result = await signUp.attemptEmailAddressVerification({
                    code: '', // This will be handled by Clerk's web flow
                });

                if (result.status === 'complete') {
                    Alert.alert(
                        'Email Verified!',
                        'Your email has been verified successfully. You can now sign in.',
                        [
                            {
                                text: 'Sign In',
                                onPress: () => {
                                    // Navigation will be handled by the auth layout
                                }
                            }
                        ]
                    );
                }
            }
        } catch (err: any) {
            console.error('Verification check error:', err);
            Alert.alert('Error', 'Failed to verify email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 bg-white">
            <View className="flex-1 justify-center items-center px-8">
                <View className="items-center w-full max-w-sm">
                    {/* Header */}
                    <View className="items-center mb-8">
                        <Text className="text-3xl font-bold text-gray-900 mb-4 text-center">
                            Verify Your Email
                        </Text>
                        <Text className="text-gray-600 text-base text-center leading-6">
                            We've sent a verification link to{' '}
                            <Text className="font-semibold">{email || 'your email'}</Text>
                        </Text>
                    </View>

                    {/* Instructions */}
                    <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 w-full">
                        <Text className="text-blue-800 text-sm leading-5 mb-3">
                            📧 Check your email inbox and click the verification link to complete your registration.
                        </Text>
                        <Text className="text-blue-700 text-xs leading-4">
                            If you don't see the email, check your spam folder.
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View className="w-full space-y-3">
                        <TouchableOpacity
                            className="bg-blue-600 rounded-lg py-4 px-8 w-full"
                            onPress={handleResendVerification}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white text-center font-semibold text-base">
                                    Resend Verification Email
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-gray-100 rounded-lg py-4 px-8 w-full"
                            onPress={handleCheckVerification}
                            disabled={isLoading}
                        >
                            <Text className="text-gray-700 text-center font-medium text-base">
                                I've Verified My Email
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-transparent rounded-lg py-4 px-8 w-full"
                        >
                            <Text className="text-blue-600 text-center font-medium text-base">
                                Back to Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Help Text */}
                    <View className="mt-8">
                        <Text className="text-gray-500 text-xs text-center leading-4">
                            Having trouble? Contact our support team for assistance.
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
} 