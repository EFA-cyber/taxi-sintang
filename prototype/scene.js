// Diorama Sintang: pertemuan Kapuas–Melawi, Bukit Kelam, kota di tanjung sungai,
// dan jalan ke tiap tujuan. Semua dibangun prosedural (tanpa file model).
import * as THREE from "three";

const WARNA = {
  kabut: 0xdde4e1,
  air: 0x8a5a2b,
  laterit: 0x9a5a34,
  hutan: [0x2f4a3a, 0x3a5a42, 0x46664a, 0x2a4234],
  granit: 0x4a5154,
  atapSeng: 0x8d9496,
  atapKarat: 0x7a4a33,
  dinding: 0xcfc6b4,
  jalan: 0x9b7650,
  lampu: 0xf2b33d,
};

// ---------- Noise kecil (value noise + fbm) ----------
function hash(x, z) {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise(x, z) {
  const xi = Math.floor(x), zi = Math.floor(z);
  const xf = x - xi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = zf * zf * (3 - 2 * zf);
  const a = hash(xi, zi), b = hash(xi + 1, zi), c = hash(xi, zi + 1), d = hash(xi + 1, zi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, z) {
  let t = 0, amp = 0.5, f = 1;
  for (let i = 0; i < 5; i++) { t += amp * noise(x * f, z * f); f *= 2.03; amp *= 0.5; }
  return t;
}

// ---------- Sungai (koordinat XZ, pertemuan di 0,0) ----------
const SUNGAI = [
  { nama: "Kapuas hulu", lebar: 4.2, titik: [[130, -16], [95, -22], [70, -14], [45, -6], [22, -10], [0, 0]] },
  { nama: "Melawi", lebar: 3.4, titik: [[14, 140], [20, 100], [8, 70], [14, 42], [6, 18], [0, 0]] },
  { nama: "Kapuas hilir", lebar: 6.0, titik: [[0, 0], [-24, 6], [-50, 2], [-78, 12], [-150, 6]] },
];

function jarakKeSegmen(px, pz, ax, az, bx, bz) {
  const dx = bx - ax, dz = bz - az;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / (dx * dx + dz * dz)));
  const cx = ax + t * dx - px, cz = az + t * dz - pz;
  return Math.sqrt(cx * cx + cz * cz);
}
function jarakSungai(x, z) {
  let terdekat = Infinity, lebar = 4;
  for (const s of SUNGAI) {
    for (let i = 0; i < s.titik.length - 1; i++) {
      const [ax, az] = s.titik[i], [bx, bz] = s.titik[i + 1];
      const d = jarakKeSegmen(x, z, ax, az, bx, bz);
      if (d - s.lebar < terdekat - lebar) { terdekat = d; lebar = s.lebar; }
    }
  }
  return { d: terdekat, lebar };
}

// Bukit Kelam: monolit dengan sisi curam dan puncak membulat
const KELAM = { x: 58, z: -80, r: 15, tinggi: 29 };
function tinggiKelam(x, z) {
  const dx = (x - KELAM.x) / KELAM.r, dz = (z - KELAM.z) / (KELAM.r * 0.8);
  const q = dx * dx + dz * dz;
  // dinding granit curam bergaris, puncak membulat
  const garis = 1 + (fbm(x * 0.35, z * 0.12) - 0.5) * 0.35;
  return Math.exp(-q * q * 1.1) * KELAM.tinggi * garis;
}

function smoothstep(a, b, t) {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
}

export function tinggi(x, z) {
  const bukit = fbm(x * 0.028 + 3.1, z * 0.028 - 7.4) * 7.5 + fbm(x * 0.09, z * 0.09) * 1.2;
  const { d, lebar } = jarakSungai(x, z);
  const tepi = smoothstep(lebar * 0.85, lebar + 7, d);
  let h = -1.4 + (bukit + 0.6) * tepi;
  // Kota di tanjung pertemuan sungai lebih datar
  const kota = Math.exp(-((x - 12) ** 2 + (z - 11) ** 2) / 160);
  h = h * (1 - kota * 0.7) + kota * 0.9 * tepi;
  return h + tinggiKelam(x, z);
}

