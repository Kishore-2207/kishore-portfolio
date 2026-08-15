/* ==========================================================================
   GITHUB API SERVICE MODULE (github.js)
   Fetches user stats, repos, language metrics; handles rate-limit fallbacks,
   implements local caching, and injects GitHub widgets into the DOM.
   ========================================================================== */

import { CONFIG } from './config.js';

/**
 * Initializes the GitHub section and triggers API queries.
 */
export async function initGithub() {
  const projectsSection = document.getElementById('projects');
  if (!projectsSection) return;

  // Append a dedicated Open Source / GitHub activity container to the bottom of Projects
  let githubContainer = document.getElementById('github-activity-block');
  if (!githubContainer) {
    githubContainer = document.createElement('div');
    githubContainer.id = 'github-activity-block';
    githubContainer.className = 'github-activity-section reveal';
    githubContainer.style.marginTop = 'var(--space-4xl)';
    projectsSection.appendChild(githubContainer);
  }

  // Render initial loader
  githubContainer.innerHTML = `
    <div class="text-center" style="margin-bottom: var(--space-xl);">
      <h3 class="card-title"><i class="fa-brands fa-github text-gradient" style="margin-right: 10px;"></i>Open Source Contributions</h3>
    </div>
    <div class="section-loader">
      <span class="spinner"></span>
    </div>
  `;

  const username = CONFIG.github.username;
  const data = await fetchGithubData(username);

  if (!data) {
    renderFallback(githubContainer);
    return;
  }

  renderGithubActivity(githubContainer, data);
}

/**
 * Fetches GitHub profile and repositories with client-side cache checking.
 * @param {string} username - GitHub username.
 * @returns {Promise<Object|null>} Profile and repo details, or null on error.
 */
