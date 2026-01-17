import {useEffect, useState} from "react";


export default function Tytul() {
    const [tytul, setTytul] = useState("");
    useEffect(() => {
        document.title = tytul;
    }, [tytul]);

    return (
        <div>
        Zmień tytuł strony:
            <div>
                <input value={tytul} onChange={(e) => setTytul(e.target.value)}/>
            </div>
        </div>
    );
}