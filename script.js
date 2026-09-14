/* ==========================================================
   AgvarrStore — logic / interaksi (Vanilla JS)
   ========================================================== */

// Nomor WhatsApp dummy (format internasional tanpa +)
const whatsappNumber = "6281234567890";

// --- Data produk dummy ---
const products = [
    { id: 12, game: "Mobile Legends", title: "MLBB Mythic 150+ Skin Full Data", price: 350000, rank: "Mythic", skins: "150+ Skin", icon: "⚔️", detail: "Akun pribadi, full data, change name ready, emblem max 2, winrate 62%. Skin Collector 3, Epic Limited 12." },
    { id: 11, game: "Mobile Legends", title: "MLBB Sultan MG + 27 Collector", price: 1250000, rank: "Mythical Glory", skins: "320+ Skin", icon: "👑", detail: "Akun sultan, Mythical Glory 1200 poin, semua role ready, recall epic banyak, siap turnamen." },
    { id: 10, game: "Mobile Legends", title: "MLBB Smurf Epic 50+ Skin Murah", price: 185000, rank: "Epic", skins: "50+ Skin", icon: "⚔️", detail: "Cocok untuk smurf / pemula, skin basic-epic campur, emblem 45+, monsep ready." },
    { id: 9, game: "Free Fire", title: "FF Sultan SG2 + 80 Bundle", price: 750000, rank: "Grandmaster", skins: "80+ Bundle", icon: "🔥", detail: "Senjata SG2 OPM, bundle season 2-8, emote rare 40+, diamond 500 sisa." },
    { id: 8, game: "Free Fire", title: "FF Old Season 1-5 Akun Veteran", price: 550000, rank: "Heroic", skins: "45+ Bundle", icon: "🎖️", detail: "Akun old season 1, ada bundle criminal, katana langka, full data FB + Google." },
    { id: 7, game: "Free Fire", title: "FF Polosan SG OPM 12 Bundle", price: 150000, rank: "Gold", skins: "12 Bundle", icon: "🔥", detail: "Akun polosan murah, SG OPM level 3, cocok untuk bahan push rank." },
    { id: 6, game: "PUBG Mobile", title: "PUBG Conqueror M4 Glacier Max", price: 1500000, rank: "Conqueror", skins: "Mythic 30+", icon: "🎯", detail: "M4 Glacier max, AKM Hellfire max, X-Suit 2, conqueror frame 4 season, UC 800 sisa." },
    { id: 5, game: "PUBG Mobile", title: "PUBG Sultan 120+ Skin + UC", price: 680000, rank: "Ace Master", skins: "120+ Skin", icon: "🪖", detail: "Set mythic 12, senjata upgrade 5, kendaraan UAZ langka, login Twitter + email." },
    { id: 4, game: "PUBG Mobile", title: "PUBG Polosan Frame Conqueror", price: 290000, rank: "Diamond", skins: "40+ Skin", icon: "🎯", detail: "Ada frame conqueror, skin senjata 40+, cocok untuk akun kedua." },
    { id: 3, game: "Roblox", title: "Roblox Adopt Me + 200 Limited", price: 890000, rank: "Level 180", skins: "200+ Limited", icon: "🧱", detail: "Full data, PIN ready, Adopt Me neon 12, limited Dominus + Valk, Robux 500 sisa." },
    { id: 2, game: "Roblox", title: "Roblox Blox Fruits Max + Gamepass", price: 420000, rank: "Level Max 2550", skins: "Permanent Fruits", icon: "🍈", detail: "Level max, permanent Dough + Dragon, gamepass 2x mastery, sword Yoru + CDK." },
    { id: 1, game: "Roblox", title: "Roblox Starter 85 Limited Murah", price: 320000, rank: "Level 120", skins: "85+ Limited", icon: "🧱", detail: "Akun starter premium, limited value 50K+, email verified, cocok untuk kolektor." },
];

// --- State filter ---
const state = { search: "", game: "all", price: "all", sort: "newest" };

// --- Elemen DOM ---
const productGrid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");
const searchInput = document.getElementById("searchInput");
const filterGame = document.getElementById("filterGame");
const filterPrice = document.getElementById("filterPrice");
const sortBy = document.getElementById("sortBy");

// --- Helper: format Rupiah ---
function formatRupiah(n) {
    return "Rp" + n.toLocaleString("id-ID");
}

// --- Helper: class gradient per game ---
function gameClass(game) {
    if (game === "Mobile Legends") return "game-ml";
    if (game === "Free Fire") return "game-ff";
    if (game === "PUBG Mobile") return "game-pubg";
    return "game-roblox";
}

