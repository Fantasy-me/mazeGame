const fireCanvas = document.getElementById('fireCanvas');
const fireCtx = fireCanvas.getContext('2d');

// Налаштування полотна
fireCanvas.width = window.innerWidth;
fireCanvas.height = window.innerHeight;

// Дані частинок
const particles = [];
const particleCount = 400;

// Ініціалізація частинок
function createParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * fireCanvas.width,
            y: Math.random() * fireCanvas.height,
            size: Math.random() * 3 + 1,
            speedY: Math.random() * 3 + 1,
            color: rgba(`255, ${Math.floor(Math.random() * 150)}, 0, ${Math.random() * 0.6 + 0.2}`),
        });
    }
}

// Оновлення положення частинок
function updateParticles() {
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        if (p.y < 0) {
            p.y = fireCanvas.height;
            p.x = Math.random() * fireCanvas.width;
        }
    }
}

// Малювання частинок
function drawParticles() {
    fireCtx.clearRect(0, 0, fireCanvas.width, fireCanvas.height);

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        fireCtx.beginPath();
        fireCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        fireCtx.fillStyle = p.color;
        fireCtx.fill();
    }
}

// Анімація вогню
function animateFire() {
    updateParticles();
    drawParticles();
    requestAnimationFrame(animateFire);
}

// Початок
createParticles();
animateFire();