import { Button } from "@/components/Buttons";
import { Title1 } from "@/components/Text";
import Colors from "@/constants/Colors";
import { MessageCircleQuestion } from "@tamagui/lucide-icons";
import { useState } from "react";
import {
  Image,
  styled,
  Button as TamaguiButton,
  Text,
  XStack,
  YStack,
} from "tamagui";
import { OnboardingSafeAreaView } from "../../../OnboardingNavigation";
import { QuestionStepType } from "../../type";
import { infoBoxIsDefined } from "./Question.helpers";

export const QuestionPage = ({
  step,
  onNext,
}: {
  step: QuestionStepType;
  onNext: (args?: string | string[]) => void;
}) => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const handleContinue = async () => {
    const selectedAnswers = Object.keys(selected).filter(
      (key) => selected[key],
    );
    onNext(step.payload.multipleAnswer ? selectedAnswers : selectedAnswers[0]);
  };

  const toggleSelected = (answer: string) => {
    const isNoneOfTheAbove = answer === "None of the above";

    setSelected((prev) => {
      if (step.payload.multipleAnswer) {
        let newSelected: Record<string, boolean>;

        if (isNoneOfTheAbove) {
          newSelected = { [answer]: true };
        } else {
          newSelected = { ...prev, [answer]: !prev[answer] };

          if (newSelected["None of the above"]) {
            newSelected["None of the above"] = false;
          }
        }

        return newSelected;
      } else {
        return { [answer]: true };
      }
    });
  };

  return (
    <OnboardingSafeAreaView>
      <YStack
        gap="$4"
        flex={1}
        paddingHorizontal="$3.5"
        paddingTop="$5"
        paddingBottom="$5"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        {step.payload.title && (
          <Title1 alignSelf="flex-start">{step.payload.title}</Title1>
        )}

        <YStack width="100%" flex={1} justifyContent="space-evenly">
          <YStack gap="$3">
            {step.payload.answers.map((answer, index) => (
              <AnswerButton
                key={index}
                onPress={() => toggleSelected(answer.value)}
                isSelected={!!selected[answer.value]}
              >
                <XStack alignItems="center" gap="$2.5">
                  {answer.imageUrl && (
                    <Image
                      source={{ uri: answer.imageUrl }}
                      width={32}
                      height={32}
                      objectFit="contain"
                    />
                  )}
                  <ButtonText isSelected={!!selected[answer.value]}>
                    {answer.label}
                  </ButtonText>
                </XStack>
              </AnswerButton>
            ))}
          </YStack>
          <InfoBox infoBox={step.payload.infoBox} />
        </YStack>
        <Button
          primary
          onPress={handleContinue}
          disabled={Object.keys(selected).length === 0}
          width="70%"
        >
          <Text fontFamily="Inter" fontWeight="400" fontSize={16} color="white">
            {step.payload.buttonText ?? "Continue"}
          </Text>
        </Button>
      </YStack>
    </OnboardingSafeAreaView>
  );
};

const InfoBox = ({
  infoBox,
}: {
  infoBox: QuestionStepType["payload"]["infoBox"];
}) => {
  if (!infoBoxIsDefined(infoBox)) return null;
  return (
    <YStack
      gap="$2"
      borderRadius={"$6"}
      borderWidth={"$1"}
      borderColor={"#808080"}
      backgroundColor={"#141414"}
      paddingHorizontal="$5"
      paddingVertical="$3.5"
    >
      {infoBox.title && (
        <XStack alignItems="center" gap="$2">
          <MessageCircleQuestion color={"#fff"} />
          <Text color={"#fff"}>{infoBox.title}</Text>
        </XStack>
      )}
      {infoBox.content && <Text color={"#808080"}>{infoBox.content}</Text>}
    </YStack>
  );
};

const AnswerButton = styled(TamaguiButton, {
  height: "$6",
  paddingVertical: "$3",
  paddingHorizontal: "$5",
  justifyContent: "flex-start",
  borderWidth: 0,
  backgroundColor: Colors.lightGray,
  borderRadius: "$6",
  width: "100%",
  pressStyle: {
    backgroundColor: Colors.lightGray,
  },
  variants: {
    isSelected: {
      true: {
        backgroundColor: Colors.black,
        pressStyle: {
          backgroundColor: Colors.black,
        },
      },
    },
  },
});

const ButtonText = styled(Text, {
  fontFamily: "Inter",
  fontSize: 16,
  // lineHeight: 24,
  fontWeight: 400,
  color: Colors.black,
  variants: {
    isSelected: {
      true: { color: Colors.white },
    },
  },
});