// --- Helper: link WhatsApp produk ---
function waLinkFor(product) {
    const msg = `Halo AgvarrStore, saya tertarik dengan akun ${product.title} dengan harga ${formatRupiah(product.price)}. Apakah masih tersedia?`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

// --- Filter + sort ---
function getFiltered() {
    const q = state.search.trim().toLowerCase();
    let list = products.filter((p) => {
        const haystack = (p.title + " " + p.game + " " + p.rank + " " + p.skins + " " + p.detail).toLowerCase();
        const matchQ = !q || haystack.includes(q);
        const matchGame = state.game === "all" || p.game === state.game;
        let matchPrice = true;
        if (state.price === "under250") matchPrice = p.price < 250000;
        else if (state.price === "250-500") matchPrice = p.price >= 250000 && p.price <= 500000;
        else if (state.price === "500-1000") matchPrice = p.price > 500000 && p.price <= 1000000;
        else if (state.price === "over1000") matchPrice = p.price > 1000000;
        return matchQ && matchGame && matchPrice;
    });
    if (state.sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    else if (state.sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    else list = [...list].sort((a, b) => b.id - a.id); // newest
    return list;
}

// --- Render produk ---
function renderProducts() {
    const list = getFiltered();
    productGrid.innerHTML = list.map((p) => `
        <article class="product-card">
            <div class="product-visual ${gameClass(p.game)}">
                <div class="product-badges">
                    <span class="game-tag">${p.game.toUpperCase()}</span>
                    <span class="pill pill-success">Available</span>
                </div>
                <span aria-hidden="true">${p.icon}</span>
            </div>
            <div class="product-body">
                <h3 class="product-title">${p.title}</h3>
                <div class="product-specs">
                    <span>⭐ ${p.rank}</span>
                    <span>🎨 ${p.skins}</span>
                </div>
                <div class="product-foot">
                    <span class="product-price">${formatRupiah(p.price)}</span>
                    <button class="btn-detail" type="button" data-detail="${p.id}">Lihat Detail</button>
                </div>
            </div>
        </article>
    `).join("");

    const showEmpty = list.length === 0;
    emptyState.hidden = !showEmpty;
    productGrid.style.display = showEmpty ? "none" : "";
    resultCount.textContent = showEmpty
        ? "Tidak ada hasil."
        : `Menampilkan ${list.length} dari ${products.length} produk dummy.`;
}

// --- Update stock kategori ---
function renderCategoryStock() {
    document.querySelectorAll("[data-stock-for]").forEach((el) => {
        const game = el.getAttribute("data-stock-for");
        const n = products.filter((p) => p.game === game).length;
        el.textContent = `${n} stock`;
    });
}

// --- Modal detail ---
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
let lastFocus = null;

function openModal(id) {
    const p = products.find((x) => x.id === Number(id));
    if (!p) return;
    lastFocus = document.activeElement;

    document.getElementById("modalGame").textContent = p.game;
    document.getElementById("modalTitle").textContent = p.title;
    document.getElementById("modalGameVal").textContent = p.game;
    document.getElementById("modalRank").textContent = p.rank;
    document.getElementById("modalSkin").textContent = p.skins;
    document.getElementById("modalDetail").textContent = p.detail;
    document.getElementById("modalPrice").textContent = formatRupiah(p.price);
    document.getElementById("modalWA").href = waLinkFor(p);

    const visual = document.getElementById("modalVisual");
    visual.className = "modal-visual " + gameClass(p.game);
    visual.textContent = p.icon;

    modalOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    modalClose.focus();
}

function closeModal() {
    modalOverlay.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
}

// --- Event: katalog controls ---
searchInput.addEventListener("input", (e) => { state.search = e.target.value; renderProducts(); });
filterGame.addEventListener("change", (e) => { state.game = e.target.value; syncCategoryActive(); renderProducts(); });
filterPrice.addEventListener("change", (e) => { state.price = e.target.value; renderProducts(); });
sortBy.addEventListener("change", (e) => { state.sort = e.target.value; renderProducts(); });

document.getElementById("resetFilter").addEventListener("click", () => {
    state.search = ""; state.game = "all"; state.price = "all"; state.sort = "newest";
    searchInput.value = ""; filterGame.value = "all"; filterPrice.value = "all"; sortBy.value = "newest";
    syncCategoryActive();
    renderProducts();
});

// --- Event: klik tombol detail (delegation) ---
productGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-detail]");
    if (btn) openModal(btn.getAttribute("data-detail"));
});

// --- Event: modal close ---
modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modalOverlay.hidden) closeModal(); });

// --- Event: kategori -> filter katalog ---
function syncCategoryActive() {
    document.querySelectorAll(".category-card").forEach((c) => {
        c.classList.toggle("active", c.getAttribute("data-category") === state.game);
    });
}
document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
        const game = card.getAttribute("data-category");
        // Toggle: klik kategori aktif lagi = reset ke semua
        state.game = (state.game === game) ? "all" : game;
        filterGame.value = state.game;
        syncCategoryActive();
        renderProducts();
        document.getElementById("katalog").scrollIntoView({ behavior: "smooth" });
    });
});

// --- Hamburger menu ---
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
function setMenu(open) {
    navLinks.classList.toggle("open", open);
    hamburger.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
}
hamburger.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

// --- FAQ accordion (smooth) ---
document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-question");
    const ans = item.querySelector(".faq-answer");
    btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        // tutup yang lain
        document.querySelectorAll(".faq-item.open").forEach((o) => {
            o.classList.remove("open");
            o.querySelector(".faq-answer").style.maxHeight = null;
            o.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
            item.classList.add("open");
            ans.style.maxHeight = ans.scrollHeight + "px";
            btn.setAttribute("aria-expanded", "true");
        }
    });
});

// --- Navbar active state on scroll ---
const sections = ["home", "katalog", "keunggulan", "transaksi", "faq"];
const navMap = {};
document.querySelectorAll(".nav-link").forEach((a) => {
    const href = a.getAttribute("href");
    if (href && href.startsWith("#")) navMap[href.slice(1)] = a;
});
const observer = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
        if (en.isIntersecting) {
            document.querySelectorAll(".nav-link").forEach((a) => a.classList.remove("active"));
            const link = navMap[en.target.id];
            if (link) link.classList.add("active");
        }
    });
}, { rootMargin: "-40% 0px -55% 0px" });
sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
});

// --- Back to top ---
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 500);
}, { passive: true });
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// --- Init ---
renderCategoryStock();
renderProducts();
