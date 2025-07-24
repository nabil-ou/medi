import { Sheet, Text, View, YStack } from "tamagui";
import * as Haptics from "expo-haptics";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { TouchableOpacity } from "react-native";
import { BriefcaseMedical, X } from "@tamagui/lucide-icons";
import { Medication } from "@/utils/storage";

type NotificationsBottomSheetProps = {
  onClose: () => void;
  isOpen: boolean;
  todaysMedications: Medication[];
};

const NotificationsBottomSheet = ({
  onClose,
  isOpen,
  todaysMedications,
}: NotificationsBottomSheetProps) => {
  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onClose();
      }}
      dismissOnSnapToBottom
      position={0}
    >
      <Sheet.Overlay />
      <Sheet.Frame
        borderTopLeftRadius="$9"
        borderTopRightRadius="$9"
        backgroundColor={Colors.white}
        padding={20}
      >
        <YStack flex={1} width={"100%"} gap={"$6"}>
          <Text fontSize={20} fontWeight="bold" color={Colors.darkGray}>
            Notifications
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={{
              padding: 10,
              borderRadius: 10,
            }}
          >
            <X size={24} color={Colors.black} />
          </TouchableOpacity>
          <Sheet.ScrollView
            flex={1}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              gap: 24,
            }}
          >
            {todaysMedications.map((medication) => (
              <View
                backgroundColor={Colors.white}
                padding={10}
                borderRadius={12}
                shadowColor={Colors.black}
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.05}
                shadowRadius={8}
              >
                <View>
                  <BriefcaseMedical size={24} color={Colors.darkGray} />
                </View>
                <View flex={1}>
                  <Text fontSize={16} fontWeight="bold" color={Colors.darkGray}>
                    {medication.name}
                  </Text>
                  <Text fontSize={14} color={Colors.gray}>
                    {medication.dosage}
                  </Text>
                  <Text fontSize={12} color={Colors.gray}>
                    {medication.times[0]}
                  </Text>
                </View>
              </View>
            ))}
          </Sheet.ScrollView>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};

export default NotificationsBottomSheet;
