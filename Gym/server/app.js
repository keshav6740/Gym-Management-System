const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 5000;

// app.set('view engine', 'ejs');
// console.log('Views directory path:', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('../client/components'));
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); 

// Create connection to MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_pass',
  database: 'your_database_name',
  authPlugin: 'mysql_native_password', // Specify the authentication plugin
  authSwitchHandler: (data, cb) => { // Add an authSwitchHandler
    if (data.pluginName === 'caching_sha2_password') {
      const passwordSha1 = require('sha1')(password); // Assuming 'sha1' module is installed
      const scrambleBuff = Buffer.from(passwordSha1, 'hex');
      const authResponse = Buffer.alloc(scrambleBuff.length + 1);

      scrambleBuff.forEach((byte, i) => {
        authResponse[i] = byte ^ 0x5c;
      });

      cb(null, authResponse);
    } else {
      cb(new Error('Unknown plugin'));
    }
  }
});


// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Middleware for parsing JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static('public'));

// Serve home page
// const path = require('path');
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/registration-success', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/home-page.html'));
});

// Serve admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/admin.html'));
});

app.get('/basic_class.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/basic_class.html'));
});

app.get('/premium_class.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/premium_class.html'));
});

app.get('/platinum_class.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/platinum_class.html'));
});

app.get('/profile', (req, res) => {
  try {
      // Assuming you have a profile HTML file available
      res.sendFile(path.join(__dirname, '../client/profile.html'));
  } catch (err) {
      console.error('Error rendering profile:', err);
      res.status(500).send('Error rendering profile');
  }
});

app.get('/user-membership/:userId', (req, res) => {
  const userId = req.params.userId;
  // Query database to fetch user's selected membership
  const sql = 'SELECT plan FROM membership WHERE member_id = ?';
  db.query(sql, [userId], (err, result) => {
      if (err) {
          console.error('Error fetching user membership:', err);
          return res.status(500).json({ success: false, error: 'Error fetching membership' });
      }
      
      if (result.length > 0) {
          const membership = result[0].plan;
          res.json({ success: true, membership });
      } else {
          res.json({ success: false, membership: 'Membership not found' });
      }
  });
});

// Endpoint to fetch user's selected classes
app.get('/user-classes/:userId', (req, res) => {
  const userId = req.params.userId;
  // Query database to fetch user's selected classes
  const sql = 'SELECT name FROM classes WHERE member_id = ?';
  db.query(sql, [userId], (err, result) => {
      if (err) {
          console.error('Error fetching user classes:', err);
          return res.status(500).json({ success: false, error: 'Error fetching classes' });
      }

      if (result.length > 0) {
          const classes = result.map(row => row.name);
          res.json({ success: true, classes });
      } else {
          res.json({ success: false, classes: 'Classes not found' });
      }
  });
});

// Handle registration form submission
app.post('/register', (req, res) => {
    const { fullName, email, password, confirmPassword } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !confirmPassword) {
        return res.status(400).send('All fields are required');
    }

    // Validate password and confirmPassword match
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    // Insert data into MySQL database
    const sql = 'INSERT INTO members (FullName, EmailAddress, Password) VALUES (?, ?, ?)';
    const values = [fullName, email, password]; // Assuming password is stored securely

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error registering user:', err);
            return res.status(500).send('Error registering user');
        }

        const userId = result.insertId; // Get the ID of the newly inserted user
        console.log('User registered successfully with ID:', userId);
        res.status(200).json({ userId, fullName, email, password }); // Send user data back to frontend
    });
});

app.post('/mark-attendance', (req, res) => {
  const { userId, attendanceDate } = req.body; // Get data from the request body

  // Validate data (you can add more validation as needed)
  if (!attendanceDate || !userId) {
      return res.status(400).send('Full Name, Attendance Date, and User ID are required');
  }

  // Check if attendance already exists for the given userId and attendanceDate
  const checkAttendanceQuery = 'SELECT * FROM attendance WHERE memberID = ? AND AttendanceDate = ?';
  const checkAttendanceValues = [userId, attendanceDate];

  db.query(checkAttendanceQuery, checkAttendanceValues, (checkErr, checkResult) => {
      if (checkErr) {
          console.error('Error checking attendance:', checkErr);
          return res.status(500).send('Error checking attendance');
      }

      if (checkResult.length > 0) {
          // Attendance already marked for this user and date
          return res.status(400).send('Attendance already marked for this date');
      }

      // If attendance doesn't exist, proceed to insert into the database
      const insertAttendanceQuery = 'INSERT INTO attendance (memberID, AttendanceDate) VALUES (?, ?)';
      const insertAttendanceValues = [userId, attendanceDate];

      db.query(insertAttendanceQuery, insertAttendanceValues, (insertErr, insertResult) => {
          if (insertErr) {
              console.error('Error marking attendance:', insertErr);
              return res.status(500).send('Error marking attendance');
          }
          console.log('Attendance marked successfully');
          res.status(200).send('Attendance marked successfully');
      });
  });
});


