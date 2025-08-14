import { ClerkProvider } from '@clerk/clerk-expo'
import { Stack } from "expo-router";
import "../global.css"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { clerkConfig } from '../utils/clerk';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <ClerkProvider {...clerkConfig}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
