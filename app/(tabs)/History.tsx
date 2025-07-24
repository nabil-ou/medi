import { useState, useCallback, useEffect, useMemo } from "react";
import { Calendar } from "react-native-calendars";
import { FlatList } from "react-native";
import {
  getMedications,
  getDoseHistory,
  recordDose,
  Medication,
  DoseHistory,
} from "@/utils/storage";
import { Text, View, YStack } from "tamagui";
import { BriefcaseMedical } from "@tamagui/lucide-icons";
import Colors from "@/constants/Colors";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/history/Header";
import StatsCard from "@/components/history/StatsCard";
import MedicationCard from "@/components/MedicationCard";
import MedicationDetailBottomSheet from "@/components/BottomSheets/MedicationDetailBottomSheet";

interface MedicationHistoryItem {
  medication: Medication;
  taken: boolean;
}

const getToday = () => new Date().toISOString().split("T")[0];

export default function CalendarScreen() {
  const { bottom: bottomInset } = useSafeAreaInsets();

  const [selectedDate, setSelectedDate] = useState(getToday());
  const [medications, setMedications] = useState<Medication[]>([]);
  const [doseHistory, setDoseHistory] = useState<DoseHistory[]>([]);
  const [medicationsForDate, setMedicationsForDate] = useState<
    MedicationHistoryItem[]
  >([]);
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleMedicationPress = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsBottomSheetOpen(true);
  };

  const handleBottomSheetClose = () => {
    setIsBottomSheetOpen(false);
    setSelectedMedication(null);
  };

  const loadData = useCallback(async () => {
    try {
      const [meds, history] = await Promise.all([
        getMedications(),
        getDoseHistory(),
      ]);
      setMedications(meds);
      setDoseHistory(history);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  useEffect(() => {
    const date = new Date(selectedDate);
    const dayDoses = doseHistory.filter(
      (dose) => new Date(dose.timestamp).toDateString() === date.toDateString(),
    );

    // Filtrer les médicaments actifs pour la date sélectionnée avec normalisation des heures
    const activeMeds = medications.filter((med) => {
      const startDate = new Date(med.treatmentStartDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(med.treatmentEndDate);
      endDate.setHours(23, 59, 59, 999);

      const selectedDateCopy = new Date(selectedDate);
      selectedDateCopy.setHours(12, 0, 0, 0); // Midi pour éviter les problèmes de timezone

      return selectedDateCopy >= startDate && selectedDateCopy <= endDate;
    });

    const medsForDate = activeMeds.flatMap((med) =>
      med.times.map((time) => {
        const taken = dayDoses.some(
          (d) =>
            d.medicationId === med.id && d.taken && d.scheduledTime === time,
        );
        return {
          medication: { ...med, times: [time] },
          taken,
        };
      }),
    );

    setMedicationsForDate(medsForDate);
  }, [selectedDate, medications, doseHistory]);

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {
      [selectedDate]: {
        selected: true,
        selectedColor: Colors.primary,
      },
    };

    doseHistory.forEach((dose) => {
      const dateStr = new Date(dose.timestamp).toISOString().split("T")[0];
      marks[dateStr] = {
        ...marks[dateStr],
        marked: true,
        dotColor: Colors.primary,
      };
    });

    return marks;
  }, [doseHistory, selectedDate]);

  const ListHeader = () => (
    <YStack gap={24}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: Colors.primary,
          selectedDayTextColor: Colors.white,
          todayTextColor: Colors.primary,
          arrowColor: Colors.primaryDark,
          textMonthFontWeight: "600",
          textDayFontWeight: "600",
          textMonthFontSize: 20,
          calendarBackground: "transparent",
          "stylesheet.day.basic": {
            base: {
              width: 32,
              height: 32,
              alignItems: "center",
              justifyContent: "center",
            },
            selected: {
              backgroundColor: Colors.primary,
              borderRadius: 8,
              width: 32,
              height: 32,
            },
          },
        }}
      />

      <YStack gap={16}>
        <Text fontSize={18} fontWeight="700">
          {new Date(selectedDate).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </Text>

        <StatsCard
          selectedDate={new Date(selectedDate)}
          takenCount={medicationsForDate.filter((item) => item.taken).length}
          totalCount={medicationsForDate.length}
        />
      </YStack>
    </YStack>
  );

  return (
    <YStack flex={1} backgroundColor={Colors.white}>
      <Header />
      <FlatList
        ListHeaderComponent={ListHeader}
        data={medicationsForDate}
        keyExtractor={(item, index) =>
          `${item.medication.id}-${item.medication.times[0]}-${index}`
        }
        renderItem={({ item }) => {
          const selectedDateObj = new Date(selectedDate);
          selectedDateObj.setHours(0, 0, 0, 0); // Début de la journée sélectionnée

          const today = new Date();
          today.setHours(0, 0, 0, 0); // Début d'aujourd'hui

          const isPastDate = selectedDateObj < today; // Strictement avant aujourd'hui
          const isFutureDate = selectedDateObj > today; // Strictement après aujourd'hui

          return (
            <MedicationCard
              medication={item.medication}
              taken={item.taken}
              recordDose={(medicationId, taken, timestamp) =>
                recordDose(
                  medicationId,
                  taken,
                  timestamp,
                  item.medication.times[0],
                )
              }
              loadData={loadData}
              isPastDate={isPastDate}
              isFutureDate={isFutureDate}
              onPress={() => handleMedicationPress(item.medication)}
            />
          );
        }}
        ListEmptyComponent={
          <View
            alignItems="center"
            justifyContent="center"
            paddingVertical={60}
            gap={16}
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
                Vous n’avez pas de médicament à prendre ce jour-là
              </Text>
            </View>
          </View>
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
