/* =========================================================
   MAIN JS – Modern Science College, Jogapur Pratapgarh
   ========================================================= */

/* ── HAMBURGER TOGGLE — global function for inline onclick ── */
function toggleNav() {
  var btn = document.querySelector('.hamburger');
  var links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  btn.classList.toggle('open');
  links.classList.toggle('open');
}

/* ── HAMBURGER TOGGLE (DOMContentLoaded — shared) ── */
(function () {
  var btn = document.querySelector('.hamburger');
  var links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', function () {
    btn.classList.toggle('open');
    links.classList.toggle('open');
  });
  // Close mobile menu on link click
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      btn.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();


/* =========================================================
   LOADER — BIRD-ORBIT VARIANT
   Used by: index.html, courses.html, gallery.html
   ========================================================= */
function initBirdOrbitLoader() {
  var TOTAL_DURATION = 3000;
  var BIRD_ORBIT_RADIUS = 125;
  var BIRD_ORBIT_SPEED = 2200;
  var CENTER_X = 190;
  var CENTER_Y = 190;

  var birdOrbit = document.getElementById('bird-orbit');
  var bird = document.getElementById('bird');
  var progressBar = document.getElementById('progress-bar');
  var loaderWrapper = document.getElementById('loader-wrapper');
  var loaderTagline = document.getElementById('loader-tagline');
  var overlay = document.getElementById('loader-overlay');
  var trailCanvas = document.getElementById('trail-canvas');
  var trailCtx = trailCanvas.getContext('2d');
  var particleCanvas = document.getElementById('particle-canvas');
  var particleCtx = particleCanvas.getContext('2d');

  var startTime = Date.now();
  var animating = true;
  var birdAngle = 0;
  var trail = [];
  var particles = [];
  var orbitDots = [];
  var NUM_ORBIT_DOTS = 8;

  for (var d = 0; d < NUM_ORBIT_DOTS; d++) {
    orbitDots.push({
      angle: (Math.PI * 2 / NUM_ORBIT_DOTS) * d,
      speed: 0.004 + Math.random() * 0.003,
      radius: BIRD_ORBIT_RADIUS + (Math.random() - 0.5) * 20,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.4 + 0.2
    });
  }

  function resizeCanvases() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }
  resizeCanvases();
  window.addEventListener('resize', resizeCanvases);

  function addTrailParticle(x, y) {
    trail.push({ x: x, y: y, radius: Math.random() * 3 + 1.5, opacity: 0.8, decay: Math.random() * 0.015 + 0.01 });
    if (trail.length > 60) trail.shift();
  }

  function drawTrail() {
    trailCtx.clearRect(0, 0, 380, 380);
    for (var i = trail.length - 1; i >= 0; i--) {
      var p = trail[i];
      p.opacity -= p.decay;
      p.radius *= 0.97;
      if (p.opacity <= 0) { trail.splice(i, 1); continue; }
      var g = trailCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
      g.addColorStop(0, 'rgba(30,144,255,' + (p.opacity * 0.9) + ')');
      g.addColorStop(0.4, 'rgba(0,184,148,' + (p.opacity * 0.5) + ')');
      g.addColorStop(1, 'rgba(116,185,255,0)');
      trailCtx.beginPath();
      trailCtx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
      trailCtx.fillStyle = g;
      trailCtx.fill();
    }
  }

  function spawnBurstParticles(cx, cy, count) {
    for (var i = 0; i < count; i++) {
      var a = Math.random() * Math.PI * 2, s = Math.random() * 4 + 1.5;
      particles.push({
        x: cx + (Math.random() - 0.5) * 60, y: cy + (Math.random() - 0.5) * 60,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1.5,
        radius: Math.random() * 3 + 1, opacity: 1, decay: Math.random() * 0.012 + 0.006,
        gravity: 0.02 + Math.random() * 0.03, white: Math.random() > 0.3
      });
    }
  }

  function spawnFlyingUpParticles(cx, cy, count) {
    for (var i = 0; i < count; i++) {
      var a = -Math.PI / 2 + (Math.random() - 0.5) * 1.2, s = Math.random() * 3 + 1;
      particles.push({
        x: cx + (Math.random() - 0.5) * 40, y: cy,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s,
        radius: Math.random() * 2.5 + 0.8, opacity: 1, decay: Math.random() * 0.01 + 0.005,
        gravity: -0.01, white: true
      });
    }
  }

  function updateParticles() {
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx; p.y += p.vy;
      p.vy += p.gravity; p.vx *= 0.99;
      p.opacity -= p.decay;
      if (p.opacity <= 0) { particles.splice(i, 1); continue; }
      var r = p.radius, g = particleCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.5);
      if (p.white) {
        g.addColorStop(0, 'rgba(255,255,255,' + p.opacity + ')');
        g.addColorStop(0.5, 'rgba(200,230,255,' + (p.opacity * 0.5) + ')');
        g.addColorStop(1, 'rgba(255,255,255,0)');
      } else {
        g.addColorStop(0, 'rgba(30,144,255,' + p.opacity + ')');
        g.addColorStop(0.5, 'rgba(0,184,148,' + (p.opacity * 0.4) + ')');
        g.addColorStop(1, 'rgba(30,144,255,0)');
      }
      particleCtx.beginPath();
      particleCtx.arc(p.x, p.y, r * 2.5, 0, Math.PI * 2);
      particleCtx.fillStyle = g;
      particleCtx.fill();
    }
  }

  var exitStarted = false, exitStartTime = 0;

  function animate() {
    if (!animating) return;
    var elapsed = Date.now() - startTime;
    var progress = Math.min(elapsed / TOTAL_DURATION, 1);
    if (progressBar) progressBar.style.width = (progress * 100) + '%';

    if (progress < 0.9) {
      birdAngle += (16 / BIRD_ORBIT_SPEED) * Math.PI * 2;
      var bx = Math.cos(birdAngle) * BIRD_ORBIT_RADIUS;
      var by = Math.sin(birdAngle) * BIRD_ORBIT_RADIUS;
      bird.style.transform = 'translate(' + bx + 'px,' + by + 'px) rotate(' + (birdAngle + Math.PI / 2) + 'rad)';
      bird.style.opacity = '1';
      addTrailParticle(CENTER_X + bx, CENTER_Y + by);
    }

    drawTrail();
    for (var d = 0; d < orbitDots.length; d++) {
      orbitDots[d].angle += orbitDots[d].speed;
      var odx = CENTER_X + Math.cos(orbitDots[d].angle) * orbitDots[d].radius;
      var ody = CENTER_Y + Math.sin(orbitDots[d].angle) * orbitDots[d].radius;
      trailCtx.beginPath();
      trailCtx.arc(odx, ody, orbitDots[d].size, 0, Math.PI * 2);
      trailCtx.fillStyle = 'rgba(30,144,255,' + orbitDots[d].opacity + ')';
      trailCtx.fill();
    }
    updateParticles();

    if (progress >= 1 && !exitStarted) {
      exitStarted = true;
      exitStartTime = Date.now();
      if (birdOrbit) {
        birdOrbit.style.transition = 'opacity 0.3s';
        birdOrbit.style.opacity = '0';
      }
      var rect = bird.getBoundingClientRect();
      spawnFlyingUpParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
      spawnBurstParticles(CENTER_X, CENTER_Y, 60);
      bird.style.transition = 'all 1.2s cubic-bezier(0.25,0.46,0.45,0.94)';
      bird.style.transform = 'translate(0px,-200px) rotate(-20deg)';
      bird.style.opacity = '0';
    }

    if (exitStarted) {
      var ep = (Date.now() - exitStartTime) / 1200;
      if (ep < 1) {
        var e = 1 - Math.pow(1 - ep, 3);
        if (loaderWrapper) {
          loaderWrapper.style.transition = 'none';
          loaderWrapper.style.transform = 'scale(' + (1 - e * 0.4) + ')';
          loaderWrapper.style.opacity = 1 - e;
          loaderWrapper.style.filter = 'blur(' + (e * 12) + 'px)';
        }
      } else {
        if (loaderWrapper) {
          loaderWrapper.style.opacity = '0';
          loaderWrapper.style.transform = 'scale(0.6)';
          loaderWrapper.style.filter = 'blur(12px)';
        }
      }
      if (loaderTagline) loaderTagline.style.opacity = Math.max(0, 1 - ep * 2);
    }

    if (exitStarted && (Date.now() - exitStartTime) > 1500) {
      finishLoading();
      return;
    }
    requestAnimationFrame(animate);
  }

  function finishLoading() {
    animating = false;
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    overlay.classList.add('hidden');
    setTimeout(function () { overlay.style.display = 'none'; }, 800);
  }

  requestAnimationFrame(animate);
}


