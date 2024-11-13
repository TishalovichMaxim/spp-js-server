import { ReqTask, RespTask } from "../../dto/task-dto"
import { getUserId, taskExtracter, taskService } from "../../dependencies"

type TaskBaseInfo = {
    title: string
    content: string
    status: number
    completionDate: string
}

class TaskInput {
    constructor(
        public id: number,
        public title: string,
        public content: string,
        public status: number,
        public completionDate: string
    ) {
    }
}

type AddTaskParams = {
    input: TaskBaseInfo
}

function addTask(params: AddTaskParams, context: any): RespTask {
    const info = params.input
    console.log("Info: %o", info)
    console.log(`User id: ${context.userId}`)

    const reqTask = taskExtracter.extract(info)
    console.log(`Extracted task: %o`, reqTask)
    const respTask = taskService.add(getUserId(context), reqTask)
    console.log(`Response task: %o`, respTask)
    return respTask
}

type UpdateTaskParams = {
    id: number
    input: TaskBaseInfo
}

function updateTask(params: UpdateTaskParams, context: any): RespTask {
    const id = params.id
    const info = params.input

    const updateInfo = {
        id: id,
        status: info.status,
        title: info.title,
        content: info.content,
        completionDate: info.completionDate
    }

    const reqTask = taskExtracter.extract(updateInfo)
    const respTask = taskService.update(getUserId(context), reqTask)
    return respTask
}

type DeleteTaskParams = {
    id: number
}

function deleteTask(params: DeleteTaskParams, context: any): void {
    const id = params.id
    return taskService.delete(getUserId(context), id)
}

type DeleteFileParams = {
    taskId: number
    fileId: string
}

function deleteFile(params: DeleteFileParams, context: any): void {
    const taskId = params.taskId
    const fileId = params.fileId

    taskService.deleteFileInfo(getUserId(context), taskId, fileId)
}

export { addTask, updateTask, deleteTask, deleteFile }

