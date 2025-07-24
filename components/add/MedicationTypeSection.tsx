import Colors from "@/constants/Colors";
import {
  MEDICATION_TYPES,
  type MedicationType,
} from "@/constants/MedicationTypes";
import { Text, YStack } from "tamagui";
import { Dimensions, FlatList, TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");

interface MedicationTypeSectionProps {
  form: any;
  setForm: (form: any) => void;
  error?: string;
  onErrorClear?: () => void;
}

const MedicationTypeSection = ({
  form,
  setForm,
  error,
  onErrorClear,
}: MedicationTypeSectionProps) => {
  const renderMedicationType = ({ item }: { item: MedicationType }) => {
    const Icon = item.icon;
    return (
      <TouchableOpacity
        onPress={() => {
          setForm({ ...form, medicationType: item.id });
          if (error && onErrorClear) {
            onErrorClear();
          }
        }}
        style={{
          width: (width - 52) / 4 - 6,
          backgroundColor:
            form.medicationType === item.id ? `${item.color}20` : Colors.white,
          borderRadius: 16,
          padding: 12,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderColor:
            form.medicationType === item.id ? item.color : Colors.lightGray,
          gap: 8,
          minHeight: 100,
        }}
      >
        <Icon size={20} color={item.color} />
        <Text
          fontSize={12}
          fontWeight="600"
          textAlign="center"
          numberOfLines={1}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <YStack gap={10}>
      <Text fontSize={14}>Type de médicament *</Text>
      <FlatList
        data={MEDICATION_TYPES}
        renderItem={renderMedicationType}
        keyExtractor={(item) => item.id}
        numColumns={4}
        columnWrapperStyle={{
          justifyContent: "space-between",
          gap: 12,
        }}
        contentContainerStyle={{
          gap: 12,
        }}
        scrollEnabled={false}
      />
      {error && (
        <Text color={Colors.error} fontSize={12} marginLeft={12}>
          {error}
        </Text>
      )}
    </YStack>
  );
};

export default MedicationTypeSection;
