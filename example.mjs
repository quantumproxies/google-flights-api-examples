// Google Flights API: one typed row per itinerary.
//
//   export QD_API_KEY=...        # https://app.quanticdata.io/register
//   node example.mjs JFK LAX 2026-11-18 2026-11-25
//
// Node 18+, no dependencies.
// Docs and schema: https://quanticdata.io/collectors/google-flights-api/

const BASE = "https://api.quanticdata.io/v1";
const KEY = process.env.QD_API_KEY;
if (!KEY) {
  console.error("Set QD_API_KEY first: https://app.quanticdata.io/register");
  process.exit(1);
}
const headers = { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

const day = (offset) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);
const [from = "JFK", to = "LAX", outbound = day(45), back = day(52)] = process.argv.slice(2);
const input = {
  departure_id: from,
  arrival_id: to,
  outbound_date: outbound,
  return_date: back,
  currency: "USD",
  max_results: 15,
};

const res = await fetch(`${BASE}/scraper/collectors/google_flights/run`, {
  method: "POST",
  headers,
  body: JSON.stringify(input),
});
const body = await res.json();
if (!res.ok || body.type === "error") {
  console.error(`Request failed (${res.status}): ${body.message}`);
  process.exit(1);
}
let run = body.payload;

// Long runs answer 202 and finish in the background: poll the run until it is done.
while (run.status === "queued" || run.status === "running") {
  await new Promise((r) => setTimeout(r, 3000));
  const s = await fetch(`${BASE}/scraper/collectors/runs/${run.run_id}`, { headers });
  run = (await s.json()).payload;
}

const rows = run.results ?? [];
console.table(rows.map((f) => ({
  rank: f.rank,
  airline: f.airline,
  departs: f.departure_time,
  arrives: f.arrival_time,
  duration: f.duration,
  stops: f.stops,
  price: f.price,
})));
console.log(`${rows.length} itinerary rows`);
