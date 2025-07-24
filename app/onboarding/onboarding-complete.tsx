import { Button } from "@/components/Buttons";
import { Title1 } from "@/components/Text";
import Colors from "@/constants/Colors";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Circle, Image, Text, View, XStack, YStack } from "tamagui";

export default function OnboardingCompleteScreen() {
  const router = useRouter();

  const handleOnboardingComplete = () => {
    router.push({
      pathname: "/home",
      params: {
        onboarding: "true",
        action: "first-entry",
      },
    });
  };

  return (
    <View flex={1} backgroundColor={Colors.white}>
      <Circle
        size={452}
        position="absolute"
        top="50%"
        left="50%"
        transform={[{ translateY: -226 }, { translateX: -226 }]}
        backgroundColor="rgb(255, 214, 113)"
        opacity={0.5}
      />
      <BlurView intensity={100} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
          <YStack
            flex={1}
            justifyContent="flex-end"
            alignItems="center"
            gap={110}
            width="70%"
            paddingBottom="$6"
          >
            <Image
              source={require("@/assets/images/party_face.gif")}
              width={164}
              height={164}
              transform={[{ rotate: "-8.57deg" }]}
            />
            <Title1 textAlign="center">
              We're good! Let's start your journal
            </Title1>
            <Button primary width="100%" onPress={handleOnboardingComplete}>
              <XStack alignItems="center" gap={10}>
                <Image
                  source={require("@/assets/images/sparkles.png")}
                  width={16}
                  height={16}
                />
                <Text
                  fontFamily="Inter"
                  fontWeight="400"
                  fontSize={14}
                  color={Colors.white}
                >
                  Start
                </Text>
              </XStack>
            </Button>
          </YStack>
        </SafeAreaView>
      </BlurView>
    </View>
  );
}
