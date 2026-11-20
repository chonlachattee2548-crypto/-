"use strict";

const STORAGE = {
  products: "jgs.products.v1",
  users: "jgs.users.v1",
  events: "jgs.events.v1",
  content: "jgs.content.v1",
  login: "jgs.login.v1"
};
const SESSION_USER = "jgs.session.user";
const SESSION_ID = "jgs.session.id";
const DEMO_ADMIN = "admin@gemstone.demo";
const DEMO_PASSWORD = "GemstoneDemo1!";
const defaultProducts = [
  { id: "emerald-01", code: "EM-001", name: "มงกุฎเขียว", type: "Emerald", color: "emerald", cut: "Oval", origin: "โคลอมเบีย", price: 4250, stock: 3, lowStock: 2, published: true, description: "มรกตสีเขียวสดเฉดพฤกษา เจียระไนวงรีอย่างสมดุลและมีประกายเป็นธรรมชาติ", images: [] },
  { id: "sapphire-01", code: "SA-014", name: "สายน้ำรัตติกาล", type: "Sapphire", color: "sapphire", cut: "Cushion", origin: "ศรีลังกา", price: 3180, stock: 5, lowStock: 2, published: true, description: "ไพลินสีน้ำเงินเข้มที่เผยเฉดสีแตกต่างอย่างนุ่มนวลเมื่อกระทบแสง", images: [] },
  { id: "ruby-01", code: "RU-008", name: "บทกวีสีชาด", type: "Ruby", color: "ruby", cut: "Round", origin: "เมียนมา", price: 5720, stock: 0, lowStock: 1, published: true, description: "ทับทิมสีแดงอบอุ่น เจียระไนทรงกลมคลาสสิกพร้อมประกายสว่างตรงกลาง", images: [] },
  { id: "amethyst-01", code: "AM-022", name: "โมงยามสีม่วง", type: "Amethyst", color: "amethyst", cut: "Pear", origin: "บราซิล", price: 780, stock: 11, lowStock: 4, published: true, description: "อะเมทิสต์สีลาเวนเดอร์นุ่มนวล เจียระไนทรงหยดน้ำที่รับแสงได้อย่างงดงาม", images: [] },
  { id: "spinel-01", code: "SP-005", name: "กุหลาบกลางฟ้า", type: "Spinel", color: "spinel", cut: "Cushion", origin: "แทนซาเนีย", price: 2460, stock: 2, lowStock: 3, published: true, description: "สปิเนลสีชมพูกุหลาบ เนื้อใสและเจียระไนทรงคุชชั่นอย่างประณีต", images: [] },
  { id: "topaz-01", code: "TP-019", name: "ฟ้าใสสงบนิ่ง", type: "Topaz", color: "topaz", cut: "Oval", origin: "ไนจีเรีย", price: 940, stock: 8, lowStock: 3, published: true, description: "โทแพซสีฟ้าใสให้ความรู้สึกสงบ พร้อมรูปทรงวงรีที่สวมใส่ง่าย", images: [] },
  { id: "tourmaline-01", code: "TM-011", name: "ม่านพฤกษา", type: "Tourmaline", color: "tourmaline", cut: "Emerald", origin: "โมซัมบิก", price: 1850, stock: 1, lowStock: 2, published: true, description: "ทัวร์มาลีนสีเขียวป่าลึกกับเหลี่ยมเจียระไนเรขาคณิตที่คมชัด", images: [] },
  { id: "citrine-01", code: "CI-027", name: "แสงแรกสีทอง", type: "Citrine", color: "citrine", cut: "Oval", origin: "มาดากัสการ์", price: 640, stock: 6, lowStock: 2, published: true, description: "ซิทรินสีทองสว่าง ขัดเงาและเจียระไนทรงวงรีแบบคลาสสิก", images: [] }
];
const gemPalettes = {
  emerald: ["#83d0a6", "#237650", "#123e32", "#d9f6e8"],
  sapphire: ["#a9d8f6", "#3672bb", "#172e68", "#e2f5ff"],
  ruby: ["#ffb0a7", "#bd3148", "#74172d", "#ffe4df"],
  amethyst: ["#e2c9ff", "#9463cb", "#503478", "#f7eaff"],
  spinel: ["#ffc5d4", "#d35783", "#852e59", "#ffeaf1"],
  topaz: ["#b6eff2", "#42a9be", "#17677c", "#e8ffff"],
  tourmaline: ["#acd9a0", "#4c8f59", "#214d3d", "#eaffdc"],
  citrine: ["#ffe29a", "#d69a36", "#895818", "#fff4d2"],
  garnet: ["#f0a8a8", "#a53d52", "#641d36", "#ffe8e5"],
  opal: ["#bde6ee", "#75a9bc", "#53699d", "#f3fbff"]
};
const gemTypeLabels = {
  Emerald: "มรกต",
  Sapphire: "ไพลิน",
  Ruby: "ทับทิม",
  Amethyst: "อะเมทิสต์",
  Spinel: "สปิเนล",
  Topaz: "โทแพซ",
  Tourmaline: "ทัวร์มาลีน",
  Citrine: "ซิทริน",
  Garnet: "การ์เนต",
  Opal: "โอปอล"
};
const gemCutLabels = {
  Oval: "วงรี",
  Cushion: "คุชชั่น",
  Round: "กลม",
  Pear: "หยดน้ำ",
  Emerald: "เอเมอรัลด์"
};
const gemColorLabels = {
  emerald: "เขียวมรกต",
  sapphire: "น้ำเงินไพลิน",
  ruby: "แดงทับทิม",
  amethyst: "ม่วงอะเมทิสต์",
  spinel: "ชมพูกุหลาบ",
  topaz: "ฟ้าโทแพซ",
  tourmaline: "เขียวทัวร์มาลีน",
  citrine: "เหลืองซิทริน",
  garnet: "แดงการ์เนต",
  opal: "สีรุ้งโอปอล"
};

const app = document.querySelector("#app");
const dialog = document.querySelector("#app-dialog");
const dialogContent = document.querySelector("#dialog-content");
const toastRegion = document.querySelector("#toast-region");
let currentUser = null;
let currentRoute = "home";
let currentReport = "pir";
let currentDetailImage = 0;
let catalogQuery = "";
let catalogType = "";
let catalogAvailability = "";
let adminSearch = "";
let turntableSimulation = false;
let turntablePollTimer = null;
let turnstileWidgetId = null;
let turnstileToken = "";
let lastShownCommandResult = "";
let latestShowroomStatus = null;
let showroomStatusInitialized = false;
let serialPort = null;
let serialReader = null;
let serialDeviceInfo = null;
let serialReadBuffer = "";
let serialDisconnectHandler = null;
let showroomAccessPassword = "";
let showroomSecurityData = null;
let showroomSecurityError = "";
let showroomSecurityLoading = false;
let showroomUseLiveData = false;
let showroomSelectedDevice = 0;

function readStore(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw === null ? fallback : JSON.parse(raw);
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      throw new Error("พื้นที่จัดเก็บข้อมูลของเบราว์เซอร์เต็ม โปรดลบรูปภาพบางรายการหรือคืนค่าข้อมูลเดโมแล้วลองอีกครั้ง");
    }
    throw error;
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function uuid() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function hashPassword(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function initialize() {
  if (!localStorage.getItem(STORAGE.products)) writeStore(STORAGE.products, defaultProducts);
  if (!localStorage.getItem(STORAGE.events)) writeStore(STORAGE.events, []);
  if (!localStorage.getItem(STORAGE.content)) {
    writeStore(STORAGE.content, {
      headline: "ใกล้ชิดอัญมณีล้ำค่าแห่งธรรมชาติ",
      intro: "ค้นพบอัญมณีที่คัดสรรจากเอกลักษณ์ สีสัน และประกายที่งดงามเฉพาะตัว"
    });
  }
  if (!localStorage.getItem(STORAGE.login)) writeStore(STORAGE.login, {});

  const users = readStore(STORAGE.users, null);
  if (!users) {
    const adminHash = await hashPassword(DEMO_PASSWORD);
    writeStore(STORAGE.users, [{
      id: "demo-admin",
      username: "ผู้ดูแลระบบ",
      email: DEMO_ADMIN,
      passwordHash: adminHash,
      role: "admin",
      failedAttempts: 0,
      lockedUntil: 0,
      createdAt: new Date().toISOString()
    }]);
  }

  currentUser = getSessionUser();
  trackVisit();
  render();
}

function products() {
  return readStore(STORAGE.products, []);
}

function users() {
  return readStore(STORAGE.users, []);
}

function events() {
  return readStore(STORAGE.events, []);
}

function getSessionUser() {
  const id = sessionStorage.getItem(SESSION_USER);
  if (!id) return null;
  return users().find((user) => user.id === id) || null;
}

function sessionId() {
  let value = sessionStorage.getItem(SESSION_ID);
  if (!value) {
    value = uuid();
    sessionStorage.setItem(SESSION_ID, value);
  }
  return value;
}

function recordEvent(type, extra = {}) {
  const list = events();
  list.push({
    id: uuid(),
    type,
    sessionId: sessionId(),
    occurredAt: new Date().toISOString(),
    ...(currentUser?.role === "member" ? { memberId: currentUser.id } : {}),
    ...extra
  });
  writeStore(STORAGE.events, list);
}

function trackVisit() {
  if (sessionStorage.getItem("jgs.visit.recorded")) return;
  recordEvent("visit");
  sessionStorage.setItem("jgs.visit.recorded", "1");
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(value);
}

function formatDate(value, options = {}) {
  return new Intl.DateTimeFormat("th-TH", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options
  }).format(new Date(value));
}

