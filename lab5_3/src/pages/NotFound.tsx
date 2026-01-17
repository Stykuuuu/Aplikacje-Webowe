import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="card">
            <h2>404</h2>
            <Link to="/">Wróć na stronę główną</Link>
        </div>
    );
}
