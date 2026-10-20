export function Head({ k, title, lead, dark = false, children }: { k: string; title: React.ReactNode; lead?: string; dark?: boolean; children?: React.ReactNode }) {
  return (<section className={`${dark ? "bg-pine text-paper" : "bg-paper"} pb-[clamp(40px,5vw,72px)] pt-[clamp(120px,12vw,180px)]`}><div className="wrap"><p className={`eyebrow ${dark ? "text-glow" : "text-clay"}`}>{k}</p><h1 className="display mt-5 max-w-[16ch] text-[clamp(46px,6.4vw,110px)]">{title}</h1>{lead && <p className={`mt-6 max-w-[50ch] text-[17px] leading-[1.65] ${dark ? "text-paper/75" : "text-ink/70"}`}>{lead}</p>}{children}</div></section>);
}
export function Demo() { return <p className="eyebrow inline-block rounded-full bg-clay/15 px-4 py-2 text-clay">Demo — no payment taken</p>; }
