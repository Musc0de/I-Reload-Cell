// Import paket yang diperlukan
const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const flash = require('connect-flash');
const getClientIp = require('request-ip').getClientIp;
const Swal = require('sweetalert2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// Tambahkan perintah USE untuk memilih database
db.query('USE db_reload', (err, result) => {
    if (err) {
        console.error('Error selecting database:', err);
        return;
    }
    console.log('Database selected');
});

module.exports = db;
// Inisialisasi aplikasi Express
const app = express();

// Konfigurasi sesi
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

// Set pengaturan untuk menggunakan EJS sebagai view engine
app.set('view engine', 'ejs');

// Middleware untuk menangani body request
app.use(express.urlencoded({ extended: true }));

// Middleware untuk mengatur asset statis (CSS, JS, dll)
app.use(express.static('public'));

app.use(flash());



// Route untuk halaman register (GET)
app.get('/register', (req, res) => {
    res.render('register');
});

// Route untuk proses registrasi (POST)
app.post('/register', (req, res) => {
    const { username, email, phone, address, password } = req.body;

    // Simpan data pengguna ke dalam database
    const sql = 'INSERT INTO user (username, email, phone, address, password) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [username, email, phone, address, password], (err, result) => {
        if (err) {
            console.error(err);
            res.send('Registrasi gagal.');
        } else {
            res.send('Registrasi berhasil.');
        }
    });
});


// Route untuk halaman login (GET)
app.get('/login', (req, res) => {
    res.render('login', { success_msg: req.flash('success_msg'), error_msg: req.flash('error_msg') });
});

// Route untuk halaman login (GET)
app.get('/login', (req, res) => {
    res.render('login', { 
        success_msg: req.flash('success_msg')[0] || '', // Mengambil pesan pertama dari array pesan sukses (jika ada), jika tidak ada, maka gunakan string kosong
        error_msg: req.flash('error_msg')[0] || '' // Mengambil pesan pertama dari array pesan error (jika ada), jika tidak ada, maka gunakan string kosong
    });
});

// Route untuk proses login (POST)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Query untuk mendapatkan data pengguna dari database
    const sql = 'SELECT * FROM user WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error(err);
            res.send('Terjadi kesalahan saat mencoba untuk masuk.');
        } else {
            if (results.length > 0) {
                // Pengguna ditemukan
                const user = results[0];
                if (password === user.password) {
                    // Password cocok, tandai pengguna sebagai sudah login
                    req.session.isLoggedIn = true;

                    // Mendapatkan alamat IP pengguna
                    const ipAddress = getClientIp(req);

                    // Simpan informasi aktivitas login ke dalam tabel activity
                    const loginTime = new Date().toISOString();
                    const activitySql = 'INSERT INTO activity (username, last_login) VALUES (?, ?) ON DUPLICATE KEY UPDATE last_login = ?';
                    db.query(activitySql, [user.username, loginTime, loginTime], (err, result) => {
                        if (err) {
                            console.error(err);
                            res.send('Terjadi kesalahan saat menyimpan aktivitas login.');
                        } else {
                            req.flash('success', 'Login berhasil!');
                            res.redirect('/dashboard');
                        }
                    });
                } else {
                    // Password tidak cocok
                    req.flash('error', 'Password salah. Coba lagi.');
                    res.render('login', { error_msg: 'Password salah. Coba lagi.' });
                }
            } else {
                // Pengguna tidak ditemukan
                req.flash('error', 'Username tidak ditemukan.');
                res.render('login', { error_msg: 'Username tidak ditemukan.' });
            }
        }
    });

    // Menampilkan pesan flash dengan SweetAlert2
    const flashMessages = req.flash();
    Object.keys(flashMessages).forEach((type) => {
        flashMessages[type].forEach((message) => {
            Swal.fire({
                icon: type === 'success' ? 'success' : 'error',
                title: type.toUpperCase(),
                text: message,
                timer: 5000 // Hapus setelah 5 detik
            });
        });
    });
});




// Middleware untuk memeriksa apakah pengguna sudah login
const checkLoggedIn = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();
    } else {
        res.redirect('/');
    }
};



































// Route untuk dasbor
app.get('/dashboard', checkLoggedIn, (req, res) => {
    res.render('dashboard');
});

// Route untuk halaman tentang
app.get('/about', (req, res) => {
    res.render('about');
});

// Route untuk halaman hubungi kami
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Route untuk halaman beranda
app.get('/', (req, res) => {
    res.render('index');
});

// Mulai server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
