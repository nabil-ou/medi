import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { useSuperwallHandler } from "@/hooks/useSuperwallHandler";
import { createAnalyticsService } from "@/services/analytics/analyticsService";
import { AnalyticsContextType } from "@/services/analytics/types";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { usePostHog } from "posthog-react-native";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined,
);

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error("useAnalytics must be used within a AnalyticsProvider");
  }
  return context;
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const posthog = usePostHog();
  const analyticsService = useMemo(
    () => createAnalyticsService(posthog),
    [posthog],
  );
  const { userIsPremium, checkPremiumStatus } = usePremiumStatus(posthog);

  const captureEvent = useCallback(
    (event: string, properties: Record<string, any>) => {
      analyticsService.trackEvent({ name: event, properties });
    },
    [analyticsService],
  );

  const superwallHandler = useSuperwallHandler(
    checkPremiumStatus,
    captureEvent,
  );

  // ATT Prompt
  useEffect(() => {
    const promptAttAsync = async () => {
      try {
        const { status } = await requestTrackingPermissionsAsync();
        posthog?.capture("$set", { $set_once: { attStatus: status } });
      } catch (e) {
        console.error("Error prompting ATT", e);
      }
    };
    promptAttAsync();
  }, [posthog]);

  // PostHog Environment
  useEffect(() => {
    if (posthog) {
      posthog.capture("$set", {
        $set_once: { env: __DEV__ ? "development" : "production" },
      });
    }
  }, [posthog]);

  // Analytics Service Initialization
  useEffect(() => {
    analyticsService.initialize().catch((e) => {
      console.error("Failed to initialize analytics services:", e);
    });
  }, [analyticsService]);

  // Track User Conversion
  useEffect(() => {
    if (userIsPremium) {
      captureEvent("user_converted", {});
    }
  }, [userIsPremium, captureEvent]);

  return (
    <AnalyticsContext.Provider
      value={{
        captureEvent,
        superwallHandler,
        userIsPremium,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}
