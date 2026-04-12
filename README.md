# New Horizon — Plateforme de résidences meublées 🇨🇮

> Location de résidences meublées à Abidjan, Côte d'Ivoire.  
> Réservation directe par WhatsApp · Admin Flask · PWA · Dark mode · Mobile-first

---

## Stack

| Couche | Technologie |
|---|---|
| Frontend | Next.js 14 (App Router) + React 18 |
| Style | CSS variables custom (design system complet) |
| Icônes | SVG stroke inline (objet `IC`, sans dépendance externe) |
| Backend | Flask 3 + Flask-SQLAlchemy |
| Base de données | MySQL |
| Déploiement | Vercel (frontend) · PythonAnywhere (backend) |
| PWA | Service Worker + Web Manifest |

---

## Structure du projet

```
mon-amon-residence/
├── backend/
│   ├── app.py                  # Routes Flask — auth, CRUD résidences, API JSON
│   ├── database.py             # Modèle SQLAlchemy (Residence, équipements)
│   ├── requirements.txt
│   ├── templates/              # Interface admin Jinja2
│   │   ├── base.html
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── add_residence.html
│   │   └── edit_residence.html
│   └── static/
│       └── uploads/            # Photos uploadées (gitignorées)
│
└── frontend/
    ├── app/
    │   ├── layout.js           # Root layout (fonts, meta, ClientShell)
    │   ├── globals.css         # Design system — variables, composants
    │   ├── ClientShell.js      # Navbar · Footer · Cookie banner · Loader
    │   ├── PageClient.js       # Page d'accueil (hero, stats, cartes)
    │   ├── residences/
    │   │   ├── PageClient.js   # Catalogue + filtres
    │   │   └── [id]/
    │   │       └── PageClient.js  # Détail · galerie · booking · partage
    │   ├── a-propos/
    │   ├── contact/
    │   ├── aide/
    │   ├── cookies/
    │   ├── admin/              # Dashboard admin Next.js
    │   └── api/map-settings/   # Route API interne
    ├── components/ui/
    │   ├── ResidenceCard.js    # Carte résidence (tilt 3D, slideshow, reveal)
    │   ├── MapView.js          # Carte Leaflet interactive
    │   └── PWAInstallButton.js
    ├── lib/
    │   ├── config.js           # SITE, API_URL, helpers prix, équipements
    │   └── usePWAInstall.js
    ├── public/
    │   ├── hero/               # hero-1.jpg · hero-2.jpg · hero-3.jpg
    │   ├── manifest.json
    │   └── sw.js               # Service Worker PWA
    ├── .env.local              # ⚠️ Ne pas committer — voir .env.example ci-dessous
    └── .env.example
```

---

## Installation locale

### Prérequis

- Node.js ≥ 18
- Python ≥ 3.10
- MySQL en local

### 1. Base de données MySQL

```sql
CREATE DATABASE mon_amon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend Flask

```bash
cd backend
pip install -r requirements.txt
python app.py
# API + Admin → http://localhost:5050
# Connexion admin → http://localhost:5050/login
```

### 3. Frontend Next.js

```bash
cd frontend
cp .env.example .env.local   # puis remplir les valeurs
npm install
npm run dev
# → http://localhost:3000
```

---

## Variables d'environnement

### Frontend — `frontend/.env.local`

```env
# URL de l'API Flask (local ou production)
NEXT_PUBLIC_API_URL=http://localhost:5050

# Numéro WhatsApp avec indicatif pays, sans le +
NEXT_PUBLIC_WHATSAPP=225XXXXXXXXXX

# Nom du site
NEXT_PUBLIC_SITE_NAME=New Horizon
```

### Backend — variables d'environnement

```env
# Clé secrète Flask — générer une valeur aléatoire forte en production
SECRET_KEY=changez-cette-valeur

# Connexion MySQL
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_HOST=localhost
MYSQL_DB=mon_amon

# Mot de passe de l'interface admin
ADMIN_PASSWORD=changez-ce-mot-de-passe
```

> **⚠️ Important** : ne jamais committer `.env.local` ni les fichiers contenant des secrets.  
> Vérifier que `.gitignore` est en place avant le premier `git push`.

---

## .gitignore recommandé

```gitignore
# Environnement
.env
.env.local
.env*.local

# Next.js
frontend/.next/
frontend/node_modules/
frontend/out/

