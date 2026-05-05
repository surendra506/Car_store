define([], function () {
    'use strict';

    function clamp(n, min, max) {
        return Math.max(min, Math.min(max, n));
    }

    function safePlay(videoEl) {
        try {
            const result = videoEl.play();
            if (result && typeof result.catch === 'function') {
                return result.catch(function () {
                    return false;
                });
            }
            return Promise.resolve(true);
        } catch (e) {
            return Promise.resolve(false);
        }
    }

    function setSource(videoEl, src, poster) {
        while (videoEl.firstChild) {
            videoEl.removeChild(videoEl.firstChild);
        }

        if (poster) {
            videoEl.setAttribute('poster', poster);
        }

        const sourceEl = document.createElement('source');
        sourceEl.setAttribute('src', src);
        sourceEl.setAttribute('type', 'video/mp4');
        videoEl.appendChild(sourceEl);
        videoEl.load();
    }

    function setMultilineText(el, value) {
        if (!el) {
            return;
        }

        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }

        const text = (value == null) ? '' : String(value);
        const parts = text.split('\n');
        parts.forEach(function (part, idx) {
            el.appendChild(document.createTextNode(part));
            if (idx !== parts.length - 1) {
                el.appendChild(document.createElement('br'));
            }
        });
    }

    return function (config, element) {
        const heroEl = element;
        const slidesEl = heroEl.querySelector('[data-hero-slides]');
        const slideEls = Array.prototype.slice.call(heroEl.querySelectorAll('[data-hero-slide]'));
        const dots = Array.prototype.slice.call(heroEl.querySelectorAll('[data-hero-dot]'));
        const pauseBtn = heroEl.querySelector('[data-hero-pause]');
        const subtitleEl = heroEl.querySelector('[data-hero-subtitle]');
        const titleEl = heroEl.querySelector('[data-hero-title]');
        const ctaEl = heroEl.querySelector('[data-hero-cta]');

        const slides = (config && config.slides) ? config.slides : [];
        const transitionMs = clamp((config && typeof config.transitionMs === 'number') ? config.transitionMs : 700, 150, 3000);
        const imageDurationMs = clamp((config && typeof config.imageDurationMs === 'number') ? config.imageDurationMs : 2200, 800, 20000);

        if (!slidesEl || !slideEls.length) {
            return;
        }

        let currentIndex = 0;
        let userPaused = false;
        let observer = null;
        let imageTimer = null;
        let dragStartX = null;
        let dragDeltaX = 0;

        heroEl.style.setProperty('--hero-transition-ms', transitionMs + 'ms');

        function updateContent(index) {
            const data = slides[index] || {};
            const subtitle = (typeof data.subtitle === 'string') ? data.subtitle : '';
            const title = (typeof data.title === 'string') ? data.title : '';
            const ctaText = (typeof data.ctaText === 'string') ? data.ctaText : 'DISCOVER MORE';
            const ctaHref = (typeof data.ctaHref === 'string') ? data.ctaHref : '#';

            if (subtitleEl) {
                subtitleEl.textContent = subtitle;
                subtitleEl.style.display = subtitle ? '' : 'none';
            }

            setMultilineText(titleEl, title);

            if (ctaEl) {
                ctaEl.setAttribute('href', ctaHref);
                const firstNode = ctaEl.firstChild;
                if (firstNode && firstNode.nodeType === 3) {
                    firstNode.nodeValue = ctaText + ' ';
                } else {
                    ctaEl.insertBefore(document.createTextNode(ctaText + ' '), ctaEl.firstChild);
                }
            }

            heroEl.classList.remove('lambo-hero--content-in');
            window.setTimeout(function () {
                heroEl.classList.add('lambo-hero--content-in');
            }, 60);
        }

        function setActiveDot(index) {
            dots.forEach(function (dotEl) {
                dotEl.classList.toggle('is-active', dotEl.getAttribute('data-hero-dot') === String(index));
            });
        }

        function clearImageTimer() {
            if (imageTimer) {
                window.clearTimeout(imageTimer);
                imageTimer = null;
            }
        }

        function getSlideType(index) {
            const el = slideEls[index];
            return el ? el.getAttribute('data-slide-type') : null;
        }

        function pauseNonActiveVideos() {
            slideEls.forEach(function (el, idx) {
                if (idx === currentIndex) {
                    return;
                }
                const video = el.querySelector('video');
                if (video) {
                    try {
                        video.pause();
                    } catch (e) {}
                }
            });
        }

        function ensureVideoLoaded(videoEl, src) {
            if (!videoEl || videoEl.getAttribute('data-loaded') === '1') {
                return;
            }
            setSource(videoEl, src, '');
            videoEl.setAttribute('data-loaded', '1');
        }

        function setActiveSlide(index, shouldAutoplay) {
            const total = slideEls.length;
            const nextIndex = (index + total) % total;
            currentIndex = nextIndex;

            clearImageTimer();
            pauseNonActiveVideos();

            slideEls.forEach(function (el, idx) {
                const isActive = idx === currentIndex;
                el.classList.toggle('is-active', isActive);
                el.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            });

            setActiveDot(currentIndex);
            updateContent(currentIndex);

            const type = getSlideType(currentIndex);
            const slideCfg = slides[currentIndex] || {};

            if (type === 'image') {
                if (!userPaused && shouldAutoplay) {
                    imageTimer = window.setTimeout(function () {
                        setActiveSlide(currentIndex + 1, true);
                    }, imageDurationMs);
                }
                return;
            }

            if (type === 'video') {
                const activeEl = slideEls[currentIndex];
                const videoEl = activeEl ? activeEl.querySelector('video') : null;
                const src = slideCfg.src || (videoEl ? videoEl.getAttribute('data-src') : '');

                if (!videoEl || !src) {
                    return;
                }

                ensureVideoLoaded(videoEl, src);

                if (!userPaused && shouldAutoplay) {
                    safePlay(videoEl).then(function (ok) {
                        if (!ok) {
                            // Leave the slide visible; user can manually swipe/click dots.
                            return;
                        }
                    });
                }
            }
        }

        function next() {
            setActiveSlide(currentIndex + 1, true);
        }

        function prev() {
            setActiveSlide(currentIndex - 1, true);
        }

        // Video end => next slide
        slideEls.forEach(function (el, idx) {
            const videoEl = el.querySelector('video');
            if (!videoEl) {
                return;
            }

            videoEl.addEventListener('ended', function () {
                if (idx === currentIndex && !userPaused) {
                    next();
                }
            });
        });

        if (pauseBtn) {
            pauseBtn.addEventListener('click', function () {
                userPaused = !userPaused;
                pauseBtn.setAttribute('aria-pressed', userPaused ? 'true' : 'false');

                clearImageTimer();

                const type = getSlideType(currentIndex);
                const activeEl = slideEls[currentIndex];
                const activeVideo = activeEl ? activeEl.querySelector('video') : null;

                if (userPaused) {
                    if (activeVideo) {
                        try {
                            activeVideo.pause();
                        } catch (e) {}
                    }
                    return;
                }

                if (type === 'image') {
                    imageTimer = window.setTimeout(function () {
                        next();
                    }, imageDurationMs);
                    return;
                }

                if (activeVideo) {
                    safePlay(activeVideo).then(function () {
                        return;
                    });
                }
            });
        }

        dots.forEach(function (dotEl) {
            dotEl.addEventListener('click', function () {
                const idx = parseInt(dotEl.getAttribute('data-hero-dot'), 10);
                setActiveSlide(isNaN(idx) ? 0 : idx, true);
            });
        });

        function onPointerDown(clientX) {
            dragStartX = clientX;
            dragDeltaX = 0;
        }

        function onPointerMove(clientX) {
            if (dragStartX === null) {
                return;
            }
            dragDeltaX = clientX - dragStartX;
        }

        function onPointerUp() {
            if (dragStartX === null) {
                return;
            }

            const threshold = 60;
            const dx = dragDeltaX;
            dragStartX = null;
            dragDeltaX = 0;

            if (Math.abs(dx) < threshold) {
                return;
            }

            if (dx < 0) {
                next();
                return;
            }

            prev();
        }

        // Touch swipe
        heroEl.addEventListener('touchstart', function (e) {
            if (!e.touches || !e.touches.length) {
                return;
            }
            onPointerDown(e.touches[0].clientX);
        }, { passive: true });

        heroEl.addEventListener('touchmove', function (e) {
            if (!e.touches || !e.touches.length) {
                return;
            }
            onPointerMove(e.touches[0].clientX);
        }, { passive: true });

        heroEl.addEventListener('touchend', function () {
            onPointerUp();
        });

        // Pause when offscreen to save CPU; resume when back (unless user paused).
        if ('IntersectionObserver' in window) {
            observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        clearImageTimer();
                        pauseNonActiveVideos();
                        const activeEl = slideEls[currentIndex];
                        const activeVideo = activeEl ? activeEl.querySelector('video') : null;
                        if (activeVideo) {
                            try {
                                activeVideo.pause();
                            } catch (e) {}
                        }
                        return;
                    }

                    if (!userPaused) {
                        const type = getSlideType(currentIndex);
                        if (type === 'image') {
                            clearImageTimer();
                            imageTimer = window.setTimeout(function () {
                                next();
                            }, imageDurationMs);
                            return;
                        }

                        const activeEl = slideEls[currentIndex];
                        const activeVideo = activeEl ? activeEl.querySelector('video') : null;
                        if (activeVideo) {
                            safePlay(activeVideo);
                        }
                    }
                });
            }, { threshold: 0.2 });

            observer.observe(heroEl);
        }

        // Initial load
        setActiveSlide(0, true);

        // If autoplay blocked, allow click to start (for video slides)
        heroEl.addEventListener('click', function () {
            const type = getSlideType(currentIndex);
            if (type !== 'video' || userPaused) {
                return;
            }

            const activeEl = slideEls[currentIndex];
            const activeVideo = activeEl ? activeEl.querySelector('video') : null;
            if (!activeVideo || !activeVideo.paused) {
                return;
            }

            safePlay(activeVideo).then(function (ok) {
                if (!ok) {
                    return;
                }
            });
        });
    };
});
