// ── 1. 3D TILT EFFECT ──
        const card = document.getElementById('tilt-card');
        const wrapper = document.querySelector('.tilt-wrapper');
        if (wrapper && card) {
            wrapper.addEventListener('mousemove', (e) => {
                const rect = wrapper.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            wrapper.addEventListener('mouseleave', () => {
                card.style.transform = `rotateX(0deg) rotateY(0deg)`;
                card.style.transition = `transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
            });
            wrapper.addEventListener('mouseenter', () => { card.style.transition = `none`; });
        }

        // ── 2. BENTO MOUSE TRACKING GLOW ──
        function applyBentoGlow() {
            document.querySelectorAll('.bento-card').forEach(card => {
                card.onmousemove = e => {
                    const rect = card.getBoundingClientRect();
                    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                };
            });
        }

        // ── 3. MAGNETIC BUTTONS & LINKS ──
        function applyMagnetic() {
            document.querySelectorAll('.magnetic, .magnetic-nav').forEach(btn => {
                btn.onmousemove = (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    // Smaller pull for sidebar links, normal for buttons
                    const factor = btn.classList.contains('magnetic-nav') ? 0.1 : 0.3;
                    btn.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
                };
                btn.onmouseleave = () => {
                    btn.style.transform = `translate(0px, 0px)`;
                    btn.style.transition = `transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
                };
                btn.onmouseenter = () => { btn.style.transition = `none`; };
            });
        }

        // ── 4. TAB NAVIGATION ──
        const pages = {};
        document.querySelectorAll('.tab-panel[id^="page-"]').forEach(p => pages[p.id.replace('page-', '')] = p);

        function showPage(name) {
            Object.values(pages).forEach(p => p.classList.remove('active'));
            if (pages[name]) pages[name].classList.add('active');

            document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === name));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        document.querySelectorAll('[data-page]').forEach(el => el.addEventListener('click', e => {
            e.preventDefault();
            showPage(el.dataset.page);
        }));

        // ── 5. ACTIONS & TOAST ──
        function actionToast(btn, action) {
            btn.closest('.list-item').style.display = 'none';
            toast(`Application ${action}`);
        }

        let toastTimeout;
        function toast(msg) {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.style.opacity = '1';
            t.style.transform = 'translateY(0)';

            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                t.style.opacity = '0';
                t.style.transform = 'translateY(20px)';
            }, 3000);
        }

        // Initialize Effects
        window.onload = () => {
            applyBentoGlow();
            applyMagnetic();
        };