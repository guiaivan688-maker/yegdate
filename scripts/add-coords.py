# -*- coding: utf-8 -*-
import json, glob

COORDS = {
    # couples
    "streetcar-prive-high-level": [53.5232, -113.5076],
    "diner-rge-rd": [53.5556, -113.5215],
    "diner-corso-32": [53.5410, -113.4980],
    "pique-nique-river-valley": [53.5370, -113.4875],
    "patinage-victoria-iceway": [53.5430, -113.5180],
    "observation-etoiles-elk-island": [53.6000, -112.8600],
    "soiree-romance-fairmont": [53.5392, -113.4895],
    "brunch-balade-the-marc": [53.5395, -113.5020],
    "spa-duo-eveline-charles": [53.5420, -113.4905],
    "croisiere-edmonton-riverboat": [53.5300, -113.4760],
    # famille
    "telus-world-science": [53.5680, -113.5240],
    "royal-alberta-museum": [53.5465, -113.4975],
    "fort-edmonton-park": [53.5040, -113.5800],
    "muttart-conservatory-famille": [53.5300, -113.4730],
    "galaxyland-wem": [53.5225, -113.6240],
    "world-waterpark-wem": [53.5225, -113.6245],
    "elk-island-bisons-famille": [53.6000, -112.8600],
    "prairie-gardens-adventure-farm": [53.8400, -113.4200],
    "devonian-botanic-garden": [53.3900, -113.7700],
    "jump-360-anniversaire": [53.6100, -113.5200],
    # amis
    "bad-axe-throwing-amis": [53.5460, -113.5030],
    "locked-up-escape": [53.5560, -113.5180],
    "activate-edmonton": [53.4490, -113.5060],
    "bowling-stones": [53.5180, -113.3160],
    "edmonton-karting": [53.3700, -113.6700],
    "sea-change-brewing-tour": [53.4900, -113.4750],
    "sip-and-color": [53.5180, -113.4980],
    "tuft-time-studio": [53.5560, -113.5180],
    "mkt-food-market": [53.5160, -113.4920],
    "have-mercy-cocktails": [53.5550, -113.5180],
    # business
    "bad-axe-team-building": [53.5460, -113.5030],
    "escape-room-quest-corporate": [53.5560, -113.5180],
    "cours-cuisine-get-cooking": [53.5470, -113.4980],
    "curling-granite-club": [53.5080, -113.5060],
    "brewery-tour-corporate": [53.4900, -113.4750],
    "segway-river-valley-corporate": [53.5360, -113.4870],
    "soiree-corporate-fairmont": [53.5392, -113.4895],
    "power-lunch-hardware-grill": [53.5430, -113.4870],
    "afterwork-the-common": [53.5380, -113.5030],
    "privatisation-telus-science": [53.5680, -113.5240],
}

for fp in glob.glob("src/data/activities-*.json"):
    data = json.load(open(fp, encoding="utf-8"))
    for a in data:
        a["coords"] = COORDS.get(a["slug"], [53.5444, -113.4909])
    json.dump(data, open(fp, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

missing = []
for fp in glob.glob("src/data/activities-*.json"):
    data = json.load(open(fp, encoding="utf-8"))
    for a in data:
        if a["slug"] not in COORDS:
            missing.append(a["slug"])
print("coords added. unmapped (used downtown default):", missing)
