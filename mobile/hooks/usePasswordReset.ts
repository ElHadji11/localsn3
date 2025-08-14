import { useSignIn } from '@clerk/clerk-expo';
import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';

export const usePasswordReset = () => {
    const { signIn, setActive, isLoaded } = useSignIn();
    const [isLoading, setIsLoading] = useState(false);

    const sendResetEmail = async (email: string) => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return false;
        }

        if (!signIn) {
            Alert.alert('Error', 'Password reset is not available');
            return false;
        }

        setIsLoading(true);
        try {
            await signIn.create({
                strategy: 'reset_password_email_code',
                identifier: email,
            });

            Alert.alert(
                'Email Sent',
                'A 6-digit code has been sent to your email address.',
                [{ text: 'OK' }]
            );
            return true;
        } catch (err: any) {
            console.error('Password reset error:', err);
            // Don't show specific error messages for security reasons
            Alert.alert(
                'Email Sent',
                'A 6-digit code has been sent to your email address.',
                [{ text: 'OK' }]
            );
            return true; // Return true to maintain security (don't reveal if email exists)
        } finally {
            setIsLoading(false);
        }
    };

    const verifyCode = async (code: string) => {
        if (!code || code.length !== 6) {
            Alert.alert('Error', 'Please enter the 6-digit code');
            return false;
        }

        if (!signIn) {
            Alert.alert('Error', 'Password reset is not available');
            return false;
        }

        setIsLoading(true);
        try {
            const result = await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
            });

            if (result.status === 'needs_new_password') {
                return true;
            } else {
                Alert.alert('Error', 'Invalid code. Please try again.');
                return false;
            }
        } catch (err: any) {
            console.error('Code verification error:', err);
            Alert.alert('Error', err.errors?.[0]?.message || 'Invalid code. Please try again.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (code: string, password: string, confirmPassword: string) => {
        if (!password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return false;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return false;
        }

        if (password.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters long');
            return false;
        }

        if (!signIn) {
            Alert.alert('Error', 'Password reset is not available');
            return false;
        }

        setIsLoading(true);
        try {
            const result = await signIn.resetPassword({
                password,
            });

            if (result.status === 'complete') {
                Alert.alert(
                    'Success',
                    'Your password has been reset successfully!',
                    [
                        {
                            text: 'OK',
                        },
                    ]
                );
                return true;
            } else {
                Alert.alert('Error', 'Password reset failed. Please try again.');
                return false;
            }
        } catch (err: any) {
            console.error('Password reset error:', err);
            Alert.alert('Error', err.errors?.[0]?.message || 'Password reset failed. Please try again.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoaded,
        isLoading,
        sendResetEmail,
        verifyCode,
        resetPassword,
    };
};