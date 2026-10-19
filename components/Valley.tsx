"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lazy3D from "./kit/Lazy3D";
import { Arrow } from "./kit/ui";
const ValleyScene = dynamic(() => import("./ValleyScene"), { ssr: false });
const ch = [
  { k: "06:10 · Dawn", h: "A home anywhere quiet.", p: "Alcove capsules arrive on one truck, stand on four screw piles and leave no trace when they go." },
  { k: "12:40 · Midday", h: "Powered by the sky.", p: "4.2 kW of roof solar, 20 kWh of storage and rainwater filtration. No grid, no generator, no noise." },
  { k: "19:25 · Dusk", h: "The view is the room.", p: "A 3.4-metre curved window faces the valley. Everything else is oak, wool and quiet." },
  { k: "23:00 · Night", h: "Lights on. Nobody around.", p: "Warm 2,200 K lighting that never spills into the forest, and a skylight above the bed for the stars." },
];
export default function Valley() {
  const root = useRef<HTMLElement>(null), time = useRef(0.15);
  const [c, setC] = useState(0);
  useEffect(() => {
    const st = ScrollTrigger.create({ trigger: root.current, start: "top top", end: "bottom bottom", onUpdate: (s) => {
      const x = Math.min(3.999, s.progress * 4), seg = Math.floor(x), fr = x - seg, mv = Math.min(1, Math.max(0, (fr - 0.55) / 0.45));
      time.current = Math.min(3, Math.max(0.15, seg + mv * mv * (3 - 2 * mv)));
      setC((p) => (p === seg ? p : seg));
    } });
    return () => st.kill();
  }, []);
  const night = c === 3;
  return (
    <section ref={root} className="relative h-[400vh] bg-pine" aria-label="A day at an Alcove">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Lazy3D poster="/img/world_0.15_w.webp" posterSm="/img/world_0.15_m.webp" priority eager alt="A white capsule home on a timber deck in a pine valley at dawn" render={({ onReady, running }) => <ValleyScene time={time} running={running} onReady={onReady} />} />
        <div className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${night ? "opacity-100" : "opacity-60"} bg-gradient-to-t from-pine/80 via-transparent to-transparent md:bg-gradient-to-r md:from-pine/70 md:via-pine/5`} />
        <div className="wrap relative flex h-full flex-col justify-end pb-[13vh] text-paper md:justify-center md:pb-0">
          <div className="relative min-h-[300px] md:min-h-[400px]">
            {ch.map((x, i) => (
              <div key={x.k} className={`absolute inset-x-0 bottom-0 max-w-[620px] transition-[opacity,transform] duration-1000 ease-[cubic-bezier(.16,1,.3,1)] md:top-0 md:bottom-auto ${c === i ? "translate-y-0 opacity-100" : c > i ? "pointer-events-none -translate-y-8 opacity-0" : "pointer-events-none translate-y-8 opacity-0"}`}>
                <p className="eyebrow text-glow">{x.k}</p>
                {i === 0 ? <h1 className="display mt-5 text-[clamp(54px,7.4vw,124px)]"><span className="kit-mask"><span className="kit-line">A home</span></span><span className="kit-mask"><span className="kit-line" style={{ animationDelay: ".12s" }}><em>anywhere quiet.</em></span></span></h1>
                  : <h2 className="display mt-5 text-[clamp(50px,6.6vw,112px)]">{x.h}</h2>}
                <p className={`mt-6 max-w-[42ch] text-[16px] leading-[1.7] text-paper/80 ${i === 0 ? "kit-soft" : ""}`}>{x.p}</p>
                {i === 0 && <a href="#models" className="kit-soft btn pointer-events-auto mt-8 bg-paper text-ink hover:bg-glow">See the capsules <Arrow /></a>}
              </div>
            ))}
          </div>
        </div>
        {/* sun dial: one transform driver (rotate) on the hand */}
        <div className="absolute bottom-8 right-[clamp(16px,3.4vw,48px)] flex items-center gap-4 text-paper">
          <span className="eyebrow hidden md:block">{ch[c].k.split("·")[0]}</span>
          <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeOpacity=".35" /><g style={{ transform: `rotate(${-90 + c * 60}deg)`, transformOrigin: "32px 32px", transition: "transform 1.2s cubic-bezier(.16,1,.3,1)" }}><line x1="32" y1="32" x2="56" y2="32" stroke="currentColor" strokeWidth="1.5" /><circle cx="56" cy="32" r="4" fill={night ? "#cfd6e6" : "#ffb46a"} /></g></svg>
        </div>
      </div>
    </section>
  );
}
