import { WsResponseStatus } from "../message-type"
import { Socket } from "socket.io"

function logOutHandler(message: any) {
    const authSockets: Map<Socket, number> = message.authSockets
    const socket: Socket = message.socket

    authSockets.delete(socket)
    
    return {
        status: WsResponseStatus.Success,
    }
}

export { logOutHandler }

