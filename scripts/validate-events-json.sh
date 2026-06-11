#!/bin/bash

# Validates events.json structure: required fields, valid types, coordinate ranges, album URLs.
# Run manually: bash scripts/validate-events-json.sh

echo "Validating events.json structure..."

EVENTS_JSON="content/static/data/events.json"

if [ ! -f "$EVENTS_JSON" ]; then
    echo "❌ Missing: $EVENTS_JSON"
    exit 1
fi

python3 - "$EVENTS_JSON" << 'PYCODE'
import sys
import json

VALID_TYPES = {"convention", "roadtrip", "event", "shutterpaws", "photoshoot"}
REQUIRED_LOC_FIELDS = {"locationName", "type", "coordinates", "history"}
REQUIRED_HIST_FIELDS = {"year", "eventName", "dates", "venue", "roundTripMiles", "withHyper", "role", "albums"}

errors = 0

with open(sys.argv[1], encoding="utf-8") as f:
    try:
        data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON: {e}")
        sys.exit(1)

if not isinstance(data, list):
    print("❌ Root element must be a JSON array")
    sys.exit(1)

for i, loc in enumerate(data):
    name = loc.get("locationName", f"entry #{i}")
    prefix = f"[{i}] {name}"

    for field in REQUIRED_LOC_FIELDS:
        if field not in loc:
            print(f"❌ {prefix}: missing required field '{field}'")
            errors += 1

    loc_type = loc.get("type", "")
    if loc_type not in VALID_TYPES:
        print(f"❌ {prefix}: invalid type '{loc_type}' — must be one of {sorted(VALID_TYPES)}")
        errors += 1

    coords = loc.get("coordinates")
    if isinstance(coords, list):
        if len(coords) != 2:
            print(f"❌ {prefix}: coordinates must be [lng, lat] (got {len(coords)} values)")
            errors += 1
        else:
            lng, lat = coords
            if not isinstance(lng, (int, float)) or not (-180 <= lng <= 180):
                print(f"❌ {prefix}: longitude {lng} out of range [-180, 180]")
                errors += 1
            if not isinstance(lat, (int, float)) or not (-90 <= lat <= 90):
                print(f"❌ {prefix}: latitude {lat} out of range [-90, 90]")
                errors += 1

    history = loc.get("history", [])
    if not isinstance(history, list) or len(history) == 0:
        print(f"❌ {prefix}: 'history' must be a non-empty array")
        errors += 1
        continue

    for j, hist in enumerate(history):
        hprefix = f"{prefix} [{j}:{hist.get('year', '?')}]"

        for field in REQUIRED_HIST_FIELDS:
            if field not in hist:
                print(f"❌ {hprefix}: missing required field '{field}'")
                errors += 1

        if not isinstance(hist.get("withHyper"), bool):
            print(f"❌ {hprefix}: 'withHyper' must be a boolean")
            errors += 1

        miles = hist.get("roundTripMiles")
        if miles is not None and not isinstance(miles, (int, float)):
            print(f"❌ {hprefix}: 'roundTripMiles' must be a number")
            errors += 1

        albums = hist.get("albums", {})
        if not isinstance(albums, dict):
            print(f"❌ {hprefix}: 'albums' must be an object")
            errors += 1
        else:
            for album_name, url in albums.items():
                if url and url != "#" and not url.startswith("https://"):
                    print(f"❌ {hprefix}: album '{album_name}' URL must start with https://")
                    errors += 1

print()
if errors == 0:
    print(f"✅ events.json is valid! ({len(data)} locations checked)")
    sys.exit(0)
else:
    print(f"❌ Found {errors} validation error(s) in events.json")
    sys.exit(1)
PYCODE