function dateInThailand(value = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(value);
  const part = (type) => parts.find((item) => item.type === type).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function daysAgoInThailand(days) {
  return dateInThailand(new Date(Date.now() - days * 86400000));
}

function paletteFor(product, variant = 0) {
  const colors = gemPalettes[product.color] || gemPalettes.emerald;
  if (!variant) return colors;
  return [...colors.slice(variant % 4), ...colors.slice(0, variant % 4)];
}

function gemSvg(product, variant = 0) {
  const [light, mid, deep, gleam] = paletteFor(product, variant);
  const title = escapeHtml(product.name || "Gemstone");
  const id = `gem-${String(product.id || "sample").replace(/[^a-zA-Z0-9_-]/g, "")}-${variant}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 260" role="img" aria-label="${title}">
    <defs>
      <linearGradient id="${id}-main" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="${light}"/><stop offset=".48" stop-color="${mid}"/><stop offset="1" stop-color="${deep}"/>
      </linearGradient>
      <linearGradient id="${id}-edge" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="${gleam}" stop-opacity=".85"/><stop offset="1" stop-color="${deep}" stop-opacity=".8"/>
      </linearGradient>
    </defs>
    <ellipse cx="151" cy="219" rx="83" ry="13" fill="#16342d" opacity=".11"/>
    <path d="M92 59 119 35h62l29 24 31 64-91 115-91-115z" fill="url(#${id}-main)" stroke="${deep}" stroke-opacity=".42" stroke-width="2"/>
    <path d="M92 59 119 35 150 81Z" fill="${gleam}" opacity=".82"/>
    <path d="M119 35h62l-31 46Z" fill="${light}" opacity=".72"/>
    <path d="M181 35 210 59 150 81Z" fill="${mid}" opacity=".62"/>
    <path d="M92 59 150 81 59 123Z" fill="${light}" opacity=".42"/>
    <path d="M210 59 241 123 150 81Z" fill="${gleam}" opacity=".5"/>
    <path d="M59 123 150 81v42Z" fill="${deep}" opacity=".24"/>
    <path d="M150 81 241 123h-91Z" fill="${mid}" opacity=".38"/>
    <path d="M59 123h91v115Z" fill="${light}" opacity=".38"/>
    <path d="M150 123h91l-91 115Z" fill="${deep}" opacity=".42"/>
    <path d="M92 59 119 35h62l29 24 31 64-91 115-91-115z" fill="none" stroke="url(#${id}-edge)" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M119 35 150 81l31-46M92 59l58 22 60-22M59 123h182M150 81v157M59 123l91 42 91-42M59 123l91-42 91 42" fill="none" stroke="url(#${id}-edge)" stroke-width="2" stroke-linejoin="round"/>
    <path d="m105 65 34 12m41-31 16 15" stroke="#fff" stroke-opacity=".62" stroke-width="4" stroke-linecap="round"/>
  </svg>`;
}

function gemImage(product, variant = 0, extraClass = "") {
  const svg = encodeURIComponent(gemSvg(product, variant));
  return `<img class="${escapeHtml(extraClass)}" src="data:image/svg+xml,${svg}" alt="${escapeHtml(product.name)}">`;
}

function brandMark() {
  return `<svg class="brand-mark" viewBox="0 0 32 36" aria-hidden="true">
    <path d="m7 4 9-2 9 2 5 9-14 21L2 13z" fill="none" stroke="currentColor" stroke-width="1.7"/>
    <path d="m7 4 9 7 9-7m-23 9h28M16 11v21m-9-28 9 7 7-7m-16 9 9 21 9-21" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".8"/>
  </svg>`;
}

function header() {
  const admin = currentUser?.role === "admin";
  const loggedIn = Boolean(currentUser);
  const active = currentRoute.startsWith("product/") ? "catalog" : currentRoute;
  const nav = admin
    ? `<a href="#admin" ${active === "admin" ? 'aria-current="page"' : ""}>สินค้า</a>
       <a href="#admin/content">เนื้อหาเว็บไซต์</a>
       <a href="#dashboard" ${active === "dashboard" ? 'aria-current="page"' : ""}>แดชบอร์ด</a>
       <a href="#security" ${active === "security" ? 'aria-current="page"' : ""}>ความปลอดภัยตู้โชว์</a>
       <a href="#device" ${active === "device" ? 'aria-current="page"' : ""}>เชื่อมต่อบอร์ด</a>`
    : `<a href="#catalog" ${active === "catalog" ? 'aria-current="page"' : ""}>แคตตาล็อก</a>
       <a href="#live" ${active === "live" ? 'aria-current="page"' : ""}>ตู้โชว์อัญมณี</a>
       <a href="#security" ${active === "security" ? 'aria-current="page"' : ""}>ความปลอดภัยตู้โชว์</a>`;
  const accountAction = loggedIn
    ? `<button class="button button-quiet" data-action="logout">ออกจากระบบ</button>`
    : `<a class="button button-secondary" href="#login">เข้าสู่ระบบ</a><a class="button button-primary" href="#register">สมัครสมาชิก</a>`;
  return `<a class="skip-link" href="#main-content">ข้ามไปยังเนื้อหาหลัก</a>
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="#home" aria-label="หน้าแรกอัญมณี อเทลิเยร์">${brandMark()}<span class="brand-name">อัญมณี อเทลิเยร์</span></a>
        <button class="nav-toggle icon-button" data-action="toggle-nav" aria-label="เปิดเมนูนำทาง" aria-expanded="false">☰</button>
        <nav class="main-nav" id="main-nav" aria-label="เมนูหลัก">${nav}</nav>
        <div class="header-actions">${accountAction}</div>
      </div>
    </header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="footer-inner">
    <span>© ${new Date().getFullYear()} อัญมณี อเทลิเยร์ · เรื่องราวของอัญมณีจากธรรมชาติ</span>
    <nav class="footer-links" aria-label="เมนูท้ายหน้า">
      <a href="#catalog">คอลเลกชัน</a><a href="#live">ตู้โชว์</a>
      ${currentUser?.role === "admin" ? '<a href="#dashboard">รายงาน</a>' : ""}
    </nav>
  </div></footer>`;
}

function shell(content, options = {}) {
  const admin = options.admin || false;
  document.documentElement.lang = "th";
  app.innerHTML = `${header()}<main id="main-content" tabindex="-1">${content}</main>${footer()}`;
}

function publishedProducts() {
  return products().filter((product) => product.published);
}

function productStatus(product) {
  return Number(product.stock) > 0
    ? '<span class="status-pill status-available">มีสินค้า</span>'
    : '<span class="status-pill status-out">สินค้าหมด</span>';
}

function productCard(product) {
  return `<article class="gem-card">
    <a href="#product/${encodeURIComponent(product.id)}" class="gem-art" style="--gem-bg:${gemPalettes[product.color]?.[3] || "#edf5f2"}" aria-label="ดู ${escapeHtml(product.name)}">${gemImage(product)}</a>
    <div class="gem-card-body">
      <div class="gem-meta"><span>${escapeHtml(gemTypeLabels[product.type] || product.type)} · เจียระไน${escapeHtml(gemCutLabels[product.cut] || product.cut)}</span>${productStatus(product)}</div>
      <h3><a href="#product/${encodeURIComponent(product.id)}">${escapeHtml(product.name)}</a></h3>
      <div class="gem-card-bottom"><span class="gem-price">${formatPrice(Number(product.price))}<small>ต่อกรัม · บาท/กรัม</small></span>
        <a class="button button-quiet button-small" href="#product/${encodeURIComponent(product.id)}">ดูอัญมณี <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </article>`;
}

function homePage() {
  const content = readStore(STORAGE.content, { headline: defaultProducts[0].name, intro: "" });
  const featured = publishedProducts().slice(0, 4);
  return `<div class="container">
    <section class="hero" aria-labelledby="home-title">
      <div class="hero-copy">
        <p class="eyebrow">คอลเลกชันอัญมณีธรรมชาติที่คัดสรรอย่างตั้งใจ</p>
        <h1 id="home-title">${escapeHtml(content.headline)}</h1>
        <p>${escapeHtml(content.intro)}</p>
        <div class="hero-actions"><a class="button button-primary" href="#catalog">ชมคอลเลกชัน <span aria-hidden="true">↗</span></a>
          <a class="button button-secondary" href="#live">เข้าชมตู้โชว์อัญมณี</a></div>
      </div>
      <div class="hero-art">${gemImage({ id: "atelier-hero", name: "อัญมณีสีเขียวเจียระไน", color: "emerald" })}</div>
      <span class="hero-note">อัญมณีทุกชิ้นมีเรื่องราวเฉพาะตัว</span>
    </section>
    <section class="feature-row section-space" aria-label="แนวทางการคัดสรร">
      <div class="feature"><span class="feature-symbol" aria-hidden="true">✦</span><strong>คัดสรรอย่างพิถีพิถัน</strong><span>เลือกอัญมณีจากเอกลักษณ์และสีสันที่โดดเด่น</span></div>
      <div class="feature"><span class="feature-symbol" aria-hidden="true">◈</span><strong>เลือกชมได้ตามต้องการ</strong><span>ดูรายละเอียดและสถานะสินค้าได้โดยไม่ต้องสมัคร</span></div>
      <div class="feature"><span class="feature-symbol" aria-hidden="true">◎</span><strong>ชมบรรยากาศในตู้โชว์</strong><span>ติดตามการจัดแสดงอัญมณีภายในร้าน</span></div>
    </section>
    <section class="section-space" aria-labelledby="featured-title">
      <div class="section-heading"><div><p class="eyebrow">จากคอลเลกชัน</p><h2 id="featured-title">อัญมณีที่ชวนให้ชมใกล้ ๆ</h2></div>
        <a class="button button-secondary" href="#catalog">ดูอัญมณีทั้งหมด <span aria-hidden="true">→</span></a></div>
      <div class="collection-grid">${featured.length ? featured.map(productCard).join("") : emptyState("ยังไม่มีอัญมณีเผยแพร่", "อัญมณีใหม่จะแสดงที่นี่เมื่อมีการอัปเดตคอลเลกชัน")}</div>
    </section>
    <section class="story-band section-space">
      <div><p class="eyebrow">ภายในตู้โชว์</p><h2>ชมประกายอัญมณีจากทุกเหลี่ยมมุม</h2><p>เข้าชมตู้โชว์และตรวจสอบสถานะกล้องกับแท่นหมุนได้อย่างชัดเจน หากอุปกรณ์ยังไม่เชื่อมต่อ ระบบจะแจ้งสถานะตามจริง</p>
        <div class="hero-actions"><a class="button button-primary" href="#live">เปิดหน้าตู้โชว์</a></div>
      </div>
      <svg class="story-mark" viewBox="0 0 220 190" role="img" aria-label="ภาพประกอบอัญมณีรูปทรงเรขาคณิต">
        <path d="m47 38 26-23h74l27 23 32 50-73 89L60 88z" fill="none" stroke="currentColor" stroke-width="2"/>
        <path d="m47 38 63 23 64-23m-127 50h146m-127 0 18 73 26-62 26 62 18-73m-44-27v89M73 15l37 46 37-46" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".8"/>
      </svg>
    </section>
  </div>`;
}

function emptyState(title, message) {
  return `<div class="empty-state"><strong>${escapeHtml(title)}</strong>${escapeHtml(message)}</div>`;
}

function catalogPage() {
  const types = [...new Set(publishedProducts().map((product) => product.type))].sort();
  let filtered = publishedProducts().filter((product) => {
    const queryMatch = !catalogQuery || `${product.name} ${product.type} ${product.code} ${product.origin}`.toLowerCase().includes(catalogQuery.toLowerCase());
    const typeMatch = !catalogType || product.type === catalogType;
    const availableMatch = !catalogAvailability || (catalogAvailability === "available" ? Number(product.stock) > 0 : Number(product.stock) === 0);
    return queryMatch && typeMatch && availableMatch;
  });
  const noProducts = publishedProducts().length === 0;
  return `<div class="container">
    <div class="section-heading"><div><p class="eyebrow">คอลเลกชันอัญมณี</p><h1>แคตตาล็อกอัญมณี</h1><p class="lede">ชมอัญมณีธรรมชาติ พร้อมข้อมูลสี การเจียระไน และเอกลักษณ์ของแต่ละชิ้น</p></div></div>
    <form class="toolbar" id="catalog-search">
      <label class="search-field"><span class="visually-hidden">ค้นหาอัญมณี</span><span class="search-icon" aria-hidden="true">⌕</span>
        <input class="form-control" name="query" type="search" value="${escapeHtml(catalogQuery)}" placeholder="ค้นหาจากชื่อ ประเภท แหล่งกำเนิด หรือรหัส">
      </label>
      <div class="filter-row">
        <label><span class="visually-hidden">กรองตามประเภทอัญมณี</span><select class="form-control" name="type">
          <option value="">อัญมณีทั้งหมด</option>${types.map((type) => `<option value="${escapeHtml(type)}" ${catalogType === type ? "selected" : ""}>${escapeHtml(gemTypeLabels[type] || type)}</option>`).join("")}
        </select></label>
        <label><span class="visually-hidden">กรองตามสถานะสินค้า</span><select class="form-control" name="availability">
          <option value="">สถานะทั้งหมด</option><option value="available" ${catalogAvailability === "available" ? "selected" : ""}>มีสินค้า</option><option value="out" ${catalogAvailability === "out" ? "selected" : ""}>สินค้าหมด</option>
        </select></label>
        <button class="button button-primary" type="submit">ค้นหา</button>
        <button class="button button-secondary" type="button" data-action="clear-filters">ล้างตัวกรอง</button>
      </div>
    </form>
    <p class="result-count" role="status">${noProducts ? "กำลังเตรียมคอลเลกชันอัญมณี" : `พบอัญมณี ${filtered.length} รายการ`}</p>
    <div class="collection-grid">${noProducts ? emptyState("ยังไม่มีอัญมณีเผยแพร่", "โปรดกลับมาตรวจสอบอีกครั้งหลังอัปเดตคอลเลกชัน") : filtered.length ? filtered.map(productCard).join("") : emptyState("ไม่พบอัญมณีตามเงื่อนไข", "ลองเปลี่ยนคำค้นหา หรือล้างตัวกรองบางรายการ")}</div>
  </div>`;
}

function detailPage(productId) {
  const product = publishedProducts().find((item) => item.id === productId);
  if (!product) {
    return `<div class="container">${emptyState("ไม่พบอัญมณีรายการนี้", "อัญมณีอาจถูกนำออกจากคอลเลกชัน ลองเลือกดูอัญมณีรายการอื่น")}<p class="hero-actions"><a class="button button-primary" href="#catalog">กลับไปแคตตาล็อก</a></p></div>`;
  }
  const viewed = JSON.parse(sessionStorage.getItem("jgs.viewed.products") || "[]");
  if (!viewed.includes(product.id)) {
    recordEvent("product_view", { productId: product.id });
    if (currentUser?.role === "member") {
      const history = readStore("jgs.member.history.v1", []);
      history.push({ memberId: currentUser.id, productId: product.id, occurredAt: new Date().toISOString(), eventId: events().at(-1).id });
      writeStore("jgs.member.history.v1", history);
    }
    sessionStorage.setItem("jgs.viewed.products", JSON.stringify([...viewed, product.id]));
  }
  const images = Array.isArray(product.images) ? product.images : [];
  const thumbnails = Math.max(1, images.length);
  const selectedPhoto = images[currentDetailImage] || null;
  const art = selectedPhoto
    ? `<img src="${selectedPhoto}" alt="ภาพอัญมณี ${escapeHtml(product.name)} ภาพที่ ${currentDetailImage + 1}">`
    : gemImage(product, currentDetailImage);
  return `<div class="container">
    <p><a class="button button-quiet button-small" href="#catalog">← กลับไปคอลเลกชัน</a></p>
    <section class="detail-layout" aria-labelledby="product-title">
      <div><div class="detail-art">${art}</div>
        ${thumbnails > 1 ? `<div class="detail-thumbs" aria-label="ภาพอัญมณี">${images.map((image, index) => `<button type="button" data-action="select-photo" data-index="${index}" aria-label="แสดงภาพที่ ${index + 1}"><img src="${image}" alt=""></button>`).join("")}</div>` : ""}
      </div>
      <div class="detail-copy">
        <p class="eyebrow">${escapeHtml(gemTypeLabels[product.type] || product.type)} · ${escapeHtml(product.code)}</p><h1 id="product-title">${escapeHtml(product.name)}</h1>
        ${productStatus(product)}
        <p class="detail-price">${formatPrice(Number(product.price))} <small>ต่อกรัม · บาท/กรัม</small></p>
        <p>${escapeHtml(product.description)}</p>
        <div class="detail-facts">
          <div class="detail-fact"><span>ประเภทอัญมณี</span><strong>${escapeHtml(gemTypeLabels[product.type] || product.type)}</strong></div>
          <div class="detail-fact"><span>การเจียระไน</span><strong>${escapeHtml(gemCutLabels[product.cut] || product.cut)}</strong></div>
          <div class="detail-fact"><span>สี</span><strong>${escapeHtml(gemColorLabels[product.color] || product.color)}</strong></div>
          <div class="detail-fact"><span>แหล่งกำเนิด</span><strong>${escapeHtml(product.origin || "ไม่ระบุ")}</strong></div>
        </div>
        <p class="field-hint">ราคาแสดงเป็นเงินบาทต่อกรัม สถานะสินค้าคำนวณจากจำนวนคงเหลือล่าสุด</p>
      </div>
    </section>
  </div>`;
}

function livePage() {
  const isLocalPreview = ["localhost", "127.0.0.1"].includes(location.hostname);
  const simulatorPanel = isLocalPreview
    ? `<div class="simulator-panel">
        <strong>ทดสอบระหว่างรอบอร์ด</strong>
        <p>โหมดจำลองทดสอบได้เฉพาะหน้าจอ ไม่เชื่อมต่อหรือสั่งมอเตอร์จริง</p>
        <button class="button button-secondary" id="simulator-button" type="button" data-action="toggle-simulator">${turntableSimulation ? "ปิดโหมดจำลอง" : "เริ่มโหมดจำลอง"}</button>
      </div>`
    : "";
  return `<div class="container">
    <div class="section-heading"><div><p class="eyebrow">ชมการจัดแสดง</p><h1>ตู้โชว์อัญมณี</h1><p class="lede">ชมอัญมณีในตู้โชว์และตรวจสอบสถานะอุปกรณ์ก่อนสั่งหมุนแท่น</p></div></div>
    <section class="live-grid" aria-label="ตู้โชว์อัญมณี">
      <div>
        <div class="video-panel" role="status">
          <div class="video-empty"><div class="video-symbol" aria-hidden="true">◉</div><h2>ยังไม่ได้เชื่อมต่อภาพสด</h2>
            <p>ต้นแบบนี้ยังไม่ได้ตั้งค่ากล้องหรือสัญญาณถ่ายทอดสด จึงไม่แสดงภาพนิ่งแทนภาพสด</p>
            <button class="button button-secondary" type="button" data-action="retry-stream">ลองเชื่อมต่ออีกครั้ง</button>
          </div>
        </div>
        <p class="live-status notice notice-info" id="stream-message">สถานะกล้อง: ไม่ได้เชื่อมต่อ · สถานะสัญญาณภาพ: ยังไม่ได้ตั้งค่า</p>
      </div>
      <aside class="live-controls" aria-labelledby="turntable-title">
        <h2 id="turntable-title">ควบคุมแท่นหมุน</h2>
        <p>ลูกค้าส่งคำสั่งได้ไม่เกินหนึ่งครั้งต่อนาที และส่งได้เมื่อบอร์ดรายงานว่าพร้อมเท่านั้น</p>
        <div class="device-list">
          <div class="device-row"><span>กล้องตู้โชว์</span><span class="status-pill status-neutral" id="camera-device-status">ยังไม่ได้ตั้งค่า</span></div>
          <div class="device-row"><span>ตัวควบคุมมอเตอร์</span><span class="status-pill status-neutral" id="motor-device-status">ยังไม่ได้เชื่อมต่อ</span></div>
          <div class="device-row"><span>แท่นหมุน</span><span class="status-pill status-neutral" id="turntable-device-status">ไม่ทราบสถานะ</span></div>
        </div>
        <div id="turnstile-container" class="turnstile-container"></div>
        <button class="button button-primary" id="rotate-button" type="button" data-action="rotate" aria-describedby="rotate-note" disabled>หมุนแท่น 360°</button>
        <p id="rotate-note" class="showroom-note" role="status">ยังไม่ได้ตั้งค่าบริการกลาง จึงไม่มีการส่งคำสั่งไปยังบอร์ด</p>
        ${simulatorPanel}
      </aside>
    </section>
  </div>`;
}

function showroomApiBase() {
  const configured = String(window.GEMSTONE_DEVICE_CONFIG?.apiBase || "").trim();
  if (!configured) return "";
  try {
    const url = new URL(configured);
    if (url.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(url.hostname)) return "";
    return url.href.replace(/\/$/, "");
  } catch {
    return "";
  }
}

function setDeviceBadge(id, label, style) {
  const element = document.querySelector(`#${id}`);
  if (!element) return;
  element.textContent = label;
  element.className = `status-pill status-${style}`;
}

function setShowroomMessage(message, kind = "info") {
  const note = document.querySelector("#rotate-note");
  if (!note) return;
  note.textContent = message;
  note.className = `showroom-note notice-${kind}`;
}

function updateRotateButton(status = null) {
  const button = document.querySelector("#rotate-button");
  if (!button) return;
  if (turntableSimulation) {
    button.disabled = Boolean(status?.busy);
    return;
  }
  button.disabled = !status
    || !status.remoteControlEnabled
    || !status.deviceOnline
    || !status.motorReady
    || status.commandBusy
    || !turnstileToken;
}

function showTurnstile() {
  const config = window.GEMSTONE_DEVICE_CONFIG || {};
  const siteKey = String(config.turnstileSiteKey || "").trim();
  const container = document.querySelector("#turnstile-container");
  if (!siteKey || !container || turnstileWidgetId !== null) return;

  const renderWidget = () => {
    if (!window.turnstile || !container.isConnected || turnstileWidgetId !== null) return;
    turnstileWidgetId = window.turnstile.render(container, {
      sitekey: siteKey,
      action: "rotate",
      callback: (token) => {
        turnstileToken = token;
        updateRotateButton(latestShowroomStatus);
      },
      "expired-callback": () => {
        turnstileToken = "";
        updateRotateButton(latestShowroomStatus);
      },
      "error-callback": () => {
        turnstileToken = "";
        updateRotateButton(latestShowroomStatus);
        setShowroomMessage("ยืนยันความปลอดภัยไม่สำเร็จ โปรดลองโหลดหน้าใหม่", "warning");
      }
    });
  };

  if (window.turnstile) {
    renderWidget();
    return;
  }
  let script = document.querySelector("#turnstile-script");
  if (!script) {
    script = document.createElement("script");
    script.id = "turnstile-script";
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", renderWidget, { once: true });
    document.head.append(script);
  } else {
    script.addEventListener("load", renderWidget, { once: true });
  }
}

function updateShowroomFromStatus(status) {
  const notifyNewResult = showroomStatusInitialized;
  latestShowroomStatus = status;
  setDeviceBadge("camera-device-status", "ยังไม่ได้ตั้งค่า", "neutral");
  if (status.deviceOnline) {
    setDeviceBadge("motor-device-status", status.motorReady ? "เชื่อมต่อและพร้อม" : "เชื่อมต่อ แต่ยังไม่พร้อม", status.motorReady ? "available" : "warning");
    setDeviceBadge("turntable-device-status", status.commandBusy ? "กำลังทำงาน" : status.motorReady ? "พร้อมรับคำสั่ง" : "รอตรวจสอบ", status.commandBusy ? "warning" : status.motorReady ? "available" : "neutral");
  } else {
    setDeviceBadge("motor-device-status", "ไม่ได้เชื่อมต่อ", "neutral");
    setDeviceBadge("turntable-device-status", "ไม่ทราบสถานะ", "neutral");
  }

  if (!window.GEMSTONE_DEVICE_CONFIG?.turnstileSiteKey) {
    setShowroomMessage("บริการกลางยังไม่ได้ตั้งค่า Turnstile สำหรับป้องกันการสั่งงานอัตโนมัติ", "warning");
  } else if (!status.remoteControlEnabled) {
    setShowroomMessage("บริการกลางยังปิดการสั่งมอเตอร์จริงไว้ เพื่อรอทดสอบอุปกรณ์และการหยุดฉุกเฉิน", "info");
  } else if (!status.deviceOnline) {
    setShowroomMessage("ยังไม่พบบอร์ดออนไลน์ จึงไม่ส่งคำสั่งหมุน", "info");
  } else if (!status.motorReady) {
    setShowroomMessage("บอร์ดเชื่อมต่อแล้ว แต่ยังไม่ได้รายงานว่ามอเตอร์พร้อม", "warning");
  } else if (status.commandBusy) {
    setShowroomMessage("มีคำสั่งอยู่ระหว่างดำเนินการ รอผลจากบอร์ดก่อน", "warning");
  } else {
    setShowroomMessage("บอร์ดพร้อม คำสั่งจะถูกส่งเมื่อยืนยันความปลอดภัยและผ่านช่วงพักการสั่ง", "info");
  }

  if (notifyNewResult && status.lastResult?.id && status.lastResult.id !== lastShownCommandResult) {
    lastShownCommandResult = status.lastResult.id;
    if (status.lastResult.status === "completed") showToast("บอร์ดยืนยันว่าทำคำสั่งเสร็จแล้ว");
    else showToast(status.lastResult.message || "บอร์ดไม่ได้ยืนยันว่าคำสั่งเสร็จ", "warning");
  }
  if (!showroomStatusInitialized) lastShownCommandResult = status.lastResult?.id || "";
  showroomStatusInitialized = true;
  updateRotateButton(status);
}

async function pollShowroomStatus() {
  clearTimeout(turntablePollTimer);
  turntablePollTimer = null;
  if (currentRoute !== "live" || turntableSimulation) return;
  const base = showroomApiBase();
  if (!base) return;

  try {
    const response = await fetch(`${base}/api/status`, { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error("ไม่สามารถอ่านสถานะบริการกลางได้");
    updateShowroomFromStatus(await response.json());
  } catch (error) {
    setDeviceBadge("motor-device-status", "ตรวจสอบบริการไม่ได้", "warning");
    setDeviceBadge("turntable-device-status", "ไม่ทราบสถานะ", "neutral");
    setShowroomMessage("ติดต่อบริการกลางไม่ได้ จึงปิดปุ่มสั่งหมุนไว้", "warning");
    updateRotateButton(null);
    console.error("อ่านสถานะอุปกรณ์ไม่สำเร็จ:", error);
  } finally {
    if (currentRoute === "live" && !turntableSimulation) {
      turntablePollTimer = setTimeout(pollShowroomStatus, 5000);
    }
  }
}

function initializeShowroom() {
  turnstileWidgetId = null;
  turnstileToken = "";
  latestShowroomStatus = null;
  showroomStatusInitialized = false;
  const simulatorButton = document.querySelector("#simulator-button");
  if (simulatorButton) simulatorButton.setAttribute("aria-pressed", String(turntableSimulation));

  if (turntableSimulation) {
    setDeviceBadge("motor-device-status", "จำลองการเชื่อมต่อ", "info");
    setDeviceBadge("turntable-device-status", "จำลอง", "info");
    setShowroomMessage("โหมดจำลองทำงานอยู่ การสั่งหมุนด้านล่างไม่ติดต่อบอร์ดจริง", "info");
    updateRotateButton({ busy: false });
    return;
  }

  if (!showroomApiBase()) {
    setShowroomMessage("ยังไม่ได้ตั้งค่า URL ของบริการกลาง จึงไม่มีการส่งคำสั่งไปยังบอร์ด", "info");
    updateRotateButton(null);
    return;
  }

  if (!window.GEMSTONE_DEVICE_CONFIG?.turnstileSiteKey) {
    setShowroomMessage("บริการกลางยังไม่ได้ตั้งค่า Turnstile สำหรับป้องกันการสั่งงานอัตโนมัติ", "warning");
  } else {
    showTurnstile();
  }
  void pollShowroomStatus();
}

function runSimulatedRotation() {
  const button = document.querySelector("#rotate-button");
  if (!button || button.disabled) return;
  updateRotateButton({ busy: true });
  setDeviceBadge("turntable-device-status", "กำลังจำลอง", "warning");
  setShowroomMessage("กำลังจำลองการรับคำสั่งจากบอร์ด (ไม่ใช่การหมุนจริง)", "warning");
  setTimeout(() => {
    if (currentRoute !== "live" || !turntableSimulation) return;
    setDeviceBadge("turntable-device-status", "จำลองเสร็จ", "info");
    setShowroomMessage("จบการจำลองแล้ว ไม่มีการสั่งหรือขยับมอเตอร์จริง", "info");
    updateRotateButton({ busy: false });
  }, 1400);
}

async function sendRemoteRotation() {
  const base = showroomApiBase();
  if (!base || !turnstileToken) return;
  const button = document.querySelector("#rotate-button");
  if (button) button.disabled = true;
  setShowroomMessage("กำลังส่งคำขอไปตรวจสอบบริการกลาง", "info");

  try {
    const response = await fetch(`${base}/api/commands/rotate`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ turnstileToken })
    });
    const result = await response.json();
    if (!response.ok) {
      const messages = {
        device_not_ready: "บอร์ดยังไม่พร้อมรับคำสั่ง",
        command_busy: "มีคำสั่งกำลังทำงาน โปรดลองภายหลัง",
        cooldown: `ระบบพักการสั่งงาน โปรดลองอีกครั้งใน ${result.retryAfterSeconds || 60} วินาที`,
        verification_required: "การยืนยันความปลอดภัยหมดอายุ โปรดยืนยันใหม่",
        remote_control_disabled: "ระบบยังไม่เปิดควบคุมมอเตอร์จริง"
      };
      throw new Error(messages[result.error] || "บริการกลางไม่รับคำสั่งนี้");
    }
    setShowroomMessage("บริการกลางรับคำขอเข้าคิวแล้ว กำลังรอผลยืนยันจากบอร์ด", "info");
    showToast("รับคำขอแล้ว ยังไม่ถือว่าหมุนเสร็จจนกว่าบอร์ดจะยืนยัน");
  } catch (error) {
    setShowroomMessage(error.message || "ส่งคำขอไม่สำเร็จ", "warning");
    showToast(error.message || "ส่งคำขอไม่สำเร็จ", "error");
  } finally {
    turnstileToken = "";
    if (window.turnstile && turnstileWidgetId !== null) window.turnstile.reset(turnstileWidgetId);
    await pollShowroomStatus();
  }
}

