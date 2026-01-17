import { Link } from "react-router-dom";
import { loadArticles } from "../storage/articles";

export default function Home() {
    const articles = loadArticles();
    const count = articles.length;
    const last = articles[articles.length - 1];

    return (
        <div className="container">
            <div className="card hero">
                <div>
                    <h1 className="hTitle">Witaj na blogu 👋</h1>

                    <p className="hSub">
                        Prosty blog z nawigacją (React Router) i zapisem danych w przeglądarce (LocalStorage).
                    </p>



                    <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                        <Link className="btn btnPrimary" to="/blog">Przejdź do bloga →</Link>
                        <Link className="btn" to="/dodaj">Dodaj artykuł</Link>
                    </div>
                </div>

                <div className="kpi">
                    <div className="kpiBox">
                        <div className="kpiLabel">Liczba artykułów</div>
                        <div className="kpiValue">{count}</div>
                    </div>

                    <div className="kpiBox">
                        <div className="kpiLabel">Ostatni artykuł</div>
                        <div className="kpiValue">{last ? last.title : "Brak"}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

