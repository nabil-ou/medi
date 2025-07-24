import Colors from "@/constants/Colors";
import {
  AlertCircle,
  BriefcaseMedical,
  Keyboard,
  ScanFace,
} from "@tamagui/lucide-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import { Stack, Text, XStack, YStack } from "tamagui";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const AuthScreen = () => {
  const router = useRouter();

  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    setHasBiometrics(hasHardware && isEnrolled);
  };

  const authenticate = async () => {
    try {
      setIsAuthenticated(true);
      setError(null);

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedType =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage:
          hasHardware && isEnrolled
            ? "Use face ID/TouchID"
            : "Enter your PIN to acess medications",
        fallbackLabel: "Use PIN",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (auth.success) {
        router.replace("/(tabs)");
      } else {
        setError("Authentication failed");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <LinearGradient
      colors={[Colors.primaryDark, Colors.primary]}
      style={{ flex: 1 }}
    >
      <Stack
        flex={1}
        justifyContent="center"
        alignItems="center"
        padding="$4"
        gap="$8"
      >
        <YStack justifyContent="center" alignItems="center" gap="$3">
          <Stack
            width={120}
            height={120}
            borderRadius={60}
            justifyContent="center"
            alignItems="center"
            backgroundColor={Colors.primary}
          >
            <BriefcaseMedical size={60} color={Colors.white} />
          </Stack>
          <YStack justifyContent="center" alignItems="center" gap="$2">
            <Text fontSize="$9" fontWeight="bold" color={Colors.white}>
              July
            </Text>
            <Text fontSize="$6" textAlign="center" color={Colors.white}>
              Your Personal Medication Reminder
            </Text>
          </YStack>
        </YStack>
        <YStack
          padding="$4"
          width={width - 40}
          alignItems="center"
          shadowColor={Colors.black}
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.25}
          shadowRadius={3.84}
          elevation={5}
          borderRadius={10}
          backgroundColor={Colors.white}
          gap="$6"
        >
          <YStack gap="$2" alignItems="center">
            <Text fontSize={24} fontWeight="bold" color={Colors.black}>
              Welcome Back!
            </Text>
            <Text fontSize={16} textAlign="center" color={Colors.black}>
              {hasBiometrics
                ? "Use face ID/TouchID or PIN to access your medications"
                : "Enter your PIN to access your medications"}
            </Text>
          </YStack>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.primary,
              paddingVertical: 15,
              paddingHorizontal: 30,
              borderRadius: 12,
              gap: 10,
              width: "100%",
            }}
            onPress={() => {
              authenticate();
            }}
          >
            {hasBiometrics ? (
              <ScanFace size={24} color={Colors.white} />
            ) : (
              <Keyboard size={24} color={Colors.white} />
            )}
            <Text fontSize={16} fontWeight="bold" color={Colors.white}>
              {isAuthenticated
                ? "Verifying"
                : hasBiometrics
                  ? "Authenticate"
                  : "Enter PIN"}
            </Text>
          </TouchableOpacity>

          {error && (
            <XStack alignItems="center" gap="$2">
              <AlertCircle size={20} color={Colors.error} />
              <Text color={Colors.error} fontSize={14}>
                {error}
              </Text>
            </XStack>
          )}
        </YStack>
      </Stack>
    </LinearGradient>
  );
};

export default AuthScreen;
