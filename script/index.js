// 1. Scroll Reveal Logic (Staggered Loading)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

// Trigger page load elements immediately
window.onload = () => {
    document.querySelectorAll('.reveal').forEach((el, index) => {
        if (index < 3) {
            setTimeout(() => el.classList.add('visible'), index * 150);
        } else {
            observer.observe(el);
        }
    });
};



// 3. Magnetic Buttons
const magneticButtons = document.querySelectorAll('.magnetic');
magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = `translate(0px, 0px)`;
        btn.style.transition = `transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
    });
    btn.addEventListener('mouseenter', () => { btn.style.transition = `none`; });
});

// 4. Exclusive FAQ Accordion Logic
const faqItems = document.querySelectorAll('.faq-item');
if (faqItems.length > 0) {
    faqItems[0].classList.add('active'); // Default open first question
}

document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const parent = btn.parentElement;
        const wasActive = parent.classList.contains('active');

        // Strip active state from all items
        faqItems.forEach(item => item.classList.remove('active'));

        // Toggle current item
        if (!wasActive) parent.classList.add('active');
    });
});

// 5. Linear-Style Mouse Tracking Glow (Bento Cards)
const bentoCards = document.querySelectorAll('.bento-card');
bentoCards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// 6. Chatbot Scroll Visibility Logic
const chatbotTrigger = document.getElementById('chatbot-trigger');
const heroRobot = document.querySelector('.hero-visual img');

if (chatbotTrigger && heroRobot) {
    window.addEventListener('scroll', () => {
        // Calculate the hero image's position relative to the screen
        const rect = heroRobot.getBoundingClientRect();

        // Check if the top of the image + half its height has crossed above the screen (0)
        const isHalfwayHidden = (rect.top + (rect.height / 2)) < 0;

        if (isHalfwayHidden) {
            chatbotTrigger.classList.add('visible');
        } else {
            chatbotTrigger.classList.remove('visible');
        }
    }, { passive: true }); // passive: true optimizes scrolling performance
}

// 7. Dynamic 3D Marquee Cylinder Effect
// 7. Ultra-Smooth 3D Marquee Cylinder (Optimized)
const marqueeContainer = document.querySelector('.marquee-container');
const marqueeTrack = document.querySelector('.marquee-track');
const marqueeItems = document.querySelectorAll('.marquee-item');

if (marqueeContainer && marqueeTrack && marqueeItems.length > 0) {
    let itemOffsets = [];

    // Calculate the static spacing of items ONCE to prevent layout thrashing
    function calculateOffsets() {
        itemOffsets = Array.from(marqueeItems).map(item => {
            return item.offsetLeft + (item.offsetWidth / 2);
        });
    }

    // Initial calculation
    calculateOffsets();

    // Recalculate only if the user resizes their browser window
    window.addEventListener('resize', calculateOffsets);

    function renderCylinder() {
        // Measure the track strictly ONCE per frame
        const containerRect = marqueeContainer.getBoundingClientRect();
        const trackX = marqueeTrack.getBoundingClientRect().left;

        const containerCenter = containerRect.left + (containerRect.width / 2);
        const maxDistance = containerRect.width / 2;

        if (maxDistance > 0) {
            marqueeItems.forEach((item, index) => {
                // Determine absolute screen position using our cached offsets
                const itemAbsoluteCenter = trackX + itemOffsets[index];

                // Calculate distance from the exact center
                let distance = Math.abs(containerCenter - itemAbsoluteCenter);
                let normalized = Math.min(distance / maxDistance, 1);

                // The Cosine Math: Creates a perfect geometric cylinder curve
                const curve = Math.cos(normalized * (Math.PI / 2));

                // Scale: Bulges to 1.1x in the center, shrinks to 0.6x at the edges
                const scale = 0.6 + (curve * 0.5);

                // Opacity: Fades into the fog naturally
                const opacity = 0.15 + (curve * 0.85);

                // Apply purely 2D transforms to keep the text pixel-perfect and sharp
                item.style.transform = `scale(${scale})`;
                item.style.opacity = opacity;
            });
        }

        requestAnimationFrame(renderCylinder);
    }

    // Fire the animation loop
    renderCylinder();
}

// 8. Sticky Horizontal Scroll Animation (Bulletproof Physics)
const scrollSection = document.querySelector('.horizontal-scroll-section');
const scrollTrack = document.querySelector('.horizontal-track');
const slides = document.querySelectorAll('.horizontal-slide');

if (scrollSection && scrollTrack && slides.length > 0) {
    let currentScroll = 0;
    let targetScroll = 0;
    const ease = 0.08; // Adjust this for heavier/lighter momentum

    function updateHorizontalScroll() {
        // 1. Calculate distances based on absolute page position
        const sectionTop = scrollSection.offsetTop;
        const sectionHeight = scrollSection.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // The total runway we have to scroll down
        const maxScroll = sectionHeight - windowHeight;
        
        // How far the user has scrolled past the top of the section
        const scrollDistance = window.scrollY - sectionTop;
        
        // Normalize to a percentage (0.0 to 1.0) and clamp it so it doesn't break boundaries
        let scrollProgress = scrollDistance / maxScroll;
        scrollProgress = Math.max(0, Math.min(scrollProgress, 1)); 

        // 2. Calculate the horizontal target
        const maxTranslate = scrollTrack.scrollWidth - window.innerWidth;
        targetScroll = scrollProgress * maxTranslate;

        // 3. Smooth Lerp (Linear Interpolation) for mouse wheel friction
        currentScroll += (targetScroll - currentScroll) * ease;

        // 4. Move the track
        scrollTrack.style.transform = `translateX(-${currentScroll}px)`;

        // 5. 3D Card Depth Math (Cover Flow effect)
        const windowCenter = window.innerWidth / 2;

        slides.forEach(slide => {
            const slideRect = slide.getBoundingClientRect();
            const slideCenter = slideRect.left + (slideRect.width / 2);
            
            const distanceFromCenter = (slideCenter - windowCenter) / windowCenter;
            
            // CRISPER MATH: Much less aggressive scaling, fading, and rotating
            let scale = 1 - Math.abs(distanceFromCenter) * 0.08; 
            let opacity = 1 - Math.abs(distanceFromCenter) * 0.4; // Fades much slower
            let rotateY = distanceFromCenter * 5; // Very subtle tilt (was 15)
            let translateX = distanceFromCenter * 15; // Keeps it closer to its physical position

            // High floors so it never gets too small or invisible
            scale = Math.max(0.92, scale); 
            opacity = Math.max(0.5, opacity); // Will never be foggier than 50%
            
            slide.style.transform = `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`;
            slide.style.opacity = opacity;
        });

        // Loop seamlessly at screen refresh rate
        requestAnimationFrame(updateHorizontalScroll);
    }
    
    // Start loop
    updateHorizontalScroll();
}