/* =========================================================
   LOADER — ORBIT-RING VARIANT
   Used by: about.html, contact.html, fees.html
   ========================================================= */
function initOrbitRingLoader() {
  var TOTAL_DURATION = 3000;
  var canvas = document.getElementById('trail-canvas');
  var ctx = canvas.getContext('2d');
  var particleCanvas = document.getElementById('particle-canvas');
  var pCtx = particleCanvas.getContext('2d');
  var loader = document.getElementById('loader-overlay');
  var bird = document.getElementById('bird');
  var progressBar = document.getElementById('progress-bar');
  var startTime = Date.now();
  var trailPoints = [];
  var particles = [];
  var finished = false;

  function resizeCanvas() {
    var w = loader.offsetWidth, h = loader.offsetHeight;
    particleCanvas.width = w;
    particleCanvas.height = h;
    var wrapper = document.querySelector('.loader-wrapper-orbit') || document.querySelector('.loader-wrapper');
    if (wrapper) {
      var rect = wrapper.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function getCenter() {
    var wrapper = document.querySelector('.loader-wrapper-orbit') || document.querySelector('.loader-wrapper');
    var rect = wrapper.getBoundingClientRect();
    return { x: rect.width / 2, y: rect.height / 2 };
  }

  function getBirdPos(elapsed) {
    var c = getCenter();
    var radius = Math.min(c.x, c.y) - 18;
    var angle = (elapsed / 2200) * Math.PI * 2;
    return { x: c.x + Math.cos(angle) * radius, y: c.y + Math.sin(angle) * radius };
  }

  function spawnTrail(x, y) {
    trailPoints.push({ x: x, y: y, life: 1, decay: 0.028 });
    if (trailPoints.length > 60) trailPoints.shift();
  }

  function spawnParticles(x, y, count) {
    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = 1 + Math.random() * 3.5;
      particles.push({
        x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1.5,
        life: 1, decay: 0.012 + Math.random() * 0.025,
        size: 1 + Math.random() * 3, isExit: false,
        r: Math.random() < 0.5 ? 30 : 0, g: Math.random() < 0.5 ? 144 : 212, b: Math.random() < 0.5 ? 255 : 255
      });
    }
  }

  function spawnExitParticles() {
    var c = getCenter();
    for (var i = 0; i < 80; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = 0.5 + Math.random() * 2;
      particles.push({
        x: c.x + (Math.random() - 0.5) * 160, y: c.y + (Math.random() - 0.5) * 160,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2.5,
        life: 1, decay: 0.006 + Math.random() * 0.015,
        size: 1.5 + Math.random() * 4, isExit: true
      });
    }
  }

  function updateAndDrawTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = trailPoints.length - 1; i >= 0; i--) {
      var p = trailPoints[i];
      p.life -= p.decay;
      if (p.life <= 0) { trailPoints.splice(i, 1); continue; }
      var alpha = p.life * 0.9;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.life * 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,200,255,' + alpha + ')';
      ctx.shadowBlur = 15 * p.life;
      ctx.shadowColor = 'rgba(0,200,255,' + alpha + ')';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    if (trailPoints.length > 1) {
      ctx.beginPath();
      ctx.moveTo(trailPoints[0].x, trailPoints[0].y);
      for (var j = 1; j < trailPoints.length; j++) {
        var cp = trailPoints[j]; ctx.lineTo(cp.x, cp.y);
      }
      ctx.strokeStyle = 'rgba(0,180,255,0.35)';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(0,180,255,0.5)';
      ctx.stroke(); ctx.shadowBlur = 0;
    }
  }

  function updateAndDrawParticles() {
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    var offset = getBirdWorldOffset();
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (!p.isExit) p.vy += 0.03; else p.vy -= 0.02;
      p.life -= p.decay;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      var a = p.life;
      pCtx.beginPath();
      pCtx.arc(p.x + offset.x, p.y + offset.y, p.size, 0, Math.PI * 2);
      pCtx.fillStyle = 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',' + a + ')';
      pCtx.shadowBlur = 10 * p.life;
      pCtx.shadowColor = 'rgba(200,230,255,' + a * 0.8 + ')';
      pCtx.fill(); pCtx.shadowBlur = 0;
    }
  }

  function getBirdWorldOffset() {
    var wRect = loader.getBoundingClientRect();
    var bRect = bird.getBoundingClientRect();
    return { x: bRect.left - wRect.left + 13, y: bRect.top - wRect.top + 13 };
  }

  function animate() {
    if (finished) {
      updateAndDrawParticles();
      if (particles.length > 0) requestAnimationFrame(animate);
      return;
    }
    var elapsed = Date.now() - startTime;
    var progress = Math.min(elapsed / TOTAL_DURATION, 1);
    if (progressBar) progressBar.style.width = (progress * 100) + '%';

    if (progress < 1) {
      var bp = getBirdPos(elapsed);
      var bRect = bird.getBoundingClientRect();
      bird.style.position = 'absolute';
      bird.style.left = (bp.x - bRect.width / 2) + 'px';
      bird.style.top = (bp.y - bRect.height / 2) + 'px';
      spawnTrail(bp.x, bp.y);
      if (Math.random() < 0.35) spawnParticles(bp.x, bp.y, 1);
      updateAndDrawTrail();
      updateAndDrawParticles();
      requestAnimationFrame(animate);
    } else {
      finishLoading();
    }
  }

  function finishLoading() {
    finished = true;
    loader.classList.add('finished');
    bird.classList.add('exit');
    spawnExitParticles();
    document.querySelectorAll('.orbit-ring').forEach(function (r) { r.style.animationPlayState = 'paused'; });
    updateAndDrawParticles();
    requestAnimationFrame(function loop() {
      updateAndDrawParticles();
      if (particles.length > 0) requestAnimationFrame(loop);
    });
    setTimeout(function () {
      loader.classList.add('hidden');
      setTimeout(function () { loader.style.display = 'none'; }, 800);
    }, 1000);
  }

  requestAnimationFrame(animate);
}


