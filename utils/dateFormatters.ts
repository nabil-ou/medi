function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) return "th";

  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

/**
 * Formats a date with the ordinal suffix (e.g. "January 1st")
 * @param date - The date to format
 * @returns The formatted date string
 */
export function formatDateWithOrdinal(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const day = dateObj.getDate();
  const formatter = new Intl.DateTimeFormat("en-US", { month: "long" });
  return `${formatter.format(dateObj)} ${day}${getDaySuffix(day)}`;
}

/**
 * Formats a date in long format (e.g. "January 1, 2025")
 * @param date - The date to format
 * @returns The formatted date string
 */
export function formatDateLong(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const formatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  });
  return formatter.format(dateObj);
}

/**
 * Returns a date object with only the date part (no time)
 * @param date - The date to format
 * @returns The formatted date object
 */
export function getDateOnly(date: Date | string): Date {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Date(
    Date.UTC(
      dateObj.getUTCFullYear(),
      dateObj.getUTCMonth(),
      dateObj.getUTCDate(),
    ),
  );
}

/**
 * Formats a date to return a string like "Monday, September 7th"
 * @param date - The date to format
 * @returns The formatted date string
 */
export function formatDateWithDay(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const dayOfWeek = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  }).format(dateObj);
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    dateObj,
  );
  const day = dateObj.getDate();
  return `${dayOfWeek}, ${month} ${day}${getDaySuffix(day)}`;
}

/**
 * Returns a string indicating the week range (Sunday to Saturday) like "12-18 January"
 * @param date - The reference date
 * @returns A string with the format: "dd-dd Month"
 */
export function getWeekDateRange(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const sunday = new Date(dateObj);
  // detemine the sunday (day 0 = sunday)
  sunday.setDate(dateObj.getDate() - dateObj.getDay());

  // determine the saturday (6 days after the sunday)
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);

  // get the month name
  const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });

  // if the sunday and saturday are in the same month
  if (sunday.getMonth() === saturday.getMonth()) {
    const month = monthFormatter.format(sunday);
    return `${sunday.getDate()}-${saturday.getDate()} ${month}`;
  } else {
    // if the week spans two months, display something like "30 January-5 February"
    const sundayMonth = monthFormatter.format(sunday);
    const saturdayMonth = monthFormatter.format(saturday);
    return `${sunday.getDate()} ${sundayMonth}-${saturday.getDate()} ${saturdayMonth}`;
  }
}

export function getWeekDateRangeFromId(insightId: string): string {
  // Split insightId
  const parts = insightId.split("-");
  // parts = ["weekly", "insight", "2025", "01", "12", "2025", "01", "18"]

  if (parts.length !== 8) {
    return "Invalid ID format";
  }

  const [_, __, startY, startM, startD, endY, endM, endD] = parts;

  // Build the 2 dates
  const startDate = new Date(
    Number(startY),
    Number(startM) - 1,
    Number(startD),
  );
  const endDate = new Date(Number(endY), Number(endM) - 1, Number(endD));

  // Format "Month" (January, February, etc.)
  const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });

  // Check if it's the same month + the same year
  if (
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  ) {
    // Ex : "12-18 January 2025"
    const monthName = monthFormatter.format(startDate);
    return `${startDate.getDate()}-${endDate.getDate()} ${monthName} ${startDate.getFullYear()}`;
  } else {
    // Ex : "30 January-5 February 2025" or "30 December 2024-5 January 2025" if the year changes
    const startMonth = monthFormatter.format(startDate);
    const endMonth = monthFormatter.format(endDate);

    // If the year is different
    if (startDate.getFullYear() === endDate.getFullYear()) {
      // "30 January-5 February 2025"
      return `${startDate.getDate()} ${startMonth}-${endDate.getDate()} ${endMonth} ${startDate.getFullYear()}`;
    } else {
      // "30 December 2024-5 January 2025" (year difference)
      return `${startDate.getDate()} ${startMonth} ${startDate.getFullYear()}-${endDate.getDate()} ${endMonth} ${endDate.getFullYear()}`;
    }
  }
}

/**
 * Returns a short week range (e.g. "Jan 07 - Jan 12") based on the given date.
 * The range goes from the Sunday of that week to the following Saturday.
 */

export function getShortWeekDateRange(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const sunday = new Date(dateObj);
  sunday.setDate(dateObj.getDate() - dateObj.getDay());

  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
  });

  const start = formatter.format(sunday); // e.g. "Jan 07"
  const end = formatter.format(saturday); // e.g. "Jan 12"

  return `${start} - ${end}`;
}
