import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { useApiClient, userApi } from "../utils/api";

export const useUserSync = () => {
    const { isSignedIn } = useAuth();
    const api = useApiClient();

    const syncUserMutation = useMutation({
        mutationFn: () => userApi.syncUser(api),
        onSuccess: (response: any) => console.log("User synced successfully:", response.data.user),
        onError: (error) => {
            // Handle network errors gracefully - don't show error for network issues
            if (error?.message?.includes('Network Error')) {
                console.log("User sync skipped - backend not available");
            } else if (error?.message?.includes('API not configured')) {
                console.log("User sync skipped - no API configured");
            } else {
                console.error("User sync failed:", error);
            }
        },
        retry: false, // Don't retry on network errors
    });

    // auto-sync user when signed in
    useEffect(() => {
        // Only sync if user is signed in, not already synced, and API is available
        if (isSignedIn && !syncUserMutation.data && api) {
            syncUserMutation.mutate();
        }
    }, [isSignedIn, api]);

    return null;
};