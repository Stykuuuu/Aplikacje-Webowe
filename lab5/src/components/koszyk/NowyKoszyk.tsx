import Produkt from "./Produkt";


export default function NowyKoszyk() {
    const Produkty = ["Pizza", "Makaron", "Woda", "Jabłko", "Gruszka"];
    return (
        <div>
            <h2>Nowy Koszyk</h2>
            { Produkty.map(produkt => <Produkt key={produkt} nazwa={produkt}/>)}
        </div>
    );
}