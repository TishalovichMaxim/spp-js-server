import { Socket } from "socket.io";

function authenticate(socket: Socket, userId: number, authSockets: Map<Socket, number>) {
    authSockets.set(socket, userId)
}

export { authenticate }

