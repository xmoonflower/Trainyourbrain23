const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
const USER_DATA_FILE = 'profil.json';

// Middleware zum Parsen von JSON-Anfragenkörpern
app.use(express.json());

// GET-Endpunkt für die Anzeige der Registrierungsseite
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

// POST-Endpunkt zum Speichern der Benutzerdaten
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Überprüfung, ob Benutzername und Passwort vorhanden sind
  if (!username || !password) {
    return res.status(400).json({ error: 'Benutzername und Passwort erforderlich' });
  }

  // Überprüfung, ob der Benutzer bereits existiert
  if (userExists(username)) {
    return res.status(400).json({ error: 'Benutzername bereits vergeben' });
  }

  // Erstellen eines neuen Benutzers
  const newUser = {
    username,
    password
  };

  // Speichern des neuen Benutzers in der JSON-Datei
  saveUser(newUser);

  res.json({ message: 'Registrierung erfolgreich' });
});

// POST-Endpunkt für die Benutzeranmeldung
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Überprüfung, ob Benutzername und Passwort vorhanden sind
  if (!username || !password) {
    return res.status(400).json({ error: 'Benutzername und Passwort erforderlich' });
  }

  // Überprüfung der Anmeldedaten
  if (validateUserCredentials(username, password)) {
    res.json({ message: 'Anmeldung erfolgreich' });
  } else {
    res.status(401).json({ error: 'Ungültige Anmeldedaten' });
  }
});

// Funktion zum Überprüfen, ob ein Benutzer bereits existiert
function userExists(username) {
  const userData = loadUserData();

  return userData.some(user => user.username === username);
}

// Funktion zum Speichern eines neuen Benutzers in der JSON-Datei
function saveUser(user) {
  const userData = loadUserData();

  userData.push(user);
  fs.writeFileSync(USER_DATA_FILE, JSON.stringify(userData, null, 2));
}

// Funktion zum Laden der Benutzerdaten aus der JSON-Datei
function loadUserData() {
  if (!fs.existsSync(USER_DATA_FILE)) {
    return [];
  }

  const userData = fs.readFileSync(USER_DATA_FILE, 'utf8');

  return JSON.parse(userData);
}

// Funktion zum Überprüfen der Anmeldedaten
function validateUserCredentials(username, password) {
  const userData = loadUserData();

  return userData.some(user => user.username === username && user.password === password);
}

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
