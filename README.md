# redpanda.pet 🐾

This is the repository for [redpanda.pet](https://redpanda.pet), a personal portfolio, convention tracker, and telemetry dashboard built with [Hugo](https://gohugo.io/).

## 🚀 Features

- **SCADA-style Telemetry Dashboard (`/pulse`)**: Real-time integration with GitHub, Discord (via Lanyard), Open-Meteo, and federated social feeds (Mastodon/Pixelfed/Bluesky).
- **Interactive Map (`/tracks`)**: A dynamic Leaflet.js map tracking convention history, road trips, and photography deployments.
- **Responsive Design**: Fast, glassmorphism-inspired UI with custom CSS.
- **Automated Image Optimization**: GitHub Actions to optimize web assets on the fly.
- **Custom Pre-commit Hooks**: Enforces code formatting, link validation, and SRI hash generation.

## 🛠️ Tech Stack

- **Static Site Generator**: Hugo v0.156.0+ (Extended)
- **Theme**: Custom `redpanda-theme` (forked/heavily modified from PaperMod)
- **Hosting**: Cloudflare Workers / Cloudflare Pages

## 💻 Local Development

To run this site locally, ensure you have Hugo Extended installed.

```bash
# Clone the repository
git clone https://github.com/cbellmyer/redpanda.git
cd redpanda

# Run the Hugo development server
hugo server
```
Navigate to `http://localhost:1313/` to view the site.

## 🤝 Forking & Adapting

You are welcome to fork this repository to build your own portfolio or telemetry dashboard! 

If you do, please make sure to:
- Change the social media API endpoints and User IDs in `pulse.md` to your own handles.
- Swap out the map points and coordinates in `events.json`.
- Update the site variables and URLs in `hugo.yaml`.
