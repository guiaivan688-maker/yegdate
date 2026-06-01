"use client";

import { type ReactNode } from "react";
import { LocaleProvider } from "@/lib/locale-context";
import { WeatherProvider } from "@/lib/weather-context";
import { FavoritesProvider } from "@/lib/favorites-context";
import { ContextPickerProvider } from "@/lib/context-picker";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIConcierge from "./AIConcierge";
import SiteBanner from "./SiteBanner";

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <FavoritesProvider>
        <WeatherProvider>
          <ContextPickerProvider>
            <Navbar />
            <main className="flex-1 pt-16"><SiteBanner />{children}</main>
            <Footer />
            <AIConcierge />
          </ContextPickerProvider>
        </WeatherProvider>
      </FavoritesProvider>
    </LocaleProvider>
  );
}
