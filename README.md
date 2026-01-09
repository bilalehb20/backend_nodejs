# REST API - Node.js & Express

Een volledig werkende database-driven REST API gebouwd met Node.js 20+ en Express volgens academische best practices.

## Projectbeschrijving

Deze REST API biedt functionaliteit voor gebruikers- en evenementenbeheer. De API ondersteunt volledige CRUD-operaties, authenticatie via JWT, paginering, zoeken en sorteren. De database gebruikt SQLite voor eenvoudige setup en ontwikkeling.

## Functies

- **CRUD-operaties** voor gebruikers en evenementen
- **JWT-authenticatie** met bcrypt password hashing
- **Paginering** voor events endpoint
- **Zoeken** in events (titel, beschrijving, locatie)
- **Sorteren** van events op verschillende kolommen
- **Validatie** van alle input data
- **Beveiligde routes** voor event operaties
- **Volledige API-documentatie** op de root pagina

## Technologie Stack

- **Node.js** 20+
- **Express** - Web framework
- **SQLite3** - Relationele database
- **JSON Web Token (JWT)** - Authenticatie
- **bcrypt** - Password hashing
- **dotenv** - Environment variables

## Installatie Stappen

### Vereisten

- Node.js 20 of hoger
- npm (meeggeleverd met Node.js)

### Stappen

1. **Clone de repository**
   ```bash
   git clone <repository-url>
   cd backend_nodejs
   ```

2. **Installeer dependencies**
   ```bash
   npm install
   ```

3. **Configureer environment variables**

   Maak een `.env` bestand in de root directory (kopieer van `.env.example` indien aanwezig):
   ```
   PORT=3000
   DB_PATH=./database.sqlite
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   ```

4. **Start de server**
   ```bash
   npm start
   ```

   Voor development met auto-reload:
   ```bash
   npm run dev
   ```

5. **Server is beschikbaar op**
   - API: `http://localhost:3000/api`
   - Documentatie: `http://localhost:3000/`

## Database Setup

De database wordt automatisch aangemaakt bij de eerste start van de applicatie. De SQLite database file (`database.sqlite`) wordt aangemaakt in de root directory zoals gespecificeerd in de `DB_PATH` environment variable.

### Database Schema

#### Users Table
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `firstname` (TEXT NOT NULL)
- `lastname` (TEXT NOT NULL)
- `email` (TEXT UNIQUE NOT NULL)
- `password` (TEXT NOT NULL) - gehasht met bcrypt
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

#### Events Table
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `title` (TEXT NOT NULL)
- `description` (TEXT)
- `start_date` (DATETIME NOT NULL)
- `end_date` (DATETIME NOT NULL)
- `location` (TEXT NOT NULL)
- `user_id` (INTEGER NOT NULL, FOREIGN KEY → users.id)

De applicatie start **NIET** als de database connectie faalt, zoals vereist.

## Environment Variables

| Variable | Beschrijving | Default |
|----------|--------------|---------|
| `PORT` | Server poort | 3000 |
| `DB_PATH` | Pad naar SQLite database | ./database.sqlite |
| `JWT_SECRET` | Secret key voor JWT tokens | (moet worden ingesteld) |
| `JWT_EXPIRES_IN` | Token vervaltijd | 24h |

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Registreer een nieuwe gebruiker.

