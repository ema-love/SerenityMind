// Serenity - Lottie Animation Configuration
// Manages Lottie animations for healing-centered user experience

(function() {
    'use strict';
    
    // Lottie animation registry
    window.SerenityAnimations = {
        // Animation URLs for different contexts
        animations: {
            hero: 'https://assets5.lottiefiles.com/packages/lf20_lnl5pcrb.json',
            meditation: 'https://assets3.lottiefiles.com/packages/lf20_V9t630.json',
            community: 'https://assets7.lottiefiles.com/packages/lf20_DMgKk1.json',
            wellness: 'https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json',
            breathing: 'https://assets9.lottiefiles.com/packages/lf20_kkflmtur.json',
            success: 'https://assets2.lottiefiles.com/packages/lf20_V9t630.json',
            loading: 'https://assets1.lottiefiles.com/packages/lf20_p8bfn5to.json',
            heart: 'https://assets4.lottiefiles.com/packages/lf20_DMgKk1.json',
            butterfly: 'https://assets6.lottiefiles.com/packages/lf20_kkflmtur.json',
            growth: 'https://assets8.lottiefiles.com/packages/lf20_jcikwtux.json'
        },
        
        // Default animation settings
        defaults: {
            speed: 1,
            loop: true,
            autoplay: true,
            background: 'transparent',
            renderer: 'svg'
        },
        
        // Animation presets for different moods/contexts
        presets: {
            calm: {
                speed: 0.8,
                loop: true,
                autoplay: true
            },
            energetic: {
                speed: 1.2,
                loop: true,
                autoplay: true
            },
            subtle: {
                speed: 0.5,
                loop: true,
                autoplay: true,
                style: 'opacity: 0.6;'
            },
            hero: {
                speed: 1,
                loop: true,
                autoplay: true,
                style: 'width: 100%; height: 400px;'
            },
            background: {
                speed: 0.3,
                loop: true,
                autoplay: true,
                style: 'position: fixed; bottom: -50px; right: -50px; opacity: 0.3; z-index: -1; pointer-events: none;'
            }
        },
        
        // Initialize Lottie animations
        init: function() {
            this.setupAnimationObserver();
            this.setupResponsiveAnimations();
            this.setupAnimationControls();
            this.preloadCriticalAnimations();
        },
        
        // Create Lottie player element
        create: function(containerId, animationUrl, options = {}) {
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn(`Container ${containerId} not found`);
                return null;
            }
            
            const settings = { ...this.defaults, ...options };
            
            const player = document.createElement('lottie-player');
            player.setAttribute('src', animationUrl);
            player.setAttribute('background', settings.background);
            player.setAttribute('speed', settings.speed);
            player.setAttribute('style', settings.style || '');
            
            if (settings.loop) player.setAttribute('loop', '');
            if (settings.autoplay) player.setAttribute('autoplay', '');
            
            container.appendChild(player);
            
            return player;
        },
        
        // Setup intersection observer for performance
        setupAnimationObserver: function() {
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        const player = entry.target;
                        
                        if (entry.isIntersecting) {
                            if (player.tagName === 'LOTTIE-PLAYER') {
                                player.play();
                            }
                        } else {
                            if (player.tagName === 'LOTTIE-PLAYER') {
                                player.pause();
                            }
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '50px'
                });
                
                // Observe existing Lottie players
                document.querySelectorAll('lottie-player').forEach(player => {
                    observer.observe(player);
                });
                
                // Observe future Lottie players
                const mutationObserver = new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) {
                                if (node.tagName === 'LOTTIE-PLAYER') {
                                    observer.observe(node);
                                } else {
                                    node.querySelectorAll?.('lottie-player').forEach(player => {
                                        observer.observe(player);
                                    });
                                }
                            }
                        });
                    });
                });
                
                mutationObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        },
        
        // Setup responsive animation behavior
        setupResponsiveAnimations: function() {
            const handleResize = () => {
                document.querySelectorAll('lottie-player').forEach(player => {
                    const container = player.parentElement;
                    const containerWidth = container.offsetWidth;
                    
                    // Adjust animation size based on container
                    if (containerWidth < 576) {
                        player.style.width = '100%';
                        player.style.height = 'auto';
                        player.style.maxHeight = '200px';
                    } else if (containerWidth < 768) {
                        player.style.maxHeight = '300px';
                    } else {
                        player.style.maxHeight = '400px';
                    }
                    
                    // Reduce animation speed on mobile for battery life
                    if (window.innerWidth < 768) {
                        player.setSpeed(0.8);
                    } else {
                        player.setSpeed(1);
                    }
                });
            };
            
            window.addEventListener('resize', this.debounce(handleResize, 250));
            handleResize(); // Initial call
        },
        
        // Setup animation controls
        setupAnimationControls: function() {
            // Pause animations when page is not visible
            document.addEventListener('visibilitychange', () => {
                document.querySelectorAll('lottie-player').forEach(player => {
                    if (document.hidden) {
                        player.pause();
                    } else {
                        player.play();
                    }
                });
            });
            
            // Respect user's motion preferences
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.querySelectorAll('lottie-player').forEach(player => {
                    player.removeAttribute('autoplay');
                    player.setSpeed(0.5);
                });
            }
            
            // Add play/pause controls for accessibility
            document.querySelectorAll('lottie-player').forEach((player, index) => {
                if (!player.hasAttribute('data-no-controls')) {
                    const controls = document.createElement('div');
                    controls.className = 'lottie-controls visually-hidden-focusable';
                    controls.style.cssText = `
                        position: absolute;
                        top: 5px;
                        right: 5px;
                        z-index: 10;
                        background: rgba(0, 0, 0, 0.7);
                        border-radius: 4px;
                        padding: 4px;
                    `;
                    
                    const playPauseBtn = document.createElement('button');
                    playPauseBtn.className = 'btn btn-sm text-white';
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    playPauseBtn.setAttribute('aria-label', 'Pause animation');
                    
                    let isPlaying = true;
                    playPauseBtn.addEventListener('click', () => {
                        if (isPlaying) {
                            player.pause();
                            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                            playPauseBtn.setAttribute('aria-label', 'Play animation');
                        } else {
                            player.play();
                            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                            playPauseBtn.setAttribute('aria-label', 'Pause animation');
                        }
                        isPlaying = !isPlaying;
                    });
                    
                    controls.appendChild(playPauseBtn);
                    
                    // Position controls relative to player
                    player.parentElement.style.position = 'relative';
                    player.parentElement.appendChild(controls);
                }
            });
        },
        
        // Preload critical animations
        preloadCriticalAnimations: function() {
            const criticalAnimations = [
                this.animations.hero,
                this.animations.loading,
                this.animations.wellness
            ];
            
            criticalAnimations.forEach(url => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = url;
                link.as = 'fetch';
                link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
            });
        },
        
        // Create mood-responsive animations
        createMoodAnimation: function(containerId, mood = 'calm') {
            const moodAnimations = {
                happy: this.animations.success,
                calm: this.animations.meditation,
                energetic: this.animations.growth,
                sad: this.animations.wellness,
                anxious: this.animations.breathing,
                excited: this.animations.heart
            };
            
            const animationUrl = moodAnimations[mood] || this.animations.meditation;
            const preset = this.presets[mood] || this.presets.calm;
            
            return this.create(containerId, animationUrl, preset);
        },
        
        // Create wellness milestone animations
        createMilestoneAnimation: function(containerId, milestone) {
            const milestoneAnimations = {
                'first-entry': this.animations.growth,
                'week-streak': this.animations.success,
                'month-milestone': this.animations.heart,
                'assessment-complete': this.animations.butterfly,
                'community-join': this.animations.community
            };
            
            const animationUrl = milestoneAnimations[milestone] || this.animations.success;
            
            const player = this.create(containerId, animationUrl, {
                ...this.presets.energetic,
                loop: false,
                style: 'width: 120px; height: 120px;'
            });
            
            // Auto-remove after animation completes
            if (player) {
                player.addEventListener('complete', () => {
                    setTimeout(() => {
                        if (player.parentElement) {
                            player.remove();
                        }
                    }, 2000);
                });
            }
            
            return player;
        },
        
        // Create loading animation
        createLoadingAnimation: function(containerId, message = 'Loading...') {
            const container = document.getElementById(containerId);
            if (!container) return null;
            
            container.innerHTML = `
                <div class="text-center py-4">
                    <lottie-player
                        src="${this.animations.loading}"
                        background="transparent"
                        speed="1.2"
                        style="width: 80px; height: 80px; margin: 0 auto;"
                        loop
                        autoplay>
                    </lottie-player>
                    <p class="text-muted mt-2">${message}</p>
                </div>
            `;
            
            return container.querySelector('lottie-player');
        },
        
        // Create floating background animation
        createFloatingAnimation: function(animationType = 'wellness') {
            const existingFloating = document.querySelector('.floating-serenity-animation');
            if (existingFloating) {
                existingFloating.remove();
            }
            
            const floatingDiv = document.createElement('div');
            floatingDiv.className = 'floating-serenity-animation';
            floatingDiv.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                pointer-events: none;
                z-index: -1;
                opacity: 0.4;
                transition: opacity 0.3s ease;
            `;
            
            const player = document.createElement('lottie-player');
            player.setAttribute('src', this.animations[animationType] || this.animations.wellness);
            player.setAttribute('background', 'transparent');
            player.setAttribute('speed', '0.8');
            player.setAttribute('style', 'width: 150px; height: 150px;');
            player.setAttribute('loop', '');
            player.setAttribute('autoplay', '');
            
            floatingDiv.appendChild(player);
            document.body.appendChild(floatingDiv);
            
            // Hide on mobile for performance
            if (window.innerWidth < 768) {
                floatingDiv.style.display = 'none';
            }
            
            return player;
        },
        
        // Utility: Debounce function
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Get animation for current page context
        getContextualAnimation: function() {
            const path = window.location.pathname;
            
            if (path === '/' || path === '/index') return 'hero';
            if (path.includes('dashboard')) return 'wellness';
            if (path.includes('chat')) return 'community';
            if (path.includes('assessment')) return 'meditation';
            if (path.includes('register') || path.includes('login')) return 'breathing';
            
            return 'wellness'; // default
        },
        
        // Show success animation
        showSuccessAnimation: function(container, callback) {
            if (typeof container === 'string') {
                container = document.getElementById(container);
            }
            
            if (!container) return;
            
            const originalContent = container.innerHTML;
            
            container.innerHTML = `
                <div class="text-center">
                    <lottie-player
                        src="${this.animations.success}"
                        background="transparent"
                        speed="1"
                        style="width: 100px; height: 100px; margin: 0 auto;"
                        autoplay>
                    </lottie-player>
                    <p class="text-success mt-2"><strong>Success!</strong></p>
                </div>
            `;
            
            setTimeout(() => {
                container.innerHTML = originalContent;
                if (callback) callback();
            }, 3000);
        },
        
        // Wellness journey animation based on progress
        createJourneyAnimation: function(containerId, progressData) {
            const container = document.getElementById(containerId);
            if (!container) return null;
            
            const { moodEntries = 0, habitsCompleted = 0, daysActive = 0 } = progressData;
            
            let animationType = 'meditation';
            let speed = 1;
            
            // Determine animation based on progress
            if (daysActive > 30) {
                animationType = 'heart';
                speed = 1.2;
            } else if (habitsCompleted > 10) {
                animationType = 'growth';
                speed = 1.1;
            } else if (moodEntries > 5) {
                animationType = 'wellness';
                speed = 1;
            }
            
            return this.create(containerId, this.animations[animationType], {
                speed: speed,
                style: 'width: 200px; height: 200px;'
            });
        }
    };
    
    // Auto-initialize when Lottie player is available
    function initWhenReady() {
        if (typeof LottiePlayer !== 'undefined' || document.querySelector('lottie-player')) {
            SerenityAnimations.init();
            
            // Create contextual floating animation
            setTimeout(() => {
                const contextAnimation = SerenityAnimations.getContextualAnimation();
                SerenityAnimations.createFloatingAnimation(contextAnimation);
            }, 1000);
        } else {
            setTimeout(initWhenReady, 100);
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWhenReady);
    } else {
        initWhenReady();
    }
    
    // Expose global helper function
    window.createSerenityAnimation = function(containerId, type = 'wellness', options = {}) {
        return SerenityAnimations.create(containerId, SerenityAnimations.animations[type], options);
    };
    
    // Add CSS for animation controls
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .lottie-controls {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .lottie-controls:focus-within,
        .lottie-controls:hover {
            opacity: 1;
        }
        
        .floating-serenity-animation:hover {
            opacity: 0.6;
        }
        
        @media (prefers-reduced-motion: reduce) {
            lottie-player {
                animation-play-state: paused !important;
            }
        }
        
        @media (max-width: 768px) {
            .floating-serenity-animation {
                display: none !important;
            }
            
            lottie-player {
                max-width: 100%;
                height: auto !important;
            }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
            .lottie-controls {
                background: rgba(0, 0, 0, 0.9) !important;
                border: 1px solid white;
            }
        }
        
        /* Battery saving mode */
        @media (max-resolution: 1dppx) {
            lottie-player {
                will-change: auto;
            }
        }
    `;
    
    document.head.appendChild(animationStyles);
    
})();
