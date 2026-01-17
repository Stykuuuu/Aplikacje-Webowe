import {useState} from "react";


export default function Haslo() {
    const [haslo1, setTekst1] = useState("");
    const [haslo2, setTekst2] = useState("");
    let message = "";
    if (haslo1 === "" && haslo2 === "") message = "Proszę wprowadzić hasło";
    else if (haslo1 !== haslo2) message = "Hasła nie są zgodne";

    return (
        <div>
            Hasło
            <input value={haslo1} onChange={(e) => setTekst1(e.target.value)}/>
            Powtórz Hasło
            <input value={haslo2} onChange={(e) => setTekst2(e.target.value)}/>
            <div>{message}</div>
        </div>
    );
}