// ===== Loader odporny na spacje w sciezkach (spacja i %20) =====

const variants = (p) => [p, p.replaceAll(' ', '%20')];

function tryImg(srcs) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        let i = 0;
        const next = () => {
            if (i >= srcs.length) {
                console.warn('IMG 404 (wszystkie warianty):', srcs.join(' | '));
                reject(new Error('IMG 404: ' + srcs.join(' | ')));
                return;
            }
            const s = srcs[i++];
            img.onload = () => resolve(img);
            img.onerror = () => { console.warn('IMG 404:', s); next(); };
            img.src = s;
        };
        next();
    });
}

function pickAudio(srcs) {
    try {
        const a = new Audio(); a.preload = 'auto';
        for (const s of srcs) {
            const ext = s.split('.').pop();
            if (a.canPlayType('audio/' + ext) !== '') { a.src = s; return a; }
        }
        a.src = srcs[0]; // fallback
        return a;
    } catch { return { play(){} }; }
}

function makePlaceholder(w=64,h=32,text='N/A'){
    const c=document.createElement('canvas'); c.width=w; c.height=h;
    const x=c.getContext('2d');
    x.fillStyle='#333'; x.fillRect(0,0,w,h);
    x.fillStyle='#fff'; x.font='bold 12px system-ui,Arial';
    x.textAlign='center'; x.textBaseline='middle';
    x.fillText(text, w/2, h/2);
    const img=new Image(); img.src=c.toDataURL(); return img;
}

async function loadNumberSprites(){
    try {
        const digits = [];
        for (let d=0; d<=9; d++){
            digits[d] = await tryImg(variants(`assets/UI/Numbers/${d}.png`));
        }
        return digits;
    } catch (e){
        console.warn('Brak spritow cyfr - wynik bedzie rysowany tekstem.');
        return null;
    }
}

export async function loadAssets() {
    const [bg, base, pipe, birdDown, birdMid, birdUp] = await Promise.all([
        tryImg(variants('assets/Flappy Bird/background-day.png')),
        tryImg(variants('assets/Flappy Bird/base.png')),
        tryImg(variants('assets/Flappy Bird/pipe-green.png')),
        tryImg(variants('assets/Flappy Bird/yellowbird-downflap.png')),
        tryImg(variants('assets/Flappy Bird/yellowbird-midflap.png')),
        tryImg(variants('assets/Flappy Bird/yellowbird-upflap.png')),
    ]);

    let msg, over;
    try { msg  = await tryImg(variants('assets/UI/message.png')); }
    catch { msg = makePlaceholder(184,160,'READY'); }

    try { over = await tryImg(variants('assets/UI/gameover.png')); }
    catch { over = makePlaceholder(192,42,'GAME OVER'); }

    const numbers = await loadNumberSprites();

    const snd = {
        jump:  pickAudio(['assets/Sound Efects/wing.wav','assets/Sound Efects/wing.ogg']),
        point: pickAudio(['assets/Sound Efects/point.wav','assets/Sound Efects/point.ogg']),
        hit:   pickAudio(['assets/Sound Efects/hit.wav','assets/Sound Efects/hit.ogg']),
        die:   pickAudio(['assets/Sound Efects/die.wav','assets/Sound Efects/die.ogg']),
    };

    return { img:{ bg, base, pipe, birdDown, birdMid, birdUp, msg, over, numbers }, snd };
}