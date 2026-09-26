/**
 * Cinematic Scroll-Driven Frame Animation Engine (Integrated with Portfolio)
 * Built for 192 high-resolution video frames (1280x720)
 * Uses HTML5 Canvas + Lerp physics interpolation for butter-smooth scrubbing.
 */

(function () {
    'use strict';
  
    // --- Configuration ---
    const TOTAL_FRAMES = 192;
    const FRAME_PREFIX = 'frames/frame_';
    const FRAME_EXT = '.png';
    const DAMPING = 0.085; // Physics interpolation factor for smooth inertia
  
    // --- DOM Elements ---
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    
    // Loader
    const loader = document.getElementById('loader');
    const loaderProgressBar = document.getElementById('loaderProgressBar');
    const loaderPercent = document.getElementById('loaderPercent');
  
    // --- State Variables ---
    const images = new Array(TOTAL_FRAMES);
    let loadedCount = 0;
    let targetFrame = 0;
    let currentFrame = 0;
    let lastRenderedFrame = -1;
  
    // Helper to format frame path: e.g. frames/frame_0001.png
    function getFrameSrc(index) {
      const padded = String(index + 1).padStart(4, '0');
      return `${FRAME_PREFIX}${padded}${FRAME_EXT}`;
    }
  
    // --- Canvas Sizing & Retina Crispness ---
    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
  
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
  
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
  
      // Force re-draw of current frame on resize
      if (lastRenderedFrame >= 0) {
        renderFrame(lastRenderedFrame);
      }
    }
  
    // Find the closest loaded image so frame is never blank
    function getSafeImage(frameIndex) {
      const idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex));
      if (images[idx] && images[idx].complete && images[idx].naturalWidth > 0) {
        return images[idx];
      }
      // Search outwards for nearest available frame
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = idx - offset;
        if (prev >= 0 && images[prev] && images[prev].complete && images[prev].naturalWidth > 0) {
          return images[prev];
        }
        const next = idx + offset;
        if (next < TOTAL_FRAMES && images[next] && images[next].complete && images[next].naturalWidth > 0) {
          return images[next];
        }
      }
      return images[0];
    }
  
    // Render a specific frame with object-fit: cover calculation
    function renderFrame(frameIndex) {
      const img = getSafeImage(frameIndex);
      if (!img || !img.complete || img.naturalWidth === 0) return;
  
      const w = window.innerWidth;
      const h = window.innerHeight;
      const imgW = img.naturalWidth || 1280;
      const imgH = img.naturalHeight || 720;
  
      // Calculate aspect ratio cover
      const scale = Math.max(w / imgW, h / imgH);
      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const offsetX = (w - drawW) / 2;
      const offsetY = (h - drawH) / 2;
  
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    }
  
    // --- Scroll Tracking ---
    function updateScrollTarget() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
  
      const scrollFraction = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      targetFrame = scrollFraction * (TOTAL_FRAMES - 1);
    }
  
    // --- Main Animation & Lerp Render Loop ---
    function tick() {
      // Lerp Physics: smoothly ease currentFrame toward targetFrame
      const frameDiff = targetFrame - currentFrame;
      if (Math.abs(frameDiff) > 0.001) {
        currentFrame += frameDiff * DAMPING;
      } else {
        currentFrame = targetFrame;
      }
  
      const frameToDraw = Math.round(currentFrame);
      if (frameToDraw !== lastRenderedFrame) {
        renderFrame(frameToDraw);
        lastRenderedFrame = frameToDraw;
      }
  
      requestAnimationFrame(tick);
    }
  
    // --- Preloading System ---
    function preloadImages() {
      let initialFrameRendered = false;
  
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = getFrameSrc(i);
  
        img.onload = () => {
          loadedCount++;
  
          // Render Frame 1 immediately as soon as it arrives!
          if (i === 0 && !initialFrameRendered) {
            initialFrameRendered = true;
            renderFrame(0);
          }
  
          // Update loader progress
          const percent = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
          if (loaderProgressBar) {
            loaderProgressBar.style.width = `${percent}%`;
          }
          if (loaderPercent) {
            loaderPercent.textContent = `${percent}%`;
          }
  
          // Dismiss loader when complete
          if (loadedCount >= TOTAL_FRAMES) {
            setTimeout(() => {
              if (loader) {
                loader.classList.add('hidden');
              }
            }, 250);
          }
        };
  
        img.onerror = () => {
          console.warn(`Failed to load frame ${i + 1}`);
          loadedCount++;
        };
  
        images[i] = img;
      }
    }
  
    // --- Event Listeners Setup ---
    function setupEventListeners() {
      // Scroll listener with passive flag for high frame-rate performance
      window.addEventListener('scroll', updateScrollTarget, { passive: true });
  
      // Window Resize
      window.addEventListener('resize', resizeCanvas, { passive: true });
    }
  
    // --- Initialization ---
    function init() {
      resizeCanvas();
      setupEventListeners();
      preloadImages();
      
      // Check initial scroll in case user reloads halfway down the page
      updateScrollTarget();
      
      requestAnimationFrame(tick);
    }
  
    // Start when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  
  })();
  