function authPage(mode) {
  const isRegister = mode === "register";
  const title = isRegister ? "สมัครสมาชิก" : "ยินดีต้อนรับกลับ";
  const description = isRegister ? "บันทึกประวัติอัญมณีที่คุณสนใจ" : "เข้าสู่ระบบเพื่อใช้งานบัญชีของคุณ";
  const form = isRegister
    ? `<label class="field"><span class="field-label">ชื่อผู้ใช้</span><input class="form-control" name="username" autocomplete="username" required minlength="3" maxlength="40"></label>
       <label class="field"><span class="field-label">อีเมล</span><input class="form-control" name="email" type="email" autocomplete="email" required maxlength="160"></label>
       <label class="field"><span class="field-label">รหัสผ่าน</span><input class="form-control" name="password" type="password" autocomplete="new-password" required minlength="8" maxlength="128"><span class="field-hint">ใช้รหัสผ่านอย่างน้อย 8 ตัวอักษร</span></label>
       <label class="field"><span class="field-label">ยืนยันรหัสผ่าน</span><input class="form-control" name="confirmPassword" type="password" autocomplete="new-password" required minlength="8" maxlength="128"></label>
       <button class="button button-primary" type="submit">สร้างบัญชีสมาชิก</button>`
    : `<label class="field"><span class="field-label">อีเมล</span><input class="form-control" name="email" type="email" autocomplete="username" required maxlength="160"></label>
       <label class="field"><span class="field-label">รหัสผ่าน</span><input class="form-control" name="password" type="password" autocomplete="current-password" required maxlength="128"></label>
       <button class="button button-primary" type="submit">เข้าสู่ระบบ</button>`;
  shell(`<div class="container"><div class="auth-wrap"><section class="auth-panel">
    <p class="eyebrow">อัญมณี อเทลิเยร์</p><h1>${title}</h1><p>${description}</p>
    <div id="auth-feedback" aria-live="polite"></div>
    <form class="auth-form" id="${isRegister ? "register-form" : "login-form"}">${form}</form>
    ${isRegister ? `<p class="auth-footer">มีบัญชีแล้ว? <a href="#login">เข้าสู่ระบบ</a></p>` : `<p class="auth-footer"><button type="button" data-action="forgot-password">ลืมรหัสผ่าน?</button><br>ยังไม่มีบัญชี? <a href="#register">สมัครสมาชิก</a></p>`}
    ${!isRegister ? `<div class="demo-note"><strong>บัญชีสำหรับทดลองระบบ</strong><br>อีเมล: ${DEMO_ADMIN}<br>รหัสผ่าน: ${DEMO_PASSWORD}<br><small>ใช้สำหรับทดลองเท่านั้น ห้ามใช้รหัสผ่านจริงหรือรหัสที่ใช้กับบริการอื่น</small></div>` : ""}
  </section></div></div>`);
}

function adminNav(active) {
  const links = [
    ["admin", "สินค้าและสต็อก", "ADM-01 · ADM-04"],
    ["admin/content", "เนื้อหาเว็บไซต์", "ADM-05"],
    ["dashboard", "แดชบอร์ด", "DB-01 · DB-05"],
    ["security", "ความปลอดภัยตู้โชว์", "ThingsBoard · API"],
    ["device", "เชื่อมต่อบอร์ด", "ESP32 · USB / Wi-Fi"]
  ];
  return `<aside class="admin-side" aria-label="เมนูผู้ดูแล"><span class="admin-side-title">จัดการร้าน</span>${links.map(([route, label, code]) => `<button type="button" data-route="${route}" aria-current="${active === route ? "page" : "false"}">${label}<br><small>${code}</small></button>`).join("")}<button type="button" data-action="reset-demo">คืนค่าข้อมูลเดโม</button></aside>`;
}

function adminPage() {
  if (currentUser?.role !== "admin") {
    navigate(currentUser ? "home" : "login");
    return "";
  }
  const list = products().filter((product) => `${product.name} ${product.code} ${product.type}`.toLowerCase().includes(adminSearch.toLowerCase()));
  return `<div class="container"><div class="admin-shell">${adminNav("admin")}
    <section class="admin-content"><p class="eyebrow">ผู้ดูแลระบบ · ADM-01 ถึง ADM-04</p><h1>สินค้าและสต็อก</h1><p class="lede">จัดการข้อมูลอัญมณี ราคา รูปภาพ และจำนวนคงเหลือ</p>
      <div class="admin-toolbar"><label class="search-field"><span class="visually-hidden">ค้นหาสินค้า</span><span class="search-icon" aria-hidden="true">⌕</span><input class="form-control" id="admin-search" type="search" value="${escapeHtml(adminSearch)}" placeholder="ค้นหาชื่อ รหัส หรือประเภท"></label>
        <button class="button button-primary" data-action="add-product">เพิ่มสินค้า</button></div>
      <section class="data-panel"><div class="table-wrap"><table><thead><tr><th>สินค้า</th><th>ประเภท</th><th>ราคา / กรัม</th><th>คงเหลือ</th><th>เผยแพร่</th><th>จัดการ</th></tr></thead>
      <tbody>${list.map((product) => `<tr><td><div class="table-product"><span class="table-gem">${gemImage(product)}</span><span><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product.code)}</small></span></div></td>
        <td>${escapeHtml(gemTypeLabels[product.type] || product.type)}</td><td>${formatPrice(Number(product.price))}</td><td>${Number(product.stock)} ชิ้น${product.lowStock === "" || product.lowStock == null ? " · ยังไม่กำหนดเกณฑ์" : ` · ใกล้หมด ≤ ${Number(product.lowStock)}`}</td>
        <td>${product.published ? '<span class="status-pill status-available">เผยแพร่</span>' : '<span class="status-pill status-neutral">ซ่อน</span>'}</td>
        <td><div class="table-actions"><button class="button button-secondary button-small" data-action="edit-product" data-id="${escapeHtml(product.id)}">แก้ไข</button><button class="button button-quiet button-small" data-action="stock-product" data-id="${escapeHtml(product.id)}">ปรับสต็อก</button><button class="button button-quiet button-small" data-action="delete-product" data-id="${escapeHtml(product.id)}">นำออก</button></div></td></tr>`).join("") || `<tr><td colspan="6">${emptyState("ไม่พบสินค้า", "ลองเปลี่ยนคำค้นหา หรือเพิ่มสินค้าใหม่")}</td></tr>`}</tbody></table></div></section>
    </section></div></div>`;
}

function contentAdminPage() {
  if (currentUser?.role !== "admin") {
    navigate(currentUser ? "home" : "login");
    return "";
  }
  const content = readStore(STORAGE.content, { headline: "", intro: "" });
  return `<div class="container"><div class="admin-shell">${adminNav("admin/content")}
    <section class="admin-content"><p class="eyebrow">ผู้ดูแลระบบ · ADM-05</p><h1>เนื้อหาเว็บไซต์</h1><p class="lede">แก้ไขข้อความบนหน้าแรกและตรวจสอบก่อนบันทึก</p>
      <form class="data-panel dialog-content-form" id="content-form">
        <label class="field"><span class="field-label">พาดหัวหน้าแรก</span><input class="form-control" name="headline" value="${escapeHtml(content.headline)}" required maxlength="120"></label>
        <label class="field"><span class="field-label">คำแนะนำ</span><textarea class="form-control" name="intro" required maxlength="360">${escapeHtml(content.intro)}</textarea></label>
        <div><button class="button button-primary" type="submit">บันทึกเนื้อหา</button></div>
      </form>
    </section></div></div>`;
}

function getReportRange() {
  const start = document.querySelector("#report-start")?.value || daysAgoInThailand(30);
  const end = document.querySelector("#report-end")?.value || dateInThailand();
  return { start, end };
}

function reportsForRange(start, end) {
  const startTime = new Date(`${start}T00:00:00+07:00`).getTime();
  const endTime = new Date(`${end}T23:59:59.999+07:00`).getTime();
  return events().filter((event) => {
    const time = new Date(event.occurredAt).getTime();
    return time >= startTime && time <= endTime;
  });
}

