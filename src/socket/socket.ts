import { io, Socket } from "socket.io-client";

const SOCKET_URL =
    import.meta.env.VITE.API_URL ||
    "http://localhost:2005";

export const socket: Socket = io(
    SOCKET_URL,
    {
        withCredentials: true,
        autoConnect: false,
    }
);