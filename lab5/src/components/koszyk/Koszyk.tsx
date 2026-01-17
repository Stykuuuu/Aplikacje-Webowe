import Produkt from "./Produkt";


export default function Koszyk() {
    return (
        <div>
            <h2>Koszyk</h2>
            <Produkt nazwa="Pizza"/>
            <Produkt nazwa="Makaron"/>
            <Produkt nazwa="Gruszka"/>
            <Produkt nazwa="Woda"/>
            <Produkt nazwa="Jabłko"/>
        </div>
    );
}