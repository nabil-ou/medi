import { Square, Text, XStack, YStack } from "tamagui";
import Colors from "@/constants/Colors";
import { CheckCircle2, Clock, Pill } from "@tamagui/lucide-icons";
import { ComponentType } from "react";

interface StatsSectionProps {
  completedDoses: number;
  totalDosesForToday: number;
}

interface StatCardProps {
  icon: ComponentType<{ size?: number; color?: string }>;
  color: string;
  backgroundColor: string;
  label: string;
  value: number;
}

const StatCard = ({
  icon: Icon,
  color,
  backgroundColor,
  label,
  value,
}: StatCardProps) => (
  <YStack
    flex={1}
    backgroundColor={Colors.white}
    borderRadius={16}
    borderWidth={1}
    borderColor={Colors.lightGray}
    padding={12}
    alignItems="center"
    shadowColor={Colors.black}
    shadowOffset={{ width: 0, height: 2 }}
    shadowOpacity={0.05}
    shadowRadius={8}
    gap={8}
  >
    <Square
      width={36}
      height={36}
      borderRadius={12}
      backgroundColor={backgroundColor}
      alignItems="center"
      justifyContent="center"
    >
      <Icon size={20} color={color} />
    </Square>
    <Text fontSize={12} color={Colors.darkGray} textAlign="center">
      {label}
    </Text>
    <Text fontSize={20} fontWeight="bold">
      {value}
    </Text>
  </YStack>
);

const StatsSection = ({
  completedDoses,
  totalDosesForToday,
}: StatsSectionProps) => {
  const stats = [
    {
      icon: CheckCircle2,
      color: "#10B981",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      label: "Pris",
      value: completedDoses,
    },
    {
      icon: Clock,
      color: "#F59E0B",
      backgroundColor: "rgba(245, 158, 11, 0.1)",
      label: "En attente",
      value: totalDosesForToday - completedDoses,
    },
    {
      icon: Pill,
      color: "#6366F1",
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      label: "Total",
      value: totalDosesForToday,
    },
  ];

  return (
    <YStack paddingHorizontal={20}>
      <XStack gap={12} justifyContent="space-between">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </XStack>
    </YStack>
  );
};

export default StatsSection;
