# ✅ Correcte URLs voor Testing

## 🔍 Route Configuratie (Bevestigd Correct)

In `src/app.js` regel 35-37:

```javascript
app.use('/api/users', usersRoutes);   // ✅ Prefix: /api/users
app.use('/api/events', eventsRoutes); // ✅ Prefix: /api/events  
app.use('/api/auth', authRoutes);     // ✅ Prefix: /api/auth
```

**BELANGRIJK:** Het eerste argument van `app.use()` is de prefix. Alle URLs moeten deze prefix gebruiken!

---

## ✅ Correcte URLs (Gebruik deze!)

### ❌ FOUT
```
GET http://localhost:3000/users        ❌
GET http://localhost:3000/events       ❌
GET http://localhost:3000/auth/register ❌
```

### ✅ CORRECT
```
GET http://localhost:3000/api/users           ✅
GET http://localhost:3000/api/events          ✅
GET http://localhost:3000/api/auth/register   ✅
```

---

## 📋 Complete URL Lijst

### Authentication
| Methode | Correcte URL | 
|---------|--------------|
| POST | `http://localhost:3000/api/auth/register` |
| POST | `http://localhost:3000/api/auth/login` |

### Users
| Methode | Correcte URL |
|---------|--------------|
| GET | `http://localhost:3000/api/users` |
| GET | `http://localhost:3000/api/users/1` |
| POST | `http://localhost:3000/api/users` |
| PUT | `http://localhost:3000/api/users/1` |
| DELETE | `http://localhost:3000/api/users/1` |

### Events
| Methode | Correcte URL |
|---------|--------------|
| GET | `http://localhost:3000/api/events` |
| GET | `http://localhost:3000/api/events?limit=5&offset=0` |
| GET | `http://localhost:3000/api/events/search?query=concert` |
| GET | `http://localhost:3000/api/events/1` |
| POST | `http://localhost:3000/api/events` (met Authorization header!) |
| PUT | `http://localhost:3000/api/events/1` (met Authorization header!) |
| DELETE | `http://localhost:3000/api/events/1` (met Authorization header!) |

---

## 🧪 Quick Test

### Test 1: API Root
```
GET http://localhost:3000/api
```
**Verwacht:** JSON object met endpoints overzicht

### Test 2: Users
```
GET http://localhost:3000/api/users
```
**Verwacht:** `[]` (lege array) of array met users

### Test 3: Events  
```
GET http://localhost:3000/api/events
```
**Verwacht:** JSON object met `events` array en `pagination` object

---

## ⚠️ Veelgemaakte Fouten

### Fout 1: Vergeten /api prefix
```
❌ GET http://localhost:3000/users
✅ GET http://localhost:3000/api/users
```

### Fout 2: Dubbel /api
```
❌ GET http://localhost:3000/api/api/users
✅ GET http://localhost:3000/api/users
```

### Fout 3: Trailing slash (meestal OK, maar niet nodig)
```
✅ GET http://localhost:3000/api/users
✅ GET http://localhost:3000/api/users/  (ook OK)
```

---

## 🔧 Troubleshooting

### Als je nog steeds 404 krijgt:

1. **Check server draait:**
   ```bash
   npm run dev
   ```
   Console moet tonen:
   - ✅ Server is running on port 3000
   - ✅ Connected to SQLite database
   - ✅ Users table ready
   - ✅ Events table ready

2. **Check URL exact:**
   - Moet beginnen met `http://localhost:3000/api/`
   - Niet `http://localhost:3000/` (zonder /api)

3. **Herstart server:**
   ```bash
   Ctrl + C (stop)
   npm run dev (start opnieuw)
   ```

4. **Test API root eerst:**
   ```
   GET http://localhost:3000/api
   ```
   Als dit werkt, dan werkt de server. Dan is het alleen een URL probleem.

---

## ✅ Checklist

- [ ] Routes hebben `/api` prefix in `app.js`
- [ ] URLs in Postman beginnen met `/api/`
- [ ] Server draait (check console)
- [ ] API root werkt: `GET /api`
- [ ] Users endpoint werkt: `GET /api/users`
- [ ] Events endpoint werkt: `GET /api/events`

Als alle items ✅ zijn, dan werkt alles perfect!
