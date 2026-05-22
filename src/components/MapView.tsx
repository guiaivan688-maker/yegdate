"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useLocale } from "@/lib/locale-context";
import { allActivities } from "@/lib/activities";

const segmentColor: Record<string, string> = {
  couples: "#c4a456",
  famille: "#2a4a7f",
  amis: "#9333ea",
  business: "#0f2341",
};

function pin(color: string) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:18px;height:18px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 18],
    popupAnchor: [0, -18],
  });
}

export default function MapView() {
  const { locale } = useLocale();

  return (
    <MapContainer
      center={[53.5444, -113.4909]}
      zoom={11}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {allActivities.map((a) => (
        <Marker key={a.id} position={a.coords} icon={pin(segmentColor[a.segment] ?? "#c4a456")}>
          <Popup>
            <div style={{ minWidth: 160 }}>
              <strong style={{ fontFamily: "Georgia, serif" }}>{a.title[locale]}</strong>
              <br />
              <span style={{ color: "#666", fontSize: 12 }}>{a.location}</span>
              <br />
              <span style={{ color: "#9a7e34", fontSize: 12, fontWeight: 700 }}>{a.priceRange[locale]}</span>
              <br />
              <Link href={`/activite/${a.slug}`} style={{ color: "#1a365d", fontWeight: 700, fontSize: 13 }}>
                {locale === "fr" ? "Voir les détails →" : "View details →"}
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
