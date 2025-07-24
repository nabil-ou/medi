import { Provider } from "@/components/Provider";
import { debugNav } from "@/config";
import { StorageKeys } from "@/constants/StorageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { DevSettings } from "react-native";

// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "/",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isSplashReady, setSplashReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      // Load splash screen asset

      setSplashReady(true);
      await SplashScreen.hideAsync();
    }

    prepare();
  }, []);

  useEffect(() => {
    if (__DEV__) {
      setupDevSettings();
    }
  }, []);

  if (!isSplashReady) {
    return null; // This will keep the native splash screen visible
  }

  return (
    <Provider>
      <Stack screenOptions={{ headerShown: debugNav, gestureEnabled: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="medications/add"
          options={{ presentation: "modal" }}
        />
      </Stack>
    </Provider>
  );
}

function setupDevSettings() {
  type DevMenuItem = {
    name: string;
    action: () => Promise<void>;
  };

  const devMenuItems: DevMenuItem[] = [
    {
      name: "🗑️ Reset cache",
      action: async () => {
        await AsyncStorage.clear();
      },
    },
    {
      name: "🔄 Reset onboarding",
      action: async () => {
        await AsyncStorage.removeItem(StorageKeys.HAS_COMPLETED_ONBOARDING);
      },
    },
    {
      name: "✅ Complete onboarding",
      action: async () => {
        await AsyncStorage.setItem(
          StorageKeys.HAS_COMPLETED_ONBOARDING,
          "true",
        );
      },
    },
  ];

  devMenuItems.forEach(({ name, action }) => {
    DevSettings.addMenuItem(name, async () => {
      await action();
      DevSettings.reload();
    });
  });
}
