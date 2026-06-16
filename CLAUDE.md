# Shelter — Claude Code Rules

## Git Commits
- **NEVER add `Co-Authored-By: Claude ...`** to any commit message in this repo
- Commit messages must be under kbbeats's account only — this is a solo personal project
- Plain commit messages only, no co-author trailers

## Running Locally
```powershell
npm run dev
```
- Server: `http://localhost:3001` (Express + Socket.io)
- Client: `http://localhost:5173` (React + Vite)

## Deploying
```bash
# Server — push to master, Render auto-redeploys
git add <files> && git commit -m "message" && git push origin master

# Client — always run from repo root after pushing
npx vercel --prod --yes
```
- Vercel project: `prj_9nw0lgMRXaSvWXMucp23vGiUgFXo` ("shelter")
- Always deploy client from repo root — `client/.vercel/project.json` points to a broken separate project, ignore it

## Live URLs
- Client: https://shelter-gules.vercel.app
- Server: https://shelter-server-z35p.onrender.com (health: `/health`)
- Render free tier sleeps after 15 min — keep-alive cron already set up at cron-job.org

## Tech Stack
| Layer | Choice |
|---|---|
| Monorepo | npm workspaces (`shared/`, `server/`, `client/`) |
| Shared types | `shared/types.ts`, `shared/events.ts` |
| Server | Node.js + Express + Socket.io + `tsx` |
| Client | React 18 + Vite + Zustand + React Router v6 + socket.io-client |
| Styling | Raw CSS custom properties — all CSS lives in `client/src/index.css` |
| Database | None — all state in-memory on server |

## Architecture Constants (never break these)
**State machine order:**
```
LOBBY → CATASTROPHE_REVEAL → BUNKER_REVEAL → DEALING
→ ROUND_ARGUMENT → ABILITY_INTERRUPT → ROUND_ARGUMENT
→ ROUND_VOTING → EXILE_REVEAL → (loop) → GAME_ENDED
```

**Card privacy model:**
- Server holds full `PlayerCards` per player — never exposed in room state
- `getPublicState(viewerSocketId)` masks cards: viewer sees own full cards, others only if `isRevealed`
- Own-card panel always shows full values to the owner; ID cards show `???` for unrevealed slots

## File Scope Rules
- **All CSS** goes in `client/src/index.css` — no separate CSS files, no CSS modules, no Tailwind
- **Per-scenario themes** use scoped `[data-theme="<id>"]` selectors — never bleed into default/other themes
- **Never touch `server/`** unless the task explicitly requires a server-side change
- **Never add npm dependencies** without asking first
- **Never delete files** without showing a diff and confirming

## Installed Skills
Every time a new skill is installed, add it to this table AND to the global `installed-skills.md` memory file (at `C:\Users\Chyngyz\.claude\projects\C--Users-Chyngyz-OneDrive-Desktop-vs-Projects\memory\installed-skills.md`) so it is available for reference in the Claude Desktop / prompter chat.

| Skill | Invoke | What it does |
|---|---|---|
| `caveman` | `/caveman` | Silent execution — completes task, replies only "Me done." or "Me not done." |
| `full-output-enforcement` | `/full-output-enforcement` | Bans truncation/placeholders, enforces complete unabridged code output |
| `prompt-master` | `/prompt-master` | Generates optimized, ready-to-paste prompts for any AI tool |
| `impeccable` | `/impeccable` | Designs, redesigns, critiques, or polishes any frontend UI |
| `image-to-code` | `/image-to-code` | Replicates a UI design from a reference screenshot into code |
| `design-taste-frontend` | `/design-taste-frontend` | Anti-slop frontend for landing pages & portfolios — reads brief, infers direction |
| `design-taste-frontend-v1` | `/design-taste-frontend-v1` | Original v1 of above — use only for backward compatibility |
| `ui-ux-pro-max` | `/ui-ux-pro-max` | UI/UX intelligence: 50+ styles, 161 palettes, 57 font pairings, 10 stacks |
| `redesign-existing-projects` | `/redesign-existing-projects` | Audits existing project and upgrades to premium quality without a full rewrite |
| `ckm-ui-styling` | `/ckm-ui-styling` | shadcn/ui + Tailwind styling for accessible, beautiful React components |
| `minimalist-ui` | `/minimalist-ui` | Clean editorial interfaces — warm monochrome, bento grids, no gradients |
| `gpt-taste` | `/gpt-taste` | Awwwards-level GSAP motion engineering with AIDA structure |
| `high-end-visual-design` | `/high-end-visual-design` | Agency-tier ($150k+) Awwwards design — Apple/Linear aesthetic |
| `industrial-brutalist-ui` | `/industrial-brutalist-ui` | Military/Swiss typography brutalism — tactical terminals, declassified blueprints |
| `huashu-design` | `/huashu-design` | High-fidelity HTML prototypes, interactive demos, slides, animations |
| `stitch-design-taste` | `/stitch-design-taste` | Generates DESIGN.md semantic design system files for Google Stitch |
| `brandkit` | `/brandkit` | Premium brand-kit images: logo systems, identity decks, visual-world boards |
| `imagegen-frontend-web` | `/imagegen-frontend-web` | Generates one design image per landing page section as a visual reference |
| `imagegen-frontend-mobile` | `/imagegen-frontend-mobile` | Generates premium mobile app screen concepts inside phone mockups |
| `ckm-brand` | `/ckm-brand` | Brand voice, visual identity standards, messaging frameworks, style guides |
| `ckm-design-system` | `/ckm-design-system` | Token architecture (primitive→semantic→component), CSS vars, spacing scales |
| `ckm-design` | `/ckm-design` | Meta-skill routing to all ckm sub-skills: logo, CIP, banners, social, icons |
| `ckm-banner-design` | `/ckm-banner-design` | Banners for social media, ads, web heroes, and print — multiple art directions |
| `ckm-slides` | `/ckm-slides` | Strategic HTML slide decks with Chart.js and copywriting-formula structure |
| `markitdown` | `/markitdown` | Converts PDFs to clean Markdown using opendataloader-pdf |
| `transcript` | `/transcript` | Extracts transcripts from YouTube / TikTok / Instagram Reels |
| `scrape-photos` | `/scrape-photos` | Downloads all photos from a TikTok carousel post using Playwright |
| `graphify` | `/graphify [path]` | Builds a navigable knowledge graph (graph.html/json + report) of the codebase; query/path/explain once built |

## Critical Files
```
shared/types.ts                                    ← ALL shared interfaces
shared/events.ts                                   ← Socket.io event constants
server/src/game/GameRoom.ts                        ← Core state machine
server/src/game/VoteManager.ts                     ← Voting logic
server/src/socket/handlers/gameHandlers.ts         ← Game + scenario events
server/src/socket/handlers/roomHandlers.ts         ← Room join/leave
server/src/socket/handlers/voteHandlers.ts         ← Vote events
server/src/socket/index.ts                         ← Socket.io init + CORS config
client/src/store/gameStore.ts                      ← All socket listeners + Zustand store
client/src/pages/Landing.tsx                       ← Name entry + connection guard
client/src/pages/Lobby.tsx                         ← Room lobby + scenario mode UI
client/src/pages/Game.tsx                          ← Game page — phase routing + layout
client/src/components/lobby/ScenarioPicker.tsx     ← Scenario mode switcher + vote UI
client/src/components/game/PlayerCard.tsx          ← Other-player ID card (read-only)
client/src/components/game/PlayerHand.tsx          ← Own card panel + special action USE button
client/src/index.css                               ← ALL CSS
```