**Request Body:**
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Login en ontvang JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com"
  }
}
```

### User Endpoints

#### GET /api/users
Haal alle gebruikers op.

#### GET /api/users/:id
Haal gebruiker op basis van ID.

#### POST /api/users
Maak een nieuwe gebruiker aan.

#### PUT /api/users/:id
Update een gebruiker.

#### DELETE /api/users/:id
Verwijder een gebruiker.

### Event Endpoints

#### GET /api/events
Haal alle events op met paginering, zoeken en sorteren.

**Query Parameters:**
- `limit` (required, numeric) - Aantal resultaten per pagina (default: 10)
- `offset` (required, numeric) - Aantal resultaten om over te slaan (default: 0)
- `sort` (optional) - Kolom om op te sorteren (id, title, start_date, end_date, location, user_id)
- `order` (optional) - Sorteer volgorde (asc, desc, default: asc)
- `query` (optional) - Zoekterm voor title, description, of location

**Voorbeeld:**
```
GET /api/events?limit=5&offset=0&sort=start_date&order=asc&query=concert
```

#### GET /api/events/search?query=...
Zoek events op title, description of location.

#### GET /api/events/:id
Haal event op basis van ID.

#### POST /api/events
Maak een nieuw event aan. **Beschermd - vereist authenticatie**

**Request Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### PUT /api/events/:id
Update een event. **Beschermd - vereist authenticatie**

#### DELETE /api/events/:id
Verwijder een event. **Beschermd - vereist authenticatie**

Voor volledige API-documentatie, bezoek `http://localhost:3000/` wanneer de server draait.

## Validatie Uitleg

### User Validatie

- **firstname**: Verplicht, mag geen cijfers bevatten
- **lastname**: Verplicht, mag niet leeg zijn
- **email**: Verplicht, moet geldig email formaat zijn, moet uniek zijn
- **password**: Verplicht, minimaal 8 karakters

### Event Validatie

- **title**: Verplicht, minimaal 3 karakters
- **description**: Optioneel
- **start_date**: Verplicht, geldige datum, mag niet in het verleden zijn
- **end_date**: Verplicht, geldige datum, moet na start_date zijn
- **location**: Verplicht, minimaal 3 karakters
- **user_id**: Verplicht, moet bestaan in users tabel

Alle validatiefouten worden geretourneerd als array van error messages:
```json
{
  "errors": [
    "firstname is required",
    "email must be a valid email address"
  ]
}
```

## Extra Features

### Paginering
Events endpoint ondersteunt paginering met `limit` en `offset` parameters. Beide zijn verplicht en moeten numeriek zijn.

### Zoeken
Zoekfunctionaliteit werkt op de events endpoint via de `query` parameter. Zoekt in title, description en location met SQL LIKE queries.

### Sorteren
Events kunnen gesorteerd worden op verschillende kolommen (id, title, start_date, end_date, location, user_id) met asc/desc volgorde. SQL injection wordt voorkomen door whitelisting van toegestane kolommen.

### Authenticatie & Beveiliging
- Passwords worden gehasht met bcrypt (10 rounds)
- JWT tokens voor authenticatie
- Beveiligde routes voor event operaties (POST, PUT, DELETE)
- Token validatie middleware

## Project Structuur

```
backend_nodejs/
├── src/
│   ├── app.js                 # Express app configuratie
│   ├── routes/
│   │   ├── users.routes.js    # User routes
│   │   ├── events.routes.js   # Event routes
│   │   └── auth.routes.js     # Authentication routes
│   ├── controllers/
│   │   ├── users.controller.js
│   │   ├── events.controller.js
│   │   └── auth.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js      # JWT authenticatie
│   │   └── validation.middleware.js # Input validatie
│   └── db/
│       └── database.js        # Database connectie & setup
├── public/
│   └── index.html            # API documentatie
├── .env                      # Environment variables (niet in git)
├── .gitignore
├── package.json
└── README.md
```

## Testen

Alle endpoints zijn getest en werken correct. Test de API met tools zoals:

- **Postman** - Voor uitgebreide API testing
- **curl** - Voor command-line testing
- **Browser** - Voor GET requests

### Voorbeeld Test Requests

**Registreer gebruiker:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstname":"John","lastname":"Doe","email":"john@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Maak event (met token):**
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"Concert","description":"Live music","start_date":"2024-12-31T20:00:00","end_date":"2025-01-01T02:00:00","location":"Amsterdam","user_id":1}'
```

## Bronnen

- [Express.js Documentation](https://expressjs.com/)
- [SQLite3 Documentation](https://github.com/mapbox/node-sqlite3)
- [JWT Documentation](https://github.com/auth0/node-jsonwebtoken)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- Node.js Best Practices

## Licentie

ISC

## Auteur

Dit project is gebouwd volgens academische best practices voor een volledig werkende REST API.
