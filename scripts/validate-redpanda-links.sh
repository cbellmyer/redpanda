#!/bin/bash

# Validates photo.redpanda.pet album URLs in events.json.
# Checks URL format only — does not make HTTP requests.
# Run manually: bash scripts/validate-redpanda-links.sh

echo "Validating photo.redpanda.pet album links..."

EVENTS_JSON="content/static/data/events.json"
ERRORS=0

if [ ! -f "$EVENTS_JSON" ]; then
    echo "❌ Missing: $EVENTS_JSON"
    exit 1
fi

LINKS=$(grep -o '"https://photo\.redpanda\.pet/[^"]*"' "$EVENTS_JSON" | tr -d '"' | sort -u)

if [ -z "$LINKS" ]; then
    echo "No photo.redpanda.pet links found — nothing to validate."
    exit 0
fi

while IFS= read -r url; do
    path="${url#https://photo.redpanda.pet/}"

    if [ -z "$path" ]; then
        echo "❌ Empty path in: $url"
        ((ERRORS++))
        continue
    fi

    valid=true
    IFS='/' read -ra segments <<< "$path"

    for seg in "${segments[@]}"; do
        if [ -z "$seg" ]; then
            echo "❌ Empty path segment in: $url"
            ((ERRORS++))
            valid=false
            break
        fi
        # Each segment must be alphanumeric with single hyphens (no leading/trailing hyphens)
        if ! [[ "$seg" =~ ^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$ ]]; then
            echo "❌ Invalid path segment '$seg' in: $url"
            ((ERRORS++))
            valid=false
            break
        fi
    done

    if $valid; then
        echo "✓ $url"
    fi
done <<< "$LINKS"

echo ""
if [ $ERRORS -eq 0 ]; then
    echo "✅ All photo.redpanda.pet links are valid!"
    exit 0
else
    echo "❌ Found $ERRORS validation error(s)"
    exit 1
fi
