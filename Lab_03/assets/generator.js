document.addEventListener('DOMContentLoaded', () => {
    const elMin = document.getElementById('minLen');
    const elMax = document.getElementById('maxLen');
    const elCaps = document.getElementById('caps');
    const elSpec = document.getElementById('special');
    const btnGen = document.getElementById('gen');
    const out = document.getElementById('pw');
    const msg = document.getElementById('msg');

    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const special = '!@#$%^&*()-_=+[]{};:,.?/';

    const randFrom = s => s[Math.floor(Math.random() * s.length)];
    const shuffle = arr => { for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]];} return arr; };

    btnGen.addEventListener('click', () => {
        // --- czyszczenie
        msg.textContent = ''; out.textContent = '';

        // --- odczyt i walidacja długości
        const min = Number.parseInt(elMin.value, 10);
        const max = Number.parseInt(elMax.value, 10);
        if (!Number.isFinite(min) || !Number.isFinite(max) || min < 1 || max < 1) {
            msg.textContent = 'Podaj dodatnie liczby całkowite dla długości.';
            return;
        }
        if (min > max) {
            msg.textContent = 'Min nie może być większe niż max.';
            return;
        }

        // --- ustal długość losowo z przedziału [min, max]
        const L = Math.floor(Math.random() * (max - min + 1)) + min;

        // --- budowa puli znaków + gwarancje
        let pool = lower + digits;
        const required = [];

        if (elCaps.checked)  { pool += upper;  required.push(randFrom(upper)); }
        if (elSpec.checked)  { pool += special; required.push(randFrom(special)); }

        // --- generacja: wrzuć wymagane, resztę dobij z puli
        const chars = [...required];
        while (chars.length < L) chars.push(randFrom(pool));

        // --- tasowanie, wypisanie wyniku
        const password = shuffle(chars).join('');
        out.textContent = password;
        msg.textContent = `Wygenerowano ${L} znaków${required.length ? ' (z gwarancją wybranych typów znaków)' : ''}.`;
    });
});
