export const StorageKeys = {
  USER_NAME: "userName",
  JOURNALING_GOALS: "journalingGoals",
  JOURNALING_EXPERIENCE: "journalingExperience",
  GRATITUDE_FOCUS: "gratitudeFocus",
  HAS_COMPLETED_ONBOARDING: "hasCompletedOnboarding",
  HAS_USED_WHATS_ON_YOUR_MIND: "hasUsedWhatsOnYourMind",
  GO_DEEPER_COUNT: "goDeeperCount",
  JOURNAL_ENTRIES: "journalEntries",
  WEEKLY_INSIGHTS: "weeklyInsights",
  LAST_STREAK_MODAL_SHOWN_DATE: "lastStreakModalShownDate",
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
