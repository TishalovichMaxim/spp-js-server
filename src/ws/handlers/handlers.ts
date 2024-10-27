import { WsRequestType, WsResponseStatus } from "../message-type";
import { addTaskHandler } from "./add-task-handler";
import { getTasksHandler } from "./get-tasks-handler";
import { deleteTaskHandler } from "./delete-task-hander";
import { updateTaskHandler } from "./update-task-handler";
import { signInHandler } from "./sign-in-handler";
import { signUpHandler } from "./sign-up-handler";
import { WsError } from "../ws-error";
import { Socket } from "socket.io";

type WsHandler = (body: any) => void

const handlers = new Map<WsRequestType, (messageBody: any) => any>()

handlers.set(
    WsRequestType.AddTask,
    addTaskHandler
)

handlers.set(
    WsRequestType.Tasks,
    getTasksHandler
)

handlers.set(
    WsRequestType.SignIn,
    signInHandler
)

handlers.set(
    WsRequestType.SignUp,
    signUpHandler
)

handlers.set(
    WsRequestType.LogOut,
    addTaskHandler
)

handlers.set(
    WsRequestType.AttachFile,
    getTasksHandler
)

handlers.set(
    WsRequestType.DeleteTask,
    deleteTaskHandler
)

handlers.set(
    WsRequestType.UpdateTask,
    updateTaskHandler
)

handlers.set(
    WsRequestType.DeleteAttachedFile,
    getTasksHandler
)

async function defaultHandlerWithoutAuth(
    body: any,
    handler: any,
    callback: any
) {
    let resp: any

    try {
        resp = await handler(body)
    } catch (e) {
        if (e instanceof WsError) {
            callback({
                status: e.status,
                message: e.message
            })
            return
        }

        callback({
            status: WsResponseStatus.UnknownError,
            message: "Something was wrong"
        })
        return
    }

    callback(resp)
}

async function defaultHandler(
    authSockets: Map<Socket, number>,
    socket: Socket,
    body: any,
    handler: WsHandler,
    callback: any
) {

    if (!authSockets.has(socket)) {
        console.log("Request is restricted because user isn't authenticated")
        callback({
            status: WsResponseStatus.AuthenticationError,
            body: { 
                message: "Authentication required"
            },
        });
        return;
    }

    console.log("Connection is authenticated")

    body.userId = authSockets.get(socket)

    await defaultHandlerWithoutAuth(body, handler, callback)
}

export { handlers, defaultHandler, defaultHandlerWithoutAuth }

