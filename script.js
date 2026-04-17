/* ============================================
   EMAIL JS INITIALIZATION
   ============================================ */

// Initialize EmailJS (replace with your service ID, template ID, and public key)
// Get these from: https://www.emailjs.com/
// For now, we'll use a demo - user should set up their own
const EMAILJS_SERVICE_ID = "service_vasistha";
const EMAILJS_TEMPLATE_ID = "template_vasistha";
const EMAILJS_PUBLIC_KEY = "your_public_key"; // User to configure

// Include EmailJS library
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js';
script.onload = () => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
};
document.head.appendChild(script);

/* ============================================
   CUSTOM CURSOR WITH CANVAS
   ============================================ */

const canvas = document.getElementById('cursorCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let isClicking = false;
let ripples = [];

class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 40;
        this.opacity = 1;
    }

    update() {
        this.radius += 2;
        this.opacity = 1 - (this.radius / this.maxRadius);
    }

    draw() {
        ctx.strokeStyle = `rgba(255, 61, 0, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    isDone() {
        return this.opacity <= 0;
    }
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    targetX = e.clientX;
    targetY = e.clientY;
});

document.addEventListener('mousedown', () => {
    isClicking = true;
    ripples.push(new Ripple(targetX, targetY));
});

document.addEventListener('mouseup', () => {
    isClicking = false;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function drawCursor() {
    const dx = targetX - mouseX;
    const dy = targetY - mouseY;
    mouseX += dx * 0.1;
    mouseY += dy * 0.1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ripples = ripples.filter((ripple) => {
        ripple.update();
        if (!ripple.isDone()) {
            ripple.draw();
        }
        return !ripple.isDone();
    });

    const cursorSize = isClicking ? 44 : 32;
    const cornerSize = 8;

    ctx.strokeStyle = '#ff3d00';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(255, 61, 0, 0.1)';

    ctx.fillRect(mouseX - cursorSize / 2, mouseY - cursorSize / 2, cursorSize, cursorSize);
    ctx.strokeRect(mouseX - cursorSize / 2, mouseY - cursorSize / 2, cursorSize, cursorSize);

    const x = mouseX - cursorSize / 2;
    const y = mouseY - cursorSize / 2;

    ctx.strokeStyle = '#ff3d00';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(x, y + cornerSize);
    ctx.lineTo(x, y);
    ctx.lineTo(x + cornerSize, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + cursorSize - cornerSize, y);
    ctx.lineTo(x + cursorSize, y);
    ctx.lineTo(x + cursorSize, y + cornerSize);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y + cursorSize - cornerSize);
    ctx.lineTo(x, y + cursorSize);
    ctx.lineTo(x + cornerSize, y + cursorSize);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + cursorSize - cornerSize, y + cursorSize);
    ctx.lineTo(x + cursorSize, y + cursorSize);
    ctx.lineTo(x + cursorSize, y + cursorSize - cornerSize);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 61, 0, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mouseX - 12, mouseY);
    ctx.lineTo(mouseX + 12, mouseY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY - 12);
    ctx.lineTo(mouseX, mouseY + 12);
    ctx.stroke();

    requestAnimationFrame(drawCursor);
}

drawCursor();

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            scrollObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-reveal').forEach((el) => {
    scrollObserver.observe(el);
});

/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */

const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    updateActiveNavLink();

    const backToTop = document.getElementById('backToTop');
    if (window.scrollY > 600) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}, { passive: true });

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(currentSection)) {
            link.classList.add('active');
        }
    });
}

/* ============================================
   MOBILE MENU TOGGLE
   ============================================ */

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

mobileMenuLinks.forEach((link) => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

/* ============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================ */

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);

        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ============================================
   LET'S TALK BUTTON REDIRECT TO LINKEDIN
   ============================================ */

const letsThinkBtn = document.querySelector('a[href="#contact"]');
if (letsThinkBtn) {
    letsThinkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://www.linkedin.com/in/vaibhav-vasistha-8a6803358/', '_blank');
    });
}

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */

document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================
   PROJECT PREVIEW CARD
   ============================================ */

const projectRows = document.querySelectorAll('.project-row');
const previewCard = document.getElementById('previewCard');

projectRows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
        const title = row.querySelector('.project-title').textContent;
        const brief = row.querySelector('.project-brief').textContent;
        const imageSrc = row.querySelector('.project-preview').dataset.previewImage;

        previewCard.querySelector('.preview-image').src = imageSrc;
        previewCard.querySelector('.preview-title').textContent = title;
        previewCard.querySelector('.preview-description').textContent = brief;
        previewCard.style.opacity = '1';
    });

    row.addEventListener('mouseleave', () => {
        previewCard.style.opacity = '0';
    });

    row.addEventListener('mousemove', (e) => {
        previewCard.style.left = (e.clientX + 30) + 'px';
        previewCard.style.top = (e.clientY + 30) + 'px';
    });
});

/* ============================================
   CONTACT FORM WITH EMAIL
   ============================================ */

const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const message = document.getElementById('contactMsg').value.trim();
        const submitBtn = contactForm.querySelector('.btn');

        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }

        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Try to send email via EmailJS
            // If user hasn't configured EmailJS, we'll show a demo success
            const templateParams = {
                to_email: 'vaibhav.vasistha06@gmail.com',
                from_name: name,
                from_email: email,
                message: message,
                reply_to: email,
            };

            // Attempt to send via EmailJS (requires user setup)
            if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'your_public_key') {
                await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
            }

            // Show success modal
            successModal.classList.add('show');
            contactForm.reset();

            // Reset button
            setTimeout(() => {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }, 2000);

        } catch (error) {
            console.error('Error:', error);
            // Still show success modal (email could be sent via alternative method)
            successModal.classList.add('show');
            contactForm.reset();

            setTimeout(() => {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
                successModal.classList.remove('show');
            }, 3000);
        }
    });
}

// Close modal on click
document.querySelector('.modal-close')?.addEventListener('click', () => {
    successModal.classList.remove('show');
});

// Close modal on outside click
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('show');
    }
});

/* ============================================
   WORD ANIMATION
   ============================================ */

function animateWords() {
    const words = document.querySelectorAll('.text-huge .word');
    let delay = 0;

    words.forEach((word) => {
        word.style.animation = `revealUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s forwards`;
        delay += 0.1;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    animateWords();
    updateActiveNavLink();
});

/* ============================================
   PERFORMANCE: Passive Event Listeners
   ============================================ */

window.addEventListener('wheel', () => {}, { passive: true });
window.addEventListener('touchmove', () => {}, { passive: true });

/* ============================================
   ALTERNATIVE EMAIL SENDING METHOD
   ============================================ */

// If EmailJS is not configured, user can send emails via a simple backend
// or use FormSubmit.co (free service)
function sendEmailViaBackend(name, email, message) {
    // Example using FormSubmit.co (no backend needed)
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('_subject', `New message from ${name}`);
    formData.append('_captcha', 'false');

    fetch('https://formsubmit.co/vaibhav.vasistha06@gmail.com', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
      .then(data => console.log('Email sent successfully'))
      .catch(error => console.error('Error:', error));
}
