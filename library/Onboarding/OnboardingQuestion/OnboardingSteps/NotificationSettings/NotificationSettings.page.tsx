import { Button } from "@/components/Buttons";
import { Title1 } from "@/components/Text";
import Colors from "@/constants/Colors";
import { useUser } from "@/contexts/UserContext";
import { ReminderSettings } from "@/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Switch,
} from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";
import { NotificationSettingsStepType } from "../../type";

function TimeSelector({
  value,
  onChange,
  disabled,
}: {
  value: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
}) {
  return (
    <DateTimePicker
      value={value}
      mode="time"
      onChange={(_, date) => date && onChange(date)}
      accentColor={Colors.black}
      disabled={disabled}
    />
  );
}

function ReminderRow({
  title,
  imageUrl,
  settings,
  onToggle,
  onTimeChange,
}: {
  title: string;
  imageUrl: string;
  settings: ReminderSettings;
  onToggle: (value: boolean) => void;
  onTimeChange: (date: Date) => void;
}) {
  const date = new Date();
  date.setHours(settings.hour, settings.minute);

  return (
    <YStack gap="$2">
      <Text
        fontFamily="Inter"
        fontWeight="400"
        fontSize={16}
        color={Colors.gray}
      >
        {title}
      </Text>
      <XStack
        alignItems="center"
        justifyContent="space-between"
        backgroundColor={Colors.white}
        borderWidth={1}
        borderColor={Colors.lightGray}
        padding="$4"
        borderRadius="$6"
      >
        <XStack alignItems="center" gap="$2.5">
          <Image source={{ uri: imageUrl }} width={32} height={32} />
          <TimeSelector
            value={date}
            onChange={onTimeChange}
            disabled={!settings.enabled}
          />
        </XStack>
        <Switch value={settings.enabled} onValueChange={onToggle} />
      </XStack>
    </YStack>
  );
}

export function NotificationSettingsPage({
  step,
  onNext,
}: {
  step: NotificationSettingsStepType;
  onNext: (args?: string | string[]) => void;
}) {
  const { initializeNotifications } = useUser();
  const [reminderSettings, setReminderSettings] = useState<
    Record<string, ReminderSettings>
  >(() =>
    step.payload.reminders.reduce(
      (acc, reminder) => ({
        ...acc,
        [reminder.id]: {
          enabled: reminder.defaultEnabled,
          hour: reminder.defaultTime.hour,
          minute: reminder.defaultTime.minute,
        },
      }),
      {},
    ),
  );

  const handleConfirm = async () => {
    const hasEnabledReminders = Object.values(reminderSettings).some(
      (settings) => settings.enabled,
    );
    if (hasEnabledReminders) {
      await initializeNotifications(reminderSettings);
    }
    onNext();
  };

  const content = (
    <SafeAreaView style={styles.safeAreaView}>
      <YStack flex={1} paddingHorizontal="$5" paddingBottom="$5">
        <YStack flex={2} gap="$5" justifyContent="center">
          {step.payload.description && (
            <Text
              fontFamily="Inter"
              fontWeight="400"
              fontSize={18}
              color={Colors.black}
            >
              {step.payload.description}
            </Text>
          )}
          <Title1>{step.payload.title}</Title1>
        </YStack>

        <YStack flex={3} gap="$5" justifyContent="center">
          {step.payload.reminders.map((reminder) => (
            <ReminderRow
              key={reminder.id}
              title={reminder.title}
              imageUrl={reminder.imageUrl}
              settings={reminderSettings[reminder.id]}
              onToggle={(enabled) =>
                setReminderSettings((prev) => ({
                  ...prev,
                  [reminder.id]: { ...prev[reminder.id], enabled },
                }))
              }
              onTimeChange={(date) =>
                setReminderSettings((prev) => ({
                  ...prev,
                  [reminder.id]: {
                    ...prev[reminder.id],
                    hour: date.getHours(),
                    minute: date.getMinutes(),
                  },
                }))
              }
            />
          ))}
        </YStack>

        <Button primary width="70%" alignSelf="center" onPress={handleConfirm}>
          <Text fontFamily="Inter" fontWeight="400" fontSize={16} color="white">
            Confirm
          </Text>
        </Button>
      </YStack>
    </SafeAreaView>
  );

  return step.payload.backgroundImageUrl ? (
    <ImageBackground
      source={{ uri: step.payload.backgroundImageUrl }}
      style={{ flex: 1 }}
    >
      {content}
    </ImageBackground>
  ) : (
    content
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
});
