"use client";
import Image from "next/image";
import { useState } from "react";
import { Arrow, Marquee } from "./kit/ui";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="wrap flex items-center justify-between pt-5">
        <a href="#" aria-label="Alcove home" className="display flex items-center gap-2 rounded-full bg-paper/85 px-4 py-2 text-[22px] text-ink backdrop-blur-md"><svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="6" fill="none" stroke="currentColor" strokeWidth="1.8" /><rect x="7" y="9" width="10" height="6" rx="3" fill="#b8794e" /></svg>alcove</a>
        <nav aria-label="Primary" className="hidden items-center gap-1 rounded-full bg-paper/85 p-1.5 text-[14px] text-ink backdrop-blur-md md:flex">
          {[["Capsules", "#models"], ["Inside", "#inside"], ["Places", "#places"], ["Delivery", "#delivery"]].map(([l, h]) => <a key={l} href={h} className="rounded-full px-4 py-2 transition-colors hover:bg-ink/5">{l}</a>)}
          <a href="#book" className="ml-1 rounded-full bg-moss px-4 py-2 text-paper transition-colors hover:bg-clay">Book a stay</a>
        </nav>
        <a href="#book" className="rounded-full bg-moss px-4 py-2.5 text-[14px] text-paper md:hidden">Book</a>
      </div>
    </header>
  );
}

const models = [
  { n: "Solo", img: "model_0.78_ede6da", area: "14 m²", sleeps: "1–2", w: "3.3 m", price: "€ 39,000", lead: "8 weeks", d: "A writing room, a guest room, a reason to finally use that plot. Bed, desk, wet room." },
  { n: "Duo", img: "model_1_e3d9c6", area: "22 m²", sleeps: "2", w: "4.2 m", price: "€ 58,000", lead: "10 weeks", d: "Our most-booked stay. Queen bed under the skylight, galley kitchen, shower with a view." },
  { n: "Lodge", img: "model_1.3_d9cdb6", area: "31 m²", sleeps: "2–4", w: "5.5 m", price: "€ 79,000", lead: "12 weeks", d: "Two sleeping zones and a full kitchen. Lives year-round at −20 °C on the same solar roof." },
];
export function Models() {
  const [i, setI] = useState(1); const m = models[i];
  return (
    <section id="models" className="bg-paper py-[clamp(96px,11vw,170px)]">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12">
          <p className="eyebrow text-clay lg:col-span-3">The capsules</p>
          <h2 className="display text-[clamp(44px,5.6vw,96px)] lg:col-span-9" data-reveal="lines">Three sizes. Same quiet.</h2>
        </div>
        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-12">
          <div className="relative aspect-[6/5] overflow-hidden rounded-[28px] bg-sand lg:col-span-7">
            {models.map((x, k) => <Image key={x.n} src={`/img/${x.img}.webp`} alt={`Alcove ${x.n} capsule on a timber deck`} fill sizes="(min-width:1024px) 58vw, 100vw" className={`object-cover transition-opacity duration-700 ${k === i ? "opacity-100" : "opacity-0"}`} />)}
            <span className="absolute left-5 top-5 rounded-full bg-paper/90 px-3 py-1.5 text-[13px]">{m.w} long · arrives on one truck</span>
          </div>
          <div className="flex flex-col rounded-[28px] bg-sand p-7 md:p-10 lg:col-span-5">
            <div role="tablist" aria-label="Capsule size" className="flex gap-2">{models.map((x, k) => <button key={x.n} role="tab" aria-selected={k === i} onClick={() => setI(k)} className={`rounded-full border px-5 py-2.5 text-[14px] transition-colors duration-300 ${k === i ? "border-moss bg-moss text-paper" : "border-ink/15 hover:border-ink/40"}`}>{x.n}</button>)}</div>
            <h3 className="display mt-10 text-[64px]">{m.n}</h3>
            <p className="mt-4 min-h-[4.8em] max-w-[40ch] text-[16px] leading-[1.6] text-ink/70">{m.d}</p>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-ink/10 pt-6">{[["Floor", m.area], ["Sleeps", m.sleeps], ["Lead time", m.lead]].map(([a, b]) => <div key={a}><dt className="eyebrow text-mute">{a}</dt><dd className="display mt-2 text-[28px]">{b}</dd></div>)}</dl>
            <div className="mt-auto flex items-end justify-between pt-10"><div><p className="eyebrow text-mute">Delivered &amp; installed</p><p className="display mt-1 text-[36px]">{m.price}</p></div><a href="#book" className="btn bg-moss text-paper hover:bg-clay">Enquire <Arrow /></a></div>
          </div>
        </div>
      </div>
    </section>
  );
}