function dashboardReportData(report, rangeEvents) {
  if (report === "pir") return { count: rangeEvents.filter((event) => event.type === "pir").length, label: "เหตุการณ์ตรวจจับการเคลื่อนไหว", empty: "ไม่มีข้อมูลเหตุการณ์ตรวจจับการเคลื่อนไหวในช่วงเวลาที่เลือก" };
  if (report === "visits") return { count: rangeEvents.filter((event) => event.type === "visit").length, label: "ครั้งเข้าชมเว็บไซต์", empty: "ไม่มีข้อมูลการเข้าชมในช่วงเวลาที่เลือก" };
  if (report === "inventory") {
    const items = products();
    return { count: items.length, label: "รายการสินค้า", stock: items.reduce((total, item) => total + Number(item.stock || 0), 0), out: items.filter((item) => Number(item.stock) === 0).length,
      low: items.filter((item) => item.lowStock !== "" && item.lowStock != null && Number(item.stock) > 0 && Number(item.stock) <= Number(item.lowStock)).length, empty: items.length ? "" : "ไม่มีรายการสินค้า" };
  }
  const grouped = new Map();
  rangeEvents.filter((event) => event.type === "product_view").forEach((event) => {
    const product = products().find((item) => item.id === event.productId);
    const key = event.productId;
    if (product) grouped.set(key, { name: product.name, count: (grouped.get(key)?.count || 0) + 1 });
  });
  return { rows: [...grouped.values()].sort((a, b) => b.count - a.count), label: "จำนวนครั้งเปิดดูสินค้า", empty: "ไม่มีข้อมูลการเปิดดูสินค้าในช่วงเวลาที่เลือก" };
}

function reportTrend(report, start, end, rangeEvents) {
  const eventType = report === "pir" ? "pir" : "visit";
  const startTime = new Date(`${start}T12:00:00+07:00`).getTime();
  const endTime = new Date(`${end}T12:00:00+07:00`).getTime();
  const dayCount = Math.max(1, Math.round((endTime - startTime) / 86_400_000) + 1);
  const bucketCount = Math.min(dayCount, 30);
  const buckets = Array.from({ length: bucketCount }, (_, index) => ({
    label: new Intl.DateTimeFormat("th-TH", { timeZone: "Asia/Bangkok", day: "numeric", month: "short" })
      .format(new Date(startTime + Math.floor(index * dayCount / bucketCount) * 86_400_000)),
    count: 0
  }));
  rangeEvents.filter((event) => event.type === eventType).forEach((event) => {
    const eventTime = new Date(event.occurredAt).getTime();
    const dayIndex = Math.floor((eventTime - startTime) / 86_400_000);
    if (dayIndex < 0 || dayIndex >= dayCount) return;
    const bucketIndex = Math.min(bucketCount - 1, Math.floor(dayIndex * bucketCount / dayCount));
    buckets[bucketIndex].count += 1;
  });
  return buckets;
}

function renderTrendChart(report, start, end, rangeEvents) {
  const buckets = reportTrend(report, start, end, rangeEvents);
  const width = 760;
  const height = 270;
  const left = 44;
  const right = 744;
  const top = 24;
  const bottom = 210;
  const max = Math.max(1, ...buckets.map((bucket) => bucket.count));
  const points = buckets.map((bucket, index) => ({
    x: left + (buckets.length === 1 ? 0 : index * (right - left) / (buckets.length - 1)),
    y: bottom - bucket.count / max * (bottom - top),
    ...bucket
  }));
  const line = points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
  const area = `${line} L${right},${bottom} L${left},${bottom} Z`;
  const yLabels = new Set();
  const grid = Array.from({ length: 4 }, (_, index) => {
    const y = top + index * (bottom - top) / 3;
    const value = buckets.every((bucket) => bucket.count === 0) ? 0 : Math.round(max * (3 - index) / 3);
    const label = yLabels.has(value) ? "" : `<text x="${left - 12}" y="${y + 4}" text-anchor="end">${value}</text>`;
    yLabels.add(value);
    return `<g class="chart-gridline"><line x1="${left}" y1="${y}" x2="${right}" y2="${y}"></line>${label}</g>`;
  }).join("");
  const labelIndexes = [...new Set([0, Math.floor((points.length - 1) / 2), points.length - 1])];
  const labels = labelIndexes.map((index) => {
    const point = points[index];
    return `<text class="chart-axis-label" x="${point.x}" y="${bottom + 27}" text-anchor="${index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"}">${escapeHtml(point.label)}</text>`;
  }).join("");
  const markers = points.map((point) => `<circle class="chart-point" cx="${point.x}" cy="${point.y}" r="${points.length > 30 ? 2 : 3}"><title>${escapeHtml(point.label)}: ${point.count} ${report === "pir" ? "เหตุการณ์" : "ครั้งเข้าชม"}</title></circle>`).join("");
  const title = report === "pir" ? "แนวโน้มการตรวจจับการเคลื่อนไหว" : "แนวโน้มการเข้าชมเว็บไซต์";
  return `<figure class="report-chart">
    <figcaption class="chart-heading"><div><h2>${title}</h2><p>รวม ${points.reduce((total, point) => total + point.count, 0).toLocaleString("th-TH")} ${report === "pir" ? "เหตุการณ์" : "ครั้ง"} ในช่วงที่เลือก</p></div><span class="chart-legend"><i aria-hidden="true"></i>${report === "pir" ? "การตรวจจับ" : "การเข้าชม"}</span></figcaption>
    <svg class="trend-chart" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="trend-chart-title trend-chart-desc" preserveAspectRatio="none">
      <title id="trend-chart-title">${title}</title><desc id="trend-chart-desc">กราฟแสดงจำนวน${report === "pir" ? "การตรวจจับการเคลื่อนไหว" : "การเข้าชมเว็บไซต์"} แบ่ง ${buckets.length} ช่วงตามวันที่เลือก</desc>
      ${grid}<path class="chart-area" d="${area}"></path><path class="chart-line" d="${line}"></path>${markers}${labels}
    </svg>
    ${points.every((point) => point.count === 0) ? `<p class="chart-empty">ยังไม่มีข้อมูลในช่วงวันที่นี้ กราฟจะแสดงเมื่อมีการบันทึกเหตุการณ์</p>` : ""}
  </figure>`;
}

function renderInventoryChart() {
  const items = products().slice().sort((a, b) => Number(b.stock) - Number(a.stock)).slice(0, 6);
  if (!items.length) return emptyState("ยังไม่มีสินค้า", "เพิ่มรายการสินค้าเพื่อดูสต็อกในกราฟ");
  const max = Math.max(1, ...items.map((item) => Number(item.stock) || 0));
  const width = 760;
  const rowHeight = 42;
  const labelWidth = 160;
  const valueWidth = 50;
  const chartWidth = width - labelWidth - valueWidth - 24;
  const rows = items.map((item, index) => {
    const y = index * rowHeight + 8;
    const value = Math.max(0, Number(item.stock) || 0);
    const barWidth = value / max * chartWidth;
    const fillClass = value === 0 ? "inventory-bar inventory-bar-empty" : "inventory-bar";
    return `<g><title>${escapeHtml(item.name)}: ${value} ชิ้น</title><text class="inventory-label" x="0" y="${y + 15}">${escapeHtml(item.name.slice(0, 18))}</text><rect class="inventory-track" x="${labelWidth}" y="${y}" width="${chartWidth}" height="20" rx="4"></rect><rect class="${fillClass}" x="${labelWidth}" y="${y}" width="${barWidth}" height="20" rx="4"></rect><text class="inventory-value" x="${labelWidth + chartWidth + 12}" y="${y + 15}">${value}</text></g>`;
  }).join("");
  return `<figure class="report-chart inventory-chart"><figcaption class="chart-heading"><div><h2>จำนวนคงเหลือแยกตามสินค้า</h2><p>แสดงสินค้า ${items.length} รายการที่มีจำนวนคงเหลือสูงสุด</p></div><span class="chart-legend"><i aria-hidden="true"></i>คงเหลือ (ชิ้น)</span></figcaption><svg viewBox="0 0 ${width} ${items.length * rowHeight}" role="img" aria-label="กราฟจำนวนคงเหลือแยกตามสินค้า">${rows}</svg></figure>`;
}

function dashboardPage() {
  if (currentUser?.role !== "admin") {
    navigate(currentUser ? "home" : "login");
    return "";
  }
  const startDefault = daysAgoInThailand(30);
  const endDefault = dateInThailand();
  const reportEvents = reportsForRange(startDefault, endDefault);
  const stock = dashboardReportData("inventory", reportEvents);
  const visits = dashboardReportData("visits", reportEvents);
  const views = dashboardReportData("views", reportEvents);
  const reportLabels = [["pir", "การเคลื่อนไหว"], ["inventory", "สินค้าและสต็อก"], ["visits", "การเข้าชมเว็บไซต์"], ["views", "สินค้าที่ได้รับความสนใจ"], ["member-history", "ประวัติสมาชิก"]];
  const memberList = users().filter((user) => user.role === "member");
  return `<div class="container"><div class="admin-shell">${adminNav("dashboard")}
    <section class="admin-content"><p class="eyebrow">ผู้ดูแลระบบ · รายงาน DB-01 ถึง DB-05</p><h1>แดชบอร์ด</h1><p class="lede">สรุปข้อมูลเดโมที่บันทึกไว้ในเบราว์เซอร์เครื่องนี้ · เวลาอ้างอิงประเทศไทย</p>
      <div class="metric-grid">
        <div class="metric"><span>รายการสินค้า</span><strong>${stock.count}</strong></div>
        <div class="metric"><span>คงเหลือรวม (ชิ้น)</span><strong>${stock.stock}</strong></div>
        <div class="metric"><span>สินค้าหมด</span><strong>${stock.out}</strong></div>
        <div class="metric"><span>เข้าชมเว็บ · 30 วัน</span><strong>${visits.count}</strong></div>
      </div>
      <div class="report-tabs" role="group" aria-label="เลือกประเภทรายงาน">${reportLabels.map(([id, label]) => `<button type="button" data-report="${id}" aria-pressed="${currentReport === id}">${label}</button>`).join("")}</div>
      <div class="data-panel">
        <div class="report-filter">
          <label class="field"><span class="field-label">ตั้งแต่</span><input class="form-control" type="date" id="report-start" min="${daysAgoInThailand(365)}" max="${endDefault}" value="${startDefault}"></label>
          <label class="field"><span class="field-label">ถึง</span><input class="form-control" type="date" id="report-end" min="${daysAgoInThailand(365)}" max="${endDefault}" value="${endDefault}"></label>
          ${currentReport === "member-history" ? `<label class="field"><span class="field-label">สมาชิก</span><select class="form-control" id="report-member"><option value="">เลือกสมาชิก</option>${memberList.map((user) => `<option value="${escapeHtml(user.id)}">${escapeHtml(user.username)} · ${escapeHtml(user.email)}</option>`).join("")}</select></label>` : ""}
          <button type="button" class="button button-secondary" data-action="apply-report">อัปเดตรายงาน</button>
        </div>
        <div id="report-content">${renderReportContent(currentReport, startDefault, endDefault, "")}</div>
      </div>
    </section></div></div>`;
}

function renderReportContent(report, start, end, memberId) {
  if (new Date(start) > new Date(end)) return `<div class="notice notice-danger" role="alert">ช่วงวันที่ไม่ถูกต้อง โปรดตรวจสอบวันที่เริ่มต้นและวันที่สิ้นสุด</div>`;
  const list = reportsForRange(start, end);
  if (report === "member-history") {
    if (!memberId) return emptyState("เลือกสมาชิก", "เลือกสมาชิกและช่วงเวลาเพื่อดูประวัติความสนใจ");
    if (new Date(start) < new Date(daysAgoInThailand(90))) return `<div class="notice notice-danger" role="alert">ประวัติสมาชิกเก็บไว้ไม่เกิน 90 วัน โปรดเลือกช่วงเวลาใหม่</div>`;
    const member = users().find((user) => user.id === memberId && user.role === "member");
    if (!member) return emptyState("ไม่พบสมาชิก", "เลือกสมาชิกที่มีอยู่ในระบบ");
    const history = readStore("jgs.member.history.v1", []).filter((entry) => entry.memberId === memberId && new Date(entry.occurredAt) >= new Date(`${start}T00:00:00+07:00`) && new Date(entry.occurredAt) <= new Date(`${end}T23:59:59.999+07:00`)).sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
    if (!history.length) return emptyState("ไม่มีประวัติในช่วงเวลาที่เลือก", "ประวัติสมาชิกจะแสดงเมื่อสมาชิกเปิดดูรายละเอียดอัญมณีหลังจากเข้าสู่ระบบ");
    return `<div class="table-wrap"><table><thead><tr><th>สินค้า</th><th>วันที่และเวลา (ประเทศไทย)</th></tr></thead><tbody>${history.map((entry) => {
      const product = products().find((item) => item.id === entry.productId);
      return `<tr><td>${escapeHtml(product?.name || "สินค้าไม่เผยแพร่")}</td><td>${formatDate(entry.occurredAt, { hour: "2-digit", minute: "2-digit" })}</td></tr>`;
    }).join("")}</tbody></table></div>`;
  }
  const data = dashboardReportData(report, list);
  if (report === "inventory") {
    return `<div class="metric-grid">
      <div class="metric"><span>รายการสินค้า</span><strong>${data.count}</strong></div><div class="metric"><span>คงเหลือรวม (ชิ้น)</span><strong>${data.stock}</strong></div>
      <div class="metric"><span>สินค้าหมด</span><strong>${data.out}</strong></div><div class="metric"><span>สินค้าใกล้หมด</span><strong>${data.low}</strong></div>
    </div>${data.empty ? `<div class="notice notice-info">${escapeHtml(data.empty)}</div>` : `<p class="field-hint">ยอดคงเหลือและเกณฑ์ใกล้หมดอ้างอิงจากรายการที่ผู้ดูแลบันทึกไว้ แต่ละสินค้าใช้เกณฑ์ของตนเอง</p>${renderInventoryChart()}`}`;
  }
  if (report === "pir" || report === "visits") {
    return `<div class="metric"><span>${escapeHtml(data.label)}</span><strong>${data.count.toLocaleString("th-TH")}</strong></div>${renderTrendChart(report, start, end, list)}`;
  }
  if (!data.rows.length) return emptyState("ไม่มีข้อมูลการเปิดดูสินค้า", data.empty);
  const max = data.rows[0].count;
  return `<p class="field-hint">${escapeHtml(data.label)} · รวม ${data.rows.reduce((total, row) => total + row.count, 0)} ครั้ง · เรียงจากยอดสูงสุด</p>
    <div class="bar-list">${data.rows.map((row) => `<div class="bar-row"><span>${escapeHtml(row.name)}</span><span class="bar-track"><span class="bar-fill" style="display:block;width:${Math.max(4, row.count / max * 100)}%"></span></span><strong>${row.count}</strong></div>`).join("")}</div>`;
}

