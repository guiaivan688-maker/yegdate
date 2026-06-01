# yeg-date — Spécifications produit & techniques

> **Version**: 2026-05-31 (livré) — révisé à chaque commit majeur
> **Owner**: Ivan Rudel Guiabu (solo builder, Edmonton AB)
> **Live**: https://wheretogoyeg.ca (auto-deploy depuis `origin/main` via Vercel)
> **Repo**: github.com/guiaivan688-maker/yegdate

---

## Table des matières

1. [Vision & positionnement](#1-vision--positionnement)
2. [Audience & personas](#2-audience--personas)
3. [Modèle économique](#3-modèle-économique)
4. [Architecture technique](#4-architecture-technique)
5. [Modèle de données](#5-modèle-de-données)
6. [Cartographie des pages & flows](#6-cartographie-des-pages--flows)
7. [État actuel — ce qui est en prod](#7-état-actuel--ce-qui-est-en-prod)
8. [Conformité légale (Canada / Alberta)](#8-conformité-légale-canada--alberta)
9. [Roadmap — prochaines tâches priorisées](#9-roadmap--prochaines-tâches-priorisées)
10. [Métriques & KPIs à suivre](#10-métriques--kpis-à-suivre)
11. [Risques & dette technique](#11-risques--dette-technique)
12. [Glossaire](#12-glossaire)

---

## 1. Vision & positionnement

### Vision en une phrase

> **Where To Go YEG est l'agenda intelligent d'Edmonton qui transforme « j'sais pas quoi faire » en « voilà ma soirée, prête à réserver », en 3 minutes.**

### Positionnement marketplace

C'est un **marketplace de planification d'expériences** à Edmonton, à l'intersection de :
- **Airbnb Experiences** (catalogue d'activités vérifiées)
- **Eventbrite** (événements ponctuels)
- **OpenTable** (réservations instantanées)
- **The Knot** (planification d'occasions spéciales)

**Ce qui nous différencie** :
1. **Multi-rôle natif** — couple/famille/amis/affaires/solo en un seul site, pas 5 sites séparés
2. **Composé sur-mesure** — pas que des packages figés, on assemble bloc par bloc
3. **Bilingue FR-EN dès le jour 1** — rare dans le marché albertain
4. **Hyper-local Edmonton** — pas du contenu générique, on parle Walterdale, Whyte Ave, Strathcona, Ice District

### Mission

Aider les Edmontoniens (et les visiteurs) à **arrêter de scroller** Instagram et **commencer à vivre** leur ville, sans la friction logistique (réservations, transport, déco, météo).

### Promesse client

- Tu nous dis **budget + humeur + avec qui**
- On te compose **une soirée prête à réserver** (parfois en 1 clic Stripe, parfois en devis 24 h)
- On gère **toute la logistique** (permis alcool, déco, photographe, plan B météo, nettoyage)

---

## 2. Audience & personas

5 personas (couvertes nativement par le ContextPicker dans la navbar) :

### P1 — Couple (haute valeur, signature)
- **Profil** : 25-45 ans, cherche date night ou occasion spéciale
- **Triggers** : anniversaire de couple, demande en mariage, anniversaire de mariage, « pimper » une soirée mardi
- **Budget moyen** : 150-600 $
- **Pages clés** : `/couples`, `/sur-mesure`, `/pique-nique` (occasion=couple), `/night-out`
- **Activité signature** : Streetcar privatisé sur le High Level Bridge

### P2 — Famille
- **Profil** : 30-50 ans, parents avec enfants 3-15 ans
- **Triggers** : sortie week-end, anniversaire enfant, vacances scolaires, hiver à occuper
- **Budget moyen** : 80-300 $ / famille
- **Pages clés** : `/famille`, `/pique-nique` (occasion=famille), `/buffets` (kid-friendly)
- **Activité signature** : Pique-nique Hawrelak Park / TELUS World of Science

### P3 — Amis (groupes 4-15)
- **Profil** : 20-40 ans, groupes pour EVJF/EVG, anniversaires, retrouvailles
- **Triggers** : enterrement de vie, anniversaire, soirée filles/gars
- **Budget moyen** : 50-100 $ / pers
- **Pages clés** : `/amis`, `/night-out`, `/pique-nique` (occasion=groupe), Pedal Pub
- **Activité signature** : Pedal Pub Whyte Ave / Night-out Afro Vibes

### P4 — Affaires (B2B)
- **Profil** : RH, manager d'équipe, EA, entrepreneur
- **Triggers** : team-building, 5 à 7, célébration objectif atteint, offsite, accueil nouvelle recrue
- **Budget moyen** : 80-200 $ / personne (facturation entreprise)
- **Pages clés** : `/business`, `/pique-nique` (occasion=event), `/packages`
- **Activité signature** : Team-Building Bad Axe Throwing / Pique-nique corporate Louise McKinney

### P5 — Solo
- **Profil** : nouveaux arrivants Edmonton, expat, célibataire en exploration
- **Triggers** : « je veux découvrir cette ville », « je m'ennuie ce week-end »
- **Budget moyen** : 30-100 $
- **Pages clés** : `/compositeur` (entry point solo), `/decouvrir`, `/carte`
- **Activité signature** : Brunch Walterdale + visite TELUS Science

---

## 3. Modèle économique

### Sources de revenus (à activer progressivement)

**Phase 1 — Aujourd'hui (T+0 à T+6 mois)** :
1. **Commission sur réservations Stripe** — 10-15 % sur chaque booking via `/reserver` (Stripe Checkout configuré)
2. **Devis sur-mesure** — markup sur les options pique-nique / sur-mesure (déco, photographe, panier traiteur, etc.) — marge 30-40 %
3. **Featured listings** — partenaires payent pour apparaître « En vedette » (admin a déjà la fonctionnalité)

**Phase 2 — T+6 à T+12 mois** :
4. **Abonnement partenaires** — restos/photographes/fleuristes Edmonton payent un abonnement mensuel pour être listés (la table `partners` est prête)
5. **Codes promo affiliés** — partenariats marketing (admin a déjà la gestion des codes promo)
6. **Sponsored content** — guides/idées sponsorisés par lieux locaux

**Phase 3 — T+12 mois +** :
7. **Marketplace API** — autres apps tourisme/concierge Edmonton qui consomment notre catalogue
8. **Corporate B2B subscription** — entreprises Edmonton avec un budget annuel team-building
9. **White-label** — autres villes canadiennes (Calgary, Saskatoon) achètent la plateforme

### Coûts opérationnels actuels

- **Vercel** — gratuit (Hobby tier) tant que < 100 GB bandwidth / mois
- **Supabase** — gratuit (free tier) tant que < 500 MB DB + 50K MAU
- **Stripe** — 2,9 % + 0,30 $ / transaction
- **Resend (emails)** — gratuit jusqu'à 3 000 emails/mois
- **Domaine `wheretogoyeg.ca`** — ~25 $/an
- **Total fixe** : ~25 $/an + frais variables Stripe

---

## 4. Architecture technique

### Stack

| Couche | Technologie | Notes |
|---|---|---|
| **Framework** | Next.js 16.2.6 (App Router) | ⚠️ « This is NOT the Next.js you know » — read node_modules/next/dist/docs/ avant tout changement |
| **Runtime** | React 19.2.4 | Server Components par défaut, client islands ciblées |
| **Styling** | Tailwind CSS 4 + tokens custom | navy / gold / cream / surface / warm-grey |
| **Animations** | framer-motion 12 | `<motion.div>`, `AnimatePresence` partout |
| **Icônes** | lucide-react 1.16 | (heroicons aussi installé, à dédupliquer) |
| **Cartes** | leaflet 1.9 + react-leaflet 5 | OSM tiles, ssr:false via dynamic import |
| **Optimisation images** | sharp (script) + next/image runtime | mozjpeg q=82, max 1920 px |
| **Hébergement** | Vercel | auto-deploy `origin/main`, edge functions |
| **Base de données** | Supabase Postgres 17 (ca-central-1) | RLS activé partout, Canadian region pour PIPEDA |
| **Auth** | Supabase Auth | magic link email + Google OAuth |
| **Paiements** | Stripe Checkout | déjà configuré, webhook vers `/api/stripe/checkout` |
| **Emails** | Resend | quote requests + booking confirmations |
| **Analytics** | Custom `Analytics` component | + Google Search Console |
| **Tests E2E** | Playwright 1.60 | chromium-desktop, 4 spec files |
| **i18n** | locale-context custom | `useLocale()` + `t()` + locale toggle FR/EN, dictionnaires JSON |

### Choix architecturaux clés

#### Server Components vs Client Islands
- **Pages segment** (couples/famille/amis/business) : SERVER → `generateMetadata` SEO + JSON-LD inline
- **Pages avec état** (pique-nique, night-out, buffets, carte, reserver, admin) : split en `page.tsx` (server, metadata) + `XClient.tsx` (`"use client"`)
- **Composants partagés** : ContextPicker, Navbar, Footer, ActivityCard, LoveRooms → client (utilisent useState ou context)

#### Stockage des données
**Hybride** par design :
- **Données quasi-statiques** (activités curées, parcs pique-nique, options) → fichiers JSON dans `src/data/`
- **Données dynamiques** (offers, bookings, profiles, promo codes, banners, reports, **partners**, composer runs) → Supabase

**Migration future** prévue : passer les activités/parcs/options en Supabase une fois le contenu stabilisé pour permettre édition admin live.

#### Internationalisation
- 2 locales : `fr` (par défaut) et `en`
- Dictionnaires : `src/locales/fr.json` + `src/locales/en.json`
- Pattern : `useLocale()` → `{ locale, t, toggleLocale }`
- Stored in localStorage + `<html lang>` reflète
- Audit voix **tu/vous** : tout est en `tu` (tutoiement) cohérent

### Structure du repo

```
yeg-date/
├── docs/                         # ← Ce fichier
├── public/
│   └── images/edmonton/          # 19 vraies photos d'Edmonton
├── e2e/                          # Playwright tests
├── scripts/
│   └── optimize-photos.mjs       # Resize CLI
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (routes)              # 25+ routes
│   │   ├── api/                  # Server routes
│   │   ├── layout.tsx            # Root (JSON-LD, metadata, providers)
│   │   ├── sitemap.ts            # Auto sitemap
│   │   └── robots.ts
│   ├── components/               # Shared UI
│   ├── data/                     # JSON content (activities, picnic-*, buffets, plans, edmonton-data)
│   ├── lib/                      # Helpers + contexts (locale, weather, favorites, context-picker, schema, activity-filters)
│   └── locales/                  # fr.json, en.json
└── supabase/migrations/          # SQL migrations (0001 → 0011)
```

---

## 5. Modèle de données

### A. Données JSON (statiques)

#### `activities-{couples|famille|amis|business}.json`

Chaque activité :
```ts
interface Activity {
  id: string;
  slug: string;
  segment: "couples" | "famille" | "amis" | "business";
  title: { fr: string; en: string };
  location: string;            // nom du lieu
  address: string;             // adresse Edmonton complète
  description: { fr, en };
  longDescription: { fr, en }; // 2-3 paragraphes
  image: string;               // /images/edmonton/… ou Unsplash
  gallery: string[];
  priceRange: { fr: "40$ - 55$ / personne", en: "$40 - $55 / person" };
  priceFrom: number;
  priceTo: number;
  budgetTier: number;          // catégorie budget
  duration: { fr, en };
  groupSize: { fr, en };       // "4-20 personnes"
  ageRange?: { fr, en };       // pour famille
  season: string[];            // spring|summer|fall|winter
  mood: string[];              // calme|dynamique|gourmand|decouverte|romantique|luxe
  tags: string[];              // picnic, photographe, instagram, evjf, etc.
  includes: { fr: string[], en: string[] };
  services: string[];          // photographer|roomDecor|eventPlanner|picnic|picnic
  cta: "book" | "quote";
  rating: number;              // 4.7 - 5.0
  mapsQuery: string;
  coords: [number, number];    // pour /carte
}
```

#### `activities-picnic.json` (10 entrées)
Mêmes champs, segment varie selon l'occasion.

#### `picnic-parks.json` (23 entrées : 15 outdoor + 8 indoor)
```ts
interface Park {
  id, name, neighbourhood, address, coords, image;
  description: { fr, en };
  size, capacity;
  amenities: string[];         // parking, washrooms, playground, shelter, lake, heated, accessible, etc.
  reservation_required: boolean | "partial" | "verify";
  reservation_note?: { fr, en };
  best_for: string[];          // couple, famille, groupe, event
  best_spot: { fr, en };
  scenic_skyline, sunset_view;
  watchout?: { fr, en };       // ⚠️ ex: Hawrelak en rénovation jusqu'en 2026
  bbq_allowed, dog_friendly;
  setting: "outdoor" | "indoor" | "hybrid";
  best_season: string[];
}
```

#### `picnic-options.json` (28 entrées)
20 add-ons : décoration romantique, panier gourmet, photographe golden hour, transport privé, demande en mariage setup (599 $), pack anti-moustique, permis alcool, pack soleil, setup hiver, etc.

#### Autres
- `buffets.json` — restaurants AYCE par catégorie
- `weekend-plans.json` + `plans.json` — plans pré-composés
- `guides.json` — articles longs SEO
- `edmonton-data.json` — events de la ville (calendar municipal)

### B. Tables Supabase (dynamiques)

| Table | Description | RLS |
|---|---|---|
| `profiles` | Utilisateurs avec rôle (client / prestataire / admin) | admin r/w, owner r/w self |
| `offers` | Offres à réserver via /reserver | admin r/w, public read where status=published |
| `booking_requests` | Demandes de réservation (Stripe → confirmation) | admin r/w, owner r/w self |
| `composer_runs` | Logs des sessions /compositeur (analytics) | admin r/o |
| `promo_codes` | Codes promo actifs (% off) | admin r/w |
| `site_banners` | Bandeau annonce en haut du site | admin r/w, public read active |
| `user_reports` | Signalements (Report buttons) | admin r/w, owner r |
| **`partners`** ✨ | **Catalogue restos/photographes/fleuristes Edmonton** | **admin r/w, public read active** |

Migrations : `supabase/migrations/0001` → `0011_partners.sql` (toutes appliquées).

---

## 6. Cartographie des pages & flows

### Routes publiques (25+)

#### Pages d'entrée (Plan ton expérience)
| Route | Rôle | État |
|---|---|---|
| `/` | Home — slideshow Edmonton, hero CTA → /compositeur, galerie public art, témoignages | ✅ |
| `/compositeur` | Builder par budget+contexte (4 questions → plan auto) | ✅ |
| `/sur-mesure` | Bloc-par-bloc (brunch + spa + dîner + photographe…), devis 24h | ✅ |
| `/weekend-match` | 4 questions → plans recommandés ce week-end | ✅ |
| `/pique-nique` | 23 lieux × 28 options × 4 occasions → estimation + devis | ✅ |

#### Pages domaines (segments)
| Route | Hero image | Filtres |
|---|---|---|
| `/couples` | Couple Walterdale sunset | Saison + Quartier + Nb couples + featured LoveRooms |
| `/famille` | Hawrelak aerial | Saison + Quartier + Nb personnes |
| `/amis` | 4 amis pique-nique Walterdale | Saison + Quartier + Nb personnes |
| `/business` | Corporate (Unsplash) | Saison + Quartier + Nb personnes |

Tous : grille `ActivityCard` avec estimation guest-aware (multiplie par pers/couple/famille selon priceRange).

#### Pages catalogue spécialisé
| Route | Description |
|---|---|
| `/night-out` | Soirées clé en main, **vibe-first** (Afro 🌍, Latino 💃, Hip-Hop 🎤, EDM…) |
| `/buffets` | AYCE sushi, BBQ coréen, hot pot — filtre par quartier |
| `/evenements` | Calendrier municipal Edmonton + curé |
| `/packages` | Forfaits B2B premium |
| `/services` | Photographe, picnic chic, déco romantique, event planner |
| `/guides` | Articles SEO longs (saisonniers, par occasion) |
| `/idees` | Pages idées par segment+budget (gen statique SSG) |

#### Pages utiles
| Route | Description |
|---|---|
| `/decouvrir` | Toutes activités avec filtres segment+budget |
| `/carte` | Carte Leaflet interactive avec pins colorés par segment |
| `/recherche` | Recherche full-text |
| `/mes-favoris` | Favoris persistés (localStorage) |
| `/reserver` | Funnel booking → Stripe Checkout |
| `/reservation-confirmee` | Ticket QR après paiement |
| `/activite/[slug]` | Page détail (TouristAttraction JSON-LD) |
| `/contact`, `/about`, `/confidentialite`, `/conditions` | Légal |

#### Admin (`/admin`)
9 onglets (sidebar + mobile select) :
1. **Vue d'ensemble** — KPIs offers/bookings/runs/promos + stats pique-nique
2. **Réservations** — statut + filtres + actions
3. **Utilisateurs** — gestion rôles client/prestataire/admin
4. **Analyses** — runs compositeur, distribution budget, match rate, sparklines
5. **Modération** — offers draft → publish → suspend
6. **Signalements** — `ReportsManager`
7. **Codes promo** — création/toggle/delete
8. **Bannière** — `BannerManager`
9. **Pique-nique** — read-only (parks/options/activities JSON)
10. **Partenaires** ✨ — CRUD complet (9 catégories, 4 tiers prix, statut, tags)
11. **Marketing** — UTM builder, share links

### Flows clés

#### Flow A — Couple cherche date night
1. Arrive sur `/` → voit ContextPicker pill « 💑 Couple · 2 pers »
2. Clique « Voir les activités couple » → `/couples`
3. Filtre saison + quartier → choisit Streetcar privatisé High Level Bridge
4. Clique → `/activite/streetcar-prive-high-level` (page détail avec JSON-LD)
5. CTA « Demander un devis » → quote form (Resend email)

#### Flow B — Famille pique-nique d'été
1. Home → CTA picnic → `/pique-nique`
2. Sélectionne « En famille » + 4 personnes
3. Voit 6 parcs recommandés (Hawrelak ⚠️ warning, Rundle, Borden…)
4. Clique Rundle → Step 3 options apparaît
5. Coche : Setup famille, Panier famille, Box enfant, Pack jeux, Plan B météo
6. Total : 280 $ → form name+email → submit → reçoit devis sous 24 h

#### Flow C — EVJF Pedal Pub
1. Amie clique pill ContextPicker → « 🥂 Amis · 8 pers »
2. Va sur `/amis`, voit Pedal Pub en card
3. Page détail → quote → Ivan confirme dispo + prix

#### Flow D — Business team-building
1. RH cherche → `/business`
2. Bad Axe Throwing Team-Building (segment business)
3. CTA quote avec entreprise + nb employés
4. Ivan envoie devis + facture corpo

#### Flow E — Booking instant (Stripe)
1. Visite `/reserver`
2. Voit offers actifs (Supabase featured first)
3. Clique « Réserver » sur une offre
4. Form : nom* + email* + party_size + date (min=today)
5. Submit → POST /api/stripe/checkout → redirect checkout.stripe.com
6. Paiement → webhook → ticket QR sur `/reservation-confirmee`

---

## 7. État actuel — ce qui est en prod

### Chantiers livrés (chronologique, derniers commits)

#### Phase 0 — Refonte multi-rôle (Mai 2026, début)
- Pages segments avec filtres (saison + quartier + nb personnes + estimation guest-aware)
- Refactor SEO : amis/famille/couples/business/buffets/night-out → server components avec generateMetadata
- Vibe-first transformation de /night-out (Afro, Latino, Hip-Hop chip filter)
- 5 nouvelles photos hero curées multi-rôles
- Audit copy complet : tutoiement FR cohérent partout

#### Phase 1 — Photos Edmonton authentiques
- 19 vraies photos Edmonton uploadées dans `/public/images/edmonton/`
- Remplacement de tous les heros génériques Unsplash
- Composant `EdmontonGallery` sur home (8 tuiles : Talus Dome, Vaulted Willow, Big Boots Southgate, Carbon Copy, Mosaic Park, Rundle, Freewill Shakespeare, automne)
- Pedal Pub ajouté comme activité /amis
- Princess Theatre ajouté comme package /night-out
- /decouvrir hero swap Unsplash → photo locale

#### Phase 2 — Feature Pique-nique (gros chantier)
- Nouvelle page `/pique-nique` avec builder complet
- 14 parcs Edmonton initiaux (Walterdale, Hawrelak, Borden, Mill Creek, End of the World…)
- 28 options (déco, catering, photo, transport, activity, logistique)
- 10 activités picnic réparties sur les 4 segments
- Filtre outdoor/indoor/hybride avec 8 lieux indoor (Muttart Conservatory, City Hall Pyramid, Federal Building Atrium, Stanley Milner Library…)
- Total : **23 lieux** disponibles
- Admin tab read-only ajouté

#### Phase 3 — Témoignages & conversion
- 6 témoignages Edmonton réalistes (Marc & Lucie au Streetcar, Jasmine au Pedal Pub, Famille Tremblay à Borden, David proposal Walterdale, Sophie Bad Axe, Amélie & Karim TELUS)
- LoveRooms remonté en spotlight sur /couples (au-dessus de la grille)
- `/reserver` durci : email required, min-date today, asterisks, reminder prix sous bouton
- Carte interactive `/carte` avec Leaflet + pins par segment + filtres

#### Phase 4 — Polish & croissance (dernier push)
- Hawrelak warning BIG (banner rouge full-width quand sélectionné)
- Photos optim sharp : 11,4 MB → 2,2 MB sur les 4 plus grosses
- **Mega-menu navbar** : 7 liens → 3 buckets (Planifier / Réserver / Découvrir)
- **ContextPicker persistant** : pill toujours visible, 5 personas, guest stepper, localStorage
- **JSON-LD structured data** : LocalBusiness + WebSite SearchAction + Organization + TouristAttraction/Service par activité + ItemList par segment + Service Picnic avec AggregateOffer
- Sitemap.xml enrichi
- **Admin Partenaires** : CRUD complet + migration Supabase appliquée live
- **Tests E2E Playwright** : 4 specs (navbar, reserver, picnic, segments)

### Métriques actuelles du repo

- **Routes** : 35+ (25 publiques + 10+ api + dynamic [slug])
- **Composants** : 30+
- **Activités curées** : ~50 (10 par segment + 10 picnic + 8 night-out packages)
- **Parcs pique-nique** : 23 (15 outdoor, 8 indoor)
- **Options pique-nique** : 28
- **Quartiers détectés auto** : 8 (Downtown, Whyte Ave, Ice District, West Edmonton, NW/NE/SW/SE)
- **Tests E2E** : 16 tests dans 4 fichiers
- **Migrations Supabase** : 11 (toutes appliquées en ca-central-1)
- **Photos locales** : 19 (toutes Edmonton)
- **Tables Supabase** : 8 (profiles, offers, booking_requests, composer_runs, promo_codes, site_banners, user_reports, partners)

---

## 8. Conformité légale (Canada / Alberta)

> **Important** : Ivan opère une entreprise canadienne (Alberta) qui collecte des données personnelles. Stack hébergement choisi pour conformité.

### Lois applicables

| Loi | Description | Notre conformité |
|---|---|---|
| **PIPEDA** (fédéral) | Loi sur la protection des renseignements personnels | ✅ Résidence des données Canada (Supabase ca-central-1) |
| **PIPA Alberta** | Personal Information Protection Act | ✅ Hosting au Canada, consentement explicit aux cookies prévu |
| **Consumer Protection Act AB** | Pratiques commerciales | ✅ Prix transparents, terms et conditions à la racine |
| **Anti-Spam (CASL)** | Emails marketing | ⏳ Double opt-in newsletter à mettre en place |

### Décisions architecturales liées

- **Supabase ca-central-1** (Toronto) → données clients restent au Canada
- **Vercel** → edge global mais data au repo (pas de DB exposée)
- **Stripe** → traite paiements (PCI compliance hors de notre périmètre)
- **Resend** → envoie emails depuis EU, à vérifier pour CASL

### À faire pour la mise en conformité totale

- [ ] Bandeau cookie consent (PIPEDA + Quebec Bill 25 future-proof)
- [ ] Page `/confidentialite` à étoffer avec sections PIPEDA standard
- [ ] Logger les consents en DB (table `consents`)
- [ ] Double opt-in newsletter (CASL)
- [ ] Bouton "Supprimer mon compte" (PIPEDA droit à l'oubli)
- [ ] Audit des logs Supabase (logging RGPD-style)
- [ ] Mentionner clairement le hosting Canada dans /about

**Principe directeur** (préférence mémorisée) : se baser sur sources officielles canadiennes (gc.ca, CIRA, OIPC Alberta), **pas** des outils tiers.

---

## 9. Roadmap — prochaines tâches priorisées

### Format : Priorité × Effort

- **P0** = bloque la conversion / casse l'expérience / risque légal
- **P1** = clairement améliore polish, conversion, ou autonomie d'Ivan
- **P2** = nice-to-have, à attaquer une fois P0 et P1 vidés

---

### 🔥 P0 — À faire avant d'attirer du trafic payant

1. **Activer le bandeau cookie consent**
   - PIPEDA + Quebec Bill 25 même si Alberta-only (futur visiteurs québécois)
   - Effort : 2 h
   - Risque si non fait : pas immédiat mais devient obligatoire avec trafic

2. **Email confirmation côté serveur après quote/booking**
   - Resend déjà installé, juste à wire les templates
   - Effort : 3 h
   - Risque : actuellement on dit « on revient sous 24h » mais pas d'email confirmation auto

3. **Robots.txt + sitemap submitted to Google Search Console**
   - sitemap.xml existe déjà
   - Effort : 30 min
   - Risque : Google ne crawle pas → 0 trafic organique

4. **Détecter les liens cassés sur le site**
   - Audit toutes les routes pour 404
   - Effort : 1 h
   - Risque : SEO + UX

### 🚀 P1 — Croissance & autonomie

5. **Hawrelak — re-vérifier date réouverture officielle**
   - Mai 2026 = warning toujours actif
   - Soit retirer le warning si la Ville confirme réouverture, soit ajuster
   - Effort : 30 min recherche + 15 min code

6. **Migration Supabase pour picnic data**
   - Actuellement parks/options/activities en JSON → édition admin live
   - Effort : 4 h (3 nouvelles tables + migration JSON → DB + adapter `getPicnicParks`)
   - Valeur : ajouter un parc ou option ne demande plus de touche code

7. **Public surfacing des partenaires actifs**
   - La table existe et le CRUD est admin ; il faut maintenant les afficher
   - Sur `/activite/[slug]` (photographer associé à cette activité) ou sur une nouvelle page `/partenaires`
   - Effort : 4 h

8. **CI GitHub Actions pour les tests E2E**
   - Le workflow est documenté dans `e2e/README.md` mais pas activé
   - Effort : 30 min
   - Valeur : protège contre les régressions

9. **Bouton « Supprimer mon compte »**
   - PIPEDA droit à l'oubli
   - Effort : 2 h (UI + delete cascade)

10. **Optimisation photos restantes**
    - Le script `scripts/optimize-photos.mjs` existe — étendre à toutes les photos > 500 KB
    - Effort : 30 min

11. **Système de favoris en DB (au lieu de localStorage seul)**
    - Pour utilisateurs connectés, synchroniser cross-device
    - Effort : 2 h

12. **Pages `/guides/[slug]` avec content SEO long**
    - Sujets : "Quoi faire à Edmonton en hiver", "Date night Edmonton sous 100 $", "Pique-nique romantique Walterdale"
    - Effort : ~2 h/article × 10 = 20 h
    - Valeur : énorme pour SEO (long tail)

### 🌱 P2 — Polish & nice-to-haves

13. **Apple Wallet pass pour les tickets bookés** — Stripe + qrcode.react déjà là
14. **Newsletter automation** — Resend + segmentation
15. **Multi-langue : ajout de langues supplémentaires** (espagnol / ukrainien — communautés Edmonton)
16. **App mobile React Native** — avec Expo, partage la lib `activities` JSON
17. **Connexion Open Data Edmonton enrichie** — déjà connecté pour `/evenements`, étendre
18. **Brand kit & design system formalisé** — Figma avec tokens
19. **Témoignages avec photos clients réelles** — collecter via post-booking email
20. **AIConcierge LLM** — composant existe mais à brancher sur un vrai modèle (actuellement basique)

### 🏗️ Phase 2 (T+6 à T+12 mois) — Scale-up

21. **Abonnement partenaires** (49 $/mois par exemple) avec analytics
22. **Outbound sales partenaires** — chercher 50 photographes/fleuristes Edmonton et les onboarder
23. **Programme ambassadeurs** — utilisateurs power qui invitent leurs amis
24. **SEO content : 50 guides SEO** Edmonton-focus
25. **Local partnerships** — Explore Edmonton, Travel Alberta, Edmonton Tourism

### 🌍 Phase 3 (T+12 mois +) — Expansion

26. **White-label pour Calgary** — duplicate la stack en `calgary-date.ca`
27. **Mobile app native** — iOS + Android
28. **Public API** pour partenaires tech (autres tour operators, etc.)
29. **Corporate B2B contracts** (budgets annuels team-building)

---

## 10. Métriques & KPIs à suivre

### Acquisition
- **Visiteurs uniques / mois** (Google Analytics ou Plausible recommandé)
- **Sources** : organique, social IG/FB/TikTok, direct, referral
- **Top landing pages** : home, /couples, /pique-nique (à monitorer)

### Engagement
- **Sessions /compositeur** — count via `composer_runs` table (admin already tracks)
- **Match rate** — % de runs qui trouvent un plan
- **Taux d'ajout aux favoris** — count localStorage events
- **Temps moyen sur /pique-nique** — proxy de l'engagement builder

### Conversion
- **Quote requests / mois** — count par segment + occasion
- **Bookings Stripe complétés / mois** — count `booking_requests` status=confirmed
- **Taux de conversion quote → booking** — via email manual follow-up
- **Revenue brut / mois** — somme `offers.price_from × bookings.party_size`
- **Top offers bookées** — déjà calculé dans admin dashboard

### Retention
- **% utilisateurs revenants** (cookies)
- **Newsletter open rate** (Resend dashboard)

### Cible **T+6 mois** (estimation prudente)
- 5 000 visiteurs uniques / mois
- 200 quote requests / mois
- 30 bookings Stripe / mois
- 4 500 $ revenue brut / mois → 600 $ net pour Ivan (commission ~13 %)

---

## 11. Risques & dette technique

### Risques business

1. **Hawrelak fermé jusqu'en 2026** → notre parc star n'est pas dispo cet été. **Mitigation** : warnings BIG en place + Rundle Park comme alternative familiale, Borden Park comme pivot photogénique.
2. **Saisonnalité Edmonton** → 6 mois d'hiver. **Mitigation** : indoor venues live (Muttart, Federal Building, City Hall Pyramid), winter picnic option, Victoria Park skating.
3. **Dépendance partenaires** → si Pedal Pub disparaît, contenu cassé. **Mitigation** : la table `partners` permet de switcher en CRUD admin.
4. **Compétition** → ExploreEdmonton.com (officiel) + Eventbrite. **Différenciateur** : multi-rôle + composable + bilingue.

### Dette technique connue

1. **JSON vs Supabase** — picnic/activities en JSON limite l'agilité (Phase P1.6 ci-dessus)
2. **Pas de tests unitaires** — seulement E2E. Couverture libs (`activity-filters`, `schema`) à ajouter
3. **`resolveImage` half-wired** — système de surcharge local-images.ts pas utilisé (Set vide)
4. **2 librairies d'icônes** — `lucide-react` + `@heroicons/react` (dédupliquer)
5. **Photos > 500 KB restantes** — quelques photos `/images/edmonton/` (vaulted-willow, mosaic-park) à 500-600 KB
6. **AIConcierge mock** — composant en placeholder, à brancher sur LLM
7. **Logs structuré** — pas encore d'observabilité (Sentry / Logflare conseillé)
8. **i18n des données activités** — `title.fr/en` partout mais traductions parfois littérales, à curer
9. **Mobile menu** — accordéon fait main, accessible mais pourrait utiliser une lib (`@radix-ui/react-accordion`)

### Performance

- **LCP** : OK depuis optim photos + sizes
- **CLS** : potentiel sur HeroSlideshow crossfade (mode wait géré)
- **TBT** : framer-motion partout → légère pression sur mobile, OK actuellement

---

## 12. Glossaire

| Terme | Définition |
|---|---|
| **AYCE** | All-You-Can-Eat (buffet à volonté) |
| **EVJF / EVG** | Enterrement de vie de jeune fille / garçon |
| **Compositeur** | Outil de planification budget+contexte → plan auto |
| **Sur-mesure** | Builder bloc-par-bloc avec devis |
| **ContextPicker** | Pill navbar persistant : persona + nb pers |
| **Featured section** | Spotlight au-dessus de la grille d'activités (ex: LoveRooms sur /couples) |
| **Segment** | Couples / Famille / Amis / Business |
| **Setting (picnic)** | Outdoor / Indoor / Hybrid |
| **Watchout** | Avertissement attaché à un lieu (ex: Hawrelak en rénovation) |
| **Hybrid park** | Parc outdoor avec pavillon couvert (Hawrelak, Rundle, Victoria) |
| **Quote / Devis** | Demande de personnalisation, réponse Ivan sous 24 h |
| **PIPEDA** | Loi fédérale canadienne sur la protection des renseignements personnels |
| **PIPA Alberta** | Equivalent provincial pour secteur privé |
| **RLS** | Row Level Security (Supabase) — permissions par rangée |
| **LCP / CLS / TBT** | Largest Contentful Paint / Cumulative Layout Shift / Total Blocking Time (Core Web Vitals) |

---

## Annexes

### A. Commandes utiles

```bash
# Dev
npm run dev                         # localhost:3000

# Tests E2E
npm run test:e2e                    # headless
npm run test:e2e:ui                 # debug interactif

# Build
npm run build                       # next build
npx tsc --noEmit                    # type check seul

# Optim photos
node scripts/optimize-photos.mjs    # resize les 4 grosses

# Deploy
git push origin main                # → Vercel auto-deploy
```

### B. Variables d'environnement (Vercel)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (côté API routes)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_BASE_URL` = https://wheretogoyeg.ca

### C. Liens externes

- **Repo GitHub** : github.com/guiaivan688-maker/yegdate
- **Vercel dashboard** : vercel.com (team Ivan)
- **Supabase project** : ca-central-1, project_id `guvyforoptoxcoetqcsh`
- **Stripe** : dashboard.stripe.com (mode test → live à confirmer)
- **Resend** : resend.com (FROM = wheretogoyeg@gmail.com)
- **Open Data Edmonton** : data.edmonton.ca (festival calendar API)
- **Domaine** : CIRA (.ca registry)

---

*Document généré et maintenu par Claude (Anthropic). Last update via commit pas encore poussé.*
*Pour mettre à jour : éditer ce fichier, commit, push. Le doc est versionné avec le code.*
