/* docs-framework.js — Shared documentation site engine
   Source of truth: streamdeck-dev/docs-framework/
   Reads JSON config from #docs-config, builds sidebar + content area,
   loads markdown via marked.js with hash-based routing.
   Supports file:// via XMLHttpRequest fallback. */

(function () {
    'use strict';

    // ---- Read config ----
    const configEl = document.getElementById('docs-config');
    if (!configEl) {
        document.body.innerHTML = '<p style="color:#f48771;padding:24px">docs-framework: missing <code>&lt;script id="docs-config"&gt;</code> block.</p>';
        return;
    }

    let config;
    try {
        config = JSON.parse(configEl.textContent);
    } catch (e) {
        document.body.innerHTML = `<p style="color:#f48771;padding:24px">docs-framework: invalid JSON in #docs-config — ${e.message}</p>`;
        return;
    }

    const title = config.title || 'Docs';
    const basePath = config.basePath ? config.basePath.replace(/\/$/, '') + '/' : '';
    const defaultPage = config.defaultPage || config.sections?.[0]?.items?.[0]?.id || 'readme';
    const sections = config.sections || [];
    const headerLinks = config.headerLinks || null;
    const multiSection = sections.length > 1;

    // Build a lookup: id → file
    const pageMap = {};
    for (const section of sections) {
        for (const item of section.items || []) {
            pageMap[item.id] = item.file;
        }
    }

    // ---- Build DOM ----

    // Optional header
    if (headerLinks) {
        document.body.classList.add('docs-has-header');
        const header = document.createElement('header');
        header.className = 'docs-header';
        header.innerHTML = `<a class="docs-header-title" href="${headerLinks[0]?.href || '#'}">${escapeHtml(title)}</a>`;
        const nav = document.createElement('nav');
        nav.className = 'docs-header-nav';
        nav.setAttribute('aria-label', 'Main navigation');
        for (const link of headerLinks) {
            const a = document.createElement('a');
            a.href = link.href;
            a.textContent = link.label;
            if (link.active) a.classList.add('active');
            if (link.external) {
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
            }
            nav.appendChild(a);
        }
        header.appendChild(nav);
        document.body.appendChild(header);
    }

    // Layout container
    const layout = document.createElement('div');
    layout.className = 'docs-layout';

    // Sidebar
    const sidebar = document.createElement('nav');
    sidebar.className = 'docs-sidebar';
    sidebar.setAttribute('aria-label', 'Documentation navigation');

    if (multiSection) {
        // Collapsible <details> per section
        for (const section of sections) {
            const details = document.createElement('details');
            details.className = 'docs-nav-section';
            details.dataset.section = section.label.toLowerCase().replace(/\s+/g, '-');

            const summary = document.createElement('summary');
            summary.innerHTML = `<h3>${escapeHtml(section.label)}</h3>`;
            details.appendChild(summary);

            const linksDiv = document.createElement('div');
            linksDiv.className = 'nav-links';
            for (const item of section.items || []) {
                linksDiv.appendChild(createNavLink(item));
            }
            details.appendChild(linksDiv);
            sidebar.appendChild(details);

            // Animate open/close
            setupDetailsAnimation(details, linksDiv);
        }
    } else {
        // Flat list with heading
        const section = sections[0];
        if (section) {
            const h2 = document.createElement('h2');
            h2.textContent = section.label;
            sidebar.appendChild(h2);
            for (const item of section.items || []) {
                sidebar.appendChild(createNavLink(item));
            }
        }
    }

    // Main content
    const main = document.createElement('main');
    main.className = 'docs-content';
    main.id = 'docs-content';
    main.setAttribute('aria-live', 'polite');
    main.innerHTML = '<span class="docs-loading">Loading\u2026</span>';

    layout.appendChild(sidebar);
    layout.appendChild(main);
    document.body.appendChild(layout);

    // ---- Configure marked ----
    if (typeof marked === 'undefined') {
        main.innerHTML = '<p class="docs-error">docs-framework: <code>marked.js</code> not loaded. Add <code>&lt;script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"&gt;</code> before docs-framework.js.</p>';
        return;
    }

    marked.setOptions({ gfm: true, breaks: false });

    marked.use({
        renderer: {
            code({ text, lang }) {
                return `<pre tabindex="0"><code class="language-${lang || 'text'}">${escapeHtml(text)}</code></pre>`;
            },
            image({ href, title, text }) {
                const alt = text || title || 'Image';
                const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
                return `<img src="${href}" alt="${escapeHtml(alt)}"${titleAttr} loading="lazy">`;
            },
            link({ href, title, tokens }) {
                const text = this.parser.parseInline(tokens);
                const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
                const isExternal = href && href.startsWith('http') && !href.includes(location.hostname);
                if (isExternal) {
                    return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}<span class="visually-hidden"> (opens in new tab)</span></a>`;
                }
                return `<a href="${href || ''}"${titleAttr}>${text}</a>`;
            }
        }
    });

    // ---- Navigation ----

    function getPageId() {
        const hash = (location.hash || '').slice(1);
        return hash || defaultPage;
    }

    function setActiveLink(id) {
        sidebar.querySelectorAll('a').forEach(a => {
            a.classList.toggle('active', a.dataset.page === id);
        });

        // Auto-expand parent details
        if (multiSection) {
            sidebar.querySelectorAll('details').forEach(d => d.open = false);
            const activeLink = sidebar.querySelector(`a[data-page="${id}"]`);
            if (activeLink) {
                const details = activeLink.closest('details');
                if (details) details.open = true;
            }
        }
    }

    async function loadPage(id) {
        const file = pageMap[id];
        if (!file) {
            main.innerHTML = `<p class="docs-error">Unknown page: ${escapeHtml(id)}</p>`;
            return;
        }

        main.innerHTML = '<span class="docs-loading">Loading\u2026</span>';
        setActiveLink(id);

        try {
            const md = await loadMarkdown(basePath + file);
            main.innerHTML = marked.parse(md);

            // Wrap tables for horizontal scrolling
            main.querySelectorAll('table').forEach(table => {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-wrap';
                wrapper.setAttribute('tabindex', '0');
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            });

            // Update document title
            const titleMatch = md.match(/^#\s+(.+)$/m);
            document.title = titleMatch ? `${titleMatch[1]} \u2014 ${title}` : title;

            // Scroll to top
            window.scrollTo(0, 0);
        } catch (err) {
            main.innerHTML = `<p class="docs-error">Failed to load ${escapeHtml(basePath + file)}: ${escapeHtml(err.message)}</p>
                <p style="margin-top:8px;color:var(--docs-text-muted);font-size:13px">If using <code>file://</code>, try: <code>npx http-server -p 3456 -c-1</code></p>`;
        }
    }

    // Sidebar link clicks
    sidebar.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-page]');
        if (!link) return;
        e.preventDefault();
        const id = link.dataset.page;
        location.hash = id;
    });

    window.addEventListener('hashchange', () => loadPage(getPageId()));

    // Initial load
    loadPage(getPageId());

    // ---- Helpers ----

    function createNavLink(item) {
        const a = document.createElement('a');
        a.href = '#' + item.id;
        a.textContent = item.label;
        a.dataset.page = item.id;
        if (item.sub) a.classList.add('sub');
        return a;
    }

    function setupDetailsAnimation(details, content) {
        details.addEventListener('click', (e) => {
            if (!e.target.closest('summary')) return;
            e.preventDefault();

            if (details.open) {
                content.style.animation = 'docsSlideUp 0.2s ease-out forwards';
                content.addEventListener('animationend', () => {
                    details.open = false;
                    content.style.animation = '';
                }, { once: true });
            } else {
                details.open = true;
                content.style.animation = 'none';
                content.offsetHeight; // reflow
                content.style.animation = 'docsSlideDown 0.2s ease-out';
            }
        });
    }

    async function loadMarkdown(path) {
        try {
            const url = new URL(path, location.href);
            const res = await fetch(url);
            if (!res.ok) throw new Error(res.statusText);
            return await res.text();
        } catch (fetchErr) {
            // file:// fallback via XMLHttpRequest
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', path, true);
                xhr.onload = () => (xhr.status === 200 || xhr.status === 0)
                    ? resolve(xhr.responseText)
                    : reject(new Error(xhr.statusText || 'Load failed'));
                xhr.onerror = () => reject(fetchErr);
                xhr.send();
            });
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
})();
