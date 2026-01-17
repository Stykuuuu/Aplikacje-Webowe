import { useEffect, useState } from "react";
import Komentarz from "./Komentarz";
import type { KomentarzProps } from "./Komentarz";


type CommentsResponse = {
    comments: KomentarzProps[];
    total: number;
    skip: number;
    limit: number;
};

export default function Komentarze() {
    const [comments, setComments] = useState<KomentarzProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("https://dummyjson.com/comments")
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json() as Promise<CommentsResponse>;
            })
            .then((data) => {
                setComments(data.comments);
                setError(null);
            })
            .catch((e: unknown) => {
                setError(e instanceof Error ? e.message : "Nieznany błąd");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Ładowanie komentarzy...</div>;
    if (error) return <div>Błąd: {error}</div>;

    return (
        <div>
            <h2>Komentarze</h2>

            {comments.map((c) => (
                <Komentarz
                    key={c.id}
                    id={c.id}
                    body={c.body}
                    postId={c.postId}
                    likes={c.likes}
                    user={c.user}
                />
            ))}
        </div>
    );
}
