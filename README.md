Risa AI Assistan

Asisten AI pribadi milik Rivaldo. Sebuah chatbot cerdas yang dibangun menggunakan Puter.js dan Google Gemini, dirancang untuk memberikan pengalaman interaksi yang modern, responsif, dan profesional.

Fitur

Chat interaktif dengan Risa yang mampu menjawab pertanyaan seputar profil, portofolio, dan proyek Rivaldo. Mode gelap yang dapat diaktifkan melalui tombol toggle dan tersimpan secara otomatis di localStorage. Tampilan responsif yang mendukung tata letak layar terbagi pada desktop dan tampilan penuh pada perangkat mobile. Animasi modern yang halus menggunakan Motion React untuk pengalaman pengguna yang lebih hidup. Dua tab utama yaitu Chat untuk percakapan dan Riwayat untuk melihat pesan terakhir yang telah dikirim.

Struktur Proyek

Risa-Asisten-AI-Rivaldo/
  rapi/
    public/
    src/
      App.jsx        Komponen utama aplikasi React
      index.css      Seluruh styling menggunakan CSS variables
      main.jsx       Entry point aplikasi
    index.html       Berkas HTML utama
    package.json     Daftar dependensi frontend
    vite.config.js   Konfigurasi Vite bundler
  server.js          Backend Express opsional
  package.json       Daftar dependensi root
  vercel.json        Konfigurasi deployment Vercel

Teknologi yang Digunakan

Frontend dibangun dengan React dan Vite sebagai bundler cepat. Styling menggunakan CSS murni dengan CSS variables untuk mendukung tema terang dan gelap. Animasi ditangani oleh Motion React untuk transisi yang halus. Integrasi AI menggunakan Puter.js SDK yang terhubung ke model Google Gemini. Backend opsional menggunakan Express.js untuk kebutuhan tambahan.

Persyaratan Sistem

Node.js versi 18 atau lebih baru. NPM atau Yarn sebagai package manager. Koneksi internet untuk mengakses layanan Puter.js dan Google Gemini.

Cara Menjalankan

Clone repositori ini ke dalam direktori lokal. Buka terminal dan arahkan ke direktori rapi. Jalankan perintah npm install untuk menginstal seluruh dependensi frontend. Setelah selesai, jalankan npm run dev untuk memulai server pengembangan Vite. Aplikasi akan berjalan di alamat localhost yang ditampilkan di terminal.

Untuk menjalankan backend Express, kembali ke direktori utama dan jalankan node server.js. Pastikan telah mengonfigurasi variabel lingkungan yang diperlukan.

Deployment

Proyek ini telah dikonfigurasi untuk deployment ke Vercel melalui berkas vercel.json. Cukup hubungkan repositori GitHub ke Vercel dan lakukan deployment secara otomatis.

Lisensi

Proyek ini dikembangkan oleh Rivaldo untuk keperluan portofolio dan pembelajaran.

Kontak

Portfolio: github.com/Yourdevelover/PortfolioRivaldo