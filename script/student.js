// ── NAVIGATION ──────────────────────────────────────────
        const pages = {};
        document.querySelectorAll('.tab-panel[id^="page-"]').forEach(p => pages[p.id.replace('page-', '')] = p);

        function showPage(name) {
            Object.values(pages).forEach(p => p.classList.remove('active'));
            const target = pages[name];
            if (target) target.classList.add('active');
            document.querySelectorAll('.nav-links a').forEach(l => l.classList.toggle('active', l.dataset.page === name));
            if (name === 'progress') renderProgressBars();
            if (name === 'messages') renderMessages();
        }

        document.querySelectorAll('[data-page]').forEach(el => {
            el.addEventListener('click', e => { e.preventDefault(); showPage(el.dataset.page); });
        });

        function switchInnerTab(btn, panelId) {
            const parent = btn.closest('.card-flat');
            parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            parent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(panelId).classList.add('active');
        }

        // ── TASKS ───────────────────────────────────────────────
        const subjectColors = { Maths: 'badge-blue', Physics: 'badge-amber', Chemistry: 'badge-green', Other: '' };
        let tasks = [
            { id: 1, text: 'Solve 20 integration problems', subject: 'Maths', done: true, due: 'Today' },
            { id: 2, text: 'Watch Chemistry lecture', subject: 'Chemistry', done: false, due: 'Today' },
            { id: 3, text: 'Complete mock test', subject: 'Physics', done: false, due: 'Tomorrow' }
        ];
        let taskFilter = 'all';

        function renderTasks() {
            const list = document.getElementById('task-list');
            const filtered = tasks.filter(t => taskFilter === 'all' ? true : taskFilter === 'done' ? t.done : !t.done);
            if (!filtered.length) { list.innerHTML = '<p style="padding:1.5rem; color:var(--ink-muted); text-align:center">No tasks here!</p>'; return; }
            list.innerHTML = filtered.map(t => `
                <div class="task-item" data-id="${t.id}" style="border: none; padding: 0.75rem 0;">
                  <div class="task-check ${t.done ? 'done' : ''}" onclick="toggleTask(${t.id})"></div>
                  <div style="flex:1; min-width: 0;">
                    <div class="task-text ${t.done ? 'done' : ''}">${t.text}</div>
                    <div style="margin-top:4px; display:flex; gap:6px; align-items:center">
                      <span class="badge ${subjectColors[t.subject] || 'badge-blue'}" style="font-size:0.7rem">${t.subject}</span>
                      <span style="font-size:0.75rem; color:var(--ink-muted)">${t.due}</span>
                    </div>
                  </div>
                  <button onclick="deleteTask(${t.id})" style="background:none;border:none;cursor:pointer;color:var(--ink-muted);font-size:1.2rem;">×</button>
                </div>
            `).join('');
        }

        function toggleTask(id) {
            tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
            renderTasks();
            toast(tasks.find(t => t.id === id).done ? '✅ Task done!' : 'Task pending.');
        }
        function deleteTask(id) { tasks = tasks.filter(t => t.id !== id); renderTasks(); toast('Task removed.'); }
        function filterTasks(f) { taskFilter = f; renderTasks(); }

        function openAddTask() {
            document.getElementById('new-task-date').valueAsDate = new Date();
            document.getElementById('add-task-modal').classList.add('open');
        }
        function addTask() {
            const text = document.getElementById('new-task-text').value.trim();
            if (!text) { toast('Enter description.'); return; }
            tasks.push({ id: Date.now(), text, subject: document.getElementById('new-task-subject').value, done: false, due: 'Soon' });
            closeModal('add-task-modal'); renderTasks(); toast('Task added!');
        }

        // ── PROGRESS BARS ───────────────────────────────────────
        function renderProgressBars() {
            const subjects = [
                { name: 'Mathematics', pct: 68, color: 'blue' },
                { name: 'Physics', pct: 74, color: 'green' },
                { name: 'Chemistry', pct: 44, color: 'amber' },
            ];
            document.getElementById('progress-bars').innerHTML = subjects.map(s => `
                <div style="margin-bottom:1.25rem">
                  <div style="display:flex; justify-content:space-between; margin-bottom:6px">
                    <span style="font-size:0.95rem; font-weight:600; color:var(--ink-display);">${s.name}</span>
                    <span style="font-size:0.95rem; font-weight:700; color:var(--${s.color})">${s.pct}%</span>
                  </div>
                  <div class="progress-track" style="height: 10px;"><div class="progress-fill ${s.color}" style="width:0" data-width="${s.pct}%"></div></div>
                </div>
            `).join('');
            setTimeout(() => { document.querySelectorAll('#progress-bars .progress-fill').forEach(el => el.style.width = el.dataset.width); }, 100);
        }

        // ── MESSAGES ───────────────────────────────────────────
        const messages = [
            { from: 'Dr. Meera Krishnan', time: 'Today', text: "Great focus! Keep practising limits.", read: true },
            { from: 'Prof. Vikram Pillai', time: 'Yesterday', text: "Revise Newton's Laws.", read: false }
        ];
        function renderMessages() {
            document.getElementById('message-list').innerHTML = messages.map(m => `
                <div style="padding:1rem; border-bottom:1px solid var(--border-subtle); display:flex; gap:12px; background:${m.read ? 'transparent' : 'rgba(0,74,173,0.05)'}; border-radius: 12px; margin-bottom: 0.5rem;">
                  <div class="avatar avatar-blue" style="width:40px;height:40px;">${m.from.charAt(4)}</div>
                  <div style="flex:1; min-width: 0;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px">
                      <strong style="color:var(--ink-display);">${m.from}</strong>
                      <span style="font-size:0.8rem; color:var(--ink-muted)">${m.time}</span>
                    </div>
                    <p style="font-size:0.9rem; color:var(--ink-muted); margin: 0;">${m.text}</p>
                  </div>
                </div>
            `).join('');
        }
        function sendMessage() { toast('Message sent!'); }

        // ── NOTIFICATIONS ───────────────────────────────────────
        function openNotifications() {
            document.getElementById('notif-list').innerHTML = `
                <div style="padding:1.5rem; border-bottom:1px solid var(--border-subtle); display:flex; gap:12px;">
                  <span style="font-size:1.5rem">📅</span>
                  <div>
                    <p style="font-size:0.95rem; color:var(--ink-display); margin:0;">Physics class in 2 hours</p>
                    <p style="font-size:0.8rem; color:var(--ink-muted); margin-top:4px">Just now</p>
                  </div>
                </div>
            `;
            document.getElementById('notif-modal').classList.add('open');
            document.querySelector('.notif-dot').style.display = 'none';
        }

        // ── DOUBT MODAL ─────────────────────────────────────────
        function openDoubtModal() { document.getElementById('doubt-modal').classList.add('open'); }
        function submitDoubt() {
            if (!document.getElementById('doubt-text').value.trim()) { toast('Type a question first.'); return; }
            closeModal('doubt-modal'); toast('Doubt sent!'); document.getElementById('doubt-text').value = '';
        }

        // ── UTILS (Modals, Toast, Magnetic) ─────────────────────
        function closeModal(id) { document.getElementById(id).classList.remove('open'); }
        document.querySelectorAll('.modal-overlay').forEach(m => { m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); }); });

        function toast(msg) {
            const t = document.getElementById('toast');
            t.textContent = msg; t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 3000);
        }

        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                btn.style.transform = `translate(${(e.clientX - rect.left - rect.width / 2) * 0.2}px, ${(e.clientY - rect.top - rect.height / 2) * 0.2}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = `translate(0px, 0px)`;
                btn.style.transition = `transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
            });
            btn.addEventListener('mouseenter', () => { btn.style.transition = `none`; });
        });

        // ── BENTO MOUSE TRACKING ────────────────────────────────
        const bentoCards = document.querySelectorAll('.card-flat, .subject-card, .ai-tip');
        bentoCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            });
        });

        // ── INIT & STABLE HYDRATION ──────────────────────────
        window.onload = () => {
            const cardsToHydrate = document.querySelectorAll('.card-flat, .premium-stat-card, .subject-card, .ai-tip, .greeting');

            cardsToHydrate.forEach(card => {
                card.classList.add('skeleton');
                card.classList.add('fade-in-stable');
            });

            setTimeout(() => {
                cardsToHydrate.forEach((card, index) => {
                    card.classList.remove('skeleton');
                    setTimeout(() => {
                        card.classList.add('visible');
                        if (card.id === 'progress-chart-container') renderProgressBars();
                    }, index * 80);
                });
            }, 1200);
        };

        renderTasks();