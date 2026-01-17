import { useState } from "react";

export default function Aktualizacja() {
    const [produkt, setCost] = useState({ nazwa: "Pomidor", cena: 50 });

    return (
        <div>
            <div>Aktualnie {produkt.nazwa} kosztuje {produkt.cena}</div>
            <button onClick={() => setCost(prev => ({ ...prev, cena: 100 }))}>
                Zmień cenę
            </button>
        </div>
    );
}
