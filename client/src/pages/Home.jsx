import { useEffect, useState } from "react";
import { getRecommendedHabits } from "../services/api";
import HabitCard from "../components/HabitCard";

function Home() {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHabits = async () => {
            try {
                const data = await getRecommendedHabits();
                setHabits(data);
            } catch (error) {
                console.error(error);
                setError("Unable to load recommended habits.");
            } finally {
                setLoading(false);
            }
        };

        fetchHabits();
    }, []);

    return (
        <main className="home-container">

            <header className="home-header">
                <h1>GrowDay 🌱</h1>
                <p>Build better habits. One day at a time.</p>
            </header>

            <section>
                <h2 className="habits-title">
                    Recommended Habits
                </h2>

                {loading && <p>Loading habits...</p>}

                {error && <p>{error}</p>}

                {!loading && !error && (
                    <div className="habits-grid">
                        {habits.map((habit) => (
                            <HabitCard
                                key={habit._id}
                                habit={habit}
                            />
                        ))}
                    </div>
                )}
            </section>

        </main>
    );
}

export default Home;