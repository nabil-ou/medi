import { Button } from "@/components/Buttons";
import { Title1 } from "@/components/Text";
import Colors from "@/constants/Colors";
import { useState } from "react";
import { KeyboardAvoidingView } from "react-native";
import { Input, Text, YStack } from "tamagui";
import { OnboardingSafeAreaView } from "../../../OnboardingNavigation";
import { TextInputStepType } from "../../type";

export function TextInputPage({
  step,
  onNext,
}: {
  step: TextInputStepType;
  onNext: (args?: string | string[]) => void;
}) {
  const [value, setValue] = useState("");

  const handleContinue = () => {
    if (value.trim()) {
      onNext(value.trim());
    }
  };

  return (
    <OnboardingSafeAreaView>
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          flex: 1,
          width: "100%",
        }}
      >
        <YStack
          flex={1}
          gap="$4"
          paddingHorizontal="$3.5"
          paddingTop="$5"
          paddingBottom="$5"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Title1 alignSelf="flex-start">{step.payload.title}</Title1>

          <YStack width="100%" gap="$4">
            <Input
              value={value}
              onChangeText={setValue}
              placeholder={step.payload.placeholder}
              placeholderTextColor={Colors.gray}
              height={92}
              fontFamily="InterSemiBold"
              fontWeight="600"
              fontSize={24}
              textAlign="center"
              color={Colors.black}
              backgroundColor={Colors.lightGray}
              selectionColor={Colors.black}
              padding={32}
              borderRadius={24}
              borderWidth={0}
              autoFocus
            />
          </YStack>

          <Button
            primary
            onPress={handleContinue}
            disabled={!value.trim()}
            width="70%"
          >
            <Text
              fontFamily="Inter"
              fontWeight="400"
              fontSize={16}
              color="white"
            >
              Continue
            </Text>
          </Button>
        </YStack>
      </KeyboardAvoidingView>
    </OnboardingSafeAreaView>
  );
}
