import { PaywallPresentationHandler } from "@superwall/react-native-superwall";
import { useMemo } from "react";

export function useSuperwallHandler(
  checkPremiumStatus: () => Promise<void>,
  captureEvent: (event: string, properties: Record<string, any>) => void,
) {
  return useMemo(() => {
    const handler = new PaywallPresentationHandler();

    const handleEvent = (event: string, data: any) => {
      checkPremiumStatus();
      captureEvent(event, data);
      console.debug(`Handler (${event}): ${JSON.stringify(data)}`);
    };

    handler.onPresent((paywallInfo) =>
      handleEvent("paywall_presented", { paywallInfo }),
    );
    handler.onDismiss((paywallInfo) =>
      handleEvent("paywall_dismissed", { paywallInfo }),
    );
    handler.onError((error) => handleEvent("paywall_error", { error }));
    handler.onSkip((skipReason) =>
      handleEvent("paywall_skipped", { skipReason }),
    );

    return handler;
  }, [captureEvent, checkPremiumStatus]);
}