/* =========================================================
   CONTACT FORM — submitEnquiry (WhatsApp)
   Used by: contact.html
   ========================================================= */
function submitEnquiry(e) {
  e.preventDefault();
  var name = document.getElementById('studentName').value.trim();
  var father = document.getElementById('fatherName').value.trim();
  var mobile = document.getElementById('mobile').value.trim();
  var course = document.getElementById('course').value;
  var msg = document.getElementById('message').value.trim();

  var text = '\ud83d\udccb *New Admission Enquiry*%0A%0A';
  text += '\ud83d\udc64 Student Name: ' + encodeURIComponent(name) + '%0A';
  text += '\ud83d\udc68 Father\'s Name: ' + encodeURIComponent(father) + '%0A';
  text += '\ud83d\udcf1 Mobile: ' + encodeURIComponent(mobile) + '%0A';
  text += '\ud83d\udcda Course: ' + encodeURIComponent(course) + '%0A';
  if (msg) text += '\ud83d\udcac Message: ' + encodeURIComponent(msg) + '%0A';
  text += '%0A_Submitted from Modern Science College website_';

  var phone = '919450185536';
  window.open('https://wa.me/' + phone + '?text=' + text, '_blank');
  return false;
}


/* =========================================================
   LIGHTBOX — gallery navigation (index.html achievement cards)
   ========================================================= */
