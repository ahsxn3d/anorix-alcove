import { Head } from "@/components/UI";
import { faq } from "@/lib/data";
export const metadata = { title: "FAQ" };
export default function Page() { return (<main><Head k="FAQ" title={<>Good <em>questions.</em></>} /><section className="wrap pb-[clamp(80px,9vw,140px)]"><div className="wrap max-w-[920px] divide-y divide-ink/10 border-y border-ink/10">{faq.map(([q, a]) => <details key={q} className="group py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-6"><span className="display text-[26px]">{q}</span><span className="text-[22px] text-clay transition-transform group-open:rotate-45">+</span></summary><p className="mt-4 max-w-[60ch] text-[16px] leading-[1.65] text-ink/70">{a}</p></details>)}</div></section></main>); }
