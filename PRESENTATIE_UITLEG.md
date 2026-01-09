# REST API Project - Presentatie Uitleg

## 📋 Wat is dit project?

Dit is een **volledig werkende database-driven REST API** gebouwd met Node.js en Express. Het is een backend systeem voor het beheren van gebruikers en evenementen, met authenticatie, validatie, en geavanceerde zoekfuncties.

---

## 🎯 Wat kun je ermee doen?

### 1. Gebruikersbeheer (User Management)
- **Nieuwe gebruikers registreren** via `/api/auth/register`
- **Inloggen** en een JWT token ontvangen via `/api/auth/login`
- **Gebruikers opvragen** (alleen of specifiek)
- **Gebruikersgegevens aanpassen** (naam, email, wachtwoord)
- **Gebruikers verwijderen**

**Praktisch voorbeeld:**
```
1. Registreer een nieuwe gebruiker: John Doe (john@example.com)
2. Login en krijg een JWT token
3. Gebruik dit token voor beveiligde operaties
```

### 2. Evenementenbeheer (Event Management)
- **Evenementen aanmaken** (concerten, workshops, meetings, etc.)
- **Evenementen opvragen** met geavanceerde filtering:
  - Paginering (bijv. 10 per pagina)
  - Zoeken (bijv. alle "concert" evenementen)
  - Sorteren (bijv. op datum, titel, locatie)
- **Evenementen aanpassen** (titel, beschrijving, datum, locatie)
- **Evenementen verwijderen**

**Praktisch voorbeeld:**
```
1. Maak een concert evenement aan (datum: 31 december 2024, locatie: Amsterdam)
2. Zoek alle evenementen met "concert" in de titel/beschrijving
3. Sorteer evenementen op startdatum (oudste eerst)
4. Bekijk pagina 2 van resultaten (10 evenementen per pagina)
```

### 3. Beveiliging & Authenticatie
- **Wachtwoorden worden veilig opgeslagen** (gehasht met bcrypt)
- **JWT tokens** voor beveiligde API calls
- **Protected routes** - alleen ingelogde gebruikers kunnen evenementen aanmaken/aanpassen/verwijderen

---

## 🏗️ Technische Architectuur (Hoe het werkt)

### Database Laag
**SQLite Database** met 2 tabellen:
- **Users tabel**: Slaat gebruikersgegevens op (id, naam, email, gehasht wachtwoord)
- **Events tabel**: Slaat evenementen op (id, titel, beschrijving, datums, locatie, gebruiker)

**Hoe het werkt:**
```
App start → Database verbinding → Tabellen worden automatisch aangemaakt
→ Klaar voor gebruik!
```

### API Laag
**Express.js** server die HTTP requests verwerkt:

```
HTTP Request → Express Server → Route → Middleware → Controller → Database → Response
```

**Voorbeeld flow:**
```
1. Gebruiker stuurt: POST /api/events (met JWT token)
2. Express ontvangt request
3. Auth middleware: Verifieert JWT token
4. Validation middleware: Controleert of data geldig is
5. Controller: Voegt event toe aan database
6. Response: Stuurt nieuw event terug naar gebruiker
```

### Beveiligingslagen

**1. Input Validatie:**
- Controleert of verplichte velden aanwezig zijn
- Valideert email formaten
- Controleert datums (start_date niet in verleden, end_date > start_date)
- Minimaal aantal karakters voor titels/locaties

**2. Authenticatie:**
- Wachtwoorden worden gehasht met bcrypt (10 rounds)
- JWT tokens voor session management
- Tokens vervallen na 24 uur (configureerbaar)

**3. SQL Injection Preventie:**
- Parameterized queries (veilige database queries)
- Whitelisting voor sort kolommen

---

## 📊 API Endpoints Overzicht

### Authentication
| Methode | Endpoint | Beschrijving | Beveiligd? |
|---------|----------|--------------|------------|
| POST | `/api/auth/register` | Nieuwe gebruiker registreren | ❌ |
| POST | `/api/auth/login` | Inloggen en token ontvangen | ❌ |

### Users
| Methode | Endpoint | Beschrijving | Beveiligd? |
|---------|----------|--------------|------------|
| GET | `/api/users` | Alle gebruikers opvragen | ❌ |
| GET | `/api/users/:id` | Specifieke gebruiker opvragen | ❌ |
| POST | `/api/users` | Nieuwe gebruiker aanmaken | ❌ |
| PUT | `/api/users/:id` | Gebruiker aanpassen | ❌ |
| DELETE | `/api/users/:id` | Gebruiker verwijderen | ❌ |

### Events
| Methode | Endpoint | Beschrijving | Beveiligd? |
|---------|----------|--------------|------------|
| GET | `/api/events` | Alle events (met pagination/search/sorting) | ❌ |
| GET | `/api/events/search?query=...` | Events zoeken | ❌ |
| GET | `/api/events/:id` | Specifiek event opvragen | ❌ |
| POST | `/api/events` | Nieuw event aanmaken | ✅ |
| PUT | `/api/events/:id` | Event aanpassen | ✅ |
| DELETE | `/api/events/:id` | Event verwijderen | ✅ |

