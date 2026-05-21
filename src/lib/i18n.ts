export type Locale = "fr" | "en";

const translations = {
  nav: {
    home: { fr: "Accueil", en: "Home" },
    discover: { fr: "Découvrir", en: "Discover" },
    weekendMatch: { fr: "Weekend Match", en: "Weekend Match" },
    services: { fr: "Services", en: "Services" },
    packages: { fr: "Forfaits", en: "Packages" },
    couples: { fr: "Couples", en: "Couples" },
    famille: { fr: "Famille", en: "Family" },
    amis: { fr: "Amis", en: "Friends" },
    business: { fr: "Affaires", en: "Business" },
  },
  hero: {
    title: { fr: "Edmonton, sublimé par vous.", en: "Edmonton, elevated by you." },
    subtitle: {
      fr: "Découvrez les plus beaux endroits, planifiez des expériences inoubliables et transformez chaque sortie en souvenir.",
      en: "Discover the most beautiful places, plan unforgettable experiences and turn every outing into a memory.",
    },
    cta: { fr: "Commencer l'aventure", en: "Start the adventure" },
    ctaServices: { fr: "Nos services", en: "Our services" },
  },
  weather: {
    ideal_indoor: { fr: "Idéal pour une sortie en intérieur", en: "Perfect for an indoor outing" },
    ideal_outdoor: { fr: "Parfait pour profiter de l'extérieur", en: "Perfect to enjoy the outdoors" },
    mild: { fr: "Temps doux, profitez-en !", en: "Mild weather, enjoy it!" },
    cold: { fr: "Habillez-vous chaudement !", en: "Bundle up warm!" },
    edmonton: { fr: "Edmonton", en: "Edmonton" },
  },
  categories: {
    title: { fr: "Explorez par catégorie", en: "Explore by category" },
    couples: {
      title: { fr: "Couples", en: "Couples" },
      desc: { fr: "Dates romantiques et expériences à deux", en: "Romantic dates and experiences for two" },
    },
    famille: {
      title: { fr: "Famille", en: "Family" },
      desc: { fr: "Activités pour toute la famille", en: "Activities for the whole family" },
    },
    amis: {
      title: { fr: "Amis", en: "Friends" },
      desc: { fr: "Sorties entre amis inoubliables", en: "Unforgettable outings with friends" },
    },
    business: {
      title: { fr: "Affaires", en: "Business" },
      desc: { fr: "Networking et événements professionnels", en: "Networking and professional events" },
    },
  },
  services: {
    title: { fr: "Services Premium", en: "Premium Services" },
    subtitle: { fr: "Transformez vos sorties en expériences extraordinaires", en: "Transform your outings into extraordinary experiences" },
    photographer: { fr: "Photographe", en: "Photographer" },
    photographerDesc: {
      fr: "Capturez vos plus beaux moments avec un photographe professionnel",
      en: "Capture your most beautiful moments with a professional photographer",
    },
    picnic: { fr: "Pique-nique Chic", en: "Luxury Picnic" },
    picnicDesc: {
      fr: "Décoration de pique-nique élégante et raffinée dans les parcs d'Edmonton",
      en: "Elegant and refined picnic decoration in Edmonton's parks",
    },
    roomDecor: { fr: "Décoration de Chambre", en: "Room Decoration" },
    roomDecorDesc: {
      fr: "Aménagement romantique de chambres d'hôtel, maisons et Airbnb",
      en: "Romantic setup for hotel rooms, homes and Airbnbs",
    },
    eventPlanner: { fr: "Planification d'Événement", en: "Event Planning" },
    eventPlannerDesc: {
      fr: "Organisation complète de votre événement de A à Z",
      en: "Complete event organization from A to Z",
    },
    bookNow: { fr: "Réserver", en: "Book Now" },
    getQuote: { fr: "Demander un devis", en: "Get a Quote" },
    from: { fr: "À partir de", en: "From" },
  },
  weekendMatch: {
    title: { fr: "Weekend Match", en: "Weekend Match" },
    subtitle: { fr: "Trouvez votre plan parfait en 4 questions", en: "Find your perfect plan in 4 questions" },
    segment: { fr: "Avec qui sortez-vous ?", en: "Who are you going out with?" },
    budget: { fr: "Quel est votre budget ?", en: "What is your budget?" },
    mood: { fr: "Quelle est votre humeur ?", en: "What's your mood?" },
    season: { fr: "Quelle saison ?", en: "What season?" },
    find: { fr: "Trouver mon plan", en: "Find my plan" },
    results: { fr: "Vos recommandations", en: "Your recommendations" },
    noResults: { fr: "Aucun résultat trouvé. Essayez d'autres critères.", en: "No results found. Try different criteria." },
    customize: { fr: "Customiser mon expérience", en: "Customize my experience" },
  },
  segments: {
    couple: { fr: "Couple", en: "Couple" },
    famille: { fr: "Famille", en: "Family" },
    amis: { fr: "Amis", en: "Friends" },
    business: { fr: "Affaires", en: "Business" },
  },
  budgets: {
    low: { fr: "Économique (< 50$)", en: "Budget (< $50)" },
    medium: { fr: "Moyen (50-150$)", en: "Medium ($50-$150)" },
    high: { fr: "Premium (150$+)", en: "Premium ($150+)" },
  },
  moods: {
    romantic: { fr: "Romantique", en: "Romantic" },
    adventure: { fr: "Aventure", en: "Adventure" },
    relaxation: { fr: "Relaxation", en: "Relaxation" },
    culture: { fr: "Culture", en: "Culture" },
    festive: { fr: "Festif", en: "Festive" },
  },
  seasons: {
    spring: { fr: "Printemps", en: "Spring" },
    summer: { fr: "Été", en: "Summer" },
    fall: { fr: "Automne", en: "Fall" },
    winter: { fr: "Hiver", en: "Winter" },
  },
  gallery: {
    title: { fr: "Lieux Instagrammables", en: "Instagrammable Spots" },
    subtitle: { fr: "Les plus beaux endroits d'Edmonton à photographier", en: "Edmonton's most beautiful places to photograph" },
  },
  quote: {
    title: { fr: "Créez votre expérience sur-mesure", en: "Create your custom experience" },
    activity: { fr: "Choisissez une activité", en: "Choose an activity" },
    addons: { fr: "Options supplémentaires", en: "Add-ons" },
    summary: { fr: "Récapitulatif", en: "Summary" },
    total: { fr: "Total estimé", en: "Estimated total" },
    submit: { fr: "Demander un devis", en: "Request a quote" },
    guests: { fr: "Nombre de personnes", en: "Number of guests" },
  },
  ai: {
    title: { fr: "Concierge YEG", en: "YEG Concierge" },
    placeholder: { fr: "Décrivez ce que vous cherchez...", en: "Describe what you're looking for..." },
    greeting: {
      fr: "Bonjour ! Je suis votre concierge YEG. Dites-moi votre budget, le nombre de personnes et ce que vous aimez, et je vous proposerai des activités parfaites à Edmonton !",
      en: "Hello! I'm your YEG concierge. Tell me your budget, group size and what you enjoy, and I'll suggest perfect activities in Edmonton!",
    },
    send: { fr: "Envoyer", en: "Send" },
  },
  footer: {
    tagline: { fr: "Edmonton, sublimé par vous.", en: "Edmonton, elevated by you." },
    rights: { fr: "Tous droits réservés.", en: "All rights reserved." },
    explore: { fr: "Explorer", en: "Explore" },
    contact: { fr: "Contact", en: "Contact" },
    follow: { fr: "Suivez-nous", en: "Follow us" },
  },
  packages: {
    title: { fr: "Nos Forfaits", en: "Our Packages" },
    subtitle: { fr: "Des expériences clé en main pour chaque occasion", en: "Turnkey experiences for every occasion" },
    includes: { fr: "Inclus", en: "Includes" },
    bookThis: { fr: "Réserver ce forfait", en: "Book this package" },
  },
  discover: {
    title: { fr: "Découvrir Edmonton", en: "Discover Edmonton" },
    subtitle: { fr: "Les meilleurs endroits, événements et activités de la ville", en: "The best places, events and activities in the city" },
    restaurants: { fr: "Restaurants & Cafés", en: "Restaurants & Cafés" },
    parks: { fr: "Parcs & Nature", en: "Parks & Nature" },
    events: { fr: "Événements & Festivals", en: "Events & Festivals" },
    culture: { fr: "Art & Culture", en: "Art & Culture" },
    nightlife: { fr: "Vie Nocturne", en: "Nightlife" },
    seasonal: { fr: "Activités Saisonnières", en: "Seasonal Activities" },
  },
} as const;

type TranslationKey = keyof typeof translations;

export function t(
  section: TranslationKey,
  key: string,
  locale: Locale
): string {
  const sectionData = translations[section] as Record<
    string,
    Record<Locale, string>
  >;
  return sectionData?.[key]?.[locale] ?? key;
}

export { translations };
