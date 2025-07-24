import { Check } from "@tamagui/lucide-icons";
import { format } from "date-fns";
import React from "react";
import { Circle, Text, XStack, YStack } from "tamagui";

export interface WeekDate {
  date: Date;
  completed: boolean;
  isSelected: boolean;
  isEmphasized: boolean;
}

interface CalendarProps {
  weekDates: WeekDate[];
  onPress?: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ weekDates, onPress }) => {
  return (
    <XStack justifyContent="space-between" padding="$3.5">
      {weekDates.map((item, index) => {
        const isCompleted = item.completed;

        return (
          <YStack
            key={index}
            width={"$4"}
            gap={"$2"}
            borderRadius={"$10"}
            justifyContent="space-between"
            alignItems="center"
            backgroundColor={item.isEmphasized ? "$green10" : "$pink10"}
            paddingVertical={8}
            onPress={() => onPress && onPress(item.date)}
          >
            <UpperWeekDateLabel weekDate={item} />
            {isCompleted ? (
              <CompletedCalendar weekDate={item} />
            ) : (
              <DayNumberCircle weekDate={item} />
            )}
          </YStack>
        );
      })}
    </XStack>
  );
};

const UpperWeekDateLabel = ({ weekDate }: { weekDate: WeekDate }) => (
  <Text fontWeight="800" color={weekDate.isEmphasized ? "$white" : "$grey300"}>
    {format(weekDate.date, "E").slice(0, 2)}
  </Text>
);

const CompletedCalendar = ({ weekDate }: { weekDate: WeekDate }) => {
  return (
    <Circle
      size={30}
      justifyContent="center"
      alignItems="center"
      backgroundColor="white"
    >
      <Check color="black" />
    </Circle>
  );
};

const DayNumberCircle = ({ weekDate }: { weekDate: WeekDate }) => (
  <Circle
    size={30}
    justifyContent="center"
    alignItems="center"
    backgroundColor="white"
  >
    <Text color="black">{format(weekDate.date, "d")}</Text>
  </Circle>
);
