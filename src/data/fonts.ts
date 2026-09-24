import type { FontId, NeonFont } from "@/types";

export const FONTS: NeonFont[] = [
  { id: "modern", label: "Modern", family: "'Poppins', sans-serif", weight: 600, letterSpacing: 0.04, uppercase: false },
  { id: "script", label: "Script", family: "'Great Vibes', cursive", weight: 400, letterSpacing: 0, uppercase: false },
  { id: "bold", label: "Bold", family: "'Bebas Neue', sans-serif", weight: 400, letterSpacing: 0.06, uppercase: true },
  { id: "minimal", label: "Minimal", family: "'Jost', sans-serif", weight: 400, letterSpacing: 0.12, uppercase: false },
  { id: "retro", label: "Retro", family: "'Monoton', cursive", weight: 400, letterSpacing: 0.02, uppercase: true },
  { id: "handwritten", label: "Handwritten", family: "'Caveat', cursive", weight: 600, letterSpacing: 0, uppercase: false },
  { id: "neon", label: "Neon Classic", family: "'Righteous', sans-serif", weight: 400, letterSpacing: 0.03, uppercase: false },
];

export const ALL_FONT_IDS: FontId[] = FONTS.map((f) => f.id);

export function getFont(id: FontId): NeonFont {
  return FONTS.find((f) => f.id === id) ?? FONTS[0];
}

/** Script-style fonts read better in title case than all caps. */
export function displayText(text: string, fontId: FontId): string {
  const font = getFont(fontId);
  if (font.uppercase) return text.toUpperCase();
  if (fontId === "script" || fontId === "handwritten") {
    return text
      .toLowerCase()
      .replace(/(^|\s)(\S)/g, (_m, s: string, c: string) => s + c.toUpperCase());
  }
  return text;
}
