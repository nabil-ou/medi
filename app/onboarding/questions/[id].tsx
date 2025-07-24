import { getQuestions } from "@/assets/onboardingQuestions";
import { Button } from "@/components/Buttons";
import { StorageKeys } from "@/constants/StorageKeys";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { useUser } from "@/contexts/UserContext";
import {
  CarouselPage,
  MediaContentPage,
  NotificationSettingsPage,
  OnboardingStep,
  QuestionPage,
  QuotePage,
  SocialProofPage,
  TextInputPage,
  useOnboardingNavigation,
} from "@/library/Onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Superwall from "@superwall/react-native-superwall";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { ReactNode, useCallback, useMemo } from "react";
import { Text, YStack } from "tamagui";

const Questions = () => {
  const { setProgressPercentage, setHideHeader } = useOnboardingNavigation();
  const { captureEvent, superwallHandler, userIsPremium } = useAnalytics();
  const { completeOnboarding } = useUser();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const questions = useMemo(() => getQuestions(), []);

  const QUESTIONS_COUNT = questions.length - 1;

  const questionIdToKey = useMemo<Record<string, keyof typeof StorageKeys>>(
    () => ({
      "user-name": "USER_NAME",
      "journaling-goals": "JOURNALING_GOALS",
      "journaling-experience": "JOURNALING_EXPERIENCE",
      "gratitude-focus": "GRATITUDE_FOCUS",
    }),
    [],
  );

  const idNumber = useMemo(() => parseInt(id as string) || 0, [id]);
  const question = useMemo(() => {
    return questions[idNumber];
  }, [questions, idNumber]);

  useFocusEffect(() => {
    setProgressPercentage((idNumber / QUESTIONS_COUNT) * 100);
    setHideHeader(!Boolean(question?.displayProgressHeader));
  });

  const isLastQuestion = idNumber >= QUESTIONS_COUNT;

  const goNext = useCallback(
    async (args?: string | string[]) => {
      if (question.id in questionIdToKey) {
        const storageKey = StorageKeys[questionIdToKey[question.id]];
        await AsyncStorage.setItem(storageKey, JSON.stringify(args));
      }

      captureEvent("onboarding_page_viewed", {
        title: question.name,
        screen_id: question.id,
        screen_type: question.type,
        answers: args,
      });

      const nextId = idNumber + 1;
      if (isLastQuestion) {
        // Superwall.shared
        //   .register("CompleteOnboardingOld", undefined, superwallHandler)
        //   .then(async () => {
        completeOnboarding();
        captureEvent("app_entered", { is_premium: userIsPremium });
        router.push("/(tabs)");
        // });
      } else {
        router.push(`/onboarding/questions/${nextId}`);
      }
    },
    [
      idNumber,
      isLastQuestion,
      router,
      question,
      captureEvent,
      questionIdToKey,
      completeOnboarding,
      superwallHandler,
      userIsPremium,
    ],
  );

  if (!questions.length) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Loading...</Text>
      </YStack>
    );
  }

  return getPageContent(question, goNext);
};

const getPageContent = (
  question: OnboardingStep,
  goNext: (args?: string | string[]) => void,
): ReactNode => {
  switch (question.type) {
    case "MediaContent":
      return <MediaContentPage step={question} onNext={goNext} />;
    case "Question":
      return <QuestionPage step={question} onNext={goNext} />;
    case "Carousel":
      return <CarouselPage step={question} onNext={goNext} />;
    case "TextInput":
      return <TextInputPage step={question} onNext={goNext} />;
    case "SocialProof":
      return <SocialProofPage step={question} onNext={goNext} />;
    case "Quote":
      return <QuotePage step={question} onNext={goNext} />;
    case "NotificationSettings":
      return <NotificationSettingsPage step={question} onNext={goNext} />;
    default:
      return (
        <YStack padding="$4" paddingVertical="$6" alignSelf="center">
          <Button primary onPress={() => goNext()}>
            <Text
              fontFamily="Inter"
              fontWeight="400"
              fontSize={16}
              color="white"
            >
              Continue
            </Text>
          </Button>
        </YStack>
      );
  }
};
export default Questions;