function devicePage() {
  if (currentUser?.role !== "admin") {
    navigate(currentUser ? "home" : "login");
    return "";
  }
  const serialSupported = Boolean(navigator.serial);
  const securePage = window.isSecureContext;
  const supportText = !securePage
    ? "ต้องเปิดผ่าน HTTPS หรือ localhost เพื่อใช้ USB/Serial"
    : serialSupported
      ? "เบราว์เซอร์นี้รองรับ Web Serial"
      : "เบราว์เซอร์นี้ไม่รองรับ Web Serial ลองใช้ Chrome หรือ Edge บนคอมพิวเตอร์";
  return `<div class="container"><div class="admin-shell">${adminNav("device")}
    <section class="admin-content device-center">
      <p class="eyebrow">ผู้ดูแลระบบ · เชื่อมต่ออุปกรณ์</p>
      <h1>ศูนย์เชื่อมต่อบอร์ด</h1>
      <p class="lede">ตรวจสอบบอร์ดผ่าน USB/Serial หรือดูสถานะอุปกรณ์ที่เชื่อมอินเทอร์เน็ตกับบริการกลาง</p>
      <div class="notice notice-warning device-safety-note" role="note"><strong>โหมดตรวจสอบอย่างปลอดภัย</strong><br>หน้านี้อ่านข้อมูลบอร์ดและส่งได้เฉพาะ IDENTIFY, STATUS และ STOP ไม่มีคำสั่งเริ่มหมุน มอเตอร์จริงยังปิดใน firmware</div>
      <div class="notice notice-info device-profile-note" role="note"><strong>รุ่นจากรายการชิ้นส่วน:</strong> ESP32-S3-WROOM-1-N16R8 พร้อม Flash 16 MB และ PSRAM 8 MB บนแผงวงจรของคุณ<br>หน้าเว็บจะแสดงรุ่นนี้เมื่อ firmware โปรไฟล์ที่รองรับตอบกลับทาง USB/Serial ยังต้องตรวจผังวงจรเพื่อยืนยันการต่อ USB, GPIO และอุปกรณ์อื่นก่อนเปิดควบคุมจริง</div>
      <div class="device-connect-grid">
        <section class="data-panel device-connect-panel" aria-labelledby="usb-connect-title">
          <div class="device-panel-heading"><span class="device-icon" aria-hidden="true">⌁</span><div><h2 id="usb-connect-title">เชื่อมต่อ USB / Serial</h2><p id="serial-support">${escapeHtml(supportText)}</p></div></div>
          <p>เสียบบอร์ดเข้าคอมพิวเตอร์ แล้วกดเลือกพอร์ตที่แสดงในหน้าต่างเบราว์เซอร์ ต้องอนุญาตพอร์ตด้วยตนเองทุกครั้งตามข้อกำหนดความปลอดภัยของเว็บ</p>
          <div class="serial-device-summary" id="serial-device-summary" role="status" aria-live="polite">
            <span class="status-pill status-neutral" id="serial-state-badge">ยังไม่ได้เชื่อมต่อ</span>
            <p id="serial-state-message">ยังไม่มีพอร์ตที่เว็บได้รับอนุญาต</p>
          </div>
          <dl class="device-facts" id="serial-device-facts" hidden></dl>
          <div class="device-actions">
            <button type="button" class="button button-primary" data-action="connect-serial" ${!serialSupported || !securePage ? "disabled" : ""}>เลือกและเชื่อมต่อพอร์ต</button>
            <button type="button" class="button button-secondary" data-action="serial-status" disabled>อ่านสถานะบอร์ด</button>
            <button type="button" class="button button-danger button-small" data-action="serial-stop" disabled>ส่งคำสั่งหยุด</button>
            <button type="button" class="button button-quiet button-small" data-action="disconnect-serial" hidden>ยกเลิกการเชื่อมต่อ</button>
          </div>
          <p class="field-hint">พอร์ต USB ที่พบเป็นชิปแปลง USB-to-Serial ได้ ไม่ได้ยืนยันรุ่นบอร์ดหรือขา GPIO รายการชิ้นส่วนยังไม่ยืนยันว่า USB-B ต่อแบบใด</p>
        </section>
        <section class="data-panel device-connect-panel" aria-labelledby="wifi-connect-title">
          <div class="device-panel-heading"><span class="device-icon device-icon-network" aria-hidden="true">⌁</span><div><h2 id="wifi-connect-title">สถานะผ่าน Wi-Fi / อินเทอร์เน็ต</h2><p>ตรวจจาก heartbeat ที่บอร์ดส่งถึง Cloudflare Worker</p></div></div>
          <div class="serial-device-summary" id="cloud-device-summary" role="status" aria-live="polite">
            <span class="status-pill status-neutral" id="cloud-state-badge">ยังไม่ได้ตรวจสอบ</span>
            <p id="cloud-state-message">กดตรวจสอบเพื่อดูว่ามีบอร์ดรายงานตัวกับบริการกลางหรือไม่</p>
          </div>
          <dl class="device-facts" id="cloud-device-facts" hidden></dl>
          <div class="device-actions"><button type="button" class="button button-secondary" data-action="check-cloud-device">ตรวจสอบสถานะออนไลน์</button></div>
          <p class="field-hint">ESP32-S3 มี Wi-Fi 2.4 GHz แต่ยังต้องตั้ง Wi-Fi และ DEVICE_TOKEN ลง firmware ก่อน บอร์ดที่มี Ethernet ต้องใช้ฮาร์ดแวร์เครือข่ายที่เข้ากันและ firmware เพิ่มเติม</p>
        </section>
      </div>
      <section class="data-panel device-setup-panel">
        <h2>สิ่งที่ระบบตรวจได้และข้อจำกัด</h2>
        <ul class="device-capability-list">
          <li><strong>USB:</strong> เบราว์เซอร์จะแสดงพอร์ตให้เจ้าของเลือกหลังจากกดปุ่ม ไม่มีเว็บใดสแกนหรือเปิดพอร์ตเงียบ ๆ ได้</li>
          <li><strong>ระบุตัวชิป:</strong> firmware ที่รองรับส่งข้อมูลรุ่นชิปและโปรไฟล์ build ได้ แต่ไม่สามารถตรวจสายไฟ, รุ่นบอร์ดพัฒนา หรือ GPIO ที่ต่ออยู่</li>
          <li><strong>Wi-Fi:</strong> ใช้ตรวจบอร์ดที่ตั้งค่า Wi-Fi และลงทะเบียนกับ Worker แล้ว ไม่ใช่การค้นหา ESP ทุกตัวบนเครือข่ายโดยอัตโนมัติ</li>
          <li><strong>รุ่นอื่น:</strong> ต้องมี firmware/ไดรเวอร์และโปรไฟล์ของรุ่นนั้น ไม่สามารถรับประกันรองรับบอร์ดทุกรุ่นโดยอัตโนมัติ</li>
        </ul>
      </section>
    </section></div></div>`;
}

function showroomValueLabel(value, yes, no) {
      if (value === true) return yes;
      if (value === false) return no;
      return "ยังไม่มีข้อมูล";
}

function showroomTimestamp(timestamp) {
      if (!Number.isFinite(Number(timestamp))) return "ยังไม่มีข้อมูล";
      return new Intl.DateTimeFormat("th-TH", {
        timeZone: "Asia/Bangkok",
        dateStyle: "medium",
        timeStyle: "short"
      }).format(new Date(Number(timestamp)));
}

function showroomMetric(value, decimals = 1, unit = "") {
      return Number.isFinite(value) ? `${value.toLocaleString("th-TH", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}${unit}` : "ยังไม่มีข้อมูล";
}

function showroomTrendChart(device, sourceLabel = "ThingsBoard") {
      const vibration = device.history?.vibration || [];
      const dailyMax = device.history?.dailyMaxVibration || [];
      const threshold = device.maxVibrationThreshold?.value;
      if (!vibration.length && !dailyMax.length) {
        return `<section class="data-panel security-chart"><h2>แนวโน้มแรงสั่นสะเทือน · 7 วัน</h2>${emptyState("ยังไม่มีข้อมูลกราฟ", `กราฟจะแสดงเมื่อมีข้อมูลจาก ${escapeHtml(sourceLabel)}`)}</section>`;
      }
      const width = 760;
      const height = 250;
      const left = 58;
      const right = 744;
      const top = 20;
      const bottom = 194;
      const samples = [...vibration, ...dailyMax].filter((point) => Number.isFinite(point.value));
      const max = Math.max(1, ...samples.map((point) => point.value), Number.isFinite(threshold) ? threshold : 0) * 1.12;
      const toPoints = (series) => series.map((point, index) => ({
        x: left + (series.length === 1 ? 0 : index * (right - left) / (series.length - 1)),
        y: bottom - Math.max(0, point.value) / max * (bottom - top),
        ...point
      }));
      const vibrationPoints = toPoints(vibration);
      const dailyPoints = toPoints(dailyMax);
      const toPath = (points) => points.map((point, index) =>
        `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`
      ).join(" ");
      const grid = Array.from({ length: 4 }, (_, index) => {
        const y = top + index * (bottom - top) / 3;
        const value = max * (3 - index) / 3;
        return `<g class="chart-gridline"><line x1="${left}" y1="${y}" x2="${right}" y2="${y}"></line><text x="${left - 10}" y="${y + 4}" text-anchor="end">${value.toFixed(1)}</text></g>`;
      }).join("");
      const thresholdLine = Number.isFinite(threshold)
        ? `<line class="security-threshold" x1="${left}" y1="${bottom - threshold / max * (bottom - top)}" x2="${right}" y2="${bottom - threshold / max * (bottom - top)}"><title>เกณฑ์แรงสั่นสะเทือน ${threshold} mm/s</title></line>`
        : "";
      const labelPoints = [...vibrationPoints, ...dailyPoints];
      const first = labelPoints[0];
      const middle = labelPoints[Math.floor((labelPoints.length - 1) / 2)];
      const last = labelPoints[labelPoints.length - 1];
      const dateLabels = [...new Set([first, middle, last].filter(Boolean))].map((point, index, list) => {
        const anchor = list.length === 1 ? "middle" : index === 0 ? "start" : index === list.length - 1 ? "end" : "middle";
        return `<text class="chart-axis-label" x="${point.x}" y="${bottom + 25}" text-anchor="${anchor}">${escapeHtml(new Date(point.ts).toLocaleDateString("th-TH", { timeZone: "Asia/Bangkok", day: "numeric", month: "short" }))}</text>`;
      }).join("");
      const vibrationPath = vibrationPoints.length ? `<path class="chart-line" d="${toPath(vibrationPoints)}"></path>` : "";
      const dailyPath = dailyPoints.length ? `<path class="security-daily-line" d="${toPath(dailyPoints)}"></path>` : "";
      return `<figure class="data-panel security-chart">
        <figcaption class="chart-heading"><div><h2>แนวโน้มแรงสั่นสะเทือน · ${escapeHtml(device.name)}</h2><p>${escapeHtml(sourceLabel)} ย้อนหลัง 7 วัน · หน่วย mm/s</p></div></figcaption>
        <div class="security-legend"><span><i></i>แรงสั่นสะเทือน</span><span class="security-legend-daily"><i></i>ค่าสูงสุดรายวัน</span>${Number.isFinite(threshold) ? `<span class="security-legend-threshold"><i></i>เกณฑ์ ${showroomMetric(threshold)} mm/s</span>` : ""}</div>
        <svg class="trend-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="กราฟแรงสั่นสะเทือนของ ${escapeHtml(device.name)} ย้อนหลัง 7 วัน" preserveAspectRatio="none">
          ${grid}${thresholdLine}${vibrationPath}${dailyPath}
          ${vibrationPoints.map((point) => `<circle class="chart-point" cx="${point.x}" cy="${point.y}" r="2.5"><title>${escapeHtml(showroomTimestamp(point.ts))}: ${showroomMetric(point.value)} mm/s</title></circle>`).join("")}
          ${dailyPoints.map((point) => `<circle class="security-daily-point" cx="${point.x}" cy="${point.y}" r="2.5"><title>${escapeHtml(showroomTimestamp(point.ts))}: ${showroomMetric(point.value)} mm/s</title></circle>`).join("")}
          ${dateLabels}
        </svg>
      </figure>`;
}

function demoShowroomSecurityData() {
      const now = Date.now();
      const telemetry = (value, minutesAgo = 5) => ({ value, ts: now - minutesAgo * 60_000 });
      const history = (values) => values.map((value, index) => ({
        ts: now - (values.length - index - 1) * 24 * 60 * 60_000,
        value
      }));
      const makeDevice = (key, name, values) => ({
        key,
        name,
        active: true,
        authorized: telemetry(values.authorized),
        itemPresent: telemetry(values.itemPresent),
        coverOpen: telemetry(values.coverOpen),
        weight: telemetry(values.weight),
        vibration: telemetry(values.vibration),
        battery: telemetry(values.battery),
        dailyMaxVibration: telemetry(values.dailyMaxVibration),
        maxVibrationThreshold: telemetry(0.5),
        status: values.status,
        alerts: values.alerts,
        lastSeen: now - 60_000,
        history: {
          vibration: history(values.vibrationHistory),
          dailyMaxVibration: history(values.dailyMaxHistory)
        }
      });
      return {
        updatedAt: now,
        devices: [
          makeDevice(0, "Diamond Pedestal 01 - Hope Star", {
            authorized: true, itemPresent: true, coverOpen: false, weight: 2.4,
            vibration: 0.12, battery: 94, dailyMaxVibration: 0.28, status: "secure", alerts: [],
            vibrationHistory: [0.09, 0.12, 0.1, 0.14, 0.11, 0.12, 0.15],
            dailyMaxHistory: [0.21, 0.24, 0.2, 0.28, 0.19, 0.22, 0.25]
          }),
          makeDevice(1, "Diamond Pedestal 02 - Royal Blue", {
            authorized: true, itemPresent: true, coverOpen: true, weight: 1.8,
            vibration: 0.82, battery: 87, dailyMaxVibration: 0.82, status: "attention",
            alerts: ["ฝาครอบตู้เปิดอยู่", "แรงสั่นสะเทือนเกินค่าที่กำหนด"],
            vibrationHistory: [0.11, 0.13, 0.12, 0.2, 0.31, 0.55, 0.82],
            dailyMaxHistory: [0.25, 0.22, 0.28, 0.32, 0.4, 0.62, 0.82]
          }),
          makeDevice(2, "Diamond Pedestal 03 - Imperial Crown", {
            authorized: false, itemPresent: false, coverOpen: false, weight: 0,
            vibration: 0.05, battery: 100, dailyMaxVibration: 0.18, status: "attention",
            alerts: ["ตรวจพบการเข้าถึงที่ไม่ได้รับอนุญาต", "ไม่พบเครื่องประดับบนแท่น"],
            vibrationHistory: [0.04, 0.05, 0.05, 0.06, 0.04, 0.05, 0.05],
            dailyMaxHistory: [0.12, 0.15, 0.14, 0.18, 0.13, 0.16, 0.15]
          })
        ]
      };
}

function showroomSecurityResults(data, sourceLabel = "ThingsBoard") {
      const devices = Array.isArray(data?.devices) ? data.devices : [];
      const alerts = devices.flatMap((device) => (device.alerts || []).map((alert) => ({ name: device.name, message: alert })));
      const selected = devices.find((device) => device.key === showroomSelectedDevice) || devices[0];
      const securityRows = devices.map((device) => {
        const state = device.status === "secure"
          ? '<span class="status-pill status-available">ปกติ</span>'
          : device.status === "inactive"
            ? '<span class="status-pill status-out">ไม่ทำงาน</span>'
            : device.status === "attention"
              ? '<span class="status-pill status-out">ต้องตรวจสอบ</span>'
              : '<span class="status-pill status-neutral">ไม่มีข้อมูล</span>';
        return `<tr>
          <td><strong>${escapeHtml(device.name)}</strong><small>อัปเดต ${escapeHtml(showroomTimestamp(device.lastSeen))}</small></td>
          <td>${state}</td>
          <td>${escapeHtml(showroomValueLabel(device.authorized?.value, "อนุญาต", "ไม่อนุญาต"))}</td>
          <td>${escapeHtml(showroomValueLabel(device.coverOpen?.value, "เปิด", "ปิด"))}</td>
          <td>${escapeHtml(showroomValueLabel(device.itemPresent?.value, "มี", "ไม่พบ"))}</td>
          <td>${showroomMetric(device.vibration?.value)} mm/s</td>
          <td>${showroomMetric(device.weight?.value)}</td>
          <td>${showroomMetric(device.battery?.value, 0, "%")}</td>
          <td><button class="button button-quiet button-small" type="button" data-action="select-showroom-device" data-index="${device.key}">ดูกราฟ</button></td>
        </tr>`;
      }).join("");
      const alertContent = alerts.length
        ? `<ul class="security-alert-list">${alerts.map((alert) => `<li><strong>${escapeHtml(alert.name)}:</strong> ${escapeHtml(alert.message)}</li>`).join("")}</ul>`
        : `<p class="security-empty-alert">${devices.length ? "ไม่พบเงื่อนไขเตือนจากค่าล่าสุด" : "ยังไม่พบอุปกรณ์ที่เชื่อมกับ asset ของตู้โชว์"}</p>`;
      const alertTone = alerts.length ? "notice-warning" : "notice-info";
      return `<div class="metric-grid security-metrics">
          <div class="metric"><span>แท่นจัดแสดง</span><strong>${devices.length}</strong></div>
          <div class="metric"><span>กำลังทำงาน</span><strong>${devices.filter((device) => device.active === true).length}</strong></div>
          <div class="metric"><span>ต้องตรวจสอบ</span><strong>${devices.filter((device) => device.alerts?.length).length}</strong></div>
        </div>
        <section class="data-panel">
          <div class="security-section-heading"><div><h2>สถานะอุปกรณ์</h2><p>ค่าล่าสุดจาก ${escapeHtml(sourceLabel)}</p></div></div>
          <div class="table-wrap"><table class="security-table"><thead><tr><th>แท่น</th><th>สถานะ</th><th>การอนุญาต</th><th>ฝาครอบ</th><th>เครื่องประดับ</th><th>แรงสั่น</th><th>น้ำหนัก</th><th>แบตเตอรี่</th><th>กราฟ</th></tr></thead>
          <tbody>${securityRows || `<tr><td colspan="9">${emptyState("ยังไม่พบแท่นจัดแสดง", "ตรวจสอบว่า asset ใน ThingsBoard มีอุปกรณ์เชื่อมด้วย relation jewelryShowroomTodiamondPedestal และ API user มีสิทธิ์อ่านอุปกรณ์")}</td></tr>`}</tbody></table></div>
        </section>
        <section class="notice ${alertTone} security-alerts" role="status"><strong>เงื่อนไขเตือนจากข้อมูลล่าสุด</strong>${alertContent}</section>
        ${selected ? showroomTrendChart(selected, sourceLabel) : ""}`;
}

