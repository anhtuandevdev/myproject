const Router = {
    init() {
        document.body.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && link.href.startsWith(window.location.origin) && !link.target && !link.hasAttribute('download')) {
                // Ignore hash links or logout
                if (link.href.includes('#') || link.id === 'logout-btn-header') return;
                
                e.preventDefault();
                this.navigate(link.href);
            }
        });

        window.addEventListener('popstate', () => {
            this.navigate(window.location.href, false);
        });
    },

    async navigate(url, addToHistory = true) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const newContent = doc.getElementById('main-router-view');
            const currentContent = document.getElementById('main-router-view');
            
            if (newContent && currentContent) {
                // Update content
                currentContent.innerHTML = newContent.innerHTML;
                currentContent.className = newContent.className;
                
                // Update page title
                document.title = doc.title;
                
                // Update History
                if (addToHistory) {
                    history.pushState(null, '', url);
                }

                // Scroll to top
                window.scrollTo(0, 0);

                // Update Sidebar Active State
                this.updateActiveLinks(url);

                // Re-execute scripts in the new content
                this.executeScripts(currentContent);
                
                // Dispatch event for any component listeners
                window.dispatchEvent(new Event('route-changed'));
            } else {
                // Fallback to normal navigation if structure differs
                window.location.href = url;
            }
        } catch (err) {
            console.error('Navigation error:', err);
            window.location.href = url;
        }
    },

    updateActiveLinks(url) {
        const path = new URL(url).pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-item').forEach(item => {
            const itemPath = item.getAttribute('href');
            if (itemPath === path) {
                item.classList.add('bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/20');
                item.classList.remove('text-slate-600', 'dark:text-slate-300', 'hover:bg-indigo-50', 'dark:hover:bg-indigo-900/30');
            } else {
                item.classList.remove('bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/20');
                item.classList.add('text-slate-600', 'dark:text-slate-300', 'hover:bg-indigo-50', 'dark:hover:bg-indigo-900/30');
            }
        });
    },

    executeScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            newScript.textContent = oldScript.textContent;
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    }
};

Router.init();
window.Router = Router;
