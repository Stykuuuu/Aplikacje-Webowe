import { W, H, G, JUMP, PIPE_SPEED, GAP, PIPE_DIST, GROUND_H, STATE,
    BOOST_GHOST_DURATION, BOOST_TELEPORT_DISTANCE } from './flappy-constants.js';
import { loadAssets } from './flappy-assets.js';

// ===== USTAWIENIA =====
const USE_ASSETS = true;

// ===== Canvas / stan =====
const C = document.getElementById('game');
const ctx = C.getContext('2d');

let img = null, snd = null;
let state = STATE.READY;
let paused = false;

const bird = {
    x:120, y:H/2, vy:0, r:16, anim:0, animT:0,
    ghostMode: false, ghostTimer: 0,
    spinAngle: 0,
    frame(){ return [img.birdDown, img.birdMid, img.birdUp, img.birdMid][this.anim|0]; },
    angle(){
        if (state === STATE.CELEBRATION) return this.spinAngle;
        return Math.max(-0.5, Math.min(1.0, this.vy/300));
    }
};

const pipes = [];
let last = performance.now(), worldOffset = 0, score = 0;
let best = +(localStorage.getItem('fb_best') || 0);
let celebrationTimer = 0;
let ghostCooldown = 0;    // cooldown po uzyciu trybu ducha
let teleportUsesLeft = 3; // 3 uzycia teleportu na gre
const btnRestart = document.getElementById('restart');

// ===== Init =====
(async function init(){
    try{
        if (USE_ASSETS){
            const assets = await loadAssets();
            img = assets.img; snd = assets.snd;
        } else {
            img = {}; snd = {};
        }
    } catch(e){
        console.error('Blad ladowania assetow:', e);
        img = img || {}; snd = snd || {};
    }

    attachInput();
    reset();
    requestAnimationFrame(loop);
})();

function attachInput(){
    addEventListener('keydown', e => {
        if (e.code === 'Space'){ e.preventDefault(); jump(); }
        if (e.code === 'KeyR' && (state === STATE.OVER || state === STATE.CELEBRATION)) reset();
        if (e.code === 'KeyP' && state === STATE.PLAY){ paused = !paused; }
        if (e.code === 'KeyG' && state === STATE.PLAY){ activateGhostMode(); }
        if (e.code === 'KeyT' && state === STATE.PLAY){ activateTeleport(); }
    });
    C.addEventListener('pointerdown', jump, {passive:true});
    btnRestart.addEventListener('click', reset);
}

function jump(){
    if (state === STATE.READY){ state = STATE.PLAY; bird.vy = JUMP; safePlay(snd?.jump); return; }
    if (state === STATE.PLAY){ bird.vy = JUMP; safePlay(snd?.jump); }
}

function activateGhostMode(){
    if (ghostCooldown <= 0 && !bird.ghostMode && state === STATE.PLAY){
        bird.ghostMode = true;
        bird.ghostTimer = BOOST_GHOST_DURATION;
        ghostCooldown = 10; // 10 sekund cooldown po zakonczeniu trybu ducha
    }
}

function activateTeleport(){
    if (teleportUsesLeft > 0 && state === STATE.PLAY){
        // Znajdz najblizsze rury przed ptakiem
        let nearestPipe = null;
        for (const p of pipes){
            if (p.x + (img.pipe?.width || 52) > bird.x){
                nearestPipe = p;
                break;
            }
        }

        if (nearestPipe){
            // Teleportuj za najblizsza przeszkode
            const pipeW = img.pipe?.width || 52;
            const teleportDistance = (nearestPipe.x + pipeW + 50) - bird.x;

            // Przesun wszystkie rury
            for (const p of pipes){
                p.x -= teleportDistance;
            }

            // Dodaj punkty za przeskoczone rury
            let passedCount = 0;
            for (const p of pipes){
                if (!p.passed && p.x + pipeW < bird.x){
                    p.passed = true;
                    passedCount++;
                }
            }
            score += passedCount;

            worldOffset = (worldOffset + teleportDistance) % (img.base?.width || 336);
        }

        teleportUsesLeft--;
        safePlay(snd?.swoosh);
    }
}

// ===== Petla =====
function loop(ts){
    const dt = Math.min(0.033, (ts - last)/1000); last = ts;

    if (!(paused && state === STATE.PLAY)) update(dt);
    draw(dt);

    requestAnimationFrame(loop);
}

