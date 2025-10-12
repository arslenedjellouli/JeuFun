# Bulls & Cows Game

A React-based number guessing game where players try to guess a secret number. The game provides feedback in the form of "Bulls" (correct digit in correct position) and "Cows" (correct digit in wrong position).

## Features

- **Two Game Modes:**
  - **Shared Secret:** Both players guess the same randomly generated number
  - **Individual Secrets:** Each player sets their own secret number

- **Customizable Settings:**
  - Number of digits (3-8)
  - Player names
  - Starting player selection
  - Optional timer with configurable time per guess (15-180 seconds)

- **Player Statistics:**
  - Games played and won
  - Win rate percentage
  - Total guesses made
  - Best completion time
  - Last played date
  - All stats saved locally in browser

- **Enhanced Gameplay:**
  - Accurate Bulls & Cows algorithm
  - Timer per guess with automatic turn switching
  - Visual feedback with timestamps
  - Hot-seat multiplayer (same device)
  - First to guess correctly wins

- **Beautiful UI:**
  - Modern gradient design
  - Responsive layout
  - Real-time game state updates
  - Enhanced visual feedback for guesses
  - Player statistics dashboard

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Open in Browser:**
   The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## How to Play

1. **Setup:** Configure player names, game mode, number of digits, and other settings
2. **Set Secrets:** If using individual mode, each player enters their secret number
3. **Take Turns:** Players alternate guessing the secret number
4. **Get Feedback:** Each guess shows Bulls (B) and Cows (M) feedback
5. **Win:** First player to guess correctly wins!

## Game Rules

- **Bulls (B):** Correct digit in the correct position
- **Cows (M):** Correct digit in the wrong position
- All digits in the secret number must be unique
- Guesses must also have unique digits
- Only numeric digits are allowed

## Technologies Used

- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)
- Modern ES6+ JavaScript
