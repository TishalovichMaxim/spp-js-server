import { ReqTask, taskExtracter } from "../../dto/task-dto"
import { WsError } from "../ws-error"
import { taskService } from "../../dependencies"
import { WsResponseStatus } from "../message-type"

function addTaskHandler(message: any) {
    const userId: number = message.userId
    const taskField = message.task

    if (!taskField) {
        throw new WsError(
            WsResponseStatus.InvalidDataError,
            "There is no task in message"
        )
    }

    let reqTask: ReqTask
    try {
        reqTask = taskExtracter.extract(taskField)
    } catch {
        throw new WsError(
            WsResponseStatus.InvalidDataError,
            "Task contains invalid fields"
        )
    }

    return { 
        status: WsResponseStatus.Success,
        task: taskService.add(userId, reqTask)
    }
}

export { addTaskHandler }

