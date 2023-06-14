const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');

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

// POST request for login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Validate user credentials
  if (validateUserCredentials(username, password)) {
    // Set the username cookie
    res.cookie('username', username);
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Serve startseite
app.get('/startseite', (req, res) => {
  const username = req.cookies.username; // Retrieve the username cookie

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

  // Redirect to the registration page
  res.redirect('/registration');
});

// POST request for adding a quiz question
app.post('/frage-hinzufuegen', (req, res) => {
  const quizData = req.body;

  // Read the existing questions from the file
  let existingData = [];
  try {
    const fileData = fs.readFileSync('fragen.json', 'utf8');
    existingData = JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading file: ' + error);
  }

  // Add the new quiz question to the existing questions
  existingData.push(quizData);

  // Write the questions back to the file
  try {
    fs.writeFileSync('fragen.json', JSON.stringify(existingData));
    console.log('Quiz question saved successfully.');
    // Send a success response
    res.sendStatus(200);
  } catch (error) {
    console.error('Error writing file: ' + error);
    // Send an error response
    res.sendStatus(500);
  }
});

// GET request for retrieving the make-quiz.html
app.get('/make-quiz', (req, res) => {
  fs.readFile('make-quiz.html', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file: ' + err);
        res.sendStatus(500);
      } else {
        res.send(data);
      }
    });
  });
  
  // GET request for retrieving quiz questions
  app.get('/fragen', (req, res) => {
    // Read the quiz questions from the file
    fs.readFile('fragen.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file: ' + err);
        res.sendStatus(500);
      } else {
        const questions = JSON.parse(data);
        res.json(questions);
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
  
  // Check if a user with the given username already exists
  function userExists(username) {
    // Read the existing users from the file
    let existingUsers = [];
    try {
      const fileData = fs.readFileSync('users.json', 'utf8');
      existingUsers = JSON.parse(fileData);
    } catch (error) {
      console.error('Error reading file: ' + error);
    }
  
    // Check if the username exists in the existing users
    return existingUsers.some((user) => user.username === username);
  }
  
  // Save a new user to the users.json file
  function saveUser(newUser) {
    // Read the existing users from the file
    let existingUsers = [];
    try {
      const fileData = fs.readFileSync('users.json', 'utf8');
      existingUsers = JSON.parse(fileData);
    } catch (error) {
      console.error('Error reading file: ' + error);
    }
  
    // Add the new user to the existing users
    existingUsers.push(newUser);
  
    // Write the users back to the file
    try {
      fs.writeFileSync('users.json', JSON.stringify(existingUsers));
      console.log('User saved successfully.');
    } catch (error) {
      console.error('Error writing file: ' + error);
    }
  }
  
  // Validate user credentials
  function validateUserCredentials(username, password) {
    // Read the existing users from the file
    let existingUsers = [];
    try {
      const fileData = fs.readFileSync('users.json', 'utf8');
      existingUsers = JSON.parse(fileData);
    } catch (error) {
      console.error('Error reading file: ' + error);
    }
  
    // Check if the username and password match any existing user
    return existingUsers.some((user) => user.username === username && user.password === password);
  }
  
  // Start the server
  app.listen(7799, () => {
    console.log('Server started on port 7799');
  });
