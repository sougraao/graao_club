/* =====================================================================
   OFFLINE — Cinematic Power-Button Hero Scene Controller
   Glass Pop 2.0 / graao club — IA para TDAH
   Preserva nossa copy; implementa o prompt "offline" power-button.
   ===================================================================== */

(function () {
  "use strict";

  const reduceMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.dataset.gMotion === "reduce";

  document.addEventListener("DOMContentLoaded", initOfflineHero);

  function initOfflineHero() {
    const heroEl = document.querySelector(".hero.hero--cinematic");
    if (!heroEl) return;

    const video = heroEl.querySelector(".hero-scene__video");
    const canvas = heroEl.querySelector(".hero-scene__canvas");
    const skyCanvas = heroEl.querySelector(".hero-scene__sky-canvas");
    const powerBtn = heroEl.querySelector("#hero-power-btn");
    const powerOSVG = heroEl.querySelector(".power-o-svg");
    const powerHalo = heroEl.querySelector(".power-o-halo");
    const powerPill = heroEl.querySelector(".hero-power-pill");
    const powerPillText = powerPill ? powerPill.querySelector(".hero-power-pill__label") : null;

    if (!video || !canvas || !powerBtn || !powerOSVG) return;

    const ctx = canvas.getContext("2d");
    let skyCtx = skyCanvas ? skyCanvas.getContext("2d") : null;

    // States: 'UNLOADED' -> 'STARTING' -> 'ONLINE' -> 'TURNING_OFF' -> 'OFFLINE' -> 'TURNING_ON' -> 'ONLINE'
    let state = "UNLOADED";
    let isTransitioning = false;
    let hasArrived = false;

    // Dot flight animation state
    let dotActive = false;
    let dotStartTime = 0;
    const DOT_DURATION = 0.78; // 0.78s as per spec
    let dotP0 = { x: 0, y: 0 };
    let dotP1 = { x: 0, y: 0 };
    let dotCtrl = { x: 0, y: 0 };
    let dotTriggeredForShutdown = false;

    // Star glints in the sky (22 stars total: ~10 day, growing to ~22 at night)
    const GLINT_COUNT = 22;
    const glints = [];
    const seedRand = (s) => {
      let t = s % 2147483647;
      if (t <= 0) t += 2147483646;
      return () => (t = (t * 16807) % 2147483647) / 2147483647;
    };
    const rand = seedRand(42);
    for (let i = 0; i < GLINT_COUNT; i++) {
      glints.push({
        u: 0.04 + rand() * 0.92, // x ratio across canvas
        v: 0.03 + rand() * 0.42, // y ratio in upper sky
        size: 1.8 + rand() * 2.2, // size in px
        speed: 1.2 + rand() * 1.8,
        phase: rand() * Math.PI * 2,
        isNightOnly: i >= 10,
      });
    }

    // Geometry transforms
    let bounds = {
      W: 0,
      H: 0,
      s: 1,
      ox: 0,
      oy: 0,
      crtX: 0,
      crtY: 0,
      crtW: 0,
      crtH: 0,
      lightX: 0,
      lightY: 0,
      dpr: 1,
    };

    function updateDimensions() {
      const rect = heroEl.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      if (W === 0 || H === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      bounds.W = W;
      bounds.H = H;
      bounds.dpr = dpr;

      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";

      if (skyCanvas) {
        skyCanvas.width = 160;
        skyCanvas.height = 90;
      }

      // Compute cover transform (1920x1080 source, object-position: center bottom)
      const isMobile = window.innerWidth <= 760;
      let s, rw, rh, ox, oy;

      if (isMobile) {
        // Mobile layout: video is 170% width, aspect 16/9, bottom aligned
        rw = W * 1.7;
        s = rw / 1920;
        rh = 1080 * s;
        ox = (W - rw) / 2;
        oy = H - rh;
      } else {
        // Standard desktop cover transform, center bottom
        s = Math.max(W / 1920, H / 1080);
        rw = 1920 * s;
        rh = 1080 * s;
        ox = (W - rw) / 2;
        oy = H - rh;
      }

      bounds.s = s;
      bounds.ox = ox;
      bounds.oy = oy;

      // Map CRT screen rectangle (806, 505) - (1077, 724)
      bounds.crtX = ox + 806 * s;
      bounds.crtY = oy + 505 * s;
      bounds.crtW = (1077 - 806) * s;
      bounds.crtH = (724 - 505) * s;

      // Last point of light on CRT screen (945, 594)
      bounds.lightX = ox + 945 * s;
      bounds.lightY = oy + 594 * s;
    }

    window.addEventListener("resize", updateDimensions, { passive: true });
    updateDimensions();

    // Reduced motion check
    if (reduceMotion()) {
      state = "ONLINE";
      heroEl.classList.add("is-arrived");
      return;
    }

    // 1. Arrival detection (when 35% in view)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasArrived) {
            hasArrived = true;
            onArrival();
          }
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(heroEl);

    // Initial check in case already visible
    const initialRect = heroEl.getBoundingClientRect();
    if (initialRect.top < window.innerHeight && initialRect.bottom > 0) {
      setTimeout(() => {
        if (!hasArrived) {
          hasArrived = true;
          onArrival();
        }
      }, 100);
    }

    function onArrival() {
      // Entrance lift for text (10u lift, 0.9s, staggered 60ms)
      heroEl.classList.add("is-arrived");

      // The clip plays from 0.6s, shows switch-on, then pauses on colour bars at 2.3s
      state = "STARTING";
      isTransitioning = true;
      video.currentTime = 0.6;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback if autoplay was gated
          state = "ONLINE";
          isTransitioning = false;
        });
      }
    }

    // 2. Click Handler on Power Button
    powerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (isTransitioning) return; // Clicks during switch-off/on are ignored

      if (state === "ONLINE") {
        turnOffline();
      } else if (state === "OFFLINE") {
        turnOnline();
      }
    });

    function turnOffline() {
      state = "TURNING_OFF";
      isTransitioning = true;
      dotTriggeredForShutdown = false;

      // Play from 2.3s to 5.0s at 1x
      video.playbackRate = 1.0;
      video.play().catch(() => {});
      if (powerPillText) {
        powerPillText.textContent = "desligando…";
      }
    }

    function turnOnline() {
      state = "TURNING_ON";
      isTransitioning = true;
      powerBtn.setAttribute("aria-pressed", "false");
      setLit(0);

      if (powerPillText) {
        powerPillText.textContent = "iniciando…";
      }

      // Cut back to 0.6s and replay switch-on to 2.3s colour-bar idle
      video.currentTime = 0.6;
      video.playbackRate = 1.0;
      video.play().catch(() => {});
    }

    function launchGlowingDot() {
      dotActive = true;
      dotStartTime = performance.now();

      // Start: CRT center light point
      dotP0 = { x: bounds.lightX, y: bounds.lightY };

      // End: center of power-o SVG
      const oRect = powerOSVG.getBoundingClientRect();
      const heroRect = heroEl.getBoundingClientRect();
      dotP1 = {
        x: oRect.left + oRect.width / 2 - heroRect.left,
        y: oRect.top + oRect.height / 2 - heroRect.top,
      };

      // Quadratic curved path arched up and left
      dotCtrl = {
        x: dotP0.x - (dotP0.x - dotP1.x) * 0.28,
        y: Math.min(dotP0.y, dotP1.y) - 130 * Math.min(1.2, Math.max(0.7, bounds.s)),
      };
    }

    function setLit(val) {
      if (powerHalo) {
        powerHalo.style.setProperty("--lit", String(val));
      }
      powerOSVG.style.setProperty("--lit", String(val));
    }

    function animateLandingGlow() {
      // Landing: halo ring glows (--lit from 0.9 to 0 over 0.9s)
      const startT = performance.now();
      const DURATION = 900; // 0.9s
      function step(now) {
        const elapsed = now - startT;
        if (elapsed >= DURATION) {
          setLit(0);
        } else {
          const p = elapsed / DURATION;
          const val = 0.9 * Math.pow(1 - p, 1.8);
          setLit(val.toFixed(3));
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
    }

    function cubicInOut(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // 3. Main Render Loop (Scanlines, Glints, Flying Dot, Video State Machine)
    let lastTime = performance.now();

    function render(now) {
      requestAnimationFrame(render);
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const ct = video.currentTime || 0;

      // Video timeline monitoring
      if (state === "STARTING") {
        if (ct >= 2.3) {
          video.pause();
          video.currentTime = 2.3;
          state = "ONLINE";
          isTransitioning = false;
          powerBtn.setAttribute("aria-pressed", "false");
          if (powerPillText) powerPillText.textContent = "online · clique para desligar";
        }
      } else if (state === "TURNING_OFF") {
        // At clip time 4.72s, launch glowing dot
        if (!dotTriggeredForShutdown && ct >= 4.7) {
          dotTriggeredForShutdown = true;
          launchGlowingDot();
        }
        if (ct >= 4.98 || video.ended) {
          video.pause();
          video.currentTime = 5.0; // Hold on night frame
        }
      } else if (state === "TURNING_ON") {
        if (ct >= 2.3) {
          video.pause();
          video.currentTime = 2.3;
          state = "ONLINE";
          isTransitioning = false;
          powerBtn.setAttribute("aria-pressed", "false");
          if (powerPillText) powerPillText.textContent = "online · clique para desligar";
        }
      }

      // Sky sampling on mobile (≤ 760px)
      if (skyCtx && window.innerWidth <= 760 && video.readyState >= 2) {
        try {
          skyCtx.drawImage(video, 0, 0, video.videoWidth || 1920, 8, 0, 0, skyCanvas.width, skyCanvas.height);
        } catch (e) {}
      }

      // Canvas drawing
      const dpr = bounds.dpr;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // Night factor (0 = full day, 1 = deep night)
      let nightFactor = 0;
      if (state === "OFFLINE") {
        nightFactor = 1;
      } else if (state === "TURNING_OFF") {
        if (ct >= 2.7) {
          nightFactor = Math.min(1, Math.max(0, (ct - 2.7) / 1.7));
        }
      } else if (state === "TURNING_ON") {
        nightFactor = 0;
      }

      // A. Glints (Twinkling stars in the sky)
      // ~10 stars during day, growing to ~22 as sky reaches night
      const activeStarCount = Math.round(10 + 12 * nightFactor);
      for (let i = 0; i < activeStarCount; i++) {
        const g = glints[i];
        const gx = g.u * bounds.W;
        const gy = g.v * bounds.H;

        // Modulation for twinkle
        const sinVal = Math.sin(now * 0.0025 * g.speed + g.phase);
        let alpha = 0.25 + 0.75 * Math.max(0, sinVal);

        // Day stars are slightly subtler; night stars shine bright
        if (g.isNightOnly) {
          alpha *= nightFactor;
        } else {
          alpha *= 0.6 + 0.4 * nightFactor;
        }

        if (alpha > 0.02) {
          drawGlint(ctx, gx, gy, g.size * (0.8 + 0.2 * nightFactor), alpha);
        }
      }

      // B. Scanline shimmer on CRT glass (active during online/starting/pre-collapse)
      const crtIsActive =
        (state === "ONLINE" || state === "STARTING" || (state === "TURNING_OFF" && ct < 4.45)) &&
        bounds.crtW > 10;

      if (crtIsActive) {
        drawCRTScanline(ctx, now, bounds);
      }

      // C. Flying Glowing Dot Animation (leaves at 4.72s, flies 0.78s up and left into power-o)
      if (dotActive) {
        const elapsed = (now - dotStartTime) / 1000;
        const p = Math.min(1, elapsed / DOT_DURATION);
        const t = cubicInOut(p);

        // Current coordinate on quadratic bezier curve
        const curX =
          (1 - t) * (1 - t) * dotP0.x +
          2 * (1 - t) * t * dotCtrl.x +
          t * t * dotP1.x;
        const curY =
          (1 - t) * (1 - t) * dotP0.y +
          2 * (1 - t) * t * dotCtrl.y +
          t * t * dotP1.y;

        // Size: white core + 6x radial bloom halo, growing and then shrinking along the way
        const arcScale = Math.sin(p * Math.PI); // 0 -> 1 -> 0
        const coreRadius = 2.2 + 4.5 * arcScale;
        const bloomRadius = coreRadius * 6;

        drawGlowingDot(ctx, curX, curY, coreRadius, bloomRadius, arcScale);

        if (p >= 1) {
          dotActive = false;
          // Landing on power-o
          animateLandingGlow();
          state = "OFFLINE";
          isTransitioning = false;
          powerBtn.setAttribute("aria-pressed", "true");
          if (powerPillText) powerPillText.textContent = "offline · clique para ligar";
        }
      }

      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  // Draw 4-point star glint
  function drawGlint(ctx, x, y, size, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;

    ctx.beginPath();
    // Vertical ray
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(0, 0, size * 0.18, 0);
    ctx.quadraticCurveTo(0, 0, 0, size);
    ctx.quadraticCurveTo(0, 0, -size * 0.18, 0);
    ctx.quadraticCurveTo(0, 0, 0, -size);
    ctx.fill();

    // Horizontal ray
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.quadraticCurveTo(0, 0, 0, size * 0.18);
    ctx.quadraticCurveTo(0, 0, size, 0);
    ctx.quadraticCurveTo(0, 0, 0, -size * 0.18);
    ctx.quadraticCurveTo(0, 0, -size, 0);
    ctx.fill();

    // Central glow
    ctx.fillStyle = `rgba(255, 255, 255, ${(alpha * 0.4).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Draw soft white scanline band (≈52px tall, 10% white, ~1.8s sweep, faint flicker)
  function drawCRTScanline(ctx, now, bounds) {
    const s = bounds.s;
    const bandHeight = Math.max(30, 52 * s);
    const period = 1.8; // 1.8s per sweep
    const progress = ((now / 1000) % period) / period;
    const scanY = bounds.crtY - bandHeight + progress * (bounds.crtH + bandHeight * 2);

    ctx.save();
    // Clip strictly to CRT screen rectangle with subtle rounded corners
    const radius = Math.max(3, 7 * s);
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(bounds.crtX, bounds.crtY, bounds.crtW, bounds.crtH, radius);
    } else {
      ctx.rect(bounds.crtX, bounds.crtY, bounds.crtW, bounds.crtH);
    }
    ctx.clip();

    // Subtle CRT horizontal scanline grid
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    const lineStep = Math.max(2, 3 * s);
    for (let y = bounds.crtY; y < bounds.crtY + bounds.crtH; y += lineStep) {
      ctx.fillRect(bounds.crtX, y, bounds.crtW, 1);
    }

    // Sweeping soft white band (10% white with faint flicker)
    const flicker = 0.09 + 0.025 * Math.sin(now * 0.02) + (Math.random() - 0.5) * 0.015;
    const grad = ctx.createLinearGradient(0, scanY, 0, scanY + bandHeight);
    grad.addColorStop(0, "rgba(255, 255, 255, 0)");
    grad.addColorStop(0.5, `rgba(255, 255, 255, ${flicker.toFixed(3)})`);
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = grad;
    ctx.fillRect(bounds.crtX, scanY, bounds.crtW, bandHeight);

    // Subtle edge rim light on the CRT bezel
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = Math.max(1, 1.2 * s);
    ctx.stroke();

    ctx.restore();
  }

  // Draw flying glowing dot with intense white core + 6x radial bloom halo
  function drawGlowingDot(ctx, x, y, coreR, bloomR, arcScale) {
    ctx.save();

    // 6x Radial Bloom Halo
    const grad = ctx.createRadialGradient(x, y, 0, x, y, bloomR);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    grad.addColorStop(0.2, "rgba(255, 250, 230, 0.7)");
    grad.addColorStop(0.5, `rgba(255, 225, 170, ${(0.35 * arcScale).toFixed(3)})`);
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, bloomR, 0, Math.PI * 2);
    ctx.fill();

    // White intense core
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(x, y, coreR, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
})();
