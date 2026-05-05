/**
 * Home Slider Video Fix
 *
 * Bypasses Jarallax entirely for YouTube video slides.
 * Directly injects fallback background images and YouTube iframes.
 */
define(['jquery'], function ($) {
    'use strict';

    /**
     * Extract YouTube video ID from various URL formats
     */
    function getYouTubeId(url) {
        if (!url) return null;
        var match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#&?]{11})/);
        return match ? match[1] : null;
    }

    /**
     * Create a YouTube iframe that autoplays muted in a loop
     */
    function createYouTubeIframe(videoId) {
        var iframe = document.createElement('iframe');
        iframe.setAttribute('src',
            'https://www.youtube.com/embed/' + videoId +
            '?autoplay=1&mute=1&loop=1&playlist=' + videoId +
            '&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1'
        );
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'autoplay; encrypted-media');
        iframe.setAttribute('allowfullscreen', '');
        iframe.style.cssText = [
            'position: absolute',
            'top: 50%',
            'left: 50%',
            'width: 100vw',
            'height: 56.25vw',        /* 16:9 aspect ratio */
            'min-height: 100vh',
            'min-width: 177.78vh',     /* 100 * 16/9 */
            'transform: translate(-50%, -50%)',
            'z-index: 0',
            'pointer-events: none',
            'border: 0'
        ].join(' !important;') + ' !important;';
        return iframe;
    }

    /**
     * Set fallback image as CSS background on the wrapper
     */
    function setFallbackBackground(wrapper, fallbackSrc) {
        if (!fallbackSrc) return;
        wrapper.style.setProperty('background-image', 'url("' + fallbackSrc + '")', 'important');
        wrapper.style.setProperty('background-size', 'cover', 'important');
        wrapper.style.setProperty('background-position', 'center center', 'important');
        wrapper.style.setProperty('background-repeat', 'no-repeat', 'important');
    }

    /**
     * Process all video slides — inject fallback bg + YouTube iframe
     */
    function processVideoSlides() {
        var videoWrappers = document.querySelectorAll(
            '[data-background-type="video"][data-video-src]'
        );

        for (var i = 0; i < videoWrappers.length; i++) {
            var wrapper = videoWrappers[i];

            // Skip if already processed
            if (wrapper.getAttribute('data-video-injected') === '1') continue;

            var videoSrc = wrapper.getAttribute('data-video-src');
            var fallbackSrc = wrapper.getAttribute('data-video-fallback-src');
            var videoId = getYouTubeId(videoSrc);

            // 1. Set fallback image as background immediately (visible right away)
            setFallbackBackground(wrapper, fallbackSrc);

            // 2. Prevent Jarallax from hiding our background
            //    (Jarallax removes background-image in its init)
            wrapper.style.setProperty('background-color', 'transparent', 'important');

            // 3. Create a container for our iframe (above background, below text)
            if (videoId) {
                var container = document.createElement('div');
                container.className = 'custom-video-bg';
                container.style.cssText = [
                    'position: absolute',
                    'top: 0',
                    'left: 0',
                    'width: 100%',
                    'height: 100%',
                    'overflow: hidden',
                    'z-index: 0',
                    'pointer-events: none'
                ].join(' !important;') + ' !important;';

                var iframe = createYouTubeIframe(videoId);
                container.appendChild(iframe);

                // Insert as FIRST child so it's below overlay/text in DOM order
                wrapper.insertBefore(container, wrapper.firstChild);
            }

            // 4. Force native <video> elements to autoplay muted & cover
            var nativeVideos = wrapper.querySelectorAll('video');
            for (var v = 0; v < nativeVideos.length; v++) {
                var vid = nativeVideos[v];
                vid.setAttribute('autoplay', '');
                vid.setAttribute('muted', '');
                vid.setAttribute('loop', '');
                vid.setAttribute('playsinline', '');
                vid.muted = true;
                vid.style.setProperty('object-fit', 'cover', 'important');
                vid.style.setProperty('width', '100%', 'important');
                vid.style.setProperty('height', '100%', 'important');
                vid.style.setProperty('position', 'absolute', 'important');
                vid.style.setProperty('inset', '0', 'important');
                try { vid.play(); } catch (e) {}
            }

            wrapper.setAttribute('data-video-injected', '1');
        }

        // General pass: ensure ALL native videos inside .home-slider are properly set
        var allVideos = document.querySelectorAll('.home-slider video');
        for (var j = 0; j < allVideos.length; j++) {
            var el = allVideos[j];
            el.setAttribute('autoplay', '');
            el.setAttribute('muted', '');
            el.setAttribute('loop', '');
            el.setAttribute('playsinline', '');
            el.muted = true;
            if (el.paused) {
                try { el.play(); } catch (e) {}
            }
        }
    }

    /**
     * Also handle the Jarallax container if it gets created — hide it so
     * it doesn't conflict with our direct iframe injection.
     */
    function hideJarallaxContainers() {
        var containers = document.querySelectorAll('[id^="jarallax-container"]');
        for (var i = 0; i < containers.length; i++) {
            containers[i].style.setProperty('display', 'none', 'important');
        }
    }

    // ─── Slider play/pause controls ──────────────────────────

    function isCmsHomeSliderPage() {
        return document.body && document.body.classList.contains('cms-home-slider') ||
            !!document.querySelector('.home-slider .pagebuilder-slider');
    }

    function getActiveSlide($slider) {
        var $active = $slider.find('.slick-slide.slick-current.slick-active');
        return $active.length ? $active : $slider.find('.slick-slide.slick-active').first();
    }

    function ensureControls($slider) {
        if ($slider.data('homeSliderControls') === 1) return;

        var $dots = $slider.find('.slick-dots');
        if (!$dots.length) return;

        var $controls = $('<div class="home-slider__controls" aria-label="Hero controls"></div>');
        var $pauseBtn = $('<button class="home-slider__pause" type="button" aria-label="Pause/Play" aria-pressed="false"></button>');

        $controls.append($dots);
        $controls.append($pauseBtn);
        $slider.append($controls);
        $slider.data('homeSliderControls', 1);

        $pauseBtn.on('click', function () {
            var paused = $pauseBtn.attr('aria-pressed') === 'true';
            paused = !paused;
            $pauseBtn.attr('aria-pressed', paused ? 'true' : 'false');

            if (typeof $slider.slick !== 'function') return;

            if (paused) {
                try { $slider.slick('slickPause'); } catch (e) { }
            } else {
                try { $slider.slick('slickPlay'); } catch (e) { }
            }
        });
    }

    function ensureControlsSoon($slider) {
        var tries = 0;
        var timer = window.setInterval(function () {
            tries += 1;
            if ($slider.data('homeSliderControls') === 1) {
                window.clearInterval(timer);
                return;
            }
            ensureControls($slider);
            if ($slider.data('homeSliderControls') === 1 || tries >= 40) {
                window.clearInterval(timer);
            }
        }, 100);
    }

    function hookSlider($slider) {
        if ($slider.data('homeSliderHooked') === 1) return;
        $slider.data('homeSliderHooked', 1);

        $slider.on('init afterChange', function () {
            ensureControls($slider);
            ensureControlsSoon($slider);
            // Re-process in case Slick cloned slides
            processVideoSlides();
            hideJarallaxContainers();
        });

        if ($slider.hasClass('slick-initialized')) {
            ensureControls($slider);
            ensureControlsSoon($slider);
        }
    }

    function boot() {
        if (!isCmsHomeSliderPage()) return;

        // Process video slides ASAP
        processVideoSlides();
        hideJarallaxContainers();

        // Hook sliders for controls
        var $sliders = $('.home-slider .pagebuilder-slider');
        if (!$sliders.length) $sliders = $('.pagebuilder-slider');

        $sliders.each(function () {
            hookSlider($(this));
        });

        // Retry periodically (Slick/Jarallax init is async)
        var attempts = 0;
        var timer = setInterval(function () {
            processVideoSlides();
            hideJarallaxContainers();
            attempts++;
            if (attempts >= 15) clearInterval(timer);
        }, 500);
    }

    $(boot);
});