function openLightbox(card) {
  var imgs = [];
  var cards = document.querySelectorAll('.ach-card');
  cards.forEach(function (c) { imgs.push(c.querySelector('img').getAttribute('data-full')); });

  var idx = 0;
  cards.forEach(function (c, i) { if (c === card) idx = i; });

  var overlay = document.getElementById('lightbox-overlay');
  var img = overlay.querySelector('img');
  var counter = document.getElementById('lightbox-counter');
  img.src = imgs[idx];
  if (counter) counter.textContent = (idx + 1) + ' / ' + imgs.length;
  overlay.classList.add('active');
}

function closeLightbox() { document.getElementById('lightbox-overlay').classList.remove('active'); }
function navLightbox(dir) {
  var imgs = []; document.querySelectorAll('.ach-card').forEach(function (c) { imgs.push(c.querySelector('img').getAttribute('data-full')); });
  var overlay = document.getElementById('lightbox-overlay');
  var img = overlay.querySelector('img');
  var counter = document.getElementById('lightbox-counter');
  var cur = imgs.indexOf(img.src);
  var next = (cur + dir + imgs.length) % imgs.length;
  img.src = imgs[next];
  if (counter) counter.textContent = (next + 1) + ' / ' + imgs.length;
}


/* =========================================================
   BOOT — run on every page
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
  // Hamburger toggle
  (function () {
    var btn = document.querySelector('.hamburger');
    var links = document.querySelector('.nav-links');
    if (!btn || !links) return;
    btn.addEventListener('click', function () {
      btn.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        btn.classList.remove('open');
        links.classList.remove('open');
      });
    });
  })();

  // Loader variant detection
  if (document.getElementById('loader-overlay')) {
    if (document.getElementById('bird-orbit')) {
      initBirdOrbitLoader();
    } else {
      initOrbitRingLoader();
    }
  }
});
