import {useEffect, useState} from "react";

export default function Licznik() {
    const [licznik, setLicznik] = useState(0);
    useEffect(() => {
        console.log("Hello world")
    }, []);

    useEffect(() => {
        console.log(`Licznik zwiększył się do ${licznik}`);
    }, [licznik]);

    return (
        <div>
            <div>{licznik}</div>
            <button onClick={() => setLicznik(licznik => licznik + 1)}>Dodaj</button>
        </div>
    );
}