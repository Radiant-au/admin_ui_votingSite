# VoteAdmin — Coronation Voting Dashboard

> A production-grade admin dashboard for managing real-time student voting at a university coronation event. Built with React, TypeScript, TanStack Query, and a custom golden dark theme — featuring live vote charts, candidate scoring, winner reveal animations, and full voting lifecycle control.

---

## ✦ What This Is

VoteAdmin is the admin-side web application for a university's annual coronation event. It manages the full election lifecycle — from candidate setup and live vote tracking to judge scoring, winner computation, and a cinematic reveal experience with particle effects and confetti.

The system supports two roles: **Admin** (full access) and **Vote Moderator** (dashboard view only), with role-based route guards enforced on every protected page.

---

## ✦ Feature Highlights

### 🗳️ Live Vote Dashboard
- Real-time vote count polling every 60 seconds via TanStack Query's `refetchInterval`
- Interactive pie charts (Recharts) for King and Queen vote distribution — click a slice to highlight
- Candidate cards with vote counts, progress bars, and vote-share percentages
- Stats overview: total pin codes, students voted, voting status, winner reveal status
- `FinalScoreCharts` section renders only when all candidates have scores — no partial data shown

### 👑 Candidate Management
- Full CRUD: create, edit, and delete candidates with a Dialog form
- Profile image URL preview before saving
- Up to 3 additional gallery images per candidate
- Auto-derived `candidateType` (king/queen/prince/princess) from gender × category — no manual selection needed
- Zod + React Hook Form validation on all fields
- Role-gated: edit/delete buttons only visible to admins

### 📊 Judge Scoring System
- Tabbed interface (Male / Female) for scoring candidates
- Per-candidate input cards with teacher score and committee score (0–100 each)
- Per-field validation with inline error messages
- Final score displayed after submission, with a green "Scores submitted" badge
- Sorted by final score descending so the leaderboard is always visible

### 🔑 PinCode Logs
- Full table of all voter pin codes with status (voted / not voted)
- Client-side search with 300ms debounce across all fields
- Multi-column sort (click any header to toggle asc/desc)
- Stats cards: total codes, voted, not voted, voting rate percentage
- One-click CSV export of filtered results

### 🎬 Winner Reveal Experience
- Four winner cards (King, Queen, Prince, Princess) rendered in a dark cinematic layout
- Each card is hidden behind a mystery overlay until the admin clicks "Reveal"
- On reveal: animated entrance, gold glow border, score breakdown, crown/tiara SVG icon
- `ParticleSystem` canvas animation — ambient gold shimmer normally, celebration burst on reveal
- `ConfettiBurst` (100 pieces, gold colors) fires on each card reveal
- `LightRays` radial overlay fires and fades on reveal
- Full reset button to hide all cards and restart

### 🔐 Auth & Access Control
- JWT decoded client-side via `jwt-decode` — role extracted without an extra API call
- Token persisted in `localStorage` with `getToken/setToken/clearToken` helpers
- `ProtectedRoute` wrapper blocks unauthenticated users and enforces `adminOnly` flag
- Auto-redirect to `/` on 401 response via `apiRequest` interceptor
- `AuthContext` uses `useMemo` on token to avoid unnecessary re-renders

### ⚙️ Voting & Winner Status Control
- Toggle voting open/closed with a confirmation `AlertDialog` before any state change
- Toggle winner reveal on/off with the same guard
- Status displayed as a live badge (green OPEN / red CLOSED) with an animated status ring
- Cache updated immediately via `qc.setQueryData` on mutation success — no refetch needed
- `staleTime: Infinity` on status queries — only updates when the user explicitly toggles

---

## ✦ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Routing** | React Router v6 |
| **State / Data** | TanStack Query v5 |
| **Forms** | React Hook Form + Zod |
| **Charts** | Recharts |
| **UI Components** | shadcn/ui (Radix UI primitives) |
| **Styling** | TailwindCSS + custom CSS variables |
| **Icons** | Lucide React |
| **Animations** | CSS keyframes + Canvas API (particle system) |
| **Font** | Playfair Display (headings) + Inter (body) |
| **Auth** | JWT (`jwt-decode`) + localStorage |
| **HTTP** | Native `fetch` with custom `apiRequest` wrapper |

