import {useState} from "react";


export default function Formularz() {
    const [tekst, setTekst] = useState("");
    return (
    <>
        <input value={tekst} onChange={(e) => setTekst(e.target.value)}/>
        <div>Wpisano: {tekst}</div>
    </>
    );
}