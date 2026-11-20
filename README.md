# Leonida Platinum — GTA VI Trophy Guide & Tracker (Round 4)

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/coral-fox-12/leonida-platinum-guide-r4/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/coral-fox-12/leonida-platinum-guide-r4/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for the trophies of **Grand Theft Auto VI** (PlayStation 5), built for the [gta6-trophy-guide-01 bounty](https://make.fun/bounty/gta6-trophy-guide-01) on [make.fun](https://make.fun). Open `app/index.html` and it runs entirely from its own files — no account, no ads, no network.

> **Referral:** code `bz33p674` — [https://make.fun/r/bz33p674](https://make.fun/r/bz33p674)

## What is inside

- **All 55 official trophies** — 1 platinum, 2 gold, 6 silver, 46 bronze — with the official name, description and grade for each, plus a guide in our own words that cites where each fact comes from.
- **A tracker that remembers.** Tick trophies off and a progress bar counts up to the platinum. Progress lives in your browser's localStorage and can be exported to a JSON file and imported back.
- **Filters that slice the list.** By grade, by kind (story, missable, collectibles, activities, online, not earned yet), and by search — with deep links, so `#grade=silver` or `#q=meditate` opens the guide already filtered.
- **A spoiler shield.** Switch it on and story trophies stay hidden until you have earned them.
- **The missable, flagged everywhere.** *Positive Mental Attitude* — meditate at all 18 spots — is the only missable trophy. It is flagged in the roadmap, in the list, and on the trophy itself.
- **A roadmap to the platinum.** Story first, the missable as you travel, activities and collectibles second, cleanup and 100% last.

## Run it

```sh
# no build step, no dependencies — just serve the folder
python3 -m http.server 8080 --directory app
# then open http://localhost:8080
```

Or assemble the submission (Node, standard library only):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Where the facts come from

Names, descriptions and grades are the official PlayStation trophy list. Each guide names the community guide its how-to draws on — PowerPyx, PlayStationTrophies.org, PSNProfiles, TrueTrophies or Exophase — and is written in our own words; nothing is copied from those guides. Counts and objectives (250 stunts, 100 vehicles, 52 areas, 18 meditation spots) come straight from the official descriptions.

## Files

| Path | What it is |
| --- | --- |
| `app/index.html` | The guide page: hero, filters, roadmap, tracker |
| `app/js/app.js` | The tracker: rendering, filters, progress, next-trophy picker |
| `app/style.css` | The look: sunset-over-Leonida, system fonts only |
| `app/data/trophies.json` | All 55 trophies with guides, grades, flags and sources |
| `main.ts` | Entrypoint: copies app/ and screenshots/, writes dossier.json |
| `vendor/makefun-frontend.ts` | The kit's dossier builder (unchanged) |
| `screenshots/` | Four screenshots of the guide in action |
| `shots.json` | Which view each screenshot shows |

## License

MIT. Unofficial fan work — Grand Theft Auto and GTA are trademarks of Rockstar Games; this guide uses no Rockstar artwork or logos.
