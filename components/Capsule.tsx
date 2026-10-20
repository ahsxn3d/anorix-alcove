"use client";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import type { Mode } from "./Valley3D";
const Valley3D = dynamic(() => import("./Valley3D"), { ssr: false });
/** Live capsule in its valley at a fixed hour (0 dawn · 1 day · 2 dusk · 3 night). */
export default function Capsule({ size = 1, hour = 0.6, mode = "product", bg = "#ede6da" }: { size?: number; hour?: number; mode?: Mode; bg?: string }) {
  const t = useRef(hour); t.current = hour; const [ready, setReady] = useState(false);
  return (<div className="absolute inset-0" style={{ background: bg }}><div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}><Valley3D t={t} mode={mode} size={size} onReady={() => setReady(true)} /></div></div>);
}
