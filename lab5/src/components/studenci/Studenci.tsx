interface Student {
    imie: string;
    nazwisko: string;
    rocznik: number;
}

export default function Studenci() {
    const Students: Student[] = [
        { imie: "Jan", nazwisko: "Myćko", rocznik: 2024 },
        { imie: "Wiktoria", nazwisko: "Pyćko", rocznik: 2024 },
        { imie: "Piotr", nazwisko: "Wyćko", rocznik: 2024 }
    ];

    return (
        <table>
            <thead>
            <tr>
                <th>Imię</th>
                <th>Nazwisko</th>
                <th>Rocznik</th>
            </tr>
            </thead>
            <tbody>
            {Students.map((s) => (
                <tr key={`${s.imie}-${s.nazwisko}-${s.rocznik}`}>
                    <td>{s.imie}</td>
                    <td>{s.nazwisko}</td>
                    <td>{s.rocznik}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
