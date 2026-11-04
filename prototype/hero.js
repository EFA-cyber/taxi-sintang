// Hero: kolom tujuan, pelat rambu, dan sakelar 3D.
// Jarak & waktu tempuh masih perkiraan (belum dicek sopir): lihat PRD §6 F1.
const TUJUAN = {
  pontianak: { nama: "Pontianak", km: "± 395 km", jam: "± 8–9 jam" },
  sekadau: { nama: "Sekadau", km: "± 100 km", jam: "± 2,5 jam" },
  putussibau: { nama: "Putussibau", km: "± 270 km", jam: "± 6–7 jam" },
  "nanga-pinoh": { nama: "Nanga Pinoh", km: "± 75 km", jam: "± 2 jam" },
  tebelian: { nama: "Bandara Tebelian", km: "± 18 km", jam: "± 25 menit" },
};

const slug = (teks) =>
  teks.toLowerCase().replace(/^bandara\s+/, "").trim().replace(/\s+/g, "-");

const el = {
  scene: document.getElementById("scene"),
  form: document.getElementById("tujuan-form"),
  input: document.getElementById("tujuan"),
  rambu: document.getElementById("rambu"),
  kota: document.getElementById("rambu-kota"),
  angka: document.getElementById("rambu-angka"),
  catatan: document.getElementById("rambu-catatan"),
  toggle: document.getElementById("toggle-3d"),
};

// ---------- Kemampuan perangkat ----------
function bacaPilihan() {
  try { return localStorage.getItem("3d"); } catch { return null; }
}
function simpanPilihan(v) {
  try { localStorage.setItem("3d", v); } catch { /* mode privat: abaikan */ }
}

function bolehMuat3D() {
  if (bacaPilihan() === "off") return false;
  const kon = navigator.connection;
  if (kon && (kon.saveData || /(^|-)2g|3g/.test(kon.effectiveType || ""))) return false;
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

const gerakDikurangi = matchMedia("(prefers-reduced-motion: reduce)").matches;
let adegan = null;

async function nyalakan3D() {
  el.scene.classList.remove("tanpa-3d");
  el.toggle.setAttribute("aria-pressed", "true");
  el.toggle.textContent = "3D nyala";
  if (adegan) { adegan.mulai(); return; }
  try {
    const { buatAdegan } = await import("./scene.js");
    const canvas = document.createElement("canvas");
    el.scene.prepend(canvas);
    adegan = buatAdegan(canvas, { gerak: !gerakDikurangi });
    const awal = slug(new URLSearchParams(location.search).get("ke") || "");
    if (TUJUAN[awal]) { adegan.lewatiIntro(); adegan.pilihRute(awal); }
  } catch (err) {
    console.warn("3D gagal dimuat, memakai poster.", err);
    matikan3D(false);
  }
}

function matikan3D(simpan = true) {
  el.scene.classList.add("tanpa-3d");
  el.toggle.setAttribute("aria-pressed", "false");
  el.toggle.textContent = "3D mati";
  adegan?.berhenti();
  if (simpan) simpanPilihan("off");
}

el.toggle.addEventListener("click", () => {
  if (el.toggle.getAttribute("aria-pressed") === "true") matikan3D();
  else { simpanPilihan("on"); nyalakan3D(); }
});

// ---------- Tujuan ----------
function span(teks) {
  const s = document.createElement("span");
  s.textContent = teks;
  return s;
}
function tampilkan(teks) {
  const id = slug(teks);
  const data = TUJUAN[id];
  el.rambu.hidden = false;
  if (data) {
    el.kota.textContent = data.nama;
    el.angka.replaceChildren(span(data.km), span(data.jam));
    el.catatan.textContent = "Perkiraan dari kota Sintang. Jarak pasti dicek sopir saat konfirmasi.";
  } else {
    el.kota.textContent = teks;
    el.angka.textContent = "Jarak dihitung admin";
    el.catatan.textContent = "Tujuan ini belum ada di daftar kami. Kirim lewat WhatsApp, admin akan menghitung jarak dan biayanya.";
  }
  adegan?.pilihRute(data ? id : null);
}

el.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const teks = el.input.value.trim();
  if (!teks) return;
  const url = new URL(location.href);
  url.searchParams.set("ke", slug(teks));
  history.replaceState(null, "", url);
  tampilkan(teks);
});

// ---------- Mulai ----------
const awal = new URLSearchParams(location.search).get("ke");
if (awal) {
  const data = TUJUAN[slug(awal)];
  el.input.value = data ? data.nama : awal.replace(/-/g, " ");
  tampilkan(el.input.value);
}

if (bolehMuat3D()) {
  const muat = () => nyalakan3D();
  "requestIdleCallback" in window ? requestIdleCallback(muat, { timeout: 600 }) : setTimeout(muat, 200);
} else {
  matikan3D(false);
}
