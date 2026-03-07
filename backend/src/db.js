const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Fungsi untuk menginisialisasi database dengan retry
const initDB = async () => {
    let retries = 5;
    while (retries > 0) {
        try {
            // Coba koneksi ke database
            const client = await pool.connect();
            console.log('Koneksi ke database berhasil!');
            client.release(); // Lepaskan koneksi kembali ke pool
            return; // Keluar dari fungsi jika berhasil
        } catch (err) {
            console.error(`Gagal menginisialisasi database. Sisa percobaan: ${retries - 1}`, err.message);
            retries -= 1;
            // Tunggu 2 detik sebelum mencoba lagi
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    // Jika semua percobaan gagal
    throw new Error('Gagal terhubung ke database setelah beberapa percobaan.');
};

module.exports = {
    query: (text, params) => pool.query(text, params),
    initDB,
};
