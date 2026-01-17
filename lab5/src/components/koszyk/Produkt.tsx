type ProductProps = {
    nazwa: string;
};

export default function Produkt(props: ProductProps) {
    return <div>{props.nazwa}</div>;
}