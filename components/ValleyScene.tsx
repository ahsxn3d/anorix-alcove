"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, type MutableRefObject } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { buildWorld, CAM } from "@/lib/cap";
import FirstFrame from "./kit/FirstFrame";

function World({ time, mobile }: { time: MutableRefObject<number>; mobile: boolean }) {
  const { scene } = useThree();
  const w = useMemo(() => buildWorld(THREE, { mobile, RB: RoundedBoxGeometry }), [mobile]);
  const st = useMemo(() => ({ t: time.current, base: CAM(mobile) }), [mobile, time]);
  useEffect(() => { scene.fog = new THREE.Fog(0xffffff, 18, 70); w.setTime(st.t, scene); }, [scene, w, st]);
  useFrame((s, dt) => {
    st.t += (time.current - st.t) * Math.min(1, dt * 2.6);
    w.setTime(st.t, scene);
    const b = st.base, k = Math.min(1, dt * 2.5);
    // one driver: camera drifts with pointer (desktop) + a slow dolly as the day passes
    const tx = b.pos[0] + (mobile ? 0 : s.pointer.x * 0.8), ty = b.pos[1] + (mobile ? 0 : s.pointer.y * 0.4), tz = b.pos[2] - st.t * 0.6;
    s.camera.position.x += (tx - s.camera.position.x) * k; s.camera.position.y += (ty - s.camera.position.y) * k; s.camera.position.z += (tz - s.camera.position.z) * k;
    s.camera.lookAt(b.tgt[0], b.tgt[1], b.tgt[2]);
  });
  return <primitive object={w.root} />;
}

export default function ValleyScene({ time, running, onReady }: { time: MutableRefObject<number>; running: boolean; onReady: () => void }) {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  const c = CAM(mobile);
  return (
    <Canvas frameloop={running ? "always" : "demand"} dpr={[1, 1.5]} shadows="percentage" camera={{ fov: mobile ? 42 : 30, position: c.pos, near: 0.5, far: 140 }}
      gl={{ antialias: typeof window !== "undefined" && window.devicePixelRatio < 1.5, toneMapping: THREE.ACESFilmicToneMapping }} onCreated={({ camera }) => camera.lookAt(...c.tgt)}>
      <World time={time} mobile={mobile} />
      <FirstFrame onReady={onReady} />
    </Canvas>
  );
}
