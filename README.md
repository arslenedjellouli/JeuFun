# Ars Riw Ari Ami

A browser-based, two-player **Bulls & Cows** number guessing game built with
React and Vite. Players take turns guessing a secret number and receive
feedback about correct digits and positions.

## Features

- Shared random secret or individual player secrets
- Configurable number length from 3 to 8 digits
- Custom player names and starting player
- Optional per-guess timer from 15 to 180 seconds
- Bulls and cows feedback for every guess
- Hot-seat multiplayer on one device
- Persistent player statistics using browser local storage
- Responsive interface for desktop and mobile screens

## Live demo

Play online: [Ars Riw Ari Ami](https://arsriwariami-game.onrender.com)

## Requirements

- Node.js 20 or newer
- npm 9 or newer

## Local development

```bash
git clone https://github.com/arslenedjellouli/ArsRiwAriAmi-Jeu.git
cd ArsRiwAriAmi-Jeu
npm ci
npm run dev
```

Open the local URL printed by Vite, usually
[`http://localhost:5173`](http://localhost:5173).

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run start` | Serve `dist/` using the deployment port |

## How to play

1. Choose the game mode and configure the players.
2. Select the number of digits and optional timer.
3. In individual mode, each player enters a unique secret number.
4. Players alternate guesses.
5. A **bull** is a correct digit in the correct position.
6. A **cow** is a correct digit in the wrong position.
7. The first player to discover the secret number wins.

Secret numbers and guesses must contain unique numeric digits.

## Project structure

```text
├── app.jsx          # Game state, rules, screens, and interactions
├── main.jsx         # React entry point
├── index.css        # Tailwind utility setup and global styles
├── index.html       # HTML entry point
├── package.json      # Scripts and dependencies
├── render.yaml      # Render deployment configuration
└── vite.config.js   # Vite configuration
```

## Deployment

The repository includes a Render configuration. Render can deploy it as a
static site using:

```bash
npm ci
npm run build
```

The generated `dist/` directory is intentionally ignored by Git and should be
created by the deployment platform or local build.

## Contributing

1. Create a feature branch.
2. Install dependencies with `npm ci`.
3. Run `npm run build` before opening a pull request.
4. Describe gameplay or UI changes clearly in the pull request.

## License

No license has currently been declared. Until a license is added, the source
remains protected by copyright and should not be redistributed or modified
outside the permissions granted by the repository owner.
