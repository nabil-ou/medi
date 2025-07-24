import {
  OnboardingNavigationProvider,
  useOnboardingNavigation,
  OnboardingHeader,
} from "@/library/Onboarding";
import { Stack } from "expo-router";
import { debugNav } from "@/config";

function InnerLayout() {
  const { progressPercentage, hideHeader } = useOnboardingNavigation();

  return (
    <>
      <OnboardingHeader
        progressPercentage={progressPercentage}
        hideHeader={hideHeader}
      />

      <Stack screenOptions={{ headerShown: debugNav }} />
    </>
  );
}

export default function Layout() {
  return (
    <OnboardingNavigationProvider>
      <InnerLayout />
    </OnboardingNavigationProvider>
  );
}
