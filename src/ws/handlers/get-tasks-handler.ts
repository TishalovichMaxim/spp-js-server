import { taskService } from "../../dependencies"
import { TaskStatus } from "../../model/task"
import { WsResponseStatus } from "../message-type"
import { WsError } from "../ws-error"

function getTasksHandler(body: any) {
    const userId: number = body.userId

    const possibleFilterValues = [
        undefined,
        TaskStatus.TODO,
        TaskStatus.DONE,
        TaskStatus.IN_PROGRESS
    ]

    if (!(possibleFilterValues.includes(body.filter))) {
        throw new WsError(
            WsResponseStatus.InvalidDataError,
            "Filter is invalid"
        )
    }

    return { 
        status: WsResponseStatus.Success,
        tasks: taskService.getAll(userId, body.filter)
    }
}

export { getTasksHandler }

