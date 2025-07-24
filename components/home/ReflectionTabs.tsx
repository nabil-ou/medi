import TickIcon from "@/assets/icons/TickIcon";
import EntryCard from "@/components/EntryCard";
import AnimatedCardDeck from "@/components/home/AnimatedCardDeck";
import Tabs from "@/components/Tabs";
import Colors from "@/constants/Colors";
import { HAPTIC_CONFIGS } from "@/constants/haptics";
import { entryTypeMap } from "@/constants/JournalEntries";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { useJournal } from "@/contexts/JournalContext";
import { useHaptics } from "@/hooks/useHaptics";
import { EntryType } from "@/types";
import { getDefaultEntryType } from "@/utils/journalEntries";
import {
  getEveningQuestion,
  getMorningQuestion,
  getRandomQuestion,
} from "@/utils/questions";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Pressable } from "react-native";
import { RiveRef } from "rive-react-native";
import { View } from "tamagui";

const TABS_CONFIG = [
  {
    value: EntryType.MorningReflection,
    icon: () => {
      const Icon = entryTypeMap[EntryType.MorningReflection].icon;
      return (
        <Icon
          width={16}
          height={16}
          color={entryTypeMap[EntryType.MorningReflection].iconColor}
        />
      );
    },
    title: entryTypeMap[EntryType.MorningReflection].label,
    resourceName: "morning_reflection",
  },
  {
    value: EntryType.EveningReflection,
    icon: () => {
      const Icon = entryTypeMap[EntryType.EveningReflection].icon;
      return (
        <Icon
          width={16}
          height={16}
          color={entryTypeMap[EntryType.EveningReflection].iconColor}
        />
      );
    },
    title: entryTypeMap[EntryType.EveningReflection].label,
    resourceName: "evening_reflection",
  },
] as const;

export default function ReflectionTabs() {
  const [activeTab, setActiveTab] = useState(getDefaultEntryType());
  const { journalEntries } = useJournal();
  const { captureEvent } = useAnalytics();
  const router = useRouter();

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayJournalEntry = journalEntries.find(
    (entry) => entry.date === todayStr,
  );
  const todayMorningEntry = todayJournalEntry?.entries.find(
    (entry) => entry.type === EntryType.MorningReflection,
  );
  const todayEveningEntry = todayJournalEntry?.entries.find(
    (entry) => entry.type === EntryType.EveningReflection,
  );

  const [deckState, setDeckState] = useState({
    [EntryType.MorningReflection]: {
      activeQuestionRun: 1,
      question: getMorningQuestion(),
    },
    [EntryType.EveningReflection]: {
      activeQuestionRun: 1,
      question: getEveningQuestion(),
    },
  });

  const morningRiveRef = useRef<RiveRef>(null);
  const eveningRiveRef = useRef<RiveRef>(null);
  const triggerHaptic = useHaptics(HAPTIC_CONFIGS.rigid);
  const [isShuffling, setIsShuffling] = useState(false);

  const handleShuffle = useCallback(
    (direction?: "left" | "right") => {
      if (isShuffling) return;

      setIsShuffling(true);
      captureEvent("reflections_cards_shuffled", { type: activeTab });

      const nextQuestionRun =
        deckState[activeTab].activeQuestionRun === 1 ? 2 : 1;
      const newQuestion = getRandomQuestion(activeTab);

      const riveRef =
        activeTab === EntryType.MorningReflection
          ? morningRiveRef
          : eveningRiveRef;
      riveRef.current?.setTextRunValue(
        `Question ${nextQuestionRun}`,
        newQuestion,
      );
      riveRef.current?.fireState(
        activeTab === EntryType.MorningReflection
          ? "Morning reflection"
          : "Evening reflection",
        direction ? `Swipe ${direction}` : "Change question",
      );

      setDeckState((prev) => ({
        ...prev,
        [activeTab]: {
          activeQuestionRun: nextQuestionRun,
          question: newQuestion,
        },
      }));

      setTimeout(() => setIsShuffling(false), 750);
    },
    [activeTab, isShuffling, deckState, captureEvent],
  );

  const handleCardTap = useCallback(() => {
    if (activeTab === EntryType.MorningReflection) {
      captureEvent("morning_reflection_started", {});
    } else if (activeTab === EntryType.EveningReflection) {
      captureEvent("evening_reflection_started", {});
    }

    router.push({
      pathname: "/notes/new",
      params: {
        entryType: activeTab,
        initialQuestion: deckState[activeTab].question,
      },
    });
  }, [activeTab, deckState, captureEvent, router]);

  const tabsConfig = TABS_CONFIG.map((config) => ({
    ...config,
    icon: () => {
      const hasEntry =
        config.value === EntryType.MorningReflection
          ? todayMorningEntry
          : todayEveningEntry;

      if (hasEntry) {
        return <TickIcon width={16} height={16} />;
      }

      const Icon = entryTypeMap[config.value].icon;
      return (
        <Icon
          width={16}
          height={16}
          color={entryTypeMap[config.value].iconColor}
        />
      );
    },
  }));

  const tabsContent = TABS_CONFIG.map((config) => {
    const hasEntry =
      config.value === EntryType.MorningReflection
        ? todayMorningEntry
        : todayEveningEntry;

    if (hasEntry) {
      return (
        <View paddingHorizontal={20} paddingTop={16}>
          <Pressable
            onPress={async () => {
              await triggerHaptic();
              router.push({
                pathname: "/notes/[id]",
                params: { id: hasEntry.id, from: "/home" },
              });
            }}
            key={hasEntry.id}
          >
            <EntryCard entry={hasEntry} backgroundColor={Colors.lightGray} />
          </Pressable>
        </View>
      );
    }

    return (
      <AnimatedCardDeck
        key={config.value}
        riveFile={
          config.value === EntryType.MorningReflection
            ? "morning_reflection"
            : "evening_reflection"
        }
        riveRef={
          config.value === EntryType.MorningReflection
            ? morningRiveRef
            : eveningRiveRef
        }
        currentQuestion={deckState[config.value].question}
        handleShuffle={handleShuffle}
        handleTap={handleCardTap}
      />
    );
  });

  return (
    <Tabs<EntryType>
      tabs={tabsConfig.map((config, index) => ({
        ...config,
        content: tabsContent[index],
      }))}
      activeTab={activeTab}
      onChangeTab={setActiveTab}
    />
  );
}