const inside = [["Skylight over the bed", "A 1.2 m roof light with a blackout blind. Most guests leave it open."], ["Oak, wool, nothing else", "FSC oak joinery, wool insulation and lime plaster. No foams, no VOCs."], ["Works without the grid", "4.2 kW solar, 20 kWh battery, rainwater filtration and a composting WC."], ["Warm at −20 °C", "Triple glazing and an air-source heat pump, run from the roof."]];
export function Inside() {
  const [i, setI] = useState(0);
  return (
    <section id="inside" className="bg-pine py-[clamp(96px,11vw,170px)] text-paper">
      <div className="wrap grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow text-glow">Inside</p>
          <h2 className="display mt-5 text-[clamp(44px,5vw,84px)]" data-reveal="lines">Built for the view, not the grid.</h2>
          <ul className="mt-10 border-t border-paper/15">
            {inside.map(([h, p], k) => (
              <li key={h} className="border-b border-paper/15">
                <button onClick={() => setI(k)} onPointerEnter={(e) => e.pointerType === "mouse" && setI(k)} aria-expanded={i === k} className="flex w-full items-baseline gap-5 py-5 text-left">
                  <span className="text-[13px] tabular-nums text-paper/50">0{k + 1}</span>
                  <span className="flex-1"><span className={`display block text-[clamp(24px,2.2vw,32px)] transition-colors duration-300 ${i === k ? "text-paper" : "text-paper/45"}`}>{h}</span>
                    <span className={`grid transition-[grid-template-rows] duration-500 ${i === k ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}><span className="overflow-hidden"><span className="block pt-2 text-[15px] leading-[1.6] text-paper/70">{p}</span></span></span></span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div data-clip className="relative aspect-[4/5] overflow-hidden rounded-[28px] lg:col-span-6 lg:col-start-7 lg:aspect-[5/6]"><div data-clip-img className="absolute inset-0"><Image src="/img/world_3_w.webp" alt="The capsule glowing warm at night in a dark pine valley" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover object-[62%_50%]" /></div></div>
      </div>
    </section>
  );
}

const places = [
  { n: "Hardanger, Norway", x: 47, y: 24, s: "Fjord edge · 6 capsules", from: "€ 240 / night" },
  { n: "Cairngorms, Scotland", x: 27, y: 33, s: "Pine forest · 4 capsules", from: "€ 190 / night" },
  { n: "Engadin, Switzerland", x: 57, y: 55, s: "Alpine meadow · 3 capsules", from: "€ 310 / night" },
  { n: "Picos de Europa, Spain", x: 20, y: 63, s: "Limestone valley · 5 capsules", from: "€ 170 / night" },
  { n: "Lapland, Finland", x: 74, y: 13, s: "Aurora field · 4 capsules", from: "€ 280 / night" },
];
// Static, deterministic contour lines around each valley (same output on server and client).
const contours = places.flatMap((q, pi) => Array.from({ length: 6 }, (_, ring) => {
  const r = 3 + ring * 2.6; let d = "";
  for (let a = 0; a <= 48; a++) { const t = (a / 48) * Math.PI * 2; const w = 1 + 0.16 * Math.sin(t * 3 + pi * 1.7 + ring * 0.5) + 0.08 * Math.sin(t * 5 + pi); d += `${a ? "L" : "M"}${(q.x + Math.cos(t) * r * w * 1.25).toFixed(2)} ${(q.y + Math.sin(t) * r * w).toFixed(2)}`; }
  return d + "Z";
}));
export function Places() {
  const [i, setI] = useState(0); const p = places[i];
  return (
    <section id="places" className="bg-sand py-[clamp(96px,11vw,170px)]">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6"><h2 className="display text-[clamp(44px,5.6vw,96px)]" data-reveal="lines">Stay in one first.</h2><p className="max-w-[38ch] text-[15px] leading-[1.6] text-ink/70" data-fade>22 capsules across five valleys. Book a night, and if you order within 60 days we take the stay off your capsule.</p></div>
        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-moss lg:col-span-8">
            <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-label="Contour map of the five Alcove valleys">
              {[20, 40, 60, 80].map((x) => <line key={"x" + x} x1={x} x2={x} y1="0" y2="75" stroke="#ede6da" strokeOpacity=".06" strokeWidth=".15" />)}
              {[15, 30, 45, 60].map((y) => <line key={"y" + y} y1={y} y2={y} x1="0" x2="100" stroke="#ede6da" strokeOpacity=".06" strokeWidth=".15" />)}
              {contours.map((d, k) => <path key={k} d={d} fill="none" stroke="#ede6da" strokeOpacity={0.1 + (k % 6) * 0.025} strokeWidth=".18" />)}
              {places.map((q, k) => (
                <g key={q.n} onPointerEnter={(e) => e.pointerType === "mouse" && setI(k)} onClick={() => setI(k)} className="cursor-pointer" role="button" aria-label={q.n}>
                  <circle cx={q.x} cy={q.y} r="3" fill="transparent" />
                  {k === i && <circle cx={q.x} cy={q.y} r="1.4" fill="none" stroke="#ffb46a" strokeWidth=".3" className="ping" />}
                  <circle cx={q.x} cy={q.y} r={k === i ? 1.1 : 0.75} fill={k === i ? "#ffb46a" : "#ede6da"} style={{ transition: "r .4s" }} />
                  <text x={q.x + 2.2} y={q.y + 0.9} fontSize="2.4" fill="#ede6da" fillOpacity={k === i ? 1 : 0.55} style={{ transition: "fill-opacity .4s" }}>{q.n.split(",")[0]}</text>
                </g>
              ))}
            </svg>
            <p className="eyebrow absolute bottom-5 left-5 text-paper/70">Tap a pin</p>
          </div>
          <div className="flex flex-col rounded-[28px] bg-paper p-7 md:p-9 lg:col-span-4">
            <ul className="space-y-1">{places.map((q, k) => <li key={q.n}><button onClick={() => setI(k)} className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-[15px] transition-colors ${k === i ? "bg-moss text-paper" : "hover:bg-sand"}`}>{q.n}<span className={`text-[13px] ${k === i ? "text-paper/70" : "text-mute"}`}>{q.from.split(" /")[0]}</span></button></li>)}</ul>
            <div className="mt-auto border-t border-ink/10 pt-6"><p className="eyebrow text-mute">{p.s}</p><p className="display mt-2 text-[34px]">{p.from}</p><a href="#book" className="btn mt-5 bg-moss text-paper hover:bg-clay">Check dates <Arrow /></a></div>
          </div>
        </div>
      </div>
    </section>
  );
}

const steps = [["Survey", "We check access, ground and sun from your photos and a pin. Free, within 48 hours."], ["Build", "Your capsule is built indoors in Porto while four screw piles go into your plot."], ["Arrive", "One truck, one crane, one morning. Most installs take under six hours."], ["Live", "Power, water and heat run from day one. We handle the paperwork for permits under 30 m²."]];
export function Delivery() {
  return (
    <section id="delivery" className="bg-paper py-[clamp(96px,11vw,170px)]">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12"><p className="eyebrow text-clay lg:col-span-3">Ordering</p><h2 className="display text-[clamp(44px,5.6vw,96px)] lg:col-span-9" data-reveal="lines">From a pin on a map to a key in your hand.</h2></div>
        <ol className="mt-16 grid gap-px overflow-hidden rounded-[28px] bg-ink/10 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(([h, p], k) => (
            <li key={h} className="flex min-h-[280px] flex-col bg-sand p-7" data-fade data-delay={k * 0.08}>
              <span className="display text-[64px] leading-none text-clay"><span data-count={k === 2 ? 6 : k === 0 ? 48 : k === 1 ? 10 : 30}>0</span><span className="ml-1 text-[18px] text-ink/50">{["h", "wk", "h", "m²"][k]}</span></span>
              <h3 className="display mt-auto text-[34px]">{h}</h3><p className="mt-3 text-[15px] leading-[1.6] text-ink/70">{p}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Book() {
  const [ok, setOk] = useState(false); const [kind, setKind] = useState("Stay");
  return (
    <footer id="book" className="overflow-hidden bg-moss text-paper">
      <div className="border-b border-paper/10 py-6"><Marquee items={["No grid needed", "Installed in a morning", "Stay before you buy", "Built in Porto"]} className="display text-[clamp(26px,2.8vw,42px)] italic" sep="·" /></div>
      <div className="wrap grid gap-12 py-[clamp(80px,9vw,140px)] lg:grid-cols-12">
        <div className="lg:col-span-6"><p className="eyebrow text-glow">Book or order</p><h2 className="display mt-5 text-[clamp(52px,7vw,120px)]" data-reveal="lines">Find your quiet.</h2></div>
        <form className="self-end lg:col-span-5 lg:col-start-8" onSubmit={(e) => { e.preventDefault(); setOk(true); }}>
          <div className="flex gap-2" role="radiogroup" aria-label="Request type">{["Stay", "Order a capsule"].map((k) => <button type="button" key={k} role="radio" aria-checked={kind === k} onClick={() => setKind(k)} className={`rounded-full border px-5 py-2.5 text-[14px] transition-colors ${kind === k ? "border-paper bg-paper text-moss" : "border-paper/25 hover:border-paper/60"}`}>{k}</button>)}</div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <label className="block"><span className="eyebrow text-paper/60">Name</span><input required className="mt-2 w-full border-b border-paper/30 bg-transparent pb-3 text-[19px] outline-none focus:border-paper" /></label>
            <label className="block"><span className="eyebrow text-paper/60">Email</span><input type="email" required className="mt-2 w-full border-b border-paper/30 bg-transparent pb-3 text-[19px] outline-none focus:border-paper" /></label>
            <label className="block sm:col-span-2"><span className="eyebrow text-paper/60">{kind === "Stay" ? "Valley and month" : "Where would it live?"}</span><input className="mt-2 w-full border-b border-paper/30 bg-transparent pb-3 text-[19px] outline-none focus:border-paper" placeholder={kind === "Stay" ? "Hardanger, May" : "Postcode or a map link"} /></label>
          </div>
          <button className="btn mt-10 bg-paper text-moss hover:bg-glow">{ok ? "Thanks, we reply within a day" : kind === "Stay" ? "Check availability" : "Request a site survey"} <Arrow /></button>
        </form>
      </div>
      <p className="display select-none px-[clamp(16px,3.4vw,48px)] text-[24vw] leading-[.78] text-paper/[0.1]" aria-hidden="true">alcove</p>
      <div className="wrap flex flex-col justify-between gap-3 border-t border-paper/10 py-8 text-[12px] text-paper/60 md:flex-row"><span>© 2026 Alcove. A concept project by Anorix, not a real company.</span><span>Designed &amp; built by Anorix</span></div>
    </footer>
  );
}
