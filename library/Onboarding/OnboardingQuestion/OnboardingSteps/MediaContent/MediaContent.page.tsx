import { Button } from "@/components/Buttons";
import { OnboardingBodyText, Title1 } from "@/components/Text";
import LottieView from "lottie-react-native";
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import Rive from "rive-react-native";
import { Image, Stack, Text, View, YStack } from "tamagui";
import { SocialProof } from "../../Components/SocialProof";
import { MediaContentStepType } from "../../type";

function MediaContent({
  question,
}: {
  question: MediaContentStepType["payload"];
}) {
  const { width, height } = Dimensions.get("window");
  const imageHeight = Math.min(height / 2.5, width);

  if (question.imageType === "rive") {
    return (
      <Stack padding="$6" height={imageHeight}>
        <Rive
          resourceName={question.resourceName}
          style={{
            alignSelf: "center",
            width: "100%",
            height: "100%",
          }}
          autoplay={true}
        />
      </Stack>
    );
  }

  const isLottie = question.imageUrl?.endsWith(".json");

  return isLottie ? (
    <Stack padding="$6" height={imageHeight}>
      <LottieView
        source={{ uri: question.imageUrl }}
        autoPlay
        loop={false}
        style={{
          alignSelf: "center",
          width: "100%",
          height: "100%",
        }}
      />
    </Stack>
  ) : question.imageUrl ? (
    <Stack padding="$6" height={imageHeight} justifyContent="center">
      <Image
        source={{ uri: question.imageUrl }}
        alignSelf="center"
        width={200}
        height={200}
        objectFit="contain"
      />
    </Stack>
  ) : (
    <View width="100%" height={"50%"} backgroundColor="green" />
  );
}

function ContentSection({
  question,
}: {
  question: MediaContentStepType["payload"];
}) {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      width="100%"
      alignSelf="center"
      paddingHorizontal="$5"
      gap="$3.5"
    >
      <Title1 textAlign="center">{question.title}</Title1>
      {question.socialProof?.content && (
        <SocialProof socialProof={question.socialProof} />
      )}
      {question.description && (
        <OnboardingBodyText>{question.description}</OnboardingBodyText>
      )}
    </YStack>
  );
}

export const MediaContentPage = ({
  step,
  onNext,
}: {
  step: MediaContentStepType;
  onNext: (args?: string | string[]) => void;
}) => {
  const question = step.payload;
  const layout = question.layout || "mediaTop";

  const onPress = () => {
    onNext();
  };

  const content = (
    <SafeAreaView style={styles.safeAreaView}>
      <YStack flex={1} paddingBottom="$4">
        {layout === "mediaTop" ? (
          <>
            <MediaContent question={question} />
            <ContentSection question={question} />
          </>
        ) : (
          <>
            <ContentSection question={question} />
            <MediaContent question={question} />
          </>
        )}

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
