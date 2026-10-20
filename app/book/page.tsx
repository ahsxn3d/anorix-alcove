import { Head, Demo } from "@/components/UI";
import { places } from "@/lib/data";
export const metadata = { title: "Book a stay" };
export default function Page() { return (<main><Head k="Book" title={<>Pick a <em>valley.</em></>} lead="Choose where, then pick your nights on the calendar. Every capsule sleeps two; Lodge stays sleep four."><div className="mt-8"><Demo /></div></Head>
  <section className="wrap pb-[clamp(80px,9vw,140px)]"><div className="wrap"><ul className="divide-y divide-ink/10 border-y border-ink/10">{places.map((p) => <li key={p.slug}><a href={`/stays/${p.slug}#dates`} className="group flex flex-wrap items-baseline justify-between gap-4 py-7"><span className="display text-[clamp(32px,3.6vw,56px)] transition-colors group-hover:text-clay">{p.n.split(",")[0]}</span><span className="text-[15px] text-mute">{p.s}</span><span className="display text-[24px]">{p.from} →</span></a></li>)}</ul></div></section></main>); }
