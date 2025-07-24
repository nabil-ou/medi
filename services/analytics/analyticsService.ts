import {
  ADJUST_APP_TOKEN,
  adjustEventTokens,
  AMPLITUDE_API_KEY,
  APPS_FLYER_APP_ID,
  APPS_FLYER_DEV_KEY,
  META_APP_ID,
  REVENUECAT_API_KEY,
  SUPERWALL_IOS_API_KEY,
} from "@/config";
import * as amplitude from "@amplitude/analytics-react-native";
import Superwall from "@superwall/react-native-superwall";
import { Platform } from "react-native";
import { Adjust, AdjustConfig, AdjustEvent } from "react-native-adjust";
import appsFlyer from "react-native-appsflyer";
import Purchases from "react-native-purchases";
import { AnalyticsService } from "./types";

export function createAnalyticsService(posthog: any): AnalyticsService {
  return {
    async initialize() {
      // Initialize AppsFlyer
      appsFlyer.initSdk({
        devKey: APPS_FLYER_DEV_KEY,
        isDebug: false,
        appId: APPS_FLYER_APP_ID,
        onInstallConversionDataListener: false,
      });

      // Initialize Amplitude
      amplitude.init(AMPLITUDE_API_KEY, undefined, {
        serverZone: "US",
      });

      // Initialize Adjust
      const adjustConfig = new AdjustConfig(
        ADJUST_APP_TOKEN,
        __DEV__
          ? AdjustConfig.EnvironmentSandbox
          : AdjustConfig.EnvironmentProduction,
      );
      adjustConfig.setFbAppId(META_APP_ID);
      adjustConfig.enableCostDataInAttribution();
      __DEV__ && adjustConfig.setLogLevel(AdjustConfig.LogLevelDebug);
      Adjust.addGlobalCallbackParameter("status", "3");
      Adjust.initSdk(adjustConfig);

      // Initialize RevenueCat and link with other services
      await this.initializeRevenueCat(posthog);

      // Initialize Superwall
      const superwallApiKey =
        Platform.OS === "ios" ? SUPERWALL_IOS_API_KEY : "MY_ANDROID_API_KEY";
      Superwall.configure(superwallApiKey);
    },

    async initializeRevenueCat(posthog: any) {
      const revenueCatApiKey =
        Platform.OS === "ios" ? REVENUECAT_API_KEY : "MY_ANDROID_API_KEY";
      Purchases.configure({ apiKey: revenueCatApiKey });
      Purchases.collectDeviceIdentifiers();

      // Link with Adjust
      Adjust.getAdid((adjustId) => {
        Purchases.setAdjustID(adjustId);
      });

      // Link with PostHog
      const posthogUserId = posthog?.getDistinctId();
      if (posthogUserId) {
        await Purchases.setAttributes({
          $posthogUserId: posthogUserId,
        });
      }

      // Link with Amplitude
      const amplitudeDeviceId = amplitude.getDeviceId();
      if (amplitudeDeviceId) {
        await Purchases.setAttributes({
          $amplitudeDeviceId: amplitudeDeviceId,
        });
      }
      const amplitudeUserId = amplitude.getUserId();
      if (amplitudeUserId) {
        await Purchases.setAttributes({
          $amplitudeUserId: amplitudeUserId,
        });
      }
    },

    trackEvent({ name, properties }) {
      posthog?.capture(name, properties);
      amplitude.track(name, properties);
      const adjustEvent = adjustEventTokens[name];
      if (adjustEvent) {
        const adjustEventObj = new AdjustEvent(adjustEvent);
        Adjust.trackEvent(adjustEventObj);
      }
      if (!__DEV__) {
        appsFlyer?.logEvent(name, properties ?? {});
      }
    },
  };
}
