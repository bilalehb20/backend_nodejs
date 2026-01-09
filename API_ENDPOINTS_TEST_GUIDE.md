# API Endpoints Test Guide

## ✅ Route Configuratie (Bevestigd)

In `src/app.js` zijn de routes als volgt gekoppeld:

```javascript
app.use('/api/users', usersRoutes);   // Regel 35
app.use('/api/events', eventsRoutes); // Regel 36
app.use('/api/auth', authRoutes);     // Regel 37
```

**Alle endpoints hebben de `/api` prefix!**

---

## 📋 Complete URL Lijst (Voor Postman/Testing)

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints
| Methode | Complete URL | Body | Headers |
|---------|--------------|------|---------|
| POST | `http://localhost:3000/api/auth/register` | User data | - |
| POST | `http://localhost:3000/api/auth/login` | Email + password | - |

### User Endpoints
| Methode | Complete URL | Body | Headers |
|---------|--------------|------|---------|
| GET | `http://localhost:3000/api/users` | - | - |
| GET | `http://localhost:3000/api/users/:id` | - | - |
| POST | `http://localhost:3000/api/users` | User data | - |
| PUT | `http://localhost:3000/api/users/:id` | User data | - |
| DELETE | `http://localhost:3000/api/users/:id` | - | - |

### Event Endpoints
| Methode | Complete URL | Body | Headers |
|---------|--------------|------|---------|
| GET | `http://localhost:3000/api/events` | - | - |
| GET | `http://localhost:3000/api/events?limit=5&offset=0` | - | - |
| GET | `http://localhost:3000/api/events?sort=start_date&order=asc` | - | - |
| GET | `http://localhost:3000/api/events/search?query=concert` | - | - |
| GET | `http://localhost:3000/api/events/:id` | - | - |
| POST | `http://localhost:3000/api/events` | Event data | `Authorization: Bearer <token>` |
| PUT | `http://localhost:3000/api/events/:id` | Event data | `Authorization: Bearer <token>` |
| DELETE | `http://localhost:3000/api/events/:id` | - | `Authorization: Bearer <token>` |

---

## 🧪 Test Checklist (Stap-voor-stap)

### Stap 1: Server Controleren
- [ ] Server draait: `npm run dev` of `npm start`
- [ ] Console toont: "Server is running on port 3000"
- [ ] Console toont: "Connected to SQLite database"
- [ ] Console toont: "Users table ready"
- [ ] Console toont: "Events table ready"

### Stap 2: API Root Testen
- [ ] Open browser: `http://localhost:3000/api`
- [ ] Zie JSON response met endpoints overzicht
- [ ] Open browser: `http://localhost:3000/`
- [ ] Zie API documentatie pagina

### Stap 3: Authentication Testen

#### 3a. User Registreren
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "firstname": "Test",
  "lastname": "User",
  "email": "test@example.com",
  "password": "password123"
}
```
- [ ] Status: 201 Created
- [ ] Response bevat user object (zonder password)
- [ ] User ID wordt teruggegeven

#### 3b. Login
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```
- [ ] Status: 200 OK
- [ ] Response bevat JWT token
- [ ] **KOPIEER HET TOKEN!** (je hebt dit nodig voor stap 4)

### Stap 4: Users Endpoints Testen

#### 4a. Alle Users Ophalen
```http
GET http://localhost:3000/api/users
```
- [ ] Status: 200 OK
- [ ] Response is array (kan leeg zijn of users bevatten)

#### 4b. Specifieke User Ophalen
```http
GET http://localhost:3000/api/users/1
```
- [ ] Status: 200 OK (als user bestaat)
- [ ] Of Status: 404 Not Found (als user niet bestaat)

### Stap 5: Events Endpoints Testen (Met Token!)

#### 5a. Event Aanmaken (BEVEILIGD!)
```http
POST http://localhost:3000/api/events
Content-Type: application/json
Authorization: Bearer <JOUW_TOKEN_HIER>

{
  "title": "Test Concert",
  "description": "Een test evenement",
  "start_date": "2024-12-31T20:00:00",
  "end_date": "2025-01-01T02:00:00",
  "location": "Amsterdam Arena",
  "user_id": 1
}
```
- [ ] Status: 201 Created
- [ ] Response bevat nieuw event object
- [ ] Test ZONDER token: Status: 401 Unauthorized

#### 5b. Alle Events Ophalen
```http
GET http://localhost:3000/api/events
```
- [ ] Status: 200 OK
- [ ] Response bevat events array + pagination info

