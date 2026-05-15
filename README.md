# TeBuDi (Tempat Buku Digital)
**TeBuDi** adalah platform perpustakaan digital berbasis langganan yang dirancang untuk memberikan akses membaca buku berkualitas dengan pengalaman pengguna yang modern. Proyek ini dikembangkan sebagai tugas akhir (**UAS**) untuk mata kuliah **Praktikum Pengembangan Perangkat Lunak Berorientasi Objek (PPPLBO)**, Teknik Informatika, Universitas Sriwijaya.

---

## Profil Tim Pengembang
Proyek ini dikerjakan secara kolaboratif oleh Kelompok Array Of Us:

1. **Bimo Abdul Aziz** - [Lead Developer / Fullstack]
2. **Ahmad Rafly** - [Fullstack]
3. **M. Alfarizi Aziz** - [Fullstack]
4. **Muhammad Khalifa Buana** - [Frontend Engineer]
5. **Andrean Daud Marojahan Siregar** - [Backend Engineer]
6. **M. Ian Wijaya** - [Frontend Engineer]

---

## Fitur Utama
Aplikasi ini memisahkan peran antara **Member** dan **Admin** dengan fitur-fitur berikut:

### Fitur Member
* **Autentikasi & Profil:** Registrasi, login berbasis session, dan manajemen profil mandiri.
* **Katalog Buku:** Menjelajahi berbagai koleksi buku berdasarkan kategori (Gratis/Premium).
* **Pencarian Pintar:** Mencari buku berdasarkan judul, penulis, atau kategori secara real-time.
* **Sistem Langganan:** Upgrade akun ke paket premium untuk mengakses konten eksklusif.
* **PDF Reader:** Membaca buku langsung di browser dengan fitur *Auto-Save Progress* (melanjutkan halaman terakhir).
* **Favorit:** Menyimpan daftar buku yang disukai ke halaman favorit.

### Fitur Admin (Dashboard Manajemen)
* **Manajemen Buku:** Tambah, edit, hapus, dan upload file PDF buku ke server.
* **Manajemen Kategori:** Mengatur klasifikasi kategori buku.
* **Manajemen Paket:** Mengelola harga dan durasi paket langganan premium.

---

## Teknologi yang Digunakan

### Backend (Server)
* **Java 25** & **Spring Boot 3.4.x**
* **Spring Security:** Autentikasi berbasis Session & proteksi API.
* **Spring Data JPA:** Abstraksi database menggunakan Hibernate.
* **MySQL:** Penyimpanan data relasional.
* **Maven:** Manajemen dependensi.

### Frontend (Client)
* **React.js** (Vite sebagai build tool).
* **Tailwind CSS:** Styling antarmuka yang responsif dan modern.
* **Lucide React:** Set ikon vektor yang konsisten.
* **React PDF Viewer:** Komponen untuk merender dokumen PDF di browser.
* **Axios:** Komunikasi data dengan REST API Backend.
```bash
# Gunakan maven wrapper untuk menjalankan aplikasi
./mvnw spring-boot:run
