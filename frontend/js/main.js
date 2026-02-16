// API Base URL
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api'
  : 'https://jebplan-construction-api-twq3.onrender.com/api';

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Load Services on Homepage
async function loadServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    if (!servicesGrid) return;

    try {
        const response = await fetch(`${API_BASE}/services`);
        const services = await response.json();

        servicesGrid.innerHTML = services.map(service => `
            <div class="service-card">
                <i class="${service.icon}"></i>
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <ul class="service-features">
                    ${service.features.slice(0, 3).map(feature => `
                        <li><i class="fas fa-check"></i> ${feature}</li>
                    `).join('')}
                </ul>
                <p class="service-price">${service.price}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading services:', error);
        servicesGrid.innerHTML = '<p>Unable to load services. Please try again later.</p>';
    }
}

async function loadTeam() {
    const teamGrid = document.getElementById('teamGrid');
    if (!teamGrid) return;

    try {
        const response = await fetch(`${API_BASE}/team`);
        const team = await response.json();
        
        console.log('Team data:', team); // Add this to debug

        if (team.length === 0) {
            teamGrid.innerHTML = '<p>No team members found.</p>';
            return;
        }

        teamGrid.innerHTML = team.map(member => `
            <div class="team-card">
                <div class="team-image"></div>
                <div class="team-info">
                    <h3>${member.name}</h3>
                    <span class="team-position">${member.position}</span>
                    <p class="team-bio">${member.bio}</p>
                    <div class="team-social">
                        ${member.social?.linkedin ? `<a href="${member.social.linkedin}"><i class="fab fa-linkedin"></i></a>` : ''}
                        ${member.social?.twitter ? `<a href="${member.social.twitter}"><i class="fab fa-twitter"></i></a>` : ''}
                        <a href="mailto:${member.social?.email || ''}"><i class="fas fa-envelope"></i></a>
                    </div>
                    ${member.founder ? '<span class="founder-tag">Founder</span>' : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading team:', error);
        teamGrid.innerHTML = '<p>Unable to load team members. Please try again later.</p>';
    }
}

// Handle Contact Form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formMessage = document.getElementById('formMessage');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value
        };

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            const response = await fetch(`${API_BASE}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                formMessage.className = 'form-message success';
                formMessage.textContent = data.message;
                contactForm.reset();
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            formMessage.className = 'form-message error';
            formMessage.textContent = error.message || 'Failed to send message. Please try again.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    loadTeam();

    // Seed initial data (run once)
    const shouldSeed = localStorage.getItem('dbSeeded');
    if (!shouldSeed) {
        Promise.all([
            fetch(`${API_BASE}/services/seed`, { method: 'POST' }),
            fetch(`${API_BASE}/team/seed`, { method: 'POST' })
        ]).then(() => {
            localStorage.setItem('dbSeeded', 'true');
            loadServices(); // Reload services after seeding
            loadTeam(); // Reload team after seeding
        }).catch(err => console.error('Error seeding data:', err));
    }
});