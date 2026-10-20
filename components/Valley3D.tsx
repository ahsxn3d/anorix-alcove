"use client";
/** Alcove opening: a live, art-directed valley. Layered ridges with treelines and pooled mist (shader planes),
 *  a sky with sun glow + stars, a wind-swayed instanced meadow, pines, rocks and the capsule. Time of day (dawn → night) is driven by scroll. */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

type Key = { top: number; hor: number; sun: number; si: number; sd: [number, number, number]; hemi: number; hi: number; ridge: number; win: number; stars: number; grass: number; env: number };
const K: Key[] = [
  { top: 0x9db3c9, hor: 0xf2cfb4, sun: 0xffc690, si: 2.2, sd: [-0.8, 0.16, -0.6], hemi: 0xc9d4e0, hi: 0.75, ridge: 0x4e5a63, win: 0.25, stars: 0, grass: 0x8a9460, env: 0.55 },
  { top: 0x6f9fc8, hor: 0xd9e6ec, sun: 0xfff4e2, si: 3.0, sd: [-0.35, 0.85, -0.25], hemi: 0xd4e4ee, hi: 1.0, ridge: 0x51665e, win: 0, stars: 0, grass: 0x7f9a52, env: 0.8 },
  { top: 0x4b4f78, hor: 0xf09a66, sun: 0xff8a48, si: 2.0, sd: [0.85, 0.1, -0.7], hemi: 0x8c7a95, hi: 0.55, ridge: 0x3e3a4c, win: 0.7, stars: 0.15, grass: 0x6f6e48, env: 0.45 },
  { top: 0x070b16, hor: 0x1b2438, sun: 0x9fb4e0, si: 0.45, sd: [0.3, 0.7, -0.5], hemi: 0x2c3858, hi: 0.3, ridge: 0x0e131e, win: 1.4, stars: 1, grass: 0x2b3528, env: 0.12 },
];
const c1 = new THREE.Color(), c2 = new THREE.Color();
const lc = (a: number, b: number, f: number, out: THREE.Color) => out.set(a).lerp(c2.set(b), f);
function hgt(x: number, z: number) { const d = Math.hypot(x, z); return Math.sin(x * 0.11) * 0.5 + Math.cos(z * 0.13 + x * 0.05) * 0.4 + Math.max(0, d - 16) * 0.08 - Math.max(0, -z - 14) * 0.16; }

