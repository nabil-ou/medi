import { View } from "tamagui";
import { Dropdown } from "react-native-element-dropdown";
import { useState } from "react";
import { StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

const data = [
  { value: "ml", label: "ml" },
  { value: "g", label: "g" },
  { value: "unit", label: "unité" },
  { value: "pill", label: "pilule" },
  { value: "sachet", label: "sachet" },
  { value: "spray", label: "spray" },
  { value: "patch", label: "patch" },
  { value: "CaC", label: "CaC" },
  { value: "CaS", label: "CaS" },
  { value: "goutes", label: "goutes" },
];

interface SelectDosageUnitProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
}

const SelectDosageUnit = ({
  value,
  onChange,
  error,
}: SelectDosageUnitProps) => {
  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, error && styles.errorBorder]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={data}
        labelField="label"
        valueField="value"
        placeholder="--"
        value={value}
        onChange={(item) => {
          if (onChange) {
            onChange(item.value);
          }
        }}
      />
    </View>
  );
};
export default SelectDosageUnit;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  dropdown: {
    height: 40,
    borderColor: Colors.lightGray,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: Colors.background,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  errorBorder: {
    borderColor: Colors.error,
    borderWidth: 1,
  },
});
