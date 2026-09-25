import { useCallback, useEffect, useState } from "react";
import type { Customization, Template } from "@/types";

export function defaultCustomization(t: Template): Customization {
  return {
    templateId: t.id,
    text: t.defaultText,
    font: t.defaultFont,
    colour: t.defaultColour,
    size: "Medium",
    backing: "Clear Acrylic",
    mountingKit: false,
    quantity: 1,
    uploadedLogoName: null,
    uploadedLogoDataUrl: null,
  };
}

const DRAFT_KEY = (id: string) => `ns_draft_${id}`;

/**
 * Customiser state. When not editing a cart line, the draft is kept in
 * sessionStorage so a refresh doesn't lose work.
 */
export function useCustomizer(template: Template, initial?: Customization, persistDraft = true) {
  const [c, setC] = useState<Customization>(() => {
    if (initial) return { ...initial };
    if (persistDraft) {
      try {
        const raw = sessionStorage.getItem(DRAFT_KEY(template.id));
        if (raw) return { ...defaultCustomization(template), ...(JSON.parse(raw) as Customization), templateId: template.id };
      } catch {
        /* ignore */
      }
    }
    return defaultCustomization(template);
  });

  useEffect(() => {
    if (!persistDraft) return;
    try {
      sessionStorage.setItem(DRAFT_KEY(template.id), JSON.stringify(c));
    } catch {
      /* ignore quota */
    }
  }, [c, persistDraft, template.id]);

  const set = useCallback(<K extends keyof Customization>(key: K, value: Customization[K]) => {
    setC((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => setC(initial ? { ...initial } : defaultCustomization(template)), [initial, template]);

  const clearDraft = useCallback(() => {
    try {
      sessionStorage.removeItem(DRAFT_KEY(template.id));
    } catch {
      /* ignore */
    }
  }, [template.id]);

  return { c, set, setC, reset, clearDraft };
}
