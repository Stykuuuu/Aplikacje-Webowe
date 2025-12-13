document.addEventListener('DOMContentLoaded', () => {
    let t = 0, timer = null;
    const timeEl = document.getElementById('time');
    const render = () => { const m=Math.floor(t/60), s=t%60; timeEl.textContent = m?`${m}min ${s}s`:`${s}s`; };
    document.getElementById('start').onclick = ()=>{ if(!timer) timer=setInterval(()=>{ t++; render(); },1000); };
    document.getElementById('stop').onclick  = ()=>{ clearInterval(timer); timer=null; };
    document.getElementById('reset').onclick = ()=>{ t=0; render(); };
    render();
});
