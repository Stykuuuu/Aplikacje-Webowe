import { useEffect, useState } from "react";

export type CommentUser = {
    id: number;
    username: string;
    fullName: string;
};

export type KomentarzProps = {
    id: number;
    body: string;
    postId: number;
    likes: number;
    user: CommentUser;
};

export default function Komentarz({ id, body, postId, likes, user }: KomentarzProps) {
    const [likeCount, setLikeCount] = useState(likes);

    // Przyda się w 7.2 (gdy przyjdą dane z fetcha i propsy mogą się zmieniać)
    useEffect(() => {
        setLikeCount(likes);
    }, [likes]);

    const likeUp = () => setLikeCount((prev) => prev + 1);
    const likeDown = () => setLikeCount((prev) => Math.max(0, prev - 1));

    return (
        <div
            style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 12,
                maxWidth: 600,
                margin: "12px 0",
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                    <div style={{ fontWeight: 700 }}>{user.fullName}</div>
                    <div style={{ opacity: 0.7, fontSize: 13 }}>@{user.username} • userId: {user.id}</div>
                </div>

                <div style={{ textAlign: "right", opacity: 0.7, fontSize: 13 }}>
                    <div>commentId: {id}</div>
                    <div>postId: {postId}</div>
                </div>
            </div>

            <div style={{ marginTop: 10, lineHeight: 1.4 }}>{body}</div>

            <div
                style={{
                    marginTop: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <button onClick={likeUp} style={{ cursor: "pointer" }} aria-label="Like up">
                    👍
                </button>
                <button onClick={likeDown} style={{ cursor: "pointer" }} aria-label="Like down">
                    👎
                </button>

                <div style={{ fontWeight: 600 }}>Likes: {likeCount}</div>
            </div>
        </div>
    );
}



/*import { useEffect, useState } from "react";

export type CommentUser = {
    id: number;
    username: string;
    fullName: string;
};

export type KomentarzProps = {
    id: number;
    body: string;
    postId: number;
    likes: number;
    user: CommentUser;
};

export default function Komentarz({ id, body, postId, likes, user }: KomentarzProps) {
    const [likeCount, setLikeCount] = useState(likes);
    const [dislikeCount, setDisLikeCount] = useState(likes);

    // Przyda się w 7.2 (gdy przyjdą dane z fetcha i propsy mogą się zmieniać)
    useEffect(() => {
        setLikeCount(likes);
    }, [likes]);

    const likeUp = () => setLikeCount((prev) => prev + 1);
    const likeDown = () => setDisLikeCount((prev) => prev + 1);

    return (
        <div
            style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 12,
                maxWidth: 600,
                margin: "12px 0",
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                    <div style={{ fontWeight: 700 }}>{user.fullName}</div>
                    <div style={{ opacity: 0.7, fontSize: 13 }}>@{user.username} • userId: {user.id}</div>
                </div>

                <div style={{ textAlign: "right", opacity: 0.7, fontSize: 13 }}>
                    <div>commentId: {id}</div>
                    <div>postId: {postId}</div>
                </div>
            </div>

            <div style={{ marginTop: 10, lineHeight: 1.4 }}>{body}</div>

            <div
                style={{
                    marginTop: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <button onClick={likeUp} style={{ cursor: "pointer" }} aria-label="Like up">
                    👍
                </button>
                <button onClick={likeDown} style={{ cursor: "pointer" }} aria-label="Like down">
                    👎
                </button>

                <div style={{ fontWeight: 600 }}>Likes: {likeCount}</div>
                <div style={{ fontWeight: 600 }}>Dislikes: {dislikeCount}</div>
            </div>
        </div>
    );
}
*/