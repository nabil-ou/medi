import { HapticOptions } from "@/types/haptics";
import * as Haptics from "expo-haptics";

export const HAPTIC_CONFIGS = {
  soft: {
    type: "impact",
    style: Haptics.ImpactFeedbackStyle.Soft,
  } as HapticOptions,
  rigid: {
    type: "impact",
    style: Haptics.ImpactFeedbackStyle.Rigid,
  } as HapticOptions,
  light: {
    type: "impact",
    style: Haptics.ImpactFeedbackStyle.Light,
  } as HapticOptions,
  medium: {
    type: "impact",
    style: Haptics.ImpactFeedbackStyle.Medium,
  } as HapticOptions,
  heavy: {
    type: "impact",
    style: Haptics.ImpactFeedbackStyle.Heavy,
  } as HapticOptions,
  success: {
    type: "notification",
    notificationType: Haptics.NotificationFeedbackType.Success,
  } as HapticOptions,
  warning: {
    type: "notification",
    notificationType: Haptics.NotificationFeedbackType.Warning,
  } as HapticOptions,
  error: {
    type: "notification",
    notificationType: Haptics.NotificationFeedbackType.Error,
  } as HapticOptions,
  selection: { type: "selection" } as HapticOptions,
} as const;
