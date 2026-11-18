# PRD | Website Ayam Gepuk-In

Versi 1.0 | 18 Nov 2026 | Lingkup: **front end saja** (HTML + CSS + JS murni, tanpa backend)

## 1. Ringkasan
Landing page satu halaman untuk UMKM **Ayam Gepuk-In** (sejak 2022, Vida Bumipala, Kota Bekasi). Tujuan utama: pengunjung melihat menu + harga dengan jelas lalu **pesan lewat WhatsApp** dalam sesedikit mungkin klik. Tagline: **"Gepuk-Nya Nagih!"**

## 2. Tujuan & metrik
| Tujuan | Metrik |
|---|---|
| Mendorong pesanan langsung | Klik tombol "Pesan via WA" (target: CTA terlihat di setiap layar) |
| Menjual sambal & tepung kemasan | Item sambal/tepung masuk keranjang |
| Menarik order catering | Klik CTA catering |
| Membangun kepercayaan | Label halal, testimoni, dokumentasi nyata terlihat sebelum menu habis di-scroll |

## 3. Target pengguna
1. **Warga sekitar Vida / Bekasi** (HP, buka dari bio IG) – mau lihat menu & harga, pesan cepat.
2. **Pemesan catering** (kantor, acara, Jumat Berkah) – butuh bukti kapasitas (50 sampai 90 porsi) & kontak.
3. **Pembeli oleh-oleh/stok** – sambal 250gr & tepung.

Mobile-first: ±85% trafik diasumsikan dari Instagram.

## 4. Referensi visual
- `Referensi.jpg`: latar putih, blob kuning + merah di belakang piring hero, headline sans tebal dua warna, kartu menu melayang dengan tombol panah.
- `Referensi 2.jpg`: pemisah section bergaya sapuan kuas, grid kartu foto 3 kolom, band fitur gambar + teks.
- Diadaptasi ke brand: **maroon #8E1B1F + kuning #F7B500 + krem #FFF6E6** (dari logo & feed IG), bukan merah generik.

## 5. Struktur halaman & kebutuhan fungsional
| # | Section | Isi | Kebutuhan |
|---|---|---|---|
| 1 | Navbar | Logo, link Menu, Sambal, Catering, Lokasi, tombol Pesan | Sticky; menu burger di mobile; badge jumlah keranjang |
| 2 | Hero | "Gepuk-Nya **Nagih!**", sub-copy, CTA Lihat Menu + Pesan WA, piring hero di atas blob | Chip melayang: Halal, Sejak 2022, Buka 08.00 sampai 22.00 |
| 3 | Keunggulan | 3 poin: Sambal Spesialis, Halal resmi, Nasi Ngebul | Ikon + teks singkat |
| 4 | Menu | Tab: Makanan, Pendamping; toggle **Paket Kenyang / Ala Carte** | Harga berganti saat toggle; tombol + masuk keranjang |
| 5 | Sambal & Tepung | Band brush maroon, 5 varian sambal 250gr + Tepung Gepuk-in | Tambah ke keranjang |
| 6 | Catering | Copy "menu by request, tanpa minimal order" + galeri 50/70/80/90 porsi | CTA WA dengan pesan template catering |
| 7 | Segera Hadir | Lem Kuning frozen, Ayam Gepuk frozen, Tepung Marinasi, Ayam Goreng Lengkuas | Kartu redup + label "Segera" |
| 8 | Testimoni | Om Aji, bintang 5 (satu-satunya testimoni nyata) | Tidak mengarang testimoni lain |
| 9 | Lokasi | Vida Cluster Durian + booth CFD Pasar Alam Vida, jam buka, status Buka/Tutup real-time | Tombol Maps |
| 10 | Pesan | WA, GoFood, ShopeeFood | Link GoFood/ShopeeFood/Maps = placeholder sampai dikirim |
| 11 | Footer | Logo, IG, WA, halal ID, © | |
| + | Keranjang | Drawer: daftar item, qty +/-, total, nama + catatan | "Kirim ke WhatsApp" membentuk pesan otomatis ke +62 856-9206-1476; disimpan di localStorage |

## 6. Data menu (sumber: Menu.txt, aturan nasi = +5K)
| Menu | Paket Kenyang | Ala Carte |
|---|---|---|
| Ayam Gepuk (+ sambal bawang, lalapan, kremesan) | 18K sampai 19K | 13K sampai 14K |
| Lele Kriuk | 16K | 11K |
| Ayam Kremes Bawang Putih | 18K | 13K |
| Ayam Kremes Ketumbar | 18K | 13K |
| Telur Dadar Cabe Rawit | 12K | 7K |

Pendamping: Tahu Ngebul 4pcs 5K, Tempe Selimut Daun Bawang 4pcs 5K.
Sambal 250gr: Bawang Segar 30K, Cakalang 35K, Cumi 35K, Ijo Royo-royo 30K, Teri 35K. Tepung Gepuk-in 250gr 7K.
Ayam Gepuk (harga rentang): di keranjang pilih **Dada / Paha**, dada = harga atas.

> Catatan: Menu.txt mencantumkan ala carte kremes 18K dan lele 16K (sama dengan paket). PRD memakai aturan "ala carte = paket − 5K" yang sudah dikonfirmasi sebelumnya. **Mohon dicek ulang.**

## 7. Kebutuhan non-fungsional
- Tanpa framework/build step; deploy statis (Vercel/Netlify).
- Lighthouse mobile ≥ 90; gambar dioptimasi, `loading="lazy"`.
- Aksesibel: kontras AA, fokus keyboard terlihat, `prefers-reduced-motion` dihormati.
- Data menu terpusat di `js/data.js` agar mudah diubah tanpa menyentuh HTML.
- Foto menu: slot `assets/img/menu/<id>.jpg`; bila belum ada, tampil ilustrasi piring placeholder otomatis.
- Separator teks di layar memakai " | ".

## 8. Di luar lingkup (v1)
Backend, pembayaran online, login, admin panel, CMS.

## 9. Aset yang masih ditunggu
- Foto produk GPT (lihat PROMPT-GAMBAR-GPT.md di folder proyek lama), simpan sebagai `assets/img/menu/<id>.jpg` (id ada di `js/data.js`).
- Link GoFood, ShopeeFood, Google Maps.
