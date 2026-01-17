type PrzyciskProps = {
    onDodaj: () => void;
};

export default function Przycisk(props: PrzyciskProps) {
    return <button onClick={props.onDodaj}>Dodaj</button>;
}