app.post('/registration', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/registration.html'));
});

// Handle form submissions from admin page
app.post('/admin/submit', (req, res) => {
  const formData = req.body;

  // Example: Insert data into MySQL database
  const sql = 'INSERT INTO your_table (column1, column2, ...) VALUES (?, ?, ...)';
  const values = [formData.field1, formData.field2]; // Replace field1, field2, ... with actual form field names

  db.query(sql, values, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Data inserted into MySQL');
    // Redirect or send response as needed
    res.redirect('/admin'); // Redirect to admin page after form submission
  });
});

// Handle attendance marking from the user's profile page
app.post('/mark-attendance-user', (req, res) => {
  const { userId, attendanceDate } = req.body; // Get data from the request body

  // Validate data (you can add more validation as needed)
  if (!attendanceDate || !userId) {
      return res.status(400).send('Full Name, Attendance Date, and User ID are required');
  }

  // Process attendance data (e.g., store in database)
  const sql = 'INSERT INTO attendance (memberID, AttendanceDate) VALUES (?, ?)';
  const values = [userId, attendanceDate];

  db.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error marking attendance:', err);
          return res.status(500).send('Error marking attendance');
      }
      console.log('Attendance marked successfully');
      res.status(200).send('Attendance marked successfully');
  });
});


app.post('/add-membership', (req, res) => {
  const { membershipId, plan, amount } = req.body; // Get data from the request body
  console.log(req.body);

  // Validate data (you can add more validation as needed)
  if (!membershipId || !plan || !amount) {
      return res.status(400).send('Membership ID, Plan, and Amount are required');
  }

  // Insert membership data into the database
  const sql = 'INSERT INTO membership (member_id, plan, amount) VALUES (?, ?, ?)';
  const values = [membershipId, plan, amount];

  db.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error adding membership:', err); // Log the error for debugging
          return res.status(500).send('Error adding membership');
      }
      console.log('Membership added successfully');
      res.status(200).send('Membership added successfully');
  });
});

app.post('/selected-classes', (req, res) => {
  const { userId, classes } = req.body;

  // Validate data (you can add more validation as needed)
  if (!userId || !Array.isArray(classes) || classes.length === 0) {
      return res.status(400).send('User ID and at least one class selection are required');
  }

  // Process class selections and insert into the database
  const sql = 'INSERT INTO classes (member_id, name) VALUES ?';
  const values = classes.map(className => [userId, className]); // Map classes to an array of arrays

  db.query(sql, [values], (err, result) => {
      if (err) {
          console.error('Error adding selected classes:', err);
          return res.status(500).send('Error adding selected classes');
      }
      console.log('Selected classes added successfully');
      res.status(200).json({ success: true }); // Send success response
  });
});

app.post('/selected-classes-premium', (req, res) => {
  const { userId, classes } = req.body;

  // Validate data (you can add more validation as needed)
  if (!userId || !Array.isArray(classes) || classes.length === 0) {
      return res.status(400).send('User ID and at least one class selection are required');
  }

  // Process class selections and insert into the database
  const sql = 'INSERT INTO classes (member_id, name) VALUES ?';
  const values = classes.map(className => [userId, className]); // Map classes to an array of arrays

  db.query(sql, [values], (err, result) => {
      if (err) {
          console.error('Error adding selected classes:', err);
          return res.status(500).send('Error adding selected classes');
      }
      console.log('Selected classes added successfully');
      res.status(200).json({ success: true }); // Send success response
  });
});

app.post('/selected-classes-platinum', (req, res) => {
  const { userId, classes } = req.body;

  // Validate data (you can add more validation as needed)
  if (!userId || !Array.isArray(classes) || classes.length === 0) {
      return res.status(400).send('User ID and at least one class selection are required');
  }

  // Process class selections and insert into the database
  const sql = 'INSERT INTO classes (member_id, name) VALUES ?';
  const values = classes.map(className => [userId, className]); // Map classes to an array of arrays

  db.query(sql, [values], (err, result) => {
      if (err) {
          console.error('Error adding selected classes:', err);
          return res.status(500).send('Error adding selected classes');
      }
      console.log('Selected classes added successfully');
      res.status(200).json({ success: true }); // Send success response
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
