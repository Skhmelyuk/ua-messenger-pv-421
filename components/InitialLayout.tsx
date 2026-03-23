import { useEffect } from "react";
import { useConvexAuth } from "convex/react";
import * as SplashScreen from "expo-splash-screen";
import { Stack, useRouter, useSegments } from "expo-router";

export default function InitialLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthScreen = segments[0] === "(auth)";

    // Якщо користувач залогінений — забороняємо тільки auth-екрани.
    // Інші роути (наприклад /user/[id]) мають відкриватися без редіректу.
    if (isAuthenticated && inAuthScreen) {
      router.replace("/(tabs)");
    } else if (!isAuthenticated && !inAuthScreen) {
      router.replace("/(auth)/login");
    }

    // Ховаємо splash тільки після редіректу
    SplashScreen.hideAsync();
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
