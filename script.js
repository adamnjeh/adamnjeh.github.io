// ===== MATRIX RAIN BACKGROUND =====
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF{}[]<>/\\|';
const fontSize = 14;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00f0ff';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 50);

window.addEventListener('resize', () => {
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
});

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = themeToggle.querySelector('.control-label');

if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeLabel();
});

function updateThemeLabel() {
    const isLight = document.body.classList.contains('light-mode');
    if (currentLang === 'fr') {
        themeLabel.textContent = isLight ? 'Clair' : 'Sombre';
    } else {
        themeLabel.textContent = isLight ? 'Light' : 'Dark';
    }
}

// ===== LANGUAGE TOGGLE =====
let currentLang = localStorage.getItem('lang') || 'en';
const langToggle = document.getElementById('lang-toggle');

const typingTextsEN = [
    'Cybersecurity Engineering Student',
    'Malware Analyst',
    'Threat Intelligence Enthusiast',
    'Penetration Testing',
    'SAST Pipeline Builder',
    'Top 5% TryHackMe'
];

const typingTextsFR = [
    'Etudiant Ingenieur en Cybersecurite',
    'Analyste Malware',
    'Passione de Threat Intelligence',
    'Tests de Penetration',
    'Constructeur de Pipelines SAST',
    'Top 5% TryHackMe'
];

let typingTexts = currentLang === 'fr' ? typingTextsFR : typingTextsEN;

function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;

    // Update all elements with data-en / data-fr
    document.querySelectorAll('[data-' + lang + ']').forEach(el => {
        const text = el.getAttribute('data-' + lang);
        if (text) {
            if (el.tagName === 'PRE' || el.children.length === 0) {
                el.innerHTML = text;
            } else {
                el.innerHTML = text;
            }
        }
    });

    // Update typing texts
    typingTexts = lang === 'fr' ? typingTextsFR : typingTextsEN;
    textIndex = 0;
    charIndex = 0;
    isDeleting = false;

    // Update lang toggle active state
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === lang);
    });

    // Update theme label
    updateThemeLabel();

    // Update page title
    document.title = lang === 'fr'
        ? 'Adam Njeh | Ingenieur Cybersecurite'
        : 'Adam Njeh | Cybersecurity Engineer';
}

// Apply stored lang on load
if (currentLang !== 'en') {
    applyLang(currentLang);
}
updateThemeLabel();

langToggle.addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'fr' : 'en';
    applyLang(newLang);
});

// ===== TYPING EFFECT =====
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById('typing-text');

function typeEffect() {
    const current = typingTexts[textIndex];
    if (isDeleting) {
        typingEl.textContent = '> ' + current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingEl.textContent = '> ' + current.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 30 : 60;

    if (!isDeleting && charIndex === current.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        speed = 300;
    }

    setTimeout(typeEffect, speed);
}

typeEffect();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksEl.classList.toggle('active');
});

navLinksEl.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinksEl.classList.remove('active');
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-category, .project-card, .timeline-item, .edu-card, .badge-card, .about-card, .stat-item, .contact-link-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== COUNTER ANIMATION =====
const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(num => counterObserver.observe(num));

function animateCounter(el, target) {
    let current = 0;
    const increment = target / 40;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, 30);
}

// ===== SMOOTH SCROLL for nav links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
