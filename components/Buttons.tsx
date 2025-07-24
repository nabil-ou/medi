import Colors from "@/constants/Colors";
import { styled, Button as TamaguiButton } from "tamagui";
import { HAPTIC_CONFIGS } from "@/constants/haptics";
import { useHaptics } from "@/hooks/useHaptics";
import { HapticOptions } from "@/types/haptics";

export function Button({
  primary,
  secondary,
  ghost,
  disabled,
  haptics = true,
  hapticOptions = HAPTIC_CONFIGS.soft,
  ...props
}: {
  primary?: boolean;
  secondary?: boolean;
  ghost?: boolean;
  disabled?: boolean;
  [key: string]: any;
  haptics?: boolean;
  hapticOptions?: HapticOptions;
}) {
  const triggerHaptic = useHaptics(hapticOptions);

  const StyledButton = styled(TamaguiButton, {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    pressStyle: {
      scale: 0.98,
    },

    variants: {
      primary: {
        true: {
          backgroundColor: disabled ? Colors.gray : Colors.black,
          borderColor: disabled ? Colors.gray : Colors.black,
          pressStyle: {
            backgroundColor: disabled ? Colors.gray : Colors.black,
            borderColor: disabled ? Colors.gray : Colors.black,
          },
        },
      },
      secondary: {
        true: {
          backgroundColor: "transparent",
          borderColor: disabled ? Colors.gray : Colors.black,
          pressStyle: {
            backgroundColor: "transparent",
            borderColor: disabled ? Colors.gray : Colors.black,
          },
        },
      },
      ghost: {
        true: {
          backgroundColor: "transparent",
          borderColor: "transparent",
          pressStyle: {
            backgroundColor: "transparent",
            borderColor: "transparent",
          },
        },
      },
    },
  } as const);

  return (
    <StyledButton
      primary={primary}
      secondary={secondary}
      ghost={ghost}
      disabled={disabled}
      {...props}
      onPress={async (e) => {
        if (haptics && !disabled) {
          await triggerHaptic();
        }
        props.onPress?.(e);
      }}
    />
  );
}

export function ButtonText({
  primary,
  secondary,
  ghost,
  disabled,
  ...props
}: {
  primary?: boolean;
  secondary?: boolean;
  ghost?: boolean;
  disabled?: boolean;
  [key: string]: any;
}) {
  const StyledButtonText = styled(TamaguiButton.Text, {
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: 14,

    variants: {
      primary: {
        true: {
          color: Colors.white,
        },
      },
      secondary: {
        true: {
          color: disabled ? Colors.gray : Colors.black,
        },
      },
      ghost: {
        true: {
          color: disabled ? Colors.gray : Colors.black,
        },
      },
    },
  } as const);

  return (
    <StyledButtonText
      primary={primary}
      secondary={secondary}
      ghost={ghost}
      {...props}
    />
  );
}
