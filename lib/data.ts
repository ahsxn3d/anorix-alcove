export const models = [
  { n: "Solo", img: "model_0.78_ede6da", area: "14 m²", sleeps: "1–2", w: "3.3 m", price: "€ 39,000", lead: "8 weeks", d: "A writing room, a guest room, a reason to finally use that plot. Bed, desk, wet room." },
  { n: "Duo", img: "model_1_e3d9c6", area: "22 m²", sleeps: "2", w: "4.2 m", price: "€ 58,000", lead: "10 weeks", d: "Our most-booked stay. Queen bed under the skylight, galley kitchen, shower with a view." },
  { n: "Lodge", img: "model_1.3_d9cdb6", area: "31 m²", sleeps: "2–4", w: "5.5 m", price: "€ 79,000", lead: "12 weeks", d: "Two sleeping zones and a full kitchen. Lives year-round at −20 °C on the same solar roof." },
];

export const places = [
  { slug: "hardanger", n: "Hardanger, Norway", x: 47, y: 24, s: "Fjord edge · 6 capsules", from: "€ 240 / night" },
  { slug: "cairngorms", n: "Cairngorms, Scotland", x: 27, y: 33, s: "Pine forest · 4 capsules", from: "€ 190 / night" },
  { slug: "engadin", n: "Engadin, Switzerland", x: 57, y: 55, s: "Alpine meadow · 3 capsules", from: "€ 310 / night" },
  { slug: "picos", n: "Picos de Europa, Spain", x: 20, y: 63, s: "Limestone valley · 5 capsules", from: "€ 170 / night" },
  { slug: "lapland", n: "Lapland, Finland", x: 74, y: 13, s: "Aurora field · 4 capsules", from: "€ 280 / night" },
];

export const DEPOSIT = 2000;
export const capsuleSlug = (n: string) => n.toLowerCase();
export const priceNum = (s: string) => Number(s.replace(/[^0-9]/g, ""));
export const sizeOf: Record<string, number> = { solo: 0.78, duo: 1, lodge: 1.3 };
export const extras: Record<string, string[]> = {
  solo: ["Bed, desk and fold-down table", "Wet room with composting WC", "2.4 kW roof solar, 10 kWh battery", "Single curved window, 2.2 m"],
  duo: ["Queen bed under a 1.2 m skylight", "Galley kitchen with induction hob", "4.2 kW roof solar, 20 kWh battery", "Curved window, 3.4 m"],
  lodge: ["Two sleeping zones", "Full kitchen and dining bench", "6 kW roof solar, 30 kWh battery", "Curved window, 4.6 m, plus side glazing"],
};
export const valleyText: Record<string, { lead: string; notes: string[] }> = {
  hardanger: { lead: "Capsules on a terrace above the fjord, a short walk from the orchards. Long light in May, waterfalls in June.", notes: ["Ferry 15 min", "Fjord swimming from June", "Wood-fired sauna on site"] },
  cairngorms: { lead: "Caledonian pine forest on the edge of the national park. Red squirrels, dark skies and a burn below the deck.", notes: ["Dark Sky park", "Loch 10 min on foot", "Bikes included"] },
  engadin: { lead: "An alpine meadow at 1,800 m with a view down the valley. Cross-country trails start at the door in winter.", notes: ["Ski trails in winter", "Lakes 20 min", "Train station 8 km"] },
  picos: { lead: "A limestone valley with walking routes in every direction. Warm stone, cool nights and very few cars.", notes: ["Gorge walks", "River pools", "Village bakery 3 km"] },
  lapland: { lead: "An open field on the edge of the forest, angled north. Most clear nights between September and March show the aurora.", notes: ["Aurora alerts", "Snowshoes included", "Heated floors"] },
};
export const faq: [string, string][] = [
  ["Is Alcove a real company?", "No. Alcove is a design concept by Anorix. The capsules, valleys and prices are fictional and the checkout is a demo that charges nothing."],
  ["Do I need planning permission?", "In the concept, capsules under 30 m² on screw piles count as temporary structures in many regions. We would check your plot during the survey."],
  ["How does it arrive?", "On one truck with a small crane. The screw piles go in the week before, and most installs take under six hours."],
  ["Does it really work off-grid?", "Yes, in the concept. Roof solar, a battery, rainwater filtration and a composting WC cover a normal stay year-round."],
  ["Can I stay before I buy?", "Yes. Book a night in any valley; if you order within 60 days, the stay comes off the capsule price."],
  ["What does the deposit cover?", "A €2,000 deposit holds a build slot and books the site survey. On this site it is a demo line in your bag."],
];
