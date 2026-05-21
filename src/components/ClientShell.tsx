"use client";

import { type ReactNode } from "react";
import { LocaleProvider } from "@/lib/locale-context";
import { WeatherProvider } from "@/lib/weather-context";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIConcierge from "./AIConcierge";

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <WeatherProvider>
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <AIConcierge />
      </WeatherProvider>
    </LocaleProvider>
  );
}
