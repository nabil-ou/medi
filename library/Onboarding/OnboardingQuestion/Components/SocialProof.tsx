import Colors from "@/constants/Colors";
import { Circle, Image, Text, View, XStack } from "tamagui";
import { SocialProofStepType } from "../type";

export const SocialProof = ({
  socialProof,
}: {
  socialProof: SocialProofStepType["payload"];
}) => {
  return (
    <View
      borderRadius="$6"
      padding="$3.5"
      backgroundColor={Colors.white}
      gap="$2"
      shadowColor="rgb(0, 0, 0)"
      shadowOffset={{ width: 0, height: 0 }}
      shadowOpacity={0.1}
      shadowRadius={16}
    >
      <XStack gap="$1.5">
        {Array.from({ length: socialProof?.numberOfStar || 5 }).map(
          (_, index) => (
            <Image
              source={require("@/assets/images/star.png")}
              key={index}
              width={16}
              height={16}
            />
          ),
        )}
      </XStack>
      <Text
        fontFamily="Inter"
        fontWeight="600"
        fontSize={18}
        color={Colors.black}
      >
        {socialProof?.content}
      </Text>
      {socialProof?.authorName && (
        <XStack gap="$2" alignItems="center">
          <Circle
            size="$2"
            backgroundColor={Colors.darkGray}
            justifyContent="center"
            alignItems="center"
          >
            <Text
              fontFamily="InterSemiBold"
              fontWeight="600"
              fontSize={14}
              color={Colors.white}
            >
              {socialProof?.authorName[0]?.toUpperCase()}
            </Text>
          </Circle>
          <Text
            fontFamily="Inter"
            fontWeight="400"
            fontSize={14}
            color={Colors.black}
          >
            {socialProof.authorName}
          </Text>
        </XStack>
      )}
    </View>
  );
};
