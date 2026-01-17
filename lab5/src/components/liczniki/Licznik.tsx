import { useState } from "react";

export default function Licznik() {
    const [licznik, setLicznik] = useState(0);

    return (
        <div>
            <div>{licznik}</div>
            <button onClick={() => setLicznik(licznik => licznik + 1)}>Dodaj</button>
        </div>
    );
}