---

## ✦ Architecture

```
src/
├── api/
│   └── apiClient.ts          # Fetch wrapper: auth injection, 401 redirect, JSON parsing
├── context/
│   └── AuthContext.tsx        # JWT decode, login/logout, role extraction, memoized state
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx  # Auth guard + sidebar container
│   │   └── Sidebar.tsx          # Role-filtered nav, mobile drawer, logout
│   ├── dashboard/
│   │   ├── StatsCards.tsx       # 4-up stat cards (total, voted, voting/winner status)
│   │   ├── VoteCharts.tsx       # Pie charts for King/Queen vote distribution
│   │   ├── FinalScoreCharts.tsx # Pie charts for final scores (conditional render)
│   │   ├── CategoryTabs.tsx     # Swipeable King/Queen candidate tabs with touch support
│   │   ├── CandidateCard.tsx    # Aspect-ratio card with vote progress bar
│   │   └── CompactCandidateCard.tsx # Horizontal card with multi-score display
│   ├── candidates/
│   │   └── CandidateForm.tsx    # Create/edit Dialog with image preview + gallery
│   ├── pincodes/
│   │   ├── PinCodeStatsCards.tsx # 4-up stats: total, voted, not voted, rate
│   │   └── PinCodeTable.tsx     # Sortable, filterable table with skeleton loading
│   └── reveal/
│       ├── WinnerCard.tsx        # Individual winner reveal card with animation
│       ├── ParticleSystem.tsx    # Canvas-based ambient/celebration particle system
│       ├── ConfettiBurst.tsx     # 100-piece gold confetti burst on reveal
│       ├── LightRays.tsx         # 12-ray radial light burst effect
│       └── CrownIcon.tsx         # Custom SVG crown (king) and tiara (queen) with gradient
├── hooks/
│   ├── useCandidates.ts         # CRUD mutations + backend-to-UI shape mapping
│   ├── useDashboardScores.ts    # Judge scores polling (male + female parallel queries)
│   ├── useVoteData.ts           # Vote counts + percentage helpers
│   ├── useStatus.ts             # Voting/winner status queries + toggle mutations
│   ├── useWinners.ts            # Score submission + final winner fetch
│   ├── usePinCodeLogs.ts        # PinCode log fetching
│   ├── useModerator.ts          # Moderator list + add mutation
│   └── useDebounce.ts           # Generic debounce hook (used in PinCode search)
└── pages/
    ├── Login.tsx                 # Zod form, toast feedback, redirect if authenticated
    ├── Dashboard.tsx             # Composes all dashboard sections
    ├── Candidates.tsx            # CRUD list with role-gated edit/delete
    ├── Scoring.tsx               # Tabbed judge scoring interface
    ├── PinCodeLogs.tsx           # Search, sort, CSV export table
    ├── Control.tsx               # Voting + winner status toggles with confirmation
    ├── Moderators.tsx            # Add moderator form + list
    └── FinalWinnersReveal.tsx    # Cinematic winner reveal page
```

---

## ✦ Key Implementation Decisions

**Why `staleTime: Infinity` on status queries?**  
Voting and winner status changes only when an admin explicitly toggles them. Polling every 60 seconds would cause unnecessary refetches and flickers. With `Infinity` stale time, the UI stays consistent between sessions and only updates on mutation via `qc.setQueryData` — zero extra network round trips.

**Why client-side JWT decode instead of `/auth/me`?**  
The role and username are embedded in the token at login. Decoding client-side with `jwt-decode` means no extra request on every page load or refresh. The token's expiry is validated on every API call by the server, so security is not compromised.

**Why Canvas API for the particle system instead of a library?**  
Full control over shimmer timing, particle density, and the switch between `ambient` and `celebration` modes. Libraries add bundle weight and fixed APIs; the canvas implementation is ~80 lines and does exactly what the design needs.