// ===== Update =====
function update(dt){
    if (state === STATE.READY){
        bird.animT += dt;
        if (bird.animT > 0.12){ bird.anim=(bird.anim+1)%4; bird.animT=0; }
        return;
    }

    if (state === STATE.CELEBRATION){
        celebrationTimer += dt;
        bird.spinAngle += dt * Math.PI * 2; // pelny obrot na sekunde

        if (celebrationTimer >= 3){
            state = STATE.OVER;
            celebrationTimer = 0;
        }
        return;
    }

    if (state !== STATE.PLAY) return;

    // timery
    if (bird.ghostMode){
        bird.ghostTimer -= dt;
        if (bird.ghostTimer <= 0){
            bird.ghostMode = false;
            bird.ghostTimer = 0;
        }
    }

    if (ghostCooldown > 0) ghostCooldown -= dt;

    // ptak
    bird.vy += G*dt;
    bird.y += bird.vy*dt;
    bird.animT += dt;
    if (bird.animT > 0.08){ bird.anim=(bird.anim+1)%4; bird.animT=0; }

    // granice
    if (bird.y < bird.r){ bird.y = bird.r; bird.vy = 0; }

    // Zderzenie z ziemia ZAWSZE konczy gre (nawet w trybie ducha)
    if (bird.y > H - GROUND_H - bird.r){
        bird.y = H - GROUND_H - bird.r;
        gameOver(true);
        return;
    }

    // rury
    if (pipes.length === 0 || (W - (pipes[pipes.length-1].x)) >= PIPE_DIST) spawnPipe();

    for (const p of pipes){
        p.x -= PIPE_SPEED * dt;

        const pipeW = img.pipe?.width || 52;
        const holeTop = p.topH;
        const holeBot = p.topH + GAP;

        const bx1 = bird.x - bird.r, bx2 = bird.x + bird.r;
        const by1 = bird.y - bird.r, by2 = bird.y + bird.r;
        const px1 = p.x, px2 = p.x + pipeW;

        if (!(bx2 < px1 || bx1 > px2)){
            if (by1 < holeTop || by2 > holeBot) {
                if (!bird.ghostMode){
                    gameOver(true);
                    return;
                }
            }
        }
        if (!p.passed && bird.x > px2){
            p.passed = true;
            score++;
            safePlay(snd?.point);
        }
    }

    while (pipes.length && pipes[0].x < -(img.pipe?.width || 60)) pipes.shift();

    worldOffset = (worldOffset + PIPE_SPEED*dt) % (img.base?.width || 336);
}

function spawnPipe(){
    const marginTop = 40, marginBottom = 60;
    const topH = randInt(marginTop, H - GROUND_H - GAP - marginBottom);
    pipes.push({ x: W + 40, topH, passed:false });
}

