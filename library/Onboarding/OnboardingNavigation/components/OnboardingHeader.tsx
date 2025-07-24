import Colors from "@/constants/Colors";
import { HeaderBackButton } from "@react-navigation/elements";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Progress, View, XStack } from "tamagui";

type OnboardingHeaderProps = {
  progressPercentage: number;
  hideHeader?: boolean;
};

export const HEADER_HEIGHT = 50;

const LeftHeader = ({ router }) => (
  <HeaderBackButton
    style={{
      display: router.canGoBack() ? "flex" : "none",
    }}
    labelVisible={false}
    backImage={() => <ChevronLeft size="$3" color={Colors.black} />}
    onPress={() => router.back()}
  />
);

// const RightHeader = () => null;

export const OnboardingHeader = ({
  progressPercentage,
  hideHeader,
}: OnboardingHeaderProps) => {
  const router = useRouter();

  const { top } = useSafeAreaInsets();
  const headerHeight = top + HEADER_HEIGHT;

  return (
    <View
      position="absolute"
      display={hideHeader ? "none" : "inherit"}
      paddingTop={top}
      height={headerHeight}
      zIndex={10}
      width={"100%"}
      justifyContent="center"
    >
      <XStack
        justifyContent="space-between"
        height="100%"
        alignItems="center"
        gap="$5"
        marginHorizontal="$3.5"
      >
        <View>
          <LeftHeader router={router} />
        </View>

        <XStack flex={1} justifyContent="center" alignItems="center">
          <Progress
            backgroundColor={Colors.lightGray}
            value={progressPercentage}
            height={6}
          >
            <Progress.Indicator
              backgroundColor={Colors.black}
              animation="100ms"
            />
          </Progress>
        </XStack>

        {/* <View>
          <RightHeader />
        </View> */}
      </XStack>
    </View>
  );
};
