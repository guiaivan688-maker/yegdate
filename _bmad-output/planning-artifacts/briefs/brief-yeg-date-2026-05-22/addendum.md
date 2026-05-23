# Addendum — YEG Date (Love Room YEG)

Détail extrait du code (`src/data/plans.json`, `src/locales/fr.json`, `src/app/*`). Profondeur destinée au PRD / à l'architecture — hors du brief de 2 pages.

## Catalogue des forfaits (prix fixes observés)

| Forfait | Prix | Segment | Inclus (résumé) |
|---|---|---|---|
| Date Surprise Box | 49 $ | couple | Boîte livrée + mini-aventure guidée |
| Picnic Essentiel | 99 $ | couple | Installation 2 pers., River Valley |
| Picnic Premium | 199 $ | couple | Setup luxe + champagne + photographe 30 min |
| Déco + Dîner | 349 $ | couple | Chambre décorée + dîner 3 services livré |
| Journée Parfaite | 549 $ | couple | Brunch + activité + spa duo + dîner |
| **Grande Romance** (signature) | 1 199 $ | couple | Streetcar privatisé + photographe 2 h + dîner + suite Fairmont |
| EVJF Premium | 1 999 $ | amis | Pour 8 : brunch + atelier + spa + dîner + soirée VIP |
| Corporate Soirée | sur devis | business | Lieu, traiteur, déco/AV, animation, coordination |

## Services à la carte / add-ons

| Service | Prix | Unité |
|---|---|---|
| Décoration romantique chambre | 149 $ | / installation |
| Photographe pro | 150 $ | / séance |
| Pique-nique chic installé | 99 $ | / événement |
| Chef privé à domicile | 299 $ | / soirée |
| Chauffeur privé soirée | 120 $ | / 4 h |
| Vidéaste / Reel Instagram | 200 $ | / séance |

## Parcours produit (extrait `page.tsx`)

« Comment ça marche » en 3 étapes : (1) Dis-nous ce que tu veux (budget/humeur/groupe/saison, 4 questions) → (2) On te propose un plan complet (horaires, adresses réelles, prix par étape, lieux vérifiés) → (3) Tu réserves en 1 clic (photographe, déco, transport gérés).

Niveaux de budget Weekend Match : Chill 60 $ · Classique 120 $ · Premium 250 $ · Luxe 400 $+. Ambiances : calme / dynamique / gourmand / découverte.

## Inventaire fonctionnel (routes `src/app`)

Découverte : `/` (home), `/decouvrir`, `/evenements`, `/carte` (MapView), `/recherche`, `/weekend-match`, `/night-out`, `/guides/[slug]`, `/activite/[slug]`.
Segments : `/couples`, `/famille`, `/amis`, `/business` (composant `SegmentPage`).
Offre/conversion : `/services`, `/packages`, `/buffets`, `/sur-mesure`, `/api/quote-request`. Composants clés : `AIConcierge`, `ExperienceBuilder`, `QuoteBuilder`/`QuoteForm`, `LoveRooms`, `WeatherWidget`, `Newsletter`, `Testimonials`.
Compte/légal : `/mes-favoris` (contexte favoris local), `/about`, `/contact`, `/conditions`, `/confidentialite`.

## Observations techniques (impact périmètre / dette)

- **« Réserver » = devis, pas paiement.** Les CTA des forfaits pointent vers `/services#devis` ; pas de checkout/paiement en ligne. La promesse « réserver en 1 clic » est donc aspirationnelle.
- **Love Rooms non câblé.** Dans `LoveRooms.tsx`, le CTA est `href="#"` — l'offre signature mise en avant n'a pas encore de page/parcours.
- **Données curées en JSON statiques** (`src/data/*.json`), pas de CMS/back-office → mise à jour = édition de code.
- **Événements** alimentés par les scripts `scripts/enrich-events*.py` (+ `add-coords.py`) depuis exploreedmonton.com → pipeline manuel à industrialiser.
- **Chiffres à valider** : « 2 300+ Edmontoniens » (newsletter), « nos premiers clients » (témoignages) — réels ou placeholders ?
- **Marque** : copie publique = « YEG Date » / yegdate.ca ; pied de page « YEG Date est un projet de [Private Haven ?] ». À clarifier.
