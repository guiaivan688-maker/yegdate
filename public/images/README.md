# 📸 Photos Edmonton — Guide de remplacement (Chantier 3)

Les images actuelles sont des photos Unsplash **thématiques vérifiées** (aucune cassée).
Pour les remplacer par de **vraies photos d'Edmonton** (recommandé par l'audit) :

1. Dépose ta photo ici : `public/images/<segment>/<slug>.jpg`
   (ex. `public/images/couples/streetcar-prive-high-level.jpg`)
2. Ajoute le `slug` dans `src/lib/local-images.ts` → set `LOCAL_IMAGES`.
3. La photo locale remplace **automatiquement** le fallback Unsplash partout
   (carte, fiche détail, etc.). Tant qu'un slug n'est pas listé, l'image Unsplash
   thématique reste affichée — donc jamais de 404.

**Style recommandé** : haute résolution (1200px+ large), légèrement désaturé,
contraste élevé, format paysage. Cohérent avec la palette Navy/Gold.

---

## 💑 Couples — `public/images/couples/`

- [ ] `streetcar-prive-high-level.jpg` — Streetcar privatisé sur le High Level Bridge
- [ ] `diner-rge-rd.jpg` — Dîner gastronomique chez RGE RD
- [ ] `diner-corso-32.jpg` — Dîner romantique chez Corso 32
- [ ] `pique-nique-river-valley.jpg` — Pique-nique chic à Louise McKinney Park
- [ ] `patinage-victoria-iceway.jpg` — Patinage romantique au Victoria Park IceWay
- [ ] `observation-etoiles-elk-island.jpg` — Observation des étoiles à Elk Island
- [ ] `soiree-romance-fairmont.jpg` — Soirée Romance au Fairmont Hotel Macdonald
- [ ] `brunch-balade-the-marc.jpg` — Brunch & Balade — The Marc + Legislature
- [ ] `spa-duo-eveline-charles.jpg` — Spa en duo chez Eveline Charles
- [ ] `croisiere-edmonton-riverboat.jpg` — Croisière au coucher du soleil — Edmonton Riverboat

## 👨‍👩‍👧‍👦 Famille — `public/images/famille/`

- [ ] `telus-world-science.jpg` — TELUS World of Science
- [ ] `royal-alberta-museum.jpg` — Royal Alberta Museum
- [ ] `fort-edmonton-park.jpg` — Fort Edmonton Park
- [ ] `muttart-conservatory-famille.jpg` — Muttart Conservatory
- [ ] `galaxyland-wem.jpg` — Galaxyland — West Edmonton Mall
- [ ] `world-waterpark-wem.jpg` — World Waterpark — West Edmonton Mall
- [ ] `elk-island-bisons-famille.jpg` — Bisons & Sentiers à Elk Island
- [ ] `prairie-gardens-adventure-farm.jpg` — Prairie Gardens Adventure Farm
- [ ] `devonian-botanic-garden.jpg` — Devonian Botanic Garden
- [ ] `jump-360-anniversaire.jpg` — Anniversaire au Jump 360 Trampoline Park

## 🎉 Amis — `public/images/amis/`

- [ ] `bad-axe-throwing-amis.jpg` — Lancer de hache chez Bad Axe Throwing
- [ ] `locked-up-escape.jpg` — Escape Room chez Locked Up
- [ ] `activate-edmonton.jpg` — Jeux interactifs chez Activate
- [ ] `bowling-stones.jpg` — Bowling & Bar chez The Bowling Stones
- [ ] `edmonton-karting.jpg` — Karting de vitesse à Edmonton
- [ ] `sea-change-brewing-tour.jpg` — Tour de brasserie chez Sea Change
- [ ] `sip-and-color.jpg` — Soirée peinture chez Sip & Color
- [ ] `tuft-time-studio.jpg` — Atelier Tufting chez Tuft Time
- [ ] `mkt-food-market.jpg` — Soirée au MKT Beer Market
- [ ] `have-mercy-cocktails.jpg` — Cocktails & Sud chez Have Mercy

## 💼 Affaires — `public/images/business/`

- [ ] `bad-axe-team-building.jpg` — Team-Building Lancer de Hache — Bad Axe
- [ ] `escape-room-quest-corporate.jpg` — Escape Room Corporate — Quest Edmonton
- [ ] `cours-cuisine-get-cooking.jpg` — Cours de Cuisine Corporate — Get Cooking
- [ ] `curling-granite-club.jpg` — Initiation Curling — Granite Curling Club
- [ ] `brewery-tour-corporate.jpg` — Tour des Brasseries Corporate
- [ ] `segway-river-valley-corporate.jpg` — Tour Segway River Valley Corporate
- [ ] `soiree-corporate-fairmont.jpg` — Soirée Corporate au Fairmont Hotel Macdonald
- [ ] `power-lunch-hardware-grill.jpg` — Power Lunch au Hardware Grill
- [ ] `afterwork-the-common.jpg` — Afterwork Networking au The Common
- [ ] `privatisation-telus-science.jpg` — Soirée Privée au TELUS World of Science

---

### Autres images (hors activités)
- **Hero accueil** (slideshow) : `public/images/hero/` — 5 photos paysage d'Edmonton (skyline, River Valley, downtown nuit, prairies, aurores)
- **Événements** : `public/images/events/` — Jazz Fest, Taste of Edmonton, Fringe, etc.
- **Services** : `public/images/services/` — photographe, déco, pique-nique, chef, etc.

> Le hero et les événements utilisent encore des URLs directes (voir `HeroSlideshow.tsx` et `edmonton-data.json`). Remplace-les par les chemins locaux quand les photos sont prêtes.
