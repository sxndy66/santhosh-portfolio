/* ============================================================
   SANTHOSH VELU — Portfolio JS 2026
   Web3Forms + Loader + 3D + Cursor + Theme + Animations
   ============================================================ */
'use strict';

const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* LOADING SCREEN */
document.body.classList.add('no-scroll');

(function initLoader() {
  const loader = $('loader');
  const fill = $('loaderFill');
  const pctEl = $('loaderPct');

  if (!loader || !fill || !pctEl) {
    document.body.classList.remove('no-scroll');
    return;
  }

  let pct = 0;

  const interval = setInterval(() => {
    pct += Math.random() * 8 + 4;

    if (pct >= 100) {
      pct = 100;
      clearInterval(interval);
    }

    fill.style.width = pct + '%';
    pctEl.textContent = Math.floor(pct) + '%';

    if (pct === 100) {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        initTypedText();
        initCounters();
      }, 400);
    }
  }, 60);
})();

/* THREE JS */
(function initThreeJS() {
  const canvas = $('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5;

  const mat = new THREE.MeshStandardMaterial({
    color: 0x2563EB,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });

  const objects = [];

  const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), mat);
  sphere.position.set(3.5, 0.5, 0);
  scene.add(sphere);
  objects.push({ mesh: sphere, rx: 0.003, ry: 0.005 });

  const cube = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), mat.clone());
  cube.material.opacity = 0.14;
  cube.position.set(-3.5, 1, -1);
  scene.add(cube);
  objects.push({ mesh: cube, rx: 0.006, ry: 0.004 });

  const torus = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.08, 12, 36), mat.clone());
  torus.material.opacity = 0.12;
  torus.position.set(2.5, -1.5, -0.5);
  scene.add(torus);
  objects.push({ mesh: torus, rx: 0.008, ry: 0.003 });

  const tetra = new THREE.Mesh(new THREE.TetrahedronGeometry(0.5, 0), mat.clone());
  tetra.material.opacity = 0.15;
  tetra.position.set(-2.2, -1.2, 0.5);
  scene.add(tetra);
  objects.push({ mesh: tetra, rx: 0.004, ry: 0.007 });

  scene.add(new THREE.AmbientLight(0x60A5FA, 0.6));
  scene.add(new THREE.DirectionalLight(0x2563EB, 1.2));

  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  objects.forEach((o, i) => {
    o.baseY = o.mesh.position.y;
    o.floatOff = i * 1.2;
  });

  function animate() {
    requestAnimationFrame(animate);
    const t = performance.now() * 0.001;

    objects.forEach(o => {
      o.mesh.rotation.x += o.rx;
      o.mesh.rotation.y += o.ry;
      o.mesh.position.y = o.baseY + Math.sin(t + o.floatOff) * 0.15;
    });

    camera.position.x += (mouseX - camera.position.x) * 0.03;
    camera.position.y += (-mouseY - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

/* TYPED TEXT */
function initTypedText() {
  const el = $('typedText');
  if (!el) return;

  const roles = [
    'AI & Data Science Student',
    'Python Developer',
    'Web Developer',
    'Building Intelligent Solutions'
  ];

  let ri = 0;
  let ci = 0;
  let deleting = false;

  function type() {
    const cur = roles[ri];

    el.textContent = deleting
      ? cur.slice(0, ci - 1)
      : cur.slice(0, ci + 1);

    deleting ? ci-- : ci++;

    let delay = deleting ? 55 : 95;

    if (!deleting && ci === cur.length) {
      delay = 1800;
      deleting = true;
    } else if (deleting && ci === 0) {
      deleting = false;
      ri = (ri + 1) % roles.length;
      delay = 380;
    }

    setTimeout(type, delay);
  }

  type();
}

/* COUNTERS */
function initCounters() {
  $$('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    const duration = target > 1000 ? 2200 : 1200;
    const start = performance.now();

    function update(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);

      el.textContent = Math.floor(ease * target);

      if (p < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }

    requestAnimationFrame(update);
  });
}

/* NAVBAR */
const navbar = $('navbar');

function handleNavbar() {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}

function updateActiveLink() {
  const sections = $$('section[id]');
  const links = $$('.nav-link');
  const y = window.scrollY + 120;

  sections.forEach(section => {
    if (y >= section.offsetTop && y < section.offsetTop + section.offsetHeight) {
      links.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${section.id}`);
      });
    }
  });
}

/* HAMBURGER */
const hamburger = $('hamburger');
const navMenu = $('navMenu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('active');

    navMenu.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.classList.toggle('no-scroll', open);
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    });
  });

  document.addEventListener('click', e => {
    if (navbar && !navbar.contains(e.target) && navMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    }
  });
}

/* THEME */
function applyTheme(theme) {
  document.body.classList.toggle('dark-mode', theme === 'dark');
  document.body.classList.toggle('light-mode', theme === 'light');

  const icon = $('themeIcon');
  if (icon) icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';

  localStorage.setItem('theme', theme);
}

applyTheme(localStorage.getItem('theme') || 'dark');

const themeBtn = $('themeToggle');

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    applyTheme(document.body.classList.contains('light-mode') ? 'dark' : 'light');
  });
}

/* SCROLL REVEAL */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);

        const fill = entry.target.querySelector('.ring-fill');

        if (fill) {
          const pct = +entry.target.dataset.pct;
          const circ = 213.6;

          setTimeout(() => {
            fill.style.strokeDashoffset = circ - (circ * pct / 100);
          }, 300);
        }
      }
    });
  }, { threshold: 0.12 });

  $$('.reveal').forEach(el => obs.observe(el));
}

/* RING GRADIENT */
function injectRingGradient() {
  if (document.getElementById('ringGrad')) return;

  const ns = 'http://www.w3.org/2000/svg';

  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';

  const defs = document.createElementNS(ns, 'defs');

  const grad = document.createElementNS(ns, 'linearGradient');
  grad.setAttribute('id', 'ringGrad');
  grad.setAttribute('x1', '0%');
  grad.setAttribute('y1', '0%');
  grad.setAttribute('x2', '100%');
  grad.setAttribute('y2', '0%');

  const s1 = document.createElementNS(ns, 'stop');
  s1.setAttribute('offset', '0%');
  s1.setAttribute('stop-color', '#2563EB');

  const s2 = document.createElementNS(ns, 'stop');
  s2.setAttribute('offset', '100%');
  s2.setAttribute('stop-color', '#60A5FA');

  grad.appendChild(s1);
  grad.appendChild(s2);
  defs.appendChild(grad);
  svg.appendChild(defs);

  document.body.insertBefore(svg, document.body.firstChild);
}

/* PROJECT CARDS */
function initProjectCards() {
  $$('.project-card').forEach(card => {
    const spot = card.querySelector('.spotlight');

    card.addEventListener('mousemove', e => {
      if (!spot) return;

      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      spot.style.setProperty('--x', x + '%');
      spot.style.setProperty('--y', y + '%');
    });

    card.addEventListener('mousemove', e => {
      if (!card.classList.contains('tilt-card')) return;

      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const rx = ((e.clientY - cy) / (rect.height / 2)) * -4;
      const ry = ((e.clientX - cx) / (rect.width / 2)) * 4;

      card.style.transform =
        `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* MAGNETIC BUTTONS */
function initMagnetic() {
  $$('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;

      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* CUSTOM CURSOR */
function initCursor() {
  const ring = $('cursorRing');
  const dot = $('cursorDot');

  if (!ring || !dot) return;

  if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    ring.style.display = 'none';
    dot.style.display = 'none';
    return;
  }

  let rx = 0;
  let ry = 0;

  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';

    rx += (e.clientX - rx) * 0.12;
    ry += (e.clientY - ry) * 0.12;

    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
  });

  $$('a, button, .magnetic').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.transform = 'translate(-50%,-50%) scale(1.6)';
    });

    el.addEventListener('mouseleave', () => {
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });

  function loop() {
    requestAnimationFrame(loop);
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
  }

  loop();
}

/* BACK TO TOP */
const backTop = $('backTop');

if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function handleBackTop() {
  if (backTop) backTop.classList.toggle('visible', window.scrollY > 400);
}

/* TOAST */
function showToast(msg, type = 'success') {
  const toast = $('toast');

  if (!toast) return;

  toast.textContent = msg;
  toast.className = `toast ${type} show`;

  setTimeout(() => {
    toast.className = 'toast';
  }, 4000);
}

/* WEB3FORMS CONTACT */
const form = $('web3Form') || $('contactForm');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name = $('cName')?.value.trim();
    const email = $('cEmail')?.value.trim();
    const subject = $('cSubject')?.value.trim();
    const message = $('cMsg')?.value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    const accessKeyInput = form.querySelector('input[name="access_key"]');
    const accessKey = accessKeyInput ? accessKeyInput.value.trim() : '';

    if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      showToast('Add your Web3Forms access key in index.html.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const oldBtnText = submitBtn ? submitBtn.innerHTML : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
    }

    try {
      const formData = new FormData(form);

      if (!formData.get('name')) formData.append('name', name);
      if (!formData.get('email')) formData.append('email', email);
      if (!formData.get('subject')) formData.append('subject', '[Portfolio] ' + subject);
      if (!formData.get('message')) formData.append('message', message);

      formData.append('from_name', 'Santhosh Portfolio Website');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        showToast('Message sent successfully!', 'success');
        form.reset();
      } else {
        showToast(result.message || 'Message failed. Check your access key.', 'error');
      }
    } catch (error) {
      showToast('Network error. Please try again.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = oldBtnText;
      }
    }
  });
}

/* SMOOTH SCROLL */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');

    if (!href || href === '#') return;

    const target = document.querySelector(href);

    if (!target) return;

    e.preventDefault();

    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 80,
      behavior: 'smooth'
    });
  });
});

/* FOOTER YEAR */
const fy = $('footerYear');

if (fy) {
  fy.textContent = new Date().getFullYear();
}

/* GITHUB FALLBACK */
function showGithubFallback(img, message = 'GitHub stats unavailable') {
  const card = img.closest('.gh-card, .github-lang-card');

  if (!card) return;

  const fallback = card.querySelector('.gh-fallback');

  if (fallback) {
    fallback.style.display = 'flex';

    const text = fallback.querySelector('p');

    if (text) text.textContent = message;
  }

  img.remove();
}

/* SCROLL LISTENER */
window.addEventListener('scroll', () => {
  handleNavbar();
  updateActiveLink();
  handleBackTop();
}, { passive: true });

handleNavbar();

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
  injectRingGradient();
  initReveal();
  initProjectCards();
  initMagnetic();
  initCursor();
  handleBackTop();
  updateActiveLink();
});
