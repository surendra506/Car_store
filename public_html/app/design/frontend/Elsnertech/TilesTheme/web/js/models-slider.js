define([], function () {
    'use strict';

    function clamp(n, min, max) {
        return Math.max(min, Math.min(max, n));
    }

    return function (config, element) {
        const root = element;
        const transitionMs = clamp((config && typeof config.transitionMs === 'number') ? config.transitionMs : 500, 150, 3000);
        const autoplayMs = clamp((config && typeof config.autoplayMs === 'number') ? config.autoplayMs : 5000, 1200, 60000);

        const slideEls = Array.prototype.slice.call(root.querySelectorAll('[data-model-slide]'));
        const prevBtn = root.querySelector('[data-models-prev]');
        const nextBtn = root.querySelector('[data-models-next]');
        const tabEls = Array.prototype.slice.call(root.querySelectorAll('[data-models-tab]'));

        if (!slideEls.length) {
            return;
        }

        let currentIndex = 0;
        let timer = null;
        let userPaused = false;
        let dragStartX = null;
        let dragDeltaX = 0;

        root.style.setProperty('--models-transition-ms', transitionMs + 'ms');

        function clearTimer() {
            if (timer) {
                window.clearTimeout(timer);
                timer = null;
            }
        }

        function scheduleNext() {
            clearTimer();
            if (userPaused || autoplayMs <= 0) {
                return;
            }
            timer = window.setTimeout(function () {
                setActiveSlide(currentIndex + 1);
            }, autoplayMs);
        }

        function setActiveTab(index) {
            tabEls.forEach(function (tabEl) {
                tabEl.classList.toggle('is-active', tabEl.getAttribute('data-models-tab') === String(index));
            });
        }

        function setActiveSlide(index) {
            const total = slideEls.length;
            currentIndex = (index + total) % total;

            slideEls.forEach(function (el, idx) {
                const isActive = idx === currentIndex;
                el.classList.toggle('is-active', isActive);
                el.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            });

            setActiveTab(currentIndex);
            scheduleNext();
        }

        function next() {
            setActiveSlide(currentIndex + 1);
        }

        function prev() {
            setActiveSlide(currentIndex - 1);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                userPaused = true;
                prev();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                userPaused = true;
                next();
            });
        }

        tabEls.forEach(function (tabEl) {
            tabEl.addEventListener('click', function () {
                const idx = parseInt(tabEl.getAttribute('data-models-tab'), 10);
                if (!isNaN(idx)) {
                    userPaused = true;
                    setActiveSlide(idx);
                }
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

            userPaused = true;

            if (dx < 0) {
                next();
                return;
            }

            prev();
        }

        root.addEventListener('touchstart', function (e) {
            if (!e.touches || !e.touches.length) {
                return;
            }
            onPointerDown(e.touches[0].clientX);
        }, { passive: true });

        root.addEventListener('touchmove', function (e) {
            if (!e.touches || !e.touches.length) {
                return;
            }
            onPointerMove(e.touches[0].clientX);
        }, { passive: true });

        root.addEventListener('touchend', function () {
            onPointerUp();
        });

        root.addEventListener('mouseenter', function () {
            clearTimer();
        });

        root.addEventListener('mouseleave', function () {
            scheduleNext();
        });

        root.addEventListener('focusin', function () {
            clearTimer();
        });

        root.addEventListener('focusout', function () {
            scheduleNext();
        });

        // Initial state
        setActiveSlide(0);
    };
});
