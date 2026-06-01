/* ══════════════════════════════════════════════════
   PREMIUM CUSTOM CURSOR SYSTEM
══════════════════════════════════════════════════ */
const dot  = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
let isMobile = window.innerWidth <= 1024 || window.matchMedia("(pointer: coarse)").matches;

if (!isMobile) {
  document.addEventListener('mousemove', e => { 
    mx = e.clientX; 
    my = e.clientY; 
  });

  (function tick() {
    dot.style.cssText  = `left:${mx}px;top:${my}px`;
    rx += (mx - rx) * 0.10; 
    ry += (my - ry) * 0.10;
    ring.style.cssText = `left:${rx}px;top:${ry}px`;
    requestAnimationFrame(tick);
  })();
}

// Track window mutations to drop calculation weights
window.addEventListener('resize', () => {
  isMobile = window.innerWidth <= 1024 || window.matchMedia("(pointer: coarse)").matches;
});

/* ══════════════════════════════════════════════════
   DYNAMIC INTERACTIVE AMBIENT GLOW
══════════════════════════════════════════════════ */
(function() {
  const cv = document.getElementById('glow-canvas');
  const cx = cv.getContext('2d');
  let W, H;
  
  function resize() { 
    W = cv.width = window.innerWidth; 
    H = cv.height = window.innerHeight; 
  }
  resize(); 
  window.addEventListener('resize', resize);

  const blobs = Array.from({length: isMobile ? 3 : 6}, () => ({
    x: Math.random() * window.innerWidth, 
    y: Math.random() * window.innerHeight,
    r: 120 + Math.random() * 180,
    vx: (Math.random() - .5) * .18, 
    vy: (Math.random() - .5) * .18,
    a: 0.05 + Math.random() * 0.06
  }));

  let mx2 = W / 2, my2 = H / 2;
  if (!isMobile) {
    document.addEventListener('mousemove', e => { 
      mx2 = e.clientX; 
      my2 = e.clientY; 
    });
  }

  function frame() {
    cx.clearRect(0, 0, W, H);
    blobs.forEach(b => {
      const dx = b.x - mx2, dy = b.y - my2, d = Math.sqrt(dx * dx + dy * dy);
      if (!isMobile && d < 250 && d > 0) { 
        const f = (250 - d) / 250 * .25; 
        b.vx += dx / d * f; 
        b.vy += dy / d * f; 
      }
      b.vx *= .985; b.vy *= .985;
      b.x += b.vx; b.y += b.vy;
      
      if (b.x < -b.r) b.x = W + b.r; if (b.x > W + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = H + b.r; if (b.y > H + b.r) b.y = -b.r;

      const g = cx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      g.addColorStop(0,   `rgba(14,165,233,${b.a})`);
      g.addColorStop(0.5, `rgba(14,165,233,${b.a * 0.4})`);
      g.addColorStop(1,   `rgba(14,165,233,0)`);
      
      cx.beginPath(); 
      cx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      cx.fillStyle = g; 
      cx.fill();
    });
    requestAnimationFrame(frame);
  }
  frame();
})();

/* ══════════════════════════════════════════════════
   NAVIGATION SCROLL STATES
══════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});

/* ══════════════════════════════════════════════════
   GSAP HERO TIMELINE ARCHITECTURE
══════════════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger);

gsap.to('.hl-inner', {
  y: '0%', duration: 1.4, ease: 'power4.out',
  stagger: 0.18, delay: 0.25
});

gsap.to('#hero-right', {
  opacity: 1, y: 0, duration: 1.3, ease: 'power3.out', delay: 0.9
});

gsap.to('#hero-actions', {
  opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', delay: 1.2
});

/* ══════════════════════════════════════════════════
   DYNAMIC CORE CAPABILITY WORD LOOPER
══════════════════════════════════════════════════ */
const words = ['Experiences', 'Websites', 'UI/UX', 'Software', 'Apps'];
const swapEl = document.getElementById('swap-word');
let wIdx = 0, busy = false;

function nextWord() {
  if (busy) return; 
  busy = true;
  const tl = gsap.timeline({ 
    onComplete: () => { 
      wIdx = (wIdx + 1) % words.length; 
      busy = false; 
    } 
  });
  
  tl.to(swapEl, {
    duration: .55, y: '-100%', opacity: 0,
    rotateX: '-18deg', transformOrigin: 'bottom center', ease: 'power2.in'
  })
  .call(() => { 
    swapEl.textContent = words[(wIdx + 1) % words.length]; 
  })
  .fromTo(swapEl,
    { y: '75%', opacity: 0, rotateX: '15deg', transformOrigin: 'bottom center' },
    { y: '0%', opacity: 1, rotateX: '0deg', duration: .65, ease: 'power2.out' }
  );
}
setTimeout(() => { 
  nextWord(); 
  setInterval(nextWord, 3000); 
}, 2000);

/* ══════════════════════════════════════════════════
   SCROLL REVEAL TRIGGERS
══════════════════════════════════════════════════ */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { 
    if (e.isIntersecting) { 
      e.target.classList.add('visible'); 
      io.unobserve(e.target); 
    } 
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ══════════════════════════════════════════════════
   PREMIUM CONTROLLED GRID ACCORDION MODULE
══════════════════════════════════════════════════ */
function makeAccordion(listId) {
  const items = document.querySelectorAll(`#${listId} [data-acc]`);
  if (!items.length) return;

  function open(idx) {
    items.forEach((item, i) => {
      if (i === idx) {
        item.classList.add('active');
        const content = item.querySelector('.acc-body-content');
        gsap.fromTo(content,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: .8, ease: 'power2.out', delay: 0.15 }
        );
      } else {
        item.classList.remove('active');
      }
    });
  }

  items.forEach((item, i) => {
    item.querySelector('.acc-header').addEventListener('click', () => open(i));
  });

  ScrollTrigger.create({
    trigger: `#${listId}`,
    start: 'top 62%',
    onEnter: () => open(0),
  });

  items.forEach((item, i) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 58%',
      onEnter: () => open(i),
    });
  });
}
makeAccordion('services-list');

