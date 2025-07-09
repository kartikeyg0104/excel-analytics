import axios from "axios";

const SERVER = import.meta.env.VITE_SERVER_URL;

export const uploadFile = async (file, token) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post(`${SERVER}/analytics/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        return res.data;
    } catch (error) {
        throw error;
    }
};
