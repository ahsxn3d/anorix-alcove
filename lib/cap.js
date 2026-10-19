// Alcove: off-grid capsule home in a procedural valley + time-of-day rig. Shared by live R3F and poster renders.
// RoundedBoxGeometry is injected (RB) so this file has no bare imports
function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) / 2147483647); }
const n2 = (x, z) => Math.sin(x * 0.35 + Math.cos(z * 0.21) * 1.7) * 0.9 + Math.sin(z * 0.27 + x * 0.12) * 1.1 + Math.sin(x * 0.9 + z * 0.7) * 0.25;
export const height = (x, z) => { const d = Math.hypot(x, z * 0.8); const valley = Math.min(1, Math.max(0, (d - 5) / 22)); return n2(x, z) * 0.35 * (0.3 + valley) + valley * valley * 7 - 0.4; };
// time-of-day keys: dawn, day, dusk, night
export const KEYS = [
  { sky: 0xe9c9b4, fog: 0xe3c4b0, sun: 0xffc18a, si: 1.6, sx: -0.9, sy: 0.25, amb: 0.55, win: 0.1, hemi: 0x9fb2c4 },
  { sky: 0xcfe0e8, fog: 0xd6e2e6, sun: 0xfff3e0, si: 2.4, sx: -0.3, sy: 1.0, amb: 0.75, win: 0.0, hemi: 0xbcd3e0 },
  { sky: 0xd9906a, fog: 0xc98a6b, sun: 0xff8a4a, si: 1.5, sx: 0.95, sy: 0.18, amb: 0.45, win: 0.6, hemi: 0x7a6a8a },
  { sky: 0x121722, fog: 0x141a26, sun: 0x8fa6d6, si: 0.35, sx: 0.4, sy: 0.8, amb: 0.18, win: 1.0, hemi: 0x26304a },
];
export function capsule(THREE, RB, size = 1, M) {
  const RoundedBoxGeometry = RB;
  const g = new THREE.Group(); const w = 4.2 * size, h = 2.5, d = 2.6;
  const shell = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 6, 1.1), M.shell); shell.position.y = h / 2 + 0.9; g.add(shell);
  const glass = new THREE.Mesh(new RoundedBoxGeometry(w - 1.6, h - 1.0, 0.3, 5, 0.14), M.glass); glass.position.set(0, h / 2 + 0.9, d / 2 - 0.12); g.add(glass);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(w + 1.4, 0.12, 1.6), M.wood); deck.position.set(0, 0.86, d / 2 + 0.7); g.add(deck);
  for (let i = 0; i < 9; i++) { const sl = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.125, 1.6), M.dark); sl.position.set(-(w + 1.4) / 2 + (i + 0.5) * (w + 1.4) / 9, 0.865, d / 2 + 0.7); g.add(sl); }
  for (const x of [-w / 2 + 0.5, w / 2 - 0.5]) for (const z of [-d / 2 + 0.5, d / 2 + 1.2]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.6, 10), M.dark); leg.position.set(x, 0.1, z); g.add(leg); }
  const solar = new THREE.Mesh(new THREE.BoxGeometry(w * 0.62, 0.05, d * 0.4), M.solar); solar.position.set(0, h + 0.88, -0.05); solar.rotation.x = -0.04; g.add(solar);
  g.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  return g;
}
export function mats(THREE) {
  return {
    shell: new THREE.MeshStandardMaterial({ color: 0xe9e4da, roughness: 0.42, metalness: 0.08 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x2b3a44, roughness: 0.12, metalness: 0.6, emissive: 0xffa95c, emissiveIntensity: 0 }),
    wood: new THREE.MeshStandardMaterial({ color: 0xb8794e, roughness: 0.75 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x23272b, roughness: 0.6 }),
    solar: new THREE.MeshStandardMaterial({ color: 0x1c2740, roughness: 0.2, metalness: 0.6 }),
  };
}
export function buildWorld(THREE, o = {}) {
  const root = new THREE.Group(); const M = mats(THREE);
  // terrain
  const S = o.mobile ? 90 : 140; const tg = new THREE.PlaneGeometry(120, 120, S, S); tg.rotateX(-Math.PI / 2);
  const p = tg.attributes.position, col = new Float32Array(p.count * 3), cA = new THREE.Color(0x8c9a6a), cB = new THREE.Color(0x4f5e3e), cC = new THREE.Color(0xb7a98a), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), y = height(x, z); p.setY(i, y); const k = Math.min(1, Math.max(0, y / 6)); c.copy(cA).lerp(cB, k).lerp(cC, Math.max(0, (y - 5) / 4) * 0.6); col.set([c.r, c.g, c.b], i * 3); }
  tg.setAttribute("color", new THREE.BufferAttribute(col, 3)); tg.computeVertexNormals();
  const ground = new THREE.Mesh(tg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 })); ground.receiveShadow = true; root.add(ground);
  // pines (instanced)
  const r = rng(11); const N = o.mobile ? 220 : 420; const cone = new THREE.ConeGeometry(0.62, 1.7, 7); cone.translate(0, 1.5, 0); const c2 = new THREE.ConeGeometry(0.45, 1.3, 7); c2.translate(0, 2.4, 0); const tr = new THREE.CylinderGeometry(0.07, 0.09, 0.8, 5); tr.translate(0, 0.4, 0);
  const merge = (gs) => { const ng = gs.map((g) => (g.index ? g.toNonIndexed() : g)); let n = 0; ng.forEach((g) => (n += g.attributes.position.count)); const P = new Float32Array(n * 3), Nn = new Float32Array(n * 3); let off = 0; ng.forEach((g) => { P.set(g.attributes.position.array, off * 3); Nn.set(g.attributes.normal.array, off * 3); off += g.attributes.position.count; }); const out = new THREE.BufferGeometry(); out.setAttribute("position", new THREE.BufferAttribute(P, 3)); out.setAttribute("normal", new THREE.BufferAttribute(Nn, 3)); return out; };
  const pine = merge([cone, c2, tr]);
  const trees = new THREE.InstancedMesh(pine, new THREE.MeshStandardMaterial({ color: 0x2f3a2c, roughness: 0.9, flatShading: true }), N); const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), ps = new THREE.Vector3();
  let k = 0; while (k < N) { const x = (r() - 0.5) * 100, z = (r() - 0.5) * 100 - 10; if (Math.hypot(x, z) < 8 || (z > -2 && x > -16 && x < 14 && z < 40)) continue; const s = 0.6 + r() * 1.1; ps.set(x, height(x, z) - 0.1, z); sc.set(s, s * (0.9 + r() * 0.6), s); m4.compose(ps, q, sc); trees.setMatrixAt(k++, m4); }
  trees.castShadow = true; trees.receiveShadow = true; root.add(trees);
  // the capsule, on a small levelled pad
  const cap = capsule(THREE, o.RB, 1, M); cap.position.set(0, height(0, 0) + 0.1, 0); cap.rotation.y = -0.45; root.add(cap);
  // lights
  const hemi = new THREE.HemisphereLight(0xbcd3e0, 0x3a3326, 0.7); root.add(hemi);
  const sun = new THREE.DirectionalLight(0xffffff, 2); sun.castShadow = true; sun.shadow.mapSize.set(o.mobile ? 1024 : 2048, o.mobile ? 1024 : 2048); const sc2 = sun.shadow.camera; sc2.left = sc2.bottom = -12; sc2.right = sc2.top = 12; sc2.far = 80; sun.shadow.bias = -0.0005; root.add(sun); root.add(sun.target);
  const lamp = new THREE.PointLight(0xffb46a, 0, 14, 1.6); lamp.position.set(0, 2.3, 2.6); cap.add(lamp);
  const tmp = { a: new THREE.Color(), b: new THREE.Color() };
  function setTime(t, scene) { // t in [0,3]
    const i = Math.min(2, Math.floor(t)), f = t - i, A = KEYS[i], B = KEYS[i + 1], L = (a, b) => a + (b - a) * f;
    const C = (a, b) => tmp.a.setHex(a).lerp(tmp.b.setHex(b), f).clone();
    if (scene) { scene.background = C(A.sky, B.sky); if (scene.fog) scene.fog.color.copy(C(A.fog, B.fog)); }
    sun.color.copy(C(A.sun, B.sun)); sun.intensity = L(A.si, B.si); sun.position.set(L(A.sx, B.sx) * 30, L(A.sy, B.sy) * 26 + 3, 18); hemi.intensity = L(A.amb, B.amb); hemi.color.copy(C(A.hemi, B.hemi));
    const w = L(A.win, B.win); M.glass.emissiveIntensity = w * 1.3; lamp.intensity = w * 16;
  }
  return { root, setTime, cap, M };
}

export const CAM = (mobile) => mobile ? { pos: [4.5, 4.2, 19], tgt: [0, 0.6, 0] } : { pos: [7.2, 4.4, 16.5], tgt: [-2.9, 2.3, 0] };
