// ── NAVIGATION LOGIC ──
        const pages = {};
        document.querySelectorAll('.tab-panel[id^="page-"]').forEach(p => pages[p.id.replace('page-', '')] = p);

        function showPage(name) {
            Object.values(pages).forEach(p => p.classList.remove('active'));
            if (pages[name]) pages[name].classList.add('active');

            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.toggle('active', l.dataset.page === name));

            if (name === 'students') renderStudents(allStudents);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        document.querySelectorAll('[data-page]').forEach(el => el.addEventListener('click', e => {
            e.preventDefault(); showPage(el.dataset.page);
        }));

        // ── INTERACTIVE MOUSE GLOW (BENTO) ──
        function applyBentoGlow() {
            document.querySelectorAll('.bento-card').forEach(card => {
                card.onmousemove = e => {
                    const rect = card.getBoundingClientRect();
                    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                };
            });
        }

        // ── MAGNETIC BUTTON PHYSICS ──
        function applyMagnetic() {
            document.querySelectorAll('.magnetic').forEach(btn => {
                btn.onmousemove = (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
                };
                btn.onmouseleave = () => {
                    btn.style.transform = `translate(0px, 0px)`;
                    btn.style.transition = `transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
                };
                btn.onmouseenter = () => { btn.style.transition = `none`; };
            });
        }

        // ── LIVE STUDENT DATA WITH PROGRESS ANIMATIONS ──
        const allStudents = [
            { name: 'Priya Mehta', class: 'Class 12', batch: 'Batch A', focus: 96, status: 'excellent' },
            { name: 'Arjun Sharma', class: 'Class 11', batch: 'Batch B', focus: 88, status: 'good' },
            { name: 'Karan Verma', class: 'Class 12', batch: 'Batch A', focus: 84, status: 'good' },
            { name: 'Rohan Gupta', class: 'Class 11', batch: 'Batch B', focus: 65, status: 'low' }
        ];

        function renderStudents(list) {
            const colors = { excellent: 'badge-green', good: 'badge-blue', low: 'badge-red' };
            const labels = { excellent: 'Top Performer', good: 'On Track', low: 'Attention Needed' };

            document.getElementById('student-grid').innerHTML = list.map((s, index) => `
                <div class="bento-card" style="padding: 2rem; display: flex; flex-direction: column; animation: fadeIn 0.5s ease backwards; animation-delay: ${index * 0.1}s;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div class="avatar avatar-blue float-fast" style="width: 56px; height: 56px; font-size: 1.5rem; background: ${s.focus > 90 ? 'linear-gradient(135deg, #16A34A, #34D399)' : 'linear-gradient(135deg, var(--primary), #00C6FF)'};">${s.name[0]}</div>
                            <div>
                                <h4 style="margin: 0; font-size: 1.25rem; font-family: var(--font-display);">${s.name}</h4>
                                <p style="margin: 0; font-size: 0.9rem; color: var(--ink-muted); font-weight: 500;">${s.class} · ${s.batch}</p>
                            </div>
                        </div>
                        <span class="badge ${colors[s.status]}" style="padding: 6px 12px;">${labels[s.status]}</span>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.5); padding: 1rem; border-radius: 16px; margin-bottom: 1.5rem;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 8px; font-weight: 600;">
                            <span>AI Focus Score</span>
                            <strong style="color: ${s.focus >= 85 ? 'var(--green)' : s.focus >= 70 ? 'var(--primary)' : 'var(--red)'}; font-size: 1.1rem;">${s.focus}/100</strong>
                        </div>
                        <div class="progress-track" style="height: 10px; background: rgba(0,0,0,0.05); border: none;">
                            <div class="progress-fill ${s.focus >= 85 ? 'green progress-glow' : s.focus < 70 ? 'amber' : ''}" style="width: 0%; transition: width 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);" data-target="${s.focus}%"></div>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: auto;">
                        <button class="btn btn-outline magnetic" style="border-radius: 12px;" onclick="toast('Viewing profile...')">View Profile</button>
                        <button class="btn btn-primary magnetic" style="border-radius: 12px;" onclick="toast('Chat opened!')">Message</button>
                    </div>
                </div>
            `).join('');

            // Trigger progress bar animations
            setTimeout(() => {
                document.querySelectorAll('.progress-fill').forEach(bar => {
                    bar.style.width = bar.getAttribute('data-target');
                });
            }, 100);

            applyBentoGlow();
            applyMagnetic();
        }

        function searchStudents(q) {
            renderStudents(q ? allStudents.filter(s => s.name.toLowerCase().includes(q.toLowerCase())) : allStudents);
        }

        // ── UTILITIES ──
        function toast(msg) {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.classList.add('show');
            t.style.background = 'linear-gradient(135deg, var(--primary) 0%, #00C6FF 100%)';
            t.style.boxShadow = '0 10px 30px rgba(0, 198, 255, 0.4)';
            setTimeout(() => t.classList.remove('show'), 3000);
        }

        window.onload = () => {
            applyBentoGlow();
            applyMagnetic();
        };