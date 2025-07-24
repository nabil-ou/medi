import { Button } from "@/components/Buttons";
import { OnboardingBodyText, Title1 } from "@/components/Text";
import Colors from "@/constants/Colors";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Circle, Image, Text, View, YStack } from "tamagui";

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <View flex={1} backgroundColor={Colors.white}>
      <Circle
        size={452}
        position="absolute"
        top={-118}
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
            gap={75}
            width="70%"
            paddingBottom="$6"
          >
            <Image
              source={require("@/assets/images/hugging_face.gif")}
              width={164}
              height={164}
              transform={[{ rotate: "-7.15deg" }]}
            />
            <YStack alignItems="center" gap={50}>
              <Title1 textAlign="center">Bienvenue sur SiteNote</Title1>
              <OnboardingBodyText>
                Votre application de prise de notes intelligente
              </OnboardingBodyText>
              <Image
                source={require("@/assets/images/sparkles.png")}
                width={39}
                height={39}
              />
            </YStack>
            <Button
              primary
              width="100%"
              onPress={() => {
                router.push("/onboarding/questions");
              }}
            >
              <Text
                fontFamily="Inter"
                fontWeight="400"
                fontSize={16}
                color={Colors.white}
              >
                Commencer
              </Text>
            </Button>
          </YStack>
        </SafeAreaView>
      </BlurView>
    </View>
  );
}
