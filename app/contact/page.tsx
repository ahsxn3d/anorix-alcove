import { ContactForm } from "@/components/Shop";
import { Head } from "@/components/UI";
export const metadata = { title: "Contact" };
export default function Page() { return (<main><Head k="Contact" title={<>Write to <em>us.</em></>} lead="Stays, orders or a site survey. Tell us which and we route it." /><section className="wrap pb-[clamp(80px,9vw,140px)]"><div className="wrap max-w-[920px]"><ContactForm /></div></section></main>); }
