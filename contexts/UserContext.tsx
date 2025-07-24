import { StorageKeys } from "@/constants/StorageKeys";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { ReminderSettings } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DevSettings } from "react-native";

interface UserContextType {
  hasCompletedOnboarding: boolean | null;
  completeOnboarding: () => Promise<void>;
  initializeNotifications: (
    reminders: Record<string, ReminderSettings>,
  ) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { captureEvent } = useAnalytics();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const hasCompletedOnboarding = await AsyncStorage.getItem(
          StorageKeys.HAS_COMPLETED_ONBOARDING,
        );

        if (hasCompletedOnboarding === "true") {
          setHasCompletedOnboarding(true);
        } else {
          setHasCompletedOnboarding(false);
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      }
    };

    checkUserStatus();
  }, [captureEvent]);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(StorageKeys.HAS_COMPLETED_ONBOARDING, "true");
      setHasCompletedOnboarding(true);
      captureEvent("onboarding_completed", {});
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  // Notifications

  async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
      alert("Must use physical device for Push Notifications");
      return;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log({ token });
    } catch (e) {
      console.error("Error getting push token", e);
    }
  }

  const schedulePushNotification = useCallback(
    async (
      title: string,
      body: string,
      trigger: Notifications.NotificationTriggerInput,
    ) => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          interruptionLevel: "active",
          sound: true,
        },
        trigger,
      });
    },
    [],
  );

  async function initializeNotifications(
    reminders: Record<string, ReminderSettings>,
  ) {
    await registerForPushNotificationsAsync();

    await Notifications.cancelAllScheduledNotificationsAsync();

    const reminderMessages = {
      morning: {
        title: "🌅 Time for your morning reflection",
        body: "Start your day with gratitude and set your intentions",
      },
      evening: {
        title: "🌇 Time to reflect on your day",
        body: "Take a moment to appreciate the good things that happened today",
      },
    };

    for (const [id, settings] of Object.entries(reminders)) {
      if (settings.enabled) {
        await schedulePushNotification(
          reminderMessages[id as keyof typeof reminderMessages].title,
          reminderMessages[id as keyof typeof reminderMessages].body,
          {
            hour: settings.hour,
            minute: settings.minute,
            repeats: true,
          },
        );
      }
    }
  }

  useEffect(() => {
    if (__DEV__ && Device.isDevice) {
      DevSettings.addMenuItem("Send test notification", async () => {
        await schedulePushNotification(
          "Test Notification",
          "This is a test notification",
          null,
        );
      });
    }
  }, [schedulePushNotification]);

  return (
    <UserContext.Provider
      value={{
        hasCompletedOnboarding,
        completeOnboarding,
        initializeNotifications,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
