import { WsError } from "../ws-error"
import { taskService } from "../../dependencies"
import { WsResponseStatus } from "../message-type"

function deleteAttachedFile(body: any) {
    const userId: number = body.userId
    const taskId = body.taskId
    const fileId = body.fileId

    if (!Number.isInteger(taskId)) { //check here that fileId is string
        throw new WsError(
            WsResponseStatus.InvalidDataError,
            "There is no task id in message"
        )
    }

    console.log("Deleting file info with id = %o", fileId)
    taskService.deleteFileInfo(userId, taskId, fileId)

    return { 
        status: WsResponseStatus.Success,
    }
}

export { deleteAttachedFile }