---

## 🔍 Praktische Use Cases

### Use Case 1: Evenementen Website
**Scenario:** Een website waar gebruikers evenementen kunnen bekijken en aanmaken.

**Hoe het werkt:**
1. Gebruiker bezoekt website → Frontend vraagt events op via `GET /api/events`
2. Gebruiker kan zoeken: `GET /api/events/search?query=concert`
3. Gebruiker kan sorteren: `GET /api/events?sort=start_date&order=asc`
4. Gebruiker registreert account: `POST /api/auth/register`
5. Gebruiker logt in: `POST /api/auth/login` → krijgt token
6. Gebruiker maakt event aan: `POST /api/events` (met token in header)

### Use Case 2: Mobile App Backend
**Scenario:** Een mobile app voor evenementenbeheer.

**Hoe het werkt:**
1. App start → Haalt alle events op: `GET /api/events?limit=20&offset=0`
2. Gebruiker scrollt naar beneden → Volgende pagina: `GET /api/events?limit=20&offset=20`
3. Gebruiker zoekt → `GET /api/events/search?query=workshop`
4. Gebruiker maakt event aan → `POST /api/events` met JWT token

### Use Case 3: Admin Dashboard
**Scenario:** Beheerder wil gebruikers en events beheren.

**Hoe het werkt:**
1. Beheerder bekijkt alle gebruikers: `GET /api/users`
2. Beheerder bekijkt alle events: `GET /api/events`
3. Beheerder past event aan: `PUT /api/events/1` (met token)
4. Beheerder verwijdert event: `DELETE /api/events/1` (met token)

---

## 💡 Belangrijke Features Uitleg

### 1. Pagination (Paginering)
**Waarom:** Als je duizenden events hebt, wil je niet alles in één keer laden.

**Hoe het werkt:**
```
GET /api/events?limit=10&offset=0  → Eerste 10 events
GET /api/events?limit=10&offset=10 → Volgende 10 events
GET /api/events?limit=10&offset=20 → Daaropvolgende 10 events
```

**Response bevat:**
- De events zelf
- Pagination info (limit, offset, total aantal events)

### 2. Search (Zoeken)
**Waarom:** Gebruikers willen snel events vinden op trefwoord.

**Hoe het werkt:**
```
GET /api/events/search?query=concert
```
Zoekt in:
- Event titel
- Event beschrijving
- Event locatie

**Voorbeeld:** Zoekterm "amsterdam" vindt alle events in Amsterdam.

### 3. Sorting (Sorteren)
**Waarom:** Gebruikers willen events sorteren (bijv. op datum, alfabetisch).

**Hoe het werkt:**
```
GET /api/events?sort=start_date&order=asc  → Oudste eerst
GET /api/events?sort=title&order=desc      → Titel Z-A
GET /api/events?sort=location&order=asc    → Locatie A-Z
```

### 4. Authentication (JWT Tokens)
**Waarom:** Alleen ingelogde gebruikers mogen events aanmaken/aanpassen.

**Hoe het werkt:**
```
1. Gebruiker logt in → POST /api/auth/login
2. Server geeft JWT token terug
3. Bij volgende requests: Authorization: Bearer <token>
4. Server verifieert token → Als geldig: request toegestaan
5. Token vervalt na 24 uur → Gebruiker moet opnieuw inloggen
```

---

## 🎤 Presentatie Tips

### 1. Demo Flow (5-7 minuten)

**Stap 1: Laat de API documentatie zien (30 sec)**
- Open `http://localhost:3000/` in browser
- Toon: "Hier is de volledige API documentatie"

**Stap 2: Demo - Gebruiker registreren (1 min)**
- Gebruik Postman/browser/curl
- POST `/api/auth/register` met user data
- Laat response zien (nieuwe user met id)

**Stap 3: Demo - Inloggen (1 min)**
- POST `/api/auth/login`
- Laat JWT token zien
- Leg uit: "Dit token gebruik je voor beveiligde requests"

**Stap 4: Demo - Events ophalen (1 min)**
- GET `/api/events`
- Laat response zien (lege array als er geen events zijn)
- Leg pagination uit

**Stap 5: Demo - Event aanmaken (1 min)**
- POST `/api/events` met JWT token in header
- Laat response zien
- Leg uit: "Zonder token krijg je 401 Unauthorized"

**Stap 6: Demo - Search & Sorting (1 min)**
- GET `/api/events/search?query=concert`
- GET `/api/events?sort=start_date&order=asc`
- Laat verschillende responses zien

**Stap 7: Code Structuur tonen (1 min)**
- Laat folder structuur zien
- Leg uit: Routes → Controllers → Database
- Toon een voorbeeld controller

### 2. Technische Uitleg (3-5 minuten)

