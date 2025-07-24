import Colors from "@/constants/Colors";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { useUser } from "@/contexts/UserContext";
import { BriefcaseMedical } from "@tamagui/lucide-icons";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from "react-native-reanimated";
import { Text, View } from "tamagui";

async function loadAssetsAsync() {
  const imageAssets = [
    require("@/assets/images/fire.gif"),
    require("@/assets/images/hugging_face.gif"),
    require("@/assets/images/journal-empty-state.png"),
    require("@/assets/images/party_face.gif"),
    require("@/assets/images/sparkles.png"),
    require("@/assets/images/star.png"),
    require("@/assets/images/emotions/happy.gif"),
    require("@/assets/images/emotions/sad.gif"),
    require("@/assets/images/emotions/angry.gif"),
    require("@/assets/images/emotions/anxious.gif"),
    require("@/assets/images/emotions/surprised.gif"),
    require("@/assets/images/emotions/disgusted.gif"),
    require("@/assets/images/emotions/confident.gif"),
    require("@/assets/images/emotions/hopeful.gif"),
    require("@/assets/images/emotions/loved.gif"),
    require("@/assets/images/emotions/ashamed.gif"),
    require("@/assets/images/emotions/enthusiastic.gif"),
    require("@/assets/images/emotions/envious.gif"),
  ];

  const fontAssets = {
    // Inter
    InterThin: require("@tamagui/font-inter/otf/Inter-Thin.otf"),
    InterExtraLight: require("@tamagui/font-inter/otf/Inter-ExtraLight.otf"),
    InterLight: require("@tamagui/font-inter/otf/Inter-Light.otf"),
    InterRegular: require("@tamagui/font-inter/otf/Inter-Regular.otf"),
    InterMedium: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterSemiBold: require("@tamagui/font-inter/otf/Inter-SemiBold.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    InterExtraBold: require("@tamagui/font-inter/otf/Inter-ExtraBold.otf"),
    InterBlack: require("@tamagui/font-inter/otf/Inter-Black.otf"),
    // Recoleta
    RecoletaLight: require("@/assets/fonts/Recoleta-Light.ttf"),
    RecoletaRegular: require("@/assets/fonts/Recoleta-Regular.ttf"),
    RecoletaMedium: require("@/assets/fonts/Recoleta-Medium.ttf"),
    RecoletaSemiBold: require("@/assets/fonts/Recoleta-SemiBold.ttf"),
    RecoletaBold: require("@/assets/fonts/Recoleta-Bold.ttf"),
    RecoletaBlack: require("@/assets/fonts/Recoleta-Black.ttf"),
  };

  const imagePromises = Asset.loadAsync(imageAssets);
  const fontPromise = Font.loadAsync(fontAssets);

  await Promise.all([imagePromises, fontPromise]);
}

export default function Index() {
  const { hasCompletedOnboarding } = useUser();
  const { captureEvent, userIsPremium } = useAnalytics();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const bounce = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  useEffect(() => {
    bounce.value = withRepeat(withTiming(-20, { duration: 500 }), -1, true);
  }, [bounce]);

  const onSplashStart = useCallback(async () => {
    try {
      await loadAssetsAsync();
    } catch (e) {
      console.warn("Failed to load assets:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onSplashFinish = useCallback(() => {
    if (hasCompletedOnboarding) {
      captureEvent("app_entered", { is_premium: userIsPremium });
      router.replace("/auth");
    } else {
      captureEvent("onboarding_started", {});
      router.replace("/auth");
    }
  }, [hasCompletedOnboarding, captureEvent, router, userIsPremium]);

  // Démarrer le chargement au montage du composant
  useEffect(() => {
    onSplashStart();
  }, [onSplashStart]);

  // Naviguer une fois le chargement terminé
  useEffect(() => {
    if (!isLoading) {
      // Ajouter un petit délai pour que l'utilisateur puisse voir l'écran splash
      const timer = setTimeout(() => {
        onSplashFinish();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, onSplashFinish]);

  return (
    <View
      flex={1}
      backgroundColor={Colors.primary}
      justifyContent="center"
      alignItems="center"
    >
      <Animated.View
        entering={FadeIn.duration(1000)}
        style={[animatedStyle, { alignItems: "center" }]}
      >
        <BriefcaseMedical size={60} color={Colors.white} />
        <Text fontSize="$10" fontWeight="bold" color={Colors.white}>
          Judy
        </Text>
      </Animated.View>
    </View>
  );
}