**Why `Promise.any` isn't used here (unlike the frontend)?**  
This app is admin-only — a single login endpoint `/auth/Alogin`. No role ambiguity, no parallel racing needed.

**Why `useDebounce` for PinCode search?**  
The log table can have thousands of rows. Filtering on every keystroke would cause a visible layout thrash. 300ms debounce keeps the UI responsive while filtering only when the user pauses typing.

**Why `getCandidateType` is derived not stored?**  
Storing `candidateType` separately would require keeping it in sync with gender and category. Deriving it at form submit and at the `mapBackendSelectionToUi` mapping layer means there's a single source of truth — the gender × category combination.

---

## ✦ Design System

This app uses a custom **premium golden dark theme** defined entirely in CSS variables:

```css
--primary:   45 90% 55%   /* Gold */
--accent:    35 85% 45%   /* Amber */
--background: 30 10% 5%  /* Near-black warm */
--card:       30 15% 8%  /* Elevated dark */
```

Custom utility classes (`golden-card`, `glass-card`, `golden-text`, `gradient-primary`) are defined in `index.css` using Tailwind `@layer components`. Headings use Playfair Display for a regal feel; body text uses Inter.

---

## ✦ Getting Started

### Prerequisites
- Node.js ≥ 18
- A running backend API

### Installation

```bash
git clone https://github.com/your-username/voteadmin-frontend.git
cd voteadmin-frontend
npm install
```

### Environment

Create `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Run

```bash
npm run dev    # Development server (Vite)
npm run build  # Production build → dist/
npm run lint   # ESLint
```

---

## ✦ Role Reference

| Feature | Admin | Vote Moderator |
|---------|-------|----------------|
| View Dashboard | ✅ | ✅ |
| View Candidates | ✅ | ✅ |
| Add / Edit / Delete Candidates | ✅ | ❌ |
| Judge Scoring | ✅ | ❌ |
| Voting Control | ✅ | ❌ |
| Winner Reveal | ✅ | ❌ |
| PinCode Logs | ✅ | ❌ |
| Manage Moderators | ✅ | ❌ |

---

## ✦ API Endpoints Consumed

| Method | Endpoint | Page |
|--------|----------|------|
| `POST` | `/auth/Alogin` | Login |
| `GET` | `/auth/moderators` | Moderators |
| `POST` | `/auth/moderator` | Moderators |
| `GET` | `/selection/get/all` | Candidates, Dashboard |
| `POST` | `/selection` | Candidates |
| `PUT` | `/selection/:id` | Candidates |
| `DELETE` | `/selection/:id` | Candidates |
| `GET` | `/vote/senior/admin` | Dashboard (vote counts) |
| `GET` | `/pinCode/voted` | Dashboard (voter stats) |
| `GET` | `/pinCode/logs` | PinCode Logs |
| `GET` | `/winner/candidates?gender=` | Dashboard, Scoring |
| `PUT` | `/winner/:id` | Scoring |
| `GET` | `/winner/final` | Winner Reveal |
| `GET` | `/appStatus/app` | Dashboard, Control |
| `GET` | `/appStatus/winner` | Dashboard, Control |
| `PUT` | `/appStatus/app` | Control |
| `PUT` | `/appStatus/winner` | Control |

---

## ✦ Roadmap

- [ ] Real-time vote updates via WebSocket or SSE (instead of polling)
- [ ] Bulk candidate import via CSV
- [ ] Audit log page for admin actions (toggle history, score changes)
- [ ] Print-ready winner certificate generation
- [ ] Dark/light mode toggle (theme vars are already split-ready)
- [ ] Mobile-optimized reveal page for projector display

---

## ✦ Author

Built by **[Aung Kaung Sett]**  
[Portfolio](https://your-portfolio.dev) · [LinkedIn](https://www.linkedin.com/in/aung-kaung-sett-42ba25197/) · [GitHub](https://github.com/Radiant-au)

---

<p align="center">
  <sub>VoteAdmin — Coronation Voting System · Built for the annual university coronation event</sub>
</p>
