/**
 * OUR ANNIVERSARY - JAVASCRIPT ENGINE
 * Start Date: May 3, 2024 (03/05/2024)
 * 1. Intro Screen with Car Photo & Red Overlay
 * 2. Animated Love Tree with Flying Hearts, Photo Fruits & Live Counter
 * 3. Love Letter with Typewriter & Non-Stop 3D Spinning Photo Carousel
 */

document.addEventListener('DOMContentLoaded', () => {

  const START_DATE = new Date('2024-05-03T00:00:00');

  // The 14 personal photos
  const PHOTOS = [
    { src: 'picture/photo_2026-10-29_12-00-42.jpg', title: 'Where it all began' },
    { src: 'picture/photo_2026-10-29_12-00-43 (2).jpg', title: 'Your sweetest smile' },
    { src: 'picture/photo_2026-10-29_12-00-43.jpg', title: 'Coffee & quiet talks' },
    { src: 'picture/photo_2026-10-29_12-00-46.jpg', title: 'Cutest human in the world' },
    { src: 'picture/photo_2026-10-29_12-00-47 (2).jpg', title: 'The way your eyes look' },
    { src: 'picture/photo_2026-10-29_12-00-47.jpg', title: 'Walking hand in hand' },
    { src: 'picture/photo_2026-10-29_12-00-49 (2).jpg', title: 'Warmest hugs' },
    { src: 'picture/photo_2026-10-29_12-00-49.jpg', title: 'Golden afternoon' },
    { src: 'picture/photo_2026-10-29_12-00-50 (2).jpg', title: 'Inside jokes & laughter' },
    { src: 'picture/photo_2026-10-29_12-00-50.jpg', title: 'My favorite view' },
    { src: 'picture/photo_2026-10-29_12-00-51.jpg', title: 'My forever person' },
    { src: 'picture/photo_2026-10-29_12-00-52.jpg', title: 'Road trips with you' },
    { src: 'picture/photo_2026-10-29_16-12-39.jpg', title: 'A memory I cherish' },
    { src: 'picture/photo_2026-10-29_16-12-44.jpg', title: 'Happy Anniversary, my love!' }
  ];

  /* ==========================================================================
     1. AUDIO SYSTEM (Native Web Audio Synth + Custom music.mp3 support)
     ========================================================================== */
  class RomanticAudio {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.timer = null;
      this.step = 0;

      // Custom MP3
      this.audioElem = new Audio();
      this.hasCustomAudio = false;
      this.audioElem.src = 'music.mp3';
      this.audioElem.loop = true;
      this.audioElem.addEventListener('canplaythrough', () => { this.hasCustomAudio = true; });
      this.audioElem.addEventListener('error', () => { this.hasCustomAudio = false; });

      // Lullaby / Canon in D piano chords
      this.chords = [
        [261.63, 329.63, 392.00, 523.25], // C
        [196.00, 246.94, 293.66, 392.00], // G
        [220.00, 261.63, 329.63, 440.00], // Am
        [174.61, 220.00, 261.63, 349.23]  // F
      ];
    }

    init() {
      if (!this.ctx) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) this.ctx = new AudioClass();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playNote(freq, dur = 1.4, vol = 0.08) {
      if (!this.ctx || !this.isPlaying) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + dur);
      } catch (e) {}
    }

    start() {
      this.init();
      if (this.isPlaying) return;
      this.isPlaying = true;

      if (this.hasCustomAudio) {
        this.audioElem.play().catch(() => this.startSynth());
      } else {
        this.startSynth();
      }
    }

    startSynth() {
      if (this.timer) return;
      this.timer = setInterval(() => {
        if (!this.isPlaying) return;
        const chord = this.chords[Math.floor(this.step / 4) % this.chords.length];
        const note = chord[this.step % chord.length];
        this.playNote(note, 1.8, 0.08);
        this.step++;
      }, 550);
    }

    stop() {
      this.isPlaying = false;
      if (this.audioElem) this.audioElem.pause();
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }

    toggle() {
      if (this.isPlaying) {
        this.stop();
        return false;
      } else {
        this.start();
        return true;
      }
    }

    playChime() {
      this.init();
      if (!this.ctx) return;
      [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
        setTimeout(() => this.playNote(f, 1.2, 0.1), idx * 60);
      });
    }
  }

  const audio = new RomanticAudio();

  /* ==========================================================================
     2. SCREEN 1 -> SCREEN 2 TRANSITION
     ========================================================================== */
  const screenIntro = document.getElementById('screen-intro');
  const btnStartLove = document.getElementById('btn-start-love');
  const btnMusicToggle = document.getElementById('btn-music-toggle');
  const musicIconSymbol = document.getElementById('music-icon-symbol');
  const btnFullscreen = document.getElementById('btn-fullscreen');

  function startExperience() {
    audio.playChime();
    audio.start();
    if (navigator.vibrate) navigator.vibrate([60, 80, 60]);

    screenIntro.classList.add('hidden');
    setTimeout(() => {
      screenIntro.style.display = 'none';
      startTreeAnimation();
    }, 800);
  }

  btnStartLove.addEventListener('click', startExperience);
  btnStartLove.addEventListener('touchend', (e) => {
    e.preventDefault();
    startExperience();
  });

  btnMusicToggle.addEventListener('click', () => {
    const isPlaying = audio.toggle();
    musicIconSymbol.textContent = isPlaying ? '❚❚' : '▶';
    btnMusicToggle.classList.toggle('playing', isPlaying);
  });

  btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  /* ==========================================================================
     3. LIVE DATING COUNTER (May 3, 2024 -> Today)
     ========================================================================== */
  const counterDays = document.getElementById('counter-days');
  const counterHours = document.getElementById('counter-hours');
  const counterMins = document.getElementById('counter-mins');
  const counterSecs = document.getElementById('counter-secs');

  function updateCounter() {
    const now = new Date();
    const diff = now - START_DATE;
    if (diff < 0) return;

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    counterDays.textContent = days;
    counterHours.textContent = hours;
    counterMins.textContent = minutes;
    counterSecs.textContent = seconds;
  }
  setInterval(updateCounter, 1000);
  updateCounter();

  /* ==========================================================================
     4. ANIMATED HEART TREE CANVAS ENGINE (DENSE, LUSH & FULL)
     ========================================================================== */
  const canvas = document.getElementById('tree-canvas');
  const ctx = canvas.getContext('2d');
  const fruitHint = document.getElementById('tree-fruit-hint');

  let canvasW = 0;
  let canvasH = 0;
  let treeCenterX = 0;
  let treeCenterY = 0;
  let treeScale = 1;
  let groundY = 0;

  function resizeTreeCanvas() {
    canvasW = window.innerWidth;
    canvasH = window.innerHeight;
    canvas.width = canvasW;
    canvas.height = canvasH;

    const isMobile = canvasW < 768;

    if (!isMobile) {
      // Desktop / Landscape: Tree on right, counter on left
      treeCenterX = canvasW * 0.66;
      treeCenterY = canvasH * 0.44;
      groundY = canvasH * 0.88;
      treeScale = Math.min(canvasW * 0.42, canvasH * 0.65) / 300;
    } else {
      // Mobile / Portrait: Tree centered in upper portion, generous breathing room for lower controls
      treeCenterX = canvasW * 0.5;
      treeCenterY = canvasH * 0.25;
      groundY = canvasH * 0.46;
      treeScale = Math.min(canvasW / 360, canvasH / 820) * 0.78;
    }
    document.documentElement.style.setProperty('--ground-y', `${groundY}px`);
  }
  window.addEventListener('resize', () => {
    resizeTreeCanvas();
    repositionFruits();
  });
  resizeTreeCanvas();

  // Vibrant Heart Colors matching reference screenshots
  const HEART_COLORS = [
    '#e63946', '#d90429', '#ff4d6d', '#ff758f', '#ff8fa3',
    '#ffd166', '#ffbe0b', '#f4a261', '#f77f00', '#c77dff',
    '#ff5c8a', '#ff1493', '#e76f51', '#ffb703', '#c1121f'
  ];

  // Dense, layered heart shape points generator (1,400+ points)
  function getDenseHeartPoints(count) {
    const pts = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2;
      // Parametric heart formula
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      
      // Multi-layer density distribution: mix of deep core, mid foliage, and crisp perimeter
      let r;
      const layer = Math.random();
      if (layer < 0.45) {
        // Core / deep interior (dense solid backing)
        r = Math.pow(Math.random(), 0.7) * 0.75;
      } else if (layer < 0.80) {
        // Mid foliage
        r = 0.5 + Math.random() * 0.42;
      } else {
        // Outer perimeter definition
        r = 0.9 + Math.random() * 0.14;
      }

      pts.push({
        x: hx * r * 8.6,
        y: hy * r * 8.6,
        rot: (Math.random() - 0.5) * 0.75
      });
    }
    return pts;
  }

  // Heart leaves state (1,450 leaves for rich, non-naked, lush canopy)
  const HEART_COUNT = 1450;
  let heartLeaves = [];
  let fallingPetals = [];
  let fruitsCreated = false;

  function initHeartTree() {
    const targetPoints = getDenseHeartPoints(HEART_COUNT);
    heartLeaves = targetPoints.map((target, i) => {
      return {
        targetRelX: target.x,
        targetRelY: target.y,
        rot: target.rot,
        currentX: treeCenterX + (Math.random() - 0.5) * 50,
        currentY: groundY,
        color: HEART_COLORS[i % HEART_COLORS.length],
        // Larger leaves (10px to 21px) for full overlapping coverage
        size: Math.random() * 11 + 10,
        progress: 0,
        // Perfectly balanced romantic flight (takes ~3.5-4.5s per heart)
        speed: Math.random() * 0.0035 + 0.0030,
        delay: Math.random() * 320, // soft cascading waves spread across ~5s
        hasLanded: false,
        swayOffset: Math.random() * Math.PI * 2
      };
    });

    // 25 Falling petals drifting gently
    fallingPetals = [];
    for (let i = 0; i < 25; i++) {
      fallingPetals.push({
        x: treeCenterX + (Math.random() - 0.5) * 200 * treeScale,
        y: treeCenterY + (Math.random() - 0.5) * 140 * treeScale,
        speedY: Math.random() * 0.8 + 0.4,
        sway: Math.random() * Math.PI * 2,
        size: Math.random() * 5 + 7,
        color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
        opacity: Math.random() * 0.65 + 0.35,
        rot: (Math.random() - 0.5) * 0.5
      });
    }
  }

  // Draw heart shape on canvas with rotation & scale
  function drawHeartShape(c, x, y, size, color, opacity = 1, rot = 0) {
    c.save();
    c.fillStyle = color;
    c.globalAlpha = opacity;
    c.translate(x, y);
    if (rot) c.rotate(rot);
    c.beginPath();
    const s = size * 0.52;
    c.moveTo(0, s * 0.3);
    c.bezierCurveTo(-s, -s * 0.5, -s * 1.5, s * 0.5, 0, s * 1.5);
    c.bezierCurveTo(s * 1.5, s * 0.5, s, -s * 0.5, 0, s * 0.3);
    c.fill();
    c.restore();
  }

  // Draw organic tree trunk and branches nestled inside the heart
  function drawTreeTrunk() {
    const isMobile = canvasW < 768;
    // Ground line: soft romantic gradient fade on mobile, classic grounding bar on desktop
    ctx.save();
    if (isMobile) {
      const grad = ctx.createLinearGradient(0, 0, canvasW, 0);
      grad.addColorStop(0, 'rgba(74, 40, 24, 0)');
      grad.addColorStop(0.18, 'rgba(74, 40, 24, 0.35)');
      grad.addColorStop(0.5, 'rgba(74, 40, 24, 0.65)');
      grad.addColorStop(0.82, 'rgba(74, 40, 24, 0.35)');
      grad.addColorStop(1, 'rgba(74, 40, 24, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(canvasW * 0.08, groundY);
      ctx.lineTo(canvasW * 0.92, groundY);
      ctx.stroke();
    } else {
      ctx.strokeStyle = '#4a2818';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvasW, groundY);
      ctx.stroke();
    }
    ctx.restore();

    // Main Trunk
    const trunkBaseW = 32 * treeScale;
    const trunkTopW = 18 * treeScale;
    const trunkTopY = treeCenterY + 70 * treeScale;

    ctx.fillStyle = '#6d452d';
    ctx.beginPath();
    ctx.moveTo(treeCenterX - trunkBaseW / 2, groundY);
    ctx.lineTo(treeCenterX - trunkTopW / 2, trunkTopY);
    ctx.lineTo(treeCenterX + trunkTopW / 2, trunkTopY);
    ctx.lineTo(treeCenterX + trunkBaseW / 2, groundY);
    ctx.closePath();
    ctx.fill();

    // Branches extending up into the heart
    ctx.strokeStyle = '#6d452d';
    ctx.lineCap = 'round';

    function drawBranch(startX, startY, endX, endY, width) {
      ctx.lineWidth = width * treeScale;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 4;
      const midY = (startY + endY) / 2;
      ctx.quadraticCurveTo(midX, midY, endX, endY);
      ctx.stroke();
    }

    // Main branch splits
    drawBranch(treeCenterX, trunkTopY, treeCenterX - 55 * treeScale, treeCenterY + 20 * treeScale, 8);
    drawBranch(treeCenterX - 55 * treeScale, treeCenterY + 20 * treeScale, treeCenterX - 90 * treeScale, treeCenterY - 15 * treeScale, 4.5);

    drawBranch(treeCenterX, trunkTopY, treeCenterX + 55 * treeScale, treeCenterY + 20 * treeScale, 8);
    drawBranch(treeCenterX + 55 * treeScale, treeCenterY + 20 * treeScale, treeCenterX + 90 * treeScale, treeCenterY - 15 * treeScale, 4.5);

    drawBranch(treeCenterX, trunkTopY, treeCenterX, treeCenterY - 10 * treeScale, 6.5);
    drawBranch(treeCenterX, treeCenterY - 10 * treeScale, treeCenterX - 30 * treeScale, treeCenterY - 55 * treeScale, 3.5);
    drawBranch(treeCenterX, treeCenterY - 10 * treeScale, treeCenterX + 30 * treeScale, treeCenterY - 55 * treeScale, 3.5);
  }

  // Fruit Photos elements overlay (14 photo apples)
  let fruitBadges = [];
  function createFruitBadges() {
    if (fruitsCreated) return;
    fruitsCreated = true;

    // 14 Balanced positions nestled in the lush heart canopy
    const fruitPositions = [
      { x: -75, y: -45 },
      { x: 75, y: -45 },
      { x: -45, y: 30 },
      { x: 45, y: 30 },
      { x: -95, y: 10 },
      { x: 95, y: 10 },
      { x: 0, y: -75 },
      { x: -35, y: -85 },
      { x: 35, y: -85 },
      { x: -65, y: 75 },
      { x: 65, y: 75 },
      { x: 0, y: 55 },
      { x: -105, y: 60 },
      { x: 105, y: 60 }
    ];

    let overlay = document.getElementById('tree-fruits-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'tree-fruits-overlay';
      overlay.className = 'tree-fruits-overlay';
      document.getElementById('screen-tree').appendChild(overlay);
    }
    overlay.innerHTML = '';
    fruitBadges = [];

    PHOTOS.forEach((photo, idx) => {
      const pos = fruitPositions[idx % fruitPositions.length];
      const badge = document.createElement('div');
      badge.className = 'tree-fruit-badge';
      badge.dataset.relX = pos.x;
      badge.dataset.relY = pos.y;
      badge.dataset.index = idx;

      badge.innerHTML = `
        <span class="fruit-inner-img">
          <img src="${photo.src}" alt="${photo.title}">
        </span>
      `;

      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        openZoomModal(idx);
      });

      overlay.appendChild(badge);
      fruitBadges.push(badge);

      // Staggered bloom animation
      setTimeout(() => {
        badge.classList.add('bloomed');
      }, idx * 110 + 300);
    });

    repositionFruits();
    fruitHint.classList.add('show');
    setTimeout(() => fruitHint.classList.remove('show'), 5000);
  }

  function repositionFruits() {
    fruitBadges.forEach(badge => {
      const relX = parseFloat(badge.dataset.relX) * treeScale;
      const relY = parseFloat(badge.dataset.relY) * treeScale;
      badge.style.left = `${treeCenterX + relX}px`;
      badge.style.top = `${treeCenterY + relY}px`;
    });
  }

  let treeAnimId = null;
  let frameCount = 0;
  let lastFrameTime = performance.now();

  function startTreeAnimation() {
    initHeartTree();
    let landedCount = 0;
    lastFrameTime = performance.now();
    frameCount = 0;

    function renderTree(nowTime) {
      ctx.clearRect(0, 0, canvasW, canvasH);
      drawTreeTrunk();

      const currentTime = nowTime || performance.now();
      const dt = Math.min((currentTime - lastFrameTime) / 1000, 0.1);
      lastFrameTime = currentTime;
      // Normalize to 60fps standard speed across 60Hz, 90Hz, 120Hz screens
      const frameDelta = dt * 60;
      frameCount += frameDelta;

      // Update and draw flying heart leaves
      heartLeaves.forEach(leaf => {
        if (frameCount < leaf.delay) return;

        const targetX = treeCenterX + leaf.targetRelX * treeScale;
        const targetY = treeCenterY + leaf.targetRelY * treeScale;

        if (!leaf.hasLanded) {
          leaf.progress += leaf.speed * frameDelta;
          if (leaf.progress >= 1) {
            leaf.progress = 1;
            leaf.hasLanded = true;
            landedCount++;
          }
          // Soft ease-out for gentle floating ascent and soft landing
          const p = leaf.progress;
          const easedP = p * (2 - p);
          const curveX = (leaf.currentX + targetX) / 2 + Math.sin(leaf.swayOffset + p * 4) * 30;
          const currentX = (1 - easedP) * (1 - easedP) * leaf.currentX + 2 * (1 - easedP) * easedP * curveX + easedP * easedP * targetX;
          const currentY = (1 - easedP) * (1 - easedP) * groundY + 2 * (1 - easedP) * easedP * (targetY - 35) + easedP * easedP * targetY;
          drawHeartShape(ctx, currentX, currentY, leaf.size * treeScale, leaf.color, 0.95, leaf.rot);
        } else {
          // Subtle organic breathing sway
          const swayY = Math.sin(frameCount * 0.03 + leaf.swayOffset) * 1.2;
          drawHeartShape(ctx, targetX, targetY + swayY, leaf.size * treeScale, leaf.color, 0.98, leaf.rot);
        }
      });

      // Update and draw falling petals
      fallingPetals.forEach(petal => {
        petal.y += petal.speedY * frameDelta * 0.6;
        petal.sway += 0.02 * frameDelta;
        petal.x += Math.sin(petal.sway) * 0.6;

        if (petal.y > groundY) {
          petal.y = treeCenterY - 50 * treeScale + Math.random() * 50;
          petal.x = treeCenterX + (Math.random() - 0.5) * 190 * treeScale;
        }
        drawHeartShape(ctx, petal.x, petal.y, petal.size * treeScale, petal.color, petal.opacity, petal.rot);
      });

      // Once ~45% of leaves have settled, bloom the fruit photos!
      if (landedCount > HEART_COUNT * 0.45 && !fruitsCreated) {
        createFruitBadges();
      }

      treeAnimId = requestAnimationFrame(renderTree);
    }

    treeAnimId = requestAnimationFrame(renderTree);
  }

  /* ==========================================================================
     5. SCREEN 3: LOVE LETTER & 3D CONTINUOUS SPINNING PHOTO CAROUSEL
     ========================================================================== */
  const modalLetter = document.getElementById('modal-letter');
  const btnOpenLetter = document.getElementById('btn-open-letter');
  const btnContinueToLetter = document.getElementById('btn-continue-to-letter');
  const btnCloseLetter = document.getElementById('btn-close-letter');
  const letterBackdrop = document.getElementById('letter-backdrop');
  const typewriterContent = document.getElementById('typewriter-content');
  const btnReplayTypewriter = document.getElementById('btn-replay-typewriter');
  const carouselCylinder = document.getElementById('carousel-cylinder');
  const carouselStage = document.getElementById('carousel-3d-stage');

  const LETTER_TEXT = `Hi, my love...

I know we had a fight, and even though we're far away from each other these past few days, there hasn't been a single second where you weren't in my heart. I miss you and I love you so much.

For nearly 3 years now, since May 3, 2024, being by your side has been the greatest part of my life. I hope you still love me, and I pray that we can continue moving forward together, just like we always have.

I know I've made mistakes, and I am truly, deeply sorry. I am willing to do anything to make up for them, to change, and to become the person you deserve.

More than anything in this world, I just want you to be happy. I respect your feelings and your decisions completely. If you need time, I will wait for you—as long as it takes—because my love for you will never fade.

Even while we're apart, please take good care of yourself. Eat well, don't skip meals, and please sleep earlier, okay?

Happy Anniversary, my sweetheart.
Yours forever, with all my love. ❤️`;

  const letterCardContainer = document.querySelector('.letter-card-container');
  let userManuallyScrolled = false;

  if (letterCardContainer) {
    letterCardContainer.addEventListener('wheel', () => { userManuallyScrolled = true; }, { passive: true });
    letterCardContainer.addEventListener('touchmove', () => { userManuallyScrolled = true; }, { passive: true });
  }

  let typeTimer = null;
  function startTypewriter() {
    if (typeTimer) clearInterval(typeTimer);
    userManuallyScrolled = false;
    typewriterContent.textContent = '';
    let charIdx = 0;

    if (modalLetter) modalLetter.scrollTop = 0;
    if (letterCardContainer) letterCardContainer.scrollTop = 0;

    typeTimer = setInterval(() => {
      if (charIdx < LETTER_TEXT.length) {
        typewriterContent.textContent += LETTER_TEXT.charAt(charIdx);
        charIdx++;

        // Keep anchored to top so opening lines ("Hi, my love...") are never scrolled off
        if (!userManuallyScrolled) {
          if (modalLetter) modalLetter.scrollTop = 0;
          if (letterCardContainer) letterCardContainer.scrollTop = 0;
        }
      } else {
        clearInterval(typeTimer);
        typeTimer = null;
      }
    }, 24);
  }

  // Tap paper to instantly reveal entire letter
  const letterPaperSheet = document.querySelector('.letter-paper-sheet');
  if (letterPaperSheet) {
    letterPaperSheet.addEventListener('click', () => {
      if (typeTimer) {
        clearInterval(typeTimer);
        typeTimer = null;
        typewriterContent.textContent = LETTER_TEXT;
      }
    });
  }

  // 3D Cylinder Continuous Spinning + Mobile Touch Drag State
  let cylinderAngle = 0;
  let isDragging = false;
  let dragStartX = 0;
  let autoSpinSpeed = 0.12; // smoothly gliding romantic rotation
  let carouselItems = [];
  let carouselRadius = 290;

  // Ensure strictly 3 to 4 photos visible at a time with CLEAR GAPS and ZERO OVERLAP
  function updateCardVisibility() {
    if (!carouselItems.length) return;
    const total = PHOTOS.length;
    const angleStep = 360 / total; // ~25.71 deg
    // Cutoff angle at 44 deg guarantees:
    // - Exactly 3 cards when one is centered (0 deg, -25.7 deg, +25.7 deg) with ~20px gap
    // - Exactly 4 cards when rotating between two cards (+/-12.8 deg, +/-38.5 deg) with ~18px gap
    // - Zero overlap between any cards at any time
    const cutoffAngle = 44;
    const fadeStartAngle = 28;

    carouselItems.forEach((card, idx) => {
      const baseAngle = idx * angleStep;
      const currentAngle = baseAngle + cylinderAngle;
      // Normalize angle to [-180, 180] relative to front-facing camera
      const relAngle = ((currentAngle % 360) + 540) % 360 - 180;
      const absAngle = Math.abs(relAngle);

      if (absAngle > cutoffAngle) {
        card.style.opacity = '0';
        card.style.visibility = 'hidden';
        card.style.pointerEvents = 'none';
      } else {
        card.style.visibility = 'visible';
        // Only capture pointer events when the letter modal is active
        const isModalActive = modalLetter && modalLetter.classList.contains('active');
        card.style.pointerEvents = isModalActive ? 'auto' : 'none';
        let opacity = 1;
        if (absAngle > fadeStartAngle) {
          opacity = 1 - (absAngle - fadeStartAngle) / (cutoffAngle - fadeStartAngle);
        }
        card.style.opacity = opacity.toFixed(3);
        // Subtle depth shading: front card is bright, side cards are gently shaded
        const brightness = 1 - (absAngle / cutoffAngle) * 0.12;
        card.style.filter = `brightness(${brightness.toFixed(2)})`;
      }
    });
  }

  // Populate 3D Spinning Photo Cylinder
  function init3DCarousel() {
    carouselCylinder.innerHTML = '';
    carouselItems = [];
    const total = PHOTOS.length;
    const isMobile = window.innerWidth < 768;
    // Radius of 190 on mobile brings cards closer together with a clean 14px-18px gap (zero overlap)
    carouselRadius = isMobile ? 190 : 260;

    PHOTOS.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className = 'carousel-photo-card';
      card.style.setProperty('--index', idx);
      card.style.setProperty('--total', total);
      card.style.setProperty('--radius', `${carouselRadius}px`);

      card.innerHTML = `<img src="${photo.src}" alt="${photo.title}" loading="lazy">`;

      card.addEventListener('click', (e) => {
        e.stopPropagation();
        openZoomModal(idx);
      });

      carouselCylinder.appendChild(card);
      carouselItems.push(card);
    });
    updateCardVisibility();
  }

  init3DCarousel();
  window.addEventListener('resize', init3DCarousel);

  function spinLoop() {
    if (!isDragging) {
      cylinderAngle += autoSpinSpeed;
    }
    carouselCylinder.style.transform = `rotateY(${cylinderAngle}deg)`;
    updateCardVisibility();
    requestAnimationFrame(spinLoop);
  }
  spinLoop();

  // Touch drag for phone & mouse drag
  function onDragStart(x) {
    if (!modalLetter || !modalLetter.classList.contains('active')) return;
    isDragging = true;
    dragStartX = x;
  }
  function onDragMove(x) {
    if (!isDragging) return;
    const deltaX = x - dragStartX;
    cylinderAngle += deltaX * 0.35;
    dragStartX = x;
  }
  function onDragEnd() {
    isDragging = false;
  }

  carouselStage.addEventListener('touchstart', (e) => onDragStart(e.touches[0].clientX), { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches[0]) onDragMove(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('touchend', onDragEnd);

  carouselStage.addEventListener('mousedown', (e) => onDragStart(e.clientX));
  window.addEventListener('mousemove', (e) => {
    if (isDragging) onDragMove(e.clientX);
  });
  window.addEventListener('mouseup', onDragEnd);

  // Open Letter Modal
  function openLetterModal() {
    audio.playChime();
    if (navigator.vibrate) navigator.vibrate(50);
    modalLetter.classList.add('active');
    userManuallyScrolled = false;
    if (modalLetter) modalLetter.scrollTop = 0;
    if (letterCardContainer) letterCardContainer.scrollTop = 0;
    updateCardVisibility();
    startTypewriter();
  }

  function closeLetterModal() {
    modalLetter.classList.remove('active');
    updateCardVisibility();
  }

  function handleOpenLetter(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    openLetterModal();
  }

  btnOpenLetter.addEventListener('click', handleOpenLetter);
  btnOpenLetter.addEventListener('touchend', handleOpenLetter);

  btnContinueToLetter.addEventListener('click', handleOpenLetter);
  btnContinueToLetter.addEventListener('touchend', handleOpenLetter);

  btnCloseLetter.addEventListener('click', closeLetterModal);
  btnCloseLetter.addEventListener('touchend', (e) => { e.preventDefault(); closeLetterModal(); });
  letterBackdrop.addEventListener('click', closeLetterModal);
  btnReplayTypewriter.addEventListener('click', startTypewriter);

  /* ==========================================================================
     6. PHOTO ZOOM LIGHTBOX MODAL
     ========================================================================== */
  const photoZoomModal = document.getElementById('photo-zoom-modal');
  const zoomBackdrop = document.getElementById('zoom-backdrop');
  const btnZoomClose = document.getElementById('btn-zoom-close');
  const zoomImg = document.getElementById('zoom-img');
  const zoomCaption = document.getElementById('zoom-caption');

  function openZoomModal(index) {
    const photo = PHOTOS[index];
    zoomImg.src = photo.src;
    zoomCaption.textContent = photo.title;
    photoZoomModal.classList.add('active');
    audio.playChime();
    if (navigator.vibrate) navigator.vibrate(30);
  }

  function closeZoomModal() {
    photoZoomModal.classList.remove('active');
  }

  btnZoomClose.addEventListener('click', closeZoomModal);
  zoomBackdrop.addEventListener('click', closeZoomModal);

});
