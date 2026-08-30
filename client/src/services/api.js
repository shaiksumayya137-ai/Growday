import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

// Automatically attach the logged-in user's JWT
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getRecommendedHabits = async () => {
    const response = await API.get("/habits/recommended");
    return response.data;
};

export const addHabit = async (habitId) => {
    const response = await API.post("/habits/add", {
        habitId
    });

    return response.data;
};
export const createCustomHabit = async (habitData) => {
    const response = await API.post(
        "/habits/custom",
        habitData
    );

    return response.data;
};

export const getMyHabits = async () => {
    const response = await API.get("/habits/my-habits");
    return response.data;
};

export const checkInHabit = async (userHabitId) => {
    const response = await API.post(
        `/habits/check-in/${userHabitId}`
    );

    return response.data;
};

export const removeHabit = async (userHabitId) => {
    const response = await API.delete(
        `/habits/remove/${userHabitId}`
    );

    return response.data;
};

export const getStatistics = async () => {
    const response = await API.get(
        "/habits/statistics"
    );

    return response.data;
};

export default API;