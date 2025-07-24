import { WeekDate } from "@/library/Calendar/components/Calendar";
import { addDays, startOfWeek } from "date-fns";

export const getWeekOfDate = (selectedDay: Date): { date: Date }[] => {
  const startOfCurrentWeek = startOfWeek(selectedDay, { weekStartsOn: 1 });

  return Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(startOfCurrentWeek, i);
    return {
      date: date,
    };
  });
};

export const useCalendar = (selectedDay: Date) => {
  const weekDates = getWeekOfDate(selectedDay);
  const dates = weekDates.map((item, i) => ({
    ...item,
    completed: i < 4,
    isSelected: i === 2,
    isEmphasized: i === 4,
  })) satisfies WeekDate[];

  return { dates };
};