# Python
__pycache__/
*.pyc
.venv/
venv/

# Uploads utilisateurs
backend/static/uploads/*
!backend/static/uploads/.gitkeep

# OS
.DS_Store
Thumbs.db
```

---

## Fonctionnalités

### Admin Flask (`/login`)

- Authentification par mot de passe (hashé avec Werkzeug)
- Dashboard — stats (total, vedettes, disponibles, villes)
- Publier · modifier · supprimer une résidence
- Upload jusqu'à 10 photos (PNG, JPG, WebP, max 10 MB)
- Tarifs multi-durée : nuit · journée · semaine · mois
- Caution calculée automatiquement
- Équipements : wifi, climatisation, parking, piscine, TV, lave-linge…
- Localisation GPS avec carte Leaflet intégrée
- Statuts : disponible / indisponible · mise en avant (featured)

### Frontend Next.js

- Hero animé 3 slides + barre de recherche rapide
- Catalogue avec filtres (commune, type de bien, tri par prix)
- Cartes résidences : slideshow crossfade, tilt 3D desktop, scroll reveal
- Hauteur de cartes uniforme sur toutes les pages
- Page détail : galerie grid, liste équipements, carte Leaflet
- Booking intégré : date + durée + type de tarif → total estimé → WhatsApp pré-rempli
- Share panel : WhatsApp · Facebook · copier le lien · partage natif mobile
- Dark mode persistant (localStorage + détection système)
- Cookie banner responsive (RGPD)
- Page loader animé (logo + barre de progression)
- PWA installable sur Android et iOS
- Navbar avec icônes SVG + menu hamburger mobile animé

---

## API — Endpoints publics

```
GET  /api/residences           → liste des résidences publiées
GET  /api/residences/<id>      → détail d'une résidence
GET  /api/map-settings         → configuration (WhatsApp, carte)
```

### Structure JSON d'une résidence

```json
{
  "id": 1,
  "titre": "Studio meublé Cocody",
  "type_bien": "studio",
  "quartier": "Rivera Ephrata",
  "commune": "Cocody",
  "ville": "Abidjan",
  "prix_nuit": 25000,
  "prix_mensuel": 350000,
  "montant_caution": 50000,
  "equipements": ["wifi", "climatisation", "parking"],
  "photos": ["https://..."],
  "featured": true,
  "disponible": true
}
```

---

## Déploiement production

### Backend → PythonAnywhere

1. Uploader le dossier `backend/`
2. Créer la base MySQL depuis le dashboard PythonAnywhere
3. Configurer le fichier WSGI pour pointer vers `app.py`
4. Définir les variables d'environnement dans **Web > Environment variables**

### Frontend → Vercel

```bash
cd frontend
vercel --prod
```

Variables à définir dans le dashboard Vercel :

| Clé | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL complète du backend PythonAnywhere |
| `NEXT_PUBLIC_WHATSAPP` | Numéro WhatsApp sans `+` |
| `NEXT_PUBLIC_SITE_NAME` | Nom affiché sur le site |

---

## Design system

Variables CSS globales disponibles dans toute l'application :

```css
--gold            /* accent principal */
--ink             /* texte principal */
--ink-2           /* texte secondaire */
--bg              /* fond de page */
--surface         /* fond élevé (cartes, inputs) */
--border          /* bordures */
--muted           /* texte atténué */

--font-display    /* Playfair Display — titres */
--font-ui         /* DM Sans — interface */

--r-sm / --r-md / --r-lg / --r-xl
--sh-sm / --sh-md / --sh-xl
--pad             /* padding horizontal responsive (clamp) */
--ease            /* cubic-bezier standard */
```

---

## Historique des versions

| Version | Changements |
|---|---|
| **v17b** | Cartes hauteur uniforme · fix overflow SharePanel mobile · containment CSS strict |
| **v17** | z-index navbar · isolation `<main>` · cookie banner centré · share panel compact |
| **v16** | PWA · Service Worker · icônes maskable · bouton install |
| **v15** | Dark mode persistant · SVG icons nav/footer · theme toggle |
| **v14** | Page détail · galerie grid · BookingCard sticky · MapView Leaflet |
| **v10** | Base — App Router · ClientShell · ResidenceCard · filtres |

---

## Licence

Projet privé — tous droits réservés.
