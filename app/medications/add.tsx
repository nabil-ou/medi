import MedicationTypeSection from "@/components/add/MedicationTypeSection";
import SelectDosageUnit from "@/components/add/SelectDosageUnit";
import SelectUnit from "@/components/add/SelectUnit";
import Colors from "@/constants/Colors";
import { MEDICATION_TYPES } from "@/constants/MedicationTypes";
import { scheduleMedicationReminder } from "@/utils/notifications";
import { addMedication, Medication } from "@/utils/storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Bell,
  Calendar,
  X,
  Plus,
  Trash,
  CalendarDays,
} from "@tamagui/lucide-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Alert, ScrollView, TouchableOpacity } from "react-native";
import {
  Input,
  Square,
  Switch,
  Text,
  TextArea,
  View,
  XStack,
  YStack,
} from "tamagui";

const AddMedicationScreen = () => {
  const router = useRouter();

  const [form, setForm] = useState<Medication>({
    id: "",
    name: "",
    dosage: "",
    dosageUnit: "",
    quantity: "",
    quantityUnit: "",
    medicationType: "",
    treatmentStartDate: new Date().toISOString(),
    treatmentDuration: "",
    treatmentEndDate: new Date().toISOString(),
    times: ["09:00"],
    note: "",
    reminderEnabled: true,
    currentSupply: 0,
    totalSupply: 0,
    color: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showTreatmentDatePicker, setShowTreatmentDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingTimeIndex, setEditingTimeIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculer automatiquement la date de fin de traitement
  useEffect(() => {
    if (form.treatmentStartDate && form.treatmentDuration) {
      const startDate = new Date(form.treatmentStartDate);
      const durationDays = parseInt(form.treatmentDuration);

      if (!isNaN(durationDays) && durationDays > 0) {
        const endDate = new Date(startDate);
        // Soustraire 1 car le jour de début compte dans la durée
        // Ex: début 24-07 pour 3 jours = fin 26-07 (24, 25, 26)
        endDate.setDate(endDate.getDate() + durationDays - 1);
        const newEndDate = endDate.toISOString();

        // Calculer et mettre à jour la date de fin
        setForm((prev) => ({
          ...prev,
          treatmentEndDate: newEndDate,
        }));
      }
    }
  }, [form.treatmentStartDate, form.treatmentDuration]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Nom du médicament
    if (!form.name.trim()) {
      newErrors.name = "Le nom du médicament est requis";
    }

    // Nombre de doses
    if (!form.quantity.trim()) {
      newErrors.quantity = "Le nombre de doses est requis";
    }

    // Unité de dosage
    if (!form.quantityUnit.trim()) {
      newErrors.quantityUnit = "L'unité de dosage est requise";
    }

    // Type de médicament
    if (!form.medicationType.trim()) {
      newErrors.medicationType = "Le type de médicament est requis";
    }

    // Date de début (toujours présente car initialisée, mais on peut vérifier)
    if (!form.treatmentStartDate) {
      newErrors.treatmentStartDate = "La date de début est requise";
    }

    // Période de prise
    if (!form.treatmentDuration.trim()) {
      newErrors.treatmentDuration = "La période de prise est requise";
    }

    // Heures de prise
    if (!form.times.length || form.times.every((time) => !time.trim())) {
      newErrors.times = "Au moins une heure de prise est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    try {
      if (!validateForm()) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }
      if (isSubmitting) return;
      setIsSubmitting(true);
      const medicationData: Medication = {
        ...form,
        id: Math.random().toString(36).substring(2, 9),
        currentSupply: form.currentSupply || 0,
        totalSupply: form.currentSupply || 0,
        treatmentStartDate: form.treatmentStartDate,
        treatmentEndDate: form.treatmentEndDate, // Date de fin calculée automatiquement
        color:
          MEDICATION_TYPES.find((type) => type.id === form.medicationType)
            ?.color || Colors.primary,
      };

      await addMedication(medicationData);

      if (medicationData.reminderEnabled) {
        await scheduleMedicationReminder(medicationData);
      }

      Alert.alert(
        "Success",
        "Medication added successfully",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
        { cancelable: false },
      );
      // Save the medication to the database
    } catch (error) {
      console.log("Save error:", error);
      Alert.alert(
        "Error",
        "Failed to add medication. Please try again.",
        [{ text: "OK" }],
        { cancelable: false },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View flex={1} backgroundColor={Colors.white}>
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingVertical: 16,
          paddingHorizontal: 24,
        }}
      >
        <XStack
          alignItems="center"
          zIndex={1}
          gap={20}
          justifyContent="space-between"
        >
          <Text fontSize={20} fontWeight="700" color="#fff" textAlign="center">
            Ajouter un médicament
          </Text>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.20)",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={() => router.back()}
          >
            <X size={24} color={Colors.white} strokeWidth={3} />
          </TouchableOpacity>
        </XStack>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
        }}
      >
        <View marginBottom={25} gap={20}>
          <YStack gap={10}>
            <Text fontSize={14}>Nom du médicament *</Text>
            <YStack gap={4}>
              <Input
                size="$3"
                placeholder="Paracétamol"
                placeholderTextColor={Colors.gray}
                value={form.name}
                borderColor={errors.name && Colors.error}
                onChangeText={(text) => {
                  setForm({ ...form, name: text });
                  if (errors.name) {
                    setErrors({ ...errors, name: "" });
                  }
                }}
              />
              {errors.name && (
                <Text color={Colors.error} fontSize={12} marginLeft={12}>
                  {errors.name}
                </Text>
              )}
            </YStack>
          </YStack>

          <YStack gap={10}>
            <Text fontSize={14}>Dosage et posologie</Text>
            <YStack gap={4}>
              <XStack width="100%" gap={8} alignItems="center">
                <Input
                  size="$3"
                  placeholder="500"
                  placeholderTextColor={Colors.gray}
                  value={form.dosage}
                  onChangeText={(text) => {
                    setForm({ ...form, dosage: text });
                  }}
                  flex={3}
                  keyboardType="numeric"
                />
                <SelectUnit />
              </XStack>
            </YStack>
          </YStack>

          <YStack gap={10}>
            <Text fontSize={14}>Nombre de doses *</Text>
            <YStack gap={4}>
              <XStack width="100%" gap={8} alignItems="center">
                <Input
                  size="$3"
                  placeholder="Nombre de doses"
                  placeholderTextColor={Colors.gray}
                  value={form.quantity}
                  borderColor={errors.quantity && Colors.error}
                  onChangeText={(text) => {
                    const numericText = text.replace(/[^0-9]/g, "");
                    setForm({ ...form, quantity: numericText });
                    if (errors.quantity) {
                      setErrors({ ...errors, quantity: "" });
                    }
                  }}
                  keyboardType="numeric"
                  flex={2}
                />
                <SelectDosageUnit
                  value={form.quantityUnit}
                  onChange={(value) => {
                    setForm({ ...form, quantityUnit: value });
                    if (errors.quantityUnit) {
                      setErrors({ ...errors, quantityUnit: "" });
                    }
                  }}
                  error={!!errors.quantityUnit}
                />
              </XStack>
              {(errors.quantity || errors.quantityUnit) && (
                <Text color={Colors.error} fontSize={12} marginLeft={12}>
                  {errors.quantity || errors.quantityUnit}
                </Text>
              )}
            </YStack>
          </YStack>

          <MedicationTypeSection
            form={form}
            setForm={setForm}
            error={errors.medicationType}
            onErrorClear={() => setErrors({ ...errors, medicationType: "" })}
          />

          <YStack gap={12}>
            {/* Date de début */}
            <YStack gap={8}>
              <Text fontSize={14} fontWeight="600">
                Date de début *
              </Text>
              {showTreatmentDatePicker ? (
                <DateTimePicker
                  value={new Date(form.treatmentStartDate)}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowTreatmentDatePicker(false);
                    if (selectedDate) {
                      setForm({
                        ...form,
                        treatmentStartDate: selectedDate.toISOString(),
                      });
                    }
                  }}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => setShowTreatmentDatePicker(true)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: Colors.background,
                    borderRadius: 8,
                    padding: 8,
                    borderWidth: 1,
                    borderColor: Colors.lightGray,
                  }}
                >
                  <Text fontSize={14}>
                    {form.treatmentStartDate
                      ? new Date(form.treatmentStartDate).toLocaleDateString(
                          "default",
                        )
                      : "dd/mm/yyyy"}
                  </Text>
                  <Calendar size={20} />
                </TouchableOpacity>
              )}
            </YStack>

            {/* Période de prise */}
            <YStack gap={8}>
              <Text fontSize={14} fontWeight="600">
                Période de prise *
              </Text>
              <XStack gap={12} alignItems="center">
                <Input
                  size="$3"
                  placeholder="7"
                  placeholderTextColor={Colors.gray}
                  value={form.treatmentDuration}
                  onChangeText={(text) => {
                    const numericText = text.replace(/[^0-9]/g, "");
                    setForm({ ...form, treatmentDuration: numericText });
                    if (errors.treatmentDuration) {
                      setErrors({ ...errors, treatmentDuration: "" });
                    }
                  }}
                  keyboardType="numeric"
                  backgroundColor="#F8F9FA"
                  borderColor={
                    errors.treatmentDuration ? Colors.error : "#E9ECEF"
                  }
                  width={80}
                />
                <Text fontSize={16} color={Colors.darkGray}>
                  jours
                </Text>
              </XStack>
              {errors.treatmentDuration && (
                <Text color={Colors.error} fontSize={12}>
                  {errors.treatmentDuration}
                </Text>
              )}

              {/* Affichage de la date de fin calculée */}
              {form.treatmentEndDate && form.treatmentDuration && (
                <YStack
                  backgroundColor="#F0F9FF"
                  padding={12}
                  borderRadius={8}
                  borderWidth={1}
                  borderColor="#BFDBFE"
                  marginTop={8}
                >
                  <XStack>
                    <CalendarDays color={Colors.primary} size={16} />
                    <Text fontSize={12} color={Colors.primary} fontWeight="600">
                      {" "}
                      Fin de traitement prévue :
                    </Text>
                  </XStack>
                  <Text
                    fontSize={14}
                    color={Colors.primary}
                    fontWeight="600"
                    marginTop={2}
                  >
                    {new Date(form.treatmentEndDate).toLocaleDateString(
                      "fr-FR",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </Text>
                </YStack>
              )}
            </YStack>

            {/* Heures de prise */}
            <YStack gap={8}>
              <Text fontSize={14} fontWeight="600">
                Heures de prise
              </Text>
              {form.times.map((time, index) => (
                <XStack key={index} gap={12} alignItems="center">
                  {showTimePicker && editingTimeIndex === index ? (
                    <View flex={1}>
                      <DateTimePicker
                        value={(() => {
                          const timeString = form.times[editingTimeIndex];
                          if (timeString) {
                            const [hours, minutes] = timeString
                              .split(":")
                              .map(Number);
                            const date = new Date();
                            date.setHours(hours, minutes, 0, 0);
                            return date;
                          } else {
                            return new Date();
                          }
                        })()}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowTimePicker(false);
                          setEditingTimeIndex(null);
                          if (selectedDate) {
                            const newTime = selectedDate.toLocaleTimeString(
                              "default",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              },
                            );
                            setForm((prev) => ({
                              ...prev,
                              times: prev.times.map((t, i) =>
                                i === editingTimeIndex ? newTime : t,
                              ),
                            }));
                          }
                        }}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setEditingTimeIndex(index);
                        setShowTimePicker(true);
                      }}
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#F8F9FA",
                        borderRadius: 12,
                        padding: 16,
                        borderWidth: 1,
                        borderColor: "#E9ECEF",
                      }}
                    >
                      <Text
                        fontSize={16}
                        color={time ? Colors.darkGray : Colors.gray}
                      >
                        {time || "--:-- --"}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {form.times.length > 1 && (
                    <TouchableOpacity
                      onPress={() => {
                        const newTimes = form.times.filter(
                          (_, i) => i !== index,
                        );
                        setForm({ ...form, times: newTimes });
                      }}
                      style={{
                        padding: 8,
                        backgroundColor: "#FEF2F2",
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#FEE2E2",
                      }}
                    >
                      <Trash size={20} color="#FF4444" />
                    </TouchableOpacity>
                  )}
                </XStack>
              ))}

              <TouchableOpacity
                onPress={() => {
                  setForm({ ...form, times: [...form.times, "09:00"] });
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#EEF2FF",
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#A5B4FC",
                  borderStyle: "dashed",
                  gap: 8,
                }}
              >
                <Plus size={20} color={Colors.primary} />
                <Text fontSize={16} fontWeight="600" color={Colors.primary}>
                  Ajouter une heure
                </Text>
              </TouchableOpacity>
              {errors.times && (
                <Text color={Colors.error} fontSize={12}>
                  {errors.times}
                </Text>
              )}
            </YStack>
          </YStack>

          {/* reminder card */}
          <View
            backgroundColor={Colors.white}
            borderRadius={12}
            padding={18}
            borderWidth={1}
            borderColor="#e0e0e0"
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.05}
            shadowRadius={8}
          >
            <XStack alignItems="center" justifyContent="space-between" gap={10}>
              <XStack flex={1} alignItems="center" gap={10}>
                <Square
                  size={40}
                  backgroundColor="#E0E7FF"
                  borderRadius={8}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Bell size={20} color={Colors.primary} strokeWidth={2.5} />
                </Square>
                <YStack flex={1} gap={2}>
                  <Text fontSize={16} fontWeight="600">
                    Activer les rappels
                  </Text>
                  <Text fontSize={14} color={Colors.gray}>
                    Recevoir des notifications
                  </Text>
                </YStack>
              </XStack>
              <Switch
                size="$2.5"
                borderColor="transparent"
                checked={form.reminderEnabled}
                onCheckedChange={() =>
                  setForm({
                    ...form,
                    reminderEnabled: !form.reminderEnabled,
                  })
                }
                style={{
                  backgroundColor: form.reminderEnabled
                    ? Colors.primary
                    : Colors.gray,
                }}
              >
                <Switch.Thumb
                  animation="100ms"
                  style={{ backgroundColor: "white" }}
                />
              </Switch>
            </XStack>
          </View>
        </View>
        <View marginTop={10}>
          <TextArea
            size="$4"
            borderWidth={2}
            placeholder="Ajouter une note..."
            placeholderTextColor={Colors.gray}
            value={form.note}
            onChangeText={(text) => {
              setForm({ ...form, note: text });
            }}
          />
        </View>
      </ScrollView>

      <XStack
        padding={20}
        backgroundColor={Colors.white}
        borderTopWidth={1}
        borderTopColor="#e0e0e0"
        gap={12}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          disabled={isSubmitting}
          style={{
            flex: 1,
            padding: 14,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 12,
            backgroundColor: "#F3F4F6",
          }}
        >
          <Text fontSize={16} fontWeight="600" color="#6B7280">
            Annuler
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isSubmitting}
          onPress={() => handleSave()}
          style={{
            flex: 1.5,
            padding: 14,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 12,
            backgroundColor: Colors.primary,
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          <Text fontSize={18} fontWeight="600" color={Colors.white}>
            {isSubmitting ? "Ajout..." : "Ajouter"}
          </Text>
        </TouchableOpacity>
      </XStack>
    </View>
  );
};

export default AddMedicationScreen;
