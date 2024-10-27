import { WsError } from "../ws-error"
import { taskService } from "../../dependencies"
import { WsResponseStatus } from "../message-type"

function deleteTaskHandler(message: any) {
    const userId: number = message.userId
    const taskId = message.id

    if (!Number.isInteger(taskId)) {
        throw new WsError(
            WsResponseStatus.InvalidDataError,
            "There is no task id in message"
        )
    }

    console.log("Deleting task with id = %o", taskId)
    taskService.delete(userId, taskId)

    return { 
        status: WsResponseStatus.Success,
    }
}

export { deleteTaskHandler }

