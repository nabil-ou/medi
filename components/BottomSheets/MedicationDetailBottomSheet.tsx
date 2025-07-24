import { Sheet, Text, View, YStack, XStack } from "tamagui";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/Colors";
import { TouchableOpacity } from "react-native";
import { X, Clock, Calendar, Pill } from "@tamagui/lucide-icons";
import { Medication } from "@/utils/storage";
import { MEDICATION_TYPES } from "@/constants/MedicationTypes";

type MedicationDetailBottomSheetProps = {
  onClose: () => void;
  isOpen: boolean;
  medication: Medication | null;
};

const MedicationDetailBottomSheet = ({
  onClose,
  isOpen,
  medication,
}: MedicationDetailBottomSheetProps) => {
  if (!medication) return null;

  const medicationType = MEDICATION_TYPES.find(
    (type) => type.id === medication.medicationType,
  );
  const TypeIcon = medicationType?.icon || Pill;

  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onClose();
      }}
      dismissOnSnapToBottom
      snapPointsMode="fit"
    >
      <Sheet.Overlay />
      <Sheet.Frame
        borderTopLeftRadius="$9"
        borderTopRightRadius="$9"
        backgroundColor={Colors.white}
        paddingHorizontal={20}
        paddingTop={40}
        paddingBottom={60}
      >
        <YStack flex={1} width="100%" gap={20}>
          <XStack alignItems="center" justifyContent="space-between" gap={16}>
            <View
              width={60}
              height={60}
              backgroundColor={`${medication.color}20`}
              borderRadius={16}
              alignItems="center"
              justifyContent="center"
            >
              <TypeIcon size={30} color={medication.color} />
            </View>
            <YStack flex={1} gap={4}>
              <Text fontSize={18} fontWeight="bold" color={Colors.darkGray}>
                {medication.name}
              </Text>
              <Text fontSize={14} color={Colors.gray}>
                {medicationType?.label || "Médicament"}
              </Text>
            </YStack>
            <TouchableOpacity
              onPress={onClose}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: Colors.lightGray,
              }}
            >
              <X size={20} color={Colors.darkGray} />
            </TouchableOpacity>
          </XStack>

          {/* Medication Info */}
          <YStack gap={16}>
            {/* Dosage Info */}
            {medication.dosage && (
              <View
                backgroundColor={Colors.background}
                padding={16}
                borderRadius={12}
                borderWidth={1}
                borderColor={Colors.lightGray}
              >
                <Text
                  fontSize={14}
                  fontWeight="600"
                  color={Colors.darkGray}
                  marginBottom={8}
                >
                  Dosage
                </Text>
                <Text fontSize={16} color={Colors.darkGray}>
                  {medication.dosage} {medication.dosageUnit}
                  {medication.quantity && ` - ${medication.quantity}`}
                  {medication.quantityUnit && ` ${medication.quantityUnit}`}
                </Text>
              </View>
            )}

            {/* Treatment Period */}
            <View
              backgroundColor={Colors.background}
              padding={16}
              borderRadius={12}
              borderWidth={1}
              borderColor={Colors.lightGray}
            >
              <Text
                fontSize={14}
                fontWeight="600"
                color={Colors.darkGray}
                marginBottom={8}
              >
                Période de traitement
              </Text>
              <XStack alignItems="center" gap={8} marginBottom={8}>
                <Calendar size={16} color={Colors.gray} />
                <Text fontSize={14} color={Colors.darkGray}>
                  Du{" "}
                  {new Date(medication.treatmentStartDate).toLocaleDateString(
                    "default",
                  )}{" "}
                  au{" "}
                  {new Date(medication.treatmentEndDate).toLocaleDateString(
                    "default",
                  )}
                </Text>
              </XStack>
              <Text fontSize={12} color={Colors.gray}>
                Durée : {medication.treatmentDuration} jours
              </Text>
            </View>

            {/* Times */}
            <View
              backgroundColor={Colors.background}
              padding={16}
              borderRadius={12}
              borderWidth={1}
              borderColor={Colors.lightGray}
            >
              <Text
                fontSize={14}
                fontWeight="600"
                color={Colors.darkGray}
                marginBottom={8}
              >
                Heures de prise
              </Text>
              <XStack flexWrap="wrap" gap={8}>
                {medication.times.map((time, index) => (
                  <XStack
                    key={index}
                    alignItems="center"
                    gap={6}
                    backgroundColor={Colors.white}
                    paddingHorizontal={12}
                    paddingVertical={6}
                    borderRadius={16}
                    borderWidth={1}
                    borderColor={Colors.lightGray}
                  >
                    <Clock size={14} color={Colors.gray} />
                    <Text fontSize={14} color={Colors.darkGray}>
                      {time}
                    </Text>
                  </XStack>
                ))}
              </XStack>
            </View>

            {/* Notes */}
            {medication.note && (
              <View
                backgroundColor={Colors.background}
                padding={16}
                borderRadius={12}
                borderWidth={1}
                borderColor={Colors.lightGray}
              >
                <Text
                  fontSize={14}
                  fontWeight="600"
                  color={Colors.darkGray}
                  marginBottom={8}
                >
                  Notes
                </Text>
                <Text fontSize={14} color={Colors.darkGray}>
                  {medication.note}
                </Text>
              </View>
            )}
          </YStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};

export default MedicationDetailBottomSheet;
