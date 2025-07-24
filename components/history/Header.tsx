import { Circle, Text, XStack, YStack } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChartLine } from "@tamagui/lucide-icons";

export default function Header() {
  const { top } = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[Colors.primary, Colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        padding: 24,
        paddingTop: top,
        gap: 24,
      }}
    >
      <XStack alignItems="center" justifyContent="space-between">
        <YStack paddingHorizontal={20}>
          <Text
            fontSize={24}
            fontWeight="700"
            lineHeight={32}
            color={Colors.white}
          >
            Historique
          </Text>
          <Text fontSize={14} fontWeight="400" color={Colors.white}>
            Suivez vos prises
          </Text>
        </YStack>
        <Circle size={40} backgroundColor={"rgba(255, 255, 255, 0.20)"}>
          <ChartLine size={24} color={Colors.white} />
        </Circle>
      </XStack>
    </LinearGradient>
  );
}
