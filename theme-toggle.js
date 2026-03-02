// ============================================
// THEME TOGGLE — Orion Media
// Detects device preference, persists choice,
// and provides a manual toggle.
// ============================================

(function () {
    'use strict';

    // 1. Determine initial theme
    function getPreferredTheme() {
        // Check if user has manually set a preference
        const stored = localStorage.getItem('orion-theme');
        if (stored === 'light' || stored === 'dark') return stored;

        // Otherwise, match device/OS preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }

        // Default to dark (matches brand)
        return 'dark';
    }

    // 2. Apply theme immediately (before DOM renders to avoid flash)
    const currentTheme = getPreferredTheme();
    document.documentElement.setAttribute('data-theme', currentTheme);

    // 3. Listen for OS-level theme changes (live updates)
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('orion-theme')) {
                const newTheme = e.matches ? 'light' : 'dark';
                applyTheme(newTheme, false);
            }
        });
    }

    // 4. Apply theme with optional transition
    function applyTheme(theme, save) {
        document.documentElement.classList.add('theme-transitioning');
        document.documentElement.setAttribute('data-theme', theme);

        if (save) {
            localStorage.setItem('orion-theme', theme);
        }

        // Remove transition class after animation completes
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
        }, 450);
    }

    // 5. Inject toggle widget into the page
    function createToggle() {
        const toggle = document.createElement('div');
        toggle.className = 'theme-toggle';
        toggle.setAttribute('role', 'switch');
        toggle.setAttribute('aria-label', 'Toggle light and dark mode');

        toggle.innerHTML = `
            <span class="theme-toggle-icon" id="themeIconLight">☀️</span>
            <div class="theme-toggle-track" id="themeTrack">
                <div class="theme-toggle-thumb"></div>
            </div>
            <span class="theme-toggle-icon" id="themeIconDark">🌙</span>
        `;

        document.body.appendChild(toggle);

        // Toggle on click
        const track = document.getElementById('themeTrack');
        track.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next, true);
        });

        // Also allow clicking the sun/moon icons
        document.getElementById('themeIconLight').addEventListener('click', () => {
            applyTheme('light', true);
        });

        document.getElementById('themeIconDark').addEventListener('click', () => {
            applyTheme('dark', true);
        });
    }

    // 6. Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggle);
    } else {
        createToggle();
    }
})();
