import { useEffect, useState } from "react";

export default function Odliczanie() {
    const [count, setCount] = useState(15);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        if (!running) return;

        const id = setInterval(() => {
            setCount((prev) => {
                if (prev <= 0) return 0;

                const next = Math.max(0, prev - 0.1);

                // tylko w momencie "dobicia" do zera wyłącz running
                if (next === 0 && prev > 0) {
                    setRunning(false);
                }

                return next;
            });
        }, 100);

        return () => clearInterval(id);
    }, [running]);

    const finished = count <= 0;
    const buttonText = finished ? "Odliczanie zakończone" : running ? "STOP" : "START";

    return (
        <div>
            <h2>Counter: {count.toFixed(1)}</h2>
            <button onClick={() => setRunning((p) => !p)} disabled={finished}>
                {buttonText}
            </button>
        </div>
    );
}


