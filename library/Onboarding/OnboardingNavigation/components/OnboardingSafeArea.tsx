import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, ViewProps } from "tamagui";
import { HEADER_HEIGHT } from "./OnboardingHeader";

interface SafeAreaViewProps extends ViewProps {
  children: React.ReactNode;
}

export const OnboardingSafeAreaView: React.FC<SafeAreaViewProps> = ({
  children,
  ...props
}) => {
  const { bottom, top } = useSafeAreaInsets();

  const paddingIncludingHeader = top + HEADER_HEIGHT;
  return (
    <View
      flex={1}
      paddingBottom={bottom}
      paddingTop={paddingIncludingHeader}
      backgroundColor="white"
      {...props}
    >
      {children}
    </View>
  );
};
