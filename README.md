<div align="center">

<img src="assets/img/logo.png" alt="Logo Ayam Gepuk-In" width="140">

# Ayam Gepuk-In

### *Gepuk-Nya Nagih!* 🌶️

Landing page interaktif untuk UMKM kuliner **Ayam Gepuk-In** (sejak 2022) di Vida Bumipala, Kota Bekasi.
Pengunjung bisa lihat menu, isi keranjang, lalu **pesan langsung lewat WhatsApp**.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![No Framework](https://img.shields.io/badge/No_Framework-Vanilla-8E1B1F?style=for-the-badge)
![Mobile First](https://img.shields.io/badge/Mobile-First-F7B500?style=for-the-badge)

<img src="assets/img/cut/ayam-gepuk.webp" alt="Ayam Gepuk" width="420">

</div>

---

## ✨ Fitur Utama

| | Fitur | Keterangan |
|---|---|---|
| 🛒 | **Keranjang belanja** | Tambah/kurangi item, total otomatis, tersimpan di `localStorage` |
| 💬 | **Checkout ke WhatsApp** | Isi keranjang + nama + catatan otomatis jadi pesan WA siap kirim |
| 🍗 | **Toggle Paket / Ala Carte** | Harga menu langsung berganti sesuai pilihan |
| 🌶️ | **Sambal & Tepung kemasan** | 5 varian sambal 250gr + Tepung Gepuk-in |
| 🎉 | **Catering** | Galeri bukti pesanan 50 sampai 90 porsi + CTA WA dengan template pesan |
| 🕒 | **Status Buka/Tutup real-time** | Dihitung dari jam operasional 08.00 sampai 22.00 |
| 🎵 | **Musik latar** | Bisa dinyalakan/dimatikan pengunjung |
| 🎞️ | **Animasi scroll** | Elemen muncul halus memakai `IntersectionObserver` |
| 📱 | **Responsif** | Didesain mobile-first, karena kebanyakan trafik datang dari Instagram |
| ✅ | **Label Halal** | Logo halal resmi untuk membangun kepercayaan |

## 🍽️ Menu

<div align="center">

| <img src="assets/img/cut/ayam-gepuk.webp" width="140"><br>**Ayam Gepuk** | <img src="assets/img/cut/lele-kriuk.webp" width="140"><br>**Lele Kriuk** | <img src="assets/img/cut/kremes-bawang.webp" width="140"><br>**Kremes Bawang** | <img src="assets/img/cut/kremes-ketumbar.webp" width="140"><br>**Kremes Ketumbar** |
|:---:|:---:|:---:|:---:|
| <img src="assets/img/cut/telur-dadar.webp" width="140"><br>**Telur Dadar Cabe Rawit** | <img src="assets/img/cut/tahu-ngebul.webp" width="140"><br>**Tahu Ngebul** | <img src="assets/img/cut/tempe-selimut.webp" width="140"><br>**Tempe Selimut** | <img src="assets/img/cut/tepung.webp" width="140"><br>**Tepung Gepuk-in** |

**Sambal 250gr**

| <img src="assets/img/cut/sambal-bawang.webp" width="110"><br>Bawang Segar | <img src="assets/img/cut/sambal-cakalang.webp" width="110"><br>Cakalang | <img src="assets/img/cut/sambal-cumi.webp" width="110"><br>Cumi | <img src="assets/img/cut/sambal-ijo.webp" width="110"><br>Ijo Royo-royo | <img src="assets/img/cut/sambal-teri.webp" width="110"><br>Teri |
|:---:|:---:|:---:|:---:|:---:|

</div>

## 📸 Dokumentasi Catering

<div align="center">
<img src="assets/img/doc/catering-50.jpg" width="200">
<img src="assets/img/doc/catering-70.jpg" width="200">
<img src="assets/img/doc/catering-80.jpg" width="200">
<img src="assets/img/doc/catering-90.jpg" width="200">
</div>

## 🎨 Identitas Visual

| Warna | Hex | Peran |
|---|---|---|
| ![](https://img.shields.io/badge/-%20%20%20%20%20-8E1B1F?style=flat-square) Maroon | `#8E1B1F` | Warna utama brand |
| ![](https://img.shields.io/badge/-%20%20%20%20%20-F7B500?style=flat-square) Kuning | `#F7B500` | Aksen dan CTA |
| ![](https://img.shields.io/badge/-%20%20%20%20%20-FFF6E6?style=flat-square) Krem | `#FFF6E6` | Latar hangat |

Palet warna diambil dari logo dan feed Instagram Ayam Gepuk-In.

## 🗂️ Struktur Proyek

```
AyamGepuk-Web/
├── index.html          # Halaman utama (satu halaman)
├── css/
│   └── style.css       # Seluruh styling + animasi
├── js/
│   ├── data.js         # Data menu, harga, sambal, produk "Segera Hadir"
│   └── main.js         # Keranjang, checkout WA, toggle harga, status buka, animasi
├── assets/
│   ├── img/            # Logo, foto menu (webp), dokumentasi
│   └── lagu/           # Musik latar
└── PRD.md              # Dokumen kebutuhan produk
```

## 🚀 Cara Menjalankan

Tidak perlu install apa pun karena proyek ini memakai HTML, CSS, dan JS murni.

```bash
git clone https://github.com/Naufal-Ghani22/AyamGepuk-Web.git
cd AyamGepuk-Web
# buka index.html langsung di browser, atau jalankan server lokal:
npx serve .
```

> 💡 Untuk mengubah menu atau harga, cukup edit `js/data.js`.

## 📄 Dokumentasi

Kebutuhan produk lengkap (tujuan, target pengguna, struktur section, data menu) ada di [`PRD.md`](PRD.md).

---

<div align="center">

📍 **Vida Bumipala, Kota Bekasi** · 🕗 Buka 08.00 sampai 22.00

Dibuat dengan ❤️ dan 🌶️ untuk **Ayam Gepuk-In**

</div>
