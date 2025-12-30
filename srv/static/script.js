// Load GitHub projects dynamically
async function loadProjects() {
    const username = document.getElementById('githubUsername').value.trim();
    if (!username) {
        alert('Please enter a GitHub username');
        return;
    }

    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Loading projects...</p>';

    try {
        const response = await fetch(`/api/projects?username=${encodeURIComponent(username)}`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        
        const projects = await response.json();
        
        if (projects.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No public repositories found.</p>';
            return;
        }

        grid.innerHTML = projects.map(project => `
            <div class="project-card">
                <div class="project-header">
                    <h3 class="project-name">${escapeHtml(project.name)}</h3>
                    <span class="project-language">${escapeHtml(project.language || 'N/A')}</span>
                </div>
                <p class="project-description">${escapeHtml(project.description || 'No description available')}</p>
                <div class="project-stats">
                    <span class="stat">⭐ ${project.stargazers_count}</span>
                    <span class="stat">🍴 ${project.forks_count}</span>
                </div>
                <a href="${escapeHtml(project.html_url)}" target="_blank" class="project-link">View on GitHub →</a>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading projects:', error);
        grid.innerHTML = '<p style="text-align: center; color: #ef4444;">Failed to load projects. Please try again.</p>';
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add smooth scroll behavior for anchor links
document.addEventListener('DOMContentLoaded', () => {
    // Handle Enter key in GitHub username input
    const usernameInput = document.getElementById('githubUsername');
    if (usernameInput) {
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loadProjects();
            }
        });
    }

    // Add subtle animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards for animation
    document.querySelectorAll('.about-card, .project-card, .resume-block, .featured-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});
