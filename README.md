# Google Flights API — examples

Flight itineraries between two airports — airline, times, stops, price, emissions.

**Live page, full schema & pricing → [quanticdata.io/collectors/google-flights-api/](https://quanticdata.io/collectors/google-flights-api/)**

Searches Google Flights for a route and date and delivers each itinerary row: airline, departure/arrival times and airports, duration, stops, price with parsed value and currency, and the CO2 estimate as shown. Round trip when return_date is given, one-way otherwise. Prices are what Google shows for the requested country/currency at fetch time.

## Quick start (curl)

```bash
curl -X POST https://api.quanticdata.io/v1/scraper/collectors/google_flights/run \
  -H "Authorization: Bearer $QD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"departure_id": "JFK", "arrival_id": "LAX", "outbound_date": "2026-09-23", "return_date": "2026-09-30", "currency": "USD", "max_results": 15}'
```

## Python

See [`example.py`](example.py):

```bash
export QD_API_KEY=qd_live_...   # https://quanticdata.io/
python3 example.py
```

## Inputs

- `departure_id` (string, required) — Departure airport/city IATA code, e.g. JFK.
- `arrival_id` (string, required) — Arrival airport/city IATA code, e.g. LAX.
- `outbound_date` (string, required) — Departure date YYYY-MM-DD.
- `return_date` (string) — Return date YYYY-MM-DD — omit for one-way.
- `currency` (string) — 3-letter price currency (USD, EUR…).
- `country` (string) — ISO 3166-1 alpha-2 code — proxy exit geo and Google locale (gl). Omit for the default pool.
- `lang` (string) — Interface language (hl), e.g. en, it, de.
- `max_results` (integer) — How many itineraries to deliver at most (1–30). You pay only for delivered itineraries.

## Output — one row per itinerary

| field | type | description |
|---|---|---|
| `rank` | integer | 1-based position. |
| `airline` | string | Operating airline(s). |
| `departure_time` | string | Departure time as shown. |
| `arrival_time` | string | Arrival time as shown. |
| `duration` | string | Total duration ("5 hr 53 min"). |
| `stops` | string | "Nonstop", "1 stop"… |
| `price` | string | Price as shown. |
| `price_value` | number | Parsed numeric price. |
| `currency` | string | Price currency. |
| `departure_airport` | string | Departure airport code. |
| `arrival_airport` | string | Arrival airport code. |
| `emissions` | string | CO2 estimate as shown. |
…and 2 more fields — full schema on the [live page](https://quanticdata.io/collectors/google-flights-api/).

## Pricing

**$0.003 per delivered itinerary** ($3 per 1,000). A run that delivers nothing costs nothing, and failed rows are never billed. The $2/month free allowance covers roughly 666 itinerarys — no card required.

## Links

- This collector: https://quanticdata.io/collectors/google-flights-api/
- All collectors: https://quanticdata.io/collectors/
- Docs: https://quanticdata.io/docs/
