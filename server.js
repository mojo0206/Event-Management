console.log("Starting server...");
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 DB CONNECTION
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "testuser",
  password: "1234",
  database: "collegeeventdb",
  port: 3306
});

db.connect((err) => {
  if (err) console.log(err);
  else console.log("DB connected");
});

// ✅ TEST
app.get("/", (req, res) => {
  res.send("Backend running");
});


// 🔐 SIGNUP
app.post("/signup", (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  db.query(
    "INSERT INTO student (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)",
    [firstName, lastName, email, password, role],
    (err) => {
      if (err) return res.send(err);
      res.send("Signup success");
    }
  );
});


// 🔐 LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM student WHERE email=? AND password=?",
    [email, password],
    (err, result) => {
      if (err) return res.send(err);

      if (result.length > 0) {
        res.send(result[0]); // user data
      } else {
        res.send("Invalid login");
      }
    }
  );
});


// 🎉 GET ALL EVENTS
app.get("/events", (req, res) => {
  console.log("Events API called");

  db.query("SELECT * FROM event", (err, result) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.send(err);
    }

    console.log("Data:", result);
    res.send(result);
  });
});


// 🎯 GET EVENTS BY TYPE
app.get("/events/:type", (req, res) => {
  const type = req.params.type;

  db.query(
    "SELECT * FROM event WHERE type=?",
    [type],
    (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    }
  );
});


// 📝 REGISTER FOR EVENT
app.post("/register", (req, res) => {
  const data = req.body;

  db.query("INSERT INTO registration SET ?", data, (err) => {
    if (err) return res.send(err);
    res.send("Registered successfully");
  });
});


// 💳 PAYMENT
app.post("/payment", (req, res) => {
  const data = req.body;

  db.query("INSERT INTO payment SET ?", data, (err) => {
    if (err) return res.send(err);
    res.send("Payment saved");
  });
});


// ⭐ FEEDBACK
app.post("/feedback", (req, res) => {
  const data = req.body;

  db.query("INSERT INTO feedback SET ?", data, (err) => {
    if (err) return res.send(err);
    res.send("Feedback added");
  });
});


// 👨‍💼 ORGANISER EVENTS
app.get("/organiser/:club", (req, res) => {
  const club = req.params.club;

  db.query(
    "SELECT * FROM event WHERE club_name=?",
    [club],
    (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    }
  );
});


// ➕ CREATE EVENT
app.post("/event/create", (req, res) => {
  const data = req.body;

  db.query("INSERT INTO event SET ?", data, (err) => {
    if (err) return res.send(err);
    res.send("Event created");
  });
});


// ✏️ UPDATE EVENT
app.put("/event/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;

  db.query(
    "UPDATE event SET ? WHERE event_id=?",
    [data, id],
    (err) => {
      if (err) return res.send(err);
      res.send("Event updated");
    }
  );
});


// 🚀 START SERVER
app.listen(3000, () => {
  console.log("Server running on port 3000");
});