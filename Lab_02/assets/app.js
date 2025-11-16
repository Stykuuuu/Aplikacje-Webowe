// ====== Cienie nad Wisłą — Script  ======
console.log('app.js loaded');
document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle + zapamiętanie w localStorage
    try {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const saved = localStorage.getItem('theme');
        const isLight = saved ? saved === 'light' : !prefersDark;
        if (isLight) document.documentElement.classList.add('light');

        const themeBtn = document.getElementById('themeToggle');
        themeBtn?.addEventListener('click', () => {
            const root = document.documentElement;
            const nowLight = !root.classList.contains('light');
            root.classList.toggle('light', nowLight);
            localStorage.setItem('theme', nowLight ? 'light' : 'dark');
        });
    } catch {}

    // Mobile nav toggle
    const toggle = document.querySelector('.nav-toggle');
    const links = document.getElementById('nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            const open = links.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(open));
        });
    }

    // Rok w stopce
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // HERO: modal z teaserem (Home) — ciekawszy filmik (Tears of Steel)
    const openBtn = document.getElementById('openTeaser');
    if (openBtn) {
        const VIDEO_SRC = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';

        const closeModal = (modal, video) => {
            try { video.pause(); } catch {}
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        };

        let escHandler = null;

        openBtn.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.className = 'modal';

            const card = document.createElement('div');
            card.className = 'modal-card';

            const video = document.createElement('video');
            video.setAttribute('controls', '');
            video.setAttribute('playsinline', '');
            video.style.width = '100%';
            video.style.borderRadius = '10px';
            video.innerHTML = `<source src="${VIDEO_SRC}" type="video/mp4">`;

            const actions = document.createElement('div');
            actions.className = 'modal-actions';

            const closeBtn = document.createElement('button');
            closeBtn.className = 'btn js-close';
            closeBtn.textContent = 'Zamknij';

            actions.appendChild(closeBtn);
            card.appendChild(video);
            card.appendChild(actions);
            modal.appendChild(card);
            document.body.appendChild(modal);

            closeBtn.addEventListener('click', () => closeModal(modal, video));
            modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal, video); });

            escHandler = (e) => { if (e.key === 'Escape') closeModal(modal, video); };
            document.addEventListener('keydown', escHandler);

            video.focus();
        });
    }

    // Show/Hide fabuły (Home)
    const plotBtn = document.getElementById('togglePlot');
    const more = document.querySelector('.plot .more');
    if (plotBtn && more) {
        plotBtn.addEventListener('click', () => {
            const hidden = more.classList.toggle('hidden');
            plotBtn.textContent = hidden ? 'Pokaż więcej' : 'Pokaż mniej';
        });
    }

    // Newsletter — prosta walidacja
    const newsForm = document.getElementById('newsletterForm');
    if (newsForm) {
        const emailInput = document.getElementById('newsEmail');
        const msg = newsForm.querySelector('.form-msg');
        newsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            msg.style.color = 'var(--accent2)';
            if (!ok) {
                msg.textContent = 'Podaj poprawny adres e-mail.';
                emailInput.focus();
                return;
            }
            msg.style.color = 'var(--accent)';
            msg.textContent = 'Dziękujemy! Zapisano do newslettera.';
            emailInput.value = '';
            try { localStorage.setItem('newsletterOptIn', 'true'); } catch {}
        });
    }

    // Kontakt — walidacja formularza
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const email = contactForm.querySelector('#email');
        const topic = contactForm.querySelector('#topic');
        const message = contactForm.querySelector('#message');
        const msg = contactForm.querySelector('.form-msg');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            msg.textContent = '';
            msg.style.color = 'var(--accent2)';

            const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
            const topicOk = !!topic.value;
            const messageOk = message.value.trim().length >= 10;

            if (!emailOk) { msg.textContent = 'Niepoprawny e-mail.'; email.focus(); return; }
            if (!topicOk) { msg.textContent = 'Wybierz temat wiadomości.'; topic.focus(); return; }
            if (!messageOk) { msg.textContent = 'Wiadomość musi mieć co najmniej 10 znaków.'; message.focus(); return; }

            msg.style.color = 'var(--accent)';
            msg.textContent = 'Wiadomość wysłana (symulacja).';
            contactForm.reset();
        });
    }
});
