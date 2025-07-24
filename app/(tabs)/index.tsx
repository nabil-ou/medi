import { useCallback, useEffect, useState, useMemo } from "react";
import { FlatList, AppState, TouchableOpacity } from "react-native";
import { YStack, Text, View, XStack } from "tamagui";
import { useFocusEffect, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { BriefcaseMedical } from "@tamagui/lucide-icons";
import Header from "@/components/home/Header";
import StatsSection from "@/components/home/StatsSection";
import MedicationCard from "@/components/MedicationCard";
import MedicationDetailBottomSheet from "@/components/BottomSheets/MedicationDetailBottomSheet";
import {
  getMedications,
  getTodayDoses,
  recordDose,
  Medication,
  DoseHistory,
} from "@/utils/storage";
import {
  scheduleMedicationReminder,
  registerForPushNotificationsAsync,
} from "@/utils/notifications";

interface MedicationTimeItem {
  id: string;
  medication: Medication;
  time: string;
  timeIndex: number;
  taken: boolean;
}

export default function HomeScreen() {
  const router = useRouter();
  const { bottom: bottomInset } = useSafeAreaInsets();

  const [medications, setMedications] = useState<Medication[]>([]);
  const [doseHistory, setDoseHistory] = useState<DoseHistory[]>([]);
  const [sortedMedicationTimes, setSortedMedicationTimes] = useState<
    MedicationTimeItem[]
  >([]);
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const totalDosesForToday = useMemo(
    () => medications.reduce((acc, med) => acc + med.times.length, 0),
    [medications],
  );

  const completedDoses = useMemo(
    () => doseHistory.filter((dose) => dose.taken).length,
    [doseHistory],
  );

  const progress =
    totalDosesForToday > 0 ? completedDoses / totalDosesForToday : 0;

  const handleMedicationPress = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsBottomSheetOpen(true);
  };

  const handleBottomSheetClose = () => {
    setSelectedMedication(null);
    setIsBottomSheetOpen(false);
  };

  const loadData = useCallback(async () => {
    try {
      const [allMedications, todayDoses] = await Promise.all([
        getMedications(),
        getTodayDoses(),
      ]);

      setMedications(allMedications);
      setDoseHistory(todayDoses);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const activeMeds = allMedications.filter((med) => {
        const startDate = new Date(med.treatmentStartDate);
        startDate.setHours(0, 0, 0, 0);

        const duration = parseInt(med.treatmentDuration) || 0;
        if (duration === -1) return today >= startDate;

        const endDate = new Date(startDate.getTime() + duration * 86400000);
        return today >= startDate && today <= endDate;
      });

      const medicationTimeItems = activeMeds.flatMap((med) =>
        med.times.map((time, i) => {
          const taken = todayDoses.some(
            (dose) =>
              dose.medicationId === med.id &&
              dose.scheduledTime === time &&
              dose.taken,
          );
          return {
            id: `${med.id}-${i}`,
            medication: med,
            time,
            timeIndex: i,
            taken,
          };
        }),
      );

      const sorted = medicationTimeItems.sort((a, b) => {
        const toMinutes = (t: string) => {
          const [h, m] = t.split(":").map(Number);
          return h * 60 + m;
        };
        return toMinutes(a.time) - toMinutes(b.time);
      });

      setSortedMedicationTimes(sorted);
    } catch (error) {
      console.error("Error loading medications:", error);
    }
  }, []);

  const setupNotifications = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (!token) return;

      const meds = await getMedications();
      for (const med of meds) {
        await scheduleMedicationReminder(med);
      }
    } catch (error) {
      console.error("Notification error:", error);
    }
  };

  useEffect(() => {
    loadData();
    setupNotifications();

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") loadData();
    });

    return () => sub.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const ListHeader = () => (
    <XStack justifyContent="space-between" alignItems="center">
      <Text fontSize={18} fontWeight="600">
        Médicaments d'aujourd'hui
      </Text>
    </XStack>
  );

  return (
    <YStack flex={1} backgroundColor={Colors.white} gap={14}>
      <Header
        progress={progress}
        completedDoses={completedDoses}
        totalDosesForToday={totalDosesForToday}
      />
      <StatsSection
        completedDoses={completedDoses}
        totalDosesForToday={totalDosesForToday}
      />
      <FlatList
        ListHeaderComponent={ListHeader}
        data={sortedMedicationTimes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MedicationCard
            medication={{ ...item.medication, times: [item.time] }}
            taken={item.taken}
            recordDose={recordDose}
            loadData={loadData}
            onPress={() => handleMedicationPress(item.medication)}
          />
        )}
        ListEmptyComponent={
          <YStack
            alignItems="center"
            justifyContent="center"
            gap={16}
            paddingVertical={60}
          >
            <BriefcaseMedical
              size={64}
              color={Colors.gray}
              opacity={0.5}
              strokeWidth={1.5}
            />
            <View alignItems="center" gap={6}>
              <Text fontSize={18} fontWeight="600" color={Colors.darkGray}>
                Aucun médicament
              </Text>
              <Text
                fontSize={14}
                color={Colors.gray}
                textAlign="center"
                paddingHorizontal={20}
              >
                Vous n’avez pas de médicament à prendre aujourd’hui
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/medications/add")}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 20,
                backgroundColor: Colors.primary,
              }}
            >
              <Text fontSize={14} fontWeight="bold" color={Colors.white}>
                Ajouter un médicament
              </Text>
            </TouchableOpacity>
          </YStack>
        }
        contentContainerStyle={{
          gap: 16,
          paddingBottom: 70 + Math.max(bottomInset, 20),
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      />

      <MedicationDetailBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={handleBottomSheetClose}
        medication={selectedMedication}
      />
    </YStack>
  );
}
