import { notFound } from "next/navigation";
import Capsule from "@/components/Capsule";
import { AddBag } from "@/components/Shop";
import { models, sizeOf, extras, DEPOSIT, priceNum } from "@/lib/data";
import { money } from "@/lib/commerce/money";
export function generateStaticParams() { return models.map((m) => ({ model: m.n.toLowerCase() })); }
export async function generateMetadata({ params }: { params: Promise<{ model: string }> }) { const { model } = await params; return { title: `Alcove ${models.find((m) => m.n.toLowerCase() === model)?.n ?? "Capsule"}` }; }
export default async function Page({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params; const m = models.find((x) => x.n.toLowerCase() === model); if (!m) notFound();
  return (<main className="bg-paper pt-[clamp(100px,10vw,140px)]"><div className="wrap grid gap-8 pb-[clamp(80px,9vw,140px)] lg:grid-cols-12">
    <div className="relative aspect-[6/5] overflow-hidden rounded-[28px] bg-sand lg:col-span-7"><Capsule size={sizeOf[model]} hour={0.7} /><span className="absolute left-5 top-5 rounded-full bg-paper/90 px-3 py-1.5 text-[13px]">{m.w} long · live 3D</span></div>
    <div className="flex flex-col rounded-[28px] bg-sand p-7 md:p-10 lg:col-span-5"><p className="eyebrow text-clay">Alcove capsule</p><h1 className="display mt-4 text-[72px]">{m.n}</h1><p className="mt-4 max-w-[40ch] text-[16px] leading-[1.6] text-ink/70">{m.d}</p>
      <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-ink/10 pt-6">{[["Floor", m.area], ["Sleeps", m.sleeps], ["Lead time", m.lead]].map(([a, b]) => <div key={a}><dt className="eyebrow text-mute">{a}</dt><dd className="display mt-2 text-[26px]">{b}</dd></div>)}</dl>
      <ul className="mt-8 space-y-2 text-[15px] text-ink/75">{extras[model].map((x) => <li key={x} className="flex gap-3"><span className="text-clay">—</span>{x}</li>)}</ul>
      <div className="mt-auto pt-10"><p className="eyebrow text-mute">Delivered &amp; installed</p><p className="display mt-1 text-[38px]">{money(priceNum(m.price))}</p><div className="mt-5 flex flex-wrap gap-3"><AddBag id={`deposit-${model}`} name={`Build slot · Alcove ${m.n}`} price={DEPOSIT} opt="Deposit, includes site survey" label={`Hold a build slot · ${money(DEPOSIT)}`} /><a href="/stays" className="btn border border-ink/20 hover:border-ink/50">Stay in one first</a></div></div></div>
  </div></main>);
}
