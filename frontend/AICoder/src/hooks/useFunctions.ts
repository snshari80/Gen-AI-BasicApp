import { createMessage } from '../utils/util';
import axios from "axios";

export async function fetchService() {
    const res = await axios.get("http://127.0.0.1:8000/health");

    if (res.status != 200) {
        throw new Error("Failed to fetch Service");
    }
    const sessionId = sessionStorage.getItem('sessionId') || null
    if (sessionId === null) {
        sessionStorage.setItem('sessionId', crypto.randomUUID())
    }
    return res.data;
}

export async function sendMessage(value: Object) {
    let messages = JSON.parse(sessionStorage.getItem("messages") || "[]");
    try {
        const res = await axios.post("http://127.0.0.1:8000/query", {
            code: value?.code,
            mode: value?.mode
        });
        if (res.status != 200) { throw new Error("Request failed"); }
        if (res.status == 200 && res.data) {
            const newMessage = createMessage(value?.code, res.data)
            messages.push(newMessage);
            sessionStorage.setItem("messages", JSON.stringify(messages));
            return messages
        }
        return res.data;
    } catch (error: any) {
        console.error(error.res?.data || error.message);
    }
}