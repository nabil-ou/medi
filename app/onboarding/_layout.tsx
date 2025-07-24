import { debugNav } from "@/config";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { Stack } from "expo-router";

const OnboardingStack = () => {
  return (
    <OnboardingProvider>
      <Stack initialRouteName="questions">
        {/* <Stack.Screen
          name="welcome"
          options={{
            headerShown: debugNav,
          }}
        /> */}
        <Stack.Screen
          name="questions"
          options={{
            headerShown: debugNav,
          }}
        />
        <Stack.Screen
          name="onboarding-complete"
          options={{
            headerShown: debugNav,
          }}
        />
      </Stack>
    </OnboardingProvider>
  );
};

export default OnboardingStack;
