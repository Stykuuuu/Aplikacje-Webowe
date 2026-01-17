import {useState} from "react";


export default function Logowanie() {
    const [nazwa, setNazwa] = useState("");
    const [haslo1, setTekst1] = useState("");
    const [haslo2, setTekst2] = useState("");
    const anyEmpty = nazwa === "" || haslo1 === "" || haslo2 === "";
    const zgodne = haslo1 === haslo2;
    const onLogin = () => {
        if (zgodne) alert("Zalogowano poprawnie");
        else alert("Hasła nie są zgodne");
    }

    return (
        <div>
            <div>
                Nazwa Użytkownika:
                <input value={nazwa} onChange={(e) => setNazwa(e.target.value)}/>
            </div>
            Hasło:
            <input value={haslo1} onChange={(e) => setTekst1(e.target.value)}/>
            Powtórz Hasło:
            <input value={haslo2} onChange={(e) => setTekst2(e.target.value)}/>
            <div>
                <button disabled={anyEmpty} onClick={onLogin}>
                    Zaloguj
                </button>
            </div>

        </div>
    );
}