function showroomSecurityPage() {
      const isAdmin = currentUser?.role === "admin";
      if (!isAdmin && showroomUseLiveData) {
        showroomUseLiveData = false;
        showroomAccessPassword = "";
        showroomSecurityData = null;
        showroomSecurityError = "";
      }
      const liveData = isAdmin && showroomUseLiveData && showroomSecurityData;
      const errorNote = isAdmin && showroomUseLiveData && showroomSecurityError
        ? `<div class="notice notice-danger security-feedback" role="alert">${escapeHtml(showroomSecurityError)}</div>`
        : "";
      const content = liveData
        ? `${showroomSecurityResults(showroomSecurityData)}
          <div class="security-data-meta">อัปเดตจาก ThingsBoard: ${escapeHtml(showroomTimestamp(showroomSecurityData.updatedAt))}</div>`
        : isAdmin && showroomUseLiveData
          ? `<section class="data-panel security-access-panel">
            <h2>ยืนยันสิทธิ์ดูข้อมูล</h2>
            <p>ป้อนรหัสผ่านส่วนดูข้อมูลที่ตั้งไว้ใน Cloudflare Worker ข้อมูลนี้แยกจากบัญชีตัวอย่างในเว็บไซต์ และจะอยู่ในหน่วยความจำของแท็บนี้เท่านั้น</p>
            <form class="security-access-form" id="showroom-access-form">
              <label class="field"><span class="field-label">รหัสผ่านส่วนดูข้อมูล</span><input class="form-control" name="showroomPassword" type="password" autocomplete="off" required minlength="32" maxlength="128"></label>
              <button class="button button-primary" type="submit" ${showroomSecurityLoading ? "disabled" : ""}>${showroomSecurityLoading ? "กำลังเชื่อมต่อ…" : "เชื่อมต่อ ThingsBoard API"}</button>
            </form>
            <button class="button button-quiet" type="button" data-action="use-showroom-demo">กลับสู่ข้อมูลตัวอย่าง</button>
          </section>`
          : `${showroomSecurityResults(demoShowroomSecurityData(), "ข้อมูลตัวอย่าง")}
            <div class="security-data-meta">ข้อมูลสำหรับนำเสนอ ไม่ได้ดึงจาก ThingsBoard</div>`;
      const actions = liveData
        ? `<div class="security-toolbar"><span>ข้อมูลอ่านอย่างเดียวจากโปรเจกต์ Showroom Security Management</span><div><button class="button button-secondary" type="button" data-action="refresh-showroom-security" ${showroomSecurityLoading ? "disabled" : ""}>${showroomSecurityLoading ? "กำลังอัปเดต…" : "อัปเดตข้อมูลล่าสุด"}</button><button class="button button-quiet" type="button" data-action="lock-showroom-security">กลับสู่ข้อมูลตัวอย่าง</button></div></div>`
        : isAdmin && !showroomUseLiveData
          ? `<div class="security-toolbar"><span>ข้อมูลตัวอย่างแสดงได้ทันทีโดยไม่ต้องเชื่อมต่อระบบจริง</span><div><button class="button button-secondary" type="button" data-action="connect-showroom-live">เชื่อมต่อ ThingsBoard จริง</button></div></div>`
          : "";
      const pageContent = `<section class="${isAdmin ? "admin-content " : ""}security-dashboard">
          <p class="eyebrow">${showroomUseLiveData ? "ThingsBoard · REST API" : "ข้อมูลตัวอย่าง · โหมดนำเสนอ"}</p>
          <h1>ความปลอดภัยตู้โชว์</h1>
          <p class="lede">สถานะฝาครอบ การอนุญาต แรงสั่นสะเทือน และแบตเตอรี่ของแท่นจัดแสดง</p>
          ${!showroomUseLiveData ? `<div class="notice notice-info security-feedback" role="note"><strong>ข้อมูลจำลองสำหรับงานนำเสนอ</strong><br>หน้านี้ไม่ใช่สถานะจากอุปกรณ์จริง${isAdmin ? " ผู้ดูแลสามารถเลือกเชื่อม ThingsBoard จริงได้" : ""}</div>` : ""}
          ${errorNote}${actions}${content}
          <p class="field-hint security-source-note">${showroomUseLiveData && isAdmin ? "ข้อมูลจริงอ่านจาก ThingsBoard ผ่าน Cloudflare Worker และยังต้องยืนยันสิทธิ์" : "ข้อมูลและกราฟตัวอย่างใช้สาธิตรูปแบบการทำงาน ไม่ได้บันทึกหรือส่งคำสั่งไปยังอุปกรณ์"}</p>
        </section>`;
      return isAdmin
        ? `<div class="container"><div class="admin-shell">${adminNav("security")}${pageContent}</div></div>`
        : `<div class="container">${pageContent}</div>`;
}

function setConnectionStatus(kind, state, message) {
  const badge = document.querySelector(`#${kind}-state-badge`);
  const messageNode = document.querySelector(`#${kind}-state-message`);
  if (badge) {
    const confirmedFirmware = kind === "serial" && state === "เชื่อมต่อแล้ว" && serialDeviceInfo?.chipModel;
    badge.textContent = confirmedFirmware ? "ยืนยัน firmware แล้ว" : state;
    badge.className = `status-pill ${confirmedFirmware || state === "เชื่อมต่อแล้ว" || state === "ออนไลน์" ? "status-available" : state === "เกิดข้อผิดพลาด" ? "status-out" : "status-neutral"}`;
  }
  if (messageNode) messageNode.textContent = message;
  const connected = kind === "serial" && Boolean(serialPort);
  document.querySelector('[data-action="serial-status"]')?.toggleAttribute("disabled", !connected);
  document.querySelector('[data-action="serial-stop"]')?.toggleAttribute("disabled", !connected);
  document.querySelector('[data-action="disconnect-serial"]')?.toggleAttribute("hidden", !connected);
}

function deviceProfileLabel(profile) {
  if (profile === "esp32-s3-wroom-1-n16r8") return "ESP32-S3-WROOM-1-N16R8";
  return profile || "";
}

function renderSerialDeviceFacts(info) {
  const facts = document.querySelector("#serial-device-facts");
  if (!facts) return;
  const labels = [
    ["รุ่นชิป", info.chipModel],
    ["รุ่นย่อย / revision", info.chipRevision],
    ["จำนวนแกนประมวลผล", info.chipCores],
    ["Flash", info.flashBytes ? `${(Number(info.flashBytes) / 1_048_576).toFixed(0)} MB` : ""],
    ["PSRAM", info.psramBytes ? `${(Number(info.psramBytes) / 1_048_576).toFixed(0)} MB` : ""],
    ["โมดูล / โปรไฟล์ firmware", deviceProfileLabel(info.boardProfile)],
    ["เวอร์ชัน firmware", info.firmware],
    ["รุ่นโปรโตคอล", info.protocolVersion],
    ["USB-to-Serial Vendor ID", info.usbVendorId ? `0x${Number(info.usbVendorId).toString(16).padStart(4, "0")}` : ""],
    ["USB-to-Serial Product ID", info.usbProductId ? `0x${Number(info.usbProductId).toString(16).padStart(4, "0")}` : ""],
    ["สถานะ Wi-Fi", typeof info.wifiConnected === "boolean" ? (info.wifiConnected ? "เชื่อมต่อแล้ว" : "ยังไม่เชื่อมต่อ") : ""],
    ["มอเตอร์พร้อม", typeof info.motorReady === "boolean" ? (info.motorReady ? "พร้อม" : "ยังไม่พร้อม") : ""]
  ].filter(([, value]) => value !== undefined && value !== null && value !== "");
  facts.innerHTML = labels.map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join("");
  facts.hidden = labels.length === 0;
  const badge = document.querySelector("#serial-state-badge");
  if (badge) {
    badge.textContent = info.chipModel ? "ยืนยัน firmware แล้ว" : "เชื่อมต่อแล้ว";
    badge.className = "status-pill status-available";
  }
}

function clearSerialDeviceFacts() {
  serialDeviceInfo = null;
  serialReadBuffer = "";
  const facts = document.querySelector("#serial-device-facts");
  if (facts) {
    facts.replaceChildren();
    facts.hidden = true;
  }
}

function handleSerialLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const data = JSON.parse(trimmed);
    if (data.event === "identify" || data.event === "status") {
      serialDeviceInfo = { ...serialDeviceInfo, ...data };
      renderSerialDeviceFacts(serialDeviceInfo);
      setConnectionStatus("serial", "เชื่อมต่อแล้ว", data.event === "identify"
        ? "firmware ตอบกลับและรายงานข้อมูลชิปแล้ว"
        : "อ่านสถานะ firmware จากพอร์ต USB/Serial แล้ว");
      return;
    }
    if (data.event === "stop_requested") {
      setConnectionStatus("serial", "เชื่อมต่อแล้ว", "บอร์ดรับคำสั่งหยุดแล้ว");
      return;
    }
    if (data.error || data.reason) {
      setConnectionStatus("serial", "เกิดข้อผิดพลาด", data.error || data.reason);
      return;
    }
  } catch {
    // Non-JSON serial output is ignored; the connection state remains explicit.
  }
}

async function readSerialPort(port) {
  const reader = port.readable.getReader();
  serialReader = reader;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      serialReadBuffer += decoder.decode(value, { stream: true });
      const lines = serialReadBuffer.split(/\r?\n/);
      serialReadBuffer = lines.pop() || "";
      lines.forEach(handleSerialLine);
    }
  } catch (error) {
    if (serialPort === port) setConnectionStatus("serial", "เกิดข้อผิดพลาด", `อ่านข้อมูลจากบอร์ดไม่สำเร็จ: ${error.message}`);
  } finally {
    reader.releaseLock();
    if (serialReader === reader) serialReader = null;
    if (serialPort === port && !port.readable) {
      serialPort = null;
      clearSerialDeviceFacts();
      setConnectionStatus("serial", "ยังไม่ได้เชื่อมต่อ", "พอร์ตถูกตัดการเชื่อมต่อ");
    }
  }
}

async function writeSerialCommand(command) {
  if (!serialPort?.writable) {
    setConnectionStatus("serial", "เกิดข้อผิดพลาด", "ไม่มีพอร์ต Serial ที่เขียนข้อมูลได้");
    return;
  }
  const writer = serialPort.writable.getWriter();
  try {
    await writer.write(new TextEncoder().encode(`${command}\n`));
  } finally {
    writer.releaseLock();
  }
}

async function connectSerialDevice() {
  if (!window.isSecureContext || !navigator.serial) {
    setConnectionStatus("serial", "เกิดข้อผิดพลาด", "Web Serial ต้องใช้ Chrome/Edge ผ่าน HTTPS หรือ localhost");
    return;
  }
  let selectedPort = null;
  try {
    setConnectionStatus("serial", "กำลังเชื่อมต่อ", "เลือกพอร์ต USB/Serial ในหน้าต่างเบราว์เซอร์");
    selectedPort = await navigator.serial.requestPort();
    await selectedPort.open({ baudRate: 115200 });
    serialPort = selectedPort;
    const usbInfo = selectedPort.getInfo();
    serialDeviceInfo = {
      ...(usbInfo.usbVendorId ? { usbVendorId: usbInfo.usbVendorId } : {}),
      ...(usbInfo.usbProductId ? { usbProductId: usbInfo.usbProductId } : {})
    };
    renderSerialDeviceFacts(serialDeviceInfo);
    serialReadBuffer = "";
    serialDisconnectHandler = () => {
      if (serialPort === selectedPort) {
        serialPort = null;
        serialReader = null;
        clearSerialDeviceFacts();
        setConnectionStatus("serial", "ยังไม่ได้เชื่อมต่อ", "ตรวจพบว่าถอดสาย USB ออก");
      }
    };
    selectedPort.addEventListener("disconnect", serialDisconnectHandler);
    setConnectionStatus("serial", "เชื่อมต่อแล้ว", "เปิดพอร์ตแล้ว กำลังตรวจสอบว่า firmware ตอบรับหรือไม่");
    void readSerialPort(selectedPort);
    await writeSerialCommand("IDENTIFY");
    await writeSerialCommand("STATUS");
    await new Promise((resolve) => setTimeout(resolve, 2200));
    if (serialPort === selectedPort && !serialDeviceInfo?.chipModel) {
      setConnectionStatus("serial", "เชื่อมต่อแล้ว", "เปิดพอร์ตได้ แต่ไม่พบคำตอบ IDENTIFY อาจยังไม่ได้แฟลช firmware ที่รองรับ");
    }
  } catch (error) {
    let cleanupMessage = "";
    if (selectedPort) {
      if (serialDisconnectHandler) selectedPort.removeEventListener("disconnect", serialDisconnectHandler);
      try {
        if (serialReader) await serialReader.cancel();
        await selectedPort.close();
      } catch (closeError) {
        cleanupMessage = ` และปิดพอร์ตหลังเกิดข้อผิดพลาดไม่สำเร็จ: ${closeError.message}`;
      }
    }
    serialPort = null;
    serialReader = null;
    clearSerialDeviceFacts();
    serialDisconnectHandler = null;
    const message = error.name === "NotFoundError"
      ? "ยกเลิกการเลือกพอร์ต หรือไม่พบพอร์ตที่เลือก"
      : `เชื่อมต่อ USB/Serial ไม่สำเร็จ: ${error.message}${cleanupMessage}`;
    setConnectionStatus("serial", error.name === "NotFoundError" ? "ยังไม่ได้เชื่อมต่อ" : "เกิดข้อผิดพลาด", message);
  }
}

async function disconnectSerialDevice() {
  const port = serialPort;
  serialPort = null;
  if (!port) {
    setConnectionStatus("serial", "ยังไม่ได้เชื่อมต่อ", "ยังไม่มีพอร์ตที่เชื่อมต่อ");
    return;
  }
  if (serialDisconnectHandler) port.removeEventListener("disconnect", serialDisconnectHandler);
  try {
    if (serialReader) await serialReader.cancel();
    if (port.readable || port.writable) await port.close();
    setConnectionStatus("serial", "ยังไม่ได้เชื่อมต่อ", "ยกเลิกการเชื่อมต่อ USB/Serial แล้ว");
  } catch (error) {
    setConnectionStatus("serial", "เกิดข้อผิดพลาด", `ปิดพอร์ตไม่สำเร็จ: ${error.message}`);
  } finally {
    serialReader = null;
    clearSerialDeviceFacts();
    serialDisconnectHandler = null;
  }
}

