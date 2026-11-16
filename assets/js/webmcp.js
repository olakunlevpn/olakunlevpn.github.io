/**
 * [Olakunlevpn] Agentic Web & WebMCP Bridge
 * Exposes WebMCP tools to autonomous AI agents, enables declarative form annotations,
 * stabilizes page layout against CLS, and enriches the machine-eye accessibility (a11y) tree.
 */
(function(window, document) {
    'use strict';

    var AgenticWeb = {
        config: {
            enabled: true,
            mcpEnabled: true,
            searchEndpoint: '/search.json',
            postsEndpoint: '/api/posts.json',
            ardEndpoint: '/.well-known/ard.json',
            a11yLabels: true,
            antiCls: true
        },

        cachedIndex: null,

        init: function() {
            if (!this.config.enabled) return;

            if (this.config.mcpEnabled) {
                this.initWebMCP();
            }

            if (this.config.a11yLabels) {
                this.initA11yShield();
                this.initObserver();
            }

            if (this.config.antiCls) {
                this.initAntiClsShield();
            }

            this.annotateDeclarativeForms();
        },

        loadIndex: function() {
            var self = this;
            if (self.cachedIndex) {
                return Promise.resolve(self.cachedIndex);
            }
            return fetch(self.config.searchEndpoint, {
                headers: { 'Accept': 'application/json' }
            })
            .then(function(res) {
                if (!res.ok) throw new Error('Failed to load search index');
                return res.json();
            })
            .then(function(data) {
                self.cachedIndex = data;
                return data;
            });
        },

        initWebMCP: function() {
            var self = this;

            var tools = {
                searchBlog: {
                    name: 'searchBlog',
                    description: 'Search blog posts, technical tutorials, and software engineering notes by keyword.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            query: { type: 'string', description: 'Keywords to search' },
                            limit: { type: 'number', description: 'Max results (1-25)', default: 5 }
                        },
                        required: ['query']
                    },
                    execute: function(args) {
                        args = args || {};
                        var q = (args.query || '').trim().toLowerCase();
                        var limit = Math.min(25, Math.max(1, parseInt(args.limit, 10) || 5));

                        if (!q) {
                            return Promise.resolve({ success: false, error: 'Query parameter is required' });
                        }

                        return self.loadIndex().then(function(posts) {
                            var terms = q.split(/\s+/).filter(Boolean);
                            var results = [];

                            for (var i = 0; i < posts.length; i++) {
                                var p = posts[i];
                                var title = (p.title || '').toLowerCase();
                                var tags = (Array.isArray(p.tags) ? p.tags.join(' ') : '').toLowerCase();
                                var excerpt = (p.excerpt || '').toLowerCase();
                                var content = (p.content || '').toLowerCase();

                                var score = 0;
                                for (var t = 0; t < terms.length; t++) {
                                    var term = terms[t];
                                    if (title.indexOf(term) !== -1) score += 10;
                                    if (tags.indexOf(term) !== -1) score += 6;
                                    if (excerpt.indexOf(term) !== -1) score += 3;
                                    if (content.indexOf(term) !== -1) score += 1;
                                }

                                if (score > 0) {
                                    results.push({
                                        score: score,
                                        title: p.title,
                                        url: p.url,
                                        path: p.path,
                                        date: p.date,
                                        tags: p.tags || [],
                                        excerpt: p.excerpt
                                    });
                                }
                            }

                            results.sort(function(a, b) { return b.score - a.score; });
                            var sliced = results.slice(0, limit);

                            return {
                                success: true,
                                query: q,
                                total: results.length,
                                returned: sliced.length,
                                results: sliced
                            };
                        });
                    }
                },

                getRecentPosts: {
                    name: 'getRecentPosts',
                    description: 'Retrieve latest published technical articles with titles, dates, excerpts, and URLs.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            limit: { type: 'number', description: 'Number of articles (1-25)', default: 10 }
                        }
                    },
                    execute: function(args) {
                        args = args || {};
                        var limit = Math.min(25, Math.max(1, parseInt(args.limit, 10) || 10));

                        return self.loadIndex().then(function(posts) {
                            var sliced = posts.slice(0, limit).map(function(p) {
                                return {
                                    title: p.title,
                                    url: p.url,
                                    path: p.path,
                                    date: p.date,
                                    tags: p.tags || [],
                                    excerpt: p.excerpt
                                };
                            });
                            return {
                                success: true,
                                total: posts.length,
                                returned: sliced.length,
                                posts: sliced
                            };
                        });
                    }
                },

                getPost: {
                    name: 'getPost',
                    description: 'Fetch clean structured article content, metadata, and body by URL or pathname.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            url: { type: 'string', description: 'Post pathname or URL (e.g. /2026/11/16/free-xenforo-backups-to-telegram-and-large-sql-restore.html)' }
                        },
                        required: ['url']
                    },
                    execute: function(args) {
                        args = args || {};
                        var target = (args.url || '').trim();
                        if (!target) {
                            return Promise.resolve({ success: false, error: 'Target URL is required' });
                        }

                        // Check if currently viewing the requested post
                        var currentPath = window.location.pathname;
                        if (currentPath === target || target.indexOf(currentPath) !== -1 || (target.length > 5 && currentPath.indexOf(target) !== -1)) {
                            var article = document.querySelector('article.post');
                            if (article) {
                                var titleEl = article.querySelector('.post-title');
                                var metaEl = article.querySelector('.post-meta');
                                var contentEl = article.querySelector('.entry-content');
                                return Promise.resolve({
                                    success: true,
                                    title: titleEl ? titleEl.innerText.trim() : document.title,
                                    date: metaEl ? metaEl.innerText.trim() : '',
                                    url: window.location.href,
                                    content: contentEl ? contentEl.innerText.trim() : article.innerText.trim()
                                });
                            }
                        }

                        // Otherwise fetch from remote endpoint
                        return fetch(target, { headers: { 'Accept': 'text/html' } })
                            .then(function(res) {
                                if (!res.ok) throw new Error('Post not found: ' + res.status);
                                return res.text();
                            })
                            .then(function(html) {
                                var parser = new DOMParser();
                                var doc = parser.parseFromString(html, 'text/html');
                                var article = doc.querySelector('article.post') || doc.querySelector('.post');
                                var title = doc.querySelector('.post-title') ? doc.querySelector('.post-title').innerText.trim() : doc.title;
                                var date = doc.querySelector('.post-meta') ? doc.querySelector('.post-meta').innerText.trim() : '';
                                var content = doc.querySelector('.entry-content') ? doc.querySelector('.entry-content').innerText.trim() : (article ? article.innerText.trim() : '');

                                return {
                                    success: true,
                                    title: title,
                                    date: date,
                                    url: target,
                                    content: content
                                };
                            })
                            .catch(function(err) {
                                return { success: false, error: err.message };
                            });
                    }
                },

                listSkills: {
                    name: 'listSkills',
                    description: 'Retrieve catalog of autonomous AI agent skills and architectural rules published by Olakunlevpn.',
                    inputSchema: { type: 'object', properties: {} },
                    execute: function() {
                        return fetch(self.config.ardEndpoint, {
                            headers: { 'Accept': 'application/json' }
                        })
                        .then(function(res) { return res.json(); })
                        .then(function(ard) {
                            var skills = (ard.entries || []).filter(function(e) {
                                return e.type === 'application/vnd.agent-skill+json' || (e.identifier && e.identifier.indexOf(':skills:') !== -1);
                            });
                            return {
                                success: true,
                                total: skills.length,
                                skills: skills
                            };
                        });
                    }
                },

                getAuthorBio: {
                    name: 'getAuthorBio',
                    description: 'Retrieve Olakunlevpn software engineer profile, specialties, tech stack, and social channels.',
                    inputSchema: { type: 'object', properties: {} },
                    execute: function() {
                        return Promise.resolve({
                            success: true,
                            author: {
                                name: 'Olakunlevpn',
                                role: 'Software Engineer',
                                specialties: [
                                    'Laravel & PHP Architecture',
                                    'JavaScript, React, Vue, Next.js',
                                    'AWS Cloud Infrastructure',
                                    'Autonomous AI Agent Systems & WebMCP',
                                    'Database Disaster Recovery & XenForo Extension Development'
                                ],
                                website: 'https://olakunlevpn.github.io',
                                github: 'https://github.com/olakunlevpn',
                                twitter: 'https://twitter.com/oxkunle',
                                linkedin: 'https://www.linkedin.com/in/olakunlevpn/',
                                email: 'olakunle@maylancer.org'
                            }
                        });
                    }
                }
            };

            // 1. Register with standard W3C navigator.modelContext if supported by the browser agent (Chrome 150+ / WebMCP)
            if (typeof navigator !== 'undefined' && navigator.modelContext && typeof navigator.modelContext.registerTool === 'function') {
                for (var key in tools) {
                    if (tools.hasOwnProperty(key)) {
                        try {
                            navigator.modelContext.registerTool(tools[key]);
                        } catch (e) {
                            console.warn('[WebMCP] navigator.modelContext.registerTool warning:', e);
                        }
                    }
                }
            }

            // 2. Expose global window.__WEBMCP_TOOLS__ and window.WebMCP for script-driven agents and extensions
            window.__WEBMCP_TOOLS__ = tools;
            window.WebMCP = {
                version: '1.0.0',
                tools: tools,
                call: function(toolName, args) {
                    if (tools[toolName] && typeof tools[toolName].execute === 'function') {
                        return tools[toolName].execute(args);
                    }
                    return Promise.reject(new Error('Tool not found: ' + toolName));
                }
            };

            // 3. Dispatch webmcp:ready event
            try {
                window.dispatchEvent(new CustomEvent('webmcp:ready', { detail: { tools: tools } }));
            } catch (e) {}
        },

        initA11yShield: function() {
            // 1. Convert heading elements carrying role="tablist" to div
            var invalidHeadingTabs = document.querySelectorAll('h1[role="tablist"], h2[role="tablist"], h3[role="tablist"], h4[role="tablist"], h5[role="tablist"], h6[role="tablist"]');
            for (var ht = 0; ht < invalidHeadingTabs.length; ht++) {
                var hEl = invalidHeadingTabs[ht];
                var divEl = document.createElement('div');
                for (var att = 0; att < hEl.attributes.length; att++) {
                    divEl.setAttribute(hEl.attributes[att].name, hEl.attributes[att].value);
                }
                while (hEl.firstChild) {
                    divEl.appendChild(hEl.firstChild);
                }
                hEl.parentNode.replaceChild(divEl, hEl);
            }

            // 2. Disallow prohibited role="tabpanel" and aria-expanded on <li> elements
            var invalidLiPanels = document.querySelectorAll('li[role="tabpanel"], li[aria-expanded]');
            for (var lp = 0; lp < invalidLiPanels.length; lp++) {
                var li = invalidLiPanels[lp];
                if (li.getAttribute('role') === 'tabpanel') {
                    li.removeAttribute('role');
                }
                if (li.hasAttribute('aria-expanded')) {
                    li.removeAttribute('aria-expanded');
                }
            }

            // 3. Guard aria-hidden elements from receiving focus
            var hiddenFocusables = document.querySelectorAll('a[aria-hidden="true"], button[aria-hidden="true"], input[aria-hidden="true"], select[aria-hidden="true"], textarea[aria-hidden="true"], [aria-hidden="true"] a, [aria-hidden="true"] button, [aria-hidden="true"] input');
            for (var hf = 0; hf < hiddenFocusables.length; hf++) {
                hiddenFocusables[hf].setAttribute('tabindex', '-1');
            }

            // 4. Ensure all links have discernible text or aria-labels
            var allLinks = document.querySelectorAll('a');
            for (var al = 0; al < allLinks.length; al++) {
                var aLink = allLinks[al];
                var linkText = (aLink.textContent || '').trim();
                if (linkText === '' && !aLink.getAttribute('aria-label')) {
                    var title = aLink.getAttribute('title') || '';
                    if (title) {
                        aLink.setAttribute('aria-label', title);
                    } else {
                        var href = aLink.getAttribute('href') || '';
                        if (href.indexOf('github.com') !== -1) aLink.setAttribute('aria-label', 'GitHub Profile');
                        else if (href.indexOf('twitter.com') !== -1 || href.indexOf('x.com') !== -1) aLink.setAttribute('aria-label', 'Twitter Profile');
                        else if (href.indexOf('instagram.com') !== -1) aLink.setAttribute('aria-label', 'Instagram Profile');
                        else if (href.indexOf('linkedin.com') !== -1) aLink.setAttribute('aria-label', 'LinkedIn Profile');
                        else if (href) aLink.setAttribute('aria-label', 'Link to ' + href);
                    }
                }
            }
        },

        initAntiClsShield: function() {
            // Reserve space for Utterances comments to prevent layout shift during agent browsing
            var commentsArea = document.querySelector('.comments-area');
            if (commentsArea && !commentsArea.style.minHeight) {
                commentsArea.style.minHeight = '280px';
                commentsArea.style.display = 'block';
            }

            // Reserve avatar dimensions if unconstrained
            var avatars = document.querySelectorAll('.profile-img, .author-avatar');
            for (var av = 0; av < avatars.length; av++) {
                var img = avatars[av];
                if (!img.getAttribute('width')) img.setAttribute('width', '120');
                if (!img.getAttribute('height')) img.setAttribute('height', '120');
            }
        },

        annotateDeclarativeForms: function() {
            var forms = document.querySelectorAll('form');
            for (var f = 0; f < forms.length; f++) {
                var form = forms[f];
                var action = form.getAttribute('action') || '';

                if (action.indexOf('search') !== -1 || form.id === 'search' || form.querySelector('input[type="search"]')) {
                    if (!form.hasAttribute('toolname')) {
                        form.setAttribute('toolname', 'search_blog');
                    }
                    if (!form.hasAttribute('tooldescription')) {
                        form.setAttribute('tooldescription', 'Search Olakunlevpn technical articles and tutorials');
                    }

                    var inputs = form.querySelectorAll('input, select, textarea');
                    for (var i = 0; i < inputs.length; i++) {
                        var input = inputs[i];
                        if (!input.hasAttribute('toolparamdescription')) {
                            var pDesc = input.getAttribute('placeholder') || input.getAttribute('aria-label') || 'Keywords or search terms to query';
                            input.setAttribute('toolparamdescription', pDesc);
                        }
                    }
                }
            }
        },

        initObserver: function() {
            if (!window.MutationObserver) return;
            var self = this;
            var observer = new MutationObserver(function() {
                self.initA11yShield();
                self.annotateDeclarativeForms();
                if (self.config.antiCls) {
                    self.initAntiClsShield();
                }
            });

            observer.observe(document.body || document.documentElement, {
                childList: true,
                subtree: true
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { AgenticWeb.init(); });
    } else {
        AgenticWeb.init();
    }
})(window, document);
