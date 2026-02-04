
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: 'secret123',
    resave: false,
    saveUninitialized: true
}));

const db = new sqlite3.Database('./server/database.db');

db.run(`CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY,
    login TEXT,
    password TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_name TEXT,
    service TEXT,
    master TEXT,
    date TEXT,
    time TEXT
)`);

// default admin
db.run("INSERT OR IGNORE INTO admin (id, login, password) VALUES (1, 'admin', 'admin')");

app.post('/login', (req, res) => {
    const { login, password } = req.body;
    db.get("SELECT * FROM admin WHERE login=? AND password=?", [login, password], (err, row) => {
        if (row) {
            req.session.admin = true;
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }
    });
});

app.get('/api/appointments', (req, res) => {
    if (!req.session.admin) return res.sendStatus(403);
    db.all("SELECT * FROM appointments", [], (err, rows) => res.json(rows));
});

app.post('/api/appointments', (req, res) => {
    if (!req.session.admin) return res.sendStatus(403);
    const { client_name, service, master, date, time } = req.body;
    db.run(
        "INSERT INTO appointments (client_name, service, master, date, time) VALUES (?,?,?,?,?)",
        [client_name, service, master, date, time],
        () => res.sendStatus(200)
    );
});

app.delete('/api/appointments/:id', (req, res) => {
    if (!req.session.admin) return res.sendStatus(403);
    db.run("DELETE FROM appointments WHERE id=?", req.params.id, () => res.sendStatus(200));
});

app.listen(3000, () => console.log('http://localhost:3000'));
