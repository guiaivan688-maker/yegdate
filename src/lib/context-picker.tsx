"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Persona = "couple" | "famille" | "amis" | "solo" | "business";

interface ContextPickerState {
  persona: Persona;
  guests: number;
  setPersona: (p: Persona) => void;
  setGuests: (n: number) => void;
}

const LS_KEY = "yeg.context.v1";

const ContextPickerCtx = createContext<ContextPickerState>({
  persona: "couple",
  guests: 2,
  setPersona: () => {},
  setGuests: () => {},
});

export function ContextPickerProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>("couple");
  const [guests, setGuestsState] = useState<number>(2);

  // Load from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.persona && ["couple", "famille", "amis", "solo", "business"].includes(parsed.persona)) {
        setPersonaState(parsed.persona);
      }
      if (typeof parsed.guests === "number" && parsed.guests >= 1 && parsed.guests <= 50) {
        setGuestsState(parsed.guests);
      }
    } catch {}
  }, []);

  function setPersona(p: Persona) {
    setPersonaState(p);
    // Auto-adjust guests for new persona if at default
    const defaultGuests = p === "solo" ? 1 : p === "couple" ? 2 : p === "famille" ? 4 : 6;
    setGuestsState((prev) => (prev <= 2 ? defaultGuests : prev));
    persist(p, defaultGuests);
  }

  function setGuests(n: number) {
    const clamped = Math.max(1, Math.min(50, n));
    setGuestsState(clamped);
    persist(persona, clamped);
  }

  function persist(p: Persona, g: number) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ persona: p, guests: g }));
    } catch {}
  }

  return (
    <ContextPickerCtx.Provider value={{ persona, guests, setPersona, setGuests }}>
      {children}
    </ContextPickerCtx.Provider>
  );
}

export function useContextPicker() {
  return useContext(ContextPickerCtx);
}

export const PERSONA_META: Record<Persona, { fr: string; en: string; emoji: string; href: string }> = {
  couple:   { fr: "Couple",   en: "Couple",   emoji: "💑", href: "/couples" },
  famille:  { fr: "Famille",  en: "Family",   emoji: "👨‍👩‍👧", href: "/famille" },
  amis:     { fr: "Amis",     en: "Friends",  emoji: "🥂", href: "/amis" },
  solo:     { fr: "Solo",     en: "Solo",     emoji: "🧍", href: "/compositeur" },
  business: { fr: "Affaires", en: "Business", emoji: "💼", href: "/business" },
};
