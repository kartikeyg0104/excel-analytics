import axios from 'axios'

const SERVER = import.meta.env.VITE_SERVER_URL;

export const SignIn = async (data) => {
    try {
        const res = await axios.post(`${SERVER}/auth/login`, data);
        if (res.status == 200)
            return res.data;
    } catch (error) {
        throw error;
    }
}

export const SignUp = async (data) => {
    try {
        const res = await axios.post(`${SERVER}/auth/register`, data);
        if (res.status == 201)
            return res.data;
    } catch (error) {
        throw error;
    }
}

export const getUser = async (token) => {
    try {
        const res = await axios.get(`${SERVER}/auth`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.status == 200)
            return res.data;
    } catch (error) {
        throw error;
    }
}

export const updateUser = async (data, token) => {
    try {
        const res = await axios.put(`${SERVER}/auth`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.status == 200)
            return res.data;
    } catch (error) {
        throw error;
    }
}

