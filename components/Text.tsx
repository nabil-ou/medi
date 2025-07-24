import Colors from "@/constants/Colors";
import { styled, Text } from "tamagui";

export const Title1 = styled(Text, {
  fontFamily: "Recoleta",
  fontSize: 32,
  fontWeight: 600,
  color: Colors.black,
});

export const Title2 = styled(Text, {
  fontFamily: "Recoleta",
  fontSize: 24,
  fontWeight: 600,
  color: Colors.black,
});

export const Title3 = styled(Text, {
  fontFamily: "Recoleta",
  fontSize: 18,
  fontWeight: 600,
  color: Colors.black,
});

export const TagLabel = styled(Text, {
  fontFamily: "Inter",
  fontSize: 12,
  fontWeight: 400,
  color: Colors.black,
});

export const OnboardingBodyText = styled(Text, {
  fontFamily: "InterLight",
  fontSize: 20,
  fontWeight: 300,
  color: Colors.black,
  textAlign: "center",
});
