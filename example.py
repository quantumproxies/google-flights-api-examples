"""Minimal Google Flights API call — one typed row per itinerary.

Docs & schema: https://quanticdata.io/collectors/google-flights-api/
"""
import json
import os

import requests

API = "https://api.quanticdata.io/v1/scraper/collectors/google_flights/run"
KEY = os.environ["QD_API_KEY"]  # https://quanticdata.io/

payload = {
        "departure_id": "JFK",
        "arrival_id": "LAX",
        "outbound_date": "2026-09-23",
        "return_date": "2026-09-30",
        "currency": "USD",
        "max_results": 15
    }

r = requests.post(
    API,
    headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"},
    json=payload,
    timeout=180,
)
r.raise_for_status()
data = r.json()["payload"]

for row in data["results"]:
    print(row.get("airline"), row.get("departure_time"), row.get("arrival_time"))
print(f"{len(data['results'])} itinerarys, cost ${data['cost']}")