**Wat te vertellen:**
1. **Database:** SQLite met automatische setup
2. **Architectuur:** MVC pattern (Routes, Controllers, Middleware)
3. **Beveiliging:** 
   - Password hashing (bcrypt)
   - JWT tokens
   - Input validatie
   - SQL injection preventie
4. **Features:**
   - Pagination, Search, Sorting
   - Error handling
   - Volledige CRUD operaties

### 3. Voordelen benadrukken

**Wat maakt dit project goed:**
- ✅ Volledig werkend (geen TODO's)
- ✅ Beveiligd (authentication, validation, password hashing)
- ✅ Schaalbaar (pagination voor grote datasets)
- ✅ Gebruiksvriendelijk (search, sorting)
- ✅ Goed gedocumenteerd (API docs + README)
- ✅ Production-ready (error handling, best practices)

### 4. Mogelijke Vragen & Antwoorden

**Q: Waarom SQLite en niet MySQL?**
A: SQLite is perfect voor development en kleine projecten. Geen extra server nodig. Eenvoudig te gebruiken. Voor productie kan je makkelijk overschakelen naar MySQL/PostgreSQL.

**Q: Waarom JWT en niet sessions?**
A: JWT is stateless - perfect voor REST API's. Tokens kunnen gedeeld worden tussen verschillende services (microservices). Geen server-side session storage nodig.

**Q: Hoe schaal je dit op?**
A: 
- Database: Overschakelen naar PostgreSQL/MySQL
- Caching: Redis voor veel gebruikte data
- Load balancing: Meerdere server instanties
- Database indexes voor snellere queries

**Q: Wat als je meer features wilt?**
A: De architectuur is modulair. Je kunt makkelijk toevoegen:
- File uploads (events met afbeeldingen)
- Email notificaties
- Real-time updates (WebSockets)
- Geografische search (events in de buurt)

---

## 📝 Quick Start Guide voor Presentatie

### Voorbereiding:
1. ✅ Server draait: `npm start`
2. ✅ Database bestaat (wordt automatisch aangemaakt)
3. ✅ Postman/browser klaar voor testing
4. ✅ API documentatie pagina open: `http://localhost:3000/`

### Test Data voorbereiden:
```bash
# 1. Registreer gebruiker
POST http://localhost:3000/api/auth/register
{
  "firstname": "Demo",
  "lastname": "User",
  "email": "demo@example.com",
  "password": "password123"
}

# 2. Login (bewaar token!)
POST http://localhost:3000/api/auth/login
{
  "email": "demo@example.com",
  "password": "password123"
}

# 3. Maak event aan (gebruik token)
POST http://localhost:3000/api/events
Authorization: Bearer <jouw_token>
{
  "title": "Demo Concert",
  "description": "Een demo evenement",
  "start_date": "2024-12-31T20:00:00",
  "end_date": "2025-01-01T02:00:00",
  "location": "Amsterdam Arena",
  "user_id": 1
}
```

---

## 🎯 Kernpunten voor Presentatie

### 1. Probleem & Oplossing
**Probleem:** Je hebt een backend nodig voor gebruikers- en evenementenbeheer.
**Oplossing:** Deze REST API biedt alle benodigde functionaliteit.

### 2. Belangrijkste Features
- ✅ Volledige CRUD operaties
- ✅ Beveiliging (JWT, password hashing)
- ✅ Geavanceerde features (pagination, search, sorting)
- ✅ Professionele code structuur
- ✅ Volledige documentatie

### 3. Technische Kwaliteit
- ✅ Best practices (MVC, async/await, error handling)
- ✅ Beveiligd (SQL injection preventie, input validatie)
- ✅ Schaalbaar (pagination, modulaire architectuur)
- ✅ Production-ready

### 4. Demonstratie
- ✅ Laat zien dat het werkt
- ✅ Toon verschillende endpoints
- ✅ Demonstreer beveiliging (met/zonder token)
- ✅ Laat code structuur zien

---

## 📚 Samenvatting voor ChatGPT/Documentatie

**Dit project is:**
Een volledig werkende REST API voor gebruikers- en evenementenbeheer, gebouwd met Node.js 20+, Express, en SQLite. Het bevat authenticatie met JWT tokens, volledige CRUD operaties, pagination, search, sorting, input validatie, en volledige API documentatie. De code volgt best practices met een duidelijke MVC structuur, error handling, en beveiligingsmaatregelen.

**Belangrijkste technische aspecten:**
- Database: SQLite met automatische tabel creatie
- Authentication: JWT tokens met bcrypt password hashing
- Security: Input validatie, SQL injection preventie, protected routes
- Features: Pagination, search (SQL LIKE), sorting met whitelisting
- Architecture: Separation of concerns (routes, controllers, middleware)
- Documentation: Volledige API docs + README met installatie instructies

**Wat je ermee kunt doen:**
- Gebruikers registreren en beheren
- Evenementen aanmaken, bekijken, zoeken, sorteren, aanpassen
- Beveiligde API calls met JWT authentication
- Schaalbare data ophaling met pagination
- Gebruik als backend voor websites, mobile apps, of admin dashboards
