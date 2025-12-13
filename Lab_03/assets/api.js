document.addEventListener('DOMContentLoaded', () => {
    const q = document.getElementById('q');
    const sort = document.getElementById('sort');
    const tbody = document.querySelector('#tbl tbody');
    const state = { original: [], view: [] };

    const render = () => {
        tbody.innerHTML = '';
        state.view.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td><img src="${p.thumbnail}" alt="${p.title}" width="60" height="60" style="object-fit:cover"></td>
        <td>${p.title}</td>
        <td>${p.description}</td>`;
            tbody.appendChild(tr);
        });
    };

    const apply = () => {
        const term = q.value.trim().toLowerCase();
        let arr = state.original.filter(p =>
            p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
        );
        if (sort.value==='asc')  arr.sort((a,b)=>a.title.localeCompare(b.title));
        if (sort.value==='desc') arr.sort((a,b)=>b.title.localeCompare(a.title));
        state.view = arr; render();
    };

    fetch('https://dummyjson.com/products')
        .then(r=>r.json())
        .then(json => { state.original = json.products.slice(0,30); state.view=[...state.original]; render(); });

    q.addEventListener('input', apply);
    sort.addEventListener('change', apply);
});
