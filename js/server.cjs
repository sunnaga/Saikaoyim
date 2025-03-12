// const express = require('express');
// const app = express();

// app.get('/', (req, res) => {
//     res.send('Hello, Express!');
//   });
  
// app.listen(3000, () => {
//     console.log('Server is running on http://localhost:3000');
// });

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

    let d = new Date();
    let year = d.getFullYear();
    let month = String(d.getMonth() + 1).padStart(2, "0"); // +1 เพราะ JavaScript นับเดือนเริ่มจาก 0
    let day = String(d.getDate()).padStart(2, "0");

    let date = `${year} เดือน ${month} วันที่ ${day}`;


// เชื่อมต่อฐานข้อมูล MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // แก้เป็น username ของ MySQL
    password: 'sunnaga2020',  // แก้เป็น password ของ MySQL
    database: 'saikaoyimschedule'
});

db.connect(err => {
    if (err) throw err;
    console.log('เชื่อมต่อฐานข้อมูลสำเร็จ!');
});


// API สำหรับเพิ่มข้อมูล
app.post('/add-area', (req, res) => {
    const { room, pass, description } = req.body;
    if (!room || !pass) {
        return res.status(400).json({ message: 'กรุณากรอกชื่อและนามสกุล' });
    }
    // if(date && room)
    console.log(room);

    const sql = 'INSERT INTO saikaoyimschedule.area (room, pass, description, date) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE pass = VALUES(pass), description = VALUES(description)';
    db.query(sql, [room, pass, description, date], (err, result) => {
        console.log(err)
        if (err) {
            console.error("SQL Error:", err); // เพิ่มบรรทัดนี้
            return res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.sqlMessage || err });
        }
        res.json({ message: 'เพิ่มข้อมูลสำเร็จ' });
    });
});

app.post('/add-roomone', (req, res) => {
    const { room, pass, description } = req.body;
    if (!room || !pass) {
        return res.status(400).json({ message: 'กรุณากรอกชื่อและนามสกุล' });
    }
    console.log(room);

    const sql = 'INSERT INTO saikaoyimschedule.roomone (room, pass, description, date) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE pass = VALUES(pass), description = VALUES(description)';
    db.query(sql, [room, pass, description, date], (err, result) => {
        console.log(err)
        if (err) {
            console.error("SQL Error:", err); // เพิ่มบรรทัดนี้
            return res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.sqlMessage || err });
        }
        res.json({ message: 'เพิ่มข้อมูลสำเร็จ' });
    });
});

app.post('/add-roomtwo', (req, res) => {
    const { room, pass, description } = req.body;
    if (!room || !pass) {
        return res.status(400).json({ message: 'กรุณากรอกชื่อและนามสกุล' });
    }
    console.log(room);

    const sql = 'INSERT INTO saikaoyimschedule.roomtwo (room, pass, description, date) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE pass = VALUES(pass), description = VALUES(description)';
    db.query(sql, [room, pass, description, date], (err, result) => {
        console.log(err)
        if (err) {
            console.error("SQL Error:", err); // เพิ่มบรรทัดนี้
            return res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.sqlMessage || err });
        }
        res.json({ message: 'เพิ่มข้อมูลสำเร็จ' });
    });
});

// 🔥 API ใหม่: ดึงรายชื่อทั้งหมดจากฐานข้อมูล
app.get('/area', (req, res) => {
    const sql = 'SELECT * FROM area order by room asc';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err });
        }
        res.json(results);
    });
});

app.get('/roomone', (req, res) => {
    const sql = 'SELECT * FROM roomone order by room asc';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err });
        }
        res.json(results);
    });
});

app.get('/roomtwo', (req, res) => {
    const sql = 'SELECT * FROM roomtwo order by room asc';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err });
        }
        res.json(results);
    });
});

app.get('/history', (req, res) => {
    const sql = `SELECT room, pass, description, date, 'area' AS source_table FROM area 
    UNION 
    SELECT room, pass, description, date, 'roomone' AS source_table FROM roomone 
    UNION 
    SELECT room, pass, description, date, 'roomtwo' AS source_table FROM roomtwo ORDER BY date ASC`;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err });
        }
        res.json(results);
    });
});

app.listen(3000, () => {
    console.log('Server เริ่มทำงานที่ http://localhost:3000');
});
