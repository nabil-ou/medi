import { PaywallPresentationHandler } from "@superwall/react-native-superwall";

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

export interface AnalyticsService {
  initialize(): Promise<void>;
  initializeRevenueCat(posthog: any): Promise<void>;
  trackEvent(event: AnalyticsEvent): void;
}

export interface AnalyticsContextType {
  captureEvent: (event: string, properties: Record<string, any>) => void;
  superwallHandler: PaywallPresentationHandler;
  userIsPremium: boolean;
}
