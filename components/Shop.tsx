"use client";
import { useMemo, useState } from "react";
import { useCart } from "@/lib/commerce/cart";
import { money } from "@/lib/commerce/money";
import { Arrow } from "./kit/ui";
export function AddBag({ id, name, price, opt, label = "Add to bag", className = "btn bg-moss text-paper hover:bg-clay" }: { id: string; name: string; price: number; opt?: string; label?: string; className?: string }) {
  const { add } = useCart();
  return <button className={className} onClick={() => { add({ id, name, price, opt }); location.href = "/cart"; }}>{label} <Arrow /></button>;
}
const day = 86400000, iso = (d: Date) => d.toISOString().slice(0, 10);
/** Date-range picker demo: two months, tap check-in then check-out. */
export function StayPicker({ slug, name, nightly }: { slug: string; name: string; nightly: number }) {
  const { add } = useCart(); const today = useMemo(() => { const d = new Date(); d.setHours(12, 0, 0, 0); return d; }, []);
  const [a, setA] = useState<Date | null>(null), [b, setB] = useState<Date | null>(null), [g, setG] = useState(2), [off, setOff] = useState(0);
  const months = [0, 1].map((k) => { const m = new Date(today.getFullYear(), today.getMonth() + off + k, 1, 12); return m; });
  const pick = (d: Date) => { if (!a || b || d <= a) { setA(d); setB(null); } else setB(d); };
  const nights = a && b ? Math.round((+b - +a) / day) : 0;
  return (<div className="grid gap-6 lg:grid-cols-12">
    <div className="rounded-[28px] bg-sand p-6 md:p-8 lg:col-span-8">
      <div className="flex items-center justify-between"><button aria-label="Earlier" disabled={!off} onClick={() => setOff(off - 1)} className="rounded-full border border-ink/15 px-4 py-2 disabled:opacity-30">←</button><p className="eyebrow text-mute">{a ? (b ? `${nights} nights` : "Pick check-out") : "Pick check-in"}</p><button aria-label="Later" onClick={() => setOff(off + 1)} className="rounded-full border border-ink/15 px-4 py-2">→</button></div>
      <div className="mt-6 grid gap-8 md:grid-cols-2">{months.map((m) => { const first = (m.getDay() + 6) % 7, len = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
        return (<div key={iso(m)}><p className="display text-[26px]">{m.toLocaleString("en-GB", { month: "long", year: "numeric" })}</p><div className="mt-4 grid grid-cols-7 gap-1 text-center text-[13px]">{["M", "T", "W", "T", "F", "S", "S"].map((x, i) => <span key={i} className="pb-2 text-mute">{x}</span>)}{Array.from({ length: first }, (_, i) => <span key={"e" + i} />)}
          {Array.from({ length: len }, (_, i) => { const d = new Date(m.getFullYear(), m.getMonth(), i + 1, 12), past = d < today, sel = (a && +d === +a) || (b && +d === +b), mid = a && b && d > a && d < b;
            return <button key={i} disabled={past} onClick={() => pick(d)} className={`aspect-square rounded-full transition-colors ${sel ? "bg-moss text-paper" : mid ? "bg-moss/15" : "hover:bg-paper"} disabled:opacity-25`}>{i + 1}</button>; })}</div></div>); })}</div>
    </div>
    <aside className="flex flex-col rounded-[28px] bg-moss p-7 text-paper lg:col-span-4"><p className="eyebrow text-glow">{name}</p><p className="display mt-3 text-[36px]">{money(nightly)}<span className="text-[16px] text-paper/60"> / night</span></p>
      <dl className="mt-6 space-y-3 border-t border-paper/15 pt-5 text-[15px]"><div className="flex justify-between"><dt className="text-paper/60">Check-in</dt><dd>{a ? a.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—"}</dd></div><div className="flex justify-between"><dt className="text-paper/60">Check-out</dt><dd>{b ? b.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—"}</dd></div>
        <div className="flex items-center justify-between"><dt className="text-paper/60">Guests</dt><dd className="flex items-center gap-3"><button aria-label="Fewer guests" onClick={() => setG(Math.max(1, g - 1))}>−</button>{g}<button aria-label="More guests" onClick={() => setG(Math.min(4, g + 1))}>+</button></dd></div></dl>
      <p className="mt-auto pt-6 text-[15px]">{nights ? <>Total <span className="display text-[28px]">{money(nights * nightly)}</span></> : <span className="text-paper/60">Choose your dates</span>}</p>
      <button disabled={!nights} onClick={() => { add({ id: `stay-${slug}-${iso(a!)}`, name: `Stay · ${name}`, price: nightly * nights, opt: `${a!.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${b!.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · ${nights} nights · ${g} guests` }); location.href = "/cart"; }} className="btn mt-5 justify-center bg-paper text-moss hover:bg-glow disabled:opacity-40">Add stay to bag <Arrow /></button></aside>
  </div>);
}
export function Bag() {
  const { lines, total, setQty, ready } = useCart();
  if (ready && !lines.length) return (<div className="rounded-[28px] bg-sand p-10"><p className="display text-[36px]">Your bag is empty.</p><p className="mt-3 text-ink/65">Book a night in a valley, or hold a build slot for a capsule.</p><div className="mt-6 flex flex-wrap gap-3"><a href="/stays" className="btn bg-moss text-paper">See the valleys</a><a href="/capsules" className="btn border border-ink/20">See the capsules</a></div></div>);
  return (<div className="grid gap-8 lg:grid-cols-12"><ul className="divide-y divide-ink/10 border-y border-ink/10 lg:col-span-8">{lines.map((l) => <li key={l.id + (l.opt ?? "")} className="flex flex-wrap items-center justify-between gap-4 py-6"><div><p className="display text-[26px]">{l.name}</p>{l.opt && <p className="mt-1 text-[14px] text-mute">{l.opt}</p>}</div><div className="flex items-center gap-6"><div className="flex items-center rounded-full border border-ink/15"><button aria-label="Less" className="px-4 py-2" onClick={() => setQty(l.id, l.opt, l.qty - 1)}>−</button><span className="w-6 text-center">{l.qty}</span><button aria-label="More" className="px-4 py-2" onClick={() => setQty(l.id, l.opt, l.qty + 1)}>+</button></div><span className="w-28 text-right tabular-nums">{money(l.price * l.qty)}</span></div></li>)}</ul>
    <aside className="h-fit rounded-[28px] bg-moss p-7 text-paper lg:col-span-4"><p className="eyebrow text-glow">Total</p><p className="display mt-3 text-[46px]">{money(total)}</p><a href="/checkout" className="btn mt-6 w-full justify-center bg-paper text-moss hover:bg-glow">Checkout <Arrow /></a></aside></div>);
}
export function Checkout() {
  const { lines, total, clear, ready } = useCart(), f = "w-full border-b border-ink/20 bg-transparent pb-3 pt-2 text-[18px] outline-none placeholder:text-ink/35 focus:border-moss";
  if (ready && !lines.length) return <p className="text-ink/70">Your bag is empty. <a className="text-clay underline" href="/stays">See the valleys</a></p>;
  return (<form className="grid gap-12 lg:grid-cols-12" onSubmit={(e) => { e.preventDefault(); clear(); location.href = "/checkout/done"; }}>
    <div className="grid gap-7 sm:grid-cols-2 lg:col-span-7"><p className="eyebrow text-clay sm:col-span-2">01 · You</p><input required placeholder="Full name" autoComplete="name" className={`${f} sm:col-span-2`} /><input required type="email" placeholder="Email" autoComplete="email" className={f} /><input required placeholder="Phone" autoComplete="tel" className={f} /><textarea rows={2} placeholder="Anything we should know? (arrival time, accessibility)" className={`${f} sm:col-span-2`} />
      <p className="eyebrow mt-4 text-clay sm:col-span-2">02 · Payment (demo)</p><input required inputMode="numeric" placeholder="4242 4242 4242 4242" className={`${f} sm:col-span-2`} /><input required placeholder="MM / YY" className={f} /><input required placeholder="CVC" className={f} /><p className="text-[13px] text-mute sm:col-span-2">Demo form. Nothing is sent or stored, and no card is charged.</p></div>
    <aside className="h-fit rounded-[28px] bg-sand p-7 lg:col-span-5"><p className="eyebrow text-mute">Summary</p><ul className="mt-5 space-y-3 text-[15px]">{lines.map((l) => <li key={l.id + (l.opt ?? "")} className="flex justify-between gap-4"><span>{l.name} × {l.qty}{l.opt && <span className="block text-[13px] text-mute">{l.opt}</span>}</span><span className="tabular-nums">{money(l.price * l.qty)}</span></li>)}</ul><div className="mt-6 flex justify-between border-t border-ink/10 pt-5 text-[19px]"><span>Total</span><span className="tabular-nums">{money(total)}</span></div><button className="btn mt-6 w-full justify-center bg-moss text-paper hover:bg-clay">Confirm demo booking</button></aside></form>);
}
export function ContactForm() {
  const [ok, setOk] = useState(false), f = "w-full border-b border-ink/20 bg-transparent pb-3 pt-2 text-[18px] outline-none placeholder:text-ink/35 focus:border-moss";
  if (ok) return <p className="display text-[36px]">Thank you. <em className="text-mute">This is a concept, so nobody will write back.</em></p>;
  return (<form onSubmit={(e) => { e.preventDefault(); setOk(true); }} className="grid gap-7 sm:grid-cols-2"><input required placeholder="Name" className={f} /><input required type="email" placeholder="Email" className={f} /><select className={`${f} sm:col-span-2`}>{["A stay", "Ordering a capsule", "A site survey", "Something else"].map((x) => <option key={x}>{x}</option>)}</select><textarea required rows={4} placeholder="Message" className={`${f} sm:col-span-2`} /><p className="text-[13px] text-mute sm:col-span-2">Concept form. Nothing is sent or stored.</p><button className="btn w-fit bg-moss text-paper hover:bg-clay">Send <Arrow /></button></form>);
}
