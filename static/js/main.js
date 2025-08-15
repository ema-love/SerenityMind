// Serenity - Main JavaScript File
// Healing-centered interactions and functionality

(function() {
    'use strict';
    
    // Global Serenity namespace
    window.Serenity = {
        // Configuration
        config: {
            animationDuration: 300,
            debounceDelay: 250,
            autoSaveDelay: 2000,
            affirmationInterval: 600000, // 10 minutes
            notifications: {
                duration: 5000,
                position: 'top-right'
            }
        },
        
        // Utility functions
        utils: {},
        
        // Feature modules
        modules: {},
        
        // Event handlers
        events: {},
        
        // Initialize everything
        init: function() {
            this.utils.init();
            this.modules.init();
            this.events.init();
            
            // Show welcome message for first-time visitors
            if (!localStorage.getItem('serenity-visited')) {
                this.modules.notifications.show('Welcome to Serenity! 🌸 Your safe space for healing.', 'info');
                localStorage.setItem('serenity-visited', 'true');
            }
        }
    };
    
    // Utility Functions
    Serenity.utils = {
        init: function() {
            this.setupGlobalErrorHandling();
            this.setupAccessibility();
            this.setupPerformanceOptimizations();
        },
        
        // Debounce function for performance
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
        
        // Throttle function for scroll events
        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        // Local storage with error handling
        storage: {
            set: function(key, value) {
                try {
                    localStorage.setItem(`serenity-${key}`, JSON.stringify(value));
                    return true;
                } catch (e) {
                    console.warn('Storage not available:', e);
                    return false;
                }
            },
            
            get: function(key, defaultValue = null) {
                try {
                    const item = localStorage.getItem(`serenity-${key}`);
                    return item ? JSON.parse(item) : defaultValue;
                } catch (e) {
                    console.warn('Error reading from storage:', e);
                    return defaultValue;
                }
            },
            
            remove: function(key) {
                try {
                    localStorage.removeItem(`serenity-${key}`);
                    return true;
                } catch (e) {
                    console.warn('Error removing from storage:', e);
                    return false;
                }
            }
        },
        
        // Animation helpers
        animate: {
            fadeIn: function(element, duration = 300) {
                element.style.opacity = '0';
                element.style.display = 'block';
                
                const start = performance.now();
                
                function tick(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    element.style.opacity = progress;
                    
                    if (progress < 1) {
                        requestAnimationFrame(tick);
                    }
                }
                
                requestAnimationFrame(tick);
            },
            
            slideUp: function(element, duration = 300) {
                const height = element.offsetHeight;
                element.style.height = height + 'px';
                element.style.overflow = 'hidden';
                element.style.transition = `height ${duration}ms ease-out`;
                
                requestAnimationFrame(() => {
                    element.style.height = '0px';
                    
                    setTimeout(() => {
                        element.style.display = 'none';
                        element.style.height = '';
                        element.style.overflow = '';
                        element.style.transition = '';
                    }, duration);
                });
            },
            
            pulse: function(element, duration = 1000) {
                element.style.animation = `pulse ${duration}ms ease-in-out`;
                setTimeout(() => {
                    element.style.animation = '';
                }, duration);
            }
        },
        
        // Accessibility enhancements
        setupAccessibility: function() {
            // Add skip to main content link
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-link visually-hidden-focusable';
            skipLink.textContent = 'Skip to main content';
            skipLink.style.cssText = `
                position: absolute;
                top: -40px;
                left: 6px;
                background: #007bff;
                color: white;
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                z-index: 9999;
            `;
            
            skipLink.addEventListener('focus', function() {
                this.style.top = '6px';
            });
            
            skipLink.addEventListener('blur', function() {
                this.style.top = '-40px';
            });
            
            document.body.insertBefore(skipLink, document.body.firstChild);
            
            // Ensure main content has id
            const main = document.querySelector('main') || document.querySelector('.main-content');
            if (main && !main.id) {
                main.id = 'main-content';
            }
            
            // Add aria-labels to buttons without text
            document.querySelectorAll('button').forEach(button => {
                if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
                    const icon = button.querySelector('i');
                    if (icon) {
                        const iconClass = icon.className;
                        if (iconClass.includes('fa-heart')) button.setAttribute('aria-label', 'Like');
                        else if (iconClass.includes('fa-share')) button.setAttribute('aria-label', 'Share');
                        else if (iconClass.includes('fa-edit')) button.setAttribute('aria-label', 'Edit');
                        else if (iconClass.includes('fa-delete')) button.setAttribute('aria-label', 'Delete');
                        else if (iconClass.includes('fa-close')) button.setAttribute('aria-label', 'Close');
                    }
                }
            });
        },
        
        // Error handling
        setupGlobalErrorHandling: function() {
            window.addEventListener('error', function(e) {
                console.error('Global error:', e.error);
                
                // Show user-friendly error message
                Serenity.modules.notifications.show(
                    'Something went wrong. Please try refreshing the page.', 
                    'error'
                );
            });
            
            window.addEventListener('unhandledrejection', function(e) {
                console.error('Unhandled promise rejection:', e.reason);
            });
        },
        
        // Performance optimizations
        setupPerformanceOptimizations: function() {
            // Lazy load images
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                                observer.unobserve(img);
                            }
                        }
                    });
                });
                
                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
            
            // Preload critical resources
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.href = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
            preloadLink.as = 'script';
            document.head.appendChild(preloadLink);
        }
    };
    
    // Feature Modules
    Serenity.modules = {
        init: function() {
            this.notifications.init();
            this.forms.init();
            this.tracking.init();
            this.wellness.init();
            this.darkMode.init();
            this.animations.init();
        },
        
        // Notification system
        notifications: {
            container: null,
            
            init: function() {
                this.createContainer();
            },
            
            createContainer: function() {
                if (this.container) return;
                
                this.container = document.createElement('div');
                this.container.className = 'notification-container';
                this.container.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    pointer-events: none;
                `;
                document.body.appendChild(this.container);
            },
            
            show: function(message, type = 'info', duration = 5000) {
                const notification = document.createElement('div');
                notification.className = `notification notification-${type}`;
                notification.style.cssText = `
                    background: white;
                    border-radius: 12px;
                    padding: 16px 20px;
                    margin-bottom: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    border-left: 4px solid ${this.getColor(type)};
                    pointer-events: auto;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    max-width: 350px;
                    word-wrap: break-word;
                `;
                
                const icon = this.getIcon(type);
                notification.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="${icon}" style="color: ${this.getColor(type)}; font-size: 18px;"></i>
                        <span style="flex: 1; font-weight: 500;">${message}</span>
                        <button onclick="this.parentElement.parentElement.remove()" 
                                style="background: none; border: none; color: #999; cursor: pointer; padding: 0;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                
                this.container.appendChild(notification);
                
                // Animate in
                requestAnimationFrame(() => {
                    notification.style.transform = 'translateX(0)';
                });
                
                // Auto remove
                if (duration > 0) {
                    setTimeout(() => {
                        if (notification.parentElement) {
                            notification.style.transform = 'translateX(100%)';
                            setTimeout(() => notification.remove(), 300);
                        }
                    }, duration);
                }
            },
            
            getColor: function(type) {
                const colors = {
                    success: '#28a745',
                    error: '#dc3545',
                    warning: '#ffc107',
                    info: '#17a2b8'
                };
                return colors[type] || colors.info;
            },
            
            getIcon: function(type) {
                const icons = {
                    success: 'fas fa-check-circle',
                    error: 'fas fa-exclamation-circle',
                    warning: 'fas fa-exclamation-triangle',
                    info: 'fas fa-info-circle'
                };
                return icons[type] || icons.info;
            }
        },
        
        // Form enhancements
        forms: {
            init: function() {
                this.setupValidation();
                this.setupAutoSave();
                this.setupCharacterCounts();
                this.setupPasswordStrength();
            },
            
            setupValidation: function() {
                document.querySelectorAll('form').forEach(form => {
                    form.addEventListener('submit', function(e) {
                        const isValid = Serenity.modules.forms.validateForm(this);
                        if (!isValid) {
                            e.preventDefault();
                        }
                    });
                });
            },
            
            validateForm: function(form) {
                let isValid = true;
                const requiredFields = form.querySelectorAll('[required]');
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        this.showFieldError(field, 'This field is required');
                        isValid = false;
                    } else {
                        this.clearFieldError(field);
                    }
                });
                
                return isValid;
            },
            
            showFieldError: function(field, message) {
                this.clearFieldError(field);
                
                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error text-danger small mt-1';
                errorDiv.textContent = message;
                
                field.parentNode.appendChild(errorDiv);
                field.classList.add('is-invalid');
            },
            
            clearFieldError: function(field) {
                const existingError = field.parentNode.querySelector('.field-error');
                if (existingError) {
                    existingError.remove();
                }
                field.classList.remove('is-invalid');
            },
            
            setupAutoSave: function() {
                const textareas = document.querySelectorAll('textarea[data-autosave]');
                
                textareas.forEach(textarea => {
                    const saveKey = textarea.dataset.autosave;
                    
                    // Load saved content
                    const saved = Serenity.utils.storage.get(`autosave-${saveKey}`);
                    if (saved && !textarea.value.trim()) {
                        textarea.value = saved;
                    }
                    
                    // Auto-save on input
                    const debouncedSave = Serenity.utils.debounce(() => {
                        Serenity.utils.storage.set(`autosave-${saveKey}`, textarea.value);
                    }, Serenity.config.autoSaveDelay);
                    
                    textarea.addEventListener('input', debouncedSave);
                    
                    // Clear auto-save on form submit
                    const form = textarea.closest('form');
                    if (form) {
                        form.addEventListener('submit', () => {
                            Serenity.utils.storage.remove(`autosave-${saveKey}`);
                        });
                    }
                });
            },
            
            setupCharacterCounts: function() {
                document.querySelectorAll('textarea[maxlength], input[maxlength]').forEach(field => {
                    const maxLength = parseInt(field.getAttribute('maxlength'));
                    
                    if (!field.parentNode.querySelector('.character-count')) {
                        const counter = document.createElement('small');
                        counter.className = 'character-count text-muted';
                        field.parentNode.appendChild(counter);
                        
                        const updateCounter = () => {
                            const current = field.value.length;
                            counter.textContent = `${current}/${maxLength}`;
                            
                            if (current > maxLength * 0.9) {
                                counter.className = 'character-count text-warning';
                            } else if (current > maxLength * 0.95) {
                                counter.className = 'character-count text-danger';
                            } else {
                                counter.className = 'character-count text-muted';
                            }
                        };
                        
                        field.addEventListener('input', updateCounter);
                        updateCounter();
                    }
                });
            },
            
            setupPasswordStrength: function() {
                document.querySelectorAll('input[type="password"]').forEach(password => {
                    if (password.name === 'password' && !password.parentNode.querySelector('.password-strength')) {
                        const strengthIndicator = document.createElement('div');
                        strengthIndicator.className = 'password-strength mt-2';
                        password.parentNode.appendChild(strengthIndicator);
                        
                        password.addEventListener('input', () => {
                            const strength = this.calculatePasswordStrength(password.value);
                            this.updatePasswordStrengthUI(strengthIndicator, strength);
                        });
                    }
                });
            },
            
            calculatePasswordStrength: function(password) {
                let score = 0;
                if (password.length >= 8) score++;
                if (password.match(/[a-z]/)) score++;
                if (password.match(/[A-Z]/)) score++;
                if (password.match(/[0-9]/)) score++;
                if (password.match(/[^a-zA-Z0-9]/)) score++;
                
                return {
                    score: score,
                    level: ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][score] || 'Very Weak',
                    color: ['danger', 'warning', 'info', 'success', 'success'][score] || 'danger'
                };
            },
            
            updatePasswordStrengthUI: function(container, strength) {
                if (strength.score === 0) {
                    container.innerHTML = '';
                    return;
                }
                
                container.innerHTML = `
                    <div class="d-flex align-items-center gap-2">
                        <div class="flex-grow-1">
                            <div class="progress" style="height: 4px;">
                                <div class="progress-bar bg-${strength.color}" 
                                     style="width: ${(strength.score / 5) * 100}%"></div>
                            </div>
                        </div>
                        <small class="text-${strength.color}">${strength.level}</small>
                    </div>
                `;
            }
        },
        
        // Wellness tracking features
        tracking: {
            init: function() {
                this.setupMoodScale();
                this.setupHabitTracking();
                this.setupEmotionIntensity();
            },
            
            setupMoodScale: function() {
                document.querySelectorAll('.mood-scale input[type="radio"]').forEach(radio => {
                    radio.addEventListener('change', function() {
                        const value = parseInt(this.value);
                        const buttons = this.closest('.mood-scale').querySelectorAll('.mood-btn');
                        
                        buttons.forEach((btn, index) => {
                            btn.classList.remove('btn-primary', 'btn-success', 'btn-warning', 'btn-danger');
                            
                            if (index < value) {
                                if (value <= 3) btn.classList.add('btn-danger');
                                else if (value <= 6) btn.classList.add('btn-warning');
                                else btn.classList.add('btn-success');
                            } else {
                                btn.classList.add('btn-outline-primary');
                            }
                        });
                    });
                });
            },
            
            setupHabitTracking: function() {
                document.querySelectorAll('.habit-item input[type="checkbox"]').forEach(checkbox => {
                    checkbox.addEventListener('change', function() {
                        const item = this.closest('.habit-item');
                        if (this.checked) {
                            item.classList.add('completed');
                            Serenity.modules.notifications.show('Great job! Habit completed! 🌟', 'success');
                        } else {
                            item.classList.remove('completed');
                        }
                    });
                });
            },
            
            setupEmotionIntensity: function() {
                document.querySelectorAll('.intensity-scale input[type="radio"]').forEach(radio => {
                    radio.addEventListener('change', function() {
                        const value = parseInt(this.value);
                        const buttons = this.closest('.intensity-scale').querySelectorAll('.intensity-btn');
                        
                        buttons.forEach((btn, index) => {
                            btn.classList.remove('btn-danger', 'btn-outline-danger');
                            
                            if (index < value) {
                                btn.classList.add('btn-danger');
                            } else {
                                btn.classList.add('btn-outline-danger');
                            }
                        });
                    });
                });
            }
        },
        
        // Wellness affirmations and encouragement
        wellness: {
            affirmations: [
                "You are stronger than you know. 💪",
                "Your feelings are valid and important. 💝",
                "Healing is not linear, and that's okay. 🌱",
                "You deserve love and compassion. 💕",
                "Every small step forward matters. 👣",
                "You are worthy of support and care. 🤗",
                "Your story matters, and so do you. 📖",
                "It's okay to not be okay sometimes. 🫂",
                "You have survived difficult times before. 🌟",
                "Your courage to seek help is inspiring. 🦋"
            ],
            
            init: function() {
                this.setupAffirmationSystem();
                this.setupBreathingExercise();
                this.setupEncouragement();
            },
            
            setupAffirmationSystem: function() {
                // Show periodic affirmations
                setInterval(() => {
                    if (document.hasFocus()) {
                        this.showRandomAffirmation();
                    }
                }, Serenity.config.affirmationInterval);
            },
            
            showRandomAffirmation: function() {
                const affirmation = this.affirmations[Math.floor(Math.random() * this.affirmations.length)];
                
                const modal = document.createElement('div');
                modal.className = 'affirmation-modal';
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                
                modal.innerHTML = `
                    <div style="background: white; border-radius: 20px; padding: 40px; max-width: 400px; text-align: center; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
                        <div style="font-size: 60px; margin-bottom: 20px;">🌸</div>
                        <h3 style="color: #4A90E2; margin-bottom: 20px;">Gentle Reminder</h3>
                        <p style="font-size: 18px; line-height: 1.6; margin-bottom: 30px;">${affirmation}</p>
                        <button onclick="this.closest('.affirmation-modal').remove()" 
                                style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-weight: 500; cursor: pointer;">
                            Thank you 💜
                        </button>
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                requestAnimationFrame(() => {
                    modal.style.opacity = '1';
                });
                
                // Auto-close after 10 seconds
                setTimeout(() => {
                    if (modal.parentElement) {
                        modal.style.opacity = '0';
                        setTimeout(() => modal.remove(), 300);
                    }
                }, 10000);
            },
            
            setupBreathingExercise: function() {
                // Add breathing exercise trigger
                const breathingButton = document.createElement('button');
                breathingButton.className = 'breathing-exercise-btn';
                breathingButton.innerHTML = '<i class="fas fa-wind"></i>';
                breathingButton.style.cssText = `
                    position: fixed;
                    bottom: 100px;
                    right: 30px;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
                    border: none;
                    color: #4A90E2;
                    font-size: 20px;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    z-index: 1000;
                    transition: transform 0.3s ease;
                    animation: breathingPulse 4s ease-in-out infinite;
                `;
                
                breathingButton.addEventListener('click', this.startBreathingExercise);
                document.body.appendChild(breathingButton);
                
                // Add breathing animation
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes breathingPulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                `;
                document.head.appendChild(style);
            },
            
            startBreathingExercise: function() {
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                `;
                
                modal.innerHTML = `
                    <div style="text-align: center; color: #2C3E50;">
                        <h2 style="margin-bottom: 30px; font-weight: 300;">Breathing Exercise</h2>
                        <div id="breathingCircle" style="width: 200px; height: 200px; border-radius: 50%; background: rgba(255, 255, 255, 0.8); margin: 0 auto 30px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 300; transition: transform 4s ease-in-out;"></div>
                        <p id="breathingInstruction" style="font-size: 20px; margin-bottom: 30px;"></p>
                        <button onclick="this.parentElement.parentElement.remove()" style="background: rgba(255, 255, 255, 0.8); border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer;">Close</button>
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                requestAnimationFrame(() => {
                    modal.style.opacity = '1';
                });
                
                // Start breathing cycle
                const circle = modal.querySelector('#breathingCircle');
                const instruction = modal.querySelector('#breathingInstruction');
                
                if (!circle || !instruction) return;
                
                let cycle = 0;
                const breathingCycle = () => {
                    // Inhale
                    instruction.textContent = 'Breathe in...';
                    circle.style.transform = 'scale(1.5)';
                    circle.textContent = 'Inhale';
                    
                    setTimeout(() => {
                        // Hold
                        instruction.textContent = 'Hold...';
                        circle.textContent = 'Hold';
                    }, 2000);
                    
                    setTimeout(() => {
                        // Exhale
                        instruction.textContent = 'Breathe out...';
                        circle.style.transform = 'scale(1)';
                        circle.textContent = 'Exhale';
                    }, 4000);
                    
                    setTimeout(() => {
                        cycle++;
                        if (cycle < 5 && modal.parentElement) {
                            breathingCycle();
                        } else if (modal.parentElement) {
                            instruction.textContent = 'Well done! 🌸';
                            circle.textContent = '💚';
                        }
                    }, 6000);
                };
                
                setTimeout(breathingCycle, 1000);
            },
            
            setupEncouragement: function() {
                // Show encouragement when user completes actions
                document.addEventListener('submit', function(e) {
                    if (e.target.matches('form')) {
                        setTimeout(() => {
                            const encouragement = [
                                "You're making great progress! 🌟",
                                "Keep up the amazing work! 💪",
                                "Every step counts in your journey! 🚶‍♀️",
                                "You're being so brave! 🦋",
                                "Your self-care matters! 💕"
                            ];
                            
                            const message = encouragement[Math.floor(Math.random() * encouragement.length)];
                            Serenity.modules.notifications.show(message, 'success');
                        }, 500);
                    }
                });
            }
        },
        
        // Dark mode functionality
        darkMode: {
            init: function() {
                this.loadPreference();
                this.setupToggle();
            },
            
            loadPreference: function() {
                const isDark = Serenity.utils.storage.get('dark-mode', false);
                if (isDark) {
                    this.enable();
                }
            },
            
            setupToggle: function() {
                document.addEventListener('click', function(e) {
                    if (e.target.matches('[data-bs-toggle="dark-mode"]') || 
                        e.target.closest('[data-bs-toggle="dark-mode"]')) {
                        e.preventDefault();
                        Serenity.modules.darkMode.toggle();
                    }
                });
            },
            
            toggle: function() {
                const html = document.documentElement;
                const isDark = html.getAttribute('data-bs-theme') === 'dark';
                
                if (isDark) {
                    this.disable();
                } else {
                    this.enable();
                }
            },
            
            enable: function() {
                document.documentElement.setAttribute('data-bs-theme', 'dark');
                Serenity.utils.storage.set('dark-mode', true);
                this.updateToggleButtons(true);
            },
            
            disable: function() {
                document.documentElement.setAttribute('data-bs-theme', 'light');
                Serenity.utils.storage.set('dark-mode', false);
                this.updateToggleButtons(false);
            },
            
            updateToggleButtons: function(isDark) {
                document.querySelectorAll('[data-bs-toggle="dark-mode"]').forEach(button => {
                    const icon = button.querySelector('i');
                    const text = button.querySelector('.btn-text');
                    
                    if (icon) {
                        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
                    }
                    
                    if (text) {
                        text.textContent = isDark ? 'Light Mode' : 'Dark Mode';
                    }
                });
            }
        },
        
        // Animation controllers
        animations: {
            init: function() {
                this.setupScrollAnimations();
                this.setupHoverEffects();
                this.setupLoadingStates();
            },
            
            setupScrollAnimations: function() {
                if ('IntersectionObserver' in window) {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.classList.add('animate-in');
                            }
                        });
                    }, {
                        threshold: 0.1,
                        rootMargin: '0px 0px -50px 0px'
                    });
                    
                    document.querySelectorAll('.card, .feature-card, .mission-card').forEach(el => {
                        observer.observe(el);
                    });
                }
            },
            
            setupHoverEffects: function() {
                // Add gentle hover effects
                document.querySelectorAll('.card').forEach(card => {
                    card.addEventListener('mouseenter', function() {
                        this.style.transform = 'translateY(-5px)';
                    });
                    
                    card.addEventListener('mouseleave', function() {
                        this.style.transform = 'translateY(0)';
                    });
                });
            },
            
            setupLoadingStates: function() {
                // Add loading states to forms
                document.querySelectorAll('form').forEach(form => {
                    form.addEventListener('submit', function() {
                        const submitButton = this.querySelector('button[type="submit"]');
                        if (submitButton) {
                            const originalText = submitButton.innerHTML;
                            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
                            submitButton.disabled = true;
                            
                            // Reset after 5 seconds as fallback
                            setTimeout(() => {
                                submitButton.innerHTML = originalText;
                                submitButton.disabled = false;
                            }, 5000);
                        }
                    });
                });
            }
        }
    };
    
    // Event Handlers
    Serenity.events = {
        init: function() {
            this.setupGlobalEvents();
            this.setupKeyboardShortcuts();
            this.setupTouchEvents();
        },
        
        setupGlobalEvents: function() {
            // Smooth scrolling for anchor links
            document.addEventListener('click', function(e) {
                if (e.target.matches('a[href^="#"]') && e.target.getAttribute('href') !== '#') {
                    e.preventDefault();
                    const href = e.target.getAttribute('href');
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
            
            // Enhanced focus management
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    document.body.classList.add('using-keyboard');
                }
            });
            
            document.addEventListener('mousedown', function() {
                document.body.classList.remove('using-keyboard');
            });
        },
        
        setupKeyboardShortcuts: function() {
            document.addEventListener('keydown', function(e) {
                // Alt + D for dark mode toggle
                if (e.altKey && e.key === 'd') {
                    e.preventDefault();
                    Serenity.modules.darkMode.toggle();
                }
                
                // Alt + B for breathing exercise
                if (e.altKey && e.key === 'b') {
                    e.preventDefault();
                    Serenity.modules.wellness.startBreathingExercise();
                }
                
                // Escape to close modals
                if (e.key === 'Escape') {
                    document.querySelectorAll('.modal, .affirmation-modal').forEach(modal => {
                        modal.remove();
                    });
                }
            });
        },
        
        setupTouchEvents: function() {
            // Add touch-friendly interactions for mobile
            if ('ontouchstart' in window) {
                document.body.classList.add('touch-device');
                
                // Improve button touch targets
                document.querySelectorAll('.btn-sm').forEach(btn => {
                    btn.style.minHeight = '44px';
                    btn.style.minWidth = '44px';
                });
            }
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            Serenity.init();
        });
    } else {
        Serenity.init();
    }
    
    // Add CSS for animations and effects
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .using-keyboard *:focus {
            outline: 2px solid #4A90E2 !important;
            outline-offset: 2px !important;
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease-out;
        }
        
        .notification-container .notification {
            animation: slideInRight 0.3s ease-out;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .habit-item.completed {
            opacity: 0.7;
            text-decoration: line-through;
        }
        
        .touch-device .btn:hover {
            transform: none !important;
        }
        
        .breathing-exercise-btn:hover {
            transform: scale(1.1);
        }
        
        .field-error {
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    
    document.head.appendChild(styleSheet);
    
})();
