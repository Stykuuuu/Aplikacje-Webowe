import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Article } from "../types/article";
import { loadArticles } from "../storage/articles";

export default function Blog() {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        setArticles(loadArticles());
    }, []);

    return (
        <div className="container">
            <div className="card">
                <h2 style={{ margin: 0 }}>Blog</h2>
                <div className="help">Kliknij tytuł, aby przejść do pełnej treści.</div>
                <div className="sep" />

                {articles.length === 0 ? (
                    <div className="help">Brak artykułów</div>
                ) : (
                    <div className="grid">
                        {articles.map((a) => (
                            <Link key={a.id} className="articleCard" to={`/article/${a.id}`}>
                                <h3 className="articleTitle">{a.title}</h3>
                                <div className="articleMeta">
                                    <span>ID: {a.id}</span>
                                    <span>Otwórz →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="sep" />
                <Link className="btn" to="/dodaj">Dodaj nowy artykuł</Link>
            </div>
        </div>
    );
}
