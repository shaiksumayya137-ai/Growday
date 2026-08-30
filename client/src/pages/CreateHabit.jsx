import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCustomHabit } from "../services/api";

function CreateHabit() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        target: "Daily",
        icon: "🌱"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            await createCustomHabit(formData);

            navigate("/my-habits");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to create habit."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        🌱
                    </div>

                    <h1>Create Your Own Habit</h1>

                    <p>
                        Build a habit that is personal to you.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <label>Habit Name</label>

                    <input
                        type="text"
                        name="name"
                        placeholder="e.g. Drink 3L of water"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <label>Description</label>

                    <input
                        type="text"
                        name="description"
                        placeholder="What do you want to achieve?"
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <label>Category</label>

                    <input
                        type="text"
                        name="category"
                        placeholder="e.g. Health, Study, Personal"
                        value={formData.category}
                        onChange={handleChange}
                    />

                    <label>Frequency</label>

                    <select
                        name="target"
                        value={formData.target}
                        onChange={handleChange}
                    >
                        <option value="Daily">
                            Daily
                        </option>

                        <option value="Weekly">
                            Weekly
                        </option>
                    </select>

                    <label>Icon</label>

                    <input
                        type="text"
                        name="icon"
                        value={formData.icon}
                        onChange={handleChange}
                        maxLength="2"
                    />

                    {error && (
                        <p className="auth-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating..."
                            : "Create Habit"}
                    </button>
                </form>
            </div>
        </main>
    );
}

export default CreateHabit;