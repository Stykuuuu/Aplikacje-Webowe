import {useState} from "react";

type Student = {
    imie: string;
    nazwisko: string;
    rocznik: number;
};

type Props = {
    onAdd: (s: Student) => void;
};
export default function Dodawanie({onAdd}: Props) {
    const [imie, setImie] = useState("");
    const [nazwisko, setNazwisko] = useState("");
    const [rocznik, setRocznik] = useState("");

    const onSubmit = () => {
        if (imie.trim() === "" || nazwisko.trim() === "" || rocznik.trim() === "") return alert("Uzupełnij pola!");
        const rok = Number(rocznik);
        if (!Number.isFinite(rok)) return alert("Podaj poprawny rok nauki!")
        const student: Student = { imie: imie.trim(), nazwisko: nazwisko.trim(), rocznik: rok };
        onAdd(student);
        setImie("");
        setNazwisko("");
        setRocznik("");
    };


    return (
        <div>
            <input value={imie} onChange={(e) => setImie(e.target.value)}/>
            <input value={nazwisko} onChange={(e) => setNazwisko(e.target.value)}/>
            <input value={rocznik} onChange={(e) => setRocznik(e.target.value)}/>
            <button onClick={onSubmit}>Dodaj</button>
        </div>
    );
}