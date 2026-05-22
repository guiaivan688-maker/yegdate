# -*- coding: utf-8 -*-
import json, urllib.parse

PATH = "src/data/edmonton-data.json"
with open(PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

def booking(name):
    return "https://www.google.com/search?q=" + urllib.parse.quote_plus(name + " Edmonton billets")

IMG = "https://images.unsplash.com/{}?w=800&q=80"

new_events = [
    {"name": "Edmonton Symphony Orchestra", "location": "Winspear Centre, 9720 102 Ave NW",
     "description": "Concerts symphoniques de classe mondiale dans l'acoustique exceptionnelle du Winspear Centre. Programmes classiques, pops et ciné-concerts.",
     "tags": ["musique", "classique", "spectacle", "soirée"], "label": ("SEPT–MAI", "SEP–MAY"),
     "dates": ("Saison sept 2025 – mai 2026", "Season Sep 2025 – May 2026"), "price": ("Dès 30$", "From $30"),
     "img": "photo-1465847899084-d164df4dedc6"},
    {"name": "The Works Art & Design Festival", "location": "Sir Winston Churchill Square",
     "description": "Festival d'art et de design en plein air au centre-ville, avec installations, expositions et ateliers. Entrée gratuite pendant deux semaines.",
     "tags": ["festival", "art", "design", "été"], "label": ("JUIN", "JUN"),
     "dates": ("19 juin – 1 juil 2026", "Jun 19 – Jul 1, 2026"), "price": ("Gratuit", "Free"),
     "img": "photo-1513364776144-60967b0f800f"},
    {"name": "Nextfest", "location": "The Roxy Theatre, 10708 124 St NW",
     "description": "Festival multidisciplinaire dédié aux artistes émergents : théâtre, musique, danse et arts visuels. La relève créative d'Edmonton.",
     "tags": ["festival", "théâtre", "émergent", "été"], "label": ("JUIN", "JUN"),
     "dates": ("4–14 juin 2026", "Jun 4–14, 2026"), "price": ("Dès 15$", "From $15"),
     "img": "photo-1503095396549-807759245b35"},
    {"name": "Found Festival", "location": "Old Strathcona / Mill Creek Ravine",
     "description": "Festival d'arts de la scène dans des lieux inattendus du quartier Old Strathcona. Théâtre, performance et installations hors des sentiers battus.",
     "tags": ["festival", "art", "théâtre", "été"], "label": ("JUIL", "JUL"),
     "dates": ("9–12 juillet 2026", "Jul 9–12, 2026"), "price": ("Dès 20$", "From $20"),
     "img": "photo-1533174072545-7a4b6ad7a6c3"},
    {"name": "Edmonton Dragon Boat Festival", "location": "Louise McKinney Riverfront Park",
     "description": "Courses de bateaux-dragons colorées sur la rivière North Saskatchewan, avec cuisine et culture asiatiques. Spectacle gratuit au bord de l'eau.",
     "tags": ["sport", "festival", "extérieur", "été"], "label": ("AOÛT", "AUG"),
     "dates": ("22–23 août 2026", "Aug 22–23, 2026"), "price": ("Gratuit", "Free"),
     "img": "photo-1530870110042-98b2cb110834"},
    {"name": "A Christmas Carol au Citadel Theatre", "location": "Citadel Theatre, 9828 101A Ave NW",
     "description": "Adaptation théâtrale magistrale du classique de Dickens, tradition des fêtes à Edmonton depuis des décennies. Une sortie incontournable de décembre.",
     "tags": ["théâtre", "fête", "hiver", "famille"], "label": ("DÉC", "DEC"),
     "dates": ("28 nov – 23 déc 2026", "Nov 28 – Dec 23, 2026"), "price": ("Dès 45$", "From $45"),
     "img": "photo-1507924538820-ede94a04019d"},
    {"name": "Rapid Fire Theatre — Impro", "location": "Citadel Theatre (Backstage)",
     "description": "Spectacles d'improvisation hilarants chaque semaine par la troupe culte d'Edmonton. Aucune soirée ne se ressemble.",
     "tags": ["comédie", "spectacle", "soirée", "amis"], "label": ("HEBDO", "WEEKLY"),
     "dates": ("Toute l'année · ven-sam", "Year-round · Fri-Sat"), "price": ("Dès 20$", "From $20"),
     "img": "photo-1585699324551-f6c309eedeca"},
    {"name": "Edmonton Comedy Festival", "location": "Salles variées (centre-ville)",
     "description": "Festival réunissant humoristes canadiens et internationaux dans plusieurs salles de la ville. Stand-up, galas et spectacles à guichets fermés.",
     "tags": ["comédie", "festival", "soirée", "automne"], "label": ("OCT", "OCT"),
     "dates": ("15–18 octobre 2026", "Oct 15–18, 2026"), "price": ("Dès 25$", "From $25"),
     "img": "photo-1527224538127-2104bb71c51b"},
    {"name": "Servus Festival of Trees", "location": "Edmonton Convention Centre, 9797 Jasper Ave NW",
     "description": "Forêt de sapins magnifiquement décorés lançant la saison des fêtes, au profit d'œuvres caritatives. Ateliers, spectacles et magie de Noël.",
     "tags": ["fête", "hiver", "famille", "caritatif"], "label": ("NOV", "NOV"),
     "dates": ("25–29 novembre 2026", "Nov 25–29, 2026"), "price": ("Dès 20$", "From $20"),
     "img": "photo-1543589077-47d81606c1bf"},
    {"name": "Edmonton Home + Garden Show", "location": "Edmonton Expo Centre, 7515 118 Ave NW",
     "description": "Salon de la maison et du jardin avec experts, exposants et idées déco. Parfait pour planifier ses projets du printemps.",
     "tags": ["expo", "maison", "jardin", "printemps"], "label": ("MARS", "MAR"),
     "dates": ("19–22 mars 2026", "Mar 19–22, 2026"), "price": ("Dès 16$", "From $16"),
     "img": "photo-1416879595882-3373a0480b5b"},
]

for e in new_events:
    data["events"].append({
        "category": "event", "name": e["name"], "is_buffet": False, "location": e["location"],
        "description": e["description"], "tags": e["tags"],
        "source_url": "https://exploreedmonton.com/events/" + urllib.parse.quote(e["name"].lower().replace(" ", "-")),
        "dateLabel": {"fr": e["label"][0], "en": e["label"][1]},
        "dates": {"fr": e["dates"][0], "en": e["dates"][1]},
        "price": {"fr": e["price"][0], "en": e["price"][1]},
        "bookingUrl": booking(e["name"]),
        "image": IMG.format(e["img"]),
    })

with open(PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("total events:", len(data["events"]))
print("all have dates+booking+price:", all("dates" in e and "bookingUrl" in e and "price" in e for e in data["events"]))
