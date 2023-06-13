const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// Middleware für die Verarbeitung von JSON-Daten
app.use(bodyParser.json());

// POST-Anfrage für das Hinzufügen einer Quizfrage
app.post('/frage-hinzufuegen', (req, res) => {
  const quizData = req.body;

  // Lese die vorhandenen Fragen aus der Datei
  let existingData = [];
  try {
    const fileData = fs.readFileSync('fragen.json', 'utf8');
    existingData = JSON.parse(fileData);
  } catch (error) {
    console.error('Fehler beim Lesen der Datei: ' + error);
  }

  // Füge die neue Quizfrage zu den vorhandenen Fragen hinzu
  existingData.push(quizData);

  // Schreibe die Fragen zurück in die Datei
  try {
    fs.writeFileSync('fragen.json', JSON.stringify(existingData));
    console.log('Die Quizfrage wurde erfolgreich gespeichert.');
    // Sende eine Erfolgsantwort zurück
    res.sendStatus(200);
  } catch (error) {
    console.error('Fehler beim Schreiben der Datei: ' + error);
    // Sende eine Fehlerantwort zurück
    res.sendStatus(500);
  }
});

// GET-Anfrage für das Abrufen der make-quiz.html
app.get('/make-quiz', (req, res) => {
    fs.readFile('make-quiz.html', 'utf8', (err, data) => {
      if (err) {
        console.error('Fehler beim Lesen der Datei: ' + err);
        res.sendStatus(500);
      } else {
        res.send(data);
      }
    });
  });

app.use(express.static('public'));

app.get('/questions', (req, res) => {
  fs.readFile('aws-question.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Fehler beim Lesen der Fragen.');
    } else {
      const questions = JSON.parse(data);
      res.json(questions);
    }
  });
});

app.get('/play', (req, res) => {
  const filePath = path.join(__dirname, 'quizplayaws.html');
  res.sendFile(filePath);
});

app.use(express.static('public'));

app.get('/fragen-linux', (req, res) => {
  fs.readFile('linux.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Fehler beim Lesen der Fragen.');
    } else {
      const questions = JSON.parse(data);
      res.json(questions);
    }
  });
});

app.get('/play1', (req, res) => {
  const filePath = path.join(__dirname, 'quizplaylinux.html');
  res.sendFile(filePath);
});

app.use(express.static('public'));

app.get('/frage', (req, res) => {
  fs.readFile('fragen.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Fehler beim Lesen der Fragen.');
    } else {
      const questions = JSON.parse(data);
      res.json(questions);
    }
  });
});

app.get('/play2', (req, res) => {
  const filePath = path.join(__dirname, 'playmyquiz.html');
  res.sendFile(filePath);
});

// Server starten
app.listen(7799, () => {
  console.log('Der Server ist gestartet und hört auf dem Port 7799.');
});
