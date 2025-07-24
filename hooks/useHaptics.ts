import { HAPTIC_CONFIGS } from "@/constants/haptics";
import { HapticOptions } from "@/types/haptics";
import * as Haptics from "expo-haptics";

export function useHaptics(options: HapticOptions = HAPTIC_CONFIGS.soft) {
  return async () => {
    try {
      switch (options.type) {
        case "impact":
          await Haptics.impactAsync(
            options.style ?? Haptics.ImpactFeedbackStyle.Soft,
          );
          break;
        case "notification":
          await Haptics.notificationAsync(
            options.notificationType ??
              Haptics.NotificationFeedbackType.Success,
          );
          break;
        case "selection":
          await Haptics.selectionAsync();
          break;
        default:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      }
    } catch (error) {
      console.warn("[Haptics] Failed to trigger haptic feedback:", error);
    }
  };
}
