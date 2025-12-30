// Load GitHub projects dynamically
async function loadProjects() {
    const username = document.getElementById('githubUsername').value.trim();
    if (!username) {
        alert('Please enter a GitHub username');
        return;
    }

    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '<p class="col-span-full text-center text-gray-400 py-8">Loading projects...</p>';

    try {
        const response = await fetch(`/api/projects?username=${encodeURIComponent(username)}`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        
        const projects = await response.json();
        
        if (projects.length === 0) {
            grid.innerHTML = '<p class="col-span-full text-center text-gray-400 py-8">No public repositories found.</p>';
            return;
        }

        grid.innerHTML = projects.map(project => `
            <div class="bg-dark-700 border border-dark-600 rounded-xl p-6 hover:border-indigo-500 hover:-translate-y-1 hover:shadow-xl transition-all">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="text-lg font-semibold">${escapeHtml(project.name)}</h3>
                    <span class="px-2 py-1 bg-indigo-500/15 text-indigo-400 rounded text-xs font-mono">${escapeHtml(project.language || 'N/A')}</span>
                </div>
                <p class="text-gray-400 text-sm mb-4 line-clamp-2">${escapeHtml(project.description || 'No description')}</p>
                <div class="flex gap-4 text-gray-500 text-sm mb-4">
                    <span>⭐ ${project.stargazers_count}</span>
                    <span>🍴 ${project.forks_count}</span>
                </div>
                <a href="${escapeHtml(project.html_url)}" target="_blank" class="text-indigo-400 hover:text-indigo-300 font-medium text-sm">View on GitHub →</a>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading projects:', error);
        grid.innerHTML = '<p class="col-span-full text-center text-red-400 py-8">Failed to load projects. Please try again.</p>';
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle Enter key in GitHub username input
document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('githubUsername');
    if (usernameInput) {
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loadProjects();
            }
        });
    }
});
