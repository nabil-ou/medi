import { Button } from "@/components/Buttons";
import { OnboardingBodyText, Title1 } from "@/components/Text";
import { ImageBackground, SafeAreaView, StyleSheet } from "react-native";
import { Text, YStack } from "tamagui";
import { SocialProof } from "../../Components/SocialProof";
import { SocialProofStepType } from "../../type";

export const SocialProofPage = ({
  step,
  onNext,
}: {
  step: SocialProofStepType;
  onNext: (args?: string | string[]) => void;
}) => {
  const question = step.payload;

  const onPress = () => {
    onNext();
  };

  const content = (
    <SafeAreaView style={styles.safeAreaView}>
      <YStack
        flex={1}
        justifyContent="space-between"
        paddingBottom="$4"
        gap="$13"
      >
        <YStack flex={1} justifyContent="space-evenly" paddingHorizontal="$5">
          <Title1>{question.title}</Title1>
          <SocialProof socialProof={question} />
          {question.description && (
            <OnboardingBodyText>{question.description}</OnboardingBodyText>
          )}
        </YStack>

        <Button primary width="70%" alignSelf="center" onPress={onPress}>
          <Text fontFamily="Inter" fontWeight="400" fontSize={16} color="white">
            {question.buttonText || "Continue"}
          </Text>
        </Button>
      </YStack>
    </SafeAreaView>
  );

  return question.backgroundImageUrl ? (
    <ImageBackground
      source={{ uri: question.backgroundImageUrl }}
      style={{ flex: 1 }}
    >
      {content}
    </ImageBackground>
  ) : (
    content
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
});