#### 5c. Events met Pagination
```http
GET http://localhost:3000/api/events?limit=5&offset=0
```
- [ ] Status: 200 OK
- [ ] Response bevat max 5 events
- [ ] Response bevat pagination object met limit, offset, total

#### 5d. Events Zoeken
```http
GET http://localhost:3000/api/events/search?query=concert
```
- [ ] Status: 200 OK
- [ ] Response bevat events die "concert" bevatten in title/description/location

#### 5e. Events Sorteren
```http
GET http://localhost:3000/api/events?sort=start_date&order=asc
```
- [ ] Status: 200 OK
- [ ] Events zijn gesorteerd op start_date (ascending)

#### 5f. Specifiek Event Ophalen
```http
GET http://localhost:3000/api/events/1
```
- [ ] Status: 200 OK (als event bestaat)
- [ ] Response bevat event object met user informatie

#### 5g. Event Updaten (BEVEILIGD!)
```http
PUT http://localhost:3000/api/events/1
Content-Type: application/json
Authorization: Bearer <JOUW_TOKEN_HIER>

{
  "title": "Updated Concert",
  "location": "Rotterdam Ahoy"
}
```
- [ ] Status: 200 OK
- [ ] Response bevat updated event
- [ ] Test ZONDER token: Status: 401 Unauthorized

#### 5h. Event Verwijderen (BEVEILIGD!)
```http
DELETE http://localhost:3000/api/events/1
Authorization: Bearer <JOUW_TOKEN_HIER>
```
- [ ] Status: 204 No Content
- [ ] Test ZONDER token: Status: 401 Unauthorized

---

## 🔍 Troubleshooting

### Probleem: 404 Not Found
**Oplossing:**
1. Controleer of URL exact matcht: `/api/users` (niet `/users`)
2. Controleer of server draait
3. Herstart server: `Ctrl+C` → `npm run dev`

### Probleem: 401 Unauthorized bij Events
**Oplossing:**
1. Zorg dat je eerst inlogt: `POST /api/auth/login`
2. Kopieer JWT token uit response
3. Voeg header toe: `Authorization: Bearer <token>`
4. Token vervalt na 24 uur (opnieuw inloggen)

### Probleem: 400 Bad Request (Validatie Errors)
**Oplossing:**
1. Check request body - alle verplichte velden aanwezig?
2. Email formaat correct? (user@example.com)
3. Password minimaal 8 karakters?
4. Dates in correct formaat? (ISO 8601: 2024-12-31T20:00:00)
5. Check response voor specifieke error messages

### Probleem: Server start niet
**Oplossing:**
1. Controleer of poort 3000 beschikbaar is
2. Check `.env` file bestaat (optioneel - defaults worden gebruikt)
3. Check console voor error messages
4. Database errors: check database.sqlite permissions

---

## ✅ Success Criteria

Je weet dat alles werkt als:

- ✅ Alle GET requests returnen 200 OK (of 404 als resource niet bestaat)
- ✅ POST requests returnen 201 Created
- ✅ PUT requests returnen 200 OK
- ✅ DELETE requests returnen 204 No Content
- ✅ Protected routes (events POST/PUT/DELETE) werken MET token
- ✅ Protected routes geven 401 ZONDER token
- ✅ Pagination werkt (limit & offset parameters)
- ✅ Search werkt (query parameter)
- ✅ Sorting werkt (sort & order parameters)
- ✅ Validatie werkt (foutieve data geeft 400 met errors array)

---

## 🎯 Quick Test Commands (curl)

### Test Users
```bash
# Alle users
curl http://localhost:3000/api/users

# Specifieke user
curl http://localhost:3000/api/users/1
```

### Test Events (zonder token)
```bash
# Alle events
curl http://localhost:3000/api/events

# Events met pagination
curl "http://localhost:3000/api/events?limit=5&offset=0"

# Search
curl "http://localhost:3000/api/events/search?query=concert"
```

### Test Events (met token)
```bash
# Login eerst (bewaar token!)
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.token')

# Maak event aan
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test","start_date":"2024-12-31T20:00:00","end_date":"2025-01-01T02:00:00","location":"Amsterdam","user_id":1}'
```

---

## 📝 Postman Collection Import

Je kunt deze URLs direct in Postman gebruiken:

1. Maak nieuwe requests aan in Postman
2. Gebruik de URLs uit de tabel hierboven
3. Voor POST/PUT: Voeg body toe (raw JSON)
4. Voor protected routes: Voeg Authorization header toe (Bearer token)
5. Save als Postman Collection voor later gebruik
