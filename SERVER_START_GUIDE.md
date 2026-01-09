# 🚀 Server Start Guide - Stap voor Stap

## ✅ Stappen om Server Correct te Starten

### Stap 1: Check of Poort 3000 Vrij is

**Windows:**
```bash
netstat -ano | findstr :3000
```

**Als er een proces draait:**
- Je ziet een regel met PID (laatste kolom)
- Stop het proces (zie Stap 2)

**Als poort vrij is:**
- Geen output = poort is vrij ✅
- Ga naar Stap 3

---

### Stap 2: Stop Process op Poort 3000

**Windows:**
```bash
taskkill /PID <PID_NUMBER> /F
```

**Voorbeeld:**
```bash
taskkill /PID 49900 /F
```

**Mac/Linux:**
```bash
kill -9 <PID_NUMBER>
```

---

### Stap 3: Start Server

**Navigeer naar project folder:**
```bash
cd C:\Users\bilal\Downloads\project_backend (2)\backend_nodejs
```

**Start server:**
```bash
npm run dev
```

**Of voor production:**
```bash
npm start
```

---

### Stap 4: Verifieer Server Start

**Je zou moeten zien in de console:**

```
[nodemon] starting `node src/app.js`
Connected to SQLite database
Users table ready
Events table ready
Server is running on port 3000
API endpoints available at http://localhost:3000/api
Documentation available at http://localhost:3000/
```

**✅ Als je deze berichten ziet, werkt de server correct!**

---

### Stap 5: Test API Endpoints

**Test in Browser:**
1. Open: `http://localhost:3000/api`
   - Verwacht: JSON met endpoints overzicht

2. Open: `http://localhost:3000/api/users`
   - Verwacht: `[]` of array met users

3. Open: `http://localhost:3000/`
   - Verwacht: API documentatie pagina

**Test in Postman:**
```
GET http://localhost:3000/api/users
```

**✅ Als je response krijgt (geen 404), werkt alles!**

---

## 🔧 Troubleshooting

### Probleem: EADDRINUSE (Port already in use)

**Oplossing:**
1. Stop proces op poort 3000 (zie Stap 2)
2. Start server opnieuw (Stap 3)

### Probleem: Server start niet

**Check:**
- ✅ `package.json` bestaat
- ✅ `node_modules` zijn geïnstalleerd (`npm install`)
- ✅ `src/app.js` bestaat
- ✅ Database path is correct (`.env` of default)

### Probleem: 404 Not Found

**Check:**
- ✅ URL heeft `/api/` prefix: `http://localhost:3000/api/users`
- ✅ Server draait (check console)
- ✅ Routes zijn correct in `src/app.js`

### Probleem: Database errors

**Check:**
- ✅ SQLite database file kan worden aangemaakt
- ✅ Permissions zijn correct
- ✅ `DB_PATH` in `.env` is correct (optioneel)

---

## 📋 Checklist

Voordat je presenteert/demo geeft:

- [ ] Poort 3000 is vrij
- [ ] Server draait (check console output)
- [ ] Database is verbonden (zie "Connected to SQLite database")
- [ ] Tabellen zijn klaar (zie "Users table ready", "Events table ready")
- [ ] API root werkt: `GET http://localhost:3000/api`
- [ ] Users endpoint werkt: `GET http://localhost:3000/api/users`
- [ ] Events endpoint werkt: `GET http://localhost:3000/api/events`
- [ ] Documentatie werkt: `GET http://localhost:3000/`

---

## 💡 Tips

1. **Altijd check poort eerst** voordat je server start
2. **Gebruik `npm run dev`** voor development (auto-reload)
3. **Gebruik `npm start`** voor production
4. **Sluit oude terminal windows** die nog servers draaien
5. **Test altijd `/api` endpoint eerst** om te verifiëren dat server werkt

---

## 🎯 Quick Commands Reference

```bash
# Check poort 3000
netstat -ano | findstr :3000

# Stop proces (Windows)
taskkill /PID <PID> /F

# Start server
npm run dev

# Test API (in browser)
http://localhost:3000/api
http://localhost:3000/api/users
http://localhost:3000/api/events

# Test API (curl)
curl http://localhost:3000/api
curl http://localhost:3000/api/users
curl http://localhost:3000/api/events
```
