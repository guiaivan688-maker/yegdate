# -*- coding: utf-8 -*-
import json, urllib.parse

PATH = "src/data/edmonton-data.json"
with open(PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

def booking(name):
    q = urllib.parse.quote_plus(name + " Edmonton billets")
    return "https://www.google.com/search?q=" + q

# start–end date ranges (representative 2026) per event name
DATES = {
    "Edmonton International Jazz Festival": {"fr": "19–28 juin 2026", "en": "Jun 19–28, 2026"},
    "Taste of Edmonton": {"fr": "23 juil – 2 août 2026", "en": "Jul 23 – Aug 2, 2026"},
    "Edmonton International Fringe Festival": {"fr": "13–23 août 2026", "en": "Aug 13–23, 2026"},
    "River Valley Trail Run": {"fr": "16 août 2026", "en": "Aug 16, 2026"},
    "Edmonton Folk Music Festival": {"fr": "6–9 août 2026", "en": "Aug 6–9, 2026"},
    "K-Days": {"fr": "17–26 juillet 2026", "en": "Jul 17–26, 2026"},
    "Ice on Whyte Festival": {"fr": "22 janv – 1 févr 2026", "en": "Jan 22 – Feb 1, 2026"},
    "Flying Canoë Volant": {"fr": "5–7 février 2026", "en": "Feb 5–7, 2026"},
    "Cariwest Festival": {"fr": "7–9 août 2026", "en": "Aug 7–9, 2026"},
    "Downtown Farmers Market": {"fr": "Toute l'année · sam-dim", "en": "Year-round · Sat-Sun"},
    "Edmonton International Film Festival": {"fr": "1–10 octobre 2026", "en": "Oct 1–10, 2026"},
    "Edmonton Expo": {"fr": "25–27 septembre 2026", "en": "Sep 25–27, 2026"},
    "Edmonton Pride Festival": {"fr": "5–14 juin 2026", "en": "Jun 5–14, 2026"},
    "Deep Freeze : A Byzantine Winter Festival": {"fr": "10–11 janvier 2026", "en": "Jan 10–11, 2026"},
    "Edmonton International Street Performers Festival": {"fr": "3–12 juillet 2026", "en": "Jul 3–12, 2026"},
    "Fête du Canada à la Legislature": {"fr": "1 juillet 2026", "en": "Jul 1, 2026"},
    "Nouvel An au Centre-ville": {"fr": "31 décembre 2026", "en": "Dec 31, 2026"},
}

for ev in data["events"]:
    if ev["name"] in DATES:
        ev["dates"] = DATES[ev["name"]]
        ev["bookingUrl"] = booking(ev["name"])

new_events = [
    {
        "category": "event", "name": "Whyte Avenue Art Walk", "is_buffet": False,
        "location": "Old Strathcona / Whyte Avenue",
        "description": "Plus grand festival d'art en plein air de l'Ouest canadien, avec des centaines d'artistes le long de Whyte Avenue. Démonstrations, ventes et ambiance créative.",
        "tags": ["festival", "art", "extérieur", "été"],
        "source_url": "https://exploreedmonton.com/events/art-walk",
        "dateLabel": {"fr": "JUIL", "en": "JUL"}, "dates": {"fr": "10–12 juillet 2026", "en": "Jul 10–12, 2026"},
        "price": {"fr": "Gratuit", "en": "Free"},
        "image": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
    },
    {
        "category": "event", "name": "Match des Oilers d'Edmonton (LNH)", "is_buffet": False,
        "location": "Rogers Place, 10220 104 Ave NW",
        "description": "Vivez l'ambiance électrique d'un match de hockey des Oilers dans l'aréna ultramoderne du centre-ville. L'expérience sportive incontournable d'Edmonton.",
        "tags": ["sport", "hockey", "soirée", "hiver"],
        "source_url": "https://exploreedmonton.com/events/oilers",
        "dateLabel": {"fr": "OCT–AVR", "en": "OCT–APR"}, "dates": {"fr": "Saison oct 2025 – avr 2026", "en": "Season Oct 2025 – Apr 2026"},
        "price": {"fr": "Dès 60$", "en": "From $60"},
        "image": "https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800&q=80",
    },
    {
        "category": "event", "name": "Edmonton International BeerFest", "is_buffet": False,
        "location": "Edmonton Convention Centre, 9797 Jasper Ave NW",
        "description": "Le plus grand festival de bière de l'Alberta avec des centaines de bières artisanales à déguster. Cuisine de rue et musique live au programme.",
        "tags": ["festival", "bière", "dégustation", "printemps"],
        "source_url": "https://exploreedmonton.com/events/beerfest",
        "dateLabel": {"fr": "MARS", "en": "MAR"}, "dates": {"fr": "27–28 mars 2026", "en": "Mar 27–28, 2026"},
        "price": {"fr": "Dès 35$", "en": "From $35"},
        "image": "https://images.unsplash.com/photo-1518176258769-f227c798150e?w=800&q=80",
    },
    {
        "category": "event", "name": "Candy Cane Lane", "is_buffet": False,
        "location": "Crestwood (148 St NW)",
        "description": "Rue résidentielle illuminée de décorations de Noël féeriques, tradition edmontonienne depuis 1968. À parcourir à pied ou en voiture, dons pour la banque alimentaire.",
        "tags": ["fête", "hiver", "lumières", "famille"],
        "source_url": "https://exploreedmonton.com/events/candy-cane-lane",
        "dateLabel": {"fr": "DÉC", "en": "DEC"}, "dates": {"fr": "Mi-décembre – 1 janv 2026", "en": "Mid-Dec – Jan 1, 2026"},
        "price": {"fr": "Gratuit (dons)", "en": "Free (donations)"},
        "image": "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800&q=80",
    },
    {
        "category": "event", "name": "Luminaria au Jardin Botanique", "is_buffet": False,
        "location": "University of Alberta Botanic Garden",
        "description": "Promenade nocturne magique à la lueur de milliers de bougies et lanternes dans le jardin japonais enneigé. Une tradition hivernale intime et féerique.",
        "tags": ["hiver", "lumières", "nuit", "famille"],
        "source_url": "https://exploreedmonton.com/events/luminaria",
        "dateLabel": {"fr": "DÉC", "en": "DEC"}, "dates": {"fr": "5–7 décembre 2026", "en": "Dec 5–7, 2026"},
        "price": {"fr": "Dès 25$", "en": "From $25"},
        "image": "https://images.unsplash.com/photo-1545048702-79362596cdc9?w=800&q=80",
    },
    {
        "category": "event", "name": "Royal Bison Art & Craft Fair", "is_buffet": False,
        "location": "Old Strathcona (8426 Gateway Blvd)",
        "description": "Foire d'art et d'artisanat indépendante mettant en vedette des créateurs locaux. Idéale pour des cadeaux uniques faits main.",
        "tags": ["marché", "art", "local", "automne"],
        "source_url": "https://exploreedmonton.com/events/royal-bison",
        "dateLabel": {"fr": "NOV", "en": "NOV"}, "dates": {"fr": "21–23 novembre 2026", "en": "Nov 21–23, 2026"},
        "price": {"fr": "Gratuit", "en": "Free"},
        "image": "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
    },
    {
        "category": "event", "name": "All Is Bright Festival", "is_buffet": False,
        "location": "124 Street NW",
        "description": "Festival d'illumination du quartier 124 Street lançant la saison des fêtes, avec marché, musique et feux d'artifice. Une soirée chaleureuse en plein hiver.",
        "tags": ["festival", "hiver", "lumières", "famille"],
        "source_url": "https://exploreedmonton.com/events/all-is-bright",
        "dateLabel": {"fr": "NOV", "en": "NOV"}, "dates": {"fr": "14 novembre 2026", "en": "Nov 14, 2026"},
        "price": {"fr": "Gratuit", "en": "Free"},
        "image": "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&q=80",
    },
    {
        "category": "event", "name": "Edmonton Motor Show", "is_buffet": False,
        "location": "Edmonton Expo Centre, 7515 118 Ave NW",
        "description": "Salon de l'auto présentant les derniers modèles, véhicules de luxe et concepts. Un rendez-vous pour les passionnés et les familles.",
        "tags": ["expo", "auto", "famille", "printemps"],
        "source_url": "https://exploreedmonton.com/events/motor-show",
        "dateLabel": {"fr": "AVR", "en": "APR"}, "dates": {"fr": "9–12 avril 2026", "en": "Apr 9–12, 2026"},
        "price": {"fr": "Dès 18$", "en": "From $18"},
        "image": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
    },
]
for ev in new_events:
    ev["bookingUrl"] = booking(ev["name"])

data["events"].extend(new_events)

with open(PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

missing = [e["name"] for e in data["events"] if "dates" not in e or "bookingUrl" not in e]
print("total events:", len(data["events"]))
print("missing dates/booking:", missing)
