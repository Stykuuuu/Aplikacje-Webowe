import { useState } from "react";
import Przycisk from "./Przycisk";

export default function NowyLicznik() {
    const [licznik, setLicznik] = useState(0);

    return (
        <div>
            <div>{licznik}</div>
            <Przycisk onDodaj={() => setLicznik(licznik => licznik + 1)}/>
        </div>
    );
}
