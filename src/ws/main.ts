import { Server, Socket } from "socket.io"
import { defaultHandler, defaultHandlerWithoutAuth } from "./handlers/handlers"
import { getTasksHandler } from "./handlers/get-tasks-handler"
import { addTaskHandler } from "./handlers/add-task-handler"
import { updateTaskHandler } from "./handlers/update-task-handler"
import { deleteTaskHandler } from "./handlers/delete-task-hander"
import { signUpHandler } from "./handlers/sign-up-handler"
import { signInHandler } from "./handlers/sign-in-handler"
import { logOutHandler } from "./handlers/log-out-handler"
import { attachFileHandler } from "./handlers/attach-file-handler"
import { deleteAttachedFile } from "./handlers/delete-attached-file"
import { downloadFileHandler } from "./handlers/download-file-handler"

const io = new Server({
    cors: {
        origin: "http://localhost:5173"
    }
});

console.log("Right here")

const authSockets = new Map<Socket, number>()

io.on('connection', (socket) => {

    console.log("Connection opened: %s", socket.id)

    socket.on('sign-in', async (body, callback) => {
        body.socket = socket
        body.authSockets = authSockets

        await defaultHandlerWithoutAuth(
            body,
            signInHandler,
            callback
        )
    });

    socket.on('sign-up', async (body, callback) => {
        body.socket = socket
        body.authSockets = authSockets

        await defaultHandlerWithoutAuth(
            body,
            signUpHandler,
            callback
        )
    });

    socket.on('log-out', async (body, callback) => {
        body.socket = socket
        body.authSockets = authSockets

        await defaultHandlerWithoutAuth(
            body,
            logOutHandler,
            callback
        )
    });

    socket.on('get-tasks', async (body, callback) => {
        await defaultHandler(
            authSockets,
            socket,
            body,
            getTasksHandler,
            callback
        )
    });

    socket.on('add-task', async (body, callback) => {
        await defaultHandler(
            authSockets,
            socket,
            body,
            addTaskHandler,
            callback
        )
    });

    socket.on('update-task', async (body, callback) => {
        await defaultHandler(
            authSockets,
            socket,
            body,
            updateTaskHandler,
            callback
        )
    });

    socket.on('delete-task', async (body, callback) => {
        await defaultHandler(
            authSockets,
            socket,
            body,
            deleteTaskHandler,
            callback
        )
    });

    socket.on('attach-file', async (body, data, callback) => {
        body.data = data

        await defaultHandler(
            authSockets,
            socket,
            body,
            attachFileHandler,
            callback
        )
    });

    socket.on('delete-attached-file', async (body, callback) => {
        await defaultHandler(
            authSockets,
            socket,
            body,
            deleteAttachedFile,
            callback
        )
    });

    socket.on('download-file', async (body, callback) => {
        await defaultHandler(
            authSockets,
            socket,
            body,
            downloadFileHandler,
            callback
        )
    });

    socket.on("disconnect", (disconnectReason) => {
        console.log("Connection closed: %s, reason: ", socket.id, disconnectReason)
        authSockets.delete(socket)
    })

})

io.listen(process.env.WS_PORT as any)

export { authSockets }

