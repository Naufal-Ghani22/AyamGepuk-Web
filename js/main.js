(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rp = (k) => "Rp" + (k * 1000).toLocaleString("id-ID");
  const waUrl = (t) => `https://wa.me/${CONFIG.wa}?text=${encodeURIComponent(t)}`;
  const cut = (id) => `assets/img/cut/${id}.webp`;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const rand = (a, b) => a + Math.random() * (b - a);

  // ---------- link statis
  $$("[data-wa]").forEach((a) => (a.href = waUrl(a.dataset.wa)));
  $("#mapsLink").href = CONFIG.maps;
  $("#goLink").href = CONFIG.gofood;
  $("#spLink").href = CONFIG.shopeefood;
  $("#igLink").href = CONFIG.ig;
  $("#yr").textContent = new Date().getFullYear();

  // ---------- data helper
  let mode = "paket", tab = "makanan";
  const all = [...MENU.makanan, ...MENU.pendamping, ...MENU.sambal, MENU.tepung];
  const itemOf = (id) => all.find((m) => m.id === id);
  const isMain = (m) => MENU.makanan.includes(m);
  const priceOf = (m, v = 0) => { const p = m.price ?? m[mode]; return Array.isArray(p) ? p[v] : p; };
  const descOf = (m) => (isMain(m) && mode === "paket" ? `Nasi ngebul, ${m.desc.toLowerCase()}` : m.desc);

  // ---------- HERO: gepuk ayamnya
  const stage = $("#stage"), plate = $("#plate"), pestle = $("#pestle"), crumbs = $("#crumbs");
  const title = $("#heroTitle"), countEl = $("#hitCount"), hint = $("#hitHint");
  const bubble = $("#bubble"), bubbleText = $("#bubbleText");
  const colors = ["#e4321b", "#e4321b", "#f2b04a", "#d98a2b", "#fff4dc", "#3f8f3a"];
  const words = ["Gepuk!", "Duk!", "Buk!", "Gepuk!"];
  const lines = {
    5: "Udah empuk tuh. Mending langsung dimakan.",
    15: "Tenagamu boleh juga. Dapur kami butuh orang kayak kamu.",
    40: "Oke, ayamnya nyerah. Kamu menang.",
  };
  let hits = 0;

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

  const hit = (cx, cy) => {
    const [x, y] = local(cx, cy);
    hits++;
    place(pestle, x, y);
    navigator.vibrate?.(14);

    countEl.hidden = false;
    countEl.textContent = `${hits}x digepuk`;
    hint.classList.add("gone");
    if (lines[hits]) { bubbleText.textContent = lines[hits]; bubble.hidden = false; }

    if (calm) return;
    pestle.classList.add("show");
    clearTimeout(pestle._t);
    pestle._t = setTimeout(() => !stage.classList.contains("aiming") && pestle.classList.remove("show"), 500);
    $("svg", pestle).animate(
      [{ transform: "translateY(-38px) rotate(-22deg)" }, { transform: "translateY(4px) rotate(-6deg)", offset: 0.28 }, { transform: "translateY(-38px) rotate(-22deg)" }],
      { duration: 320, easing: "cubic-bezier(.3,.7,.4,1)" }
    );
    $("img", plate).animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.035, .93)", offset: 0.3 }, { transform: "scale(.99, 1.02)", offset: 0.6 }, { transform: "scale(1)" }],
      { duration: 380, easing: "ease-out" }
    );
    title.animate([{ transform: "none" }, { transform: "scale(1.02, .9)", offset: 0.3 }, { transform: "none" }], { duration: 300, easing: "ease-out" });
    countEl.animate([{ transform: "translateX(-50%) scale(1.2)" }, { transform: "translateX(-50%) scale(1)" }], { duration: 220 });

    for (let i = 0; i < 16; i++) {
      const c = document.createElement("i");
      const s = rand(5, 13);
      c.style.cssText = `left:${x}px;top:${y}px;width:${s}px;height:${s * rand(0.6, 1)}px;background:${colors[i % colors.length]}`;
      crumbs.append(c);
      const a = rand(-Math.PI, 0), d = rand(50, 150), dx = Math.cos(a) * d, dy = Math.sin(a) * d, r = rand(-260, 260);
      c.animate(
        [{ transform: "translate(-50%,-50%)" }, { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${r}deg)`, offset: 0.4 }, { transform: `translate(calc(-50% + ${dx * 1.4}px), calc(-50% + ${dy + 140}px)) rotate(${r * 2}deg)`, opacity: 0 }],
        { duration: rand(650, 1000), easing: "cubic-bezier(.2,.6,.4,1)" }
      ).onfinish = () => c.remove();
    }
    const w = document.createElement("b");
    w.className = "pow";
    w.textContent = words[hits % words.length];
    w.style.cssText = `left:${x + rand(-30, 30)}px;top:${y - rand(50, 80)}px;--r:${rand(-14, 14)}deg`;
    crumbs.append(w);
    w.animate(
      [{ transform: "translate(-50%,-50%) rotate(var(--r)) scale(.3)", opacity: 0 }, { transform: "translate(-50%,-50%) rotate(var(--r)) scale(1.15)", opacity: 1, offset: 0.25 }, { transform: "translate(-50%,-80%) rotate(var(--r)) scale(1)", opacity: 0 }],
      { duration: 700, easing: "ease-out" }
    ).onfinish = () => w.remove();
  };

  plate.addEventListener("pointerdown", (e) => { if (e.button === 0) hit(e.clientX, e.clientY); });
  plate.addEventListener("click", (e) => {
    if (e.detail !== 0) return; // keyboard: Enter / Space
    const r = plate.getBoundingClientRect();
    hit(r.left + r.width * rand(0.4, 0.7), r.top + r.height * rand(0.45, 0.65));
  });
  $("#bubbleBtn").addEventListener("click", () => {
    const m = MENU.makanan[0];
    addCart(`${m.name} Dada, pakai nasi`, m.paket[0]);
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
  const renderMenu = () => {
    grid.dataset.tab = tab;
    grid.innerHTML = MENU[tab].map(dish).join("");
    $$(".dish", grid).forEach(updatePrice);
  };
  grid.addEventListener("click", (e) => {
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

  // ---------- SAMBAL: toples di rak, label dicetak di stiker kraft
  $("#sambalGrid").innerHTML = MENU.sambal.map((s) => {
    const L = s.label, fw = (52 / L.w) * 100, fl = 50 - ((L.x + L.w / 2) / 100) * fw;
    return `<li class="jar" data-id="${s.id}">
      <div class="jar__slot">
        <div class="jar__fig" style="--fw:${fw.toFixed(1)}%;--fl:${fl.toFixed(1)}%">
          <img src="${cut(s.id)}" alt="Toples ${s.name}" loading="lazy">
          <span class="jar__label" style="left:${L.x}%;top:${L.y}%;width:${L.w}%;height:${L.h}%" aria-hidden="true"><small>Gepuk-In</small><strong>${s.short}</strong><em>250 gr</em></span>
        </div>
      </div>
      <h3>${s.name}</h3>
      <p>${s.note}</p>
      <div class="jar__buy"><b>${rp(s.price)}</b><button class="add add--kunyit" aria-label="Tambah ${s.name} ke pesanan">Tambah</button></div>
    </li>`;
  }).join("");
  const t = MENU.tepung;
  $("#tepungCard").innerHTML = `<img src="${cut("tepung")}" alt="Kemasan Tepung Gepuk-in di atas talenan" loading="lazy">
    <div class="tepung__text"><h3>Mau bikin kriuk sendiri?</h3><p>${t.desc}</p>
    <div class="jar__buy"><b>${rp(t.price)}</b><button class="add" data-id="${t.id}" aria-label="Tambah ${t.name} ke pesanan">Tambah</button></div></div>`;
  $("#sambal").addEventListener("click", (e) => {
    const b = e.target.closest(".add"); if (!b) return;
    const m = itemOf(b.dataset.id || b.closest(".jar").dataset.id);
    addCart(`${m.name} 250gr`, m.price, b);
  });

  // ---------- SEGERA
  $("#soonGrid").innerHTML = MENU.soon.map((s) => `
    <li class="soon__item"><span class="soon__tag">Segera</span><img src="${cut(s.id)}" alt="${s.name}" loading="lazy"><h3>${s.name}</h3><p>${s.desc}</p></li>`).join("");

  // ---------- KERANJANG
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("agi-cart")) || []; } catch {}
  const save = () => { try { localStorage.setItem("agi-cart", JSON.stringify(cart)); } catch {} };
  function addCart(name, price, btn) {
    const f = cart.find((c) => c.name === name);
    f ? f.qty++ : cart.push({ name, price, qty: 1 });
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
    $(".fab").classList.toggle("is-on", n > 0);
    $("#fabTotal").textContent = n ? rp(total) : "";
    $("#cartTotal").textContent = rp(total);
    $("#cartList").innerHTML = n
      ? cart.map((c, i) => `
        <div class="ci"><div><b>${c.name}</b><span>${rp(c.price)} per porsi</span></div>
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
    const name = $("#cName").value.trim(), note = $("#cNote").value.trim();
    const total = cart.reduce((a, c) => a + c.qty * c.price, 0);
    const msg = `Halo Ayam Gepuk-In, saya mau pesan:\n${cart.map((c) => `- ${c.qty}x ${c.name} (${rp(c.qty * c.price)})`).join("\n")}\n\nTotal: ${rp(total)}` +
      (name ? `\nNama: ${name}` : "") + (note ? `\nCatatan: ${note}` : "");
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
  $("#status").innerHTML = open
    ? `<span class="dot"></span><b>Lagi buka.</b> Tutup jam 22.00, masih sempat.`
    : `<span class="dot"></span><b>Lagi tutup.</b> Buka lagi jam 08.00.`;

  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add("ready")));
})();
