// Semua data menu ada di sini. Harga dalam ribuan rupiah (18 = Rp18.000).
// Foto cutout (latar transparan): assets/img/cut/<id>.webp
const CONFIG = {
  wa: "6285692061476",
  ig: "https://instagram.com/ayamgepuk.in",
  gofood: "https://gofood.link/a/P2vK1E",
  shopeefood: "https://shopee.co.id/universal-link/now-food/shop/20975254?deep_and_deferred=1&shareChannel=copy_link",
  maps: "https://maps.google.com/?q=Vida+Bumipala+Bekasi", // TODO link Maps asli
  open: 8,
  close: 22,
};

const MENU = {
  makanan: [
    { id: "ayam-gepuk", name: "Ayam Gepuk", desc: "Sambal bawang, lalapan, kremesan", paket: 19, ala: 14, variants: ["Dada", "Paha"], lead: true },
    { id: "lele-kriuk", name: "Lele Kriuk", desc: "Sambal bawang, lalapan, kremesan", paket: 16, ala: 11, tint: "kunyit" },
    { id: "kremes-bawang", name: "Kremes Bawang Putih", desc: "Ayam, sambal bawang, lalapan", paket: 18, ala: 13, tint: "daun" },
    { id: "kremes-ketumbar", name: "Kremes Ketumbar", desc: "Ayam, sambal bawang, lalapan", paket: 18, ala: 13, tint: "cabai" },
    { id: "telur-dadar", name: "Telur Dadar Cabe Rawit", desc: "Sambal bawang", paket: 12, ala: 7, tint: "kunyit" },
  ],
  pendamping: [
    { id: "tahu-ngebul", name: "Tahu Ngebul", desc: "Isi 4", price: 5, tint: "kunyit", float: true },
    { id: "tempe-selimut", name: "Tempe Selimut Daun Bawang", desc: "Isi 4", price: 5, tint: "daun", float: true },
  ],
  // foto: assets/img/menu/<id>.webp (nama dicetak otomatis di label kraft)
  sambal: [
    { id: "sambal-bawang", name: "Sambal Bawang Segar", short: "Bawang Segar", price: 30, note: "Yang sama dengan di piring kami" },
    { id: "sambal-cakalang", name: "Sambal Cakalang", short: "Cakalang", price: 35, note: "Pakai suwiran ikan cakalang" },
    { id: "sambal-cumi", name: "Sambal Cumi", short: "Cumi", price: 35, note: "Pakai potongan cumi" },
    { id: "sambal-ijo", name: "Sambal Ijo Royo-royo", short: "Ijo Royo-royo", price: 30, note: "Cabai hijau dan tomat hijau" },
    { id: "sambal-teri", name: "Sambal Teri", short: "Teri", price: 35, note: "Pakai teri goreng" },
  ],
  // Menu by request: harga dikonfirmasi lewat WhatsApp (price kosong). art = ilustrasi SVG di index.html (#art-<art>)
  byreq: [
    { id: "req-nasi-daun-jeruk", name: "Nasi Daun Jeruk", desc: "Nasi wangi daun jeruk, pas ditemani ayam gepuk dan sambal bawang.", art: "jeruk", tint: "daun" },
    { id: "req-nasi-kuning", name: "Nasi Kuning", desc: "Buat sarapan kantor, pengajian, atau syukuran. Lauknya bisa kamu pilih.", art: "kuning", tint: "kunyit" },
    { id: "req-tumpeng", name: "Tumpeng", desc: "Tumpeng nasi kuning atau nasi uduk, ukurannya menyesuaikan acara.", art: "tumpeng", tint: "kunyit" },
    { id: "req-nasi-liwet", name: "Nasi Liwet", desc: "Gurih, dimasak bareng teri. Enak disantap rame-rame.", art: "liwet", tint: "cabai" },
    { id: "req-catering", name: "Aneka Masakan Catering", desc: "Nasi box, ayam bakar, rendang, sayur, snack box, dan lainnya.", art: "box", tint: "cabai" },
  ],
  tepung: { id: "tepung", name: "Tepung Gepuk-in", desc: "Tepung bumbu serbaguna racikan Gepuk-In, 250gr. Celup, goreng, kriuk.", price: 7 },
  soon: [
    { id: "lem-kuning", name: "Lem Kuning", desc: "Lele bumbu kuning beku, tinggal goreng" },
    { id: "gepuk-frozen", name: "Ayam Gepuk Frozen", desc: "Ayam berbumbu beku buat stok di rumah" },
    { id: "tepung-marinasi", name: "Tepung Marinasi", desc: "Buat merendam bumbu sebelum digoreng" },
    { id: "ayam-lengkuas", name: "Ayam Goreng Lengkuas", desc: "Dengan serundeng lengkuas" },
  ],
};

// Lampu neon berjalan (paling atas). c = warna neon: merah | kuning | hijau. Status buka/tutup ditambahkan otomatis di depan.
const TICKER = {
  atas: [
    { label: "Jam buka", text: "tiap hari 08.00 sampai 22.00", c: "kuning" },
    { label: "Ayam Gepuk", text: "Rp14.000, pakai nasi Rp19.000", c: "merah" },
    { label: "Lele Kriuk", text: "Rp16.000 pakai nasi", c: "hijau" },
    { label: "Sambal 250gr", text: "5 varian, mulai Rp30.000", c: "merah" },
    { label: "Catering", text: "tanpa minimal order, pernah antar 90 porsi sekaligus", c: "kuning" },
    { label: "By request", text: "nasi kuning, tumpeng, nasi daun jeruk", c: "hijau" },
    { label: "Halal", text: "ID 32410030967601025", c: "kuning" },
  ],
};

// Dokumentasi pesanan (foto asli). tag = label kecil di pojok bingkai.
const DOK = [
  { src: "assets/img/doc/catering-90.jpg", tag: "90 porsi", cap: "Tim Gepuk-In di balik pesanan 90 porsi" },
  { src: "assets/img/doc/catering-50.jpg", tag: "50 porsi", cap: "Serah terima 50 porsi ke pemesan" },
  { src: "assets/img/doc/catering-70.jpg", tag: "70 porsi", cap: "70 porsi, bagasi sampai penuh" },
  { src: "assets/img/doc/catering-80.jpg", tag: "80 porsi", cap: "80 porsi diantar ke lokasi acara" },
  { src: "assets/img/doc/jumat-berkah.jpg", tag: "Jumat Berkah", cap: "Berbagi nasi box di Jumat Berkah" },
  { src: "assets/img/doc/pesanan-1.jpg", tag: "Pesan antar", cap: "Pesanan rumahan siap diantar" },
  { src: "assets/img/doc/pesanan-2.jpg", tag: "Pesan antar", cap: "Diantar langsung oleh tim kami" },
];
