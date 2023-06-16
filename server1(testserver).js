
const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');

/////////////Module

//////////////Registration

// Middleware for JSON data processing
app.use(bodyParser.json());
app.use(cookieParser());

// Serve the index.html file
app.get('/registration', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// POST request for registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check if the user already exists
  if (userExists(username)) {
    return res.status(400).json({ error: 'Username already taken' });
  }

  // Create a new user
  const newUser = {
    username,
    password
  };

  // Save the new user to the users.json file
  saveUser(newUser);

  res.json({ message: 'Registration successful' });
});

/////////////////Anmeldung

// POST request for login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Validate user credentials
  if (validateUserCredentials(username, password)) {
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Check if a user already exists
function userExists(username) {
  const userData = loadUserData();

  return userData.some(user => user.username === username);
}

// Save a new user to the users.json file
function saveUser(user) {
  const userData = loadUserData();

  userData.push(user);
  fs.writeFileSync('users.json', JSON.stringify(userData, null, 2));
}

// Load user data from the users.json file
function loadUserData() {
  if (!fs.existsSync('users.json')) {
    return [];
  }

  const userData = fs.readFileSync('users.json', 'utf8');

  return JSON.parse(userData);
}

// Validate user credentials
function validateUserCredentials(username, password) {
  const userData = loadUserData();

  return userData.some(user => user.username === username && user.password === password);
}

//////////////////////// Startseite mit Usercookie

// Serve startseite
app.get('/startseite', (req, res) => {
  const username = req.cookies.username; // Abrufen des Benutzernamen-Cookies

  if (!username) {
    res.redirect('/registration');
  } else {
    res.sendFile(path.join(__dirname, 'startseite.html'));
  }
});

// POST request for logout
app.post('/logout', (req, res) => {
  // Clear the username cookie
  res.clearCookie('username');

  res.json({ message: 'Logout successful' });
});

// Set the username cookie upon successful login
app.post('/login', (req, res) => {
  const { username } = req.body;

  // Set the username cookie
  res.cookie('username', username);

  res.json({ message: 'Login successful' });
});

// POST request for logout
app.post('/logout', (req, res) => {
    // Clear the username cookie
    res.clearCookie('username');
  
    // Redirect to the registration page
    res.redirect('/registration');
  });
////////////////////////////////////////////////////////////make Quiz
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

  // Generiere eine eindeutige ID für die neue Quizfrage
  const newId = existingData.length.toString();

  // Erstelle ein neues Frageobjekt im gewünschten Format
  const newQuestion = {
    id: newId,
    question: quizData.question,
    answer: {
      A: quizData.answer.A,
      B: quizData.answer.B,
      C: quizData.answer.C,
      D: quizData.answer.D
    },
    correct_answer: quizData.correct_answer
  };

  // Füge die neue Quizfrage zu den vorhandenen Fragen hinzu
  existingData.push(newQuestion);

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

/////////////////////////////////////////////////////////////////////7777    
  
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

////////////////////////// AWS Quiz    
  
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
  
///////////////Speicherapi Linuxfragen
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
  //////////////////////////////// Linux
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
  //////////////////////////////////////////////////77
  
  app.get('/play2', (req, res) => {
    const filePath = path.join(__dirname, 'playmyquiz.html');
    res.sendFile(filePath);
  });

//////////////////////////play my Quiz

// POST-Anfrage für das Speichern des Scores
app.post('/score', (req, res) => {
  const username = req.cookies.username; // Abrufen des Benutzernamen-Cookies
  const score = req.body.score;

  if (!username || !score) {
    return res.status(400).json({ error: 'Username and score are required' });
  }

  updateScore(username, score);

  res.json({ message: 'Score saved successfully' });
});

// Funktion zum Aktualisieren des Scores
function updateScore(username, score) {
  const userData = loadUserData();

  const user = userData.find(user => user.username === username);
  if (user) {
    user.score = score;
    fs.writeFileSync('users.json', JSON.stringify(userData, null, 2));
  }
}
////Scorepunkte my Quiz speichern vom Quiz in die json Datei, damit diese vom Scoreboard gefechted werden kann
// POST-Anfrage zum Speichern des Benutzernamens und der Punktzahl
app.post('/score-myquiz', (req, res) => {
  const { username, score } = req.body;

  // Lese die vorhandenen Daten aus der Datei
  let existingData = [];
  try {
    const fileData = fs.readFileSync('Punkte-myquiz.json', 'utf8');
    existingData = JSON.parse(fileData);
  } catch (error) {
    console.error('Fehler beim Lesen der Datei: ' + error);
  }

  // Füge den neuen Datensatz hinzu
  existingData.push({ username, score });

  // Speichere die aktualisierten Daten in der Datei
  try {
    fs.writeFileSync('Punkte-myquiz.json', JSON.stringify(existingData, null, 2));
    res.sendStatus(200);
  } catch (error) {
    console.error('Fehler beim Schreiben der Datei: ' + error);
    res.sendStatus(500);
  }
});

// Funktion zum Aktualisieren des Scores
function updateScore(username, score) {
  const userData = loadUserData();

  const user = userData.find(user => user.username === username);
  if (user) {
    user.score = score;
    fs.writeFileSync('Punkte-myquiz.json', JSON.stringify(userData, null, 2));
  }
}

///////////////////////////Scoreboard my Quiz

app.get('/score-myquiz', (req, res) => {
  const filePath = path.join(__dirname, 'Punkte-myquiz.json');
  res.sendFile(filePath);
});


// Endpoint to update scores von my Quiz 
app.post('/score-myquiz', (req, res) => {
  // Read the JSON file
  fs.readFile('Punkte-myquiz.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading JSON file');
      return;
    }

    try {
      const scores = JSON.parse(data);
      scores.forEach(score => {
        updateScore(score.username, score.score);
      });
      res.send('Scores updated successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating scores');
    }
  });
});

//////////////Scoreboard online

app.get('/scoreboard', (req, res) => {
  const filePath = path.join(__dirname, 'scoreboard.html');
  res.sendFile(filePath);
});

app.get('/scoreboard-aws', (req, res) => {
  const filePath = path.join(__dirname, 'scoreboard-aws.html');
  res.sendFile(filePath);
});


// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
