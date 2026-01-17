export default function Ternary() {
    const a = true;
    const b = false;

    return (
        <>
            <div>Stwierdzenie a {a ? "jest prawdziwe" : "jest fałszywe"}</div>
            <div>Stwierdzenie b {b ? "jest prawdziwe" : "jest fałszywe"}</div>
        </>
    );
}
