import {useState} from "react";
import Dodawanie from "./Dodawanie";

interface Student {
    imie: string;
    nazwisko: string;
    rocznik: number;
}
const Start: Student[] = [
    { imie: "Jan", nazwisko: "Myćko", rocznik: 2024 },
    { imie: "Wiktoria", nazwisko: "Pyćko", rocznik: 2024 },
    { imie: "Piotr", nazwisko: "Wyćko", rocznik: 2024 }
];

export default function StudentManager() {
    const [students, setStudents] = useState<Student[]>(Start);

    const addStudent = (s: Student) => {
        setStudents((prev) => [...prev, s]);
    };
    return (
        <div>
        <table>
            <thead>
            <tr>
                <th>Imię</th>
                <th>Nazwisko</th>
                <th>Rocznik</th>
            </tr>
            </thead>
            <tbody>
            {students.map((s) => (
                <tr key={`${s.imie}-${s.nazwisko}-${s.rocznik}`}>
                    <td>{s.imie}</td>
                    <td>{s.nazwisko}</td>
                    <td>{s.rocznik}</td>
                </tr>
            ))}
            </tbody>
        </table>
        <Dodawanie onAdd={addStudent}/>
        </div>
    );
}
