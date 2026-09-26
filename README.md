# Cinematic Scroll-Driven Frame Animation

An ultra-smooth, Apple-style frame sequence scroll animation built with HTML5 `<canvas>`, Vanilla JavaScript, and physics-interpolated linear damping (Lerp).

## Features

- **192 High-Definition Frames (1280×720)**: Seamlessly scrubs through all frames as the user scrolls.
- **Physics-Interpolated Damping (Lerp)**: Eliminates mouse wheel jitter and notch steps with buttery smooth momentum.
- **Responsive Aspect-Ratio Cover**: Crisp canvas rendering on all viewport sizes and high-DPI (Retina) displays.
- **Zero-Flicker Preloader & Caching**: Frame 1 displays instantly while background frames buffer with a sleek progress bar and outward fallback algorithm.
- **Interactive Minimalist HUD**:
  - Live Frame counter (`FRAME 001 / 192`)
  - Real-time FPS counter (`60+ FPS`)
  - Interactive Scrubbing Bar (click or drag to jump anywhere)
  - Auto-Play toggle with variable speeds (`1x`, `1.5x`, `2x`)
  - Fullscreen toggle
- **Keyboard Navigation**:
  - `Space`: Toggle Auto-Play / Pause
  - `Arrow Down` / `Arrow Right`: Step forward 1 frame
  - `Arrow Up` / `Arrow Left`: Step backward 1 frame
  - `Home`: Jump to Frame 1
  - `End`: Jump to Frame 192

## How to Run

1. **Using Node dev server (Recommended)**:
   ```bash
   npm run dev
   # or
   node server.js
   ```
   Open [http://localhost:3000](http://localhost:3000) in any modern browser.

2. **Direct Browser**:
   You can also open [index.html](file:///c:/Users/AYUSH/Desktop/Projects/Portfolio/index.html) directly in your browser.
