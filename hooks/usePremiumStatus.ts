import Superwall, {
  SubscriptionStatus,
} from "@superwall/react-native-superwall";
import { useCallback, useState } from "react";

export function usePremiumStatus(posthog: any) {
  const [userIsPremium, setUserIsPremium] = useState(false);

  const checkPremiumStatus = useCallback(async () => {
    try {
      const hasActiveSubscription =
        await Superwall.shared.getSubscriptionStatus();
      console.debug("hasActiveSubscription", hasActiveSubscription);
      const isPremium = hasActiveSubscription === SubscriptionStatus.ACTIVE;
      setUserIsPremium(isPremium);
      posthog?.capture("$set", { $set: { is_premium: isPremium } });
    } catch (error) {
      console.error("Failed to fetch premium status:", error);
      setUserIsPremium(false);
    }
  }, [posthog]);

  return { userIsPremium, checkPremiumStatus };
}
