import { useUserName } from "@/hooks/useUserName";
import { Text, View, XStack, YStack } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import { Animated } from "react-native";
import { useEffect, useRef } from "react";
import Svg, { Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  progress: number;
}

const CircularProgress = ({ progress }: CircularProgressProps) => {
  const animationValue = useRef(new Animated.Value(0)).current;
  const size = 64;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const strokeDashOffset = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View
      alignItems="center"
      justifyContent="center"
      marginVertical={10}
      position="relative"
    >
      <View
        position="absolute"
        zIndex={1}
        justifyContent="center"
        alignItems="center"
      >
        <Text fontSize={18} fontWeight="bold" color={Colors.white}>
          {Math.round(progress * 100)}%
        </Text>
      </View>
      <Svg
        height={size}
        width={size}
        style={{ transform: [{ rotate: "-90deg" }] }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={"rgba(255, 255, 255, 0.2)"}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.white}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
};

interface HeaderProps {
  progress: number;
  totalDosesForToday: number;
  completedDoses: number;
}

export default function Header({
  progress,
  totalDosesForToday,
  completedDoses,
}: HeaderProps) {
  const userName = useUserName();
  const { top } = useSafeAreaInsets();

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

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
      <YStack paddingHorizontal={20}>
        <Text
          fontSize={24}
          fontWeight="700"
          lineHeight={32}
          color={Colors.white}
        >
          Bonjour {userName ? `${userName}!` : "Bob !"}
        </Text>
        <Text fontSize={16} fontWeight="400" color={Colors.white}>
          {today}
        </Text>
      </YStack>
      <XStack
        padding={16}
        backgroundColor="rgba(255, 255, 255, 0.10)"
        borderRadius={16}
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <YStack gap={4} justifyContent="center">
          <Text fontSize={18} fontWeight="700" color={Colors.white}>
            Progression du jour
          </Text>
          <Text fontSize={14} fontWeight="400" color={Colors.white}>
            {completedDoses} sur {totalDosesForToday} médicaments pris
          </Text>
        </YStack>
        <CircularProgress progress={progress} />
      </XStack>
    </LinearGradient>
  );
}
