import { Button } from "@/components/Buttons";
import { Title2 } from "@/components/Text";
import Colors from "@/constants/Colors";
import {
  Dimensions,
  ImageBackground,
  Linking,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import Rive from "rive-react-native";
import { Image, Stack, Text, View, XStack, YStack } from "tamagui";
import { QuoteStepType } from "../../type";

function MediaContent({ question }: { question: QuoteStepType["payload"] }) {
  const { width, height } = Dimensions.get("window");
  const imageHeight = Math.min(height / 2.5, width);

  if (question.imageType === "rive") {
    return (
      <Stack padding="$6" height="100%">
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

  return question.imageUrl ? (
    <Stack padding="$6" height={imageHeight}>
      <Image
        source={{ uri: question.imageUrl }}
        alignSelf="center"
        width="100%"
        height="100%"
        objectFit="contain"
      />
    </Stack>
  ) : null;
}

function QuoteContent({ quote }: { quote: QuoteStepType["payload"]["quote"] }) {
  return (
    <YStack flex={1} justifyContent="center" gap="$7" paddingHorizontal="$5">
      <YStack gap="$3">
        <Title2 textAlign="center">“{quote.content}”</Title2>

        <Text
          fontFamily="Inter"
          fontWeight="400"
          fontSize={14}
          color={Colors.gray}
          textAlign="right"
          textDecorationLine="underline"
          onPress={() => Linking.openURL(quote.url)}
        >
          {quote.source}
        </Text>
      </YStack>

      <YStack gap="$2">
        {Array.from({ length: Math.ceil(quote.logosUrl.length / 2) }).map(
          (_, rowIndex) => {
            const isLastRow =
              rowIndex === Math.floor(quote.logosUrl.length / 2);
            const isOddCount = quote.logosUrl.length % 2 === 1;
            const logosForRow = quote.logosUrl.slice(
              rowIndex * 2,
              rowIndex * 2 + 2,
            );

            return (
              <XStack
                key={rowIndex}
                justifyContent={
                  isLastRow && isOddCount ? "center" : "space-between"
                }
                alignItems="center"
                width="100%"
              >
                {logosForRow.map((logoUrl, index) => (
                  <Image
                    key={index}
                    source={{ uri: logoUrl }}
                    height={40}
                    flex={1}
                    objectFit="contain"
                  />
                ))}
              </XStack>
            );
          },
        )}
      </YStack>
    </YStack>
  );
}

export const QuotePage = ({
  step,
  onNext,
}: {
  step: QuoteStepType;
  onNext: (args?: string | string[]) => void;
}) => {
  const question = step.payload;

  const onPress = () => {
    onNext();
  };

  const content = (
    <SafeAreaView style={styles.safeAreaView}>
      <YStack flex={1} paddingBottom="$4">
        <View flex={2}>
          <MediaContent question={question} />
        </View>

        <YStack flex={3} justifyContent="center">
          <QuoteContent quote={question.quote} />
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
