(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rp = (k) => "Rp" + (k * 1000).toLocaleString("id-ID");
  const waUrl = (t) => `https://wa.me/${CONFIG.wa}?text=${encodeURIComponent(t)}`;
  const cut = (id) => `assets/img/cut/${id}.webp?v=4`; // ?v= naikkan tiap kali foto diganti (hindari cache lama)
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const rand = (a, b) => a + Math.random() * (b - a);

  // ---------- link statis
  $$("[data-wa]").forEach((a) => (a.href = waUrl(a.dataset.wa)));
  $("#mapsLink").href = CONFIG.maps;
  $("#goLink").href = $("#goLink2").href = CONFIG.gofood;
  $("#spLink").href = $("#spLink2").href = CONFIG.shopeefood;
  $("#igLink").href = CONFIG.ig;
  $("#yr").textContent = new Date().getFullYear();

  // ---------- data helper
  let mode = "paket", tab = "makanan";
  const all = [...MENU.makanan, ...MENU.pendamping, ...MENU.sambal, MENU.tepung];
  const itemOf = (id) => all.find((m) => m.id === id);
  const isMain = (m) => MENU.makanan.includes(m);
  const priceOf = (m, v = 0) => { const p = m.price ?? m[mode]; return Array.isArray(p) ? p[v] : p; };
  const descOf = (m) => (isMain(m) && mode === "paket" ? `Nasi ngebul, ${m.desc.toLowerCase()}` : m.desc);

  // ---------- HERO: mini game gepuk 10 detik
  const stage = $("#stage"), plate = $("#plate"), pestle = $("#pestle"), crumbs = $("#crumbs");
  const title = $("#heroTitle"), hint = $("#hitHint");
  const bubble = $("#bubble"), bubbleText = $("#bubbleText");
  const game = $("#game"), gTime = $("#gTime"), gScore = $("#gScore"), gBest = $("#gBest"), gRing = $("#gRing");
  const colors = ["#e4321b", "#e4321b", "#f2b04a", "#d98a2b", "#fff4dc", "#3f8f3a"];
  const words = ["Gepuk!", "Duk!", "Buk!", "Gepuk!"];
  const DUR = 10000, RING = 2 * Math.PI * 19;
  let state = "idle", score = 0, best = 0, t0 = 0, raf = 0;
  try { best = +localStorage.getItem("agi-best") || 0; } catch {}
  gBest.textContent = best;
  gRing.style.strokeDasharray = RING;

  const setTime = (ms) => {
    const left = Math.max(0, ms);
    gTime.textContent = (left / 1000).toFixed(1);
    gRing.style.strokeDashoffset = RING * (1 - left / DUR);
    game.classList.toggle("hurry", state === "play" && left < 3000);
  };
  const tick = () => {
    const left = DUR - (performance.now() - t0);
    setTime(left);
    if (left <= 0) return finish();
    raf = requestAnimationFrame(tick);
  };
  const start = () => {
    state = "play"; score = 0; t0 = performance.now();
    game.dataset.state = "play";
    bubble.hidden = true;
    hint.classList.add("gone");
    raf = requestAnimationFrame(tick);
  };
  const finish = () => {
    cancelAnimationFrame(raf);
    state = "done"; game.dataset.state = "done";
    setTime(0);
    const prev = best, record = score > best;
    if (record) {
      best = score; gBest.textContent = best;
      try { localStorage.setItem("agi-best", best); } catch {}
      gBest.parentElement.classList.add("new");
    }
    const ps = (score / (DUR / 1000)).toFixed(1);
    bubbleText.innerHTML = record
      ? `<b class="bubble__big">Rekor baru! ${score} gepukan</b>${prev ? `Mengalahkan rekor sebelumnya, ${prev}.` : "Rekor pertama tercatat."} Rata-rata ${ps} gepukan per detik.`
      : `<b class="bubble__big">Waktu habis! ${score} gepukan</b>Rekornya ${best}. ${score === best ? "Seri, tipis banget!" : `Kurang ${best - score} lagi buat jadi juara.`}`;
    bubble.hidden = false;
    if (!calm && record) burst(stage.offsetWidth / 2, stage.offsetHeight * 0.45, 60, "Juara!");
  };
  const reset = () => {
    cancelAnimationFrame(raf);
    state = "idle"; score = 0; game.dataset.state = "idle";
    gScore.textContent = 0;
    setTime(DUR);
    gBest.parentElement.classList.remove("new");
    bubble.hidden = true;
    hint.classList.remove("gone");
  };
  setTime(DUR);

  const place = (el, x, y) => { el.style.left = x + "px"; el.style.top = y + "px"; };
  const local = (cx, cy) => { const r = stage.getBoundingClientRect(); return [cx - r.left, cy - r.top]; };

  if (fine) {
    stage.addEventListener("pointermove", (e) => {
      const [x, y] = local(e.clientX, e.clientY);
      place(pestle, x, y);
      stage.classList.toggle("aiming", !!e.target.closest("#plate"));
    });
    stage.addEventListener("pointerleave", () => stage.classList.remove("aiming"));
  }

  const burst = (x, y, n, word) => {
    for (let i = 0; i < n; i++) {
      const c = document.createElement("i");
      const s = rand(5, 13);
      c.style.cssText = `left:${x}px;top:${y}px;width:${s}px;height:${s * rand(0.6, 1)}px;background:${colors[i % colors.length]}`;
      crumbs.append(c);
      const a = rand(-Math.PI, 0), d = rand(50, n > 20 ? 240 : 150), dx = Math.cos(a) * d, dy = Math.sin(a) * d, r = rand(-260, 260);
      c.animate(
        [{ transform: "translate(-50%,-50%)" }, { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${r}deg)`, offset: 0.4 }, { transform: `translate(calc(-50% + ${dx * 1.4}px), calc(-50% + ${dy + 140}px)) rotate(${r * 2}deg)`, opacity: 0 }],
        { duration: rand(650, 1000), easing: "cubic-bezier(.2,.6,.4,1)" }
      ).onfinish = () => c.remove();
    }
    const w = document.createElement("b");
    w.className = "pow";
    w.textContent = word;
    w.style.cssText = `left:${x + rand(-30, 30)}px;top:${y - rand(50, 80)}px;--r:${rand(-14, 14)}deg`;
    crumbs.append(w);
    w.animate(
      [{ transform: "translate(-50%,-50%) rotate(var(--r)) scale(.3)", opacity: 0 }, { transform: "translate(-50%,-50%) rotate(var(--r)) scale(1.15)", opacity: 1, offset: 0.25 }, { transform: "translate(-50%,-80%) rotate(var(--r)) scale(1)", opacity: 0 }],
      { duration: 700, easing: "ease-out" }
    ).onfinish = () => w.remove();
  };

  const hit = (cx, cy) => {
    if (state === "done") {
      game.animate([{ translate: "-50% 0" }, { translate: "calc(-50% - 6px) 0" }, { translate: "calc(-50% + 6px) 0" }, { translate: "-50% 0" }], { duration: 260 });
      return;
    }
    if (state === "idle") start();
    const [x, y] = local(cx, cy);
    score++;
    gScore.textContent = score;
    place(pestle, x, y);
    navigator.vibrate?.(12);
    if (calm) return;
    pestle.classList.add("show");
    clearTimeout(pestle._t);
    pestle._t = setTimeout(() => !stage.classList.contains("aiming") && pestle.classList.remove("show"), 500);
    $("svg", pestle).animate(
      [{ transform: "translateY(-38px) rotate(-22deg)" }, { transform: "translateY(4px) rotate(-6deg)", offset: 0.28 }, { transform: "translateY(-38px) rotate(-22deg)" }],
      { duration: 220, easing: "cubic-bezier(.3,.7,.4,1)" }
    );
    $("img", plate).animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.035, .93)", offset: 0.3 }, { transform: "scale(.99, 1.02)", offset: 0.6 }, { transform: "scale(1)" }],
      { duration: 300, easing: "ease-out" }
    );
    title.animate([{ transform: "none" }, { transform: "scale(1.02, .9)", offset: 0.3 }, { transform: "none" }], { duration: 260, easing: "ease-out" });
    gScore.animate([{ transform: "scale(1.35)" }, { transform: "scale(1)" }], { duration: 200 });
    burst(x, y, 12, best > 0 && score === best + 1 ? "Rekor!" : words[score % words.length]);
  };

  plate.addEventListener("pointerdown", (e) => { if (e.button === 0) hit(e.clientX, e.clientY); });
  plate.addEventListener("click", (e) => {
    if (e.detail !== 0) return; // keyboard: Enter / Space
    const r = plate.getBoundingClientRect();
    hit(r.left + r.width * rand(0.4, 0.7), r.top + r.height * rand(0.45, 0.65));
  });
  $("#gReset").addEventListener("click", reset);
  $("#againBtn").addEventListener("click", () => { reset(); plate.focus({ preventScroll: true }); });
  $("#bubbleBtn").addEventListener("click", () => {
    const m = MENU.makanan[0];
    addCart(`${m.name} Dada, pakai nasi`, Array.isArray(m.paket) ? m.paket[0] : m.paket);
    bubble.hidden = true;
    setCart(true);
  });

  // stempel berputar mengikuti scroll
  const stamp = $(".stamp");
  if (!calm) addEventListener("scroll", () => (stamp.style.rotate = scrollY * 0.25 + "deg"), { passive: true });

  // ---------- MENU
  const grid = $("#menuGrid");
  const dish = (m) => {
    const variants = m.variants
      ? `<div class="var" role="group" aria-label="Pilih bagian ayam">${m.variants.map((v, j) => `<button class="${j ? "" : "is-on"}" data-v="${j}" aria-pressed="${!j}">${v}</button>`).join("")}</div>` : "";
    return `<article class="dish ${m.lead ? "dish--lead" : `tint--${m.tint}`}${m.float ? " dish--float" : ""}" data-id="${m.id}">
      <div class="dish__text">
        ${m.lead ? `<span class="dish__tag">Andalan kami</span>` : ""}
        <h3>${m.name}</h3>
        <p class="dish__desc">${descOf(m)}</p>
        ${variants}
        <div class="dish__buy"><b class="price"></b><button class="add" aria-label="Tambah ${m.name} ke pesanan">Tambah</button></div>
      </div>
      <div class="dish__img"><img src="${cut(m.id)}" alt="${m.name}" loading="lazy"></div>
    </article>`;
  };
  const curVar = (c) => +($(".var .is-on", c)?.dataset.v ?? 0);
  const updatePrice = (c) => ($(".price", c).textContent = rp(priceOf(itemOf(c.dataset.id), curVar(c))));
  // ilustrasi kartu by request, kuncinya = field "art" di data.js
  const sh = `<ellipse cx="80" cy="103" rx="58" ry="6" fill="rgba(0,0,0,.12)"/>`;
  const ART = {
    jeruk: `${sh}<path d="M34 58c0-34 92-34 92 0z" fill="#fff9ef"/><path d="M22 58h116a58 42 0 0 1-116 0z" fill="#7a1418"/><ellipse cx="80" cy="58" rx="58" ry="8" fill="#9e2328"/><ellipse cx="62" cy="36" rx="14" ry="5" transform="rotate(-25 62 36)" fill="#2f8f46"/><ellipse cx="98" cy="34" rx="13" ry="5" transform="rotate(20 98 34)" fill="#4aa45c"/><circle cx="80" cy="30" r="5" fill="#e4321b"/>`,
    kuning: `${sh}<path d="M8 86Q80 50 152 86Q80 116 8 86z" fill="#2f8f46"/><path d="M20 86Q80 60 140 86" stroke="#4aa45c" stroke-width="3" fill="none"/><path d="M42 88c0-46 76-46 76 0z" fill="#ffb703"/><ellipse cx="66" cy="62" rx="10" ry="6" fill="#ffd25a"/><ellipse cx="118" cy="90" rx="17" ry="10" fill="#fff"/><circle cx="118" cy="90" r="5.5" fill="#ffb703"/><circle cx="40" cy="92" r="8" fill="#9ccf6a"/><circle cx="40" cy="92" r="4" fill="#dff3c8"/><circle cx="96" cy="50" r="4" fill="#e4321b"/>`,
    tumpeng: `${sh}<ellipse cx="80" cy="94" rx="64" ry="12" fill="#2f8f46"/><path d="M80 12 116 90H44z" fill="#ffb703" stroke="#ffb703" stroke-width="8" stroke-linejoin="round"/><path d="M80 16 70 40" stroke="#ffd25a" stroke-width="5" stroke-linecap="round"/><path d="M78 6c4-4 10-4 12 0-4 2-8 4-12 0z" fill="#e4321b"/><circle cx="34" cy="92" r="8" fill="#7a1418"/><circle cx="126" cy="92" r="8" fill="#fff"/><circle cx="126" cy="92" r="3.5" fill="#ffb703"/><ellipse cx="56" cy="98" rx="9" ry="4" fill="#d98a2b"/><ellipse cx="104" cy="98" rx="9" ry="4" fill="#e4321b"/>`,
    liwet: `${sh}<rect x="14" y="56" width="16" height="8" rx="4" fill="#1e1714"/><rect x="130" y="56" width="16" height="8" rx="4" fill="#1e1714"/><path d="M28 52h104v32a14 14 0 0 1-14 14H42a14 14 0 0 1-14-14z" fill="#2b2421"/><ellipse cx="80" cy="52" rx="52" ry="10" fill="#fff9ef"/><g stroke="#a07850" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M56 50q4-3 8 0"/><path d="M84 54q4-3 8 0"/><path d="M98 48q4-3 8 0"/><path d="M68 56q4-3 8 0"/></g><ellipse cx="74" cy="47" rx="6" ry="3" fill="#3f8f3a"/><ellipse cx="108" cy="54" rx="6" ry="3" fill="#3f8f3a"/><circle cx="60" cy="56" r="3" fill="#e4321b"/><path d="M60 72h40" stroke="#4a3c36" stroke-width="3" stroke-linecap="round"/>`,
    box: `${sh}<path d="M24 46h112l-8 52H32z" fill="#e9c79a"/><path d="M24 46h112l-6-18H30z" fill="#f6dfb8"/><path d="M30 50h100l-6 42H36z" fill="#fff"/><path d="M80 50v42M80 70h46" stroke="#e9c79a" stroke-width="3"/><path d="M38 86c0-26 38-26 38 0z" fill="#fff9ef" stroke="#eedfc9" stroke-width="2"/><ellipse cx="102" cy="61" rx="17" ry="7" fill="#c0601c"/><ellipse cx="96" cy="59" rx="6" ry="2" fill="#e88a3c"/><circle cx="92" cy="82" r="6" fill="#e4321b"/><ellipse cx="112" cy="82" rx="9" ry="5" fill="#3f8f3a"/>`,
  };
  const art = (k) => `<svg class="req__art" viewBox="0 0 160 110" aria-hidden="true">${ART[k] || ART.jeruk}</svg>`;
  const reqCard = (m) => `<article class="req tint--${m.tint}" data-id="${m.id}">
      ${art(m.art)}<h3>${m.name}</h3><p>${m.desc}</p><span class="req__price">Harga by request</span>
      <div class="req__act"><button class="add" data-req="${m.name}">Tambah</button><a class="req__wa" target="_blank" rel="noopener" href="${waUrl(`Halo Ayam Gepuk-In, saya mau request menu ${m.name}. Jumlah porsi: ... Tanggal acara: ...`)}">WhatsApp</a></div>
    </article>`;
  const renderReq = () => `<div class="req-intro"><h3>Mau menu di luar daftar? Request aja.</h3>
      <p>Boleh request menu apa pun, seperti nasi daun jeruk, nasi kuning, tumpeng, sampai aneka masakan catering lainnya. Harga menyesuaikan menu dan jumlah porsi, kami konfirmasi lewat WhatsApp.</p>
      <ol><li>Pilih atau tulis menunya</li><li>Tambah ke pesanan</li><li>Kirim lewat WhatsApp, kami hitung harganya</li></ol></div>
    ${MENU.byreq.map(reqCard).join("")}
    <article class="req req--custom"><h3>Tulis menumu sendiri</h3><p>Nggak ada di daftar? Tulis saja, kami usahakan.</p>
      <label>Menu<input id="reqName" placeholder="Contoh: nasi bakar cumi"></label>
      <label>Porsi<input id="reqQty" type="number" min="1" value="10" inputmode="numeric"></label>
      <div class="req__act"><button class="add" id="reqAdd">Tambah</button><a class="req__wa" id="reqWa" target="_blank" rel="noopener">WhatsApp</a></div></article>`;
  const renderMenu = () => {
    grid.dataset.tab = tab;
    if (tab === "byreq") { grid.innerHTML = renderReq(); return; }
    grid.innerHTML = MENU[tab].map(dish).join("");
    $$(".dish", grid).forEach(updatePrice);
  };
  const reqText = () => ($("#reqName")?.value.trim() || "");
  const reqQty = () => Math.max(1, parseInt($("#reqQty")?.value, 10) || 1);
  grid.addEventListener("click", (e) => {
    const rb = e.target.closest("[data-req]");
    if (rb) { addCart(`Request: ${rb.dataset.req}`, null, rb); return; }
    if (e.target.closest("#reqAdd")) {
      if (!reqText()) { toast("Tulis dulu menu yang mau di-request"); $("#reqName").focus(); return; }
      addCart(`Request: ${reqText()}`, null, $("#reqAdd"), reqQty());
      return;
    }
    const wa = e.target.closest("#reqWa");
    if (wa) wa.href = waUrl(`Halo Ayam Gepuk-In, saya mau request menu ${reqText() || "..."}. Jumlah porsi: ${reqQty()}. Tanggal acara: ...`);
    const c = e.target.closest(".dish"); if (!c) return;
    const vb = e.target.closest(".var button");
    if (vb) {
      $$(".var button", c).forEach((b) => { b.classList.toggle("is-on", b === vb); b.setAttribute("aria-pressed", b === vb); });
      updatePrice(c);
      return;
    }
    const add = e.target.closest(".add");
    if (!add) return;
    const m = itemOf(c.dataset.id), v = curVar(c);
    const label = m.name + (m.variants ? ` ${m.variants[v]}` : "") + (isMain(m) ? (mode === "paket" ? ", pakai nasi" : ", tanpa nasi") : "");
    addCart(label, priceOf(m, v), add);
    if (!calm) $(".dish__img img", c).animate([{ transform: "none" }, { transform: "translateY(-14px) rotate(-3deg)", offset: 0.4 }, { transform: "none" }], { duration: 420, easing: "cubic-bezier(.3,1.5,.5,1)" });
  });
  $$(".seg button").forEach((b) => b.addEventListener("click", () => {
    tab = b.dataset.tab;
    $$(".seg button").forEach((x) => { x.classList.toggle("is-on", x === b); x.setAttribute("aria-selected", x === b); });
    $("#modeToggle").classList.toggle("is-hidden", tab !== "makanan");
    renderMenu();
  }));
  const sw = $("#modeToggle");
  $$("button", sw).forEach((b) => b.addEventListener("click", () => {
    if (mode === b.dataset.mode) return;
    mode = sw.dataset.mode = b.dataset.mode;
    $$("button", sw).forEach((x) => { x.classList.toggle("is-on", x === b); x.setAttribute("aria-pressed", x === b); });
    $$(".dish", grid).forEach((c) => {
      updatePrice(c);
      $(".dish__desc", c).textContent = descOf(itemOf(c.dataset.id));
      if (!calm) $(".price", c).animate([{ opacity: 0, transform: "translateY(-10px)" }, { opacity: 1, transform: "none" }], { duration: 300, easing: "ease-out" });
    });
  }));
  renderMenu();

  // ---------- SAMBAL: foto asli (semua seragam: toples di tengah), nama dicetak di label kraft
  // posisi label kraft sama di kelima foto: x 31%, y 33.5%, lebar 46%, tinggi 31%
  $("#sambalGrid").innerHTML = MENU.sambal.map((s) => `<li class="jar" data-id="${s.id}">
      <div class="jar__photo">
        <img src="assets/img/menu/${s.id}.webp" alt="Toples ${s.name} 250gr" loading="lazy" width="900" height="900">
        <span class="jar__label" style="left:31%;top:33.5%;width:46%;height:31%" aria-hidden="true"><small>Gepuk-In</small><strong>${s.short}</strong><em>250 gr</em></span>
      </div>
      <h3>${s.name}</h3>
      <p>${s.note}</p>
      <div class="jar__buy"><b>${rp(s.price)}</b><button class="add add--kunyit" aria-label="Tambah ${s.name} ke pesanan">Tambah</button></div>
    </li>`).join("");
  const t = MENU.tepung;
  $("#tepungCard").innerHTML = `<div class="tepung__shot"><img src="assets/img/menu/tepung.jpg" alt="Bungkus Tepung Gepuk-in 250gr dipegang di CFD Vida" loading="lazy" width="864" height="1184"></div>
    <div class="tepung__text"><h3>Mau bikin kriuk sendiri?</h3><p>${t.desc}</p>
    <div class="jar__buy"><b>${rp(t.price)}</b><button class="add" data-id="${t.id}" aria-label="Tambah ${t.name} ke pesanan">Tambah</button></div></div>`;
  $("#sambal").addEventListener("click", (e) => {
    const b = e.target.closest(".add"); if (!b) return;
    const m = itemOf(b.dataset.id || b.closest(".jar").dataset.id);
    addCart(`${m.name} 250gr`, m.price, b);
  });

  // ---------- SEGERA
  $("#soonGrid").innerHTML = MENU.soon.map((s) => `
    <li class="soon__item">
      <div class="soon__frame"><span class="soon__tag">Segera</span><img src="assets/img/menu/${s.id}.webp" alt="${s.name}" loading="lazy"></div>
      <h3>${s.name}</h3><p>${s.desc}</p>
    </li>`).join("");

  // ---------- KERANJANG
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("agi-cart")) || []; } catch {}
  const save = () => { try { localStorage.setItem("agi-cart", JSON.stringify(cart)); } catch {} };
  // keranjang lama di localStorage bisa menyimpan harga usang: selaraskan dengan data.js terbaru
  const priceByLabel = new Map();
  MENU.makanan.forEach((m) => (m.variants || [""]).forEach((v, j) => [["paket", "pakai nasi"], ["ala", "tanpa nasi"]].forEach(([k, t]) => {
    const p = m[k];
    priceByLabel.set(`${m.name}${v ? ` ${v}` : ""}, ${t}`, Array.isArray(p) ? p[j] : p);
  })));
  MENU.pendamping.forEach((m) => priceByLabel.set(m.name, m.price));
  [...MENU.sambal, MENU.tepung].forEach((m) => priceByLabel.set(`${m.name} 250gr`, m.price));
  cart = cart.filter((c) => c && c.qty > 0);
  cart.forEach((c) => { if (priceByLabel.has(c.name)) c.price = priceByLabel.get(c.name); });
  save();
  const lineOf = (c) => (c.price == null ? "harga menyusul" : rp(c.qty * c.price));
  // FAB mobile: keranjang berisi = "Lihat pesanan"; kosong = "Pesan lewat WhatsApp", tapi baru muncul setelah hero
  // lewat karena hero sudah punya tombol WhatsApp sendiri (inHero diatur observer hero di bagian LAGU)
  let inHero = true, cartN = 0;
  const syncFab = () => {
    $("#fabCart").classList.toggle("is-on", cartN > 0);
    $("#fabWa").classList.toggle("is-on", !cartN && !inHero);
  };
  function addCart(name, price, btn, qty = 1) {
    const f = cart.find((c) => c.name === name);
    f ? (f.qty += qty) : cart.push({ name, price, qty });
    save();
    renderCart();
    toast(`${name} masuk pesanan`);
    if (btn) {
      btn.classList.add("done");
      btn.textContent = "Masuk";
      clearTimeout(btn._t);
      btn._t = setTimeout(() => { btn.classList.remove("done"); btn.textContent = "Tambah"; }, 1100);
    }
  }
  function renderCart() {
    const n = cart.reduce((a, c) => a + c.qty, 0);
    const total = cart.reduce((a, c) => a + c.qty * c.price, 0);
    $$(".cart-count").forEach((b) => { b.textContent = n; b.hidden = !n; });
    cartN = n;
    syncFab();
    $("#fabTotal").textContent = n ? rp(total) : "";
    $("#cartTotal").textContent = rp(total);
    $("#cartList").innerHTML = n
      ? cart.map((c, i) => `
        <div class="ci"><div><b>${c.name}</b><span>${c.price == null ? "Harga dikonfirmasi via WhatsApp" : rp(c.price) + " per porsi"}</span></div>
        <div class="qty"><button data-q="-1" data-i="${i}" aria-label="Kurangi ${c.name}">−</button><span>${c.qty}</span><button data-q="1" data-i="${i}" aria-label="Tambah ${c.name}">+</button></div></div>`).join("")
      : `<div class="empty"><img src="${cut("ayam-gepuk")}" alt=""><p><b>Masih kosong.</b><br>Perutmu juga, kan?</p><a href="#menu" class="btn btn--line btn--sm" data-close-cart>Lihat menu</a></div>`;
    $$("#cartList [data-close-cart]").forEach((b) => b.addEventListener("click", () => setCart(false)));
    $("#sendWa").disabled = !n;
  }
  $("#cartList").addEventListener("click", (e) => {
    const b = e.target.closest("[data-q]"); if (!b) return;
    const c = cart[+b.dataset.i];
    c.qty += +b.dataset.q;
    if (c.qty <= 0) cart.splice(+b.dataset.i, 1);
    save();
    renderCart();
  });
  $("#sendWa").addEventListener("click", () => {
    const name = $("#cName").value.trim(), addr = $("#cAddr").value.trim().replace(/\s*\n\s*/g, ", "), note = $("#cNote").value.trim();
    const total = cart.reduce((a, c) => a + c.qty * c.price, 0);
    const msg = `Halo Ayam Gepuk-In, saya mau pesan:\n${cart.map((c) => `- ${c.qty}x ${c.name} (${lineOf(c)})`).join("\n")}\n\nTotal: ${rp(total)}` + (cart.some((c) => c.price == null) ? " + menu request (harga menyusul)" : "") +
      (name ? `\nNama: ${name}` : "") + (addr ? `\nAlamat: ${addr}` : "") + (note ? `\nCatatan: ${note}` : "");
    window.open(waUrl(msg), "_blank", "noopener");
  });
  const cartEl = $("#cart");
  let lastFocus;
  function setCart(open) {
    if (open) lastFocus = document.activeElement;
    cartEl.classList.toggle("is-open", open);
    cartEl.setAttribute("aria-hidden", !open);
    document.body.classList.toggle("lock", open);
    if (open) setTimeout(() => $(".cart__head button").focus(), 60);
    else lastFocus?.focus?.();
  }
  $$("[data-open-cart]").forEach((b) => b.addEventListener("click", () => setCart(true)));
  $$("[data-close-cart]").forEach((b) => b.addEventListener("click", () => setCart(false)));
  addEventListener("keydown", (e) => e.key === "Escape" && cartEl.classList.contains("is-open") && setCart(false));
  renderCart();

  let tt;
  function toast(m) {
    const el = $("#toast");
    el.textContent = m;
    el.classList.add("is-on");
    clearTimeout(tt);
    tt = setTimeout(() => el.classList.remove("is-on"), 1800);
  }

  // ---------- NAV
  const burger = $("#burger");
  burger.addEventListener("click", () => burger.setAttribute("aria-expanded", document.body.classList.toggle("nav-open")));
  $$("#navLinks a").forEach((a) => a.addEventListener("click", () => { document.body.classList.remove("nav-open"); burger.setAttribute("aria-expanded", false); }));
  addEventListener("scroll", () => $("#nav").classList.toggle("is-scrolled", scrollY > 40), { passive: true });

  // ---------- JAM BUKA (WIB)
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  const h = now.getHours() + now.getMinutes() / 60;
  const open = h >= CONFIG.open && h < CONFIG.close;
  const hhmm = `${String(now.getHours()).padStart(2, "0")}.${String(now.getMinutes()).padStart(2, "0")}`;
  $("#clockNow").style.left = (h / 24) * 100 + "%";
  $("#clockNow").dataset.t = hhmm;
  $("#status").classList.toggle("is-closed", !open);
  // teks dibungkus span: kalau lepas, flex memecahnya jadi kolom terpisah di layar sempit
  $("#status").innerHTML = open
    ? `<span class="dot"></span><span><b>Lagi buka.</b> Tutup jam 22.00, masih sempat.</span>`
    : `<span class="dot"></span><span><b>Lagi tutup.</b> Buka lagi jam 08.00.</span>`;

  // ---------- LAMPU NEON BERJALAN
  const chiliIco = `<svg class="neon__ico" aria-hidden="true"><use href="#chili"/></svg>`;
  $$("[data-ticker]").forEach((el) => {
    const items = [...(TICKER[el.dataset.ticker] || [])];
    if (el.dataset.ticker === "atas") items.unshift(open
      ? { label: "Buka sekarang", text: "tutup jam 22.00", c: "hijau", live: true }
      : { label: "Lagi tutup", text: "buka lagi jam 08.00", c: "merah", live: true });
    const li = items.map((it) => `<li class="neon--${it.c}">${it.live ? `<span class="neon__live" aria-hidden="true"></span>` : ""}<b>${it.label}</b><span>${it.text}</span>${chiliIco}</li>`).join("");
    $(".neon__track", el).innerHTML = `<ul>${li}</ul><ul aria-hidden="true">${li}</ul>`;
    el.style.setProperty("--dur", items.length * 7 + "s");
  });

  // ---------- DOKUMENTASI: bingkai seragam, foto utuh (contain) di tengah, latar blur dari foto yang sama
  $("#dokGrid").innerHTML = DOK.map((d, i) => `<li class="dok__item" style="--tilt:${[-1.5, 1, -0.5, 1.5][i % 4]}deg">
      <button class="dok__frame" data-i="${i}" style="--img:url('${d.src}')" aria-label="Perbesar foto: ${d.cap}">
        <img src="${d.src}" alt="${d.cap}" loading="lazy"><span class="dok__tag">${d.tag}</span>
      </button><p>${d.cap}</p></li>`).join("") +
    `<li class="dok__item dok__cta"><div><h3>Acara kamu berikutnya?</h3><p>Ceritakan jumlah porsi dan tanggalnya, kami bantu atur menunya.</p>
      <a class="btn btn--kunyit btn--sm" target="_blank" rel="noopener" href="${waUrl("Halo Ayam Gepuk-In, saya mau tanya catering. Jumlah porsi: ... Tanggal acara: ... Menu: ...")}">Tanya catering</a></div></li>`;
  const lb = $("#lightbox");
  let lbI = 0;
  const lbShow = (i) => {
    lbI = (i + DOK.length) % DOK.length;
    $("#lbImg").src = DOK[lbI].src; $("#lbImg").alt = DOK[lbI].cap;
    $("#lbCap").textContent = `${DOK[lbI].cap} (${lbI + 1}/${DOK.length})`;
  };
  $("#dokGrid").addEventListener("click", (e) => {
    const b = e.target.closest(".dok__frame"); if (!b) return;
    lbShow(+b.dataset.i);
    lb.showModal ? lb.showModal() : lb.setAttribute("open", "");
  });
  lb.addEventListener("click", (e) => {
    const b = e.target.closest("[data-lb]");
    if (b) return b.dataset.lb === "close" ? lb.close() : lbShow(lbI + +b.dataset.lb);
    if (e.target === lb) lb.close();
  });
  lb.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") lbShow(lbI + 1); if (e.key === "ArrowLeft") lbShow(lbI - 1); });

  // ---------- TITIK INTERAKTIF: grid titik di latar yang tertarik ke kursor + gelombang saat diklik
  const dotFields = $$(".hero, .sambal, .testi").map((sec) => {
    const cv = document.createElement("canvas");
    cv.className = "dots";
    cv.setAttribute("aria-hidden", "true");
    sec.prepend(cv);
    return { sec, cv, ctx: cv.getContext("2d"), dots: [], on: false, cx: -999, cy: -999, tx: -999, ty: -999, waves: [], col: "" };
  });
  const GAP = 24, RAD = 150;
  const sizeField = (f) => {
    const dpr = Math.min(2, devicePixelRatio || 1), w = f.sec.offsetWidth, h = f.sec.offsetHeight;
    f.w = w; f.h = h;
    f.cv.width = w * dpr; f.cv.height = h * dpr;
    f.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    f.dots = [];
    for (let y = GAP / 2; y < h; y += GAP) for (let x = GAP / 2; x < w; x += GAP) f.dots.push({ x, y, ox: 0, oy: 0, vx: 0, vy: 0, g: 0 });
    f.col = getComputedStyle(f.cv).color;
    if (calm) drawField(f);
  };
  const drawField = (f) => {
    const { ctx, dots } = f, now = performance.now();
    ctx.clearRect(0, 0, f.w, f.h);
    if (f.tx < -500) { f.cx = f.cy = -999; } // kursor keluar: langsung lepas, jangan menyapu grid
    else { f.cx += (f.tx - f.cx) * 0.16; f.cy += (f.ty - f.cy) * 0.16; } // kursor dihaluskan = titik "mengejar"
    f.waves = f.waves.filter((w) => now - w.t < 1100);
    ctx.fillStyle = f.col;
    for (const d of dots) {
      let txo = 0, tyo = 0, glow = 0;
      const dx = f.cx - d.x, dy = f.cy - d.y, dist = Math.hypot(dx, dy);
      if (dist < RAD && dist > 0.1) {
        const k = (1 - dist / RAD) ** 2;
        txo = (dx / dist) * k * 26; tyo = (dy / dist) * k * 26; glow = k;
      }
      for (const w of f.waves) {
        const age = (now - w.t) / 1100, r = age * 520, wx = d.x - w.x, wy = d.y - w.y, wd = Math.hypot(wx, wy) || 1;
        const band = 1 - Math.min(1, Math.abs(wd - r) / 46);
        if (band > 0) { const p = band * (1 - age) * 22; txo += (wx / wd) * p; tyo += (wy / wd) * p; glow = Math.max(glow, band * (1 - age)); }
      }
      // pegas: offset dan nyala bergerak halus menuju target
      d.vx = (d.vx + (txo - d.ox) * 0.12) * 0.78; d.vy = (d.vy + (tyo - d.oy) * 0.12) * 0.78;
      d.ox += d.vx; d.oy += d.vy; d.g += (glow - d.g) * 0.2;
      ctx.globalAlpha = 0.13 + d.g * 0.8;
      ctx.beginPath();
      ctx.arc(d.x + d.ox, d.y + d.oy, 1.5 + d.g * 3.2, 0, 6.283);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
  dotFields.forEach(sizeField);
  let rsT;
  addEventListener("resize", () => { clearTimeout(rsT); rsT = setTimeout(() => dotFields.forEach(sizeField), 150); });
  new MutationObserver(() => dotFields.forEach((f) => { f.col = getComputedStyle(f.cv).color; if (calm) drawField(f); }))
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  if (!calm) {
    const vo = new IntersectionObserver((es) => es.forEach((e) => (dotFields.find((f) => f.sec === e.target).on = e.isIntersecting)));
    dotFields.forEach((f) => vo.observe(f.sec));
    addEventListener("pointermove", (e) => dotFields.forEach((f) => {
      if (!f.on) return;
      const r = f.sec.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      const inside = x > -RAD && y > -RAD && x < r.width + RAD && y < r.height + RAD;
      f.tx = inside ? x : -999; f.ty = inside ? y : -999;
      if (inside && f.cx < -500) { f.cx = x; f.cy = y; }
    }), { passive: true });
    addEventListener("pointerdown", (e) => dotFields.forEach((f) => {
      const r = f.sec.getBoundingClientRect();
      if (e.clientY >= r.top && e.clientY <= r.bottom) f.waves.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() });
    }), { passive: true });
    document.addEventListener("pointerleave", () => dotFields.forEach((f) => { f.tx = f.ty = -999; }));
    const loop = () => { dotFields.forEach((f) => f.on && drawField(f)); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }

  // ---------- MODE GELAP / TERANG
  const root = document.documentElement, themeBtn = $("#themeBtn");
  const paintTheme = () => {
    const dark = root.dataset.theme === "dark";
    themeBtn.setAttribute("aria-label", dark ? "Ganti ke mode terang" : "Ganti ke mode gelap");
    $('meta[name="theme-color"]').content = dark ? "#16100e" : "#7a1418";
  };
  themeBtn.addEventListener("click", () => {
    root.classList.add("theme-anim");
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("agi-theme", root.dataset.theme); } catch {}
    paintTheme();
    toast(root.dataset.theme === "dark" ? "Mode gelap nyala" : "Mode terang nyala");
    setTimeout(() => root.classList.remove("theme-anim"), 600);
  });
  paintTheme();

  // ---------- NAV ke tab By Request
  $$("[data-goto]").forEach((a) => a.addEventListener("click", () => $(`.seg [data-tab="${a.dataset.goto}"]`)?.click()));

  // ---------- SAMBAL TUMPAH: pembatas section, digambar dari seed supaya tiap pembatas beda
  const cobek = `<svg viewBox="0 0 160 120"><g transform="rotate(24 80 70)"><path d="M18 50h124c0 32-28 54-62 54S18 82 18 50z" fill="#2b2421"/><ellipse cx="80" cy="50" rx="62" ry="14" fill="#3d322d"/><ellipse cx="80" cy="50" rx="52" ry="10" fill="#d8301c"/><ellipse cx="66" cy="47" rx="18" ry="3" fill="#ff7a4a" opacity=".6"/><g fill="#ffe2a8"><circle cx="58" cy="52" r="1.6"/><circle cx="92" cy="48" r="1.6"/><circle cx="104" cy="53" r="1.4"/><circle cx="76" cy="55" r="1.5"/></g><g fill="#6d625d" opacity=".55"><circle cx="50" cy="78" r="2"/><circle cx="96" cy="88" r="2.4"/><circle cx="118" cy="70" r="1.6"/></g></g><path d="M132 74c10 4 15 20 13 46h13c2-28-5-44-20-50z" fill="#d8301c"/><path d="M137 78c5 5 7 18 6 38" stroke="#ff7a4a" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/></svg>`;
  $$(".spill").forEach((el, k) => {
    let sd = (+el.dataset.seed || k + 1) * 7919;
    const R = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    const W = 1440, B = 24, maroon = el.dataset.kind === "maroon";
    const C = maroon ? ["#7a1418", "#560c10", "#c0301f"] : ["#d8301c", "#9e1b12", "#ff7a4a"];
    const f = (n) => n.toFixed(1);
    let back = "", front = "", shine = "", fall = "", bits = "", splat = "";
    const drips = (el._drips = []);
    for (let x = -10; x < W + 30; x += 26 + R() * 46) front += `<circle cx="${f(x)}" cy="${B}" r="${f(8 + R() * 12)}"/>`;
    for (let x = 20 + R() * 40; x < W - 10; x += 55 + R() * 110) {
      const w = 14 + R() * 22, L = 18 + R() * (R() > 0.72 ? 92 : 48), b = w * 0.34, d = f(R() * 0.9);
      const drop = (o, l) => `<path d="M${f(x + o - w / 2)} ${B - 6}C${f(x + o - w / 2)} ${f(B + l * 0.4)} ${f(x + o - b)} ${f(B + l * 0.5)} ${f(x + o - b)} ${f(B + l)}L${f(x + o + b)} ${f(B + l)}C${f(x + o + b)} ${f(B + l * 0.5)} ${f(x + o + w / 2)} ${f(B + l * 0.4)} ${f(x + o + w / 2)} ${B - 6}Z"/><circle cx="${f(x + o)}" cy="${f(B + l)}" r="${f(b * 1.3)}"/>`;
      const i = drips.push({ x, w, b, top: B - 6, len: L + 6 + b * 1.3 }) - 1;
      back += `<g class="dr" style="--d:${d}s"><g class="dr-in" data-i="${i}">${drop(5, L + 8)}</g></g>`;
      front += `<g class="dr" style="--d:${d}s"><g class="dr-in" data-i="${i}">${drop(0, L)}</g></g>`;
      shine += `<g class="dr" style="--d:${d}s"><g class="dr-in" data-i="${i}"><ellipse cx="${f(x - b * 0.45)}" cy="${f(B + L - b * 0.3)}" rx="${f(b * 0.32)}" ry="${f(b * 0.55)}"/><rect x="${f(x - w * 0.26)}" y="${B + 2}" width="${f(Math.max(2, w * 0.1))}" height="${f(L * 0.45)}" rx="1.5"/></g></g>`;
      if (L > 58) fall += `<circle class="fall" cx="${f(x)}" cy="${f(B + L + b * 1.3)}" r="${f(b * 0.75)}" style="--d:${f(R() * 4)}s"/>`;
    }
    for (let i = 0; i < 80; i++) {
      const x = f(R() * W), y = f(3 + R() * (B + 2));
      bits += R() > 0.3
        ? `<ellipse cx="${x}" cy="${y}" rx="3" ry="1.6" transform="rotate(${(R() * 180) | 0} ${x} ${y})" fill="#ffe2a8" opacity=".85"/>`
        : `<path d="M${x} ${y}l4-2 3 3-4 2z" fill="${R() > 0.45 ? "#ff9a3c" : "#3f8f3a"}"/>`;
    }
    for (let i = 0; i < 16; i++) splat += `<circle cx="${f(R() * W)}" cy="${f(B + 26 + R() * 90)}" r="${f(1.5 + R() * 3.5)}" opacity=".8"/>`;
    const side = el.dataset.side, ar = side === "left" ? "xMinYMin" : side === "right" ? "xMaxYMin" : "xMidYMin";
    el.innerHTML = `<svg viewBox="0 0 ${W} 260" preserveAspectRatio="${ar} slice">
      <g fill="${C[1]}">${back}</g><g fill="${C[0]}"><rect width="${W}" height="${B}"/>${front}</g>
      <g fill="#fff" opacity=".3">${shine}</g>
      <path d="M0 8Q180 3 360 8T720 7T1080 9T1440 6" stroke="${C[2]}" stroke-width="3" fill="none" opacity=".55" stroke-linecap="round"/>
      ${bits}<g fill="${C[0]}">${splat}${fall}</g></svg>${side ? `<div class="spill__cobek spill__cobek--${side}">${cobek}</div>` : ""}`;
  });

  // ---------- SAMBAL TUMPAH INTERAKTIF: lelehan memanjang ke arah kursor, menetes, klik = muncrat
  const blob = (host, x, y, r, color, dx, dy, dur) => {
    const i = document.createElement("i");
    i.className = "spill-drop";
    i.style.cssText = `left:${x}px;top:${y}px;width:${r * 2}px;height:${r * 2.3}px;background:${color}`;
    host.append(i);
    i.animate(
      [{ transform: "translate(-50%,-50%) scale(.6)", opacity: 1 }, { transform: `translate(calc(-50% + ${dx * 0.5}px), calc(-50% + ${dy * 0.35}px)) scale(1, 1.25)`, opacity: 1, offset: 0.35 }, { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.8, 1.4)`, opacity: 0 }],
      { duration: dur, easing: "cubic-bezier(.45,0,.9,.6)" }
    ).onfinish = () => i.remove();
  };

  $$(".spill").forEach((el) => {
    const svg = $("svg", el), drips = el._drips || [];
    const color = el.dataset.kind === "maroon" ? "#7a1418" : "#d8301c";
    const parts = drips.map((_, i) => $$(`.dr-in[data-i="${i}"]`, svg));
    const last = {};
    let cx = null, raf = 0;
    const toSvg = (e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
    const scaleOf = (d) => (cx == null ? 1 : 1 + Math.max(0, 1 - Math.abs(d.x - cx) / 150) * 0.6);
    const stretch = () => { raf = 0; drips.forEach((d, i) => parts[i].forEach((n) => (n.style.transform = `scaleY(${scaleOf(d).toFixed(3)})`))); };
    const dripAt = (d) => {
      const m = svg.getScreenCTM(), r = el.getBoundingClientRect();
      const sx = m.a * d.x + m.e - r.left, sy = m.d * (d.top + d.len * scaleOf(d)) + m.f - r.top;
      blob(el, sx, sy, Math.max(3, d.b * m.a * 0.9), color, 0, 120 + Math.random() * 60, 900);
    };
    svg.addEventListener("pointermove", (e) => {
      if (calm) return;
      const p = toSvg(e);
      cx = p.x;
      if (!raf) raf = requestAnimationFrame(stretch);
      const now = performance.now();
      drips.forEach((d, i) => { if (Math.abs(d.x - p.x) < d.w && now - (last[i] || 0) > 650) { last[i] = now; setTimeout(() => dripAt(d), 180); } });
    });
    svg.addEventListener("pointerleave", () => { cx = null; if (!raf) raf = requestAnimationFrame(stretch); });
    svg.addEventListener("click", (e) => {
      if (calm) return;
      const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      for (let i = 0; i < 14; i++) { const a = rand(-Math.PI * 0.95, -Math.PI * 0.05); blob(el, x, y, rand(3, 8), color, Math.cos(a) * rand(40, 140), Math.sin(a) * rand(30, 110) + 160, rand(700, 1100)); }
      navigator.vibrate?.(10);
    });
  });

  // ---------- muncul saat di-scroll + ornamen melayang (parallax)
  const io = "IntersectionObserver" in window && !calm
    ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" })
    : null;
  if (io) {
    document.documentElement.classList.add("js-reveal");
    $$("[data-reveal], .spill").forEach((el) => { if (el.classList.contains("spill")) el.classList.add("anim"); io.observe(el); });
  }
  const floats = $$(".fl[data-speed]");
  if (!calm && floats.length) {
    let ticking = false;
    const para = () => {
      ticking = false;
      const vh = innerHeight;
      floats.forEach((s) => {
        const r = s.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        s.style.translate = `0 ${f2((r.top + r.height / 2 - vh / 2) * -s.dataset.speed)}px`;
      });
    };
    const f2 = (n) => n.toFixed(1);
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(para); } }, { passive: true });
    para();
  }

  // ---------- LAGU: mati secara default. Hanya diputar kalau pengunjung menyalakannya sendiri;
  // pilihan "on" diingat, jadi kunjungan berikutnya diputar di interaksi pertama
  const song = $("#song"), music = $("#music"), mBtn = $("#musicBtn"), mSw = $("#musicSw"), mStat = $("#musicStatus");
  let pref = null;
  try { pref = localStorage.getItem("agi-music"); } catch {}
  let wantOn = pref === "on", closeT;
  song.volume = 0.5;
  const peek = (ms = 3500) => { music.classList.add("open"); clearTimeout(closeT); closeT = setTimeout(() => music.classList.remove("open"), ms); };
  const paint = () => {
    const on = !song.paused;
    music.classList.toggle("playing", on);
    mBtn.setAttribute("aria-pressed", on); mSw.setAttribute("aria-checked", on);
    mBtn.setAttribute("aria-label", on ? "Matikan lagu" : "Nyalakan lagu");
    mStat.textContent = on ? "Lagi diputar" : wantOn ? "Ketuk di mana saja untuk memutar" : pref === "off" ? "Lagu dimatikan" : "Ketuk untuk memutar lagu";
  };
  const play = () => song.play().then(paint).catch(paint);
  const setMusic = (on) => {
    wantOn = on;
    pref = on ? "on" : "off";
    try { localStorage.setItem("agi-music", pref); } catch {}
    on ? play() : (song.pause(), paint());
    peek();
  };
  song.addEventListener("play", paint); song.addEventListener("pause", paint);
  mBtn.addEventListener("click", () => setMusic(song.paused));
  mSw.addEventListener("click", () => setMusic(song.paused));
  music.addEventListener("mouseenter", () => { clearTimeout(closeT); music.classList.add("open"); });
  music.addEventListener("mouseleave", () => peek(800));
  const firstTouch = (e) => {
    if (e.target.closest?.("#music")) return;
    if (wantOn && song.paused) play();
    ["pointerdown", "keydown"].forEach((t) => removeEventListener(t, firstTouch));
  };
  ["pointerdown", "keydown"].forEach((t) => addEventListener(t, firstTouch));
  if (wantOn) play(); else paint();
  setTimeout(() => peek(5000), 1200);
  // hero terlihat? Mobile: pemutar menyingkir (lihat .music.in-hero di CSS) dan FAB WhatsApp belum muncul
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => {
      music.classList.toggle("in-hero", e.isIntersecting);
      inHero = e.isIntersecting;
      syncFab();
    }).observe($(".hero"));
  } else { inHero = false; syncFab(); }

  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add("ready")));
})();
