// ============================================
// INICIALIZAÇÃO DO DOCUMENTO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas as funcionalidades
    initSmoothScroll();
    initHeaderDynamics();
    initScrollReveal();
    initSwiper();
    initFAQAccordion();
    initAnimatedCounters();
    initHeroTypingEffect();
    initButtonRippleEffect();
    initNavHighlight();
    initLazyLoad();
});

// ============================================
// 1. SMOOTH SCROLL PARA LINKS DE ÂNCORA
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const topBar = document.querySelector('.top-bar');
                const totalOffset = headerHeight + (topBar ? topBar.offsetHeight : 0);
                
                window.scrollTo({
                    top: targetElement.offsetTop - totalOffset,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// 2. DINÂMICA DO HEADER (Sticky com Efeito)
// ============================================
function initHeaderDynamics() {
    const header = document.querySelector('header');
    const topBar = document.querySelector('.top-bar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        
        // Efeito de sombra no header ao rolar
        if (scrollTop > 50) {
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
            header.style.padding = '8px 0';
            if (topBar) topBar.style.opacity = '0.8';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            header.style.padding = '15px 0';
            if (topBar) topBar.style.opacity = '1';
        }
        
        // Esconder/mostrar top bar ao rolar para baixo
        if (scrollTop > 300) {
            if (topBar && topBar.style.display !== 'none') {
                topBar.style.transition = 'all 0.3s ease';
                topBar.style.maxHeight = '0';
                topBar.style.overflow = 'hidden';
                topBar.style.padding = '0';
            }
        } else {
            if (topBar && topBar.style.maxHeight === '0px') {
                topBar.style.maxHeight = '50px';
                topBar.style.padding = '12px 0';
            }
        }
        
        lastScrollTop = scrollTop;
    });
}

// ============================================
// 3. SCROLL REVEAL - Revelar elementos ao rolar
// ============================================
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Adicionar delay para efeito em cascata
                setTimeout(() => {
                    entry.target.classList.add('reveal-visible');
                }, index * 100);
                revealOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elementos a animar
    const elementsToReveal = document.querySelectorAll(
        '.card, .vantagem-item, .testimonial-card, .faq-item, .especialista-container, .brand-text'
    );
    
    elementsToReveal.forEach(el => {
        el.classList.add('reveal-hidden');
        revealOnScroll.observe(el);
    });
    
    // Adicionar estilos de animação dinamicamente
    const style = document.createElement('style');
    style.textContent = `
        .reveal-hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .reveal-visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// 4. SWIPER INITIALIZATION
// ============================================
function initSwiper() {
    if (typeof Swiper === 'undefined') {
        console.warn('Swiper library not loaded');
        return;
    }
    
    const swiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: { 
            el: ".swiper-pagination", 
            clickable: true,
            dynamicBullets: true
        },
        navigation: { 
            nextEl: ".swiper-button-next", 
            prevEl: ".swiper-button-prev" 
        },
        breakpoints: { 
            768: { slidesPerView: 2 }, 
            1024: { slidesPerView: 3 } 
        },
        autoplay: { 
            delay: 5000, 
            disableOnInteraction: false 
        },
        effect: 'slide',
        speed: 800
    });
    
    // Adicionar efeito de hover nos slides
    document.querySelectorAll('.swiper-slide').forEach(slide => {
        slide.addEventListener('mouseenter', () => {
            swiper.autoplay.stop();
        });
        slide.addEventListener('mouseleave', () => {
            swiper.autoplay.start();
        });
    });
}

// ============================================
// 5. FAQ ACCORDION COM ANIMAÇÃO SUAVE
// ============================================
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fechar todos os outros itens
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = null;
                    }
                }
            });
            
            // Alternar o item atual
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                
                // Scroll suave para o item ativo
                setTimeout(() => {
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            } else {
                item.classList.remove('active');
                answer.style.maxHeight = null;
            }
        });
    });
    
    // Abrir o primeiro item por padrão
    if (faqItems.length) {
        faqItems[0].classList.add('active');
        const firstAnswer = faqItems[0].querySelector('.faq-answer');
        if (firstAnswer) {
            firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
        }
    }
}

// ============================================
// 6. CONTADORES ANIMADOS (Números)
// ============================================
function initAnimatedCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    
    const observerOptions = {
        threshold: 0.2
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function createCountersInHero() {
    const heroTrust = document.querySelector('.hero-trust');
    if (!heroTrust) return;
    
    // Adicionar contadores se não existirem
    const countersHTML = `
        <div style="display: flex; gap: 40px; margin-top: 30px; flex-wrap: wrap;">
            <div style="text-align: center;">
                <div data-counter="200" style="font-size: 2.5rem; font-weight: 700; color: #E31C1C;">0</div>
                <span style="font-size: 0.9rem; color: #666;">mil clientes</span>
            </div>
            <div style="text-align: center;">
                <div data-counter="35" style="font-size: 2.5rem; font-weight: 700; color: #E31C1C;">0</div>
                <span style="font-size: 0.9rem; color: #666;">anos de tradição</span>
            </div>
            <div style="text-align: center;">
                <div data-counter="5" style="font-size: 2.5rem; font-weight: 700; color: #E31C1C;">0</div>
                <span style="font-size: 0.9rem; color: #666;">estrelas</span>
            </div>
        </div>
    `;
    
    heroTrust.insertAdjacentHTML('afterend', countersHTML);
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-counter'));
    const duration = 2000; // 2 segundos
    const start = Date.now();
    
    const updateCounter = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * easeProgress);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// ============================================
// 7. EFEITO DE DIGITAÇÃO NO TÍTULO HERO
// ============================================
function initHeroTypingEffect() {
    const heroTitle = document.querySelector('.hero-content h1');
    if (!heroTitle) return;
    
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '3px solid #E31C1C';
    heroTitle.style.paddingRight = '5px';
    
    let index = 0;
    const typingSpeed = 50; // ms por caractere
    
    const typeCharacter = () => {
        if (index < originalText.length) {
            heroTitle.textContent += originalText.charAt(index);
            index++;
            setTimeout(typeCharacter, typingSpeed);
        } else {
            // Remover o cursor ao terminar
            setTimeout(() => {
                heroTitle.style.borderRight = 'none';
            }, 500);
        }
    };
    
    // Iniciar digitação após um pequeno delay
    setTimeout(typeCharacter, 500);
}

// ============================================
// 8. EFEITO RIPPLE NOS BOTÕES
// ============================================
function initButtonRippleEffect() {
    const buttons = document.querySelectorAll('.btn-cta, .btn-card, .btn-cta-header');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Adicionar estilos de ripple
    const style = document.createElement('style');
    style.textContent = `
        .btn-cta, .btn-card, .btn-cta-header {
            position: relative;
            overflow: hidden;
        }
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// 9. DESTAQUE DE NAVEGAÇÃO (Nav Highlight)
// ============================================
function initNavHighlight() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
                link.style.color = 'var(--primary-color)';
                link.style.borderBottom = '2px solid var(--primary-color)';
                link.style.paddingBottom = '5px';
            } else {
                link.style.borderBottom = 'none';
                link.style.paddingBottom = '0';
            }
        });
    });
}

// ============================================
// 10. LAZY LOAD PARA IMAGENS
// ============================================
function initLazyLoad() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ============================================
// 11. EFEITO DE PARALLAX (Opcional)
// ============================================
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const scrollPosition = window.scrollY;
            const elementOffset = element.offsetTop;
            const distance = scrollPosition - elementOffset;
            
            if (distance > -window.innerHeight && distance < window.innerHeight) {
                const parallaxSpeed = element.getAttribute('data-parallax') || 0.5;
                element.style.transform = `translateY(${distance * parallaxSpeed}px)`;
            }
        });
    });
}

// ============================================
// 12. MONITORAR PERFORMANCE
// ============================================
function logPerformance() {
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`⚡ Tempo de carregamento: ${loadTime}ms`);
    }
}

// Chamar ao carregar
window.addEventListener('load', logPerformance);