import { XStack, Text, View, Circle, Stack } from "tamagui";
import Colors from "@/constants/Colors";
import { Medication } from "@/utils/storage";
import { CheckCircle2, Pill } from "@tamagui/lucide-icons";
import { TouchableOpacity } from "react-native";
import { MEDICATION_TYPES } from "@/constants/MedicationTypes";

interface MedicationCardProps {
  medication: Medication;
  taken: boolean;
  recordDose: (
    medicationId: string,
    taken: boolean,
    timestamp: string,
    scheduledTime: string,
  ) => void;
  loadData: () => void;
  isPastDate?: boolean;
  isFutureDate?: boolean;
  onPress?: () => void;
}

const MedicationCard = ({
  medication,
  taken,
  recordDose,
  loadData,
  isPastDate = false,
  isFutureDate = false,
  onPress,
}: MedicationCardProps) => {
  const Icon =
    MEDICATION_TYPES.find((type) => type.id === medication.medicationType)
      ?.icon || Pill; // Icône par défaut si non trouvée

  const medicationColor = medication.color || Colors.primary; // Couleur par défaut

  return (
    <XStack
      alignItems="center"
      gap={12}
      padding={16}
      borderRadius={16}
      backgroundColor={Colors.white}
      borderWidth={1}
      borderColor={Colors.lightGray}
      borderLeftWidth={6}
      borderLeftColor={medicationColor}
      key={medication.id}
      shadowColor={Colors.black}
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.05}
      shadowRadius={4}
      onPress={onPress}
      pressStyle={onPress ? { scale: 0.98, opacity: 0.8 } : undefined}
      cursor={onPress ? "pointer" : "default"}
    >
      <Circle
        size={48}
        backgroundColor={`${medicationColor}20`}
        alignItems="center"
        justifyContent="center"
      >
        <Icon size={24} color={medicationColor} />
      </Circle>

      {/* Informations du médicament */}
      <View flex={1} gap={4}>
        <Text fontSize={16} fontWeight="700" color={Colors.darkGray}>
          {medication.name}
        </Text>
        <Text fontSize={14} color={Colors.gray}>
          {medication.dosage}{" "}
          {medication.dosageUnit ? `${medication.dosageUnit}` : ""}
          {medication.quantity ? ` - ${medication.quantity} ` : ""}
          {medication.quantityUnit ? `${medication.quantityUnit}` : ""}
        </Text>
      </View>
      {/* Heure et statut */}
      <View alignItems="flex-end" justifyContent="space-between" gap={8}>
        {taken ? (
          <XStack
            alignItems="center"
            gap={4}
            backgroundColor="#E8F5E8"
            paddingHorizontal={8}
            paddingVertical={4}
            borderRadius={20}
          >
            <CheckCircle2 size={16} color="#4CAF50" />
            <Text fontSize={12} fontWeight="600" color="#4CAF50">
              Pris
            </Text>
          </XStack>
        ) : isPastDate ? (
          <XStack
            alignItems="center"
            gap={4}
            backgroundColor="#FEE2E2"
            paddingHorizontal={8}
            paddingVertical={4}
            borderRadius={20}
          >
            <Text fontSize={12} fontWeight="600" color="#EF4444">
              Manqué
            </Text>
          </XStack>
        ) : isFutureDate ? (
          <View
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 20,
              backgroundColor: "#F3F4F6",
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <Text color="#9CA3AF" fontSize={12} fontWeight="600">
              Programmé
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={async () => {
              await recordDose(
                medication.id,
                true,
                new Date().toISOString(),
                medication.times[0],
              );
              loadData();
            }}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 20,
              backgroundColor: Colors.primary,
            }}
            disabled={isFutureDate}
          >
            <Text color={Colors.white} fontSize={12} fontWeight="600">
              Prendre
            </Text>
          </TouchableOpacity>
        )}
        <Text
          fontSize={14}
          fontWeight="600"
          color={Colors.darkGray}
          marginRight={6}
        >
          {medication.times[0]}
        </Text>
      </View>
    </XStack>
  );
};

export default MedicationCard;
