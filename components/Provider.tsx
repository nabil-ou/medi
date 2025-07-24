import { POSTHOG_API_KEY, POSTHOG_HOST } from "@/config";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import { UserProvider } from "@/contexts/UserContext";
import config from "@/tamagui.config";
import { PostHogProvider } from "posthog-react-native";
import { TamaguiProvider, type TamaguiProviderProps } from "tamagui";

export function Provider({
  children,
  ...rest
}: Omit<TamaguiProviderProps, "config">) {
  return (
    <PostHogProvider apiKey={POSTHOG_API_KEY} options={{ host: POSTHOG_HOST }}>
      <AnalyticsProvider>
        <UserProvider>
          <TamaguiProvider config={config} defaultTheme={"light"} {...rest}>
            {children}
          </TamaguiProvider>
        </UserProvider>
      </AnalyticsProvider>
    </PostHogProvider>
  );
}
