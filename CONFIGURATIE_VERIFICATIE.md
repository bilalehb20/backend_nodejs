# ✅ Configuratie Verificatie - Alles Correct!

## 🔍 Route Configuratie (VERIFICATIE)

### src/app.js - Routes Mounting (✅ CORRECT)
```javascript
// Regel 35-37
app.use('/api/users', usersRoutes);   // ✅
app.use('/api/events', eventsRoutes); // ✅
app.use('/api/auth', authRoutes);     // ✅
```

**Status:** ✅ Alle routes correct gemount met `/api` prefix

---

## 🔍 Auth Routes (VERIFICATIE)

### src/routes/auth.routes.js (✅ CORRECT)
```javascript
// Regel 7
router.post('/register', validateUser, register);  // ✅

// Regel 10
router.post('/login', login);  // ✅
```

**Status:** ✅ Register route bestaat correct als POST route

**Complete URL:** `POST http://localhost:3000/api/auth/register`

---

## 🔍 Users Routes (VERIFICATIE)

### src/routes/users.routes.js (✅ CORRECT)
```javascript
router.get('/', getAllUsers);           // ✅ GET /api/users
router.get('/:id', getUserById);        // ✅ GET /api/users/:id
router.post('/', validateUser, createUser);  // ✅ POST /api/users
router.put('/:id', validateUser, updateUser); // ✅ PUT /api/users/:id
router.delete('/:id', deleteUser);      // ✅ DELETE /api/users/:id
```

**Status:** ✅ Alle CRUD operaties aanwezig

---

## 🔍 Events Routes (VERIFICATIE)

### src/routes/events.routes.js (✅ CORRECT)
```javascript
router.get('/search', searchEvents);    // ✅ GET /api/events/search
router.get('/', getAllEvents);          // ✅ GET /api/events
router.get('/:id', getEventById);       // ✅ GET /api/events/:id
router.post('/', authenticateToken, validateEvent, createEvent);  // ✅ POST /api/events (protected)
router.put('/:id', authenticateToken, validateEvent, updateEvent); // ✅ PUT /api/events/:id (protected)
router.delete('/:id', authenticateToken, deleteEvent); // ✅ DELETE /api/events/:id (protected)
```

**Status:** ✅ Alle routes correct, search route voor :id route (belangrijk!)

---

## 🖥️ Server Status

**Poort 3000 Status:**
- ✅ Server draait (PID: 51980)
- ✅ Process is LISTENING op poort 3000

---

## 📋 Test Endpoints (Correcte URLs)

### Authentication
| Methode | URL | Body Required |
|---------|-----|---------------|
| POST | `http://localhost:3000/api/auth/register` | ✅ Ja |
| POST | `http://localhost:3000/api/auth/login` | ✅ Ja |

### Users
| Methode | URL | Body Required |
|---------|-----|---------------|
| GET | `http://localhost:3000/api/users` | ❌ |
| GET | `http://localhost:3000/api/users/1` | ❌ |
| POST | `http://localhost:3000/api/users` | ✅ Ja |
| PUT | `http://localhost:3000/api/users/1` | ✅ Ja |
| DELETE | `http://localhost:3000/api/users/1` | ❌ |

### Events
| Methode | URL | Headers Required |
|---------|-----|------------------|
| GET | `http://localhost:3000/api/events` | ❌ |
| GET | `http://localhost:3000/api/events/search?query=concert` | ❌ |
| GET | `http://localhost:3000/api/events/1` | ❌ |
| POST | `http://localhost:3000/api/events` | ✅ Authorization: Bearer <token> |
| PUT | `http://localhost:3000/api/events/1` | ✅ Authorization: Bearer <token> |
| DELETE | `http://localhost:3000/api/events/1` | ✅ Authorization: Bearer <token> |

---

## 🧪 Test Checklist

### 1. Test API Root
```
GET http://localhost:3000/api
```
**Verwacht:**
```json
{
  "message": "REST API - Node.js & Express",
  "version": "1.0.0",
  "endpoints": {
    "users": "/api/users",
    "events": "/api/events",
    "auth": "/api/auth"
  },
  "documentation": "/"
}
```

### 2. Test Register (POST /api/auth/register)
**In Postman:**
- Methode: **POST**
- URL: `http://localhost:3000/api/auth/register`
- Headers: (automatisch JSON)
- Body → raw → JSON:
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Verwacht Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01 12:00:00"
  }
}
```

### 3. Test Login (POST /api/auth/login)
**In Postman:**
- Methode: **POST**
- URL: `http://localhost:3000/api/auth/login`
- Body → raw → JSON:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Verwacht Response (200 OK):**
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

### 4. Test Users (GET /api/users)
```
GET http://localhost:3000/api/users
```
**Verwacht:** Array met users (kan leeg zijn `[]`)

### 5. Test Events (GET /api/events)
```
GET http://localhost:3000/api/events
```
**Verwacht:**
```json
{
  "events": [],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 0
  }
}
```

---

## ⚠️ Veelgemaakte Fouten in Postman

### ❌ FOUT
- URL: `http://localhost:3000/auth/register` (mist `/api/`)
- URL: `POST http://localhost:3000/api/auth/register` (POST staat in URL)
- Body type: Text (moet JSON zijn)

### ✅ CORRECT
- URL: `http://localhost:3000/api/auth/register` (zonder POST in URL)
- Methode: POST (bovenaan Postman dropdown)
- Body: raw → JSON (selecteer JSON in dropdown)

---

## ✅ Conclusie

**Alles is correct geconfigureerd!**

- ✅ Routes zijn correct gemount in app.js
- ✅ Auth register route bestaat
- ✅ Alle route bestanden zijn correct
- ✅ Server draait op poort 3000

**Als je nog 404 krijgt:**
1. Check URL heeft `/api/` prefix
2. Check server draait (console messages)
3. Check methode is correct (GET/POST/PUT/DELETE)
4. Check body is JSON voor POST/PUT requests

**Als je 401 krijgt bij events:**
- Dat is correct! Events POST/PUT/DELETE vereisen JWT token
- Login eerst → kopieer token → gebruik in Authorization header
