(function() {
    'use strict';

    let scene, camera, renderer;
    let torusKnot, particles, floatingShapes = [];
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    const titles = [
        'Aspiring Software Developer',
        'AI & Data Science Student',
        'Front-End Web Developer',
        'Python & Web Development Enthusiast',
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function initThree() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 8;

        renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('three-canvas'),
            alpha: true,
            antialias: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
        scene.add(ambientLight);

        const light1 = new THREE.PointLight(0x6c63ff, 2, 20);
        light1.position.set(5, 5, 5);
        scene.add(light1);

        const light2 = new THREE.PointLight(0x00d4ff, 2, 20);
        light2.position.set(-5, -3, 5);
        scene.add(light2);

        const light3 = new THREE.PointLight(0xff6b9d, 1, 20);
        light3.position.set(0, -5, 5);
        scene.add(light3);

        const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 128, 16);
        const material = new THREE.MeshPhongMaterial({
            color: 0x6c63ff,
            emissive: 0x1a1580,
            specular: 0x8b83ff,
            shininess: 30,
            transparent: true,
            opacity: 0.85,
        });
        torusKnot = new THREE.Mesh(geometry, material);
        torusKnot.position.y = 0.5;
        scene.add(torusKnot);

        const colors = [0x6c63ff, 0x00d4ff, 0xff6b9d, 0x8b83ff];
        const shapes = [
            { geo: new THREE.OctahedronGeometry(0.3), count: 6 },
            { geo: new THREE.IcosahedronGeometry(0.25), count: 6 },
            { geo: new THREE.DodecahedronGeometry(0.2), count: 4 },
        ];

        shapes.forEach((shapeDef) => {
            for (let i = 0; i < shapeDef.count; i++) {
                const mat = new THREE.MeshPhongMaterial({
                    color: colors[Math.floor(Math.random() * colors.length)],
                    emissive: 0x000000,
                    transparent: true,
                    opacity: 0.6 + Math.random() * 0.4,
                    wireframe: Math.random() > 0.5,
                });
                const mesh = new THREE.Mesh(shapeDef.geo, mat);
                const radius = 2.5 + Math.random() * 3.5;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI * 2;
                mesh.position.set(
                    Math.sin(theta) * Math.cos(phi) * radius,
                    Math.sin(theta) * Math.sin(phi) * radius * 0.6,
                    Math.cos(theta) * radius * 0.8
                );
                mesh.userData = {
                    speed: 0.002 + Math.random() * 0.005,
                    axis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
                    radius: radius,
                    theta: theta,
                    phi: phi,
                };
                scene.add(mesh);
                floatingShapes.push(mesh);
            }
        });

        const particleCount = 2000;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const particleColors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 40;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5;

            const colorChoice = Math.random();
            if (colorChoice < 0.33) {
                particleColors[i * 3] = 0.42; particleColors[i * 3 + 1] = 0.39; particleColors[i * 3 + 2] = 1.0;
            } else if (colorChoice < 0.66) {
                particleColors[i * 3] = 0.0; particleColors[i * 3 + 1] = 0.83; particleColors[i * 3 + 2] = 1.0;
            } else {
                particleColors[i * 3] = 1.0; particleColors[i * 3 + 1] = 0.42; particleColors[i * 3 + 2] = 0.62;
            }
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

        const particleMat = new THREE.PointsMaterial({
            size: 0.05,
            transparent: true,
            opacity: 0.8,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
        });
        particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('resize', () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });
    }

    function animate() {
        requestAnimationFrame(animate);

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        if (torusKnot) {
            torusKnot.rotation.x += 0.005;
            torusKnot.rotation.y += 0.01;
            torusKnot.rotation.z += 0.003;

            torusKnot.position.x += (targetX * 0.5 - torusKnot.position.x) * 0.02;
            torusKnot.position.y += (targetY * 0.3 + 0.5 - torusKnot.position.y) * 0.02;
        }

        floatingShapes.forEach((mesh) => {
            const data = mesh.userData;
            data.theta += data.speed * 0.5;
            data.phi += data.speed * 0.3;

            mesh.position.x = Math.sin(data.theta) * Math.cos(data.phi) * data.radius + targetX * 0.3;
            mesh.position.y = Math.sin(data.theta) * Math.sin(data.phi) * data.radius * 0.6 + targetY * 0.2;
            mesh.position.z = Math.cos(data.theta) * data.radius * 0.8;

            mesh.rotation.x += data.speed;
            mesh.rotation.y += data.speed * 1.5;
        });

        if (particles) {
            const pos = particles.geometry.attributes.position.array;
            for (let i = 0; i < pos.length; i += 3) {
                pos[i + 1] += 0.002;
                if (pos[i + 1] > 20) pos[i + 1] = -20;
            }
            particles.geometry.attributes.position.needsUpdate = true;
            particles.rotation.y += 0.0002;
        }

        renderer.render(scene, camera);
    }

    function typeWriter() {
        const element = document.getElementById('typewriter');
        if (!element) return;

        const currentTitle = titles[titleIndex];

        if (isDeleting) {
            element.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentTitle.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            delay = 500;
        }

        setTimeout(typeWriter, delay);
    }

    function initSmoothScroll() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
                document.getElementById('nav-links').classList.remove('active');
                document.getElementById('hamburger').classList.remove('active');
            });
        });
    }

    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('nav-links');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    function initActiveLink() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + entry.target.id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(section => observer.observe(section));
    }

    function initScrollAnimations() {
        const elements = document.querySelectorAll('.glass-card, .section-title, .divider');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in', 'visible');
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    function initSkillBars() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target;
                    const width = progress.getAttribute('data-width');
                    progress.style.setProperty('--width', width + '%');
                    progress.classList.add('animated');
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.skill-progress').forEach(bar => {
            observer.observe(bar);
        });
    }

    function initNavbarScroll() {
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    function init() {
        initThree();
        animate();
        typeWriter();
        initSmoothScroll();
        initMobileMenu();
        initActiveLink();
        initScrollAnimations();
        initSkillBars();
        initNavbarScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
