import { Button } from "@/components/Buttons";
import { OnboardingBodyText, Title1 } from "@/components/Text";
import Colors from "@/constants/Colors";
import { useRef, useState } from "react";
import { Dimensions, ImageBackground, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Rive from "rive-react-native";
import { Image, Text, View, XStack, YStack } from "tamagui";
import { CarouselStepType } from "../../type";

function MediaContent({
  page,
}: {
  page: CarouselStepType["payload"]["pages"][0];
}) {
  if (page.imageType === "rive") {
    return (
      <View width={200} height={200}>
        <Rive
          resourceName={page.resourceName}
          style={{
            width: 200,
            height: 200,
          }}
          autoplay={true}
        />
      </View>
    );
  } else {
    return (
      <Image
        source={{ uri: page.imageUrl }}
        width={200}
        height={200}
        objectFit="contain"
      />
    );
  }
}

export function CarouselPage({
  step,
  onNext,
}: {
  step: CarouselStepType;
  onNext: (args?: string | string[]) => void;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const { width } = Dimensions.get("window");
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = ({
    nativeEvent,
  }: {
    nativeEvent: { contentOffset: { x: number } };
  }) => {
    const newPage = Math.round(nativeEvent.contentOffset.x / width);
    setCurrentPage(newPage);
  };

  const handleButtonPress = () => {
    const isLastPage = currentPage === step.payload.pages.length - 1;

    if (isLastPage) {
      onNext();
    } else {
      const nextPage = currentPage + 1;
      scrollViewRef.current?.scrollTo({
        x: nextPage * width,
        animated: true,
      });
      setCurrentPage(nextPage);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <YStack flex={1}>
        <XStack paddingHorizontal="$5" paddingTop="$4" gap="$2">
          {step.payload.pages.map((_, index) => (
            <View
              key={index}
              flex={1}
              height={4}
              backgroundColor={
                currentPage === index ? Colors.black : Colors.lightGray
              }
              borderRadius="$4"
            />
          ))}
        </XStack>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleScroll}
        >
          {step.payload.pages.map((page, index) => (
            <View key={index} width={width}>
              <ImageBackground
                source={{ uri: page.backgroundImageUrl }}
                style={{
                  width: width,
                  flex: 1,
                }}
              >
                <YStack
                  flex={1}
                  paddingHorizontal="$6"
                  paddingTop="$15"
                  paddingBottom="$7"
                  gap="$6"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <MediaContent page={page} />
                  <YStack gap="$4" alignItems="center">
                    <Title1 textAlign="center">{page.title}</Title1>
                    <OnboardingBodyText>{page.description}</OnboardingBodyText>
                  </YStack>
                </YStack>
              </ImageBackground>
            </View>
          ))}
        </ScrollView>

        <YStack paddingBottom="$4" alignSelf="center" width="70%">
          <Button primary onPress={handleButtonPress}>
            <Text
              fontFamily="Inter"
              fontWeight="400"
              fontSize={16}
              color="white"
            >
              {step.payload.pages[currentPage].buttonText || "Continue"}
            </Text>
          </Button>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