// ---------- Tujuan dan jalan ----------
const KOTA = new THREE.Vector2(12, 11);
export const JALAN = {
  pontianak: [[12, 11], [4, 24], [-14, 30], [-40, 30], [-70, 36], [-110, 30], [-160, 34]],
  sekadau: [[12, 11], [4, 24], [-14, 30], [-40, 30], [-70, 36]],
  putussibau: [[12, 11], [30, 8], [52, 6], [78, -2], [104, -4], [150, -8]],
  "nanga-pinoh": [[12, 11], [24, 30], [26, 56], [24, 84], [30, 118], [30, 150]],
  tebelian: [[12, 11], [26, 10], [40, 16], [48, 20]],
};

// ---------- Bangun adegan ----------
export function buatAdegan(canvas, { gerak = true } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(WARNA.kabut);
  scene.fog = new THREE.FogExp2(WARNA.kabut, 0.0105);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.5, 600);

  // Cahaya subuh: matahari rendah dari timur, langit mendung
  scene.add(new THREE.HemisphereLight(0xe8eeea, 0x3a4a3c, 1.25));
  const matahari = new THREE.DirectionalLight(0xffe2b8, 1.6);
  matahari.position.set(120, 45, -40);
  scene.add(matahari);

  // Daratan (flat shading, warna per titik)
  const UKURAN = 320, SEG = 220;
  const geo = new THREE.PlaneGeometry(UKURAN, UKURAN, SEG, SEG).toNonIndexed();
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const warna = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) + 20, z = pos.getZ(i) - 10;
    pos.setXYZ(i, x, tinggi(x, z), z);
  }
  // warna per segitiga supaya tampak low-poly
  for (let i = 0; i < pos.count; i += 3) {
    const x = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3;
    const y = (pos.getY(i) + pos.getY(i + 1) + pos.getY(i + 2)) / 3;
    const z = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3;
    const k = tinggiKelam(x, z);
    if (k > 6 && y > 6) {
      c.setHex(WARNA.granit).lerp(new THREE.Color(0x2c3336), fbm(x * 0.5, z * 0.2) * 0.9);
      if (fbm(x * 0.8, z * 0.8) > 0.62) c.setHex(0x34503d); // semak di celah batu
    } else if (y < 0.35) {
      c.setHex(WARNA.laterit).lerp(new THREE.Color(0x6e4a30), hash(x, z) * 0.5);
    } else {
      const n = fbm(x * 0.07 + 11, z * 0.07);
      c.setHex(WARNA.hutan[Math.min(3, Math.floor(n * 4.2))]);
      c.offsetHSL(0, 0, (hash(x * 3.1, z * 1.7) - 0.5) * 0.04);
    }
    for (let j = 0; j < 3; j++) warna.set([c.r, c.g, c.b], (i + j) * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(warna, 3));
  geo.computeVertexNormals();
  const darat = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 }));
  scene.add(darat);

  // Air Kapuas: berwarna teh, sedikit berkilau
  const air = new THREE.Mesh(
    new THREE.PlaneGeometry(UKURAN, UKURAN),
    new THREE.MeshStandardMaterial({ color: WARNA.air, roughness: 0.28, metalness: 0.05 })
  );
  air.rotation.x = -Math.PI / 2;
  air.position.set(20, -0.05, -10);
  scene.add(air);

  // Kota Sintang di tanjung pertemuan sungai
  const rumah = new THREE.Group();
  const kotak = new THREE.BoxGeometry(1, 1, 1);
  const atap = new THREE.ConeGeometry(0.78, 0.55, 4);
  atap.rotateY(Math.PI / 4);
  const matDinding = new THREE.MeshStandardMaterial({ color: WARNA.dinding, roughness: 0.9, flatShading: true });
  const matSeng = new THREE.MeshStandardMaterial({ color: WARNA.atapSeng, roughness: 0.5, metalness: 0.3, flatShading: true });
  const matKarat = new THREE.MeshStandardMaterial({ color: WARNA.atapKarat, roughness: 0.8, flatShading: true });
  let dibuat = 0;
  for (let n = 0; n < 900 && dibuat < 140; n++) {
    const x = KOTA.x + (hash(n, 1.3) - 0.5) * 30;
    const z = KOTA.y + (hash(n, 7.9) - 0.5) * 26;
    const { d, lebar } = jarakSungai(x, z);
    if (d < lebar + 1.6 || Math.hypot(x - KOTA.x, z - KOTA.y) > 15 + hash(n, 3) * 4) continue;
    const s = 0.7 + hash(n, 5) * 0.7;
    const y = Math.max(tinggi(x, z), 0.2);
    const badan = new THREE.Mesh(kotak, matDinding);
    badan.scale.set(s, s * 0.7, s * 1.25);
    badan.position.set(x, y + s * 0.35, z);
    badan.rotation.y = hash(n, 9) > 0.5 ? 0.3 : -0.4;
    const a = new THREE.Mesh(atap, hash(n, 2) > 0.35 ? matSeng : matKarat);
    a.scale.set(s, s, s * 1.25);
    a.position.set(x, y + s * 0.7 + 0.27 * s, z);
    a.rotation.y = badan.rotation.y;
    rumah.add(badan, a);
    dibuat++;
  }
  scene.add(rumah);

  // Jalan: tabung tipis di atas tanah; jalan terpilih menyala
  const matJalan = new THREE.MeshStandardMaterial({ color: WARNA.jalan, roughness: 0.9 });
  const matNyala = new THREE.MeshStandardMaterial({ color: WARNA.lampu, emissive: WARNA.lampu, emissiveIntensity: 0.9, roughness: 0.6 });
  const jalan = {};
  for (const [id, titik] of Object.entries(JALAN)) {
    const kurva = new THREE.CatmullRomCurve3(
      titik.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, "centripetal"
    );
    const sampel = kurva.getSpacedPoints(Math.round(kurva.getLength() * 1.2)).map((p) => {
      p.y = Math.max(tinggi(p.x, p.z), 0.35) + 0.22; // di atas air = jembatan
      return p;
    });
    const tabung = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(sampel), sampel.length * 2, 0.32, 5, false);
    const dasar = new THREE.Mesh(tabung, matJalan);
    // tabung nyala sedikit lebih tebal supaya tidak berkedip bertumpuk dengan jalan dasar
    const tabungNyala = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(sampel), sampel.length * 2, 0.44, 6, false);
    const nyala = new THREE.Mesh(tabungNyala, matNyala);
    nyala.visible = false;
    scene.add(dasar, nyala);
    jalan[id] = { nyala, total: tabungNyala.index.count, ujung: sampel[sampel.length - 1] };
  }

  // Kabut tipis di atas sungai (tekstur noise dari canvas)
  const kabut = [];
  const tex = teksturKabut();
  for (let i = 0; i < 4; i++) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(260, 140),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.38 - i * 0.05, depthWrite: false, color: WARNA.kabut, fog: true })
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(-10 + i * 18, 2.2 + i * 1.6, -5 - i * 22);
    m.material.map = tex.clone();
    m.material.map.needsUpdate = true;
    m.material.map.offset.set(i * 0.27, i * 0.13);
    kabut.push(m);
    scene.add(m);
  }

  // ---------- Kamera ----------
  const AWAL = { pos: new THREE.Vector3(-46, 92, 118), lihat: new THREE.Vector3(14, 0, -20) };
  const LEBAR = { pos: new THREE.Vector3(-36, 19, 60), lihat: new THREE.Vector3(20, 9, -28) };
  const TEGAK = { pos: new THREE.Vector3(-4, 26, 46), lihat: new THREE.Vector3(30, 6, -40) };
  const DIAM = { pos: LEBAR.pos.clone(), lihat: LEBAR.lihat.clone() };
  const target = { pos: DIAM.pos.clone(), lihat: DIAM.lihat.clone() };
  let introMulai = performance.now();
  const INTRO_MS = 2400;
  const pointer = new THREE.Vector2();
  let aktif = null, gambarMulai = 0;

  function ukur() {
    const { clientWidth: w, clientHeight: h } = canvas.parentElement;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Di layar sempit, mundur sedikit supaya pertemuan sungai tetap terlihat
    const tegak = w / h < 1;
    camera.fov = tegak ? 52 : 38;
    const pakai = tegak ? TEGAK : LEBAR;
    scene.fog.density = tegak ? 0.0075 : 0.0105;
    DIAM.pos.copy(pakai.pos); DIAM.lihat.copy(pakai.lihat);
    if (!aktif) { target.pos.copy(DIAM.pos); target.lihat.copy(DIAM.lihat); }
    camera.updateProjectionMatrix();
  }
  ukur();
  new ResizeObserver(ukur).observe(canvas.parentElement);
  const kamPos = (gerak ? AWAL.pos : DIAM.pos).clone();
  const kamLihat = (gerak ? AWAL.lihat : DIAM.lihat).clone();

  window.addEventListener("pointermove", (e) => {
    pointer.set(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
  }, { passive: true });

  // ---------- Pilih rute ----------
  function pilihRute(id) {
    for (const j of Object.values(jalan)) j.nyala.visible = false;
    aktif = jalan[id] || null;
    if (!aktif) {
      target.pos.copy(DIAM.pos); target.lihat.copy(DIAM.lihat);
      return;
    }
    aktif.nyala.visible = true;
    gambarMulai = performance.now();
    // Kamera bergeser ke arah tujuan, tetap memperlihatkan kota
    const arah = new THREE.Vector3(aktif.ujung.x - KOTA.x, 0, aktif.ujung.z - KOTA.y).normalize();
    target.lihat.copy(DIAM.lihat).add(new THREE.Vector3(arah.x * 12, -2, arah.z * 8));
    target.pos.copy(DIAM.pos).add(new THREE.Vector3(arah.x * 8, 4, arah.z * 6));
  }

  // ---------- Loop ----------
  let jalanTerus = true, idFrame = 0;
  const jam = new THREE.Clock();
  function frame(now) {
    const dt = Math.min(jam.getDelta(), 0.05);
    if (gerak) {
      const t = Math.min(1, (now - introMulai) / INTRO_MS);
      if (t < 1) {
        const e = 1 - Math.pow(1 - t, 3);
        kamPos.lerpVectors(AWAL.pos, target.pos, e);
        kamLihat.lerpVectors(AWAL.lihat, target.lihat, e);
      } else {
        const pPos = target.pos.clone().add(new THREE.Vector3(pointer.x * 6, -pointer.y * 3, 0));
        kamPos.lerp(pPos, 1 - Math.pow(0.04, dt));
        kamLihat.lerp(target.lihat, 1 - Math.pow(0.04, dt));
      }
      kabut.forEach((m, i) => { m.material.map.offset.x += dt * (0.004 + i * 0.0015); });
    } else {
      kamPos.copy(target.pos); kamLihat.copy(target.lihat);
    }
    if (aktif) {
      const p = gerak ? Math.min(1, (now - gambarMulai) / 1200) : 1;
      aktif.nyala.geometry.setDrawRange(0, Math.floor(aktif.total * p / 3) * 3);
    }
    camera.position.copy(kamPos);
    camera.lookAt(kamLihat);
    renderer.render(scene, camera);
    if (jalanTerus && gerak) idFrame = requestAnimationFrame(frame);
  }

  function mulai() {
    if (jalanTerus && idFrame) return;
    jalanTerus = true;
    jam.getDelta();
    idFrame = requestAnimationFrame(frame);
  }
  function berhenti() {
    jalanTerus = false;
    cancelAnimationFrame(idFrame);
    idFrame = 0;
  }
  function gambarSekali() { requestAnimationFrame(frame); }

  // Berhenti menggambar saat hero tidak terlihat
  new IntersectionObserver(([e]) => {
    if (!gerak) return;
    e.isIntersecting ? mulai() : berhenti();
  }).observe(canvas.parentElement);

  if (gerak) mulai(); else gambarSekali();

  return {
    pilihRute(id) { pilihRute(id); if (!gerak) gambarSekali(); },
    mulai, berhenti,
    lewatiIntro() { introMulai = -INTRO_MS; },
  };
}

function teksturKabut() {
  const s = 256;
  const cv = document.createElement("canvas");
  cv.width = cv.height = s;
  const ctx = cv.getContext("2d");
  const img = ctx.createImageData(s, s);
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      // noise yang bisa disambung (tileable) dengan memetakan ke torus sederhana
      const a = (x / s) * Math.PI * 2, b = (y / s) * Math.PI * 2;
      const n = fbm(Math.cos(a) * 2 + 5, Math.sin(a) * 2 + Math.cos(b) * 1.5 + Math.sin(b) * 1.5);
      const v = Math.max(0, n - 0.42) * 2.6;
      const i = (y * s + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
      img.data[i + 3] = Math.min(255, v * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