async function checkCloudDeviceStatus() {
  const apiBase = String(window.GEMSTONE_DEVICE_CONFIG?.apiBase || "").trim().replace(/\/+$/, "");
  if (!apiBase) {
    setConnectionStatus("cloud", "เกิดข้อผิดพลาด", "ยังไม่ได้ตั้งค่า URL ของ Cloudflare Worker");
    return;
  }
  setConnectionStatus("cloud", "กำลังตรวจสอบ", "กำลังอ่านสถานะจากบริการกลาง");
  try {
    const response = await fetch(`${apiBase}/api/status`, { headers: { accept: "application/json" }, cache: "no-store" });
    if (!response.ok) throw new Error(`บริการตอบกลับ HTTP ${response.status}`);
    const status = await response.json();
    const online = status.deviceOnline === true;
    const details = [
      `Worker ${status.remoteControlEnabled ? "เปิด" : "ปิด"}การควบคุมระยะไกล`,
      `บอร์ด ${online ? "ออนไลน์" : "ยังไม่ออนไลน์"}`,
      `มอเตอร์ ${status.motorReady ? "พร้อม" : "ยังไม่พร้อม"}`
    ];
    setConnectionStatus("cloud", online ? "ออนไลน์" : "ยังไม่ออนไลน์", details.join(" · "));
    const facts = document.querySelector("#cloud-device-facts");
    if (facts) {
      const entries = [
        ["บอร์ด", online ? "ออนไลน์" : "ยังไม่รายงานตัว"],
        ["มอเตอร์", status.motorReady ? "พร้อม" : "ยังไม่พร้อม"],
        ["firmware", status.firmware || "ยังไม่มีข้อมูล"],
        ["อัปเดตล่าสุด", status.lastSeen ? new Date(status.lastSeen).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" }) : "ยังไม่มี heartbeat"]
      ];
      facts.innerHTML = entries.map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join("");
      facts.hidden = false;
    }
  } catch (error) {
    setConnectionStatus("cloud", "เกิดข้อผิดพลาด", `ตรวจสอบ Worker ไม่สำเร็จ: ${error.message}`);
  }
}

function showroomApiError(response, data) {
  if (response.status === 401) return "รหัสผ่านส่วนดูข้อมูลไม่ถูกต้อง";
  if (response.status === 503) return "ยังไม่ได้ตั้งค่าบัญชีอ่านข้อมูล ThingsBoard หรือรหัสผ่านส่วนดูข้อมูลใน Cloudflare Worker";
  if (data?.upstreamStatus === 401) {
    return "ThingsBoard ไม่ยอมรับ API key หรือบัญชีที่ตั้งใน Cloudflare ตรวจว่าคีย์ยังใช้งานได้และคัดลอกมาครบ";
  }
  if (data?.upstreamStatus === 403) {
    return "ThingsBoard ปฏิเสธสิทธิ์อ่าน asset หรืออุปกรณ์ของบัญชี/API key นี้";
  }
  if (data?.upstreamStatus === 404) {
    return "ThingsBoard ไม่พบ asset หรืออุปกรณ์ตามข้อมูลใน dashboard export";
  }
  return "เชื่อมต่อ ThingsBoard ไม่สำเร็จ โปรดลองอีกครั้งหรือตรวจสอบการตั้งค่า Worker";
}

async function loadShowroomSecurity(password) {
  if (currentUser?.role !== "admin" || !password || showroomSecurityLoading) return;
  const apiBase = String(window.GEMSTONE_DEVICE_CONFIG?.apiBase || "").trim().replace(/\/+$/, "");
  if (!apiBase) {
    showroomSecurityError = "ยังไม่ได้ตั้งค่า URL ของ Cloudflare Worker";
    render();
    return;
  }
  showroomSecurityLoading = true;
  showroomSecurityError = "";
  render();
  try {
    const response = await fetch(`${apiBase}/api/showroom/security`, {
      headers: { accept: "application/json", authorization: `Bearer ${password}` },
      cache: "no-store"
    });
    const data = await response.json();
    if (!response.ok) throw new Error(showroomApiError(response, data));
    if (currentRoute === "security") {
      showroomAccessPassword = password;
      showroomSecurityData = data;
      showroomSecurityError = "";
      if (!data.devices?.some((device) => device.key === showroomSelectedDevice)) {
        showroomSelectedDevice = data.devices?.[0]?.key ?? 0;
      }
    }
  } catch (error) {
    if (currentRoute === "security") {
      showroomSecurityError = error.message || "เชื่อมต่อ ThingsBoard ไม่สำเร็จ";
      if (!showroomSecurityData) showroomAccessPassword = "";
    }
  } finally {
    showroomSecurityLoading = false;
    if (currentRoute === "security") render();
  }
}

function navigate(route) {
  const next = route.replace(/^#/, "");
  if (location.hash.slice(1) === next) {
    currentRoute = next || "home";
    render();
    return;
  }
  location.hash = next || "home";
}

function render() {
  clearTimeout(turntablePollTimer);
  const route = location.hash.slice(1) || "home";
  const previousRoute = currentRoute;
  currentRoute = route;
  if (previousRoute === "device" && route !== "device" && serialPort) void disconnectSerialDevice();
  if (previousRoute === "security" && route !== "security") {
    showroomAccessPassword = "";
    showroomSecurityData = null;
    showroomSecurityError = "";
    showroomSecurityLoading = false;
    showroomUseLiveData = false;
  }
  const [page, ...rest] = route.split("/");
  if (page === "home") shell(homePage());
  else if (page === "catalog") shell(catalogPage());
  else if (page === "product") shell(detailPage(decodeURIComponent(rest.join("/"))));
  else if (page === "live") {
    shell(livePage());
    initializeShowroom();
  }
  else if (page === "login" || page === "register") authPage(page);
  else if (page === "admin" && rest[0] === "content") shell(contentAdminPage(), { admin: true });
  else if (page === "admin") shell(adminPage(), { admin: true });
  else if (page === "dashboard") shell(dashboardPage(), { admin: true });
  else if (page === "security") shell(showroomSecurityPage(), { admin: true });
  else if (page === "device") {
    shell(devicePage(), { admin: true });
    if (currentUser?.role === "admin") void checkCloudDeviceStatus();
  }
  else shell(homePage());
}

function showToast(message, kind = "success") {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.dataset.kind = kind === "error" ? "error" : kind === "warning" ? "warning" : "success";
  toast.setAttribute("role", kind === "error" ? "alert" : "status");
  toast.textContent = message;
  toastRegion.append(toast);
  setTimeout(() => toast.remove(), 4200);
}

function setAuthFeedback(message, kind = "info") {
  const region = document.querySelector("#auth-feedback");
  if (region) region.innerHTML = message ? `<div class="notice notice-${kind}" role="${kind === "danger" ? "alert" : "status"}">${escapeHtml(message)}</div>` : "";
}

function showDialog(content, title = "") {
  dialogContent.innerHTML = `${title ? `<div class="dialog-heading"><h2 id="dialog-title">${escapeHtml(title)}</h2></div>` : '<span id="dialog-title" class="visually-hidden">หน้าต่างโต้ตอบ</span>'}${content}`;
  dialog.showModal();
}

function closeDialog() {
  if (dialog.open) dialog.close();
}

function productForm(product = null, stockOnly = false) {
  const editing = Boolean(product);
  const fields = stockOnly
    ? `<label class="field"><span class="field-label">จำนวนคงเหลือ (ชิ้น)</span><input class="form-control" name="stock" type="number" min="0" step="1" value="${Number(product.stock)}" required></label>
       <label class="field"><span class="field-label">เกณฑ์สินค้าใกล้หมด (ชิ้น)</span><input class="form-control" name="lowStock" type="number" min="0" step="1" value="${product.lowStock ?? ""}" placeholder="เว้นว่างหากยังไม่กำหนด"></label>`
    : `<label class="field"><span class="field-label">รหัสสินค้า</span><input class="form-control" name="code" value="${escapeHtml(product?.code || "")}" required maxlength="30"></label>
       <label class="field"><span class="field-label">ชื่อสินค้า</span><input class="form-control" name="name" value="${escapeHtml(product?.name || "")}" required maxlength="80"></label>
       <label class="field"><span class="field-label">ประเภทอัญมณี</span><select class="form-control" name="type" required>${Object.entries(gemTypeLabels).map(([type, label]) => `<option value="${type}" ${(product?.type || "Emerald") === type ? "selected" : ""}>${label}</option>`).join("")}</select></label>
       <label class="field"><span class="field-label">สีตัวอย่าง</span><select class="form-control" name="color" required>${Object.keys(gemPalettes).map((color) => `<option value="${color}" ${(product?.color || "emerald") === color ? "selected" : ""}>${escapeHtml(gemColorLabels[color])}</option>`).join("")}</select></label>
       <label class="field"><span class="field-label">รูปแบบเจียระไน</span><select class="form-control" name="cut" required>${Object.entries(gemCutLabels).map(([cut, label]) => `<option value="${cut}" ${(product?.cut || "Oval") === cut ? "selected" : ""}>${label}</option>`).join("")}</select></label>
       <label class="field"><span class="field-label">แหล่งกำเนิด</span><input class="form-control" name="origin" value="${escapeHtml(product?.origin || "")}" maxlength="60"></label>
       <label class="field"><span class="field-label">ราคา (บาท/กรัม)</span><input class="form-control" name="price" type="number" min="0" step="0.01" value="${Number(product?.price || 0)}" required></label>
       <label class="field"><span class="field-label">จำนวนคงเหลือ (ชิ้น)</span><input class="form-control" name="stock" type="number" min="0" step="1" value="${Number(product?.stock || 0)}" required></label>
       <label class="field"><span class="field-label">เกณฑ์สินค้าใกล้หมด</span><input class="form-control" name="lowStock" type="number" min="0" step="1" value="${product?.lowStock ?? ""}" placeholder="เว้นว่างหากยังไม่กำหนด"></label>
       <label class="field field-full"><span class="field-label">รายละเอียด</span><textarea class="form-control" name="description" required maxlength="500">${escapeHtml(product?.description || "")}</textarea></label>
       <label class="field field-full"><span class="field-label">เพิ่มรูปภาพ (เลือกได้หลายไฟล์)</span><input class="form-control" name="images" type="file" accept="image/*" multiple><span class="field-hint">สูงสุด 5 MB ต่อไฟล์ · หากไม่มีภาพจริง ระบบจะแสดงภาพอัญมณีประกอบที่สร้างจากข้อมูลสินค้า</span></label>
       ${product?.images?.length ? `<div class="field field-full"><span class="field-label">รูปที่บันทึกไว้</span><div class="detail-thumbs">${product.images.map((image, index) => `<button type="button" data-action="remove-photo" data-index="${index}" aria-label="ลบรูปที่ ${index + 1}">×<img src="${image}" alt=""></button>`).join("")}</div></div>` : ""}
       <label class="field field-full"><span><input name="published" type="checkbox" ${product?.published === false ? "" : "checked"}> เผยแพร่ในแคตตาล็อก</span></label>`;
  return `<form class="dialog-content-form" id="product-form" data-id="${escapeHtml(product?.id || "")}" data-stock-only="${stockOnly}">
    <div class="form-grid">${fields}</div><div class="dialog-actions"><button class="button button-secondary" type="button" data-action="close-dialog">ยกเลิก</button>
      <button class="button button-primary" type="submit">${stockOnly ? "บันทึกสต็อก" : editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}</button></div></form>`;
}

async function resizeImage(file) {
  if (file.size > 5 * 1024 * 1024) throw new Error(`${file.name}: ไฟล์มีขนาดเกิน 5 MB`);
  if (!file.type.startsWith("image/")) throw new Error(`${file.name}: เลือกไฟล์รูปภาพเท่านั้น`);
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("ไม่สามารถประมวลผลรูปภาพได้");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.78);
}

function resetDemoData() {
  writeStore(STORAGE.products, defaultProducts);
  writeStore(STORAGE.events, []);
  writeStore(STORAGE.content, {
    headline: "ใกล้ชิดอัญมณีล้ำค่าแห่งธรรมชาติ",
    intro: "ค้นพบอัญมณีที่คัดสรรจากเอกลักษณ์ สีสัน และประกายที่งดงามเฉพาะตัว"
  });
  localStorage.removeItem("jgs.member.history.v1");
  sessionStorage.removeItem("jgs.visit.recorded");
  adminSearch = "";
  closeDialog();
  showToast("คืนค่าข้อมูลสินค้าและเนื้อหาเริ่มต้นแล้ว");
  navigate("admin");
}

async function handleLogin(form) {
  const data = new FormData(form);
  const email = String(data.get("email") || "").trim().toLowerCase();
  const password = String(data.get("password") || "");
  const account = users().find((user) => user.email.toLowerCase() === email);
  const lockRecords = readStore(STORAGE.login, {});
  const record = lockRecords[email] || { attempts: 0, lockedUntil: 0 };
  const now = Date.now();
  if (record.lockedUntil > now) {
    setAuthFeedback(`บัญชีถูกล็อก โปรดลองอีกครั้งหลัง ${formatDate(record.lockedUntil, { hour: "2-digit", minute: "2-digit" })} (เวลาไทย)`, "danger");
    return;
  }
  if (record.lockedUntil && record.lockedUntil <= now) {
    record.attempts = 0;
    record.lockedUntil = 0;
  }
  const candidateHash = await hashPassword(password);
  if (!account || candidateHash !== account.passwordHash) {
    record.attempts += 1;
    if (account) {
      account.failedAttempts = record.attempts;
      account.lockedUntil = record.lockedUntil;
    }
    if (record.attempts >= 5) {
      record.lockedUntil = now + 24 * 60 * 60 * 1000;
      if (account) account.lockedUntil = record.lockedUntil;
      writeStore(STORAGE.login, { ...lockRecords, [email]: record });
      if (account) writeStore(STORAGE.users, users().map((user) => user.id === account.id ? account : user));
      setAuthFeedback("กรอกรหัสผ่านผิดครบ 5 ครั้ง บัญชีถูกล็อก 24 ชั่วโมง", "danger");
      return;
    }
    writeStore(STORAGE.login, { ...lockRecords, [email]: record });
    setAuthFeedback(`อีเมลหรือรหัสผ่านไม่ถูกต้อง (เหลือ ${5 - record.attempts} ครั้งก่อนล็อกบัญชี)`, "danger");
    return;
  }
  if (account.lockedUntil > now || record.lockedUntil > now) {
    setAuthFeedback(`บัญชีถูกล็อก โปรดลองอีกครั้งหลัง ${formatDate(account.lockedUntil || record.lockedUntil, { hour: "2-digit", minute: "2-digit" })} (เวลาไทย)`, "danger");
    return;
  }
  writeStore(STORAGE.login, { ...lockRecords, [email]: { attempts: 0, lockedUntil: 0 } });
  account.failedAttempts = 0;
  account.lockedUntil = 0;
  writeStore(STORAGE.users, users().map((user) => user.id === account.id ? account : user));
  sessionStorage.setItem(SESSION_USER, account.id);
  currentUser = account;
  showToast("เข้าสู่ระบบแล้ว");
  navigate(account.role === "admin" ? "dashboard" : "home");
}

async function handleRegister(form) {
  const data = new FormData(form);
  const username = String(data.get("username") || "").trim();
  const email = String(data.get("email") || "").trim().toLowerCase();
  const password = String(data.get("password") || "");
  const confirmation = String(data.get("confirmPassword") || "");
  if (username.length < 3) return setAuthFeedback("ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร", "danger");
  if (password.length < 8) return setAuthFeedback("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร", "danger");
  if (password !== confirmation) return setAuthFeedback("รหัสผ่านทั้งสองช่องไม่ตรงกัน", "danger");
  const list = users();
  if (list.some((user) => user.email.toLowerCase() === email || user.username.toLowerCase() === username.toLowerCase())) {
    return setAuthFeedback("อีเมลหรือชื่อผู้ใช้นี้มีอยู่แล้ว โปรดตรวจสอบข้อมูล", "danger");
  }
  list.push({
    id: uuid(),
    username,
    email,
    passwordHash: await hashPassword(password),
    role: "member",
    failedAttempts: 0,
    lockedUntil: 0,
    createdAt: new Date().toISOString()
  });
  writeStore(STORAGE.users, list);
  showDialog(`<p>บัญชีสมาชิกถูกสร้างเรียบร้อยแล้ว โปรดลงชื่อเข้าใช้เพื่อเริ่มใช้งาน</p><div class="dialog-actions"><button class="button button-primary" data-action="go-login" type="button">ไปหน้าเข้าสู่ระบบ</button></div>`, "สมัครสมาชิกสำเร็จ");
}

function showForgotPassword() {
  showDialog(`<form class="dialog-content-form" id="forgot-form">
    <p class="field-hint">กรอกอีเมลบัญชี ระบบเดโมจะแสดงรหัส 6 หลักบนหน้านี้แทนการส่งอีเมลจริง</p>
    <label class="field"><span class="field-label">อีเมล</span><input class="form-control" name="email" type="email" required autocomplete="email"></label>
    <div class="dialog-actions"><button class="button button-secondary" type="button" data-action="close-dialog">ยกเลิก</button><button class="button button-primary" type="submit">ขอรหัสยืนยัน</button></div>
  </form>`, "ตั้งรหัสผ่านใหม่");
}

function showResetCode(email) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  writeStore("jgs.reset.code.v1", { email, code, expiresAt: Date.now() + 15 * 60 * 1000, used: false });
  showDialog(`<div class="notice notice-warning">โหมดเดโม: ไม่มีการส่งอีเมลจริง รหัสสำหรับทดสอบคือ <strong>${code}</strong> และหมดอายุใน 15 นาที</div>
    <form class="dialog-content-form" id="reset-form">
      <input type="hidden" name="email" value="${escapeHtml(email)}">
      <label class="field"><span class="field-label">รหัสยืนยัน 6 หลัก</span><input class="form-control" name="code" inputmode="numeric" pattern="[0-9]{6}" minlength="6" maxlength="6" required></label>
      <label class="field"><span class="field-label">รหัสผ่านใหม่</span><input class="form-control" name="password" type="password" minlength="8" maxlength="128" required autocomplete="new-password"></label>
      <label class="field"><span class="field-label">ยืนยันรหัสผ่านใหม่</span><input class="form-control" name="confirmation" type="password" minlength="8" maxlength="128" required autocomplete="new-password"></label>
      <div class="dialog-actions"><button class="button button-secondary" type="button" data-action="close-dialog">ยกเลิก</button><button class="button button-primary" type="submit">บันทึกรหัสผ่าน</button></div>
    </form>`, "ยืนยันตัวตน");
}