const NOISE = `float h1(float x){return fract(sin(x*127.1)*43758.5453);} float n1(float x){float i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(h1(i),h1(i+1.),f);}
float fbm(float x){float a=0.,s=.5;for(int i=0;i<5;i++){a+=n1(x)*s;x*=2.03;s*=.5;}return a;}`;
function Sky({ u }: { u: Record<string, THREE.IUniform> }) {
  return (<mesh scale={500} renderOrder={-2}><sphereGeometry args={[1, 48, 24]} /><shaderMaterial side={THREE.BackSide} depthWrite={false} fog={false} uniforms={u}
    vertexShader={`varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`}
    fragmentShader={`uniform vec3 top,hor,sunC,sunD; uniform float stars; varying vec3 vP;
      float hs(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}
      void main(){ vec3 d=normalize(vP); float h=max(d.y,0.); vec3 c=mix(hor,top,pow(h,.55)); float s=max(dot(d,normalize(sunD)),0.);
        c+=sunC*(pow(s,900.)*4.+pow(s,40.)*.35+pow(s,6.)*.18); vec3 g=floor(d*420.); float st=step(.9975,hs(g))*stars*smoothstep(.02,.25,h); c+=vec3(st*(.6+.4*hs(g+1.)));
        gl_FragColor=vec4(c,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`} /></mesh>);
}
/** one ridge layer: fbm silhouette with a toothed treeline, mist pooled at its base */
function Ridge({ z, y, w, h, seed, amp, base, tree, fogK, u }: { z: number; y: number; w: number; h: number; seed: number; amp: number; base: number; tree: number; fogK: number; u: { col: THREE.IUniform; fog: THREE.IUniform } }) {
  const uni = useMemo(() => ({ col: u.col, fog: u.fog, seed: { value: seed }, amp: { value: amp }, base: { value: base }, tree: { value: tree }, fk: { value: fogK } }), [u, seed, amp, base, tree, fogK]);
  return (<mesh position={[0, h / 2 - 4 + y * 0, z]} renderOrder={-1}><planeGeometry args={[w, h]} /><shaderMaterial transparent depthWrite={false} uniforms={uni}
    vertexShader={`varying vec2 vU; void main(){ vU=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`}
    fragmentShader={`${NOISE} uniform vec3 col,fog; uniform float seed,amp,base,tree,fk; varying vec2 vU;
      void main(){ float x=vU.x*6.+seed; float r=base+fbm(x)*amp; float tz=fract(vU.x*240.+seed*3.); float tt=(1.-abs(tz*2.-1.))*(.45+.55*n1(vU.x*240.+seed)); r+=tree*.035*(tt*tt+n1(vU.x*180.+seed)*.4);
        float e=max(fwidth(vU.y),fwidth(r))*1.2; float a=1.-smoothstep(r-e,r+e,vU.y); if(a<.01) discard;
        float mist=clamp(fk+(1.-vU.y/max(r,.001))*.55,0.,1.); mist=mist*mist*(3.-2.*mist);
        vec3 c=mix(col,fog,mist); gl_FragColor=vec4(c,a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`} /></mesh>);
}
function pineGeo() {
  const parts: THREE.BufferGeometry[] = [];
  const tiers = 7; for (let i = 0; i < tiers; i++) { const t = i / (tiers - 1), r = 1.15 * (1 - t * 0.82), hh = 1.25 - t * 0.5; const g = new THREE.ConeGeometry(r, hh, 18, 2, true); const p = g.attributes.position; for (let j = 0; j < p.count; j++) { const y = p.getY(j); if (y < hh / 2 - 0.01) { const a = Math.atan2(p.getZ(j), p.getX(j)), k = 0.78 + 0.32 * Math.abs(Math.sin(a * 5 + i * 1.7)) + 0.08 * Math.sin(a * 13 + i); p.setX(j, p.getX(j) * k); p.setZ(j, p.getZ(j) * k); if (y < 0) p.setY(j, y - 0.12 * k); } } g.translate(0, 1.1 + i * 0.62 + hh / 2, 0); parts.push(g.toNonIndexed()); }
  const tr = new THREE.CylinderGeometry(0.08, 0.13, 1.6, 6); tr.translate(0, 0.8, 0); parts.push(tr.toNonIndexed());
  parts.forEach((g) => g.deleteAttribute("uv")); return mergeGeometries(parts)!;
}
function World({ t, mobile }: { t: MutableRefObject<number>; mobile: boolean }) {
  const { gl, scene, camera } = useThree();
  const sky = useMemo(() => ({ top: { value: new THREE.Color() }, hor: { value: new THREE.Color() }, sunC: { value: new THREE.Color() }, sunD: { value: new THREE.Vector3() }, stars: { value: 0 } }), []);
  const ridgeU = useMemo(() => [0, 1, 2, 3, 4].map(() => ({ col: { value: new THREE.Color() }, fog: { value: new THREE.Color() } })), []);
  const sun = useRef<THREE.DirectionalLight>(null!), hemi = useRef<THREE.HemisphereLight>(null!), lamp = useRef<THREE.PointLight>(null!);
  const M = useMemo(() => ({
    shell: new THREE.MeshPhysicalMaterial({ color: 0xf1ede5, roughness: 0.38, clearcoat: 0.55, clearcoatRoughness: 0.25, sheen: 0.3 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x0c1216, roughness: 0.03, metalness: 0.4, clearcoat: 1, envMapIntensity: 1.8, transparent: true, opacity: 0.62, depthWrite: false }),
    room: new THREE.MeshStandardMaterial({ color: 0x8a6646, roughness: 0.8, emissive: 0xff9a4a, emissiveIntensity: 0 }),
    wood: new THREE.MeshStandardMaterial({ color: 0xa8714a, roughness: 0.7 }), dark: new THREE.MeshStandardMaterial({ color: 0x22262a, roughness: 0.55, metalness: 0.4 }),
    solar: new THREE.MeshPhysicalMaterial({ color: 0x18213a, roughness: 0.15, metalness: 0.5, clearcoat: 1 }),
    pine: new THREE.MeshStandardMaterial({ color: 0x24301f, roughness: 0.95, side: THREE.DoubleSide }), rock: new THREE.MeshStandardMaterial({ color: 0x7c7a72, roughness: 0.9, flatShading: true }),
    ground: new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: 1 }),
  }), []);
  const grassMat = useMemo(() => { const m = new THREE.MeshStandardMaterial({ color: 0x8a9460, roughness: 0.9, side: THREE.DoubleSide }); const u = { time: { value: 0 } };
    m.onBeforeCompile = (s) => { s.uniforms.time = u.time; s.vertexShader = "uniform float time;\n" + s.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
      vec4 wp = instanceMatrix * vec4(0.,0.,0.,1.); float k = position.y*position.y; transformed.x += sin(time*1.6 + wp.x*.35 + wp.z*.2)*.12*k; transformed.z += cos(time*1.3 + wp.x*.2)*.06*k;`);
      s.fragmentShader = s.fragmentShader.replace("#include <color_fragment>", "#include <color_fragment>\n diffuseColor.rgb *= mix(.55, 1.15, vUv2y);").replace("void main() {", "varying float vUv2y;\nvoid main() {");
      s.vertexShader = s.vertexShader.replace("void main() {", "varying float vUv2y;\nvoid main() {\n vUv2y = position.y;"); };
    (m as unknown as { u: typeof u }).u = u; return m; }, []);
  const ground = useMemo(() => { const g = new THREE.PlaneGeometry(140, 140, 120, 120); g.rotateX(-Math.PI / 2); const p = g.attributes.position, col = new Float32Array(p.count * 3), a = new THREE.Color(0x7e8f55), b = new THREE.Color(0x56643c), c = new THREE.Color();
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); p.setY(i, hgt(x, z)); c.copy(a).lerp(b, 0.5 + Math.sin(x * 0.7) * Math.cos(z * 0.6) * 0.5); col.set([c.r, c.g, c.b], i * 3); }
    g.setAttribute("color", new THREE.BufferAttribute(col, 3)); g.computeVertexNormals(); return g; }, []);
  const grass = useMemo(() => { const N = mobile ? 12000 : 30000; const blade = new THREE.PlaneGeometry(0.035, 0.38, 1, 3); blade.translate(0, 0.19, 0); const p = blade.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i) / 0.38; p.setX(i, p.getX(i) * (1 - y)); } blade.computeVertexNormals();
    const im = new THREE.InstancedMesh(blade, grassMat, N), m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), v = new THREE.Vector3(), e = new THREE.Euler(); let k = 0, seed = 7; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    while (k < N) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 22; const x = Math.cos(a) * d + 2, z = Math.sin(a) * d + 6; if (Math.abs(x) < 3.2 && z > -2 && z < 3.6) continue; v.set(x, hgt(x, z) - 0.02, z); e.set((r() - 0.5) * 0.4, r() * 6.28, (r() - 0.5) * 0.4); q.setFromEuler(e); const sc = 0.6 + r() * 0.9; s.set(1, sc, 1); m.compose(v, q, s); im.setMatrixAt(k++, m); }
    im.receiveShadow = true; return im; }, [grassMat, mobile]);
  const pines = useMemo(() => { const spots: [number, number, number][] = []; { let sd = 3; const r = () => (sd = (sd * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 34; i++) { const side = i % 2 ? 1 : -1, x = side * (11 + r() * 22) - 3, z = 6 - r() * 34; spots.push([x, z, 1.2 + r() * 1.1]); } }
    const im = new THREE.InstancedMesh(pineGeo(), M.pine, spots.length), m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), v = new THREE.Vector3();
    spots.forEach(([x, z, k], i) => { v.set(x, hgt(x, z) - 0.2, z); q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), i * 1.7); s.set(k, k * (1.05 + (i % 3) * 0.12), k); m.compose(v, q, s); im.setMatrixAt(i, m); }); im.castShadow = true; im.receiveShadow = true; return im; }, [M]);
  const rocks = useMemo(() => { const g = new THREE.IcosahedronGeometry(1, 2); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const v = new THREE.Vector3().fromBufferAttribute(p, i); v.multiplyScalar(1 + Math.sin(v.x * 3.1) * 0.12 + Math.cos(v.z * 2.7 + v.y) * 0.1); v.y *= 0.6; p.setXYZ(i, v.x, v.y, v.z); } g.computeVertexNormals();
    const spots: [number, number, number][] = [[3.9, 3.4, 0.45], [4.6, 2.6, 0.28], [-4.2, 2.8, 0.6], [-3.4, 4.4, 0.3], [6.5, -2, 0.8]]; const im = new THREE.InstancedMesh(g, M.rock, spots.length), m = new THREE.Matrix4(), q = new THREE.Quaternion();
    spots.forEach(([x, z, k], i) => { q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), i * 2.1); m.compose(new THREE.Vector3(x, hgt(x, z) + k * 0.15, z), q, new THREE.Vector3(k, k, k * 1.2)); im.setMatrixAt(i, m); }); im.castShadow = im.receiveShadow = true; return im; }, [M]);
  const cap = useMemo(() => { const g = new THREE.Group(), w = 4.4, h = 2.6, d = 2.7, y0 = 0.95;
    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number) => { const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; g.add(o); return o; };
    add(new RoundedBoxGeometry(w, h, d, 8, 1.15), M.shell, 0, y0 + h / 2, 0);
    add(new RoundedBoxGeometry(w - 1.5, h - 0.95, 0.4, 6, 0.18), M.glass, 0, y0 + h / 2 + 0.02, d / 2 - 0.16);
    add(new THREE.BoxGeometry(w - 1.7, h - 1.15, 0.05), M.room, 0, y0 + h / 2, d / 2 - 0.4).castShadow = false;
    add(new THREE.BoxGeometry(w + 1.6, 0.12, 1.8), M.wood, 0, y0 - 0.06, d / 2 + 0.8);
    for (let i = 0; i < 11; i++) add(new THREE.BoxGeometry(0.018, 0.125, 1.8), M.dark, -(w + 1.6) / 2 + (i + 0.5) * (w + 1.6) / 11, y0 - 0.055, d / 2 + 0.8);
    for (const x of [-w / 2 + 0.5, w / 2 - 0.5]) for (const z of [-d / 2 + 0.5, d / 2 + 1.4]) add(new THREE.CylinderGeometry(0.06, 0.06, 1.4, 12), M.dark, x, y0 - 0.75, z);
    for (let i = 0; i < 3; i++) add(new THREE.BoxGeometry(0.34, 0.08, 1.2), M.wood, w / 2 + 0.98 + i * 0.36, y0 - 0.3 - i * 0.28, d / 2 + 0.8);
    const sol = add(new THREE.BoxGeometry(w * 0.6, 0.05, d * 0.42), M.solar, 0, y0 + h - 0.02, -0.1); sol.rotation.x = -0.05;
    g.position.set(0, hgt(0, 0) + 0.15, 0); g.rotation.y = -0.38; return g; }, [M]);
  useEffect(() => { const pm = new THREE.PMREMGenerator(gl), env = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environment = env; scene.fog = new THREE.Fog(0xffffff, 18, 90); return () => { env.dispose(); pm.dispose(); scene.fog = null; }; }, [gl, scene]);
  const look = useMemo(() => new THREE.Vector3(), []), ptr = useRef({ x: 0, y: 0 });
  useEffect(() => { const f = (e: PointerEvent) => { ptr.current.x = e.clientX / innerWidth - 0.5; ptr.current.y = e.clientY / innerHeight - 0.5; }; addEventListener("pointermove", f, { passive: true }); return () => removeEventListener("pointermove", f); }, []);
  const cur = useRef(0);
  useFrame((st, dt) => {
    cur.current += (t.current - cur.current) * Math.min(1, dt * 3); const T = cur.current, i = Math.min(2, Math.floor(T)), f = T - i, A = K[i], B = K[i + 1], L = (a: number, b: number) => a + (b - a) * f;
    lc(A.top, B.top, f, sky.top.value); lc(A.hor, B.hor, f, sky.hor.value); lc(A.sun, B.sun, f, sky.sunC.value); sky.sunD.value.set(L(A.sd[0], B.sd[0]), L(A.sd[1], B.sd[1]), L(A.sd[2], B.sd[2])).normalize(); sky.stars.value = L(A.stars, B.stars);
    const hor = sky.hor.value; (scene.fog as THREE.Fog).color.copy(hor); lc(A.ridge, B.ridge, f, c1);
    ridgeU.forEach((u, k) => { u.fog.value.copy(hor); u.col.value.copy(c1).lerp(hor, [0.72, 0.56, 0.4, 0.24, 0.08][k]); });
    sun.current.color.copy(sky.sunC.value); sun.current.intensity = L(A.si, B.si); sun.current.position.copy(sky.sunD.value).multiplyScalar(40).add(new THREE.Vector3(0, 6, 0)); sun.current.position.y = Math.max(4, sun.current.position.y);
    hemi.current.color.set(A.hemi).lerp(c2.set(B.hemi), f); hemi.current.intensity = L(A.hi, B.hi); scene.environmentIntensity = L(A.env, B.env);
    const win = L(A.win, B.win); M.room.emissiveIntensity = win * 1.6; M.glass.opacity = 0.8 - Math.min(1, win) * 0.4; lamp.current.intensity = win * 22; M.glass.emissive.set(0xffa458); M.glass.emissiveIntensity = 0;
    grassMat.color.set(A.grass).lerp(c2.set(B.grass), f); (grassMat as unknown as { u: { time: { value: number } } }).u.time.value = st.clock.elapsedTime;
    const cam = camera as THREE.PerspectiveCamera, p = T / 3, px = ptr.current.x, py = ptr.current.y;
    if (mobile) cam.position.set(3 - p * 3 + px * 0.4, 3.4 + p * 0.4, 21 + p * 1); else cam.position.set(9.5 - p * 6 + px * 0.9, 3.0 + p * 0.5 - py * 0.3, 18.5 + p * 1.5);
    // keep the capsule at ~2/3 of the frame on desktop (copy sits left), upper-centre on mobile (copy sits low)
    const fx = -cam.position.x, fz = -cam.position.z, n = Math.hypot(fx, fz), rx = -fz / n, rz = fx / n;
    if (mobile) look.set(0, 0.9, 0); else look.set(-rx * 4.6, 3.1, -rz * 4.6);
    cam.lookAt(look);
  });
  return (<>
    <Sky u={sky} />
    {[[-330, 46, 1100, 200, 1.3, 0.34, 0.2, 0.25], [-250, 30, 900, 150, 4.1, 0.3, 0.18, 0.5], [-170, 16, 650, 110, 7.7, 0.26, 0.17, 0.8], [-110, 6, 420, 70, 2.9, 0.22, 0.2, 0.6], [-60, 0, 260, 40, 5.5, 0.18, 0.22, 0]].map(([z, y, w, h, seed, amp, base, tree], k) => <Ridge key={k} z={z} y={y} w={w} h={h} seed={seed} amp={amp} base={base} tree={tree} fogK={[0.5, 0.36, 0.22, 0.1, 0][k]} u={ridgeU[k]} />)}
    <hemisphereLight ref={hemi} args={[0xffffff, 0x3a3326, 0.8]} />
    <directionalLight ref={sun} castShadow shadow-mapSize={[mobile ? 1024 : 2048, mobile ? 1024 : 2048]} shadow-bias={-0.0004} shadow-normalBias={0.04} shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={16} shadow-camera-bottom={-16} shadow-camera-far={120} />
    <mesh geometry={ground} material={M.ground} receiveShadow />
    <primitive object={grass} /><primitive object={pines} /><primitive object={rocks} />
    <primitive object={cap}><pointLight ref={lamp} color={0xffa458} distance={14} decay={1.6} position={[0, 1.6, 3.4]} /></primitive>
  </>);
}
export default function Valley3D({ t, onReady }: { t: MutableRefObject<number>; onReady?: () => void }) {
  const el = useRef<HTMLDivElement>(null), [on, setOn] = useState(true), [mobile] = useState(() => typeof window !== "undefined" && innerWidth < 768);
  useEffect(() => { const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting)); io.observe(el.current!); return () => io.disconnect(); }, []);
  return (<div ref={el} className="absolute inset-0"><Canvas shadows={{ type: THREE.PCFSoftShadowMap }} frameloop={on ? "always" : "never"} dpr={[1, mobile ? 1.5 : 1.75]} camera={{ fov: mobile ? 50 : 38, near: 0.1, far: 1200, position: [6, 2.6, 12] }}
    gl={{ antialias: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }} onCreated={() => requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()))}><World t={t} mobile={mobile} /></Canvas></div>);
}
