import { StorageKeys } from "@/constants/StorageKeys";
import { EntryRecord } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDateOnly } from "./dateFormatters";

export function computeStreak(eventDates: EntryRecord, baseDate: Date): number {
  const filteredDates = Object.keys(eventDates)
    .map((dateStr) => getDateOnly(new Date(dateStr)))
    .filter((d) => d.getTime() <= getDateOnly(baseDate).getTime())
    .sort((a, b) => b.getTime() - a.getTime());

  if (filteredDates.length === 0) return 0;

  let streak = 1;
  let lastDate = filteredDates[0];

  if (differenceInDays(getDateOnly(baseDate), lastDate) > 1) {
    return 0;
  }

  for (let i = 1; i < filteredDates.length; i++) {
    const currentDate = filteredDates[i];

    const diff = differenceInDays(lastDate, currentDate);

    if (diff === 1) {
      streak++;
      lastDate = currentDate;
    } else if (diff === 0) {
      continue;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Returns the difference in number of days (d1 - d2).
 * Ex: differenceInDays(2025-01-20, 2025-01-19) = 1
 */
function differenceInDays(d1: Date, d2: Date): number {
  const msInDay = 1000 * 3600 * 24;
  return Math.floor((d1.getTime() - d2.getTime()) / msInDay);
}

export async function getCurrentStreak(): Promise<number> {
  try {
    const storedEvents = await AsyncStorage.getItem(
      StorageKeys.JOURNAL_ENTRIES,
    );
    if (!storedEvents) return 0;

    const events: EntryRecord = JSON.parse(storedEvents);
    return computeStreak(events, new Date());
  } catch (error) {
    console.error("Error computing current streak:", error);
    return 0;
  }
}