function startLogout() {
  showDialog(`<p>กำลังออกจากระบบ…</p>`, "ออกจากระบบ");
  setTimeout(() => {
    sessionStorage.removeItem(SESSION_USER);
    currentUser = null;
    closeDialog();
    navigate("home");
    showToast("ออกจากระบบแล้ว");
  }, 500);
}

function onClick(event) {
  const target = event.target.closest("[data-action], [data-route], [data-report]");
  if (!target) return;
  if (target.dataset.route) {
    navigate(target.dataset.route);
    return;
  }
  if (target.dataset.report) {
    currentReport = target.dataset.report;
    render();
    return;
  }
  const id = target.dataset.id;
  const product = id ? products().find((item) => item.id === id) : null;
  switch (target.dataset.action) {
    case "toggle-nav": {
      const nav = document.querySelector("#main-nav");
      const open = nav.dataset.open !== "true";
      nav.dataset.open = String(open);
      target.setAttribute("aria-expanded", String(open));
      target.setAttribute("aria-label", open ? "ปิดเมนูนำทาง" : "เปิดเมนูนำทาง");
      break;
    }
    case "logout": startLogout(); break;
    case "rotate":
      if (turntableSimulation) runSimulatedRotation();
      else void sendRemoteRotation();
      break;
    case "toggle-simulator":
      turntableSimulation = !turntableSimulation;
      render();
      break;
    case "retry-stream":
      document.querySelector("#stream-message").textContent = "สถานะกล้อง: ไม่ได้เชื่อมต่อ · สถานะสัญญาณภาพ: ยังไม่ได้ตั้งค่า · เชื่อมต่ออีกครั้งไม่สำเร็จ";
      showToast("ยังรับภาพไม่ได้ เนื่องจากยังไม่ได้ตั้งค่าแหล่งสัญญาณ", "warning");
      break;
    case "clear-filters":
      catalogQuery = "";
      catalogType = "";
      catalogAvailability = "";
      render();
      break;
    case "add-product":
      showDialog(productForm(), "เพิ่มสินค้าอัญมณี");
      break;
    case "edit-product":
      if (product) showDialog(productForm(product), "แก้ไขสินค้า");
      break;
    case "stock-product":
      if (product) showDialog(productForm(product, true), `ปรับสต็อก · ${product.name}`);
      break;
    case "delete-product":
      if (product) showDialog(`<p>นำ <strong>${escapeHtml(product.name)}</strong> ออกจากรายการเผยแพร่หรือไม่? ข้อมูลสินค้าเดิมจะยังคงอยู่เพื่อรักษาประวัติรายงาน</p>
        <div class="dialog-actions"><button class="button button-secondary" type="button" data-action="close-dialog">ยกเลิก</button><button class="button button-danger" type="button" data-action="confirm-delete" data-id="${escapeHtml(product.id)}">นำออกจากรายการ</button></div>`, "ยืนยันการนำสินค้าออก");
      break;
    case "confirm-delete":
      if (product) {
        writeStore(STORAGE.products, products().map((item) => item.id === product.id ? { ...item, published: false } : item));
        closeDialog(); render(); showToast("นำสินค้าออกจากรายการเผยแพร่แล้ว");
      }
      break;
    case "close-dialog": closeDialog(); break;
    case "forgot-password": showForgotPassword(); break;
    case "go-login": closeDialog(); navigate("login"); break;
    case "reset-demo":
      showDialog(`<p>รายการสินค้าและข้อความหน้าแรกจะถูกคืนค่าเป็นข้อมูลตัวอย่าง ส่วนบัญชีผู้ดูแลจะไม่ถูกลบ.</p>
        <div class="dialog-actions"><button class="button button-secondary" type="button" data-action="close-dialog">ยกเลิก</button><button class="button button-primary" type="button" data-action="confirm-reset">คืนค่าข้อมูล</button></div>`, "คืนค่าข้อมูลเดโม");
      break;
    case "confirm-reset": resetDemoData(); break;
    case "apply-report": {
      const { start, end } = getReportRange();
      const memberId = document.querySelector("#report-member")?.value || "";
      const output = document.querySelector("#report-content");
      if (output) output.innerHTML = renderReportContent(currentReport, start, end, memberId);
      break;
    }
    case "connect-serial": void connectSerialDevice(); break;
    case "disconnect-serial": void disconnectSerialDevice(); break;
    case "serial-status":
      if (serialPort) {
        void writeSerialCommand("IDENTIFY").then(() => writeSerialCommand("STATUS"))
          .catch((error) => setConnectionStatus("serial", "เกิดข้อผิดพลาด", `ส่งคำขอสถานะไม่สำเร็จ: ${error.message}`));
      }
      break;
    case "serial-stop":
      if (serialPort) void writeSerialCommand("STOP")
        .catch((error) => setConnectionStatus("serial", "เกิดข้อผิดพลาด", `ส่งคำสั่งหยุดไม่สำเร็จ: ${error.message}`));
      break;
    case "check-cloud-device": void checkCloudDeviceStatus(); break;
    case "refresh-showroom-security": void loadShowroomSecurity(showroomAccessPassword); break;
    case "connect-showroom-live":
      if (currentUser?.role !== "admin") break;
      showroomUseLiveData = true;
      showroomSecurityError = "";
      render();
      break;
    case "use-showroom-demo":
    case "lock-showroom-security":
      showroomAccessPassword = "";
      showroomSecurityData = null;
      showroomSecurityError = "";
      showroomSecurityLoading = false;
      showroomUseLiveData = false;
      render();
      break;
    case "select-showroom-device":
      showroomSelectedDevice = Number(target.dataset.index || 0);
      render();
      break;
    case "select-photo":
      currentDetailImage = Number(target.dataset.index || 0);
      render();
      break;
    case "remove-photo": {
      const form = document.querySelector("#product-form");
      const current = products().find((item) => item.id === form?.dataset.id);
      if (current) {
        current.images.splice(Number(target.dataset.index), 1);
        writeStore(STORAGE.products, products().map((item) => item.id === current.id ? current : item));
        showDialog(productForm(current), "แก้ไขสินค้า");
      }
      break;
    }
    default: break;
  }
}

async function onSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  if (form.id === "showroom-access-form") {
    event.preventDefault();
    const password = String(new FormData(form).get("showroomPassword") || "").trim();
    if (password.length < 32) {
      showroomSecurityError = "รหัสผ่านส่วนดูข้อมูลต้องมีอย่างน้อย 32 ตัวอักษร";
      render();
      return;
    }
    await loadShowroomSecurity(password);
  } else if (form.id === "catalog-search") {
    event.preventDefault();
    const data = new FormData(form);
    catalogQuery = String(data.get("query") || "").trim();
    catalogType = String(data.get("type") || "");
    catalogAvailability = String(data.get("availability") || "");
    render();
  } else if (form.id === "login-form") {
    event.preventDefault();
    await handleLogin(form);
  } else if (form.id === "register-form") {
    event.preventDefault();
    await handleRegister(form);
  } else if (form.id === "forgot-form") {
    event.preventDefault();
    const email = String(new FormData(form).get("email") || "").trim().toLowerCase();
    if (!users().some((user) => user.email.toLowerCase() === email)) {
      showToast("ไม่พบบัญชีนี้ในเดโม", "error");
      return;
    }
    showResetCode(email);
  } else if (form.id === "reset-form") {
    event.preventDefault();
    const data = new FormData(form);
    const reset = readStore("jgs.reset.code.v1", null);
    const email = String(data.get("email") || "").toLowerCase();
    const code = String(data.get("code") || "");
    const password = String(data.get("password") || "");
    const confirmation = String(data.get("confirmation") || "");
    if (!reset || reset.used || reset.email !== email || reset.code !== code || reset.expiresAt < Date.now()) {
      showToast("รหัสยืนยันไม่ถูกต้อง หมดอายุ หรือถูกใช้ไปแล้ว", "error");
      return;
    }
    if (password.length < 8 || password !== confirmation) {
      showToast("รหัสผ่านใหม่ไม่ตรงกัน หรือสั้นกว่า 8 ตัวอักษร", "error");
      return;
    }
    const list = users();
    const account = list.find((user) => user.email.toLowerCase() === email);
    if (!account) {
      showToast("ไม่พบบัญชีนี้ในเดโม", "error");
      return;
    }
    account.passwordHash = await hashPassword(password);
    account.failedAttempts = 0;
    account.lockedUntil = 0;
    writeStore(STORAGE.users, list);
    const lockRecords = readStore(STORAGE.login, {});
    delete lockRecords[email];
    writeStore(STORAGE.login, lockRecords);
    writeStore("jgs.reset.code.v1", { ...reset, used: true });
    showDialog(`<p>เปลี่ยนรหัสผ่านเรียบร้อยแล้ว โปรดใช้รหัสผ่านใหม่ในการเข้าสู่ระบบ</p><div class="dialog-actions"><button class="button button-primary" type="button" data-action="go-login">ไปหน้าเข้าสู่ระบบ</button></div>`, "ตั้งรหัสผ่านสำเร็จ");
  } else if (form.id === "product-form") {
    event.preventDefault();
    const data = new FormData(form);
    const id = form.dataset.id;
    const stockOnly = form.dataset.stockOnly === "true";
    const list = products();
    const existing = list.find((item) => item.id === id);
    const stock = Number(data.get("stock"));
    const lowStockInput = String(data.get("lowStock") || "").trim();
    const lowStock = lowStockInput === "" ? null : Number(lowStockInput);
    if (!Number.isInteger(stock) || stock < 0 || (lowStock !== null && (!Number.isInteger(lowStock) || lowStock < 0))) {
      showToast("จำนวนคงเหลือและเกณฑ์ใกล้หมดต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป", "error");
      return;
    }
    if (stockOnly) {
      if (!existing) return showToast("ไม่พบสินค้า โปรดโหลดหน้าใหม่", "error");
      existing.stock = stock;
      existing.lowStock = lowStock;
      writeStore(STORAGE.products, list.map((item) => item.id === existing.id ? existing : item));
      closeDialog(); render(); showToast("บันทึกจำนวนคงเหลือแล้ว");
      return;
    }
    const code = String(data.get("code") || "").trim();
    const name = String(data.get("name") || "").trim();
    const type = String(data.get("type") || "").trim();
    const duplicate = list.some((item) => item.id !== id && item.code.toLowerCase() === code.toLowerCase());
    if (duplicate) return showToast("รหัสสินค้านี้มีอยู่แล้ว", "error");
    const price = Number(data.get("price"));
    if (!Number.isFinite(price) || price < 0 || !name || !type) return showToast("ตรวจสอบชื่อ ประเภท และราคาให้ถูกต้อง", "error");
    const imageFiles = [...(form.querySelector('[name="images"]')?.files || [])];
    const oldImages = existing?.images || [];
    if (oldImages.length + imageFiles.length > 10) return showToast("สินค้าแต่ละรายการเพิ่มรูปได้ไม่เกิน 10 รูป", "error");
    const resized = [];
    try {
      for (const file of imageFiles) resized.push(await resizeImage(file));
    } catch (error) {
      showToast(error.message || "ไม่สามารถอ่านไฟล์รูปภาพได้", "error");
      return;
    }
    const updated = {
      ...(existing || {}),
      id: existing?.id || uuid(),
      code, name, type,
      color: String(data.get("color")),
      cut: String(data.get("cut") || "").trim(),
      origin: String(data.get("origin") || "").trim(),
      description: String(data.get("description") || "").trim(),
      price, stock, lowStock,
      published: data.has("published"),
      images: [...oldImages, ...resized]
    };
    if (existing) writeStore(STORAGE.products, list.map((item) => item.id === id ? updated : item));
    else writeStore(STORAGE.products, [...list, updated]);
    closeDialog(); render(); showToast(existing ? "บันทึกการแก้ไขแล้ว" : "เพิ่มสินค้าแล้ว");
  } else if (form.id === "content-form") {
    event.preventDefault();
    const data = new FormData(form);
    writeStore(STORAGE.content, { headline: String(data.get("headline")).trim(), intro: String(data.get("intro")).trim() });
    showToast("บันทึกเนื้อหาหน้าแรกแล้ว");
  }
}

function onInput(event) {
  if (event.target.id !== "admin-search") return;
  adminSearch = event.target.value;
  const start = event.target.selectionStart;
  render();
  const next = document.querySelector("#admin-search");
  next?.focus();
  next?.setSelectionRange(start, start);
}

function handleActionClick(event) {
  try {
    onClick(event);
  } catch (error) {
    console.error("ดำเนินการไม่สำเร็จ:", error);
    showToast(error.message || "ดำเนินการไม่สำเร็จ โปรดลองอีกครั้ง", "error");
  }
}

app.addEventListener("click", handleActionClick);
dialog.addEventListener("click", handleActionClick);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});
document.addEventListener("submit", (event) => {
  onSubmit(event).catch((error) => {
    console.error("บันทึกข้อมูลไม่สำเร็จ:", error);
    showToast(error.message || "บันทึกข้อมูลไม่สำเร็จ โปรดลองอีกครั้ง", "error");
  });
});
document.addEventListener("input", onInput);
window.addEventListener("hashchange", render);

initialize().catch((error) => {
  console.error("Jewelry Gem Stone could not start:", error);
  app.innerHTML = `<main class="container"><div class="notice notice-danger" role="alert"><strong>เริ่มต้นแอปไม่สำเร็จ</strong><br>${escapeHtml(error.message || "ไม่สามารถใช้พื้นที่จัดเก็บข้อมูลของเบราว์เซอร์ได้")} ลองล้างข้อมูลของเว็บไซต์นี้แล้วโหลดใหม่ หรือเปิดด้วยเบราว์เซอร์รุ่นปัจจุบัน</div></main>`;
});
