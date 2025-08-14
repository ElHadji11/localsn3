import { useSSO } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

export const useOAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { startSSOFlow } = useSSO();

    const handleOAuth = async (strategy: "oauth_google") => {
        setIsLoading(true);
        try {
            const { createdSessionId, setActive } = await startSSOFlow({ strategy });

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
            }
            router.replace('/(tabs)')
        } catch (err) {
            console.log("Error in OAuth", err);
            Alert.alert("Error", "Failed to sign in with Google. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, handleOAuth };
}; 