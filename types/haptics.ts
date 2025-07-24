import * as Haptics from "expo-haptics";

export type HapticType = "impact" | "notification" | "selection";

export type HapticOptions = {
  type?: HapticType;
  style?: Haptics.ImpactFeedbackStyle;
  notificationType?: Haptics.NotificationFeedbackType;
};
