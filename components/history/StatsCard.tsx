import Colors from "@/constants/Colors";
import { Check, Clock, AlertTriangle } from "@tamagui/lucide-icons";
import { Square, Text, XStack, YStack } from "tamagui";

interface StatsCardProps {
  selectedDate: Date;
  takenCount: number;
  totalCount: number;
}

const StatsCard = ({
  selectedDate,
  takenCount,
  totalCount,
}: StatsCardProps) => {
  const percentage =
    totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  // Déterminer l'état selon le pourcentage
  const getCompletionStatus = () => {
    if (totalCount === 0) {
      return {
        icon: Clock,
        color: "#6B7280",
        backgroundColor: "#F3F4F6",
        label: "Aucun médicament programmé",
      };
    }

    if (percentage === 100) {
      return {
        icon: Check,
        color: "#10B981",
        backgroundColor: "#E8F5E8",
        label: "Tous pris",
      };
    }

    if (percentage > 0) {
      return {
        icon: Clock,
        color: "#F59E0B",
        backgroundColor: "#FEF3C7",
        label: "Partiellement pris",
      };
    }

    return {
      icon: AlertTriangle,
      color: "#EF4444",
      backgroundColor: "#FEE2E2",
      label: "Aucun pris",
    };
  };

  const status = getCompletionStatus();
  const StatusIcon = status.icon;

  return (
    <XStack
      alignItems="center"
      gap={12}
      padding={16}
      borderRadius={16}
      backgroundColor={Colors.white}
      borderWidth={1}
      borderColor={Colors.lightGray}
      shadowColor={Colors.black}
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.05}
      shadowRadius={4}
      marginBottom={8}
    >
      <Square
        size={32}
        backgroundColor={status.backgroundColor}
        borderRadius={12}
        alignItems="center"
        justifyContent="center"
      >
        <StatusIcon size={20} color={status.color} strokeWidth={2.5} />
      </Square>

      <YStack flex={1} gap={4}>
        <Text fontSize={14} fontWeight="600" color={Colors.darkGray}>
          {selectedDate.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
        <Text fontSize={12} color={Colors.gray}>
          {totalCount === 0
            ? status.label
            : `${takenCount} sur ${totalCount} médicaments pris`}
        </Text>
      </YStack>

      <Text fontSize={18} color={status.color}>
        {totalCount === 0 ? "--" : `${percentage}%`}
      </Text>
    </XStack>
  );
};

export default StatsCard;
