import type { ColourId, NeonColour } from "@/types";

export const COLOURS: NeonColour[] = [
  { id: "warm-white", label: "Warm White", hex: "#FFC98A", core: "#FFF7EC" },
  { id: "cool-white", label: "Cool White", hex: "#BFD9FF", core: "#FAFCFF" },
  { id: "blue", label: "Blue", hex: "#2F8CFF", core: "#E4F0FF" },
  { id: "pink", label: "Pink", hex: "#FF3EA5", core: "#FFE6F3" },
  { id: "red", label: "Red", hex: "#FF2E43", core: "#FFE5E7" },
  { id: "green", label: "Green", hex: "#2BFF8A", core: "#E8FFF1" },
  { id: "purple", label: "Purple", hex: "#A652FF", core: "#F3E8FF" },
  { id: "yellow", label: "Yellow", hex: "#FFD21F", core: "#FFFBE3" },
  { id: "black", label: "Black", hex: "#1A1A2E", core: "#2D2D44" },
];

export const ALL_COLOUR_IDS: ColourId[] = COLOURS.map((c) => c.id);

export function getColour(id: ColourId): NeonColour {
  return COLOURS.find((c) => c.id === id) ?? COLOURS[0];
}
