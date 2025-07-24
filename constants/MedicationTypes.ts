import {
  Pill,
  Tablets,
  Syringe,
  Droplets,
  Sticker,
  SprayCan,
  StickyNote,
} from "@tamagui/lucide-icons";
import { BottleWine } from "lucide-react-native";

export interface MedicationType {
  id: string;
  label: string;
  icon: any;
  color: string;
}

export const MEDICATION_TYPES: MedicationType[] = [
  {
    id: "comprime",
    label: "Comprimé",
    icon: Tablets,
    color: "#FF7A5A",
  },
  { id: "gelule", label: "Gélule", icon: Pill, color: "#4CAF50" },
  {
    id: "sirop",
    label: "Sirop",
    icon: BottleWine,
    color: "#2196F3",
  },
  {
    id: "gouttes",
    label: "Gouttes",
    icon: Droplets,
    color: "#9C27B0",
  },
  {
    id: "sachet",
    label: "Sachet",
    icon: StickyNote,
    color: "#F44336",
  },
  {
    id: "spray",
    label: "Spray",
    icon: SprayCan,
    color: "#00BCD4",
  },
  {
    id: "patch",
    label: "Patch",
    icon: Sticker,
    color: "#E91E63",
  },
  { id: "injection", label: "Injection", icon: Syringe, color: "#5B6EF5" },
];