/* ══════════════════════════════════════════════════
   TESTIMONIAL SLIDER MODULE
══════════════════════════════════════════════════ */
(function() {
  const slides = document.querySelectorAll('[data-slide]');
  const dotsEl = document.getElementById('testi-dots');
  let cur = 0, timer;

  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 't-dot' + (i === 0 ? ' on' : '');
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
  });

  function goTo(idx) {
    if (idx === cur) return;
    const from = slides[cur], to = slides[idx];
    const dots = dotsEl.querySelectorAll('.t-dot');

    gsap.to(from, {
      opacity: 0, y: -20, duration: .55, ease: 'power2.in',
      onComplete: () => {
        from.classList.remove('active');
        from.style.position = 'absolute';
        to.style.position = 'relative';
        to.classList.add('active');
        
        gsap.fromTo(to,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: .7, ease: 'power2.out' }
        );
      }
    });

    dots.forEach((d, i) => d.classList.toggle('on', i === idx));
    cur = idx; 
    reset();
  }

  function reset() {
    clearInterval(timer);
    timer = setInterval(() => goTo((cur + 1) % slides.length), 6000);
  }
  reset();

  document.getElementById('testi-prev').addEventListener('click', () => goTo((cur - 1 + slides.length) % slides.length));
  document.getElementById('testi-next').addEventListener('click', () => goTo((cur + 1) % slides.length));

  ScrollTrigger.create({
    trigger: '#testimonials', 
    start: 'top 72%',
    onEnter: () => gsap.from(slides[cur], { opacity: 0, y: 22, duration: .9, ease: 'power2.out' })
  });
})();