// ===== Draw =====
function draw(){
    // tlo
    if (img.bg) {
        for (let x=0; x<W; x += img.bg.width) ctx.drawImage(img.bg, x, 0);
    } else {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0,0,W,H);
    }

    // rury
    for (const p of pipes){
        if (img.pipe){
            const topY = p.topH - img.pipe.height;
            ctx.drawImage(img.pipe, p.x, topY);
            ctx.save();
            ctx.translate(p.x, p.topH + GAP);
            ctx.scale(1,-1);
            ctx.drawImage(img.pipe, 0, -img.pipe.height);
            ctx.restore();
        } else {
            ctx.fillStyle = '#2ecc71';
            ctx.fillRect(p.x, 0, 52, p.topH);
            ctx.fillRect(p.x, p.topH + GAP, 52, H - (p.topH + GAP) - GROUND_H);
        }
    }

    // ptak
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.angle());

    if (bird.ghostMode){
        ctx.globalAlpha = 0.4;
    }

    if (img.birdMid){
        const frame = bird.frame();
        ctx.drawImage(frame, -frame.width/2, -frame.height/2);
    } else {
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(0,0,bird.r,0,Math.PI*2);
        ctx.fill();
    }

    ctx.globalAlpha = 1.0;
    ctx.restore();

    // ziemia
    if (img.base){
        for (let x = -worldOffset; x < W; x += img.base.width)
            ctx.drawImage(img.base, x, H - GROUND_H);
    } else {
        ctx.fillStyle = '#d35400';
        ctx.fillRect(0, H - GROUND_H, W, GROUND_H);
    }

    // UI
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = 'rgba(0,0,0,.35)';
    ctx.lineWidth = 4;
    ctx.textAlign = 'center';

    if (state === STATE.READY){
        if (img.msg) drawCentered(img.msg, W/2, H*0.35);
        smallText(`Najlepszy wynik: ${best}`, W/2, 36);
        smallText('Spacja = skok', W/2, H*0.55);
        smallText('G = tryb ducha', W/2, H*0.60);
        smallText('T = teleport (3x)', W/2, H*0.65);
        smallText('P = pauza', W/2, H*0.70);
    } else if (state === STATE.PLAY){
        drawScoreSprites(score, W/2, 80);

        // wskazniki boostow
        ctx.textAlign = 'left';
        ctx.font = 'bold 16px system-ui,Segoe UI,Arial';

        if (bird.ghostMode){
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.fillText(`Duch: ${bird.ghostTimer.toFixed(1)}s`, 10, 30);
        } else if (ghostCooldown > 0){
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.fillText(`Duch: ${ghostCooldown.toFixed(1)}s`, 10, 30);
        } else {
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.fillText('Duch: Gotowy!', 10, 30);
        }

        if (teleportUsesLeft > 0){
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.fillText(`Teleport: ${teleportUsesLeft}x`, 10, 50);
        }

        ctx.textAlign = 'center';
    } else if (state === STATE.CELEBRATION){
        ctx.fillStyle = 'rgba(0,0,0,.5)';
        ctx.fillRect(0,0,W,H);

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 48px system-ui,Segoe UI,Arial';
        ctx.strokeStyle = 'rgba(0,0,0,.5)';
        ctx.lineWidth = 6;
        ctx.strokeText('NOWY REKORD!', W/2, H/2);
        ctx.fillText('NOWY REKORD!', W/2, H/2);

        smallText(`${score} punktow!`, W/2, H/2 + 50);
    } else if (state === STATE.OVER){
        if (img.over) drawCentered(img.over, W/2, H*0.30);
        smallText(`Wynik: ${score} • Najlepszy: ${best}`, W/2, H*0.48);
    }

    if (paused && state === STATE.PLAY){
        ctx.fillStyle = 'rgba(0,0,0,.35)';
        ctx.fillRect(0,0,W,H);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 28px system-ui,Segoe UI,Arial';
        ctx.fillText('PAUZA (P)', W/2, H/2);
    }
}

function drawCentered(image, cx, cy){
    if (!image || !image.width) return;
    ctx.drawImage(image, cx - image.width/2, cy - image.height/2);
}

function drawScoreSprites(n, x, y){
    if (!img || !img.numbers) { bigText(String(n), x, y); return; }
    const s = String(n);
    const glyphs = [...s].map(ch => img.numbers[+ch]);
    if (glyphs.some(g => !g)) { bigText(s, x, y); return; }
    const w = glyphs.reduce((a,g)=>a+g.width,0);
    let cx = x - w/2;
    for (const g of glyphs){
        ctx.drawImage(g, cx, y - g.height/2);
        cx += g.width;
    }
}

function bigText(t,x,y){
    ctx.font='bold 48px system-ui,Segoe UI,Arial';
    ctx.strokeText(t,x,y);
    ctx.fillText(t,x,y);
}

function smallText(t,x,y){
    ctx.font='bold 20px system-ui,Segoe UI,Arial';
    ctx.strokeText(t,x,y);
    ctx.fillText(t,x,y);
}

// ===== Helpers =====
function randInt(a,b){ return a + Math.floor(Math.random()*(b-a+1)); }

function gameOver(withHit){
    if (state !== STATE.PLAY) return;

    // Sprawdz czy pobity rekord
    if (score > best){
        best = score;
        localStorage.setItem('fb_best', String(best));
        state = STATE.CELEBRATION;
        celebrationTimer = 0;
        bird.spinAngle = 0;
        bird.vy = 0;
        return;
    }

    state = STATE.OVER;
    bird.vy = 0;
    if (withHit){
        safePlay(snd?.hit);
        setTimeout(()=>safePlay(snd?.die),120);
    }
    btnRestart.hidden = false;
}

function reset(){
    state = STATE.READY;
    paused = false;
    bird.x=120;
    bird.y=H/2;
    bird.vy=0;
    bird.anim=0;
    bird.animT=0;
    bird.ghostMode = false;
    bird.ghostTimer = 0;
    bird.spinAngle = 0;
    pipes.length=0;
    worldOffset=0;
    score=0;
    ghostCooldown = 0;    // reset cooldown
    teleportUsesLeft = 3; // reset uzyc
    celebrationTimer=0;
    btnRestart.hidden = true;
}

function safePlay(a){
    try{
        if (a && a.play){
            a.currentTime=0;
            a.play();
        }
    }catch{}
}