async function fetchGithubData(username) {
  const cacheKey = `github_data_${username}`;
  const cacheTimeKey = `${cacheKey}_time`;

  try {
    // 1. Check local storage cache
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(cacheTimeKey);
    const now = Date.now();

    if (cachedData && cachedTime && (now - parseInt(cachedTime) < CONFIG.github.cacheDuration)) {
      return JSON.parse(cachedData);
    }

    // 2. Fetch profile data
    const profileRes = await fetch(`https://api.github.com/users/${username}`);
    if (!profileRes.ok) throw new Error('Failed to fetch profile.');
    const profile = await profileRes.json();

    // 3. Fetch repos data
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`);
    if (!reposRes.ok) throw new Error('Failed to fetch repositories.');
    const repos = await reposRes.json();

    const result = { profile, repos };

    // 4. Update cache
    localStorage.setItem(cacheKey, JSON.stringify(result));
    localStorage.setItem(cacheTimeKey, now.toString());

    return result;

  } catch (error) {
    console.warn('GitHub API failed, attempting cache recovery:', error);
    
    // Fallback: Return expired cache if available rather than showing error
    const expiredData = localStorage.getItem(cacheKey);
    if (expiredData) {
      return JSON.parse(expiredData);
    }
    return null;
  }
}

/**
 * Renders GitHub stats dashboard using retrieved data.
 * @param {HTMLElement} container - DOM wrapper.
 * @param {Object} data - Profile and Repos objects.
 */
function renderGithubActivity(container, data) {
  const { profile, repos } = data;

  // 1. Pinned/TopStarred repos extraction (sorting by stars desc, taking top 3)
  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3);

  // 2. Aggregate language metrics
  const langMap = {};
  let totalSize = 0;
  repos.forEach(repo => {
    if (repo.language) {
      langMap[repo.language] = (langMap[repo.language] || 0) + 1;
      totalSize++;
    }
  });

  const sortedLanguages = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Take top 5 languages

  const totalFollowers = profile.followers;
  const username = CONFIG.github.username;

  // Colors for languages mapping
  const langColors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Go: '#00ADD8',
    Rust: '#dea584'
  };

  container.innerHTML = `
    <div class="text-center" style="margin-bottom: var(--space-2xl);">
      <span class="section-subtitle">GitHub Activity</span>
      <h3 class="card-title" style="font-size: var(--font-size-2xl); margin-top: 4px;">
        <i class="fa-brands fa-github text-gradient" style="margin-right: 10px;"></i>Open Source Contributions
      </h3>
    </div>

    <div class="github-dashboard grid-fluid-compact">
      
      <!-- Box 1: Profile Summary & Stats -->
      <div class="card github-stat-card flex-col flex-center glass-hover-fx">
        <img src="${profile.avatar_url}" alt="GitHub Avatar" style="width: 80px; height: 80px; border-radius: var(--radius-full); border: 2px solid var(--color-primary); margin-bottom: var(--space-sm);">
        <h4 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold);">${profile.name || username}</h4>
        <p class="text-muted" style="font-size: var(--font-size-sm); margin-bottom: var(--space-md);">@${username}</p>
        
        <div class="github-stats-row flex-between" style="width: 100%; border-top: 1px solid var(--border-color); padding-top: var(--space-md); margin-top: var(--space-xs);">
          <div class="text-center">
            <div class="text-gradient" style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold);">${profile.public_repos}</div>
            <div style="font-size: var(--font-size-xs); color: var(--text-muted);">Repos</div>
          </div>
          <div class="text-center">
            <div class="text-gradient" style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold);">${totalFollowers}</div>
            <div style="font-size: var(--font-size-xs); color: var(--text-muted);">Followers</div>
          </div>
          <div class="text-center">
            <div class="text-gradient" style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold);">${profile.following}</div>
            <div style="font-size: var(--font-size-xs); color: var(--text-muted);">Following</div>
          </div>
        </div>
      </div>

      <!-- Box 2: Language Distribution Chart -->
      <div class="card github-languages-card glass-hover-fx" style="display: flex; flex-direction: column; justify-content: center;">
        <h4 style="font-size: var(--font-size-md); font-weight: var(--font-weight-bold); margin-bottom: var(--space-md);">
          <i class="fa-solid fa-chart-pie text-gradient" style="margin-right: 8px;"></i>Language Distribution
        </h4>
        
        <!-- Custom CSS Progress Bar Chart -->
        <div class="lang-bar-chart flex-row" style="height: 12px; border-radius: var(--radius-full); overflow: hidden; width: 100%; margin-bottom: var(--space-lg); background-color: var(--bg-tertiary);">
          ${sortedLanguages.map(([lang, count]) => {
            const pct = ((count / totalSize) * 100).toFixed(1);
            const color = langColors[lang] || '#8b949e';
            return `<div class="lang-bar-segment" style="width: ${pct}%; background-color: ${color}; height: 100%;" title="${lang}: ${pct}%"></div>`;
          }).join('')}
        </div>

        <ul class="lang-legend-list" style="list-style: none; display: flex; flex-wrap: wrap; gap: var(--space-md);">
          ${sortedLanguages.map(([lang, count]) => {
            const pct = ((count / totalSize) * 100).toFixed(0);
            const color = langColors[lang] || '#8b949e';
            return `
              <li style="display: flex; align-items: center; gap: 6px; font-size: var(--font-size-sm); color: var(--text-secondary);">
                <span style="width: 10px; height: 10px; border-radius: 20%; background-color: ${color}; display: inline-block;"></span>
                <strong>${lang}</strong> <span class="text-muted">${pct}%</span>
              </li>
            `;
          }).join('')}
        </ul>
      </div>

    </div>

    <!-- Pinned Repos Grid -->
    <div style="margin-top: var(--space-xl);">
      <h4 style="font-size: var(--font-size-md); font-weight: var(--font-weight-bold); margin-bottom: var(--space-md);">
        <i class="fa-solid fa-star text-gradient" style="margin-right: 8px;"></i>Top Starred Repositories
      </h4>
      <div class="grid-fluid">
        ${topRepos.map(repo => `
          <div class="card github-repo-card glass-hover-fx" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
            <div>
              <div class="flex-between" style="margin-bottom: var(--space-sm);">
                <i class="fa-regular fa-bookmark text-gradient" style="font-size: 1.25rem;"></i>
                <div class="flex-row gap-sm" style="font-size: var(--font-size-xs); color: var(--text-muted);">
                  <span><i class="fa-solid fa-star" style="margin-right: 3px; color: var(--color-primary);"></i>${repo.stargazers_count}</span>
                  <span><i class="fa-solid fa-code-fork" style="margin-right: 3px;"></i>${repo.forks_count}</span>
                </div>
              </div>
              <h5 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); margin-bottom: 6px;">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" style="color: var(--text-primary); text-decoration: underline;">
                  ${repo.name}
                </a>
              </h5>
              <p class="text-muted" style="font-size: var(--font-size-xs); margin-bottom: var(--space-md); line-height: var(--line-height-snug); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${repo.description || 'No description provided.'}
              </p>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; font-size: var(--font-size-xs); color: var(--text-secondary); margin-top: auto; padding-top: var(--space-xs);">
              <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${langColors[repo.language] || '#8b949e'}; display: inline-block;"></span>
              <span>${repo.language || 'Unknown'}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Contribution Chart Widget with resilient fallback -->
    <div class="card github-chart-card glass-hover-fx" style="margin-top: var(--space-xl); text-align: center;">
      <h4 style="font-size: var(--font-size-md); font-weight: var(--font-weight-bold); margin-bottom: var(--space-md); text-align: left;">
        <i class="fa-solid fa-calendar-days text-gradient" style="margin-right: 8px;"></i>Contribution Activity
      </h4>
      <div class="chart-container" style="overflow-x: auto; width: 100%;">
        <!-- Load real-time SVG contribution graph with fallback handler -->
        <img src="https://ghchart.rshah.org/6366f1/${username}" alt="GitHub Contributions Chart" style="max-width: 100%; height: auto; display: block; margin: 0 auto;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        
        <!-- Graceful fallback contribution grid -->
        <div class="fallback-chart-grid" style="display: none; padding: var(--space-md); background-color: var(--bg-tertiary); border-radius: var(--radius-md);">
          <div class="flex-col flex-center" style="color: var(--text-muted); min-height: 120px;">
            <i class="fa-solid fa-network-wired text-gradient" style="font-size: 2.5rem; margin-bottom: var(--space-sm);"></i>
            <h5 style="margin-bottom: 2px;">Active Development Schedule</h5>
            <p style="font-size: var(--font-size-xs); margin-bottom: 0;">Online activity tracking is currently offline. Repositories list remains fully active.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders fallback dashboard when API queries completely fail.
 * @param {HTMLElement} container - DOM wrapper.
 */
function renderFallback(container) {
  const username = CONFIG.github.username;
  container.innerHTML = `
    <div class="text-center" style="margin-bottom: var(--space-2xl);">
      <span class="section-subtitle">GitHub Status</span>
      <h3 class="card-title" style="font-size: var(--font-size-2xl); margin-top: 4px;">
        <i class="fa-brands fa-github text-gradient" style="margin-right: 10px;"></i>Open Source Contributions
      </h3>
    </div>
    
    <div class="card fallback-connection flex-col flex-center" style="padding: var(--space-2xl); text-align: center; min-height: 250px;">
      <i class="fa-solid fa-circle-nodes text-gradient" style="font-size: 3.5rem; margin-bottom: var(--space-md);"></i>
      <h3 class="card-title">GitHub API Offline</h3>
      <p class="text-muted" style="max-width: 500px; margin-bottom: var(--space-lg);">
        API rate limits exceeded or network connection is offline. You can view my live repositories list directly on my profile page.
      </p>
      <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        <i class="fa-brands fa-github" style="margin-right: 8px;"></i>Visit GitHub Profile
      </a>
    </div>
  `;
}
