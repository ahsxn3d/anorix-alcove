import Capsule from "@/components/Capsule";
import { Head } from "@/components/UI";
import { models, sizeOf } from "@/lib/data";
export const metadata = { title: "Capsules" };
export default function Page() { return (<main><Head k="The capsules" title={<>Three sizes. <em>Same quiet.</em></>} lead="Every Alcove is built indoors in Porto, arrives on one truck and stands on four screw piles. Pick the size that fits the plot and the people." />
  <section className="wrap pb-[clamp(80px,9vw,140px)]"><div className="wrap grid gap-6 lg:grid-cols-3">{models.map((m) => <a key={m.n} href={`/capsules/${m.n.toLowerCase()}`} className="group overflow-hidden rounded-[28px] bg-sand"><div className="relative aspect-[5/4]"><Capsule size={sizeOf[m.n.toLowerCase()]} hour={0.7} /></div><div className="p-7"><div className="flex items-baseline justify-between"><p className="display text-[44px]">{m.n}</p><p className="text-[15px] text-mute">{m.area} · sleeps {m.sleeps}</p></div><p className="mt-3 text-[15px] leading-[1.6] text-ink/70">{m.d}</p><p className="display mt-6 text-[28px]">{m.price}</p></div></a>)}</div></section></main>); }
