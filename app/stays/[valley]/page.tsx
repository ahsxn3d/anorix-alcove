import { notFound } from "next/navigation";
import Capsule from "@/components/Capsule";
import { StayPicker } from "@/components/Shop";
import { places, valleyText, priceNum } from "@/lib/data";
export function generateStaticParams() { return places.map((p) => ({ valley: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ valley: string }> }) { const { valley } = await params; return { title: places.find((p) => p.slug === valley)?.n.split(",")[0] ?? "Stay" }; }
export default async function Page({ params }: { params: Promise<{ valley: string }> }) {
  const { valley } = await params; const p = places.find((x) => x.slug === valley); if (!p) notFound(); const v = valleyText[valley];
  return (<main className="bg-paper"><section className="relative h-[70svh] min-h-[480px] overflow-hidden bg-pine text-paper"><Capsule mode="product" hour={valley === "lapland" ? 2.9 : valley === "engadin" ? 1 : 0.4} bg="#1e261c" /><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pine/85 via-pine/10 to-transparent" /><div className="wrap relative flex h-full flex-col justify-end pb-12"><p className="eyebrow text-glow">{p.s}</p><h1 className="display mt-4 text-[clamp(48px,7vw,120px)]">{p.n.split(",")[0]}</h1><p className="mt-2 text-paper/75">{p.n.split(",")[1]}</p></div></section>
    <section className="wrap grid gap-10 py-[clamp(56px,6vw,96px)] lg:grid-cols-12"><p className="display text-[clamp(26px,2.6vw,38px)] leading-[1.2] lg:col-span-7">{v.lead}</p><ul className="space-y-3 lg:col-span-4 lg:col-start-9">{v.notes.map((n) => <li key={n} className="border-b border-ink/10 pb-3 text-[16px]">{n}</li>)}</ul></section>
    <section id="dates" className="wrap scroll-mt-28 pb-[clamp(80px,9vw,140px)]"><StayPicker slug={p.slug} name={p.n.split(",")[0]} nightly={priceNum(p.from)} /></section></main>);
}
