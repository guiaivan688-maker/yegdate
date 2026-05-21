"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import { t } from "@/lib/i18n";

interface WeatherData {
  temperature: number;
  weathercode: number;
}

const weatherIcons: Record<number, string> = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "🌨️", 73: "🌨️", 75: "❄️",
  80: "🌧️", 81: "🌧️", 82: "🌧️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};

function getWeatherMessage(temp: number, locale: "fr" | "en"): string {
  if (temp < -10) return t("weather", "cold", locale);
  if (temp < 5) return t("weather", "ideal_indoor", locale);
  if (temp < 20) return t("weather", "mild", locale);
  return t("weather", "ideal_outdoor", locale);
}

export default function WeatherWidget() {
  const { locale } = useLocale();
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=53.5461&longitude=-113.4937&current_weather=true"
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.current_weather) {
          setWeather({
            temperature: Math.round(data.current_weather.temperature),
            weathercode: data.current_weather.weathercode,
          });
        }
      })
      .catch(() => {});
  }, []);

  if (!weather) return null;

  const icon = weatherIcons[weather.weathercode] ?? "🌤️";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-sm"
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-navy font-bold text-lg leading-tight">
          {weather.temperature}°C
        </p>
        <p className="text-navy/60 text-xs leading-tight">
          {getWeatherMessage(weather.temperature, locale)}
        </p>
      </div>
    </motion.div>
  );
}
