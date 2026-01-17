import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Article } from "../types/article";
import { loadArticles, nextId, saveArticles } from "../storage/articles";

export default function AddArticle() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const navigate = useNavigate();

    const onAdd = () => {
        const t = title.trim();
        const b = body.trim();
        if (!t || !b) return;

        const articles = loadArticles();
        const newArticle: Article = { id: nextId(articles), title: t, body: b };
        const updated = [...articles, newArticle];

        saveArticles(updated);
        navigate("/blog");
    };

    const disabled = title.trim() === "" || body.trim() === "";

    return (
        <div className="container">
            <div className="card">
                <h2 style={{ marginTop: 0 }}>Dodaj artykuł</h2>
                <div className="help">Uzupełnij tytuł oraz treść, a następnie kliknij DODAJ.</div>

                <div className="sep" />

                <div className="form">
                    <div className="field">
                        <label>Tytuł</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className="field">
                        <label>Treść</label>
                        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
                        <button className="btn" type="button" onClick={() => navigate("/blog")}>
                            Anuluj
                        </button>
                        <button className="btn btnPrimary" onClick={onAdd} disabled={disabled}>
                            DODAJ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
