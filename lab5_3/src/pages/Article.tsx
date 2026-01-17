import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { loadArticles } from "../storage/articles";

export default function Article() {
    const params = useParams();
    const id = Number(params.id);

    const article = useMemo(() => {
        const articles = loadArticles();
        return articles.find((a) => a.id === id);
    }, [id]);

    if (!Number.isFinite(id)) {
        return (
            <div className="container">
                <div className="card">
                    <h2 style={{ marginTop: 0 }}>Błędny identyfikator artykułu</h2>
                    <Link className="btn" to="/blog">← Wróć do bloga</Link>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="container">
                <div className="card">
                    <h2 style={{ marginTop: 0 }}>Nie znaleziono artykułu</h2>
                    <div className="help">Sprawdź czy taki ID istnieje w /blog.</div>
                    <div className="sep" />
                    <Link className="btn" to="/blog">← Wróć do bloga</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div className="help">Artykuł #{article.id}</div>
                    <Link className="btn" to="/blog">← Wróć do bloga</Link>
                </div>

                <h1 className="hTitle" style={{ marginTop: 10 }}>{article.title}</h1>

                <div className="help" style={{ marginTop: -6 }}>
                    {article.body.length} znaków
                </div>

                <div className="sep" />

                <div className="prose">{article.body}</div>
            </div>
        </div>
    );
}
