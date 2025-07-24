import { Button, styled } from "tamagui";

export const OnboardingButton = styled(Button, {
  backgroundColor: "#232323",
  borderColor: "#232323",
  borderRadius: "$20",
  padding: "$4",
  alignSelf: "center",
  height: "$6",
  minWidth: "$14",
  alignItems: "center",
  justifyContent: "center",
  pressStyle: {
    backgroundColor: "#2B2B2B",
    borderColor: "#2B2B2B",
  },
  disabledStyle: {
    backgroundColor: "#2B2B2B",
    borderColor: "#2B2B2B",
  },
});
