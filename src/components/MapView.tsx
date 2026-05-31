"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useLocale } from "@/lib/locale-context";
import { allActivities, type Activity } from "@/lib/activities";
import parks from "@/data/picnic-parks.json";

interface ParkPin {
  id: string;
  name: string;
  neighbourhood: string;
  image: string;
  coords: [number, number];
  description: { fr: string; en: string };
}

interface MapViewProps {
  /** Activity segments to show. Empty array hides all activity pins. */
  visibleSegments?: Array<"couples" | "famille" | "amis" | "business">;
  /** Whether to render the picnic park dots. */
  showPicnicParks?: boolean;
}

const segmentColor: Record<Activity["segment"], string> = {
  couples: "#c4a456",  // gold
  famille: "#2a4a7f",  // navy/blue
  amis: "#16a34a",     // green
  business: "#9333ea", // purple
};

function activityPin(color: string) {
  return L.divIcon({
    className: "yeg-pin",
    html: `<span style="display:block;width:18px;height:18px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 18],
    popupAnchor: [0, -18],
  });
}

function parkDot() {
  return L.divIcon({
    className: "yeg-park-dot",
    html: `<span style="display:block;width:10px;height:10px;border-radius:9999px;background:#d4b976;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3)"></span>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
    popupAnchor: [0, -6],
  });
}

const PARK_ICON = parkDot();

export default function MapView({
  visibleSegments = ["couples", "famille", "amis", "business"],
  showPicnicParks = true,
}: MapViewProps) {
  const { locale } = useLocale();
  const segmentSet = new Set(visibleSegments);
  const allParks = parks as unknown as ParkPin[];

  const visibleActivities = allActivities.filter((a) => segmentSet.has(a.segment));

  return (
    <MapContainer
      center={[53.5444, -113.4909]}
      zoom={11}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {visibleActivities.map((a) => (
        <Marker
          key={`act-${a.id}`}
          position={a.coords}
          icon={activityPin(segmentColor[a.segment])}
        >
          <Popup>
            <div style={{ minWidth: 180, maxWidth: 220 }}>
              {a.image ? (
                <div
                  style={{
                    width: "100%",
                    height: 96,
                    borderRadius: 8,
                    overflow: "hidden",
                    marginBottom: 8,
                    backgroundImage: `url(${a.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  aria-hidden
                />
              ) : null}
              <strong style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#1a365d", display: "block", lineHeight: 1.25 }}>
                {a.title[locale]}
              </strong>
              <span style={{ color: "#666", fontSize: 12, display: "block", marginTop: 4 }}>
                {a.location}
              </span>
              <span style={{ color: "#9a7e34", fontSize: 12, fontWeight: 700, display: "block", marginTop: 2 }}>
                {a.priceRange[locale]}
              </span>
              <Link
                href={`/activite/${a.slug}`}
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  color: "#1a365d",
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: "none",
                }}
              >
                {locale === "fr" ? "Voir détails →" : "View details →"}
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}

      {showPicnicParks &&
        allParks.map((p) => (
          <Marker key={`park-${p.id}`} position={p.coords} icon={PARK_ICON}>
            <Popup>
              <div style={{ minWidth: 180, maxWidth: 220 }}>
                {p.image ? (
                  <div
                    style={{
                      width: "100%",
                      height: 96,
                      borderRadius: 8,
                      overflow: "hidden",
                      marginBottom: 8,
                      backgroundImage: `url(${p.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    aria-hidden
                  />
                ) : null}
                <strong style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#1a365d", display: "block", lineHeight: 1.25 }}>
                  {p.name}
                </strong>
                <span style={{ color: "#666", fontSize: 12, display: "block", marginTop: 4 }}>
                  {p.neighbourhood}
                </span>
                <span style={{ color: "#9a7e34", fontSize: 11, fontWeight: 600, display: "block", marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {locale === "fr" ? "Parc pique-nique" : "Picnic park"}
                </span>
                <Link
                  href="/pique-nique"
                  style={{
                    display: "inline-block",
                    marginTop: 8,
                    color: "#1a365d",
                    fontWeight: 700,
                    fontSize: 13,
                    textDecoration: "none",
                  }}
                >
                  {locale === "fr" ? "Voir détails →" : "View details →"}
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
