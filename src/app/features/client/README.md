# Waschly – Client Module: Backend API Specification

> Ce document sert de **contrat d'interface** entre le frontend Angular (module `features/client/`) et l'API backend NestJS. À implémenter lors du développement du backend.

## Base URL
```
/api/v1
```
Authentification : `Bearer <supabase_jwt>` dans le header `Authorization`.

---

## Endpoints Demandes (`/demands`)

### `POST /demands`
Crée une nouvelle demande de lavage.

**Request Body** (`CreateDemandDto`):
```json
{
  "vehicleType": "sedan | suv | van | compact",
  "washType": "exterior | interior | full",
  "dirtLevel": "light | medium | heavy",
  "location": {
    "lat": 52.5200,
    "lng": 13.4050,
    "address": "Alexanderplatz, Berlin"
  },
  "availability": "asap | scheduled",
  "scheduledTime": "2026-08-05T10:00:00Z",
  "notes": "Code parking: 1234",
  "photoUrls": ["https://storage.example.com/bucket/photo1.jpg"]
}
```

**Response** `201 Created` (`DemandResponseDto`):
```json
{
  "id": "uuid-v4",
  "clientId": "auth-user-id",
  "status": "open",
  "vehicleType": "sedan",
  "washType": "exterior",
  "dirtLevel": "medium",
  "location": { "lat": 52.52, "lng": 13.405, "address": "Alexanderplatz" },
  "availability": "asap",
  "notes": null,
  "photoUrls": [],
  "createdAt": "2026-08-02T12:00:00Z",
  "updatedAt": "2026-08-02T12:00:00Z",
  "washer": null
}
```

---

### `GET /demands`
Récupère toutes les demandes du client authentifié.

**Response** `200 OK` : `DemandResponseDto[]`

---

### `GET /demands/:id`
Récupère le détail d'une demande par son ID.

**Response** `200 OK` : `DemandResponseDto` (avec `washer` populé si assignée)

---

### `PATCH /demands/:id/status`
Mise à jour du statut d'une demande.

> ⚠️ Sur le **frontend client**, seule la transition `in_progress → completed` est initiée par le client (validation de prestation).  
> Les autres transitions (`open → assigned`, `assigned → in_progress`) sont déclenchées par le washer ou un processus backend.

**Request Body**:
```json
{ "status": "completed" }
```

**Response** `200 OK` : `DemandResponseDto` mis à jour.

---

## Endpoints Avis (`/demands/:id/review`)

### `POST /demands/:id/review`
Soumet un avis après la prestation. Accessible uniquement si `status === 'completed'`.

**Request Body** (`ReviewDto`):
```json
{
  "rating": 5,
  "comment": "Super propre, je recommande !"
}
```

**Response** `201 Created` : `void` (ou l'objet review créé)

**Règles de validation (backend)**:
- `rating` : entier entre 1 et 5
- `comment` : optionnel, max 500 caractères
- Un seul avis par demande et par client

---

## Types partagés (DTOs)

```typescript
type DemandStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
type WashType = 'exterior' | 'interior' | 'full';
type VehicleType = 'sedan' | 'suv' | 'van' | 'compact';
type DirtLevel = 'light' | 'medium' | 'heavy';

interface UserSnippet {
  id: string;
  name: string;
  avatarUrl?: string;
  rating?: number;
  isVerified?: boolean;
}
```

---

## Notes d'implémentation backend

1. **Supabase Auth** : Le JWT est émis par Supabase. Le backend NestJS doit vérifier le token avec la clé publique Supabase (ou via le SDK Supabase Admin).
2. **Photos** : Les fichiers sont uploadés directement sur **Supabase Storage** depuis le frontend. Le backend ne reçoit que les URLs publiques.
3. **Temps réel** : Le frontend poll `/demands/:id` toutes les 15s via TanStack Query `refetchInterval`. Une future itération pourrait utiliser les WebSockets Supabase Realtime pour pousser les changements de statut.
4. **Rôle client** : La claim `role` dans le JWT Supabase doit valoir `client` pour accéder à ces routes. Le guard Angular (`roleGuard`) vérifie cette claim.
