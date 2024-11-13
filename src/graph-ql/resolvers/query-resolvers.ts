import { taskService } from "../../dependencies"
import { RespTask } from "../../dto/task-dto"

type TasksParams = {
    filter: number | undefined
}

function tasks(params: TasksParams, context: any): RespTask[] {
    const filter = params.filter
    return taskService.getAll(context.userId, filter)
}

type TaskParams = {
    id: number
}

function task(params: TaskParams, context: any): RespTask {
    const id = params.id
    return taskService.get(context.userId, id)
}

export { task, tasks }

