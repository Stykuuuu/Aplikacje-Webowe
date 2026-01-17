import {useEffect, useState} from "react";

export default function Licznik() {
    const [licznik, setLicznik] = useState(() => parseInt(localStorage.getItem("licznik") ?? "0", 10))

    useEffect(() => {
        localStorage.setItem("licznik", licznik.toString());
    }, [licznik]);

    const clicked = () => {
        setLicznik(prev => prev + 1);
    }

    return (
        <div>
            Licznik: {licznik}
            <button onClick={clicked}>Dodaj</button>
        </div>
    );
}