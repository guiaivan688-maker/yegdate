# YEGDate — PRD & Roadmap solo

_Rédigé le 2026-05-24 · à partir du spec produit d'Ivan + de l'état réel du code._

## 1. Vision

Marketplace **premium d'expériences locales à Edmonton** : découverte (activités, restos, événements, soirées, Love Rooms / Private Haven), **réservation** et **achat de tickets**, où les **partenaires publient** leurs offres et les **clients réservent/paient** directement. Benchmarks : Airbnb Experiences, Eventbrite, OpenTable, Private Haven.

## 2. Rôles

- **Super Admin** — contrôle total : utilisateurs, validation partenaires, événements, restos, paiements, commissions, analytics, sécurité, contenu accueil, notifications.
- **Partenaires** — restos, organisateurs d'événements, Love Rooms/Private Haven, activités locales, hôtels : créent des offres, gèrent horaires/photos/prix/capacité, voient réservations & revenus.
- **Clients** — explorent, réservent, achètent des tickets, favoris, paiements, avis, historique.

## 3. État actuel (déjà construit)

- **Client** : site **live** — Compositeur de soirée (`/compositeur`), découverte segmentée (couples/famille/amis/solo/business), carte, événements, accueil + section histoire. SEO programmatique (`/idees`).
- **Partenaire** : **prototype** `/prestataire` (« réclame ta fiche » + mini-dashboard) — **mock localStorage**, pas réel.
- **Backend** : ❌ **aucun** (pas d'auth, pas de base de données, pas de paiement). ✅ Schéma SQL multi-rôles prêt : `supabase/migrations/0001_init.sql`.
- **Stack** : Next.js 16, React 19, Tailwind 4, bilingue FR/EN, déployé sur Vercel (auto-deploy au push).

## 4. La contrainte n°1 (à regarder en face)

**~90 % de ce spec exige un backend** (auth + DB + paiements) : dashboards avec vraies données, validation partenaires, Stripe Connect, tickets QR, RBAC, 2FA, RGPD. → **La Phase 0 = le backend.** Tant qu'il n'est pas allumé, on ne peut produire que des maquettes. C'est le premier domino, non négociable.

## 5. Stack recommandée (allégée pour un builder solo)

Le spec liste de l'enterprise (Auth0, AWS, Datadog, SendGrid, Twilio). Pour un solo, on simplifie :

| Besoin | Outil reco | Pourquoi |
|---|---|---|
| Auth + Base + RLS + Storage | **Supabase** | un seul service ; le RLS applique directement la matrice de rôles |
| Paiements + versements | **Stripe Connect** | gère commissions, versements partenaires et une grande part de la conformité paiement |
| Emails transactionnels | **Resend** | déjà installé dans l'app |
| Hébergement | **Vercel** | déjà en place |
| Tickets QR | lib QR + Supabase | génération à la volée, vérification au scan |
| Plus tard | GA4/Mixpanel, Twilio (SMS), Sentry | analytics, notifications, monitoring — pas au MVP |

À **reporter** (overkill au MVP) : Auth0, AWS, Datadog, WAF dédié.

## 6. Roadmap priorisée

> Règle d'or solo : **ne pas construire les 14 écrans d'un coup.** On séquence, on livre, on encaisse, on itère.

- **Phase 0 — Fondations backend** _(le verrou)_
  Supabase : auth (lien magique) + base depuis le schéma SQL + RLS. Comptes & rôles (client / partenaire / admin). Connecter le proto `/prestataire` au réel (« réclame ta fiche » persistée en base).
- **Phase 1 — Partenaires réels**
  Onboarding partenaire, publication d'offres (CRUD), dispos & capacité, **modération admin** (validation des offres avant mise en ligne).
- **Phase 2 — Réservation & paiement** _(= MVP qui encaisse)_
  Réservation/achat, **Stripe Connect** (client paie → versement partenaire − commission), **tickets QR** générés, confirmations email (Resend).
- **Phase 3 — Dashboard Super Admin (MVP, pas 14 écrans)**
  Vue d'ensemble (revenus, résas, users, partenaires), gestion users/rôles (RBAC), validation partenaires, finances (commissions/versements), **Contenu Accueil éditable** (slideshow/vedettes sans toucher au code).
- **Phase 4 — Dashboard Client**
  Mes réservations, mes tickets (QR), favoris, avis, profil, paiements.
- **Phase 5 — Confiance & conformité**
  Avis + modération, 2FA, audit logs, RGPD + CGU/CGV, sauvegardes.
- **Phase 6 — Croissance**
  Analytics (GA4), notifications SMS (Twilio), coupons, mise en avant payante, finalisation multilingue.
- **Plus tard (nice-to-have)**
  Tarification dynamique, fidélité, affiliation, app mobile, API/Webhooks (connexion Private Haven).

## 7. Le vrai MVP « lançable »

**Phase 0 + 1 + 2.** À ce stade : un partenaire publie une offre → un client réserve et paie → un ticket QR est généré → l'admin valide. *C'est ça, le minimum pour qu'une marketplace existe et encaisse.* Tout le reste (admin riche, analytics, automatisation) vient après et n'empêche pas de lancer.

## 8. Risques & réalité

- En solo, c'est un chantier de **plusieurs mois** — le séquencement est une question de survie, pas de confort.
- Argent + données personnelles = sérieux : Stripe Connect absorbe une grande partie de la conformité paiement ; le RGPD/2FA arrivent en Phase 5 mais doivent être pensés tôt.
- Le client-facing (déjà live) **attire la demande** pendant qu'on bâtit l'offre — bon ordre (les partenaires viennent où sont les clients).

## 9. Prochaine action recommandée

**Allumer le backend (Supabase) — Phase 0.** 3 étapes côté Ivan :
1. Créer un projet sur supabase.com (gratuit).
2. SQL Editor → coller `supabase/migrations/0001_init.sql` → Run.
3. Settings → API → me donner le **Project URL** + la clé **anon public**.

→ Ensuite je câble l'auth + connecte le proto prestataire au réel, et la roadmap se déroule.
