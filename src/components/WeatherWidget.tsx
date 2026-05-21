"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import { useWeather } from "@/lib/weather-context";

const weatherIcons: Record<number, string> = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "🌨️", 73: "🌨️", 75: "❄️",
  80: "🌧️", 81: "🌧️", 82: "🌧️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};

export default function WeatherWidget() {
  const { t } = useLocale();
  const weather = useWeather();

  if (!weather) return null;

  const icon = weatherIcons[weather.weathercode] ?? "🌤️";
  const temp = weather.temperature;
  const msgKey =
    temp < -8 ? "weather.cold" : temp < 4 ? "weather.indoor" : temp < 18 ? "weather.mild" : "weather.outdoor";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-sm"
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-navy font-bold text-lg leading-tight">{temp}°C</p>
        <p className="text-navy/60 text-xs leading-tight max-w-[150px]">{t(msgKey)}</p>
      </div>
    </motion.div>
  );
}
