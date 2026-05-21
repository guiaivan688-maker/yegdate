"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface Weather {
  temperature: number;
  weathercode: number;
}

const WeatherContext = createContext<Weather | null>(null);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weather, setWeather] = useState<Weather | null>(null);

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

  return <WeatherContext.Provider value={weather}>{children}</WeatherContext.Provider>;
}

export function useWeather() {
  return useContext(WeatherContext);
}

export function currentSeason(): "spring" | "summer" | "fall" | "winter" {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 9) return "fall";
  return "winter";
}
