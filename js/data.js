// Semua data menu ada di sini. Harga dalam ribuan rupiah (18 = Rp18.000).
// Foto cutout (latar transparan): assets/img/cut/<id>.webp
const CONFIG = {
  wa: "6285692061476",
  ig: "https://instagram.com/ayamgepuk.in",
  gofood: "#", // TODO link GoFood
  shopeefood: "#", // TODO link ShopeeFood
  maps: "https://maps.google.com/?q=Vida+Bumipala+Bekasi", // TODO link Maps asli
  open: 8,
  close: 22,
};

const MENU = {
  makanan: [
    { id: "ayam-gepuk", name: "Ayam Gepuk", desc: "Sambal bawang, lalapan, kremesan", paket: [18, 19], ala: [13, 14], variants: ["Dada", "Paha"], lead: true },
    { id: "lele-kriuk", name: "Lele Kriuk", desc: "Sambal bawang, lalapan, kremesan", paket: 16, ala: 11, tint: "kunyit" },
    { id: "kremes-bawang", name: "Kremes Bawang Putih", desc: "Ayam, sambal bawang, lalapan", paket: 18, ala: 13, tint: "daun" },
    { id: "kremes-ketumbar", name: "Kremes Ketumbar", desc: "Ayam, sambal bawang, lalapan", paket: 18, ala: 13, tint: "cabai" },
    { id: "telur-dadar", name: "Telur Dadar Cabe Rawit", desc: "Sambal bawang", paket: 12, ala: 7, tint: "kunyit" },
  ],
  pendamping: [
    { id: "tahu-ngebul", name: "Tahu Ngebul", desc: "Isi 4", price: 5, tint: "kunyit", float: true },
    { id: "tempe-selimut", name: "Tempe Selimut Daun Bawang", desc: "Isi 4", price: 5, tint: "daun", float: true },
  ],
  // label = posisi stiker kraft kosong di foto toples (persen dari lebar/tinggi foto)
  sambal: [
    { id: "sambal-bawang", name: "Sambal Bawang Segar", short: "Bawang Segar", price: 30, note: "Yang sama dengan di piring kami", label: { x: 26, y: 29, w: 48, h: 35 } },
    { id: "sambal-cakalang", name: "Sambal Cakalang", short: "Cakalang", price: 35, note: "Pakai suwiran ikan cakalang", label: { x: 1, y: 47, w: 96, h: 49 } },
    { id: "sambal-cumi", name: "Sambal Cumi", short: "Cumi", price: 35, note: "Pakai potongan cumi", label: { x: 29.6, y: 31.9, w: 45, h: 34 } },
    { id: "sambal-ijo", name: "Sambal Ijo Royo-royo", short: "Ijo Royo-royo", price: 30, note: "Cabai hijau dan tomat hijau", label: { x: 30, y: 31, w: 46, h: 34 } },
    { id: "sambal-teri", name: "Sambal Teri", short: "Teri", price: 35, note: "Pakai teri goreng", label: { x: 1, y: 40.8, w: 62, h: 44.6 } },
  ],
  tepung: { id: "tepung", name: "Tepung Gepuk-in", desc: "Tepung bumbu serbaguna racikan Gepuk-In, 250gr. Celup, goreng, kriuk.", price: 7 },
  soon: [
    { id: "lem-kuning", name: "Lem Kuning", desc: "Lele bumbu kuning beku, tinggal goreng" },
    { id: "gepuk-frozen", name: "Ayam Gepuk Frozen", desc: "Ayam berbumbu beku buat stok di rumah" },
    { id: "tepung-marinasi", name: "Tepung Marinasi", desc: "Buat merendam bumbu sebelum digoreng" },
    { id: "ayam-lengkuas", name: "Ayam Goreng Lengkuas", desc: "Dengan serundeng lengkuas" },
  ],
};
