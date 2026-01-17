import type { Article } from "../types/article";

const KEY = "articles";

const DEFAULT_ARTICLES: Article[] = [
    { id: 1, title: "Pierwszy artykuł", body: "To jest treść pierwszego artykułu." },
    { id: 2, title: "Drugi artykuł", body: "To jest treść drugiego artykułu." },
];

export function loadArticles(): Article[] {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return DEFAULT_ARTICLES;

        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return DEFAULT_ARTICLES;

        // minimalna walidacja struktury
        const ok = parsed.every(
            (a) =>
                typeof a === "object" &&
                a !== null &&
                typeof (a as any).id === "number" &&
                typeof (a as any).title === "string" &&
                typeof (a as any).body === "string"
        );

        return ok ? (parsed as Article[]) : DEFAULT_ARTICLES;
    } catch {
        return DEFAULT_ARTICLES;
    }
}

export function saveArticles(articles: Article[]) {
    localStorage.setItem(KEY, JSON.stringify(articles));
}

export function nextId(articles: Article[]) {
    return articles.reduce((m, a) => Math.max(m, a.id), 0) + 1;
}
