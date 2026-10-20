import { Checkout } from "@/components/Shop";
import { Head, Demo } from "@/components/UI";
export const metadata = { title: "Checkout" };
export default function Page() { return (<main><Head k="Checkout" title="Almost there."><div className="mt-8"><Demo /></div></Head><section className="wrap pb-[clamp(80px,9vw,140px)]"><div className="wrap"><Checkout /></div></section></main>); }
